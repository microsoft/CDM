// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
