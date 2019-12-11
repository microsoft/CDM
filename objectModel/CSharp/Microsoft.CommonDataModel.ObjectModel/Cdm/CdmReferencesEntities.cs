//-----------------------------------------------------------------------
// <copyright file="CdmReferencesEntities.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    public interface CdmReferencesEntities
    {
        ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null);
    }
}
