// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;

    internal class RelationshipInfo
    {
        internal ResolvedTraitSet Rts { get; set; }
        internal bool IsByRef { get; set; }
        internal bool IsArray { get; set; }
        internal bool SelectsOne { get; set; }
        internal int NextDepth { get; set; }
        internal int? MaxDepth { get; set; }
        internal bool MaxDepthExceeded { get; set; }

    }
}
