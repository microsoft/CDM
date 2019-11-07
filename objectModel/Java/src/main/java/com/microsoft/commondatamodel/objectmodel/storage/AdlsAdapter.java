package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.aad.adal4j.AuthenticationResult;
import com.microsoft.aad.adal4j.ClientCredential;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.entity.StringEntity;

public class AdlsAdapter extends NetworkAdapter implements StorageAdapter {
  static final String TYPE = "adls";
  private static final String HMAC_SHA256 = "HmacSHA256";
  // The authorization header key, used during shared key auth.
  private static final String HTTP_AUTHORIZATION = "Authorization";
  // The MS date header key, used during shared key auth.
  private static final String HTTP_XMS_DATE = "x-ms-date";
  // The MS version key, used during shared key auth.
  private static final String HTTP_XMS_VERSION = "x-ms-version";
  private AuthenticationContext context;
  private String root;
  private String hostname;
  private String tenant;
  private String clientId;
  private String resource = "https://storage.azure.com";
  private String secret;
  private String sharedKey;
  private String locationHint;

  public AdlsAdapter(final String hostname, final String root, final String tenant, final String clientId, final String secret) throws MalformedURLException {
    this.root = root;
    this.hostname = hostname;
    this.tenant = tenant;
    this.clientId = clientId;
    this.secret = secret;
    final ExecutorService execService = Executors.newFixedThreadPool(10);
    this.context = new AuthenticationContext("https://login.windows.net/" + this.tenant,
        true, execService);
    this.httpClient = new CdmHttpClient();

    this.sharedKey = null;
  }

  public AdlsAdapter(final String hostname, final String root, final String sharedKey) {
    this.root = root;
    this.hostname = hostname;
    this.sharedKey = sharedKey;
    this.httpClient = new CdmHttpClient();

    this.tenant = null;
    this.clientId = null;
    this.secret = null;
    this.context = null;
  }

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
      try {
        cdmHttpRequest = this.buildRequest(url, "GET");
      } catch (final InterruptedException | ExecutionException e) {
        throw new StorageAdapterException("Could not read ADLS content at path, an issue with headers: "
                + corpusPath, e);
      }
      try {
        final CdmHttpResponse res = this.readOrWrite(cdmHttpRequest).get();
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
        this.readOrWrite(request).get();

        request = this.buildRequest(url + "?action=append&position=0", "PATCH", data, "application/json; charset=utf-8");
        this.readOrWrite(request).get();

        request = this.buildRequest(url + "?action=flush&position=" +
            (new StringEntity(data, "UTF-8").getContentLength()), "PATCH");
        this.readOrWrite(request).get();
      } catch (final InterruptedException | ExecutionException e) {
        throw new StorageAdapterException("Could not read ADLS content at path, there was an issue at: " + corpusPath, e);
      }
    });
  }

  public String createAdapterPath(final String corpusPath) {
    return "https://" + hostname + root + corpusPath;
  }

  public String createCorpusPath(final String adapterPath) {
    final String prefix = "https://" + hostname + root;
    if (adapterPath.startsWith(prefix)) {
      return adapterPath.substring(prefix.length());
    }
    return null;
  }

  public void clearCache() {
  }

  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) {
    return CompletableFuture.completedFuture(null);
  }

  public CompletableFuture<List<String>> fetchAllFilesAsync(final String folderCorpusPath) {
    return CompletableFuture.completedFuture(null);
  }

  private Future<AuthenticationResult> generateBearerToken() {
    final ClientCredential clientCredentials = new ClientCredential(clientId, secret);
    return context.acquireToken(resource, clientCredentials, null);
  }

  /**
   * Returns the headers with the applied shared key.
   * @param sharedKey The account/shared key.
   * @param url The URL.
   * @param method The HTTP method.
   * @param content The string content.
   * @param contentType The content type.
   * @return
   */
  private Map<String, String> applySharedKey(final String sharedKey, final String url, final String method, final String content, final String contentType) throws NoSuchAlgorithmException, InvalidKeyException, URISyntaxException {
    final Map<String, String> headers = new LinkedHashMap<>();

    // Add UTC now time and new version.
    headers.put(AdlsAdapter.HTTP_XMS_DATE, DateTimeFormatter.RFC_1123_DATE_TIME.format(ZonedDateTime.now(ZoneOffset.ofHours(0))));
    headers.put(AdlsAdapter.HTTP_XMS_VERSION, "2018-06-17");
    int contentLength = 0;
    if (content != null) {
      contentLength = content.getBytes().length;
    }
    final URI uri = new URI(url);
    final StringBuilder builder = new StringBuilder();
    builder.append(method).append("\n"); // Verb.yi
    builder.append("\n"); // Content-Encoding.
    builder.append("\n"); // Content-Language.
    builder.append((contentLength != 0) ? contentLength : "").append("\n"); // Content length.
    builder.append("\n"); // Content-md5.
    builder.append(contentType != null ? contentType : "").append("\n");//$"{contentType}; charset=utf-8\n" :"\n"); // Content-type.
    builder.append("\n"); // Date.
    builder.append("\n"); // If-modified-since.
    builder.append("\n"); // If-match.
    builder.append("\n"); // If-none-match.
    builder.append("\n"); // If-unmodified-since.
    builder.append("\n"); // Range.
    for (final Map.Entry<String, String> header : headers.entrySet()) {
      builder.append(header.getKey()).append(":").append(header.getValue()).append("\n");
    }
    // Append canonicalized resource.
    final String accountName = uri.getHost().split("\\.")[0];
    builder.append("/").append(accountName);
    builder.append(uri.getPath());
    // Append canonicalized queries.
    if (!Strings.isNullOrEmpty(uri.getQuery())) {
      final String queryParameters = uri.getQuery();
      final String[] queryParts = queryParameters.split("&");
      for(final String item : queryParts) {
        final String[] keyValuePair = item.split("=");
        builder.append("\n").append(keyValuePair[0]).append(":").append(keyValuePair[1]);
      }
    }

    final Mac sha256_HMAC = Mac.getInstance(HMAC_SHA256);
    final SecretKeySpec secret_key = new SecretKeySpec(Base64.decodeBase64(sharedKey.getBytes()), HMAC_SHA256);
    sha256_HMAC.init(secret_key);

    final String hash = Base64.encodeBase64String(sha256_HMAC.doFinal(builder.toString().getBytes(StandardCharsets.UTF_8)));

    headers.put(HTTP_AUTHORIZATION, "SharedKey " + accountName + ":" + hash);
    return headers;
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
  private CdmHttpRequest buildRequest(final String url, final String method, final String content, final String contentType) throws ExecutionException, InterruptedException {
    final CdmHttpRequest request;
    // Check whether we support shared key or clientId/secret auth.
    if (this.sharedKey != null) {
      try {
        request = this.setUpCdmRequest(url, applySharedKey(this.sharedKey, url, method, content, contentType), method);
      } catch (final NoSuchAlgorithmException | InvalidKeyException | URISyntaxException e) {
        throw new StorageAdapterException(e.getLocalizedMessage());
      }
    } else {
      final AuthenticationResult token = this.generateBearerToken().get();
      final Map<String, String> header = new HashMap<>();
      header.put("authorization", token.getAccessTokenType() + " " + token.getAccessToken());
      request = this.setUpCdmRequest(url, header, method);
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
  private CdmHttpRequest buildRequest(final String url, final String method, final String content)
      throws InterruptedException, ExecutionException {
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
  private CdmHttpRequest buildRequest(final String url, final String method)
      throws InterruptedException, ExecutionException {
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
    if (this.clientId != null && this.tenant != null) {
      configObject.put("tenant", this.tenant);
      configObject.put("clientId", this.clientId);
    }
    // Try constructing network configs.
    for (final Map.Entry<String, JsonNode> stringJsonNodeEntry : this.fetchNetworkConfig().entrySet()) {
      configObject.set(stringJsonNodeEntry.getKey(), stringJsonNodeEntry.getValue());
    }

    if (this.locationHint != null)
    {
      configObject.put("locationHint", this.locationHint);
    }
    resultConfig.set("config", configObject);
    try {
      return JMapper.MAP.writeValueAsString(resultConfig);
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
      this.root = configsJson.get("root").asText();
    } else {
      throw new RuntimeException("Root has to be set for ADLS adapter.");
    }
    if (configsJson.has("hostname")) {
      this.hostname = configsJson.get("hostname").asText();
    } else {
      throw new RuntimeException("Hostname has to be set for ADLS adapter.");
    }
    // Check first for clientId/secret auth.
    if (configsJson.has("tenant") && configsJson.has("clientId")) {
      this.tenant = configsJson.get("tenant").asText();
      this.clientId = configsJson.get("clientId").asText();
      // Check for a secret, we don't really care is it there, but it is nice if it is.
      this.secret = configsJson.has("secret") ? configsJson.get("secret").asText() : null;
    }
    // Check then for shared key auth.
    this.sharedKey = configsJson.has("sharedKey") ? configsJson.get("sharedKey").asText() : null;
    this.locationHint = configsJson.has("locationHint") ? configsJson.get("locationHint").asText() : null;
    this.context = this.tenant != null
        ? new AuthenticationContext("https://login.windows.net/" + this.tenant,
        true,
        Executors.newFixedThreadPool(10))
        : null;
  }
}
