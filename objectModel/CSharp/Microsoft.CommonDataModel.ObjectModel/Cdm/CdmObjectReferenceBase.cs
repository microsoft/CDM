//-----------------------------------------------------------------------
// <copyright file="CdmObjectReferenceBase.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    public abstract class CdmObjectReferenceBase : CdmObjectBase, CdmObjectReference
    {
        internal static string resAttToken = "/(resolvedAttributes)/";
        
        /// <inheritdoc />
        public string NamedReference { get; set; }

        /// <inheritdoc />
        public CdmObjectDefinition ExplicitReference { get; set; }

        /// <inheritdoc />
        public bool SimpleNamedReference { get; set; }

        internal CdmDocumentDefinition MonikeredDocument { get; set; }

        /// <inheritdoc />
        public CdmTraitCollection AppliedTraits { get; }

        public CdmObjectReferenceBase(CdmCorpusContext ctx, dynamic referenceTo, bool simpleReference)
            : base(ctx)
        {
            if (referenceTo != null)
            {
                if (referenceTo is CdmObject)
                {
                    this.ExplicitReference = referenceTo as CdmObjectDefinitionBase;
                }
                else
                {
                    // NamedReference is a string or JValue
                    this.NamedReference = referenceTo;
                }    
            }
            if (simpleReference)
                this.SimpleNamedReference = true;

            this.AppliedTraits = new CdmTraitCollection(this.Ctx, this);
        }
        internal CdmObjectReferenceBase CopyToHost(CdmCorpusContext ctx, dynamic refTo, bool simpleReference)
        {
            this.Ctx = ctx;
            this.ExplicitReference = null;
            this.NamedReference = null;

            if (refTo != null)
            {
                if (refTo is CdmObject)
                {
                    this.ExplicitReference = refTo as CdmObjectDefinitionBase;
                }
                else
                {
                    // NamedReference is a string or JValue
                    this.NamedReference = refTo;
                }    
            }
            this.SimpleNamedReference = simpleReference;

            this.AppliedTraits.Clear();

            return this;
        }

        internal static int offsetAttributePromise(string reff)
        {
            if (string.IsNullOrEmpty(reff))
                return -1;

            return reff.IndexOf(resAttToken);
        }

        public CdmObjectDefinition GetResolvedReference(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            if (this.ExplicitReference != null)
                return this.ExplicitReference;

            if (this.Ctx == null)
                return null;

            ResolveContext ctx = this.Ctx as ResolveContext;
            CdmObjectDefinitionBase res = null;

            // if this is a special request for a resolved attribute, look that up now
            int seekResAtt = offsetAttributePromise(this.NamedReference);
            if (seekResAtt >= 0)
            {
                string entName = this.NamedReference.Substring(0, seekResAtt);
                string attName = this.NamedReference.Slice(seekResAtt + resAttToken.Length);
                // get the entity
                CdmObjectDefinition ent = (this.Ctx.Corpus as CdmCorpusDefinition).ResolveSymbolReference(resOpt, this.InDocument, entName, CdmObjectType.EntityDef, retry: true);
                if (ent == null)
                {
                    Logger.Warning(nameof(CdmObjectReferenceBase), ctx, $"unable to resolve an entity named '{entName}' from the reference '{this.NamedReference}");
                    return null;
                }

                // get the resolved attribute
                ResolvedAttribute ra = (ent as CdmObjectDefinitionBase).FetchResolvedAttributes(resOpt).Get(attName);
                if (ra != null)
                    res = ra.Target as dynamic;
                else
                {
                    Logger.Warning(nameof(CdmObjectReferenceBase), ctx, $"couldn't resolve the attribute promise for '{this.NamedReference}'", $"{resOpt.WrtDoc.AtCorpusPath}");
                }
            }
            else
            {
                // normal symbolic reference, look up from the Corpus, it knows where everything is
                res = (this.Ctx.Corpus as CdmCorpusDefinition).ResolveSymbolReference(resOpt, this.InDocument, this.NamedReference, this.ObjectType, retry: true);
            }

            return res;
        }

        /// <inheritdoc />
        public override CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            if (!string.IsNullOrEmpty(this.NamedReference))
                return this.CopyRefObject(resOpt, this.NamedReference, true);
            return this.CopyRefObject(resOpt, this.DeclaredPath + this.ExplicitReference.GetName(), true);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            dynamic copy;
            if (!string.IsNullOrEmpty(this.NamedReference))
            {
                copy = this.CopyRefObject(resOpt, this.NamedReference, this.SimpleNamedReference, host as CdmObjectReferenceBase);
            }
            else
            {
                copy = this.CopyRefObject(resOpt, this.ExplicitReference, this.SimpleNamedReference, host as CdmObjectReferenceBase);
            }

            if (resOpt.SaveResolutionsOnCopy)
            {
                copy.ExplicitReference = this.ExplicitReference;
            }
            copy.InDocument = this.InDocument;

            copy.AppliedTraits.Clear();
            if (this.AppliedTraits != null)
            {
                foreach (var trait in this.AppliedTraits)
                    copy.AppliedTraits.Add(trait);
            }
            return copy;
        }
        internal abstract CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference, CdmObjectReferenceBase host = null);

        /// <inheritdoc />
        public override string FetchObjectDefinitionName()
        {
            if (!string.IsNullOrEmpty(this.NamedReference))
            {
                int pathEnd = this.NamedReference.LastIndexOf('/');
                if (pathEnd == -1 || pathEnd + 1 == this.NamedReference.Length)
                {
                    return this.NamedReference;
                }
                else
                {
                    return this.NamedReference.Substring(pathEnd + 1);

                }
            }

          if (this.ExplicitReference != null)
                return this.ExplicitReference.GetName();
            return null;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt)
        {
            var def = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
            if (def != null)
            {
                return def.IsDerivedFrom(baseDef, resOpt);

            }
            return false;
        }

        /// <inheritdoc />
        public override T FetchObjectDefinition<T>(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            dynamic def = this.GetResolvedReference(resOpt) as dynamic;
            if (def != null)
                return def;
            return default(T);
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return (!string.IsNullOrEmpty(this.NamedReference) || this.ExplicitReference != null) ? true : false;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (!string.IsNullOrEmpty(this.NamedReference))
                    path = pathFrom + this.NamedReference;
                else
                    path = pathFrom;
                this.DeclaredPath = path;
            }

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;
            if (this.ExplicitReference != null && string.IsNullOrEmpty(this.NamedReference))
                if (this.ExplicitReference.Visit(path, preChildren, postChildren))
                    return true;
            if (this.VisitRef(path, preChildren, postChildren))
                return true;

            if (this.AppliedTraits != null)
                if (this.AppliedTraits.VisitList(path + "/appliedTraits/", preChildren, postChildren))
                    return true;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        internal abstract bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren);

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            // find and cache the complete set of attributes
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
            rasb.ResolvedAttributeSet.AttributeContext = under;
            var def = this.FetchObjectDefinition<CdmObjectDefinition>(resOpt);
            if (def != null)
            {
                AttributeContextParameters acpRef = null;
                if (under != null)
                {
                    // ask for a 'pass through' context, that is, no new context at this level
                    acpRef = new AttributeContextParameters()
                    {
                        under = under,
                        type = CdmAttributeContextType.PassThrough
                    };
                }
                ResolvedAttributeSet resAtts = (def as CdmObjectDefinitionBase).FetchResolvedAttributes(resOpt, acpRef);
                if (resAtts?.Set?.Count > 0)
                {
                    resAtts = resAtts.Copy();
                    rasb.MergeAttributes(resAtts);
                    rasb.RemoveRequestedAtts();
                }
            }
            else
            {
                string defName = this.FetchObjectDefinitionName();
                Logger.Warning(defName, this.Ctx, $"unable to resolve an object from the reference '{defName}'");
            }
            return rasb;
        }

        internal override ResolvedTraitSet FetchResolvedTraits(ResolveOptions resOpt = null)
        {
            bool wasPreviouslyResolving = this.Ctx.Corpus.isCurrentlyResolving;
            this.Ctx.Corpus.isCurrentlyResolving = true;
            var ret = this._fetchResolvedTraits(resOpt);
            this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
            return ret;
        }

        internal ResolvedTraitSet _fetchResolvedTraits(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            if (this.NamedReference != null && this.AppliedTraits == null)
            {
                const string kind = "rts";
                ResolveContext ctx = this.Ctx as ResolveContext;
                string objDefName = this.FetchObjectDefinitionName();
                string cacheTag = ((CdmCorpusDefinition)ctx.Corpus).CreateDefinitionCacheTag(resOpt, this, kind, "", true);
                dynamic rtsResultDynamic = null;
                if (cacheTag != null)
                    ctx.Cache.TryGetValue(cacheTag, out rtsResultDynamic);
                ResolvedTraitSet rtsResult = rtsResultDynamic as ResolvedTraitSet;

                // store the previous document set, we will need to add it with
                // children found from the constructResolvedTraits call
                SymbolSet currSymRefSet = resOpt.SymbolRefSet;
                if (currSymRefSet == null)
                    currSymRefSet = new SymbolSet();
                resOpt.SymbolRefSet = new SymbolSet();

                if (rtsResult == null)
                {
                    CdmObjectDefinition objDef = this.FetchObjectDefinition<CdmObjectDefinition>(resOpt);
                    if (objDef != null)
                    {
                        rtsResult = (objDef as CdmObjectDefinitionBase).FetchResolvedTraits(resOpt);
                        if (rtsResult != null)
                            rtsResult = rtsResult.DeepCopy();

                        // register set of possible docs
                        ((CdmCorpusDefinition)ctx.Corpus).RegisterDefinitionReferenceSymbols(objDef, kind, resOpt.SymbolRefSet);

                        // get the new cache tag now that we have the list of docs
                        cacheTag = ((CdmCorpusDefinition)ctx.Corpus).CreateDefinitionCacheTag(resOpt, this, kind, "", true);
                        if (!string.IsNullOrWhiteSpace(cacheTag))
                            ctx.Cache[cacheTag] = rtsResult;
                    }
                }
                else
                {
                    // cache was found
                    // get the SymbolSet for this cached object
                    string key = CdmCorpusDefinition.CreateCacheKeyFromObject(this, kind);
                    ((CdmCorpusDefinition)ctx.Corpus).DefinitionReferenceSymbols.TryGetValue(key, out SymbolSet tempDocRefSet);
                    resOpt.SymbolRefSet = tempDocRefSet;
                }

                // merge child document set with current
                currSymRefSet.Merge(resOpt.SymbolRefSet);
                resOpt.SymbolRefSet = currSymRefSet;

                return rtsResult;
            }
            else
                return base.FetchResolvedTraits(resOpt);
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            CdmObjectDefinition objDef = this.FetchObjectDefinition<CdmObjectDefinition>(resOpt);

            if (objDef != null)
            {
                ResolvedTraitSet rtsInh = (objDef as CdmObjectDefinitionBase).FetchResolvedTraits(resOpt);
                if (rtsInh != null)
                {
                    rtsInh = rtsInh.DeepCopy();
                }
                rtsb.TakeReference(rtsInh);
            }
            else
            {
                string defName = this.FetchObjectDefinitionName();
                Logger.Warning(defName, this.Ctx, $"unable to resolve an object from the reference '{defName}'");
            }

            if (this.AppliedTraits != null)
            {
                foreach (CdmTraitReference at in this.AppliedTraits)
                {
                    rtsb.MergeTraits(at.FetchResolvedTraits(resOpt));
                }
            }
        }
    }
}
