// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System.Collections.Generic;

    internal class DocsResult
    {
        public string NewSymbol { get; set; }
        public CdmDocumentDefinition DocBest { get; set; }
        public List<CdmDocumentDefinition> DocList { get; set; }
    }
}
