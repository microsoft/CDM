// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    /// <summary>
    /// The CDM definition interface for a generic attribute that could be a type, entity, or group attribute. 
    /// </summary>
    public interface CdmAttributeItem : CdmObject, CdmReferencesEntities
    {
        /// <summary>
        /// Gets the attribute applied traits.
        /// </summary>
        CdmTraitCollection AppliedTraits { get; }
    }
}
