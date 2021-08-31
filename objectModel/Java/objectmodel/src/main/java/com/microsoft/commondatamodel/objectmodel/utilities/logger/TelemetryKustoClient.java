// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.enums.EnvironmentType;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequestException;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.CompletableFuture;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

public class TelemetryKustoClient implements TelemetryClient {

  /**
   * Maximum number of retries allowed for an HTTP request.
   */
  private int maxNumRetries = 5;

  /**
   * Maximum timeout for completing an HTTP request including retries.
   */
  private int maxTimeoutMilliseconds = 10000;

  /**
   * Maximum timeout for a single HTTP request.
   */
  private int timeoutMilliseconds = 1000;

  /**
   * The CDM corpus context.
   */
  private CdmCorpusContext ctx;

  /**
   * Kusto configuration.
   */
  private TelemetryConfig config;

  /**
   * Queuing all log ingestion request to Kusto.
   */
  private ConcurrentLinkedQueue<ImmutablePair<CdmStatusLevel, String>> requestQueue;

  /**
   * An HTTP client for post requests which ingests data into Kusto.
   */
  private CdmHttpClient httpClient;

  /**
   * Kusto data ingestion command.
   */
  private static final String INGESTION_COMMAND = ".ingest inline into table";

  /**
   * The frequency in millisecond by which to check and ingest the request queue.
   */
  private static final int INGESTION_FREQUENCY = 500;

  /**
   * The time in millisecond to pause sending http request when throttling.
   */
  private static final int BACKOFF_FOR_THROTTLING = 200;

  /**
   * A list of methods whose execution time info to be logged into Kusto database.
   */
  private static final ArrayList<String> LOG_EXEC_TIME_METHODS = new ArrayList<String>() {
    {
      add("createResolvedEntityAsync");
      add("calculateEntityGraphAsync");
      add("calculateEntityGraphAsync(perEntity)");
    }
  };

  /**
   * Constructs a telemetry client for ingesting logs into Kusto.
   * 
   * @param ctx The CDM corpus context.
   * @param config The configuration for the client.
   */
  public TelemetryKustoClient(final CdmCorpusContext ctx, final TelemetryConfig config) {
    this.ctx = ctx;
    this.config = config;

    this.httpClient = new CdmHttpClient();
    this.requestQueue = new ConcurrentLinkedQueue<ImmutablePair<CdmStatusLevel, String>>();
  }

  /**
   * Enqueue the request queue with the information to be logged into Kusto.
   * 
   * @param timestamp The log timestamp.
   * @param level Logging status level.
   * @param className Usually the class that is calling the method.
   * @param method Usually denotes method calling this method.
   * @param corpusPath Usually denotes corpus path of document.
   * @param message Informational message.
   * @param requireIngestion Whether the log needs to be ingested.
   * @param code Error or warning code
   */
  public void addToIngestionQueue(final String timestamp, final CdmStatusLevel level, 
    final String className, final String method, String corpusPath, String message, 
    final boolean requireIngestion, final CdmLogCode code) {

    // Check if the Kusto config and the concurrent queue has been initialized
    if (this.config == null || this.requestQueue == null) {
      return;
    }

    // Not ingest logs from telemetry client to avoid cycling
    if (className.equals(TelemetryKustoClient.class.getSimpleName())) {
      return;
    }

    // If ingestion is not required and the level is Progress
    if (level == CdmStatusLevel.Progress && !requireIngestion) {
      // If the execution time needs to be logged
      if (LOG_EXEC_TIME_METHODS.contains(method)) {
        // Check if the log contains execution time info
        final String execTimeMessage = "Leaving scope. Time Elapsed:";

        // Skip if the log is not for execution time
        if (!message.startsWith(execTimeMessage)) {
          return;
        }
      }

      // Skip if the method execution time doesn't need to be logged
      else {
        return;
      }
    }

    // Configured in case no user-created content can be ingested into Kusto due to compliance issue
    // Note: The RemoveUserContent property could be deleted in the if the compliance issue gets resolved
    if (this.config.getRemoveUserContent()) {
      corpusPath = null;

      if (level == CdmStatusLevel.Warning || level == CdmStatusLevel.Error) {
        message = null;
      }
    }

    final String logEntry = this.processLogEntry(timestamp, className, method, message, code, corpusPath,
      this.ctx.getCorrelationId(), this.ctx.getEvents().getApiCorrelationId(), this.ctx.getCorpus().getAppId());

    // Add the status level and log entry to the queue to be ingested
    this.requestQueue.add(new ImmutablePair<CdmStatusLevel,String>(level, logEntry));
  }

  /**
   * Check if all the requests have been ingested.
   * 
   * @return A Boolean indicating whether the queue is empty or not.
   */
  public boolean checkRequestQueueIsEmpty() {
    if (this.requestQueue == null || this.requestQueue.peek() == null) {
      return true;
    }

    return false;
  }

  /**
   * Enable the telemetry client by starting a thread for ingestion
   */
  public void enable() {
    // Check if the Kusto config and the concurrent queue has been initialized
    if (this.config == null || this.requestQueue == null)
    {
      final String message = "The telemetry client has not been initialized";
      Logger.warning(this.ctx, TelemetryKustoClient.class.getSimpleName(), "enable", null, CdmLogCode.WarnTelemetryIngestionFailed, message);
      return;
    }

    Runnable ingestionRunnable = new Runnable() {
      @Override
      public void run() {
        ingestRequestQueue().join();
      }
    };

    // Starts a separate thread to ingest telemetry logs into Kusto
    Thread ingestionThread = new Thread(ingestionRunnable);

    // The thread will terminate when the foreground thread terminates
    ingestionThread.setDaemon(true);

    ingestionThread.start();
  }

  /**
   * Get an authorization token and send the query to Kusto.
   * 
   * @param query The Kusto query command to be posted to the cluster.
   */
  public CompletableFuture<Void> postKustoQuery(final String query) {
    return CompletableFuture.runAsync(() -> {
      final String authToken = this.config.getAuthenticationToken();

      final String queryEndpoint = String.format("https://%s.kusto.windows.net/v1/rest/mgmt", this.config.getKustoClusterName());
      final String kustoHost = String.format("%s.kusto.windows.net", this.config.getKustoClusterName());
      final String queryBody = String.format("{\"db\":\"%s\",\"csl\":\"%s\"}", this.config.getKustoDatabaseName(), query);

      final Map<String, String> headers = new LinkedHashMap<>();
      headers.put("Accept", "application/json");
      headers.put("Authorization", authToken);
      headers.put("Host", kustoHost);

      final CdmHttpRequest httpRequest = new CdmHttpRequest(queryEndpoint, this.maxNumRetries, "POST");
      httpRequest.setHeaders(headers);
      httpRequest.setContent(queryBody);
      httpRequest.setContentType("application/json");

      httpRequest.setTimeout(Duration.ofMillis(this.getTimeoutMilliseconds()));
      httpRequest.setMaximumTimeout(Duration.ofMillis(this.getMaxTimeoutMilliseconds()));

      final CdmHttpResponse response = this.httpClient.sendAsync(httpRequest, this::getRetryWaitTime, this.ctx).join();

      if (response == null) {
        throw new CdmHttpRequestException("Kusto query post failed. The result of a request is undefined.");
      }

      if (!response.isSuccessful()) {
        throw new CdmHttpRequestException
                (String.format("Kusto query post failed. HTTP %s - %s.", response.getStatusCode(), response.getReason()));
      }
    });
  }

  /**
   * A callback function for http request retries.
   * 
   * @param response CDM Http response.
   * @param hasFailed Indicates whether the request has failed.
   * @param retryNumber The number of retries happened.
   * 
   * @return The wait time before starting the next retry.
   */
  private Duration getRetryWaitTime(final CdmHttpResponse response, final boolean hasFailed, final int retryNumber) {
    if (response != null && ((response.isSuccessful() && !hasFailed))) {
      return null;
    }
    
    else {
      // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
      final Random random = new Random();
      final int waitTime = random.nextInt(1 << retryNumber) * BACKOFF_FOR_THROTTLING;
      return Duration.ofMillis(waitTime);
    }
  }

  /**
   * Ingest log entries into the table specified.
   * 
   * @param logTable The table to be ingested into.
   * @param logEntries Batched log entries.
   */
  private CompletableFuture<Void> ingestIntoTable(final String logTable, final String logEntries) {
    return CompletableFuture.runAsync(() -> {
      // Ingest only if the entries are not empty
      if (!StringUtils.isNullOrEmpty(logEntries)) {
        final String query = String.format("%s %s <|\n%s", INGESTION_COMMAND, logTable, logEntries);

        try {
          postKustoQuery(query).join();
        } catch (Exception ex) {
          Logger.info(ctx, TelemetryKustoClient.class.getSimpleName(), "ingestIntoTable", null, ex.getMessage());
        }
      }
    });
  }

  /**
   * Check periodically and ingest all the logs existing in the request queue.
   */
  private CompletableFuture<Void> ingestRequestQueue() {
    return CompletableFuture.runAsync(() -> {
      while (true) {
        // Dequeue and send the ingestion request if the queue is not empty
        if (this.requestQueue.peek() != null) {
          // Batch log entries for each table
          String infoLogEntries = "";
          String warningLogEntries = "";
          String errorLogEntries = "";

          while (this.requestQueue.peek() != null) {
            // Dequeue the first request in the queue
            final Pair<CdmStatusLevel, String> request = this.requestQueue.poll();
            final String logEntry = request.getRight();

            switch (request.getLeft()) {
              case Progress:
                infoLogEntries += logEntry;
                break;
              case Warning:
                warningLogEntries += logEntry;
                break;
              case Error:
                errorLogEntries += logEntry;
                break;
              default: 
                break;
            }
          }

          // Ingest logs into corresponding tables in the Kusto database
          if (this.ctx != null && this.config != null) {
            if (!StringUtils.isNullOrEmpty(infoLogEntries)) {
              this.ingestIntoTable(this.config.getKustoInfoLogTable(), infoLogEntries).join();
            }

            if (!StringUtils.isNullOrEmpty(warningLogEntries)) {
              this.ingestIntoTable(this.config.getKustoWarningLogTable(), warningLogEntries).join();
            }

            if (!StringUtils.isNullOrEmpty(errorLogEntries)) {
              this.ingestIntoTable(this.config.getKustoErrorLogTable(), errorLogEntries).join();
            }
          }
        }

        try {
          // Check the queue at some frequency
          Thread.sleep(INGESTION_FREQUENCY);
        } catch (Exception ex) {
          Logger.info(ctx, TelemetryKustoClient.class.getSimpleName(), "ingestRequestQueue", null, ex.getMessage());
        }
      }
    });
  }

  /**
   * Process the input log information to remove all unauthorized information.
   * 
   * @param timestamp The log timestamp.
   * @param className Usually the class that is calling the method.
   * @param method Usually denotes method calling this method.
   * @param message Informational message.
   * @param logCode Error code, usually empty.
   * @param corpusPath Usually denotes corpus path of document.
   * @param correlationId The corpus correlation id.
   * @param apiCorrelationId The method correlation id.
   * @param appId The app id assigned by user.
   * 
   * @return A complete log entry.
   */
  private String processLogEntry(final String timestamp, final String className, final String method, String message,
    final CdmLogCode logCode, String corpusPath, final String correlationId, final UUID apiCorrelationId, final String appId) {

    // Remove user created contents
    if (this.config.getIngestAtLevel() == EnvironmentType.PROD
      || this.config.getIngestAtLevel() == EnvironmentType.TEST) {
      corpusPath = null;
    }

    if (message == null) {
      message = "";
    }

    // Remove all commas from message to ensure the correct syntax of Kusto query
    message = message.replace(",", ";");
    final String code = logCode.toString();

    // Additional properties associated with the log
    final Map<String, String> property = new LinkedHashMap<>();

    // Additional properties associated with the log
    property.put("Environment", this.config.getIngestAtLevel().toString());
    property.put("SDKLanguage", "Java");
    property.put("Region", this.config.getRegion());
    final String propertyJson = serializeMap(property);

    return String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
      timestamp, className, method, message, code, corpusPath, correlationId, apiCorrelationId, appId, propertyJson);
  }

  /**
   * Serialize the map and return a string.
   * 
   * @param map The map object to be serialized.
   * 
   * @return The serialized map.
   */
  private static String serializeMap(final Map<String, String> map) {
    final StringBuilder mapAsString = new StringBuilder();

    for (final String key : map.keySet()) {
      mapAsString.append(key + ":" + map.get(key) + ";");
    }
    
    return mapAsString.toString();
  }

  /**
   * Getters and setters
   */

  public int getMaxNumRetries() {
    return this.maxNumRetries;
  }

  public void setMaxNumRetries(final int maxNumRetries) {
    this.maxNumRetries = maxNumRetries;
  }

  public int getMaxTimeoutMilliseconds() {
    return this.maxTimeoutMilliseconds;
  }

  public void setMaxTimeoutMilliseconds(final int maxTimeoutMilliseconds) {
    this.maxTimeoutMilliseconds = maxTimeoutMilliseconds;
  }

  public int getTimeoutMilliseconds() {
    return this.timeoutMilliseconds;
  }

  public void setTimeoutMilliseconds(final int timeoutMilliseconds) {
    this.timeoutMilliseconds = timeoutMilliseconds;
  }
}
