// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;

    internal class ImportPriorities
    {
        internal IDictionary<CdmDocumentDefinition, ImportInfo> ImportPriority;
        internal IDictionary<string, CdmDocumentDefinition> MonikerPriorityMap;

        /// <summary>
        /// True if one of the document's imports import this document back.
        /// Ex.: A.cdm.json -> B.cdm.json -> A.cdm.json
        /// </summary>
        internal bool hasCircularImport;

        internal ImportPriorities()
        {
            this.ImportPriority = new Dictionary<CdmDocumentDefinition, ImportInfo>();
            this.MonikerPriorityMap = new Dictionary<string, CdmDocumentDefinition>();
            this.hasCircularImport = false;
        }

        internal ImportPriorities Copy()
        {
            ImportPriorities copy = new ImportPriorities();
            if (this.ImportPriority != null)
            {
                foreach (KeyValuePair<CdmDocumentDefinition, ImportInfo> pair in this.ImportPriority)
                {
                    copy.ImportPriority[pair.Key] = pair.Value;
                }
            }
            if (this.MonikerPriorityMap != null)
            {
                foreach (KeyValuePair<string, CdmDocumentDefinition> pair in this.MonikerPriorityMap)
                {
                    copy.MonikerPriorityMap[pair.Key] = pair.Value;
                }
            }
            copy.hasCircularImport = this.hasCircularImport;
            return copy;
        }
    }
}
