// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Generic;

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
        /// List of error/warning codes that should not be logged on their occurrence.
        /// </summary>
        HashSet<CdmLogCode> SuppressedLogCodes { get; }

        /// <summary>
        /// Optional correlation ID to be stamped on all recorded status events.
        /// </summary>
        string CorrelationId { set; get; }

        /// <summary>
        /// Set feature flags in context.
        /// </summary>
        IDictionary<string, dynamic> FeatureFlags { set; get; }

        /// <summary>
        /// returns the current set value of a named flag or null if flag is not set.
        /// </summary>
        dynamic GetFeatureFlagValue(string flagName);

    }
}
