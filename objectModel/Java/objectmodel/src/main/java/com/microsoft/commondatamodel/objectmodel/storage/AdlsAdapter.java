// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequestException;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import com.microsoft.commondatamodel.objectmodel.utilities.network.TokenProvider;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.http.client.utils.DateUtils;
import org.apache.http.entity.StringEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AdlsAdapter extends NetworkAdapter implements StorageAdapter {
  static final String TYPE = "adls";
  private final static Logger LOGGER = LoggerFactory.getLogger(AdlsAdapter.class);

  private String root;
  private String hostname;
  private String locationHint;

  /**
   * The map from corpus path to adapter path.
   */
  private  Map<String, String> adapterPaths = new LinkedHashMap<String, String>();

  /**
   * The file-system name.
   */
  private String fileSystem = "";

  /**
   * The formated hostname for validation in CreateCorpusPath.
   */
  private String formatedHostname = "";

  /**
   * The sub-path.
   */
  private String subPath = "";
  private AdlsAdapterAuthenticator adlsAdapterAuthenticator;


  public AdlsAdapter(final String hostname, final String root, final String tenant, final String clientId, final String secret) {
    this.updateRoot(root);
    this.updateHostname(hostname);
    this.httpClient = new CdmHttpClient();
    this.adlsAdapterAuthenticator = new AdlsAdapterAuthenticator(tenant, clientId, secret);
  }

  public AdlsAdapter(final String hostname, final String root, final String sharedKey) {
    this.updateRoot(root);
    this.updateHostname(hostname);
    this.httpClient = new CdmHttpClient();
    this.adlsAdapterAuthenticator = new AdlsAdapterAuthenticator(sharedKey);
  }

  public AdlsAdapter(final String hostname, final String root, final TokenProvider tokenProvider) {
    this.updateRoot(root);
    this.updateHostname(hostname);
    this.httpClient = new CdmHttpClient();
    this.adlsAdapterAuthenticator = new AdlsAdapterAuthenticator(tokenProvider);
  }

  /**
   * The default constructor, a user has to apply JSON config after creating it this way.
   */
  public AdlsAdapter() {
    this.httpClient = new CdmHttpClient();
  }

  public boolean canRead() {
    return true;
  }

  public CompletableFuture<String> readAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final CdmHttpRequest cdmHttpRequest;
      final String url = this.createAdapterPath(corpusPath);
      cdmHttpRequest = this.buildRequest(url, "GET");
      try {
        final CdmHttpResponse res = this.executeRequest(cdmHttpRequest).get();
        return (res != null) ? res.getContent() : null;
      } catch (final Exception e) {
        throw new StorageAdapterException("Could not read ADLS content at path: " + corpusPath, e);
      }
    });
  }

  public boolean canWrite() {
    return true;
  }

  public CompletableFuture<Void> writeAsync(final String corpusPath, final String data) {
    if (!ensurePath(root + corpusPath)) {
      throw new IllegalArgumentException("Could not create folder for document '" + corpusPath + "'");
    }
    return CompletableFuture.runAsync(() -> {
      final String url = this.createAdapterPath(corpusPath);
      try {
        CdmHttpRequest request = this.buildRequest(url + "?resource=file", "PUT");
        this.executeRequest(request).get();

        request = this.buildRequest(url + "?action=append&position=0", "PATCH", data, "application/json; charset=utf-8");
        this.executeRequest(request).get();

        request = this.buildRequest(url + "?action=flush&position=" +
            (new StringEntity(data, "UTF-8").getContentLength()), "PATCH");
        this.executeRequest(request).get();
      } catch (final InterruptedException | ExecutionException e) {
        throw new StorageAdapterException("Could not write ADLS content at path, there was an issue at: " + corpusPath, e);
      }
    });
  }

  public String createAdapterPath(final String corpusPath) {
    final String formattedCorpusPath = this.formatCorpusPath(corpusPath);
    if(adapterPaths.containsKey(formattedCorpusPath)) {
      return adapterPaths.get(formattedCorpusPath);
    }
    return "https://" + hostname + root + this.formatCorpusPath(corpusPath);
  }

  public String createCorpusPath(final String adapterPath) {
    if (!StringUtils.isNullOrEmpty(adapterPath))
    {
      int startIndex = "https://".length();
      int endIndex = adapterPath.indexOf('/', startIndex + 1);

      String hostname = "";
      try {
        hostname = this.formatHostname(adapterPath.substring(startIndex, endIndex));
      } catch(Exception ex){
        throw new StorageAdapterException("Unexpected adapter path: " + adapterPath);
      }

      if (hostname.equals(this.formatedHostname) && adapterPath.substring(endIndex).startsWith(this.root))
      {
        String corpusPath = adapterPath.substring(endIndex + this.root.length());
        adapterPaths.putIfAbsent(corpusPath, adapterPath);

        return corpusPath;
      }
    }
    return null;
  }

  public void clearCache() {
  }

  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final String url = this.createAdapterPath(corpusPath);

      try {
        final CdmHttpRequest request = this.buildRequest(url, "HEAD");
        CdmHttpResponse cdmResponse = executeRequest(request).join();

        if (cdmResponse.getStatusCode() == HttpURLConnection.HTTP_OK) {
          return DateUtils.parseDate(cdmResponse.getResponseHeaders().get("Date"))
              .toInstant()
              .atOffset(ZoneOffset.UTC);
        }
      } catch (CdmHttpRequestException ex) {
        LOGGER.debug("ADLS file not found, skipping last modified time calculation for it.", ex);
      }
      return null;
    });
  }

  public CompletableFuture<List<String>> fetchAllFilesAsync(final String folderCorpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final String url = "https://" + this.hostname + "/" + this.fileSystem;
      String directory = this.subPath + this.formatCorpusPath(folderCorpusPath);
      if (directory.startsWith("/")) {
        directory = directory.substring(1);
      }
      final CdmHttpRequest request =
          this.buildRequest(
              url + "?directory=" + directory + "&recursive=True&resource=filesystem",
              "GET");
      final CdmHttpResponse cdmResponse = executeRequest(request).join();

      if (cdmResponse.getStatusCode() == HttpURLConnection.HTTP_OK) {
        final String json = cdmResponse.getContent();
        final JsonNode jObject1;
        try {
          jObject1 = JMapper.MAP.readTree(json);

          final JsonNode paths = jObject1.get("paths");

          List<String> result = new ArrayList<>();
          for (final JsonNode path : paths) {
            final JsonNode isDirectory = path.get("isDirectory");
            if (isDirectory == null || !isDirectory.asBoolean()) {
              if (path.has("name")) {
                String name = path.get("name").asText();
                String nameWithoutSubPath = this.subPath.length() > 0 && name.startsWith(this.subPath)
                    ? name.substring(this.subPath.length() + 1)
                    : name;
                result.add(this.formatCorpusPath(nameWithoutSubPath));
              }
            }
          }
          return result;
        } catch (JsonProcessingException e) {
          LOGGER.error("Unable to parse response content from request.");
          return null;
        }
      }

      return null;
    });
  }

  /**
   * Extracts the filesystem and sub-path from the given root value.
   * @param root The root
   * @return A {@link Pair} of extracted filesystem name (left), the extracted sub-path (right)
   */
  private void extractFilesystemAndSubPath(String root) {
    // No root value was set)
    if (Strings.isNullOrEmpty(root)) {
      this.fileSystem = "";
      this.subPath = "";
      return;
    }

    // Remove leading /
    String prepRoot = root.charAt(0) == '/' ? root.substring(1) : root;

    // Root contains only the file-system name, e.g. "fs-name"
    if (prepRoot.indexOf('/') == -1) {
      this.fileSystem = prepRoot;
      this.subPath = "";
      return;
    }

    // Root contains file-system name and folder, e.g. "fs-name/folder/folder..."
    String[] prepRootArray = prepRoot.split("/");
    this.fileSystem = prepRootArray[0];
    this.subPath = Arrays.stream(prepRootArray)
        .skip(1)
        .collect(Collectors.joining("/"));
  }

  /**
   * Format corpus path.
   * @param corpusPath The corpusPath.
   * @return The formatted corpus path.
   */
  private String formatCorpusPath(String corpusPath) {
    final String adls = "adls:";
    if (corpusPath.startsWith(adls)) {
      corpusPath = corpusPath.substring(adls.length());
    } else if (corpusPath.length() > 0 && !corpusPath.startsWith("/")) {
      corpusPath = "/" + corpusPath;
    }

    return corpusPath;
  }

  /**
   * Format hostname for the validation in CreateCorpusPath.
   * @param hostname The hostname.
   * @return The formatted hostname.
   */
  private String formatHostname(String hostname) {
    hostname = hostname.replace(".blob.", ".dfs.");
    String port=":443";
    if (hostname.contains(port))
    {
      hostname = hostname.substring(0, hostname.length()- port.length());
    }

    return hostname;
  }

  /**
   * Generates an HTTP request with required headers to work with Azure Storage API.
   *
   * @param url         The URL of a resource.
   * @param method      The type of an HTTP request.
   * @param content     The string content.
   * @param contentType The content type.
   * @return The constructed CDM HTTP request.
   * @throws InterruptedException
   * @throws ExecutionException
   */
  private CdmHttpRequest buildRequest(final String url, final String method, final String content, final String contentType) {
    final CdmHttpRequest request;
    try {
      Map<String, String> authenticationHeader = adlsAdapterAuthenticator.buildAuthenticationHeader(url, method, content, contentType);
      request = this.setUpCdmRequest(url, authenticationHeader, method);
    } catch (NoSuchAlgorithmException | InvalidKeyException | URISyntaxException e) {
      throw new StorageAdapterException("Failed to build request", e);
    }
    if (content != null) {
      request.setContent(content);
      request.setContentType(contentType);
    }
    return request;
  }

  /**
   * Generates an HTTP request with required headers to work with Azure Storage API.
   *
   * @param url         The URL of a resource.
   * @param method      The type of an HTTP request.
   * @param content     The string content.
   * @return The constructed CDM HTTP request.
   * @throws InterruptedException
   * @throws ExecutionException
   */
  private CdmHttpRequest buildRequest(final String url, final String method, final String content) {
    return this.buildRequest(url, method, content, null);
  }

  /**
   * Generates an HTTP request with required headers to work with Azure Storage API.
   *
   * @param url         The URL of a resource.
   * @param method      The type of an HTTP request.
   * @return The constructed CDM HTTP request.
   * @throws InterruptedException
   * @throws ExecutionException
   */
  private CdmHttpRequest buildRequest(final String url, final String method) {
    return this.buildRequest(url, method, null);
  }

  private boolean ensurePath(final String pathFor) {
    // Folders don't explicitly exist in an Azure Storage FS
    return pathFor.lastIndexOf("/") != -1;
  }

  @Override
  public void setLocationHint(final String locationHint) {
    this.locationHint = locationHint;
  }

  @Override
  public String getLocationHint() {
    return this.locationHint;
  }

  @Override
  public String fetchConfig() {
    final ObjectNode resultConfig = JsonNodeFactory.instance.objectNode();
    resultConfig.put("type", TYPE);
    final ObjectNode configObject = JsonNodeFactory.instance.objectNode();
    configObject.put("hostname", this.hostname);
    configObject.put("root", this.root);

    // Check for clientId auth, we won't write shared key or secrets to JSON.
    if (this.adlsAdapterAuthenticator.getClientId() != null && this.adlsAdapterAuthenticator.getTenant() != null) {
      configObject.put("tenant", this.adlsAdapterAuthenticator.getTenant());
      configObject.put("clientId", this.adlsAdapterAuthenticator.getClientId());
    }
    // Try constructing network configs.
    for (final Map.Entry<String, JsonNode> stringJsonNodeEntry : this.fetchNetworkConfig().entrySet()) {
      configObject.set(stringJsonNodeEntry.getKey(), stringJsonNodeEntry.getValue());
    }

    if (this.locationHint != null) {
      configObject.put("locationHint", this.locationHint);
    }
    resultConfig.set("config", configObject);
    try {
      return JMapper.WRITER.writeValueAsString(resultConfig);
    } catch (final JsonProcessingException e) {
      throw new StorageAdapterException("Failed to construct config string", e);
    }
  }

  @Override
  public void updateConfig(final String config) throws IOException {
    if (config == null) {
      throw new StorageAdapterException("ADLS adapter needs a config.");
    }
    this.updateNetworkConfig(config);
    final JsonNode configsJson = JMapper.MAP.readTree(config);
    if (configsJson.has("root")) {
      this.updateRoot(configsJson.get("root").asText());
    } else {
      throw new RuntimeException("Root has to be set for ADLS adapter.");
    }
    if (configsJson.has("hostname")) {
      this.hostname = configsJson.get("hostname").asText();
    } else {
      throw new RuntimeException("Hostname has to be set for ADLS adapter.");
    }
    if (configsJson.has("sharedKey")) {
      // Then it is shared key auth.
      this.adlsAdapterAuthenticator = new AdlsAdapterAuthenticator(configsJson.get("sharedKey").asText());
    } else if (configsJson.has("tenant") && configsJson.has("clientId")) {
      // Check first for clientId/secret auth.
      this.adlsAdapterAuthenticator = new AdlsAdapterAuthenticator(
          configsJson.get("tenant").asText(),
          configsJson.get("clientId").asText(),
          configsJson.has("secret") ? configsJson.get("secret").asText() : null);
    }
    this.locationHint = configsJson.has("locationHint") ? configsJson.get("locationHint").asText() : null;
  }

  private void updateRoot(String value) {
    this.root = value;
    this.extractFilesystemAndSubPath(this.root);
  }

  public String getRoot() {
    return root;
  }

  private void updateHostname(String value) {
    this.hostname = value;
    this.formatedHostname = this.formatHostname(this.hostname);
  }

  public String getHostname() {
    return hostname;
  }

  public String getTenant() {
    return this.adlsAdapterAuthenticator.getTenant();
  }

  public String getClientId() {
    return this.adlsAdapterAuthenticator.getClientId();
  }

  public String getSecret() {
    return this.adlsAdapterAuthenticator.getSecret();
  }

  public String getSharedKey() {
    return this.adlsAdapterAuthenticator.getSharedKey();
  }
}
