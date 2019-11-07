//-----------------------------------------------------------------------
// <copyright file="RelationshipInfo.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
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
