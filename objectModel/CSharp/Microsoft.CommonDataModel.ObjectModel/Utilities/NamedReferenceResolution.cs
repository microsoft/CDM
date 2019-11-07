//-----------------------------------------------------------------------
// <copyright file="NamedReferenceResolution.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    public class NamedReferenceResolution
    {
        internal CdmObjectDefinitionBase ToObjectDef { get; set; }
        internal ResolveContext UnderCtx { get; set; }
        internal CdmDocumentDefinition UsingDoc { get; set; }
        internal bool? ViaMoniker { get; set; }
    }
}
