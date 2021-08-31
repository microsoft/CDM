// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { cdmStatusLevel, cdmLogCode } from '../../internal';

export interface TelemetryClient {
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
    addToIngestionQueue(timestamp: string, level: cdmStatusLevel, className: string, method: string, 
        corpusPath: string, message: string, requireIngestion?: boolean, code?: cdmLogCode): void;

    /**
     * Enable the telemetry client which ingests logs into database.
     */
    enable(): void;
}