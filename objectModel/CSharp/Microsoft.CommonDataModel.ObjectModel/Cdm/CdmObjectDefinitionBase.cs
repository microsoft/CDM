// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    public abstract class CdmObjectDefinitionBase : CdmObjectBase, CdmObjectDefinition
    {
        /// <summary>
        /// Gets or sets the object's explanation.
        /// </summary>
        public string Explanation { get; set; }

        /// <inheritdoc />
        public abstract string GetName();

        /// <inheritdoc />
        public CdmTraitCollection ExhibitsTraits { get; }

        public CdmObjectDefinitionBase(CdmCorpusContext ctx)
            : base(ctx)
        {
            this.ExhibitsTraits = new CdmTraitCollection(this.Ctx, this);
        }

        internal string GetObjectPath()
        {
            return this.AtCorpusPath;
        }

        /// <inheritdoc />
        public abstract override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null);

        internal void CopyDef(ResolveOptions resOpt, CdmObjectDefinitionBase copy)
        {
            copy.DeclaredPath = this.DeclaredPath;
            copy.Explanation = this.Explanation;
            copy.ExhibitsTraits.Clear();
            foreach (var trait in this.ExhibitsTraits)
                copy.ExhibitsTraits.Add(trait);
        }

        /// <inheritdoc />
        public override string FetchObjectDefinitionName()
        {
            return this.GetName();
        }

        /// <inheritdoc />
        public override T FetchObjectDefinition<T>(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            resOpt.FromMoniker = null;
            return (dynamic)this;
        }

        internal bool VisitDef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (this.ExhibitsTraits != null)
                if (this.ExhibitsTraits.VisitList(pathFrom + "/exhibitsTraits/", preChildren, postChildren))
                    return true;
            return false;
        }

        internal bool IsDerivedFromDef(ResolveOptions resOpt, CdmObjectReference baseCdmObjectRef, string name, string seek)
        {
            if (seek == name)
                return true;

            CdmObjectDefinition def = baseCdmObjectRef?.FetchObjectDefinition<CdmObjectDefinition>(resOpt);
            if (def != null)
                return def.IsDerivedFrom(seek, resOpt);
            return false;
        }

        internal void ConstructResolvedTraitsDef(CdmObjectReference baseCdmObjectRef, ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            // get from base public class first, then see if some are applied to base public class on ref then add dynamic traits exhibited by this def
            if (baseCdmObjectRef != null)
            {
                // merge in all from base class
                rtsb.MergeTraits((baseCdmObjectRef as CdmObjectReferenceBase).FetchResolvedTraits(resOpt));
            }
            // merge in dynamic that are exhibited by this class
            if (this.ExhibitsTraits != null)
            {
                foreach (CdmTraitReference exhibitsTrait in this.ExhibitsTraits)
                {
                    rtsb.MergeTraits(exhibitsTrait.FetchResolvedTraits(resOpt));
                }
            }
        }

        /// <inheritdoc />
        public override CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            string name;
            if (!string.IsNullOrEmpty(this.DeclaredPath))
                name = this.DeclaredPath;
            else
                name = this.GetName();

            CdmObjectReferenceBase cdmObjectRef = this.Ctx.Corpus.MakeObject<CdmObjectReferenceBase>(CdmCorpusDefinition.MapReferenceType(this.ObjectType), name, true) as CdmObjectReferenceBase;
            if (resOpt.SaveResolutionsOnCopy)
            {
                // used to localize references between documents
                cdmObjectRef.ExplicitReference = this;
                cdmObjectRef.InDocument = this.InDocument;
            }
            return cdmObjectRef;
        }
    }
}
