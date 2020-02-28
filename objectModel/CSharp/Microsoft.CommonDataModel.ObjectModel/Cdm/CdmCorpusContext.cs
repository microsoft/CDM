// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
