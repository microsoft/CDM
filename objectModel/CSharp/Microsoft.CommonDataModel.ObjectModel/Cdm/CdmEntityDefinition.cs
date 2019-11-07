//-----------------------------------------------------------------------
// <copyright file="CdmEntityDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class CdmEntityDefinition : CdmObjectDefinitionBase, CdmReferencesEntities
    {
        /// <summary>
        /// Gets or sets the entity entity name.
        /// </summary>
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or sets the entity extended by this entity.
        /// </summary>
        public CdmEntityReference ExtendsEntity { get; set; }

        /// <summary>
        /// Gets or sets the resolution guidance for attributes taken from the entity extended by this entity.
        /// </summary>
        public CdmAttributeResolutionGuidance ExtendsEntityResolutionGuidance { get; set; }

        /// <summary>
        /// Gets or sets the entity attribute Context.
        /// </summary>
        public CdmAttributeContext AttributeContext { get; set; }
        internal ResolveContext CtxDefault { get; set; }
        private ResolvedAttributeSetBuilder Rasb;
        private bool resolvingEntityReferences = false;

        /// <summary>
        /// Gets the entity attributes.
        /// </summary>
        public CdmCollection<CdmAttributeItem> Attributes { get; }

        public string SourceName
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("sourceName");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("sourceName", value);
            }
        }

        /// <summary>
        /// Gets or sets the entity display name.
        /// </summary>
        public string DisplayName
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("displayName");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("displayName", value);
            }
        }

        /// <summary>
        /// Gets or sets the entity description.
        /// </summary>
        public string Description
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("description");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("description", value);
            }
        }

        public string Version
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("version");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("version", value);
            }
        }

        /// <summary>
        /// Gets or sets the entity cdm schemas.
        /// </summary>
        public List<string> CdmSchemas
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("cdmSchemas");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("cdmSchemas", value);
            }
        }

        public string PrimaryKey
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("primaryKey");
            }
        }

        internal dynamic GetProperty(string propertyName)
        {
            return this.TraitToPropertyMap.FetchPropertyValue(propertyName, true);
        }

        internal TraitToPropertyMap TraitToPropertyMap { get; }

        internal CdmObjectReference ExtendsEntityRef
        {
            get { return ExtendsEntity; }
            set
            {
                this.ExtendsEntity = value as CdmEntityReference;
            }
        }

        public override string GetName()
        {
            return this.EntityName;
        }

        public CdmEntityDefinition(CdmCorpusContext ctx, string entityName, CdmEntityReference extendsEntity = null)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.EntityDef;
            this.EntityName = entityName;
            if (extendsEntity != null)
                this.ExtendsEntity = extendsEntity;

            this.Attributes = new CdmCollection<CdmAttributeItem>(this.Ctx, this, CdmObjectType.TypeAttributeDef);
            this.TraitToPropertyMap = new TraitToPropertyMap(this);
        }

        internal dynamic AddAttributeDef(dynamic attributeDef)
        {
            this.Attributes.Add(attributeDef as dynamic);
            return attributeDef;
        }

        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmEntityDefinition copy = new CdmEntityDefinition(this.Ctx, this.EntityName, null);
            copy.ExtendsEntity = copy.ExtendsEntity != null ? (CdmEntityReference)this.ExtendsEntity.Copy(resOpt) : null;
            copy.ExtendsEntityResolutionGuidance = this.ExtendsEntityResolutionGuidance != null ? (CdmAttributeResolutionGuidance)this.ExtendsEntityResolutionGuidance.Copy(resOpt) : null;
            copy.AttributeContext = copy.AttributeContext != null ? (CdmAttributeContext)this.AttributeContext.Copy(resOpt) : null;
            foreach (var att in this.Attributes)
                copy.Attributes.Add(att);
            this.CopyDef(resOpt, copy);
            return copy;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmEntityDefinition>(this, resOpt, options);
        }

        /// <summary>
        /// Returns the count of attibutes inherited by this entity.
        /// </summary>
        internal int CountInheritedAttributes(ResolveOptions resOpt)
        {
            // ensures that cache exits
            this.FetchResolvedAttributes(resOpt);
            return this.Rasb.InheritedMark;
        }

        internal ResolvedAttributeSet FetchAttributesWithTraits(ResolveOptions resOpt, dynamic queryFor)
        {
            return this.FetchResolvedAttributes(resOpt).FetchAttributesWithTraits(resOpt, queryFor);
        }

        internal CdmCollection<CdmAttributeItem> GetAttributeDefinitions()
        {
            return this.Attributes;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.EntityDef;
        }

        public ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            // this whole resolved entity ref goo will go away when resolved documents are done.
            // for now, it breaks if structured att sets get made.
            resOpt = CdmObjectBase.CopyResolveOptions(resOpt);
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });

            ResolveContext ctx = this.Ctx as ResolveContext; // what it actually is
            ResolvedEntityReferenceSet entRefSetCache = ctx.FetchCache(this, resOpt, "entRefSet") as ResolvedEntityReferenceSet;
            if (entRefSetCache == null)
            {
                entRefSetCache = new ResolvedEntityReferenceSet(resOpt);
                if (resolvingEntityReferences == false)
                {
                    resolvingEntityReferences = true;
                    // get from dynamic base public class and then 'fix' those to point here instead.
                    CdmObjectReference extRef = this.ExtendsEntityRef;
                    if (extRef != null)
                    {
                        var extDef = extRef.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                        if (extDef != null)
                        {
                            if (extDef == this)
                                extDef = extRef.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                            ResolvedEntityReferenceSet inherited = extDef.FetchResolvedEntityReferences(resOpt);
                            if (inherited != null)
                            {
                                foreach (var res in inherited.Set)
                                {
                                    ResolvedEntityReference resolvedEntityReference = res.Copy();
                                    resolvedEntityReference.Referencing.Entity = this;
                                    entRefSetCache.Set.Add(resolvedEntityReference);
                                }
                            }
                        }
                    }
                    if (this.Attributes != null)
                    {
                        for (int i = 0; i < this.Attributes.Count; i++)
                        {
                            // if dynamic refs come back from attributes, they don't know who we are, so they don't set the entity
                            dynamic sub = this.Attributes.AllItems[i].FetchResolvedEntityReferences(resOpt);
                            if (sub != null)
                            {
                                foreach (var res in sub.Set)
                                {
                                    res.Referencing.Entity = this;
                                }
                                entRefSetCache.Add(sub);
                            }
                        }
                    }
                    ctx.UpdateCache(this, resOpt, "entRefSet", entRefSetCache);
                    this.resolvingEntityReferences = false;
                }
            }
            return entRefSetCache;
        }

        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return this.IsDerivedFromDef(resOpt, this.ExtendsEntityRef, this.GetName(), baseDef);
        }

        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.EntityName);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.DeclaredPath;
            if (string.IsNullOrEmpty(path))
            {
                path = pathFrom + this.EntityName;
                this.DeclaredPath = path;
            }
            //trackVisits(path);

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.ExtendsEntity?.Visit(path + "/extendsEntity/", preChildren, postChildren) == true)
                return true;
            if (this.VisitDef(path, preChildren, postChildren))
                return true;
            if (this.AttributeContext?.Visit(path + "/attributeContext/", preChildren, postChildren) == true)
                return true;
            if (this.Attributes != null && this.Attributes.VisitList(path + "/hasAttributes/", preChildren, postChildren))
                return true;
            if (postChildren?.Invoke(this, path) == true)
                return true;
            return false;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            // base traits then add any elevated from attributes then add things exhibited by the att.
            CdmObjectReference baseClass = this.ExtendsEntityRef;
            if (baseClass != null)
            {
                // merge in all from base class
                rtsb.MergeTraits((baseClass as CdmObjectReferenceBase).FetchResolvedTraits(resOpt));
            }

            if (this.Attributes != null)
            {
                ResolvedTraitSet rtsElevated = new ResolvedTraitSet(resOpt);
                for (int i = 0; i < this.Attributes.Count; i++)
                {
                    dynamic att = this.Attributes.AllItems[i];
                    dynamic rtsAtt = att.FetchResolvedTraits(resOpt);
                    if (rtsAtt?.HasElevated == true)
                        rtsElevated = rtsElevated.MergeSet(rtsAtt, true);
                }
                rtsb.MergeTraits(rtsElevated);
            }
            this.ConstructResolvedTraitsDef(null, rtsb, resOpt);
        }

        /// Query the entity for a set of attributes that match an input query
        /// a JSON object (or a string that can be parsed into one) of the form {"attributeName":"", "attributeOrdinal": -1, "traits":[see next]} 
        /// matched attributes have each of the traits in the array
        /// the trait object is specified as {"traitName": queried trait name or base trait name, (optional) "arguments":[{"argumentName": queried argument, "value": queried value}]} 
        /// returns null for 0 results or an array of json objects, each matching the shape of the input query, with attribute names filled in
        private Task<List<object>> QueryOnTraitsAsync(dynamic querySpec)
        {
            // TODO: This is part of a planned work and currently not used (marked 3 Oct 2019)
            throw new NotImplementedException("Part of an ongoing work");
        }


        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-definitions from (in this order):
            // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
            // the relationsip of the attribute, the attribute definition itself and included attribute groups, dynamic traits applied to the attribute.
            this.Rasb = new ResolvedAttributeSetBuilder();
            this.Rasb.ResolvedAttributeSet.AttributeContext = under;

            if (this.ExtendsEntity != null)
            {
                CdmObjectReference extRef = this.ExtendsEntityRef;
                CdmAttributeContext extendsRefUnder = null;
                AttributeContextParameters acpExtEnt = null;
                if (under != null)
                {
                    AttributeContextParameters acpExt = new AttributeContextParameters
                    {
                        under = under,
                        type = CdmAttributeContextType.EntityReferenceExtends,
                        Name = "extends",
                        Regarding = null,
                        IncludeTraits = false
                    };
                    extendsRefUnder = this.Rasb.ResolvedAttributeSet.CreateAttributeContext(resOpt, acpExt);
                    acpExtEnt = new AttributeContextParameters
                    {
                        under = extendsRefUnder,
                        type = CdmAttributeContextType.Entity,
                        Name = extRef.NamedReference,
                        Regarding = extRef,
                        IncludeTraits = false
                    };
                }
                // save moniker, extended entity may attach a different moniker that we do not
                // want to pass along to getting this entities attributes
                string oldMoniker = resOpt.FromMoniker;

                this.Rasb.MergeAttributes((this.ExtendsEntityRef as CdmObjectReferenceBase).FetchResolvedAttributes(resOpt, acpExtEnt));

                if (this.ExtendsEntityResolutionGuidance != null)
                {
                    // some guidance was given on how to integrate the base attributes into the set. apply that guidance
                    ResolvedTraitSet rtsBase = this.FetchResolvedTraits(resOpt);

                    // this context object holds all of the info about what needs to happen to resolve these attributes.
                    // make a copy and set defaults if needed
                    CdmAttributeResolutionGuidance resGuide = (CdmAttributeResolutionGuidance)this.ExtendsEntityResolutionGuidance.Copy(resOpt);
                    resGuide.UpdateAttributeDefaults(resGuide.FetchObjectDefinitionName());
                    // holds all the info needed by the resolver code
                    AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuide, rtsBase);

                    this.Rasb.GenerateApplierAttributes(arc, false); // true = apply the prepared traits to new atts
                }

                // reset to the old moniker
                resOpt.FromMoniker = oldMoniker;
            }

            this.Rasb.MarkInherited();
            this.Rasb.ResolvedAttributeSet.AttributeContext = under;

            if (this.Attributes != null)
            {
                int l = this.Attributes.Count;
                for (int i = 0; i < l; i++)
                {
                    dynamic att = this.Attributes.AllItems[i];
                    CdmAttributeContext attUnder = under;
                    AttributeContextParameters acpAtt = null;
                    if (under != null)
                    {
                        acpAtt = new AttributeContextParameters
                        {
                            under = under,
                            type = CdmAttributeContextType.AttributeDefinition,
                            Name = att.FetchObjectDefinitionName(),
                            Regarding = att,
                            IncludeTraits = false
                        };
                    }
                    this.Rasb.MergeAttributes(att.FetchResolvedAttributes(resOpt, acpAtt));
                }
            }
            this.Rasb.MarkOrder();
            this.Rasb.ResolvedAttributeSet.AttributeContext = under;

            // things that need to go away
            this.Rasb.RemoveRequestedAtts();

            return this.Rasb;
        }

        /// <summary>
        /// Creates a resolved copy of the entity.
        /// </summary>
        public async Task<CdmEntityDefinition> CreateResolvedEntityAsync(string newEntName, ResolveOptions resOpt = null, CdmFolderDefinition folder = null, string newDocName = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            if (resOpt.WrtDoc == null)
            {
                Logger.Error(nameof(CdmEntityDefinition), this.Ctx as ResolveContext, $"No WRT document was supplied.", "CreateResolvedEntityAsync");
                return null;
            }

            if (string.IsNullOrEmpty(newEntName))
            {
                Logger.Error(nameof(CdmEntityDefinition), this.Ctx as ResolveContext, $"No Entity Name provided.", "CreateResolvedEntityAsync");
                return null;
            }

            if (folder == null)
            {
                folder = this.InDocument.Folder;
            }

            string fileName = (string.IsNullOrEmpty(newDocName)) ? $"{newEntName}.cdm.json" : newDocName;
            string origDoc = this.InDocument.AtCorpusPath;

            // Don't overwite the source document
            string targetAtCorpusPath = $"{this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(folder.AtCorpusPath, folder)}{fileName}";
            if (targetAtCorpusPath.Equals(origDoc, StringComparison.InvariantCultureIgnoreCase))
            {
                Logger.Error(nameof(CdmEntityDefinition), this.Ctx as ResolveContext, $"Attempting to replace source entity's document '{targetAtCorpusPath}'", "CreateResolvedEntityAsync");
                return null;
            }

            // if the wrtDoc needs to be indexed (like it was just modified) then do that first
            if (!await (resOpt.WrtDoc as CdmDocumentDefinition).IndexIfNeeded(resOpt))
            {
                Logger.Error(nameof(CdmEntityDefinition), this.Ctx as ResolveContext, $"Couldn't index source document.", "CreateResolvedEntity");
                return null;
            }

            // make the top level attribute context for this entity
            string entName = newEntName;
            ResolveContext ctx = this.Ctx as ResolveContext;
            CdmAttributeContext attCtxEnt = ctx.Corpus.MakeObject<CdmAttributeContext>(CdmObjectType.AttributeContextDef, entName, true);
            attCtxEnt.Ctx = ctx;
            attCtxEnt.DocCreatedIn = this.DocCreatedIn;

            // cheating a bit to put the paths in the right place
            AttributeContextParameters acp = new AttributeContextParameters
            {
                under = attCtxEnt,
                type = CdmAttributeContextType.AttributeGroup,
                Name = "attributeContext"
            };
            CdmAttributeContext attCtxAC = CdmAttributeContext.CreateChildUnder(resOpt, acp);
            AttributeContextParameters acpEnt = new AttributeContextParameters
            {
                under = attCtxAC,
                type = CdmAttributeContextType.Entity,
                Name = entName,
                Regarding = ctx.Corpus.MakeObject<CdmObject>(CdmObjectType.EntityRef, this.GetName(), true)
            };

            // use this whenever we need to keep references pointing at things that were already found. used when 'fixing' references by localizing to a new document
            ResolveOptions resOptCopy = CdmObjectBase.CopyResolveOptions(resOpt);
            resOptCopy.SaveResolutionsOnCopy = true;

            // resolve attributes with this context. the end result is that each resolved attribute
            // points to the level of the context where it was created
            var ras = this.FetchResolvedAttributes(resOptCopy, acpEnt);

            // create a new copy of the attribute context for this entity
            HashSet<CdmAttributeContext> allAttCtx = new HashSet<CdmAttributeContext>();
            CdmAttributeContext newNode = attCtxEnt.CopyNode(resOpt) as CdmAttributeContext;
            attCtxEnt = attCtxEnt.CopyAttributeContextTree(resOpt, newNode, ras, allAttCtx, "resolvedFrom");
            CdmAttributeContext attCtx = (attCtxEnt.Contents[0] as CdmAttributeContext).Contents[0] as CdmAttributeContext;

            // the attributes have been named, shaped, etc for this entity so now it is safe to go and 
            // make each attribute context level point at these final versions of attributes
            IDictionary<string, int> attPath2Order = new Dictionary<string, int>();
            Action<ResolvedAttributeSet, string> pointContextAtResolvedAtts = null;
            pointContextAtResolvedAtts = (rasSub, path) =>
            {
                rasSub.Set.ForEach(ra =>
                {
                    List<CdmAttributeContext> raCtxInEnt = new List<CdmAttributeContext>();
                    HashSet<CdmAttributeContext> raCtxSet = null;
                    rasSub.Ra2attCtxSet.TryGetValue(ra, out raCtxSet);

                    // find the correct attCtx for this copy, intersect these two sets
                    // (interate over the shortest list)                    
                    if (allAttCtx.Count < raCtxSet.Count)
                    {
                        foreach (CdmAttributeContext currAttCtx in allAttCtx)
                        {
                            if (raCtxSet.Contains(currAttCtx))
                            {
                                raCtxInEnt.Add(currAttCtx);
                            }
                        }
                    }
                    else
                    {
                        foreach (CdmAttributeContext currAttCtx in raCtxSet)
                        {
                            if (allAttCtx.Contains(currAttCtx))
                            {
                                raCtxInEnt.Add(currAttCtx);
                            }
                        }
                    }
                    foreach (CdmAttributeContext raCtx in raCtxInEnt)
                    {
                        var refs = raCtx.Contents;

                        // there might be more than one explanation for where and attribute came from when things get merges as they do

                        // this won't work when I add the structured attributes to avoid name collisions
                        string attRefPath = path + ra.ResolvedName;
                        if ((ra.Target as CdmAttribute)?.GetType().GetMethod("GetObjectType") != null)
                        {
                            var attRef = this.Ctx.Corpus.MakeObject<CdmObjectReferenceBase>(CdmObjectType.AttributeRef, attRefPath, true);
                            if (!attPath2Order.ContainsKey(attRef.NamedReference))
                            {
                                // only need one explanation for this path to the insert order
                                attPath2Order.Add(attRef.NamedReference, ra.InsertOrder);
                            }
                            refs.Add(attRef);
                        }
                        else
                        {
                            attRefPath += "/members/";
                            pointContextAtResolvedAtts(ra.Target as ResolvedAttributeSet, attRefPath);
                        }
                    }
                });
            };

            pointContextAtResolvedAtts(ras, entName + "/hasAttributes/");

            // generated attribute structures may end up with 0 attributes after that. prune them
            Func<dynamic, bool, bool> CleanSubGroup = null;
            CleanSubGroup = (subItem, underGenerated) =>
            {
                if (subItem.ObjectType == CdmObjectType.AttributeRef)
                {
                    return true; // not empty
                }
                CdmAttributeContext ac = subItem as CdmAttributeContext;

                if (ac.Type == CdmAttributeContextType.GeneratedSet)
                {
                    underGenerated = true;
                }
                if (ac.Contents == null || ac.Contents.Count == 0)
                {
                    return false; // empty
                }
                // look at all children, make a set to remove
                List<CdmAttributeContext> toRemove = new List<CdmAttributeContext>();
                foreach (var subSub in ac.Contents)
                {
                    if (CleanSubGroup(subSub, underGenerated) == false)
                    {
                        bool potentialTarget = underGenerated;
                        if (potentialTarget == false)
                        {
                            // cast is safe because we returned false meaning empty and not a attribute ref
                            // so is this the set holder itself?
                            potentialTarget = (subSub as CdmAttributeContext).Type == CdmAttributeContextType.GeneratedSet;
                        }
                        if (potentialTarget)
                            toRemove.Add(subSub as CdmAttributeContext);
                    }
                }
                foreach (var toDie in toRemove)
                {
                    ac.Contents.Remove(toDie);
                }
                return ac.Contents.Count != 0;
            };
            CleanSubGroup(attCtx, false);


            Func<CdmAttributeContext, int?> orderContents = null;

            // create an all-up ordering of attributes at the leaves of this tree based on insert order
            // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
            Func<CdmObject, int?> getOrderNum = (item) =>
            {
                if (item.ObjectType == CdmObjectType.AttributeContextDef && orderContents != null)
                {
                    return orderContents(item as CdmAttributeContext);
                }
                else if (item.ObjectType == CdmObjectType.AttributeRef)
                {
                    string attName = (item as CdmAttributeReference).NamedReference;
                    int o = attPath2Order[attName];
                    return o;
                }
                else
                {
                    return -1; // put the mystery item on top.
                }
            };

            orderContents = (CdmAttributeContext under) =>
            {
                if (under.LowestOrder == null)
                {
                    under.LowestOrder = -1; // used for group with nothing but traits
                    if (under.Contents.Count == 1)
                    {
                        under.LowestOrder = getOrderNum(under.Contents[0]);
                    }
                    else
                    {
                        under.Contents.AllItems.Sort((l, r) =>
                        {
                            int lNum = -1;
                            int rNum = -1;

                            int? aux;
                            aux = getOrderNum(l);

                            if (aux != null)
                            {
                                lNum = (int)aux;
                            }

                            aux = getOrderNum(r);

                            if (aux != null)
                            {
                                rNum = (int)aux;
                            }

                            if (lNum != -1 && (under.LowestOrder == -1 || lNum < under.LowestOrder))
                                under.LowestOrder = lNum;
                            if (rNum != -1 && (under.LowestOrder == -1 || rNum < under.LowestOrder))
                                under.LowestOrder = rNum;

                            return lNum - rNum;
                        });
                    }
                }
                return under.LowestOrder;
            };

            orderContents((CdmAttributeContext)attCtx);

            // make a new document in given folder if provided or the same folder as the source entity
            folder.Documents.Remove(fileName);
            CdmDocumentDefinition docRes = folder.Documents.Add(fileName);
            // add a import of the source document 
            origDoc = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(origDoc, docRes); // just in case we missed the prefix
            docRes.Imports.Add(origDoc, "resolvedFrom");

            // make the empty entity
            CdmEntityDefinition entResolved = docRes.Definitions.Add(entName);
            entResolved.AttributeContext = attCtx;

            // add the traits of the entity
            ResolvedTraitSet rtsEnt = this.FetchResolvedTraits(resOpt);
            rtsEnt.Set.ForEach(rt =>
            {
                var traitRef = CdmObjectBase.ResolvedTraitToTraitRef(resOptCopy, rt);
                (entResolved as CdmObjectDefinition).ExhibitsTraits.Add(traitRef);
            });

            // resolved attributes can gain traits that are applied to an entity when referenced
            // since these traits are described in the context, it is redundant and messy to list them in the attribute
            // so, remove them. create and cache a set of names to look for per context 
            // there is actuall a hierarchy to  all attributes from the base entity should have all traits applied independed of the 
            // sub-context they come from. Same is true of attribute entities. so do this recursively top down
            var ctx2traitNames = new Dictionary<CdmAttributeContext, HashSet<string>>();
            Action<CdmAttributeContext, HashSet<string>> collectContextTraits = null;

            collectContextTraits = (subAttCtx, inheritedTraitNames) =>
            {
                var traitNamesHere = new HashSet<string>(inheritedTraitNames);
                var traitsHere = subAttCtx.ExhibitsTraits;
                if (traitsHere != null)
                    foreach (var tat in traitsHere) { traitNamesHere.Add(tat.NamedReference); }
                ctx2traitNames.Add(subAttCtx, traitNamesHere);
                subAttCtx.Contents.AllItems.ForEach((cr) =>
                {
                    if (cr.ObjectType == CdmObjectType.AttributeContextDef)
                    {
                        // do this for all types?
                        collectContextTraits(cr as CdmAttributeContext, traitNamesHere);
                    }
                });

            };
            collectContextTraits(attCtx, new HashSet<string>());

            // add the attributes, put them in attribute groups if structure needed
            IDictionary<ResolvedAttribute, string> resAtt2RefPath = new Dictionary<ResolvedAttribute, string>();
            Action<ResolvedAttributeSet, dynamic, string> addAttributes = null;
            addAttributes = (rasSub, container, path) =>
            {
                rasSub.Set.ForEach(ra =>
                {
                    string attPath = path + ra.ResolvedName;
                    // use the path of the context associated with this attribute to find the new context that matches on path
                    HashSet<CdmAttributeContext> raCtxSet = null;
                    rasSub.Ra2attCtxSet.TryGetValue(ra, out raCtxSet);
                    CdmAttributeContext raCtx = null;
                    // find the correct attCtx for this copy
                    if (raCtxSet != null)
                    {
                        foreach (CdmAttributeContext currAttCtx in allAttCtx)
                        {
                            if (raCtxSet.Contains(currAttCtx))
                            {
                                raCtx = currAttCtx;
                                break;
                            }
                        }
                    }

                    if ((ra.Target as ResolvedAttributeSet)?.Set != null)
                    {
                        // this is a set of attributes.
                        // make an attribute group to hold them
                        CdmAttributeGroupDefinition attGrp = this.Ctx.Corpus.MakeObject<CdmAttributeGroupDefinition>(CdmObjectType.AttributeGroupDef, ra.ResolvedName, false);
                        attGrp.AttributeContext = this.Ctx.Corpus.MakeObject<CdmAttributeContextReference>(CdmObjectType.AttributeContextRef, raCtx.AtCorpusPath, true);
                        // take any traits from the set and make them look like traits exhibited by the group
                        HashSet<string> avoidSet = ctx2traitNames[raCtx];
                        ResolvedTraitSet rtsAtt = ra.ResolvedTraits;
                        rtsAtt.Set.ForEach(rt =>
                        {
                            if (rt.Trait.Ugly != true)
                            { // don't mention your ugly traits
                            if (avoidSet?.Contains(rt.TraitName) != true)
                            { // avoid the ones from the context
                                var traitRef = CdmObjectBase.ResolvedTraitToTraitRef(resOptCopy, rt);
                                    (attGrp as CdmObjectDefinitionBase).ExhibitsTraits.Add(traitRef);
                                }
                            }
                        });

                        // wrap it in a reference and then recurse with this as the new container
                        CdmAttributeGroupReference attGrpRef = this.Ctx.Corpus.MakeObject<CdmAttributeGroupReference>(CdmObjectType.AttributeGroupRef, null, false);
                        attGrpRef.ExplicitReference = attGrp;
                        container.AddAttributeDef(attGrpRef);
                        // isn't this where ...
                        addAttributes(ra.Target as ResolvedAttributeSet, attGrp, attPath + "/members/");
                    }
                    else
                    {
                        CdmTypeAttributeDefinition att = this.Ctx.Corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, ra.ResolvedName, false);
                        att.AttributeContext = this.Ctx.Corpus.MakeObject<CdmAttributeContextReference>(CdmObjectType.AttributeContextRef, raCtx.AtCorpusPath, true);
                        HashSet<string> avoidSet = ctx2traitNames[raCtx];
                        ResolvedTraitSet rtsAtt = ra.ResolvedTraits;
                        rtsAtt.Set.ForEach(rt =>
                        {
                            if (rt.Trait.Ugly != true)
                            { // don't mention your ugly traits
                                if (avoidSet?.Contains(rt.TraitName) != true)
                                { // avoid the ones from the context
                                    var traitRef = CdmObjectBase.ResolvedTraitToTraitRef(resOptCopy, rt);
                                    ((CdmTypeAttributeDefinition)att).AppliedTraits.Add(traitRef);
                                }
                            }
                        });

                        // none of the dataformat traits have the bit set that will make them turn into a property
                        // this is intentional so that the format traits make it into the resolved object
                        // but, we still want a guess as the data format, so get it and set it.
                        var impliedDataFormat = att.DataFormat;
                        if (impliedDataFormat != CdmDataFormat.Unknown)
                            att.DataFormat = impliedDataFormat;


                        container.AddAttributeDef(att);
                        resAtt2RefPath[ra] = attPath;
                    }
                });
            };
            addAttributes(ras, entResolved, entName + "/hasAttributes/");

            // any resolved traits that hold arguments with attribute refs should get 'fixed' here
            Action<CdmTraitReference, string, bool> replaceTraitAttRef = (tr, entityHint, isAttributeContext) =>
            {
                if (tr.Arguments != null)
                {
                    foreach (CdmArgumentDefinition arg in tr.Arguments.AllItems)
                    {
                        dynamic v = arg.UnResolvedValue != null ? arg.UnResolvedValue : arg.Value;
                        // is this an attribute reference?
                        if (v != null && (v as CdmObject)?.ObjectType == CdmObjectType.AttributeRef)
                        {
                            // only try this if the reference has no path to it (only happens with intra-entity att refs)
                            var attRef = v as CdmAttributeReference;
                            if (!string.IsNullOrEmpty(attRef.NamedReference) && attRef.NamedReference.IndexOf('/') == -1)
                            {
                                if (arg.UnResolvedValue == null)
                                    arg.UnResolvedValue = arg.Value;

                                // give a promise that can be worked out later. assumption is that the attribute must come from this entity.
                                arg.Value = this.Ctx.Corpus.MakeRef<CdmAttributeReference>(CdmObjectType.AttributeRef, entityHint + "/(resolvedAttributes)/" + attRef.NamedReference, true);
                            }
                        }
                    }
                }
            };

            // fix entity traits
            if (entResolved.ExhibitsTraits != null)
                foreach (var et in entResolved.ExhibitsTraits)
                {
                    replaceTraitAttRef(et, newEntName, false);
                }

            // fix context traits
            Action<CdmAttributeContext, string> fixContextTraits = null;
            fixContextTraits = (subAttCtx, entityHint) =>
                        {
                            var traitsHere = subAttCtx.ExhibitsTraits;
                            if (traitsHere != null)
                            {
                                foreach (var tr in traitsHere)
                                {
                                    replaceTraitAttRef(tr, entityHint, true);
                                }
                            }
                            subAttCtx.Contents.AllItems.ForEach((cr) =>
                            {
                                if (cr.ObjectType == CdmObjectType.AttributeContextDef)
                                {
                                    // if this is a new entity context, get the name to pass along
                                    CdmAttributeContext subSubAttCtx = (CdmAttributeContext)cr;
                                    string subEntityHint = entityHint;
                                    if (subSubAttCtx.Type == CdmAttributeContextType.Entity)
                                    {
                                        subEntityHint = subSubAttCtx.Definition.NamedReference;
                                    }
                                    // do this for all types
                                    fixContextTraits(subSubAttCtx, subEntityHint);
                                }
                            });

                        };
            fixContextTraits(attCtx, newEntName);
            // and the attribute traits
            var entAttributes = entResolved.GetAttributeDefinitions();
            if (entAttributes != null)
            {
                foreach (var entAtt in entAttributes)
                {
                    CdmTraitCollection attTraits = entAtt.AppliedTraits;
                    if (attTraits != null)
                    {
                        foreach (var tr in attTraits)
                            replaceTraitAttRef(tr, newEntName, false);
                    }
                }
            }

            // we are about to put this content created in the context of various documents (like references to attributes from base entities, etc.)
            // into one specific document. all of the borrowed refs need to work. so, re-write all string references to work from this new document
            // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes.
            // the fix needs to happen in the middle of the refresh
            // trigger the document to refresh current content into the resolved OM
            attCtx.Parent = null; // remove the fake parent that made the paths work
            ResolveOptions resOptNew = CdmObjectBase.CopyResolveOptions(resOpt);
            resOptNew.LocalizeReferencesFor = docRes;
            resOptNew.WrtDoc = docRes;
            if (!await docRes.RefreshAsync(resOptNew))
            {
                Logger.Error(nameof(CdmEntityDefinition), this.Ctx as ResolveContext, $"Failed to index the resolved document.", "CreateResolvedEntity");
                return null;
            }

            // get a fresh ref
            entResolved = docRes.FetchObjectFromDocumentPath(entName) as CdmEntityDefinition;

            return entResolved;
        }
    }
}
