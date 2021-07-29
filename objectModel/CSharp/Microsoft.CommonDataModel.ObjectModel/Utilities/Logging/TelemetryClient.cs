// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;

    /// <summary>
    /// Telemetry client for ingesting logs into database
    /// </summary>
    public interface TelemetryClient
    {
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
        void AddToIngestionQueue(string timestamp, CdmStatusLevel level, string className, string method,
            string corpusPath, string message, bool requireIngestion = false, CdmLogCode code = CdmLogCode.None);

        /// <summary>
        /// Enable the telemetry client by starting a thread for ingestion
        /// </summary>
        void Enable();
    }
}
