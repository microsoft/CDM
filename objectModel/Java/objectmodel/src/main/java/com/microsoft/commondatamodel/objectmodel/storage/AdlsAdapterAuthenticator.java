// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.microsoft.aad.msal4j.AzureCloudEndpoint;
import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ClientCredentialParameters;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import com.microsoft.aad.msal4j.IClientCredential;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
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
import java.util.Collections;
import java.util.Set;

/**
 * AdlsAdapterAuthenticator handles authentication items for ADLS requests.
 */
class AdlsAdapterAuthenticator {
  private static final String HMAC_SHA256 = "HmacSHA256";
  // The authorization header key, used during shared key auth.
  private static final String HTTP_AUTHORIZATION = "Authorization";
  // The MS date header key, used during shared key auth.
  private static final String HTTP_XMS_DATE = "x-ms-date";
  // The MS version key, used during shared key auth.
  private static final String HTTP_XMS_VERSION = "x-ms-version";
  // The default scope.
  private final static Set<String> SCOPE = Collections.singleton("https://storage.azure.com/.default");

  private String sharedKey;
  private String tenant;
  private String clientId;
  private String secret;
  private ConfidentialClientApplication context;
  private String sasToken;
  private IAuthenticationResult lastAuthenticationResult;
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
   */
  Map<String, String> buildAuthenticationHeader(
      final String url,
      final String method,
      final String content,
      final String contentType)
          throws NoSuchAlgorithmException, InvalidKeyException, URISyntaxException, UnsupportedEncodingException {
    if (sharedKey != null) {
      return buildAuthenticationHeaderWithSharedKey(url, method, content, contentType);
    } else if (tokenProvider != null) {
      final Map<String, String> header = new LinkedHashMap<>();
      header.put("authorization", tokenProvider.getToken());
      return header;
    } else if (clientId != null && tenant != null && secret != null) {
      return buildAuthenticationHeaderWithClientIdAndSecret();
    } else {
      throw new StorageAdapterException("ADLS adapter is not configured with any auth method");
    }
  }

  /**
   * Appends SAS token to the given URL.
   * @param url URL to be appended with the SAS token
   * @return URL with the SAS token appended
   */
  String buildSasAuthenticatedUrl(String url) {
    return url + (url.contains("?") ? "&" : "?") + sasToken;
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
    if (!StringUtils.isNullOrEmpty(uri.getQuery())) {
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

    header.put("authorization", "Bearer " + this.lastAuthenticationResult.accessToken());
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
    return this.lastAuthenticationResult.expiresOnDate().before(now);
  }

  /**
   * Refresh the authentication token.
   */
  private void refreshToken() {
    this.buildContext();
    IAuthenticationResult result;
    try {
      ClientCredentialParameters parameters = ClientCredentialParameters.builder(SCOPE).build();
      result = this.context.acquireToken(parameters).join();
    } catch (Exception ex) {
        throw new StorageAdapterException("There was an error while acquiring ADLS Adapter's Token with client ID/secret authentication. Exception: ", ex);
    }

    if (result == null || result.accessToken() == null) {
      throw new StorageAdapterException("Received invalid ADLS Adapter's authentication result. The result might be null, or missing access token from the authentication result.");
    }
    this.lastAuthenticationResult = result;
  }

  /**
   * Build context when users make the first call. Also need to ensure client Id, tenant and secret are not null.
   */
  private void buildContext() {
    if (this.context == null) {
      IClientCredential credential = ClientCredentialFactory.createFromSecret(this.secret);
      try {
        this.context = ConfidentialClientApplication
                .builder(this.clientId, credential)
                .authority(AzureCloudEndpoint.AzurePublic.endpoint + this.tenant)
                .build();
      } catch (MalformedURLException e) {
        throw new StorageAdapterException("There was an error while building context. Exception: ", e);
      }
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

  String getSasToken() {
    return sasToken;
  }

  /**
   * Sets the SAS token. If supplied string begins with '?' symbol, the symbol gets stripped away.
   * @param sasToken The SAS token
   */
  void setSasToken(String sasToken) {
    this.sasToken = sasToken != null ?
            (sasToken.startsWith("?") ? sasToken.substring(1) : sasToken)
            : null;
  }

  TokenProvider getTokenProvider() {
    return tokenProvider;
  }

  void setTokenProvider(TokenProvider tokenProvider) {
    this.tokenProvider = tokenProvider;
  }
}
