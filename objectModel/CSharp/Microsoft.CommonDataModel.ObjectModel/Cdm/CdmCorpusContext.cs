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
        CdmStatusLevel ReportAtLevel { get; set; }

        CdmCorpusDefinition Corpus { get; set; }

        EventCallback StatusEvent { get; }
    }
}
