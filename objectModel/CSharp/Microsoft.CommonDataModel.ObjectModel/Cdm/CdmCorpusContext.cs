// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    public interface CdmCorpusContext
    {
        CdmStatusLevel ReportAtLevel { get; set; }

        CdmCorpusDefinition Corpus { get; set; }

        EventCallback StatusEvent { get; }

        /// <summary>
        /// Collects events emitted by the SDK.
        /// </summary>
        EventList Events { get; }

        /// <summary>
        /// Optional correlation ID to be stamped on all recorded status events.
        /// </summary>
        string CorrelationId { set; get; }
    }
}
