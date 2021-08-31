// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public abstract class CdmObjectReferenceBase : CdmObjectBase, CdmObjectReference
    {
        private static readonly string Tag = nameof(CdmObjectReferenceBase);

        /// <inheritdoc />
        public bool? Optional { get; set; }

        internal static readonly string ResAttToken = "/(resolvedAttributes)/";
        /// <inheritdoc />
        public string NamedReference { get; set; }

        /// <inheritdoc />
        public CdmObjectDefinition ExplicitReference 
        { 
            get => this.explicitRererence; 
            set
            {
                if (value != null)
                    value.Owner = this;
                this.explicitRererence = value;
            }
        }

        /// <inheritdoc />
        public bool SimpleNamedReference { get; set; }

        internal CdmDocumentDefinition MonikeredDocument { get; set; }

        /// <summary>
        /// A portable explicit reference used to manipulate nodes in the attribute context.
        /// For more information, refer to the `CreatePortableReference` method in CdmObjectDef and CdmObjectRef.
        /// </summary>
        internal CdmObjectDefinitionBase PortableReference { get; set; }

        /// <inheritdoc />
        public CdmTraitCollection AppliedTraits { get; }

        private CdmObjectDefinition explicitRererence;

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

            return reff.IndexOf(ResAttToken);
        }

        [Obsolete("Only for internal use.")]
        public CdmObject FetchResolvedReference(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            if (this.ExplicitReference != null)
                return this.ExplicitReference;

            if (this.Ctx == null)
                return null;

            ResolveContext ctx = this.Ctx as ResolveContext;
            CdmObjectBase res = null;

            // if this is a special request for a resolved attribute, look that up now
            int seekResAtt = offsetAttributePromise(this.NamedReference);
            if (seekResAtt >= 0)
            {
                string entName = this.NamedReference.Substring(0, seekResAtt);
                string attName = this.NamedReference.Slice(seekResAtt + ResAttToken.Length);
                // get the entity
                CdmObject ent = this.Ctx.Corpus.ResolveSymbolReference(resOpt, this.InDocument, entName, CdmObjectType.EntityDef, retry: true);
                if (ent == null)
                {
                    Logger.Warning(ctx, Tag, nameof(FetchResolvedReference), this.AtCorpusPath, CdmLogCode.WarnResolveEntityFailed, entName, this.NamedReference);
                    return null;
                }

                // get the resolved attribute
                ResolvedAttributeSet ras = (ent as CdmObjectDefinitionBase).FetchResolvedAttributes(resOpt);
                ResolvedAttribute ra = null;
                if (ras != null)
                    ra = ras.Get(attName);
                if (ra != null)
                    res = ra.Target as dynamic;
                else
                {
                    Logger.Warning(ctx, Tag, nameof(FetchResolvedReference), this.AtCorpusPath, CdmLogCode.WarnResolveAttrFailed ,this.NamedReference);
                }
            }
            else
            {
                // normal symbolic reference, look up from the Corpus, it knows where everything is
                res = this.Ctx.Corpus.ResolveSymbolReference(resOpt, this.InDocument, this.NamedReference, this.ObjectType, retry: true);
            }

            return res;
        }

        /// <inheritdoc />
        public override CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            if (!string.IsNullOrEmpty(this.NamedReference))
                return this.CopyRefObject(resOpt, this.NamedReference, true);
            string newDeclaredPath = this.DeclaredPath?.EndsWith("/(ref)") == true ? this.DeclaredPath.Substring(0, this.DeclaredPath.Length - 6) : this.DeclaredPath;
            return this.CopyRefObject(resOpt, newDeclaredPath, true);
        }

        /// Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed 
        /// into some final document. 
        internal override CdmObjectReference CreatePortableReference(ResolveOptions resOpt)
        {
            CdmObjectDefinitionBase cdmObjectDef = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);

            if (cdmObjectDef == null || this.InDocument == null)
                return null; // not allowed

            CdmObjectReferenceBase cdmObjectRef = this.Ctx.Corpus.MakeObject<CdmObjectReferenceBase>(CdmCorpusDefinition.MapReferenceType(this.ObjectType), "portable", true);
            cdmObjectRef.PortableReference = cdmObjectDef;
            cdmObjectRef.Optional = this.Optional;
            cdmObjectRef.Owner = this.Owner;
            cdmObjectRef.InDocument = this.InDocument;

            return cdmObjectRef;
        }

        /// Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed 
        /// into some final document. 
        internal void LocalizePortableReference(string importPath)
        {
            string newDeclaredPath = this.PortableReference.DeclaredPath;
            newDeclaredPath =  newDeclaredPath?.EndsWith("/(ref)") == true ? newDeclaredPath.Substring(0, newDeclaredPath.Length - 6) : newDeclaredPath;
            this.NamedReference = $"{importPath}{newDeclaredPath}";
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmObjectReferenceBase copy;
            if (!string.IsNullOrEmpty(this.NamedReference))
            {
                copy = this.CopyRefObject(resOpt, this.NamedReference, this.SimpleNamedReference, host as CdmObjectReferenceBase);
            }
            else
            {
                copy = this.CopyRefObject(resOpt, this.ExplicitReference, this.SimpleNamedReference, host as CdmObjectReferenceBase);
            }

            copy.Optional = this.Optional;
            copy.PortableReference = this.PortableReference;

            if (resOpt.SaveResolutionsOnCopy)
            {
                copy.ExplicitReference = this.ExplicitReference?.Copy(resOpt) as CdmObjectDefinition;
            }

            copy.AppliedTraits.Clear();
            if (this.AppliedTraits != null)
            {
                foreach (var trait in this.AppliedTraits)
                    copy.AppliedTraits.Add(trait.Copy(resOpt) as CdmTraitReferenceBase);
            }

            // Don't do anything else after this, as it may cause InDocument to become dirty
            copy.InDocument = this.InDocument;

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
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

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
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmObject def = this.FetchResolvedReference(resOpt);
            if (def != null && def is CdmObjectReferenceBase reference)
            {
                def = reference.FetchResolvedReference(resOpt);
            }
            if (def != null && !(def is CdmObjectReference))
            {
                return (T)def;
            }
            return default(T);
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>() { "NamedReference", "ExplicitReference" };
            if (string.IsNullOrWhiteSpace(this.NamedReference) && this.ExplicitReference == null)
            {
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));
                return false;
            }
            return true;
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
                {
                    // when an object is defined inline inside a reference, we need a path to the reference
                    // AND a path to the inline object. The 'correct' way to do this is to name the reference (inline) and the
                    // defined object objectName so you get a path like extendsEntity/(inline)/MyBaseEntity. that way extendsEntity/(inline)
                    // gets you the reference where there might be traits, etc. and extendsEntity/(inline)/MyBaseEntity gets the
                    // entity defintion. HOWEVER! there are situations where (inline) would be ambiguous since there can be more than one
                    // object at the same level, like anywhere there is a collection of references or the collection of attributes.
                    // so we will flip it (also preserves back compat) and make the reference extendsEntity/MyBaseEntity/(inline) so that
                    // extendsEntity/MyBaseEntity gives the reference (like before) and then extendsEntity/MyBaseEntity/(inline) would give
                    // the inline defined object.
                    // ALSO, ALSO!!! since the ability to use a path to request an object (through) a reference is super useful, lets extend
                    // the notion and use the word (object) in the path to mean 'drill from reference to def' This would work then on
                    // ANY reference, not just inline ones
                    if (this.ExplicitReference != null)
                    {
                        // ref path is name of defined object
                        path = $"{pathFrom}{this.ExplicitReference.GetName()}";
                        // inline object path is a request for the defintion. setting the declaredPath
                        // keeps the visit on the explcitReference from using the defined object name
                        // as the path to that object
                        (this.ExplicitReference as CdmObjectDefinitionBase).DeclaredPath = path;
                    }
                    else
                    {
                        path = pathFrom;
                    }
                }
                this.DeclaredPath = $"{path}/(ref)";
            }
            string refPath = this.DeclaredPath;

            if (preChildren != null && preChildren.Invoke(this, refPath))
                return false;
            if (this.ExplicitReference != null && string.IsNullOrEmpty(this.NamedReference) && this.ExplicitReference.Visit(path, preChildren, postChildren))
                return true;
            if (this.VisitRef(path, preChildren, postChildren))
                return true;

            if (this.AppliedTraits != null)
                if (this.AppliedTraits.VisitList(refPath + "/appliedTraits/", preChildren, postChildren))
                    return true;

            if (postChildren != null && postChildren.Invoke(this, refPath))
                return true;
            return false;
        }

        internal abstract bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren);

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            // find and cache the complete set of attributes
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
            rasb.ResolvedAttributeSet.AttributeContext = under;
            var def = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
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
                ResolvedAttributeSet resAtts = def.FetchResolvedAttributes(resOpt, acpRef);
                if (resAtts?.Set?.Count > 0)
                {
                    //resAtts = resAtts.Copy(); should not neeed this copy now that we copy from the cache. lets try!
                    rasb.MergeAttributes(resAtts);
                    rasb.RemoveRequestedAtts();
                }
            }
            else
            {
                string defName = this.FetchObjectDefinitionName();
                Logger.Warning(this.Ctx, Tag, nameof(ConstructResolvedAttributes), this.AtCorpusPath, CdmLogCode.WarnResolveObjectFailed ,defName);
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
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            if (this.NamedReference != null && this.AppliedTraits == null)
            {
                const string kind = "rts";
                ResolveContext ctx = this.Ctx as ResolveContext;
                var objDef = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
                string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, "", true, objDef != null ? objDef.AtCorpusPath : null);
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
                    if (objDef != null)
                    {
                        rtsResult = (objDef as CdmObjectDefinitionBase).FetchResolvedTraits(resOpt);
                        if (rtsResult != null)
                            rtsResult = rtsResult.DeepCopy();

                        // register set of possible docs
                        ctx.Corpus.RegisterDefinitionReferenceSymbols(objDef, kind, resOpt.SymbolRefSet);

                        // get the new cache tag now that we have the list of docs
                        cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, "", true, objDef.AtCorpusPath);
                        if (!string.IsNullOrWhiteSpace(cacheTag))
                            ctx.Cache[cacheTag] = rtsResult;
                    }
                }
                else
                {
                    // cache was found
                    // get the SymbolSet for this cached object
                    string key = CdmCorpusDefinition.CreateCacheKeyFromObject(this, kind);
                    ctx.Corpus.DefinitionReferenceSymbols.TryGetValue(key, out SymbolSet tempDocRefSet);
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
            else if (this.Optional != true)
            {
                Logger.Warning(this.Ctx, Tag, nameof(ConstructResolvedTraits), this.AtCorpusPath, CdmLogCode.WarnResolveObjectFailed, this.FetchObjectDefinitionName());
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
