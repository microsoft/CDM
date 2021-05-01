// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    /// <summary>
    /// The CDM definition interface for a generic reference to either a trait or a trait group. 
    /// </summary>
    public abstract class CdmTraitReferenceBase : CdmObjectReferenceBase
    {
        public CdmTraitReferenceBase(CdmCorpusContext ctx, dynamic referenceTo, bool simpleReference)
            : base(ctx, (object)referenceTo, simpleReference)
        {
        }
    }
}
