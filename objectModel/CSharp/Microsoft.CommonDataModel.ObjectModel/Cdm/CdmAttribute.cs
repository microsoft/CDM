// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public abstract class CdmAttribute : CdmObjectDefinitionBase, CdmAttributeItem
    {
        /// <summary>
        /// Gets or sets the attribute's purpose.
        /// </summary>
        public CdmPurposeReference Purpose { get; set; }

        /// <summary>
        /// Gets or sets the attribute name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Cardinality setting for projections
        /// </summary>
        public CardinalitySettings Cardinality { get; set; }

        /// <summary>
        /// Gets or sets the attribute's resolution guidance.
        /// </summary>
        [Obsolete("Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview")]
        public CdmAttributeResolutionGuidance ResolutionGuidance { get; set; }

        /// <summary>
        /// Gets or sets the attribute's applied traits.
        /// </summary>
        public CdmTraitCollection AppliedTraits { get; }

        /// <summary>
        /// Indicates the number of attributes held within this attribute
        /// </summary>
        internal int AttributeCount { get; set; } = 0;

        /// <summary>
        /// Constructs a CdmAttribute.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The attribute name.</param>
        public CdmAttribute(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.Name = name;
            this.AppliedTraits = new CdmTraitCollection(this.Ctx, this);
        }

        internal CdmAttribute CopyAtt(ResolveOptions resOpt, CdmAttribute copy)
        {
            copy.Purpose = this.Purpose?.Copy(resOpt) as CdmPurposeReference;
            copy.ResolutionGuidance = this.ResolutionGuidance?.Copy(resOpt) as CdmAttributeResolutionGuidance;
            copy.AppliedTraits.Clear();
            foreach (var trait in this.AppliedTraits)
            {
                copy.AppliedTraits.Add(trait.Copy(resOpt) as CdmTraitReferenceBase);
            }
            this.CopyDef(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.Name;
        }

        [Obsolete("For internal use only.")]
        public abstract ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null);

        internal bool VisitAtt(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (this.Purpose != null) this.Purpose.Owner = this;
            if (this.Purpose?.Visit(pathFrom + "/purpose/", preChildren, postChildren) == true)
                return true;
            if (this.AppliedTraits != null)
                if (this.AppliedTraits.VisitList(pathFrom + "/appliedTraits/", preChildren, postChildren))
                    return true;
            if (this.ResolutionGuidance != null) this.ResolutionGuidance.Owner = this;
            if (this.ResolutionGuidance != null)
                if (this.ResolutionGuidance.Visit(pathFrom + "/resolutionGuidance/", preChildren, postChildren))
                    return true;

            if (this.VisitDef(pathFrom, preChildren, postChildren))
                return true;
            return false;
        }

        internal CdmObjectDefinition SetObjectDef(CdmObjectDefinition def)
        {
            throw new InvalidOperationException("not a ref");
        }

        internal ResolvedTraitSet AddResolvedTraitsApplied(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            AppliedTraits.AllItems.ForEach(item => rtsb.MergeTraits(item.FetchResolvedTraits(resOpt)));

            // dynamic applied on use
            return rtsb.ResolvedTraitSet;
        }
    }
}
