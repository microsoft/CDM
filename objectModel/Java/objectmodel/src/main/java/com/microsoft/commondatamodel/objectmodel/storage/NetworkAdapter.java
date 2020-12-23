// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequestException;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Network adapter is an abstract class that contains logic for adapters dealing with data across network.
 * Please see GithubAdapter, AdlsAdapter or RemoteAdapter for usage of this class.
 * When extending this class a user has to define CdmHttpClient with the specified endpoint and callback function in the constructor
 * and can then use the class helper methods to set up Cdm HTTP requests and read data.
 * If a user doesn't specify timeout, maximutimeout or number of retries in the config under 'httpConfig' property
 * default values will be used as specified in the class.
 */
public abstract class NetworkAdapter extends StorageAdapterBase {
  // Use some default values in the case a user doesn't set them up.
  protected static final Duration DEFAULT_TIMEOUT = Duration.ofMillis(5000);
  private static final Duration DEFAULT_MAXIMUM_TIMEOUT = Duration.ofMillis(20000);
  private static final int DEFAULT_NUMBER_OF_RETRIES = 2;
  private static final int DEFAULT_SHORTEST_TIME_WAIT = 500;
  protected CdmHttpClient httpClient;
  protected Duration timeout = DEFAULT_TIMEOUT;
  protected Duration maximumTimeout = DEFAULT_MAXIMUM_TIMEOUT;
  protected int numberOfRetries = DEFAULT_NUMBER_OF_RETRIES;
  protected CdmHttpClient.Callback waitTimeCallback = NetworkAdapter::defaultCallback;

  public CdmHttpClient getHttpClient() {
    return httpClient;
  }

  public void setHttpClient(CdmHttpClient httpClient) {
    this.httpClient = httpClient;
  }

  public Duration getTimeout() {
    return timeout;
  }

  public void setTimeout(Duration timeout) {
    this.timeout = timeout;
  }

  public Duration getMaximumTimeout() {
    return maximumTimeout;
  }

  public void setMaximumTimeout(Duration maximumTimeout) {
    this.maximumTimeout = maximumTimeout;
  }

  public int getNumberOfRetries() {
    return numberOfRetries;
  }

  public void setNumberOfRetries(int numberOfRetries) {
    this.numberOfRetries = numberOfRetries < 0 ? DEFAULT_NUMBER_OF_RETRIES : numberOfRetries;
  }

  public CdmHttpClient.Callback getWaitTimeCallback() {
    return waitTimeCallback;
  }

  public void setWaitTimeCallback(CdmHttpClient.Callback waitTimeCallback) {
    this.waitTimeCallback = waitTimeCallback;
  }

  /**
   * Sets up the CDM request that can be used by CDM Http Client.
   *
   * @param path    The partial or full path to a network location.
   * @param headers The headers.
   * @param method  The method.
   * @return A CdmHttpRequest object, representing the CDM Http request.
   */
  CdmHttpRequest setUpCdmRequest(final String path, final Map<String, String> headers, final String method) {
    final CdmHttpRequest cdmHttpRequest = new CdmHttpRequest(path, numberOfRetries);
    final Map<String, String> internalHeaders = headers != null ? headers : new LinkedHashMap<>();
    cdmHttpRequest.setHeaders(internalHeaders);
    cdmHttpRequest.setTimeout(this.timeout);
    cdmHttpRequest.setMaximumTimeout(this.maximumTimeout);
    cdmHttpRequest.setNumberOfRetries(this.numberOfRetries);
    cdmHttpRequest.setMethod(method);
    return cdmHttpRequest;
  }

  CompletableFuture<CdmHttpResponse> executeRequest(final CdmHttpRequest request) {
    return CompletableFuture.supplyAsync(() -> {
      try {
        final CdmHttpResponse response = this.httpClient.sendAsync(request, this.waitTimeCallback, this.getCtx()).get();
        if (response == null) {
          return null;
        }
        if (!response.isSuccessful()) {
          throw new CdmHttpRequestException(
              String.format("HTTP %d - %s. Response headers: %s. URL: %s",
                  response.getStatusCode(),
                  response.getReason(),
                  response.getResponseHeaders()
                      .entrySet()
                      .stream()
                      .map(entry -> entry + entry.getKey() + ":" + entry.getValue())
                      .collect(Collectors.joining(",")),
                  request.getRequestedUrl()
              )
          );
        }
        return response;
      } catch (final InterruptedException | ExecutionException ex) {
        throw new RuntimeException(ex);
      }
    });
  }

  /**
   * Callback function for a CDM Http client, it does exponential backoff.
   *
   * @param response    The response received by system's Http client.
   * @param hasFailed   Denotes whether the request has failed (usually an exception or 500 error).
   * @param retryNumber The current retry number (starts from 1) up to the number of retries specified by CDM request.
   * @return A duration object, specifying the waiting time, or null if no wait time is necessary.
   */
  private static Duration defaultCallback(final CdmHttpResponse response, final boolean hasFailed, final int retryNumber) {
    if (response != null && response.isSuccessful() && !hasFailed) {
      return null;
    } else {
      final Random random = new Random();
      // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
      final int waitTime = random.nextInt(1 << retryNumber) * DEFAULT_SHORTEST_TIME_WAIT;
      return Duration.ofMillis(waitTime);
    }
  }

  public void updateNetworkConfig(final String config) {
    JsonNode configsJson = null;
    try {
      configsJson = JMapper.MAP.readTree(config);
    } catch (final IOException e) {
      throw new StorageAdapterException("Cannot convert config to JsonNode", e);
    }
    if (configsJson.has("timeout")) {
      this.timeout = Duration.ofMillis(configsJson.get("timeout").asLong());
    }
    if (configsJson.has("maximumTimeout")) {
      this.maximumTimeout = Duration.ofMillis(configsJson.get("maximumTimeout").asLong());
    }
    if (configsJson.has("numberOfRetries")) {
      this.numberOfRetries = configsJson.get("numberOfRetries").asInt();
    }
  }

  /**
   * Constructs the network configs.
   *
   * @return A Map of String and JsonNode containing the network specific properties.
   */
  protected Map<String, JsonNode> fetchNetworkConfig() {
      final Map<String, JsonNode> config = new LinkedHashMap<>();
      config.put("timeout", JsonNodeFactory.instance.numberNode(this.timeout.toMillis()));
      config.put("maximumTimeout", JsonNodeFactory.instance.numberNode(this.maximumTimeout.toMillis()));
      config.put("numberOfRetries", JsonNodeFactory.instance.numberNode(this.numberOfRetries));
      return config;
  }
}
