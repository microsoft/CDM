// <copyright file="CdmAttributeItem.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    /// <summary>
    /// The CDM Def interface for a generic attribute that could be a type, entity, or group attribute 
    /// </summary>
    public interface CdmAttributeItem : CdmObject, CdmReferencesEntities
    {
        /// <summary>
        /// Gets the attribute applied traits.
        /// </summary>
        CdmTraitCollection AppliedTraits { get; }
    }
}
