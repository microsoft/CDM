// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    public interface CdmObjectReference : CdmObject
    {
        /// <summary>
        /// Gets the object reference applied traits.
        /// </summary>
        CdmTraitCollection AppliedTraits { get; }

        /// <summary>
        /// Gets or sets the object explicit reference.
        /// </summary>
        CdmObjectDefinition ExplicitReference { get; set; }

        /// <summary>
        /// Gets or sets the object named reference.
        /// </summary>
        string NamedReference { get; set; }

        /// <summary>
        /// Gets or sets whether the reference is simple named or not. If true, use namedReference, else use explicitReference.
        /// </summary>
        bool SimpleNamedReference { get; set; }

        [Obsolete("Only for internal use.")]
        CdmObject FetchResolvedReference(ResolveOptions resOpt = null);
    }
}
