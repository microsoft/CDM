// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
        /// All object definitions have some kind of name, this method returns the name independent of the name property.
        /// </summary>
        string GetName();
    }
}
