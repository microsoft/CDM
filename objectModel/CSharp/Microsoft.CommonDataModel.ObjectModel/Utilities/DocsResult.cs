//-----------------------------------------------------------------------
// <copyright file="ApplierContext.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
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
