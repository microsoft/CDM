// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import com.microsoft.commondatamodel.objectmodel.enums.AzureCloudEndpoint;
import com.microsoft.commondatamodel.objectmodel.utilities.CdmFileMetadata;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StorageUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import com.microsoft.commondatamodel.objectmodel.utilities.network.TokenProvider;
import com.nimbusds.oauth2.sdk.util.MapUtils;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.http.client.utils.DateUtils;
import org.apache.http.entity.StringEntity;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

public class AdlsAdapter extends NetworkAdapter {
  protected static final Duration ADLS_DEFAULT_TIMEOUT = Duration.ofMillis(5000);
  static final String TYPE = "adls";

  // The MS continuation header key, used when building request url.
  private final static String HTTP_XMS_CONTINUATION = "x-ms-continuation";

  private String root;
  private String hostname;

  /**
   * The map from corpus path to adapter path.
   */
  private  Map<String, String> adapterPaths = new LinkedHashMap<String, String>();

  /**
   * The formatted hostname for validation in CreateCorpusPath.
   */
  private String formattedHostname = "";

  /**
   * The formatted hostname for validation in CreateCorpusPath.
   */
  private String formattedHostnameNoProtocol = "";

  /**
   * The blob container name of root path.
   * Leading and trailing slashes should be removed.
   * e.g. "blob-container-name"
   */
  private String rootBlobContainer = "";

  /**
   * The unescaped sub-path of root path.
   * Leading and trailing slashes should be removed.
   * e.g. "folder1/folder 2"
   */
  private String unescapedRootSubPath = "";

  /**
   * The escaped sub-path of root path.
   * Leading and trailing slashes should be removed.
   * e.g. "folder1/folder%202"
   */
  private String escapedRootSubPath = "";

  /**
   * Maximum number of items to be returned by the directory list API.
   * If omitted or greater than 5,000, the response will include up to 5,000 items.
   */
  private int httpMaxResults = 5000;

  private Map<String, OffsetDateTime> fileModifiedTimeCache = new LinkedHashMap<String, OffsetDateTime>();

  private AdlsAdapterAuthenticator adlsAdapterAuthenticator;

  public AdlsAdapter(final String hostname, final String root, final String tenant, final String clientId, final String secret) {
    this(hostname, root, tenant, clientId, secret, AzureCloudEndpoint.AzurePublic);
  }

  public AdlsAdapter(final String hostname, final String root, final String tenant, final String clientId, final String secret, final AzureCloudEndpoint endpoint) {
    this();
    this.updateRoot(root);
    this.updateHostname(hostname);
    this.adlsAdapterAuthenticator.setTenant(tenant);
    this.adlsAdapterAuthenticator.setClientId(clientId);
    this.adlsAdapterAuthenticator.setSecret(secret);
    this.adlsAdapterAuthenticator.setEndpoint(endpoint);
  }

  public AdlsAdapter(final String hostname, final String root, final String sharedKey) {
    this();
    this.updateRoot(root);
    this.updateHostname(hostname);
    this.adlsAdapterAuthenticator.setSharedKey(sharedKey);
  }

  public AdlsAdapter(final String hostname, final String root, final TokenProvider tokenProvider) {
    this();
    this.updateRoot(root);
    this.updateHostname(hostname);
    this.adlsAdapterAuthenticator.setTokenProvider(tokenProvider);
  }

  /**
   * The ADLS constructor without auth info - the auth configuration is set after the construction.
   * @param hostname Host name
   * @param root Root location
   */
  public AdlsAdapter(final String hostname, final String root) {
    this();
    this.updateRoot(root);
    this.updateHostname(hostname);
  }

  /**
   * The default constructor, a user has to apply JSON config after creating it this way.
   */
  public AdlsAdapter() {
    this.httpClient = new CdmHttpClient();
    this.setTimeout(ADLS_DEFAULT_TIMEOUT);
    this.adlsAdapterAuthenticator = new AdlsAdapterAuthenticator();
  }

  @Override
  public boolean canRead() {
    return true;
  }

  @Override
  public CompletableFuture<String> readAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final CdmHttpRequest cdmHttpRequest;
      String url = this.createFormattedAdapterPath(corpusPath);

      cdmHttpRequest = this.buildRequest(url, "GET");
      try {
        final CdmHttpResponse res = this.executeRequest(cdmHttpRequest).get();
        return (res != null) ? res.getContent() : null;
      } catch (final Exception e) {
        throw new StorageAdapterException("Could not read ADLS content at path: " + corpusPath + ". Reason: " + e.getMessage(), e);
      }
    });
  }

  @Override
  public boolean canWrite() {
    return true;
  }

  @Override
  public CompletableFuture<Void> writeAsync(final String corpusPath, final String data) {
    if (!ensurePath(root + corpusPath)) {
      throw new IllegalArgumentException("Could not create folder for document '" + corpusPath + "'");
    }

    return CompletableFuture.runAsync(() -> {
      String url = this.createFormattedAdapterPath(corpusPath);
      CdmHttpResponse response = this.createFileAtPath(corpusPath, url);

      try {
        CdmHttpRequest request = this.buildRequest(url + "?action=append&position=0", "PATCH", data, "application/json; charset=utf-8");
        response = this.executeRequest(request).get();

        if (response.getStatusCode() == 202) { // The uploaded data was accepted.
          request = this.buildRequest(url + "?action=flush&position=" +
          (new StringEntity(data, StandardCharsets.UTF_8).getContentLength()), "PATCH");
          response = this.executeRequest(request).get();
          
          if (response.getStatusCode() != 200) { // Data was not flushed correctly. Delete empty file.
            this.deleteContentAtPath(corpusPath, url, null);
            throw new StorageAdapterException(String.format("Could not write ADLS content at path, there was an issue at \"%s\" during the flush action. Reason: %s.", corpusPath, response.getReason()));
          }
        } else {
          this.deleteContentAtPath(corpusPath, url, null);
          throw new StorageAdapterException(String.format("Could not write ADLS content at path, there was an issue at \"%s\" during the append action. Reason %s.", corpusPath, response.getReason()));
        }
      } catch (final StorageAdapterException ex) {
        throw ex;
      } catch (final Exception e) {
        this.deleteContentAtPath(corpusPath, url, e);
        throw new StorageAdapterException("Could not write ADLS content at path, there was an issue at: " + corpusPath, e);
      }
    });
  }

  @Override
  public String createAdapterPath(final String corpusPath) {
    if (corpusPath == null) {
      return null;
    }

    final String formattedCorpusPath = this.formatCorpusPath(corpusPath);
    if (formattedCorpusPath == null) {
      return null;
    }

    if (adapterPaths.containsKey(formattedCorpusPath)) {
      return adapterPaths.get(formattedCorpusPath);
    }

    try {
      return "https://" + this.removeProtocolFromHostname(this.hostname) + this.getEscapedRoot() + this.escapePath(formattedCorpusPath);
    }
    catch (UnsupportedEncodingException e) {
      // Default logger is not available in adapters, send to standard stream.
      System.err.println("Could not encode corpusPath: " + corpusPath + "." + e.getMessage());
      return null;
    }
  }

  @Override
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

      if (hostname.equals(this.formattedHostnameNoProtocol) && adapterPath.substring(endIndex).startsWith(this.getEscapedRoot())) {
        String escapedCorpusPath = adapterPath.substring(endIndex + this.getEscapedRoot().length());
        String corpusPath = "";
        try {
          corpusPath = URLDecoder.decode(escapedCorpusPath, "UTF8");
        } catch (UnsupportedEncodingException e) {
          // Default logger is not available in adapters, send to standard stream.
          System.err.println("Could not decode corpus path: " + escapedCorpusPath + "." + e.getMessage());
          return null;
        }

        adapterPaths.putIfAbsent(corpusPath, adapterPath);

        return corpusPath;
      }
    }
    return null;
  }

  @Override
  public void clearCache() {
    this.fileModifiedTimeCache.clear();
  }

  @Override
  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) { 
    return CompletableFuture.supplyAsync(() -> {
      OffsetDateTime cachedValue = this.getIsCacheEnabled() ? this.fileModifiedTimeCache.get(corpusPath) : null;
      if(cachedValue != null)
      {
        return cachedValue;
      }
      else{
        String url = this.createFormattedAdapterPath(corpusPath);

        final CdmHttpRequest request = this.buildRequest(url, "HEAD");
        CdmHttpResponse cdmResponse = executeRequest(request).join();

        if (cdmResponse.getStatusCode() == HttpURLConnection.HTTP_OK) {
          OffsetDateTime lastTime = 
            DateUtils.parseDate(cdmResponse.getResponseHeaders().get("Last-Modified"))
                .toInstant()
                .atOffset(ZoneOffset.UTC);
            if(this.getIsCacheEnabled()) {
              this.fileModifiedTimeCache.put(corpusPath, lastTime);
            }
            return lastTime;
        }
        
        return null;
      }
    });
  }

  @Override
  public CompletableFuture<List<String>> fetchAllFilesAsync(final String folderCorpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final HashMap<String, CdmFileMetadata> filesMetadatas = this.fetchAllFilesMetadataAsync(folderCorpusPath).join();
      return new ArrayList<>(filesMetadatas.keySet());
    });
  }

  public CompletableFuture<HashMap<String, CdmFileMetadata>> fetchAllFilesMetadataAsync(final String folderCorpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      if (folderCorpusPath == null) {
        return null;
      }

      final String url = "https://" + this.formattedHostnameNoProtocol + "/" + this.rootBlobContainer;
      String escapedFolderCorpusPath = null;
      try {
        escapedFolderCorpusPath = this.escapePath(folderCorpusPath);
      } catch (UnsupportedEncodingException e) {
        // Default logger is not available in adapters, send to standard stream.
        System.err.println("Could not encode corpus path: " + folderCorpusPath + "." + e.getMessage());
        return null;
      }

      String directory = this.escapedRootSubPath + this.formatCorpusPath(escapedFolderCorpusPath);
      if (directory.startsWith("/")) {
        directory = directory.substring(1);
      }

      HashMap<String, CdmFileMetadata> result = new HashMap<>();
      String continuationToken = null;

      do {
        CdmHttpRequest request;

        if (continuationToken == null) {
          request = this.buildRequest(
                  url + "?directory=" + directory + "&maxResults=" + this.httpMaxResults + "&recursive=True&resource=filesystem",
                  "GET");
        } else {
          String escapedContinuationToken;
          try {
            escapedContinuationToken = URLEncoder.encode(continuationToken, "UTF8");
          } catch (UnsupportedEncodingException e) {
            // Default logger is not available in adapters, send to standard stream.
            System.err.println("Could not encode continuationToken" + continuationToken + "' for the request.");
            return result;
          }

          request = this.buildRequest(
                  url + "?continuation=" + escapedContinuationToken + "&directory=" + directory + "&maxResults=" + this.httpMaxResults + "&recursive=True&resource=filesystem",
                  "GET");
        }

        final CdmHttpResponse cdmResponse = executeRequest(request).join();

        if (cdmResponse.getStatusCode() == HttpURLConnection.HTTP_OK) {
          continuationToken = cdmResponse.getResponseHeaders().containsKey(HTTP_XMS_CONTINUATION) ?
                  cdmResponse.getResponseHeaders().get(HTTP_XMS_CONTINUATION) : null;

          final String json = cdmResponse.getContent();
          final JsonNode jObject1;
          try {
            jObject1 = JMapper.MAP.readTree(json);

            final JsonNode paths = jObject1.get("paths");

            for (final JsonNode path : paths) {
              final JsonNode isDirectory = path.get("isDirectory");
              if (isDirectory == null || !isDirectory.asBoolean()) {
                if (path.has("name")) {
                  String name = path.get("name").asText();
                  String nameWithoutSubPath = this.unescapedRootSubPath.length() > 0 && name.startsWith(this.unescapedRootSubPath)
                          ? name.substring(this.unescapedRootSubPath.length() + 1)
                          : name;
                  String filepath = this.formatCorpusPath(nameWithoutSubPath);

                  final JsonNode contentLength = path.get("contentLength");
                  result.put(filepath, new CdmFileMetadata(contentLength.asLong()));

                  OffsetDateTime lastTime = DateUtils.parseDate(path.get("lastModified").asText())
                          .toInstant()
                          .atOffset(ZoneOffset.UTC);

                  if (this.getIsCacheEnabled()) {
                    this.fileModifiedTimeCache.put(filepath, lastTime);
                  }
                }
              }
            }
          } catch (JsonProcessingException e) {
            // Default logger is not available in adapters, send to standard stream.
            System.err.println("Unable to parse response content from request.");
            return null;
          }
        }
      } while (!StringUtils.isNullOrTrimEmpty(continuationToken));

      return result;
    });
  }

  /**
   * Creates formatted adapter path with "dfs" in the url for sending requests.
   * @param corpusPath the corpus path.
   * @return the formatted adapter path
   */
  private String createFormattedAdapterPath(String corpusPath)
  {
    String adapterPath = this.createAdapterPath(corpusPath);

    return adapterPath != null ? adapterPath.replace(this.hostname, this.formattedHostname): null;
  }

  /**
   * Extracts the filesystem and sub-path from the given root value.
   * @param root The root.
   * @return the root path with leading slash.
   */
  private String extractRootBlobContainerAndSubPath(String root) {
    // No root value was set)
    if (StringUtils.isNullOrEmpty(root)) {
      this.rootBlobContainer = "";
      this.updateRootSubPath("");
      return "";
    }

    // Remove leading and trailing /
    String prepRoot = root.charAt(0) == '/' ? root.substring(1) : root;
    prepRoot = prepRoot.charAt(prepRoot.length() - 1) == '/' ? prepRoot.substring(0, prepRoot.length() - 1) : prepRoot;

    // Root contains only the file-system name, e.g. "fs-name"
    if (prepRoot.indexOf('/') == -1) {
      this.rootBlobContainer = prepRoot;
      this.updateRootSubPath("");
      return "/" + this.rootBlobContainer;
    }

    // Root contains file-system name and folder, e.g. "fs-name/folder/folder..."
    String[] prepRootArray = prepRoot.split("/");
    this.rootBlobContainer = prepRootArray[0];
    this.updateRootSubPath(Arrays.stream(prepRootArray)
        .skip(1)
        .collect(Collectors.joining("/")));

    return "/" + this.rootBlobContainer + "/" + this.unescapedRootSubPath;
  }

  /**
   * Format corpus path.
   * @param corpusPath The corpusPath.
   * @return The formatted corpus path.
   */
  private String formatCorpusPath(String corpusPath) {
    final Pair<String, String> pathTuple = StorageUtils.splitNamespacePath(corpusPath);
    if (pathTuple == null) {
      return null;
    }

    corpusPath = pathTuple.getRight();

    if (corpusPath.length() > 0 && !corpusPath.startsWith("/")) {
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
   */
  private CdmHttpRequest buildRequest(final String url, final String method, final String content, final String contentType) {
    final CdmHttpRequest request;
    try {
      if (adlsAdapterAuthenticator.getSasToken() == null) {
        Map<String, String> authenticationHeader = adlsAdapterAuthenticator.buildAuthenticationHeader(url, method, content, contentType);
        request = this.setUpCdmRequest(url, authenticationHeader, method);
      } else {
        request = this.setUpCdmRequest(adlsAdapterAuthenticator.buildSasAuthenticatedUrl(url), method);
      }
    } catch (NoSuchAlgorithmException | InvalidKeyException | URISyntaxException | UnsupportedEncodingException e) {
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
   */
  private CdmHttpRequest buildRequest(final String url, final String method) {
    return this.buildRequest(url, method, null);
  }

  private boolean ensurePath(final String pathFor) {
    // Folders don't explicitly exist in an Azure Storage FS
    return pathFor.lastIndexOf("/") != -1;
  }

  /**
   * Escape the path, including uri reserved characters.
   * e.g. "/folder 1/folder=2" -> "/folder%201/folder%3D2"
   * @param unescapedPath The unescaped original path.
   * @return The escaped path.
   */
  private String escapePath(String unescapedPath) throws UnsupportedEncodingException {
    return URLEncoder.encode(unescapedPath, "UTF8").replace("%2F", "/").replace("+", "%20");
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

    String locationHint = this.getLocationHint();
    if (locationHint != null) {
      configObject.put("locationHint", locationHint);
    }

    if (this.adlsAdapterAuthenticator.getEndpoint() != null) {
      configObject.put("endpoint", this.adlsAdapterAuthenticator.getEndpoint().toString());
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
      throw new StorageAdapterException("Root has to be set for ADLS adapter.");
    }
    if (configsJson.has("hostname")) {
      this.updateHostname(configsJson.get("hostname").asText());
    } else {
      throw new StorageAdapterException("Hostname has to be set for ADLS adapter.");
    }

    if (configsJson.has("tenant") && configsJson.has("clientId")) {
      this.adlsAdapterAuthenticator.setTenant(configsJson.get("tenant").asText());
      this.adlsAdapterAuthenticator.setClientId(configsJson.get("clientId").asText());

      // To keep backwards compatibility with config files that were generated before the introduction of the `endpoint` property.
      if (this.getEndpoint() == null) {
        this.adlsAdapterAuthenticator.setEndpoint(AzureCloudEndpoint.AzurePublic);
      }
    }

    this.setLocationHint(configsJson.has("locationHint") ? configsJson.get("locationHint").asText() : null);

    if (configsJson.has("endpoint")) {
      String endpointStr = configsJson.get("endpoint").asText();
      final com.microsoft.commondatamodel.objectmodel.enums.AzureCloudEndpoint endpoint;
      try {
        endpoint = com.microsoft.commondatamodel.objectmodel.enums.AzureCloudEndpoint.valueOf(endpointStr);
        this.adlsAdapterAuthenticator.setEndpoint(endpoint);
      } catch (IllegalArgumentException ex) {
        throw new StorageAdapterException("Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.");
      }
    }

  }

  private String getEscapedRoot() {
    return StringUtils.isNullOrEmpty(this.escapedRootSubPath) ?
            "/" + this.rootBlobContainer
            : "/" + this.rootBlobContainer + "/" + this.escapedRootSubPath;
  }

  /**
   * Check if the hostname has a leading protocol.
   * if it doesn't have, return the hostname
   * if the leading protocol is not "https://", throw an error
   * otherwise, return the hostname with no leading protocol.
   * @param hostname The hostname.
   * @return The hostname without the leading protocol "https://" if original hostname has it, otherwise it is same as hostname.
   */
  private String removeProtocolFromHostname(final String hostname) {
    if (!hostname.contains("://")) {
      return hostname;
    }

    try {
      final URL outUri = new URL(hostname);
      if (outUri.getProtocol().equals("https")) {
        return hostname.substring("https://".length());
      }
      throw new IllegalArgumentException("ADLS Adapter only supports HTTPS, please provide a leading \"https://\" hostname or a non-protocol-relative hostname.");
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException("Please provide a valid hostname.");
    }
  }

  private void updateRoot(String value) {
    this.root = this.extractRootBlobContainerAndSubPath(value);
  }

  private void updateRootSubPath(String value) {
    this.unescapedRootSubPath =  value;
    try {
      this.escapedRootSubPath = this.escapePath(this.unescapedRootSubPath);
    } catch (UnsupportedEncodingException e) {
      // Default logger is not available in adapters, send to standard stream.
      System.err.println("Exception thrown when encoding path: " + this.unescapedRootSubPath + "." + e.getMessage());
      this.escapedRootSubPath = this.unescapedRootSubPath;
    } 
  }

  public String getRoot() {
    return root;
  }

  private void updateHostname(String value) {
    if (StringUtils.isNullOrTrimEmpty(value)) {
      throw new IllegalArgumentException("Hostname cannot be null or whitespace.");
    }
    this.hostname = value;
    this.formattedHostname = this.formatHostname(this.hostname);
    this.formattedHostnameNoProtocol = this.formatHostname(this.removeProtocolFromHostname(this.hostname));
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

  public void setClientId(String clientId) {
    this.adlsAdapterAuthenticator.setClientId(clientId);
  }

  public String getSecret() {
    return this.adlsAdapterAuthenticator.getSecret();
  }

  public void setSecret(String secret) {
    this.adlsAdapterAuthenticator.setSecret(secret);
  }

  public String getSharedKey() {
    return this.adlsAdapterAuthenticator.getSharedKey();
  }

  public void setSharedKey(String sharedKey) {
    this.adlsAdapterAuthenticator.setSharedKey(sharedKey);
  }

  public String getSasToken() {
    return this.adlsAdapterAuthenticator.getSasToken();
  }

  public void setSasToken(String sasToken) {
    this.adlsAdapterAuthenticator.setSasToken(sasToken);
  }

  public TokenProvider getTokenProvider() {
    return this.adlsAdapterAuthenticator.getTokenProvider();
  }

  public void setTokenProvider(TokenProvider tokenProvider) {
    this.adlsAdapterAuthenticator.setTokenProvider(tokenProvider);
  }

  public int getHttpMaxResults() {
    return this.httpMaxResults;
  }

  public void setHttpMaxResults(int value) {
    this.httpMaxResults = value;
  }

  public com.microsoft.commondatamodel.objectmodel.enums.AzureCloudEndpoint getEndpoint() {
    return this.adlsAdapterAuthenticator.getEndpoint();
  }

  public void setEndpoint(final com.microsoft.commondatamodel.objectmodel.enums.AzureCloudEndpoint endpoint) {
    this.adlsAdapterAuthenticator.setEndpoint(endpoint);
  }

  /**
   * Deletes ADLS file at the given path.
   * @param corpusPath filename to be deleted.
   * @param url full path of object to be deleted.
   * @param Exception inner exception.
   */
  private void deleteContentAtPath(final String corpusPath, final String url, final Exception innerException) {
    if (this.getCtx() == null || MapUtils.isEmpty(this.getCtx().getFeatureFlags()) 
      || this.getCtx().getFeatureFlags().getOrDefault("ADLSAdapter_deleteEmptyFile", true).equals(true)) {
      try {
        this.executeRequest(this.buildRequest(url, "DELETE")).get();
        return; // Return on delete success. Throw exception even if delete succeeds since file write operation failed.
      } catch (final InterruptedException | ExecutionException ex) {}
    }
    
    throw new StorageAdapterException("Empty file was created but could not write ADLS content at path: " + corpusPath, innerException);
  }

  /**
   * Creates ADLS file at the given path.
   * @param corpusPath filename to be created.
   * @param url full path of object to be created.
   */
  private CdmHttpResponse createFileAtPath(final String corpusPath, final String url) {
    try {
      CdmHttpRequest request = this.buildRequest(url + "?resource=file", "PUT");
      CdmHttpResponse response = this.executeRequest(request).get();
      if (response.getStatusCode() != 201) { // Empty file was not created successfully.
        throw new StorageAdapterException(String.format("Could not write ADLS content at path, response code: %s. Reason: %s.", response.getStatusCode(), response.getReason()));
      }
      return response;
    } catch (final InterruptedException | ExecutionException e) {
      throw new StorageAdapterException("Could not write ADLS content at path, there was an issue at: " + corpusPath, e);
    }
  }

}
