// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
    using System;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;

    /// <summary>
    /// Kusto client for telemetry ingestion
    /// </summary>
    public class TelemetryKustoClient : TelemetryClient
    {
        /// <summary>
        /// Maximum number of retries allowed for an HTTP request
        /// </summary>
        public int MaxNumRetries { get; set; } = 5;

        /// <summary>
        /// Maximum timeout for completing an HTTP request including retries
        /// </summary>
        public int MaxTimeoutMilliseconds { get; set; } = 10000;

        /// <summary>
        /// Maximum timeout for a single HTTP request
        /// </summary>
        public int TimeoutMilliseconds { get; set; } = 1000;

        /// <summary>
        /// CDM corpus context
        /// </summary>
        private CdmCorpusContext ctx;

        /// <summary>
        /// Kusto configuration
        /// </summary>
        private TelemetryConfig config;

        /// <summary>
        /// Queuing all log ingestion request to Kusto
        /// </summary>
        private ConcurrentQueue<Tuple<CdmStatusLevel, string>> requestQueue;

        /// <summary>
        /// An HTTP client for post requests which ingests data into Kusto
        /// </summary>
        private readonly CdmHttpClient httpClient;

        /// <summary>
        /// Kusto data ingestion command
        /// </summary>
        private const string ingestionCommand = ".ingest inline into table ";

        /// <summary>
        /// The frequency in millisecond by which to check and ingest the request queue
        /// </summary>
        private const int ingestionFrequency = 500;

        /// <summary>
        /// The time in millisecond to pause sending http request when throttling
        /// </summary>
        private const int backoffForThrottling = 200;

        /// <summary>
        /// A list of methods whose execution time info to be logged into Kusto database
        /// </summary>
        private static readonly List<string> logExecTimeMethods = new List<string>()
        {
            nameof(CdmEntityDefinition.CreateResolvedEntityAsync),
            nameof(CdmCorpusDefinition.CalculateEntityGraphAsync),
            $"{nameof(CdmCorpusDefinition.CalculateEntityGraphAsync)}(perEntity)"
        };


        /// <summary>
        /// Construct a telemetry client for ingesting logs into Kusto
        /// </summary>
        /// <param name="ctx">CDM corpus context</param>
        /// <param name="config">The configuration for the client</param>
        public TelemetryKustoClient(CdmCorpusContext ctx, TelemetryConfig config)
        {
            this.ctx = ctx;
            this.config = config;

            this.httpClient = new CdmHttpClient();
            this.requestQueue = new ConcurrentQueue<Tuple<CdmStatusLevel, string>>();
        }

        /// <summary>
        /// Enqueue the request queue with the information to be logged
        /// </summary>
        /// <param name="timestamp">The log timestamp</param>
        /// <param name="level">Logging status level</param>
        /// <param name="className">Usually the class that is calling the method</param>
        /// <param name="method">Usually denotes method calling this method</param>
        /// <param name="corpusPath">Usually denotes corpus path of document</param>
        /// <param name="message">Informational message</param>
        /// <param name="requireIngestion">(Optional) Whether the log needs to be ingested</param>
        /// <param name="code">(Optional) Error or warning code</param>
        public void AddToIngestionQueue(string timestamp, CdmStatusLevel level,
            string className, string method, string corpusPath, string message,
            bool requireIngestion = false, CdmLogCode code = CdmLogCode.None)
        {
            // Check if the Kusto config and the concurrent queue has been initialized
            if (this.config == null || this.requestQueue == null)
            {
                return;
            }

            // Not ingest logs from telemetry client to avoid cycling
            if (className == nameof(TelemetryKustoClient))
            {
                return;
            }

            // If ingestion is not required and the level is Progress
            if (level == CdmStatusLevel.Progress && !requireIngestion)
            {
                // If the execution time needs to be logged
                if (logExecTimeMethods.Contains(method))
                {
                    // Check if the log contains execution time info
                    string execTimeMessage = "Leaving scope. Time elapsed:";

                    // Skip if the log is not for execution time
                    if (!message.StartsWith(execTimeMessage))
                    {
                        return;
                    }
                }

                // Skip if the method execution time doesn't need to be logged
                else
                {
                    return;
                }
            }

            // Configured in case no user-created content can be ingested into Kusto due to compliance issue
            // Note: The RemoveUserContent property could be deleted in the if the compliance issue gets resolved
            if (this.config.RemoveUserContent)
            {
                corpusPath = null;
                if (level == CdmStatusLevel.Warning || level == CdmStatusLevel.Error)
                {
                    message = null;
                }
            }

            string logEntry = ProcessLogEntry(timestamp, className, method, message, code, corpusPath,
                this.ctx.CorrelationId, this.ctx.Events.ApiCorrelationId, this.ctx.Corpus.AppId);

            // Add the status level and log entry to the queue to be ingested
            this.requestQueue.Enqueue(new Tuple<CdmStatusLevel, string>(level, logEntry));
        }

        /// <summary>
        /// Check if all the requests have been ingested
        /// </summary>
        /// <returns>A Boolean indicating whether the queue is empty or not</returns>
        public bool CheckRequestQueueIsEmpty()
        {
            if (this.requestQueue == null || this.requestQueue.IsEmpty)
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Enable CDM telemetry by starting the thread for ingestion
        /// </summary>
        public void Enable()
        {
            // Check if the Kusto config and the concurrent queue has been initialized
            if (this.config == null || this.requestQueue == null)
            {
                string message = "The telemetry client has not been initialized";
                Logger.Info(ctx, nameof(TelemetryKustoClient), nameof(Enable), null, message);
                return;
            }

            // Starts a separate thread to ingest telemetry logs into Kusto
            Thread ingestionThread = new Thread(async () => { await IngestRequestQueue(); })
            {
                // The thread will terminate when the foreground thread terminates
                IsBackground = true
            };

            ingestionThread.Start();
        }

        /// <summary>
        /// Get an authorization token and send the query to Kusto
        /// </summary>
        /// <param name="query">The Kusto query command to be posted to the cluster</param>
        public async Task PostKustoQuery(string query)
        {
            string authToken = await this.config.GetAuthenticationToken();

            string queryEndpoint = $"https://{this.config.KustoClusterName}.kusto.windows.net/v1/rest/mgmt";
            string kustoHost = $"{this.config.KustoClusterName}.kusto.windows.net";
            string queryBody = $"{{\"db\":\"{this.config.KustoDatabaseName}\",\"csl\":\"{query}\"}}";

            Dictionary<string, string> headers = new Dictionary<string, string>()
            {
                { "Accept", "application/json" },
                { "Authorization", authToken},
                { "Host", kustoHost }
            };

            var httpRequest = new CdmHttpRequest(queryEndpoint)
            {
                Method = HttpMethod.Post,

                Headers = headers,
                Content = queryBody,
                ContentType = "application/json",

                NumberOfRetries = MaxNumRetries,
                Timeout = TimeSpan.FromMilliseconds(TimeoutMilliseconds),
                MaximumTimeout = TimeSpan.FromMilliseconds(MaxTimeoutMilliseconds)
            };

            CdmHttpResponse response = await httpClient.SendAsync(httpRequest, GetRetryWaitTime, this.ctx);

            if (response == null)
            {
                throw new HttpRequestException
                    ($"Kusto query post failed. The result of a request is undefined.");
            }

            if (!response.IsSuccessful)
            {
                throw new HttpRequestException
                    ($"Kusto query post failed. HTTP {response.StatusCode} - {response.Reason}.");
            }
        }

        /// <summary>
        /// A callback function for http request retries
        /// </summary>
        /// <param name="response">Http response</param>
        /// <param name="hasFailed">Indicates whether the request has failed</param>
        /// <param name="retryNumber">The number of retries happened</param>
        /// <returns>The wait time before starting the next retry</returns>
        private TimeSpan? GetRetryWaitTime(CdmHttpResponse response, bool hasFailed, int retryNumber)
        {
            if (response != null && (response.IsSuccessful && !hasFailed))
            {
                return null;
            }
            else
            {
                // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
                Random random = new Random();
                double waitTime = random.Next(1 << retryNumber) * backoffForThrottling;
                return TimeSpan.FromMilliseconds(waitTime);
            }
        }

        /// <summary>
        /// Ingest log entries into the table specified
        /// </summary>
        /// <param name="logTable">the table to be ingested into</param>
        /// <param name="logEntries">batched log entries</param>
        private async Task IngestIntoTable(string logTable, string logEntries)
        {
            // Ingest only if the entries are not empty
            if (!string.IsNullOrEmpty(logEntries))
            {
                string query = $"{ingestionCommand}{logTable} <|\n{logEntries}";

                try
                {
                    await PostKustoQuery(query);
                }
                catch (Exception ex)
                {
                    Logger.Warning(this.ctx, nameof(TelemetryKustoClient), nameof(IngestIntoTable), null, CdmLogCode.WarnTelemetryIngestionFailed, ex.Message);
                }
            }
        }

        /// <summary>
        /// Check periodically and ingest all the logs existing in the request queue
        /// </summary>
        private async Task IngestRequestQueue()
        {
            while (true)
            {
                // Dequeue and send the ingestion request if the queue is not empty
                if (!this.requestQueue.IsEmpty)
                {
                    // Batch log entries for each table
                    string infoLogEntries = null;
                    string warningLogEntries = null;
                    string errorLogEntries = null;

                    // Try to dequeue the first request in the queue
                    while (this.requestQueue.TryDequeue(out Tuple<CdmStatusLevel, string> request))
                    {
                        string logEntry = request.Item2;

                        switch (request.Item1)
                        {
                            case CdmStatusLevel.Progress:
                                infoLogEntries += logEntry;
                                break;
                            case CdmStatusLevel.Warning:
                                warningLogEntries += logEntry;
                                break;
                            case CdmStatusLevel.Error:
                                errorLogEntries += logEntry;
                                break;
                        }
                    }

                    // Ingest logs into corresponding tables in the Kusto database
                    if (this.ctx != null && this.config != null)
                    {
                        if (!string.IsNullOrEmpty(infoLogEntries))
                        {
                            await IngestIntoTable(this.config.KustoInfoLogTable, infoLogEntries);
                        }

                        if (!string.IsNullOrEmpty(warningLogEntries))
                        {
                            await IngestIntoTable(this.config.KustoWarningLogTable, warningLogEntries);
                        }

                        if (!string.IsNullOrEmpty(errorLogEntries))
                        {
                            await IngestIntoTable(this.config.KustoErrorLogTable, errorLogEntries);
                        }
                    }
                }

                // Check the queue at some frequency
                Thread.Sleep(TimeSpan.FromMilliseconds(ingestionFrequency));
            }
        }

        /// <summary>
        /// Process the input log information to remove all unauthorized information
        /// </summary>
        /// <param name="className">usually the class that is calling the method</param>
        /// <param name="method">usually denotes method calling this method</param>
        /// <param name="message">informational message</param>
        /// <param name="logCode">error code, usually empty</param>
        /// <param name="corpusPath">usually denotes corpus path of document</param>
        /// <param name="correlationId">corpus correlation id</param>
        /// <param name="apiCorrelationId">method correlation id</param>
        /// <param name="appId">app id assigned by user</param>
        /// <returns>A complete log entry</returns>
        private string ProcessLogEntry(string timestamp, string className, string method, string message, 
            CdmLogCode logCode, string corpusPath, string correlationId, Guid apiCorrelationId, string appId)
        {
            // Remove user created contents
            if (this.config.IngestAtLevel == EnvironmentType.PROD || this.config.IngestAtLevel == EnvironmentType.TEST)
            {
                corpusPath = null;
            }

            if (message == null)
            {
                message = "";
            }

            // Remove all commas from message to ensure the correct syntax of Kusto query
            message = message.Replace(",", ";");
            string code = logCode.ToString();

            // Additional properties associated with the log
            Dictionary<string, string> property = new Dictionary<string, string>();
            property.Add("Environment", this.config.IngestAtLevel.ToString());
            property.Add("SDKLanguage", "CSharp");
            property.Add("Region", this.config.Region);
            string propertyJson = SerializeDictionary(property);

            string entry = $"{timestamp},{className},{method},{message},{code},{corpusPath},{correlationId},{apiCorrelationId},{appId},{propertyJson}\n";

            return entry;
        }

        /// <summary>
        /// Serialize the dictionary and return a string
        /// </summary>
        /// <param name="dict">The dictionary to be handled</param>
        /// <returns>The serialized dictionary</returns>
        private static string SerializeDictionary(object dict)
        {
            return JsonConvert.SerializeObject(dict)
                .Replace(",", ";")
                .Replace("\"", "")
                .Replace("{", "")
                .Replace("}", "");
        }
    }
}
