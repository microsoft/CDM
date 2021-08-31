// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;

/**
 * Telemetry client interface for ingesting logs into database.
 */
public interface TelemetryClient {

  /**
   * Enqueue the request queue with the information to be logged.
   * 
   * @param timestamp The log timestamp.
   * @param level Logging status level.
   * @param className Usually the class that is calling the method.
   * @param method Usually denotes method calling this method.
   * @param corpusPath Usually denotes corpus path of document.
   * @param message Informational message.
   * @param requireIngestion Whether the log needs to be ingested.
   * @param code Error or warning code.
   */
  void addToIngestionQueue(String timestamp, CdmStatusLevel level, String className, String method, 
    String corpusPath, String message, boolean requireIngestion, CdmLogCode code);

  /**
   * Enable the telemetry client by starting a thread for ingestion.
   */
  void enable();
}
