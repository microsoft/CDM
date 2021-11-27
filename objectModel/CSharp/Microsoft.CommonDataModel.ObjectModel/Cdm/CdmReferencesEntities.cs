// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public interface CdmReferencesEntities
    {
        [Obsolete("For internal use only.")]
        ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null);
    }
}
