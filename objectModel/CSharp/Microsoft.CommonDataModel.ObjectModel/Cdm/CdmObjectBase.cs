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
            string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : "");
            dynamic rasbCache = null;
            if (cacheTag != null)
                ctx.Cache.TryGetValue(cacheTag, out rasbCache);
            CdmAttributeContext underCtx = null;

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            SymbolSet currDocRefSet = resOpt.SymbolRefSet;
            if (currDocRefSet == null)
            {
                currDocRefSet = new SymbolSet();
            }
            resOpt.SymbolRefSet = new SymbolSet();

            // get the moniker that was found and needs to be appended to all
            // refs in the children attribute context nodes
            string fromMoniker = resOpt.FromMoniker;
            resOpt.FromMoniker = null;

            if (rasbCache == null)
            {
                if (this.resolvingAttributes)
                {
                    // re-entered this attribute through some kind of self or looping reference.
                    this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
                    return new ResolvedAttributeSet();
                }
                this.resolvingAttributes = true;

                // if a new context node is needed for these attributes, make it now
                if (acpInContext != null)
                    underCtx = CdmAttributeContext.CreateChildUnder(resOpt, acpInContext);

                rasbCache = this.ConstructResolvedAttributes(resOpt, underCtx);

                if (rasbCache != null)
                {
                    this.resolvingAttributes = false;

                    // register set of possible docs
                    CdmObjectDefinition oDef = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
                    if (oDef != null)
                    {
                        ctx.Corpus.RegisterDefinitionReferenceSymbols(oDef, kind, resOpt.SymbolRefSet);

                        // get the new cache tag now that we have the list of docs
                        cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : null);

                        // save this as the cached version
                        if (!string.IsNullOrWhiteSpace(cacheTag))
                            ctx.Cache[cacheTag] = rasbCache;

                        if (!string.IsNullOrWhiteSpace(fromMoniker) && acpInContext != null &&
                            (this is CdmObjectReferenceBase) && (this as CdmObjectReferenceBase).NamedReference != null)
                        {
                            // create a fresh context
                            CdmAttributeContext oldContext = acpInContext.under.Contents[acpInContext.under.Contents.Count - 1] as CdmAttributeContext;
                            acpInContext.under.Contents.RemoveAt(acpInContext.under.Contents.Count - 1);
                            underCtx = CdmAttributeContext.CreateChildUnder(resOpt, acpInContext);

                            CdmAttributeContext newContext = oldContext.CopyAttributeContextTree(resOpt, underCtx, rasbCache.ResolvedAttributeSet, null, fromMoniker);
                            // since THIS should be a refererence to a thing found in a moniker document, it already has a moniker in the reference
                            // this function just added that same moniker to everything in the sub-tree but now this one symbol has too many
                            // remove one
                            string monikerPathAdded = $"{fromMoniker}/";
                            if (newContext.Definition != null && newContext.Definition.NamedReference != null &&
                                newContext.Definition.NamedReference.StartsWith(monikerPathAdded))
                            {
                                // slice it off the front
                                newContext.Definition.NamedReference = newContext.Definition.NamedReference.Substring(monikerPathAdded.Length);
                            }
                        }
                    }
                }
            }
            else
            {
                // cache found. if we are building a context, then fix what we got instead of making a new one
                if (acpInContext != null)
                {
                    // make the new context
                    underCtx = CdmAttributeContext.CreateChildUnder(resOpt, acpInContext);

                    rasbCache.ResolvedAttributeSet.AttributeContext.CopyAttributeContextTree(resOpt, underCtx, rasbCache.ResolvedAttributeSet, null, fromMoniker);
                }
            }

            // merge child document set with current
            currDocRefSet.Merge(resOpt.SymbolRefSet);
            resOpt.SymbolRefSet = currDocRefSet;

            this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
            return rasbCache?.ResolvedAttributeSet;
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
                    dynamic val = rt.ParameterValues.Values[0];
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
                        dynamic val = rt.ParameterValues.Values[i];
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
            if (rt.Trait.AssociatedProperties != null && !rt.Trait.IsDerivedFrom("is.dataFormat", resOpt))
                traitRef.IsFromProperty = true;
            return traitRef;
        }

        internal static ResolveOptions CopyResolveOptions(ResolveOptions resOpt)
        {
            ResolveOptions resOptCopy = new ResolveOptions();
            resOptCopy.WrtDoc = resOpt.WrtDoc;
            resOptCopy.RelationshipDepth = resOpt.RelationshipDepth;
            if (resOpt.Directives != null)
                resOptCopy.Directives = resOpt.Directives.Copy();
            resOptCopy.LocalizeReferencesFor = resOpt.LocalizeReferencesFor;
            resOptCopy.IndexingDoc = resOpt.IndexingDoc;
            resOptCopy.ShallowValidation = resOpt.ShallowValidation;
            resOptCopy.ResolvedAttributeLimit = resOpt.ResolvedAttributeLimit;
            return resOptCopy;
        }

        /// <inheritdoc />
        public abstract CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null);
    }
}
