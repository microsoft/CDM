//-----------------------------------------------------------------------
// <copyright file="ResolveContextScope.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    internal class ResolveContextScope
    {
        internal CdmTraitDefinition CurrentTrait { get; set; }
        internal int CurrentParameter { get; set; }
    }
}
