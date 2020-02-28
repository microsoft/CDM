// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;

    internal class RelationshipInfo
    {
        internal ResolvedTraitSet Rts { get; set; }
        public bool IsByRef { get; set; }
        public bool IsArray { get; set; }
        public bool SelectsOne { get; set; }
        public int? NextDepth { get; set; }
        public bool MaxDepthExceeded { get; set; }

    }
}
