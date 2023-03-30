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
        /// <summary>
        /// The minimum json semantic versions that can be loaded by this ObjectModel version.
        /// </summary>
        public static readonly string JsonSchemaSemanticVersionMinimumLoad = "1.0.0";
        /// <summary>
        /// The minimum json semantic versions that can be saved by this ObjectModel version.
        /// </summary>
        public static readonly string JsonSchemaSemanticVersionMinimumSave = "1.1.0";
        /// <summary>
        /// The maximum json semantic versions that can be loaded and saved by this ObjectModel version.
        /// </summary>
        public static readonly string JsonSchemaSemanticVersionMaximumSaveLoad = "1.5.0";

        // known semantic versions changes
        public static readonly string JsonSchemaSemanticVersionProjections = "1.4.0";
        public static readonly string JsonSchemaSemanticVersionTraitsOnTraits = "1.5.0";

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
                    // why not use System.Threading.Interlocked.Increment;

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

        /// returns a list of TraitProfile descriptions, one for each trait applied to or exhibited by this object.
        /// each description of a trait is an expanded picture of a trait reference.
        /// the goal of the profile is to make references to structured, nested, messy traits easier to understand and compare.
        /// we do this by promoting and merging some information as far up the trait inheritance / reference chain as far as we can without 
        /// giving up important meaning.
        /// in general, every trait profile includes:
        /// 1. the name of the trait
        /// 2. a TraitProfile for any trait that this trait may 'extend', that is, a base class trait
        /// 3. a map of argument / parameter values that have been set
        /// 4. an applied 'verb' trait in the form of a TraitProfile
        /// 5. an array of any "classifier" traits that have been applied
        /// 6. and array of any other (non-classifier) traits that have been applied or exhibited by this trait
        /// 
        /// adjustments to these ideas happen as trait information is 'bubbled up' from base definitons. adjustments include
        /// 1. the most recent verb trait that was defined or applied will propigate up the hierarchy for all references even those that do not specify a verb. 
        /// This ensures the top trait profile depicts the correct verb
        /// 2. traits that are applied or exhibited by another trait using the 'classifiedAs' verb are put into a different collection called classifiers.
        /// 3. classifiers are accumulated and promoted from base references up to the final trait profile. this way the top profile has a complete list of classifiers 
        /// but the 'deeper' profiles will not have the individual classifications set (to avoid an explosion of info)
        /// 3. In a similar way, trait arguments will accumulate from base definitions and default values. 
        /// 4. traits used as 'verbs' (defaultVerb or explicit verb) will not include classifier descriptions, this avoids huge repetition of somewhat pointless info and recursive effort

        public List<TraitProfile> FetchTraitProfiles(ResolveOptions resOpt = null, TraitProfileCache cache = null, string forVerb = null)
        {
            if (cache == null)
            {
                cache = new TraitProfileCache();
            }

            if (resOpt == null)
            {
                // resolve symbols with default directive and WRTDoc from this object's point of view
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var result = new List<TraitProfile>();

            CdmTraitCollection traits = null;
            TraitProfile prof = null;
            if (this is CdmAttributeItem)
            {
                traits = (this as CdmAttributeItem).AppliedTraits;
            }
            else if (this is CdmTraitDefinition)
            {
                prof = TraitProfile.traitDefToProfile(this as CdmTraitDefinition, resOpt, false, false, cache);
            }
            else if (this is CdmObjectDefinition)
            {
                traits = (this as CdmObjectDefinition).ExhibitsTraits;
            }
            else if (this is CdmTraitReference)
            {
                prof = TraitProfile.traitRefToProfile(this as CdmTraitReference, resOpt, false, false, true, cache);
            }
            else if (this is CdmTraitGroupReference)
            {
                prof = TraitProfile.traitRefToProfile(this as CdmTraitGroupReference, resOpt, false, false, true, cache);
            }
            else if (this is CdmObjectReference)
            {
                traits = (this as CdmObjectReference).AppliedTraits;
            }
            // one of these two will happen
            if (prof != null)
            {
                if (prof.Verb == null || forVerb == null || prof.Verb.TraitName == forVerb)
                {
                    result.Add(prof);
                }
            }
            if (traits != null)
            {
                foreach (var tr in traits)
                {
                    prof = TraitProfile.traitRefToProfile(tr, resOpt, false, false, true, cache);
                    if (prof != null)
                    {
                        if (prof.Verb == null || forVerb == null || prof.Verb.TraitName == forVerb)
                        {
                            result.Add(prof);
                        }
                    }
                }
            }

            if (result.Count == 0)
            {
                result = null;
            }

            return result;
        }

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
            {
                this.TraitCache = new Dictionary<string, ResolvedTraitSetBuilder>();
            }
            else if (!string.IsNullOrWhiteSpace(cacheTagA))
            {
                this.TraitCache.TryGetValue(cacheTagA, out rtsbAll);
            }

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
                    {
                        this.TraitCache[cacheTagA] = rtsbAll;
                    }
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
            currDocRefSet.Merge(resOpt.SymbolRefSet);
            resOpt.SymbolRefSet = currDocRefSet;

            this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
            return rtsbAll.ResolvedTraitSet;
        }

        virtual internal ResolvedAttributeSetBuilder FetchObjectFromCache(ResolveOptions resOpt, AttributeContextParameters acpInContext)
        {
            const string kind = "rasb";
            ResolveContext ctx = this.Ctx as ResolveContext;
            string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : "");

            ResolvedAttributeSetBuilder rasbCache = null;
            if (cacheTag != null)
            {
                ctx.AttributeCache.TryGetValue(cacheTag, out rasbCache);
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

            bool inCircularReference = false;
            bool wasInCircularReference = resOpt.InCircularReference;
            if (this is CdmEntityDefinition entity)
            {
                inCircularReference = resOpt.CurrentlyResolvingEntities.Contains(entity);
                resOpt.CurrentlyResolvingEntities.Add(entity);
                resOpt.InCircularReference = inCircularReference;

                // uncomment this line as a test to turn off allowing cycles
                //if (inCircularReference)
                //{
                //    return new ResolvedAttributeSet();
                //}
            }

            int currentDepth = resOpt.DepthInfo.CurrentDepth;

            const string kind = "rasb";
            ResolveContext ctx = this.Ctx as ResolveContext;
            ResolvedAttributeSetBuilder rasbResult = null;
            ResolvedAttributeSetBuilder rasbCache = this.FetchObjectFromCache(resOpt, acpInContext);
            CdmAttributeContext underCtx;

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            SymbolSet currDocRefSet = resOpt.SymbolRefSet;
            if (currDocRefSet == null)
            {
                currDocRefSet = new SymbolSet();
            }
            resOpt.SymbolRefSet = new SymbolSet();

            // if using the cache passes the maxDepth, we cannot use it
            if (rasbCache != null && resOpt.DepthInfo.CurrentDepth + rasbCache.ResolvedAttributeSet.DepthTraveled > resOpt.DepthInfo.MaxDepth)
            {
                rasbCache = null;
            }

            if (rasbCache == null)
            {
                // to help view the hierarchy of loops in resolving entities
                if (this is CdmEntityDefinition && this.Ctx.GetFeatureFlagValue("core_entResDbg") == true)
                {
                    string spew = "[entResDbg] ";
                    foreach (var chain in resOpt.CurrentlyResolvingEntities)
                        spew += ">:";
                    spew += "(Reslv)";
                    spew += (this as CdmEntityDefinition).EntityName;
                    System.Diagnostics.Debug.WriteLine(spew);
                }

                // a new context node is needed for these attributes, 
                // this tree will go into the cache, so we hang it off a placeholder parent
                // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
                // put into the 'receiving' tree
                underCtx = CdmAttributeContext.GetUnderContextForCacheContext(resOpt, this.Ctx, acpInContext);

                rasbCache = this.ConstructResolvedAttributes(resOpt, underCtx);

                if (rasbCache != null)
                {
                    // register set of possible docs
                    CdmObjectDefinition oDef = this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
                    if (oDef != null)
                    {
                        ctx.Corpus.RegisterDefinitionReferenceSymbols(oDef, kind, resOpt.SymbolRefSet);

                        if (this.ObjectType == CdmObjectType.EntityDef)
                        {
                            // if we just got attributes for an entity, take the time now to clean up this cached tree and prune out
                            // things that don't help explain where the final set of attributes came from
                            if (underCtx != null)
                            {
                                var scopesForAttributes = new HashSet<CdmAttributeContext>();
                                underCtx.CollectContextFromAtts(rasbCache.ResolvedAttributeSet, scopesForAttributes); // the context node for every final attribute
                                if (!underCtx.PruneToScope(scopesForAttributes))
                                {
                                    return null;
                                }
                            }
                        }

                        // get the new cache tag now that we have the list of docs
                        string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : null);

                        // save this as the cached version
                        if (!string.IsNullOrWhiteSpace(cacheTag))
                        {
                            ctx.AttributeCache[cacheTag] = rasbCache;
                        }
                    }
                    // get the 'underCtx' of the attribute set from the acp that is wired into
                    // the target tree
                    underCtx = rasbCache.ResolvedAttributeSet.AttributeContext?.GetUnderContextFromCacheContext(resOpt, acpInContext);
                }
            }
            else
            {
                // to help view the hierarchy of loops in resolving entities
                //if (this is CdmEntityDefinition)
                //{
                //    string spew = "[entResDbg] ";
                //    foreach (var chain in resOpt.CurrentlyResolvingEntities)
                //        spew += ">";
                //    spew += "(Cache):";
                //    spew += (this as CdmEntityDefinition).EntityName;
                //    System.Diagnostics.Debug.WriteLine(spew);
                //}

                // get the 'underCtx' of the attribute set from the cache. The one stored there was build with a different
                // acp and is wired into the fake placeholder. so now build a new underCtx wired into the output tree but with
                // copies of all cached children
                underCtx = rasbCache.ResolvedAttributeSet.AttributeContext?.GetUnderContextFromCacheContext(resOpt, acpInContext);
                //underCtx.ValidateLineage(resOpt); // debugging
            }

            if (rasbCache != null)
            {
                // either just built something or got from cache
                // either way, same deal: copy resolved attributes and copy the context tree associated with it
                // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
                // 2. deep copy the tree. 

                // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
                rasbResult = new ResolvedAttributeSetBuilder
                {
                    ResolvedAttributeSet = rasbCache.ResolvedAttributeSet.Copy()
                };

                // 2. deep copy the tree and map the context references. 
                if (underCtx != null) // null context? means there is no tree, probably 0 attributes came out
                {
                    if (!underCtx.AssociateTreeCopyWithAttributes(resOpt, rasbResult.ResolvedAttributeSet))
                    {
                        return null;
                    }
                }
            }

            if (this is CdmEntityAttributeDefinition)
            {
                // current depth should now be set to this entity attribute level
                resOpt.DepthInfo.CurrentDepth = currentDepth;
                // now at the top of the chain where max depth does not influence the cache
                if (currentDepth == 0)
                {
                    resOpt.DepthInfo.MaxDepthExceeded = false;
                }
            }
            
            if (!inCircularReference && this.ObjectType == CdmObjectType.EntityDef)
            {
                // should be removed from the root level only
                // if it is in a circular reference keep it there
                resOpt.CurrentlyResolvingEntities.Remove(this as CdmEntityDefinition);
            }
            resOpt.InCircularReference = wasInCircularReference;

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

            string persistenceTypeName = options?.PersistenceTypeName;

            if (persistenceTypeName == null || persistenceTypeName == "")
            {
                persistenceTypeName = "CdmFolder";
            }

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
            // if nothing extra needs a mention, make a simple string ref
            CdmTraitReference traitRef = rt.Trait.Ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, rt.TraitName,
                                                                !((rt.ParameterValues != null && rt.ParameterValues.Length > 0) ||
                                                                rt.ExplicitVerb != null || rt.MetaTraits != null));

            if (rt.ParameterValues != null && rt.ParameterValues.Length > 0)
            {
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
            if (rt.ExplicitVerb != null)
            {
                traitRef.Verb = rt.ExplicitVerb.Copy(resOpt) as CdmTraitReference;
                traitRef.Verb.Owner = traitRef;
            }

            if (rt.MetaTraits != null)
            {
                foreach(var trMeta in rt.MetaTraits)
                {
                    var trMetaCopy = trMeta.Copy(resOpt) as CdmTraitReference;
                    traitRef.AppliedTraits.Add(trMetaCopy);
                }
            }
            if (resOpt.SaveResolutionsOnCopy)
            {
                // used to localize references between documents
                traitRef.ExplicitReference = rt.Trait;
                traitRef.InDocument = rt.Trait.InDocument;
            }
            // always make it a property when you can, however the dataFormat traits should be left alone
            // also the wellKnown is the first constrained list that uses the datatype to hold the table instead of the default value property.
            // so until we figure out how to move the enums away from default value, show that trait too
            if (rt.Trait.AssociatedProperties != null && rt.Trait.AssociatedProperties.Count > 0 && !rt.Trait.IsDerivedFrom("is.dataFormat", resOpt) && !(rt.Trait.TraitName == "is.constrainedList.wellKnown"))
                traitRef.IsFromProperty = true;
            return traitRef;
        }

        /// <inheritdoc />
        public abstract CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null);
        internal abstract CdmObjectReference CreatePortableReference(ResolveOptions resOpt);
        virtual internal long GetMinimumSemanticVersion()
        {
            return CdmObjectBase.DefaultJsonSchemaSemanticVersionNumber;
        }
        /// <summary>
        /// converts a string in the form MM.mm.pp into a single comparable long integer
        /// limited to 3 parts where each part is 5 numeric digits or fewer
        /// returns -1 if failure
        /// </summary>
        public static long SemanticVersionStringToNumber(string version)
        {
            if (version == null)
            {
                return -1;
            }

            // must have the three parts
            var SemanticVersionSplit = version.Split('.');
            if (SemanticVersionSplit.Length != 3)
            {
                return -1;
            }

            // accumulate the result
            long numVer = 0;
            for (var i = 0; i < 3; ++i)
            {
                if (!int.TryParse(SemanticVersionSplit[i], out int verPart))
                {
                    return -1;
                }
                // 6 digits?
                if (verPart > 100000)
                {
                    return -1;
                }
                // shift the previous accumulation over 5 digits and add in the new part
                numVer *= 100000;
                numVer += verPart;
            }
            return numVer;
        }

        /// <summary>
        /// converts a number encoding 3 version parts into a string in the form MM.mm.pp
        /// assumes 5 digits per encoded version part
        /// </summary>
        public static string SemanticVersionNumberToString(long version)
        {
            var verPartM = version / (100000L * 100000L);
            version = version - (verPartM * (100000L * 100000L));
            var verPartm = version / 100000L;
            var verPartP = version - (verPartm * 100000L);
            return $"{verPartM}.{verPartm}.{verPartP}";
        }

        internal static long DefaultJsonSchemaSemanticVersionNumber = SemanticVersionStringToNumber(JsonSchemaSemanticVersionMinimumSave);

    }
}
