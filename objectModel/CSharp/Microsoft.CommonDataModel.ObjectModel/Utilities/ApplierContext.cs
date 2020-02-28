// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;

    internal class ApplierContext
    {
        public string State { get; set; }
        public ResolveOptions ResOpt { get; set; }
        public CdmAttributeContext AttCtx;
        public CdmAttributeResolutionGuidance ResGuide;
        public ResolvedAttribute ResAttSource;
        public ResolvedAttribute ResAttNew;
        public CdmAttributeResolutionGuidance ResGuideNew;
        public bool Continue;
    }
}
