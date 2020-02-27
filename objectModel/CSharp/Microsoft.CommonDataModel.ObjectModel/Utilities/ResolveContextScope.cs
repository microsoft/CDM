// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    internal class ResolveContextScope
    {
        internal CdmTraitDefinition CurrentTrait { get; set; }
        internal int CurrentParameter { get; set; }
    }
}
