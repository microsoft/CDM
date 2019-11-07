//-----------------------------------------------------------------------
// <copyright file="CdmAttribute.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public abstract class CdmAttribute : CdmObjectDefinitionBase, CdmAttributeItem
    {
        public CdmPurposeReference Purpose { get; set; }
        public string Name { get; set; }
        public CdmAttributeResolutionGuidance ResolutionGuidance { get; set; }

        public CdmTraitCollection AppliedTraits { get; }

        public CdmAttribute(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.Name = name;
            this.AppliedTraits = new CdmTraitCollection(this.Ctx, this);
        }

        internal CdmAttribute CopyAtt(ResolveOptions resOpt, CdmAttribute copy)
        {
            copy.Purpose = this.Purpose != null ? (CdmPurposeReference)this.Purpose.Copy(resOpt) : null;
            copy.ResolutionGuidance = this.ResolutionGuidance != null ? (CdmAttributeResolutionGuidance)this.ResolutionGuidance.Copy(resOpt) : null;
            foreach (var trait in this.AppliedTraits)
            {
                copy.AppliedTraits.Add(trait);
            }
            this.CopyDef(resOpt, copy);
            return copy;
        }

        public override string GetName()
        {
            return this.Name;
        }

        public abstract ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null);

        internal bool VisitAtt(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (this.Purpose?.Visit(pathFrom + "/purpose/", preChildren, postChildren) == true)
                return true;
            if (this.AppliedTraits != null)
                if (this.AppliedTraits.VisitList(pathFrom + "/appliedTraits/", preChildren, postChildren))
                    return true;
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
            Action<CdmTraitCollection> addAppliedTraits = (ats) =>
        {
            if (ats != null)
            {
                int l = ats.Count;
                for (int i = 0; i < l; i++)
                {
                    rtsb.MergeTraits(ats.AllItems[i].FetchResolvedTraits(resOpt));
                }
            }
        };
            addAppliedTraits(this.AppliedTraits);
            // dynamic applied on use
            return rtsb.ResolvedTraitSet;
        }
    }
}
