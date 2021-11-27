// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Concurrent;
    using System.Collections.Generic;

    public class ResolveContext : CdmCorpusContext
    {
        public CdmStatusLevel ReportAtLevel { get; set; }
        public CdmCorpusDefinition Corpus { get; set; }
        public EventCallback StatusEvent { get; set; }
        ///<inheritdoc/>
        public EventList Events { get; }
        ///<inheritdoc/>
        public string CorrelationId { get; set; }
        public HashSet<CdmLogCode> SuppressedLogCodes { get; }

        internal string RelativePath;
        internal IDictionary<string, ResolvedAttributeSetBuilder> AttributeCache;
        internal IDictionary<string, ResolvedTraitSet> TraitCache;

        public ResolveContext(CdmCorpusDefinition corpus, EventCallback statusEvent, CdmStatusLevel? reportAtLevel = null)
        {
            this.ReportAtLevel = reportAtLevel != null ? reportAtLevel.Value : CdmStatusLevel.Warning;
            this.StatusEvent = statusEvent;
            this.AttributeCache = new ConcurrentDictionary<string, ResolvedAttributeSetBuilder>();
            this.TraitCache = new ConcurrentDictionary<string, ResolvedTraitSet>();
            this.Corpus = corpus;
            this.Events = new EventList();
            this.SuppressedLogCodes = new HashSet<CdmLogCode>();
        }
    }
}
