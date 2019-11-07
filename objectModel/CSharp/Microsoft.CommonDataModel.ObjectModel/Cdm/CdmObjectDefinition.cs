//-----------------------------------------------------------------------
// <copyright file="CdmObjectDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    public interface CdmObjectDefinition : CdmObject
    {
        /// <summary>
        /// Gets or sets the object's explanation.
        /// </summary>
        string Explanation { get; set; }

        /// <summary>
        /// Gets the traits this object definition exhibits.
        /// </summary>
        CdmTraitCollection ExhibitsTraits { get; }
        
        /// <summary>
        /// All objectDefs have some kind of name, this method returns the name independent of the name of the name property.
        /// </summary>
        string GetName();

        /// <summary>
        /// Returns true if the object (or the referenced object) is an extension from the specified symbol name in some way.
        /// </summary>
        bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null);
    }
}
