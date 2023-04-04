// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Guid } from 'guid-typescript';
import { Logger } from './Logger';
import { cdmStatusLevel, cdmLogCode, CdmCorpusContext, environmentType } from '../../internal';
import { CdmHttpClient, CdmHttpResponse, CdmHttpRequest } from '../Network';
import { TelemetryClient } from './TelemetryClient';
import { TelemetryConfig } from './TelemetryConfig';


export class TelemetryKustoClient implements TelemetryClient {

    /**
     * Maximum number of retries allowed for an HTTP request.
     */
    public maxNumRetries: number = 5;

    /**
     * Maximum timeout for completing an HTTP request including retries.
     */
    public maxTimeoutMilliseconds: number = 10000;

    /**
     * Maximum timeout for a single HTTP request.
     */
    public timeoutMilliseconds: number = 1000;

    /**
     * The CDM corpus context.
     */
    private ctx: CdmCorpusContext;

    /**
     * The Kusto configuration.
     */
    private config: TelemetryConfig;

    /**
     * Indicates whether the telemetry client is enabled or not.
     */
    private isEnabled: boolean = false;

    /**
     * Queuing all log ingestion request to Kusto
     */
    private requestQueue: Array<[cdmStatusLevel, string]>;

    /**
     * The timestamp when the telemetry client is enabled.
     */
    private lastIngestionTime: Date;

    /**
     * An HTTP client for post requests which ingests data into Kusto.
     */
    private readonly httpClient: CdmHttpClient;

    /**
     * Kusto data ingestion command.
     */
    private readonly ingestionCommand: string = '.ingest inline into table';

    /**
     * The frequency in millisecond by which to check and ingest the request queue.
     */
    private readonly ingestionFrequency: number = 500;

    /**
     * The maximum size of the request queue.
     */
    private readonly requestQueueMaxSize: number = 200;

    /**
     * The time in millisecond to pause sending http request when throttling.
     */
    private static readonly backoffForThrottling: number = 200;

    private readonly logExecTimeMethods: string[] = [
        'createResolvedEntityAsync', 
        'calculateEntityGraphAsync', 
        'calculateEntityGraphAsync(perEntity)'
    ];

    /**
     * Constructs a telemetry client for ingesting logs into Kusto.
     * @param ctx The CDM corpus context.
     * @param config The configuration for the client.
     */
    constructor(ctx: CdmCorpusContext, config: TelemetryConfig) {
        this.ctx = ctx;
        this.config = config;

        this.httpClient = new CdmHttpClient();
        this.requestQueue = new Array<[cdmStatusLevel, string]>();
    }

    /**
     * Enqueue the request queue with the information to be logged.
     * @param timestamp The log timestamp.
     * @param level Logging status level.
     * @param className Usually the class that is calling the method.
     * @param method Usually denotes method calling this method.
     * @param corpusPath Usually denotes corpus path of document.
     * @param message Informational message.
     * @param requireIngestion (Optional) Whether the log needs to be ingested.
     * @param code (Optional) Error or warning code.
     */
    public addToIngestionQueue(timestamp: string, level: cdmStatusLevel, className: string, method: string, 
        corpusPath: string, message: string, requireIngestion: boolean = false, code: cdmLogCode = cdmLogCode.None): void {

        // Check if the Kusto config and the concurrent queue has been initialized
        if (this.config === undefined || this.requestQueue === undefined) {
            return;
        }

        // Skip if the telemetry client is not enabled
        if (!this.isEnabled) {
            return
        }

        // Not ingest logs from telemetry client to avoid cycling
        if (className === TelemetryKustoClient.name) {
            return;
        }

        // If ingestion is not required and the level is Progress
        if (level === cdmStatusLevel.progress && !requireIngestion) {
            // If the execution time needs to be logged
            if (this.logExecTimeMethods.includes(method)) {
                // Check if the log contains execution time info
                const execTimeMessage: string = 'Leaving scope. Time elapsed:';

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
        if (this.config.removeUserContent) {
            corpusPath = null;

            if (level === cdmStatusLevel.warning || level === cdmStatusLevel.error) {
                message = null;
            }
        }

        const logEntry = this.processLogEntry(timestamp, className, method, message, code, corpusPath, 
            this.ctx.correlationId, this.ctx.events.apiCorrelationId, this.ctx.corpus.appId);

        // Add the status level and log entry to the queue to be ingested
        this.requestQueue.push([level, logEntry]);

        const currentTime: Date = new Date();
        
        // Ingest when request queue exceeds max size or by ingestion frequency
        if (this.requestQueue.length >= this.requestQueueMaxSize || 
            (currentTime.valueOf() - this.lastIngestionTime.valueOf()) > this.ingestionFrequency) {
            
            this.lastIngestionTime = currentTime;
            this.ingestRequestQueue();
        }
    }

    /**
     * Check if all the requests have been ingested.
     * @returns A Boolean indicating whether the queue is empty or not.
     */
     public checkRequestQueueIsEmpty(): boolean {
        if (this.requestQueue === undefined || this.requestQueue.length === 0) {
            return true;
        }

        return false;
    }

    /**
     * Enable the telemetry client which ingests logs into Kusto database.
     */
    public enable(): void {
        // Check if the Kusto config and the concurrent queue has been initialized
        if (this.config == null || this.requestQueue == null) {
            const message: string = "The telemetry client has not been initialized";
            Logger.warning(this.ctx, TelemetryKustoClient.name, "enable", undefined, cdmLogCode.WarnTelemetryIngestionFailed, message);
            return;
        }

        this.isEnabled = true;
        this.lastIngestionTime = new Date();
    }

    /**
     * Get an authorization token and send the query to Kusto.
     * @param query The Kusto query command to be posted to the cluster.
     */
    public async postKustoQuery(query: string): Promise<void> {
        const authToken: string = await this.config.getAuthenticationToken();

        const queryEndpoint = `https://${this.config.kustoClusterName}.kusto.windows.net/v1/rest/mgmt`;
        const kustoHost = `${this.config.kustoClusterName}.kusto.windows.net`;
        const queryBody = `{"db":"${this.config.kustoDatabaseName}","csl":"${query}"}`;

        const headers: Map<string, string> = new Map<string, string>([
            ['Accept', 'application/json'], 
            ['Authorization', authToken], 
            ['Host', kustoHost]
        ]);

        const httpRequest = new CdmHttpRequest(queryEndpoint);
        httpRequest.method = 'POST';

        httpRequest.headers = headers;
        httpRequest.content = queryBody;
        httpRequest.contentType = 'application/json';

        httpRequest.numberOfRetries = this.maxNumRetries;
        httpRequest.timeout = this.timeoutMilliseconds;
        httpRequest.maximumTimeout = this.maxTimeoutMilliseconds;

        const response: CdmHttpResponse = await this.httpClient.SendAsync(httpRequest, this.getRetryWaitTime, this.ctx);

        if (response === undefined) {
            throw new Error('Kusto query post failed. The result of a request is undefined.');
        }

        if (!response.isSuccessful) {
            throw new Error(`Kusto query post failed. HTTP ${response.statusCode} - ${response.reason}.`);
        }
    }

    /**
     * A callback function for http request retries.
     * @param response The Http response.
     * @param hasFailed Indicates whether the request has failed.
     * @param retryNumber The number of retries happened.
     * @returns The wait time before starting the next retry.
     */
    private getRetryWaitTime(response: CdmHttpResponse, hasFailed: boolean, retryNumber: number): number {
        if (response !== undefined && ((response.isSuccessful && !hasFailed))) {
            return undefined;
        } else {
            // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
            const upperBound: number = 1 << retryNumber;
            return Math.floor(Math.random() * upperBound) * TelemetryKustoClient.backoffForThrottling;
        }
    }

    /**
     * Ingest log entries into the table specified.
     * @param logTable The table to be ingested into.
     * @param logEntries Batched log entries.
     */
    private async ingestIntoTable(logTable: string, logEntries: string): Promise<void> {
        if (logEntries !== undefined && logEntries.length !== 0) {
            const query: string = `${this.ingestionCommand} ${logTable} <|\n${logEntries}`;

            try {
                await this.postKustoQuery(query);
            } catch (e) {
                Logger.warning(this.ctx, TelemetryKustoClient.name, this.ingestIntoTable.name, undefined, cdmLogCode.WarnTelemetryIngestionFailed, e);
            }
        }
    }

    /**
     * Ingest all the logs existing in the request queue.
     */
    public async ingestRequestQueue() {
        // Dequeue and send the ingestion request if the queue is not empty
        if (this.requestQueue.length !== 0) {
            // Batch log entries for each table
            let infoLogEntries: string = '';
            let warningLogEntries: string = '';
            let errorLogEntries: string = '';

            let request: [cdmStatusLevel, string];

            // Try to dequeue the first request in the queue
            while ((request = this.requestQueue.shift()) !== undefined) {
                const logEntry: string = request[1];

                switch (request[0]) {
                    case cdmStatusLevel.progress:
                        infoLogEntries += logEntry;
                        break;
                    case cdmStatusLevel.warning:
                        warningLogEntries += logEntry;
                        break;
                    case cdmStatusLevel.error:
                        errorLogEntries += logEntry;
                        break;
                    default:
                        break;
                }
            }

            // Ingest logs into corresponding tables in the Kusto database
            if (this.ctx !== undefined && this.config !== undefined) {
                if (infoLogEntries.length !== 0) {
                    await this.ingestIntoTable(this.config.kustoInfoLogTable, infoLogEntries);
                }

                if (warningLogEntries.length !== 0) {
                    await this.ingestIntoTable(this.config.kustoWarningLogTable, warningLogEntries);
                }

                if (errorLogEntries.length !== 0) {
                    await this.ingestIntoTable(this.config.kustoErrorLogTable, errorLogEntries);
                }
            }
        }
    }

    /**
     * Process the input log information to remove all unauthorized information.
     * @param timestamp The log timestamp.
     * @param className Usually the class that is calling the method.
     * @param method Usually denotes method calling this method.
     * @param message Informational message.
     * @param logCode Error code, usually empty.
     * @param corpusPath Usually denotes corpus path of document.
     * @param correlationId The corpus correlation id.
     * @param apiCorrelationId The method correlation id.
     * @param appId The app id assigned by user.
     * @return A complete log entry.
     */
    private processLogEntry(timestamp: string, className: string, method: string, message: string, 
        logCode: cdmLogCode, corpusPath: string, correlationId: string, apiCorrelationId: Guid, appId: string): string {
        
        // Remove user created contents
        if (this.config.ingestAtLevel === environmentType.PROD || this.config.ingestAtLevel === environmentType.TEST) {
            corpusPath = null;
        }

        if (message === null || message === undefined) {
            message = '';
        }

        // Remove all commas from message to ensure the correct syntax of Kusto query
        message = message.replace(',', ';');
        const code: string = cdmLogCode[logCode];

        // Additional properties associated with the log
        const property: Map<string, string> = new Map<string, string>([
            ['Environment', this.config.ingestAtLevel.toString()], 
            ['SDKLanguage', 'TypeScript'],
            ['Region', this.config.region]
        ]);

        const propertyJson: string = this.serializeMap(property);

        return `${timestamp},${className},${method},${message},${code},${corpusPath},${correlationId},${apiCorrelationId},${appId},${propertyJson}\n`;
    }

    /**
     * Serialize the map and return a string.
     * @param map The map object to be serialized.
     * @returns The serialized map.
     */
    private serializeMap(map: Map<string, string>): string {
        let mapAsString: string = '';

        for (const key of map.keys()) {
            mapAsString += `${key}:${map.get(key)};`
        }

        return mapAsString;
    }
}
