// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    public abstract class CdmObjectBase : CdmObject
    {
        public CdmObjectBase(CdmCorpusContext ctx)
        {
            if (ctx?.Corpus != null)
            {
                // when loading imports asynchronously, multiple objects may be created at the same time so multiple objects
                // can inadvertently get the same ID. Adding a lock here ensures that the global id variable is incremented
                // and then that value is set to the object ID before that same process can happen for another object
                bool lockTaken = false;
                try
                {
                    // acquire spinlock
                    ctx.Corpus.spinLock.Enter(ref lockTaken);
                    this.Id = CdmCorpusDefinition.NextId();

                }
                finally
                {
                    // release spinlock
                    if (lockTaken)
                        ctx.Corpus.spinLock.Exit();
                }
            }

            this.Ctx = ctx;
        }

        /// <inheritdoc />
        public int Id { get; set; }

        /// <inheritdoc />
        public abstract CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null);

        /// <inheritdoc />
        public abstract bool Validate();

        /// <inheritdoc />
        public abstract bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null);

        /// <inheritdoc />
        public CdmObjectType ObjectType { get; set; }

        /// <inheritdoc />
        public CdmCorpusContext Ctx { get; set; }

        internal IDictionary<string, ResolvedTraitSetBuilder> TraitCache { get; set; }

        internal string DeclaredPath { get; set; }

        /// <inheritdoc />
        public CdmObject Owner { get; set; }

        [Obsolete]
        public abstract CdmObjectType GetObjectType();

        /// <inheritdoc />
        public abstract string FetchObjectDefinitionName();

        /// <inheritdoc />
        public abstract T FetchObjectDefinition<T>(ResolveOptions resOpt = null) where T : CdmObjectDefinition;

        protected bool resolvingAttributes = false;
        protected bool circularReference;

        /// <inheritdoc />
        public virtual string AtCorpusPath
        {
            get
            {
                if (this.InDocument == null)
                {
                    return $"NULL:/NULL/{this.DeclaredPath}";
                }
                else
                {
                    return $"{this.InDocument.AtCorpusPath}/{this.DeclaredPath}";
                }
            }
        }

        /// <inheritdoc />
        public virtual CdmDocumentDefinition InDocument { get; set; }
        internal virtual void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            return;
        }

        internal virtual ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }

        private bool resolvingTraits = false;

        internal virtual ResolvedTraitSet FetchResolvedTraits(ResolveOptions resOpt = null)
        {
            bool wasPreviouslyResolving = this.Ctx.Corpus.isCurrentlyResolving;
            this.Ctx.Corpus.isCurrentlyResolving = true;
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            const string kind = "rtsb";
            ResolveContext ctx = this.Ctx as ResolveContext;
            string cacheTagA = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind);
            ResolvedTraitSetBuilder rtsbAll = null;
            if (this.TraitCache == null)
                this.TraitCache = new Dictionary<string, ResolvedTraitSetBuilder>();
            else if (!string.IsNullOrWhiteSpace(cacheTagA))
                this.TraitCache.TryGetValue(cacheTagA, out rtsbAll);

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            SymbolSet currDocRefSet = resOpt.SymbolRefSet;
            if (currDocRefSet == null)
            {
                currDocRefSet = new SymbolSet();
            }
            resOpt.SymbolRefSet = new SymbolSet();

            if (rtsbAll == null)
            {
                rtsbAll = new ResolvedTraitSetBuilder();

                if (!resolvingTraits)
                {
                    resolvingTraits = true;
                    this.ConstructResolvedTraits(rtsbAll, resOpt);
                    resolvingTraits = false;
                }

                CdmObjectDefinitionBase objDef = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
                if (objDef != null)
                {
                    // register set of possible docs
                    ctx.Corpus.RegisterDefinitionReferenceSymbols(objDef, kind, resOpt.SymbolRefSet);

                    if (rtsbAll.ResolvedTraitSet == null)
                    {
                        // nothing came back, but others will assume there is a set in this builder
                        rtsbAll.ResolvedTraitSet = new ResolvedTraitSet(resOpt);
                    }
                    // get the new cache tag now that we have the list of docs
                    cacheTagA = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind);
                    if (!string.IsNullOrWhiteSpace(cacheTagA))
                        this.TraitCache[cacheTagA] = rtsbAll;
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
            currDocRefSet.Merge(resOpt.SymbolRefSet);
            resOpt.SymbolRefSet = currDocRefSet;

            this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
            return rtsbAll.ResolvedTraitSet;
        }
        virtual internal ResolvedAttributeSetBuilder FetchObjectFromCache(ResolveOptions resOpt, AttributeContextParameters acpInContext = null)
        {
            const string kind = "rasb";
            ResolveContext ctx = this.Ctx as ResolveContext;
            string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : "");

            dynamic rasbCache = null;
            if (cacheTag != null)
            {
                ctx.Cache.TryGetValue(cacheTag, out rasbCache);
            }
            return rasbCache;
        }

        internal ResolvedAttributeSet FetchResolvedAttributes(ResolveOptions resOpt = null, AttributeContextParameters acpInContext = null)
        {
            bool wasPreviouslyResolving = this.Ctx.Corpus.isCurrentlyResolving;
            this.Ctx.Corpus.isCurrentlyResolving = true;
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }


            const string kind = "rasb";
            ResolveContext ctx = this.Ctx as ResolveContext;
            ResolvedAttributeSetBuilder rasbResult = null;
            // keep track of the context node that the results of this call would like to use as the parent
            CdmAttributeContext parentCtxForResult = null;
            ResolvedAttributeSetBuilder rasbCache = this.FetchObjectFromCache(resOpt, acpInContext);
            CdmAttributeContext underCtx = null;
            if (acpInContext != null)
            {
                parentCtxForResult = acpInContext.under;
            }

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            SymbolSet currDocRefSet = resOpt.SymbolRefSet;
            if (currDocRefSet == null)
            {
                currDocRefSet = new SymbolSet();
            }
            resOpt.SymbolRefSet = new SymbolSet();

            // if using the cache passes the maxDepth, we cannot use it
            if (rasbCache != null && resOpt.DepthInfo != null && resOpt.DepthInfo.CurrentDepth + rasbCache.ResolvedAttributeSet.DepthTraveled > resOpt.DepthInfo.MaxDepth)
            {
                rasbCache = null;
            }

            if (rasbCache == null)
            {
                if (this.resolvingAttributes)
                {
                    // re-entered this attribute through some kind of self or looping reference.
                    this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
                    //return new ResolvedAttributeSet();  // uncomment this line as a test to turn off allowing cycles
                    resOpt.InCircularReference = true;
                    this.circularReference = true;
                }
                this.resolvingAttributes = true;

                // a new context node is needed for these attributes, 
                // this tree will go into the cache, so we hang it off a placeholder parent
                // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
                // put into the 'receiving' tree
                underCtx = CdmAttributeContext.GetUnderContextForCacheContext(resOpt, this.Ctx, acpInContext);

                rasbCache = this.ConstructResolvedAttributes(resOpt, underCtx);

                this.resolvingAttributes = false;

                if (rasbCache != null)
                {
                    // register set of possible docs
                    CdmObjectDefinition oDef = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
                    if (oDef != null)
                    {
                        ctx.Corpus.RegisterDefinitionReferenceSymbols(oDef, kind, resOpt.SymbolRefSet);

                        // get the new cache tag now that we have the list of docs
                        string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : null);

                        // save this as the cached version
                        if (!string.IsNullOrWhiteSpace(cacheTag))
                            ctx.Cache[cacheTag] = rasbCache;
                    }
                    // get the 'underCtx' of the attribute set from the acp that is wired into
                    // the target tree
                    underCtx = (rasbCache as ResolvedAttributeSetBuilder).ResolvedAttributeSet.AttributeContext?.GetUnderContextFromCacheContext(resOpt, acpInContext);
                }

                if (this.circularReference)
                {
                    resOpt.InCircularReference = false;
                }
            }
            else
            {
                // get the 'underCtx' of the attribute set from the cache. The one stored there was build with a different
                // acp and is wired into the fake placeholder. so now build a new underCtx wired into the output tree but with
                // copies of all cached children
                underCtx = (rasbCache as ResolvedAttributeSetBuilder).ResolvedAttributeSet.AttributeContext?.GetUnderContextFromCacheContext(resOpt, acpInContext);
                //underCtx.ValidateLineage(resOpt); // debugging
            }

            if (rasbCache != null)
            {
                // either just built something or got from cache
                // either way, same deal: copy resolved attributes and copy the context tree associated with it
                // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
                // 2. deep copy the tree. 

                // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
                rasbResult = new ResolvedAttributeSetBuilder();
                rasbResult.ResolvedAttributeSet = (rasbCache as ResolvedAttributeSetBuilder).ResolvedAttributeSet.Copy();

                // 2. deep copy the tree and map the context references. 
                if (underCtx != null) // null context? means there is no tree, probably 0 attributes came out
                {
                    if (underCtx.AssociateTreeCopyWithAttributes(resOpt, rasbResult.ResolvedAttributeSet) == false)
                    {
                        return null;
                    }
                }
            }

            DepthInfo currDepthInfo = resOpt.DepthInfo;
            if (this is CdmEntityAttributeDefinition && currDepthInfo != null)
            {
                // if we hit the maxDepth, we are now going back up
                currDepthInfo.CurrentDepth--;
                // now at the top of the chain where max depth does not influence the cache
                if (currDepthInfo.CurrentDepth <= 0)
                {
                    resOpt.DepthInfo = null;
                }
            }

            // merge child document set with current
            currDocRefSet.Merge(resOpt.SymbolRefSet);
            resOpt.SymbolRefSet = currDocRefSet;

            this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
            return rasbResult?.ResolvedAttributeSet;
        }

        internal void ClearTraitCache()
        {
            this.TraitCache = null;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public abstract dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null);

        [Obsolete("InstanceFromData is deprecated. Please use the Persistence Layer instead.")]
        public static dynamic InstanceFromData<T, U>(CdmCorpusContext ctx, U obj)
            where T : CdmObject
        {
            string persistenceTypeName = "CdmFolder";
            return PersistenceLayer.FromData<T, U>(ctx, obj, persistenceTypeName);
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public static dynamic CopyData<T>(T instance, ResolveOptions resOpt = null, CopyOptions options = null)
             where T : CdmObject
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(instance, instance.Ctx.Corpus.DefaultResolutionDirectives);
            }

            if (options == null)
            {
                options = new CopyOptions();
            }

            string persistenceTypeName = "CdmFolder";
            return PersistenceLayer.ToData<T, dynamic>(instance, resOpt, options, persistenceTypeName);
        }

        internal static CdmCollection<T> ListCopy<T>(ResolveOptions resOpt, CdmObject owner, CdmCollection<T> source) where T : CdmObject
        {
            if (source == null)
                return null;
            CdmCollection<T> casted = new CdmCollection<T>(source.Ctx, owner, source.DefaultType);
            foreach (CdmObject element in source)
            {
                casted.Add(element != null ? (dynamic)element.Copy(resOpt) : null);
            }
            return casted;
        }

        /// <inheritdoc />
        public abstract bool Visit(string path, VisitCallback preChildren, VisitCallback postChildren);

        /// <summary>
        /// Calls the Visit function on all objects in the collection.
        /// </summary>
        internal static bool VisitList(IEnumerable<dynamic> items, string path, VisitCallback preChildren, VisitCallback postChildren)
        {
            bool result = false;
            if (items != null)
            {
                foreach (CdmObjectBase element in items)
                {
                    if (element != null)
                    {
                        if (element.Visit(path, preChildren, postChildren))
                        {
                            result = true;
                            break;
                        }
                    }
                }
            }
            return result;
        }

        private static dynamic ProtectParameterValues(ResolveOptions resOpt, dynamic val)
        {
            if (val != null)
            {
                // the value might be a contant entity object, need to protect the original 
                var cEnt = (val as CdmEntityReference)?.ExplicitReference as CdmConstantEntityDefinition;
                if (cEnt != null)
                {
                    // copy the constant entity AND the reference that holds it
                    cEnt = cEnt.Copy(resOpt) as CdmConstantEntityDefinition;
                    val = (val as CdmEntityReference).Copy(resOpt);
                    (val as CdmEntityReference).ExplicitReference = cEnt;
                }
            }
            return val;
        }


        internal static CdmTraitReference ResolvedTraitToTraitRef(ResolveOptions resOpt, ResolvedTrait rt)
        {
            CdmTraitReference traitRef = null;
            if (rt.ParameterValues != null && rt.ParameterValues.Length > 0)
            {
                traitRef = rt.Trait.Ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, rt.TraitName, false);
                int l = rt.ParameterValues.Length;
                if (l == 1)
                {
                    // just one argument, use the shortcut syntax
                    dynamic val = ProtectParameterValues(resOpt, rt.ParameterValues.Values[0]);
                    if (val != null)
                    {
                        traitRef.Arguments.Add(null, val);
                    }
                }
                else
                {
                    for (int i = 0; i < l; i++)
                    {
                        CdmParameterDefinition param = rt.ParameterValues.FetchParameterAtIndex(i);
                        dynamic val = ProtectParameterValues(resOpt, rt.ParameterValues.Values[i]);
                        if (val != null)
                        {
                            traitRef.Arguments.Add(param.Name, val);
                        }
                    }
                }
            }
            else
                traitRef = rt.Trait.Ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, rt.TraitName, true);
            if (resOpt.SaveResolutionsOnCopy)
            {
                // used to localize references between documents
                traitRef.ExplicitReference = rt.Trait as CdmTraitDefinition;
                traitRef.InDocument = (rt.Trait as CdmTraitDefinition).InDocument;
            }
            // always make it a property when you can, however the dataFormat traits should be left alone
            // also the wellKnown is the first constrained list that uses the datatype to hold the table instead of the default value property.
            // so until we figure out how to move the enums away from default value, show that trait too
            if (rt.Trait.AssociatedProperties != null && !rt.Trait.IsDerivedFrom("is.dataFormat", resOpt) && !(rt.Trait.TraitName == "is.constrainedList.wellKnown"))
                traitRef.IsFromProperty = true;
            return traitRef;
        }

        /// <inheritdoc />
        public abstract CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null);
        internal abstract CdmObjectReference CreatePortableReference(ResolveOptions resOpt);
    }
}
