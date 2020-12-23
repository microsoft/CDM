// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.google.common.base.Strings;
import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.aad.adal4j.AuthenticationResult;
import com.microsoft.aad.adal4j.ClientCredential;
import com.microsoft.commondatamodel.objectmodel.utilities.network.TokenProvider;
import org.apache.commons.codec.binary.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * It is used for handling authentication items for ADLS requests.
 */
class AdlsAdapterAuthenticator {
  private static final String HMAC_SHA256 = "HmacSHA256";
  // The authorization header key, used during shared key auth.
  private static final String HTTP_AUTHORIZATION = "Authorization";
  // The MS date header key, used during shared key auth.
  private static final String HTTP_XMS_DATE = "x-ms-date";
  // The MS version key, used during shared key auth.
  private static final String HTTP_XMS_VERSION = "x-ms-version";

  private String sharedKey;
  private String tenant;
  private String clientId;
  private String secret;
  private AuthenticationResult lastAuthenticationResult;
  private TokenProvider tokenProvider;

  AdlsAdapterAuthenticator() {
    this.sharedKey = null;
    this.clientId = null;
    this.secret = null;
    this.tenant = null;
    this.tokenProvider = null;
  }

  /**
   * Build a ADLS request's authentication header
   * @param url The url of the request
   * @param method The method of the request
   * @param content The content of the request
   * @param contentType The contentType of the request
   * @return The authentication headers
   * @throws NoSuchAlgorithmException
   * @throws InvalidKeyException
   * @throws URISyntaxException
   */
  Map<String, String> buildAuthenticationHeader(
      final String url,
      final String method,
      final String content,
      final String contentType)
      throws NoSuchAlgorithmException, InvalidKeyException, URISyntaxException, UnsupportedEncodingException {
    if (sharedKey != null) {
      return buildAuthenticationHeaderWithSharedKey(url, method, content, contentType);
    } else if (this.tokenProvider != null) {
      final Map<String, String> header = new LinkedHashMap<>();
      header.put("authorization", this.tokenProvider.getToken());
      return header;
    }

    return buildAuthenticationHeaderWithClientIdAndSecret();
  }

  /**
   * Returns the authentication headers with the applied shared key.
   * @param url The URL with query parameters sorted lexicographically.
   * @param method The HTTP method.
   * @param content The string content.
   * @param contentType The content type.
   * @return The authentication headers
   */
  private Map<String, String> buildAuthenticationHeaderWithSharedKey(
      final String url,
      final String method,
      final String content,
      final String contentType)
      throws URISyntaxException, NoSuchAlgorithmException, InvalidKeyException, UnsupportedEncodingException {
    final Map<String, String> headers = new LinkedHashMap<>();

    // Add UTC now time and new version.
    headers.put(HTTP_XMS_DATE, DateTimeFormatter.RFC_1123_DATE_TIME.format(ZonedDateTime.now(ZoneOffset.ofHours(0))));
    headers.put(HTTP_XMS_VERSION, "2018-06-17");
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
    builder.append(contentType != null ? contentType : "").append("\n"); // Content-type.
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
    builder.append(uri.getRawPath());
    // Append canonicalized queries.
    if (!Strings.isNullOrEmpty(uri.getQuery())) {
      final String queryParameters = uri.getRawQuery();
      final String[] queryParts = queryParameters.split("&");
      for(final String item : queryParts) {
        final String[] keyValuePair = item.split("=");
        String queryName = keyValuePair[0].toLowerCase();
        String decodedValue = URLDecoder.decode(keyValuePair[1], "UTF-8");
        builder.append("\n").append(queryName).append(":").append(decodedValue);
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
   * Build a ADLS request's authentication header with clientId and secret
   * @return The authentication header
   */
  private Map<String, String> buildAuthenticationHeaderWithClientIdAndSecret() {
    final Map<String, String> header = new LinkedHashMap<>();
    if (this.needsRefreshToken()) {
      this.refreshToken();
    }

    header.put("authorization", this.lastAuthenticationResult.getAccessTokenType() + " " + this.lastAuthenticationResult.getAccessToken());
    return header;
  }

  /**
   * If need to refresh authentication token or not.
   * @return If need to refresh authentication token or not.
   */
  private boolean needsRefreshToken() {
    if (lastAuthenticationResult == null) {
      return true;
    }

    Date now = new Date();
    return this.lastAuthenticationResult.getExpiresOnDate().before(now);
  }

  /**
   * Refresh the authentication token.
   */
  private void refreshToken() {
    ExecutorService executorService = Executors.newFixedThreadPool(10);
    AuthenticationContext authenticationContext = null;
    try {
      authenticationContext = new AuthenticationContext("https://login.windows.net/" + this.tenant,
          true,
          executorService);
      final ClientCredential clientCredentials = new ClientCredential(this.clientId, this.secret);

      this.lastAuthenticationResult = authenticationContext.acquireToken("https://storage.azure.com", clientCredentials, null).get();
    } catch (MalformedURLException | InterruptedException | ExecutionException e) {
      throw new StorageAdapterException("Failed to refresh AdlsAdapter's token", e);
    } finally {
      executorService.shutdown();
    }
  }

  String getSharedKey() {
    return sharedKey;
  }

  void setSharedKey(String sharedKey) {
    this.sharedKey = sharedKey;
  }

  String getTenant() {
    return tenant;
  }

  void setTenant(String tenant) {
    this.tenant = tenant;
  }

  String getClientId() {
    return clientId;
  }

  void setClientId(String clientId) {
    this.clientId = clientId;
  }

  String getSecret() {
    return secret;
  }

  void setSecret(String secret) {
    this.secret = secret;
  }

  TokenProvider getTokenProvider() {
    return tokenProvider;
  }

  void setTokenProvider(TokenProvider tokenProvider) {
    this.tokenProvider = tokenProvider;
  }
}
