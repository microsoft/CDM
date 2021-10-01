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
            copy.Ctx = this.Ctx;
            copy.DeclaredPath = this.DeclaredPath;
            copy.Explanation = this.Explanation;
            copy.ExhibitsTraits.Clear();
            foreach (var trait in this.ExhibitsTraits)
            {
                copy.ExhibitsTraits.Add(trait);
            }
            copy.InDocument = this.InDocument; // if gets put into a new document, this will change. until, use the source
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

            return (dynamic)this;
        }

        internal bool VisitDef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (this.ExhibitsTraits != null)
                if (this.ExhibitsTraits.VisitList(pathFrom + "/exhibitsTraits/", preChildren, postChildren))
                    return true;
            return false;
        }

        /// <summary>
        /// Given an initial path, returns this object's declared path
        /// </summary>
        /// <param name="pathFrom"></param>
        /// <returns></returns>
        internal virtual string UpdateDeclaredPath(string pathFrom)
        {
            return pathFrom + this.GetName();
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
                foreach (CdmTraitReferenceBase exhibitsTrait in this.ExhibitsTraits)
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

        /// Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed 
        /// into some final document. 
        internal override CdmObjectReference CreatePortableReference(ResolveOptions resOpt)
        {
            CdmObjectReferenceBase cdmObjectRef = this.Ctx.Corpus.MakeObject<CdmObjectReferenceBase>(CdmCorpusDefinition.MapReferenceType(this.ObjectType), "portable", true) as CdmObjectReferenceBase;
            cdmObjectRef.PortableReference = this;
            cdmObjectRef.InDocument = this.InDocument; // where it started life
            cdmObjectRef.Owner = this.Owner;

            return cdmObjectRef;
        }
    }
}
