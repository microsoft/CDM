//-----------------------------------------------------------------------
// <copyright file="ApplierContext.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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
