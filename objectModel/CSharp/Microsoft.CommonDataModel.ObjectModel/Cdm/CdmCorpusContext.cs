//-----------------------------------------------------------------------
// <copyright file="CdmCorpusContext.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    public interface CdmCorpusContext
    {
        CdmCorpusDefinition Corpus { get; set; }

        EventCallback StatusEvent { get; }

        void UpdateDocumentContext(CdmDocumentDefinition currentDoc, string corpusPathRoot = null);
    }
}
