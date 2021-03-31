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
    using System.Threading.Tasks;

    public class CdmEntityDefinition : CdmObjectDefinitionBase, CdmReferencesEntities
    {
        private static readonly string Tag = nameof(CdmEntityDefinition);
        /// <summary>
        /// Gets or sets the entity name.
        /// </summary>
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or sets the entity extended by this entity.
        /// </summary>
        public CdmEntityReference ExtendsEntity
        {
            get => this.extendsEntity;
            set
            {
                if (value != null)
                    value.Owner = this;
                this.extendsEntity = value;
            }
        }

        /// <summary>
        /// Gets or sets the resolution guidance for attributes taken from the entity extended by this entity.
        /// </summary>
        public CdmAttributeResolutionGuidance ExtendsEntityResolutionGuidance { get; set; }

        /// <summary>
        /// Gets or sets the entity attribute context.
        /// </summary>
        public CdmAttributeContext AttributeContext { get; set; }

        internal ResolveContext CtxDefault { get; set; }

        private ResolvedAttributeSetBuilder Rasb;
        private bool resolvingEntityReferences = false;
        private CdmEntityReference extendsEntity;

        /// <summary>
        /// Gets the entity attributes.
        /// </summary>
        public CdmCollection<CdmAttributeItem> Attributes { get; }

        /// <summary>
        /// Gets or sets the entity source name.
        /// </summary>
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

        /// <summary>
        /// Gets or sets the entity version.
        /// </summary>
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

        /// <summary>
        /// Gets the entity primary key.
        /// </summary>
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

        /// <inheritdoc />
        public override string GetName()
        {
            return this.EntityName;
        }

        /// <summary>
        /// Constructs a CdmEntityDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="entityName">The entity name.</param>
        /// <param name="extendsEntity">The entity extended by this entity.</param>
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

        internal CdmAttributeItem AddAttributeDef(CdmAttributeItem attributeDef)
        {
            this.Attributes.Add(attributeDef);
            return attributeDef;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmEntityDefinition copy;
            if (host == null)
            {
                copy = new CdmEntityDefinition(this.Ctx, this.EntityName, null);
            }
            else
            {
                copy = host as CdmEntityDefinition;
                copy.Ctx = this.Ctx;
                copy.EntityName = this.EntityName;
                copy.Attributes.Clear();
            }

            copy.ExtendsEntity = copy.ExtendsEntity != null ? (CdmEntityReference)this.ExtendsEntity.Copy(resOpt) : null;
            copy.ExtendsEntityResolutionGuidance = this.ExtendsEntityResolutionGuidance != null ? (CdmAttributeResolutionGuidance)this.ExtendsEntityResolutionGuidance.Copy(resOpt) : null;
            copy.AttributeContext = copy.AttributeContext != null ? (CdmAttributeContext)this.AttributeContext.Copy(resOpt) : null;
            foreach (var att in this.Attributes)
            {
                copy.Attributes.Add(att.Copy(resOpt) as CdmAttributeItem);
            }
            this.CopyDef(resOpt, copy);
            return copy;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData(this, resOpt, options);
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
            ResolvedAttributeSet resolvedAttributeSet = this.FetchResolvedAttributes(resOpt);
            if (resolvedAttributeSet != null)
                return resolvedAttributeSet.FetchAttributesWithTraits(resOpt, queryFor);
            return null;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.EntityDef;
        }

        public ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null)
        {
            bool wasPreviouslyResolving = this.Ctx.Corpus.isCurrentlyResolving;
            this.Ctx.Corpus.isCurrentlyResolving = true;
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            // this whole resolved entity ref goo will go away when resolved documents are done.
            // for now, it breaks if structured att sets get made.
            resOpt = resOpt.Copy();
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
            this.Ctx.Corpus.isCurrentlyResolving = wasPreviouslyResolving;
            return entRefSetCache;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            return this.IsDerivedFromDef(resOpt, this.ExtendsEntityRef, this.GetName(), baseDef);
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.EntityName))
            {
                IEnumerable<string> missingFields = new List<string> { "EntityName" };
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
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + this.EntityName;
                    this.DeclaredPath = path;
                }
            }
            //trackVisits(path);

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.ExtendsEntity?.Visit(path + "/extendsEntity/", preChildren, postChildren) == true)
                return true;
            if (this.ExtendsEntityResolutionGuidance != null) this.ExtendsEntityResolutionGuidance.Owner = this;
            if (this.ExtendsEntityResolutionGuidance != null)
                if (this.ExtendsEntityResolutionGuidance.Visit(pathFrom + "/extendsEntityResolutionGuidance/", preChildren, postChildren))
                    return true;
            if (this.VisitDef(path, preChildren, postChildren))
                return true;
            if (this.AttributeContext != null) this.AttributeContext.Owner = this;
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

        /// Query the entity for a set of attributes that match an input query.
        /// A JSON object (or a string that can be parsed into one) of the form {"attributeName":"", "attributeOrdinal": -1, "traits":[see next]}. 
        /// Matched attributes have each of the traits in the array.
        /// The trait object is specified as {"traitName": queried trait name or base trait name, (optional) "arguments":[{"argumentName": queried argument, "value": queried value}]}.
        /// Returns null for 0 results or an array of json objects, each matching the shape of the input query, with attribute names filled in.
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
            ResolvedAttributeSetBuilder rasb = this.Rasb; // local var needed because we now allow reentry
            rasb.ResolvedAttributeSet.AttributeContext = under;

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
                    extendsRefUnder = rasb.ResolvedAttributeSet.CreateAttributeContext(resOpt, acpExt);
                }

                if (extRef.ExplicitReference != null && extRef.FetchObjectDefinition<CdmObjectDefinition>(resOpt).ObjectType == CdmObjectType.ProjectionDef)
                {
                    // A Projection

                    CdmObjectDefinition extRefObjDef = extRef.FetchObjectDefinition<CdmObjectDefinition>(resOpt);
                    if (extendsRefUnder != null)
                    {
                        acpExtEnt = new AttributeContextParameters
                        {
                            under = extendsRefUnder,
                            type = CdmAttributeContextType.Projection,
                            Name = extRefObjDef.GetName(),
                            Regarding = extRef,
                            IncludeTraits = false
                        };
                    }

                    ProjectionDirective projDirective = new ProjectionDirective(resOpt, this, ownerRef: extRef);
                    CdmProjection projDef = (CdmProjection)extRefObjDef;
                    ProjectionContext projCtx = projDef.ConstructProjectionContext(projDirective, extendsRefUnder);

                    rasb.ResolvedAttributeSet = projDef.ExtractResolvedAttributes(projCtx, under);
                }
                else
                {
                    // An Entity Reference

                    if (extendsRefUnder != null)
                    {
                        // usually the extended entity is a reference to a name.
                        // it is allowed however to just define the entity inline.
                        acpExtEnt = new AttributeContextParameters
                        {
                            under = extendsRefUnder,
                            type = CdmAttributeContextType.Entity,
                            Name = extRef.NamedReference ?? extRef.ExplicitReference.GetName(),
                            Regarding = extRef,
                            IncludeTraits = true // "Entity" is the thing with traits - That perches in the tree - And sings the tune and never waits - To see what it should be.
                        };
                    }

                    rasb.MergeAttributes((this.ExtendsEntityRef as CdmObjectReferenceBase).FetchResolvedAttributes(resOpt, acpExtEnt));

                    if (!resOpt.CheckAttributeCount(rasb.ResolvedAttributeSet.ResolvedAttributeCount))
                    {
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(ConstructResolvedAttributes), this.AtCorpusPath, CdmLogCode.ErrRelMaxResolvedAttrReached, this.EntityName);
                        return null;
                    }

                    if (this.ExtendsEntityResolutionGuidance != null)
                    {
                        // some guidance was given on how to integrate the base attributes into the set. apply that guidance
                        ResolvedTraitSet rtsBase = this.FetchResolvedTraits(resOpt);

                        // this context object holds all of the info about what needs to happen to resolve these attributes.
                        // make a copy and set defaults if needed
                        CdmAttributeResolutionGuidance resGuide = (CdmAttributeResolutionGuidance)this.ExtendsEntityResolutionGuidance.Copy(resOpt);
                        resGuide.UpdateAttributeDefaults(resGuide.FetchObjectDefinitionName(), this);
                        // holds all the info needed by the resolver code
                        AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuide, rtsBase);

                        rasb.GenerateApplierAttributes(arc, false); // true = apply the prepared traits to new atts
                    }

                }
            }

            rasb.MarkInherited();
            rasb.ResolvedAttributeSet.AttributeContext = under;

            if (this.Attributes != null)
            {
                int furthestChildDepth = 0;
                int l = this.Attributes.Count;
                for (int i = 0; i < l; i++)
                {
                    CdmObjectBase att = this.Attributes[i] as CdmObjectBase;
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

                    ResolvedAttributeSet rasFromAtt = att.FetchResolvedAttributes(resOpt, acpAtt);

                    // we can now set depth now that children nodes have been resolved
                    if (att is CdmEntityAttributeDefinition)
                        furthestChildDepth = rasFromAtt.DepthTraveled > furthestChildDepth ? rasFromAtt.DepthTraveled : furthestChildDepth;

                    // before we just merge, need to handle the case of 'attribute restatement' AKA an entity with an attribute having the same name as an attribute
                    // from a base entity. thing might come out with different names, if they do, then any attributes owned by a similar named attribute before
                    // that didn't just pop out of that same named attribute now need to go away.
                    // mark any attributes formerly from this named attribute that don't show again as orphans
                    rasb.ResolvedAttributeSet.MarkOrphansForRemoval((att as CdmAttributeItem).FetchObjectDefinitionName(), rasFromAtt);
                    // now merge
                    rasb.MergeAttributes(rasFromAtt);

                    if (!resOpt.CheckAttributeCount(rasb.ResolvedAttributeSet.ResolvedAttributeCount))
                    {
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(ConstructResolvedAttributes), this.AtCorpusPath, CdmLogCode.ErrRelMaxResolvedAttrReached, this.EntityName);
                        return null;
                    }
                }
                rasb.ResolvedAttributeSet.DepthTraveled = furthestChildDepth;
            }
            rasb.MarkOrder();
            rasb.ResolvedAttributeSet.AttributeContext = under;

            // things that need to go away
            rasb.RemoveRequestedAtts();

            // recursively sets the target owner's to be this entity.
            // required because the replaceAsForeignKey operation uses the owner to generate the `is.linkedEntity.identifier` trait.
            rasb.ResolvedAttributeSet.SetTargetOwner(this);

            return rasb;
        }

        /// <summary>
        /// Creates a resolved copy of the entity.
        /// </summary>
        public async Task<CdmEntityDefinition> CreateResolvedEntityAsync(string newEntName, ResolveOptions resOpt = null, CdmFolderDefinition folder = null, string newDocName = null)
        {
            using (Logger.EnterScope(nameof(CdmEntityDefinition), Ctx, nameof(CreateResolvedEntityAsync)))
            {
                if (resOpt == null)
                {
                    resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
                }

                if (resOpt.WrtDoc == null)
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(CreateResolvedEntityAsync), this.AtCorpusPath, CdmLogCode.ErrDocWrtDocNotfound);
                    return null;
                }

                if (string.IsNullOrEmpty(newEntName))
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(CreateResolvedEntityAsync), this.AtCorpusPath, CdmLogCode.ErrResolveEntityNotFound);
                    return null;
                }

                // if the wrtDoc needs to be indexed (like it was just modified) then do that first
                if (!await resOpt.WrtDoc.IndexIfNeeded(resOpt, true))
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(CreateResolvedEntityAsync), this.AtCorpusPath, CdmLogCode.ErrIndexFailed);
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
                if (StringUtils.EqualsWithIgnoreCase(targetAtCorpusPath, origDoc))
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(CreateResolvedEntityAsync), this.AtCorpusPath, CdmLogCode.ErrDocEntityReplacementFailure, targetAtCorpusPath);
                    return null;
                }

                // make sure the corpus has a set of default artifact attributes 
                await this.Ctx.Corpus.PrepareArtifactAttributesAsync();

                // make the top level attribute context for this entity
                // for this whole section where we generate the attribute context tree and get resolved attributes
                // set the flag that keeps all of the parent changes and document dirty from from happening 
                bool wasResolving = this.Ctx.Corpus.isCurrentlyResolving;
                this.Ctx.Corpus.isCurrentlyResolving = true;
                string entName = newEntName;
                ResolveContext ctx = this.Ctx as ResolveContext;
                CdmAttributeContext attCtxEnt = ctx.Corpus.MakeObject<CdmAttributeContext>(CdmObjectType.AttributeContextDef, entName, true);
                attCtxEnt.Ctx = ctx;
                attCtxEnt.InDocument = this.InDocument;

                // cheating a bit to put the paths in the right place
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = attCtxEnt,
                    type = CdmAttributeContextType.AttributeGroup,
                    Name = "attributeContext"
                };
                CdmAttributeContext attCtxAC = CdmAttributeContext.CreateChildUnder(resOpt, acp);
                // this is the node that actually is first in the context we save. all definition refs should take the new perspective that they
                // can only be understood through the resolvedFrom moniker
                CdmEntityReference entRefThis = ctx.Corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, this.GetName(), true);
                entRefThis.Owner = this;
                entRefThis.InDocument = this.InDocument; // need to set owner and inDocument to this starting entity so the ref will be portable to the new document
                CdmObject prevOwner = this.Owner;
                entRefThis.ExplicitReference = this;
                // we don't want to change the owner of this entity to the entity reference
                // re-assign whatever was there before
                this.Owner = prevOwner;
                AttributeContextParameters acpEnt = new AttributeContextParameters
                {
                    under = attCtxAC,
                    type = CdmAttributeContextType.Entity,
                    Name = entName,
                    Regarding = entRefThis
                };

                // reset previous depth information in case there are left overs
                resOpt.DepthInfo.Reset();

                ResolveOptions resOptCopy = CdmAttributeContext.PrepareOptionsForResolveAttributes(resOpt);

                // resolve attributes with this context. the end result is that each resolved attribute
                // points to the level of the context where it was last modified, merged, created
                var ras = this.FetchResolvedAttributes(resOptCopy, acpEnt);

                if (ras == null)
                {
                    return null;
                }

                this.Ctx.Corpus.isCurrentlyResolving = wasResolving;

                // make a new document in given folder if provided or the same folder as the source entity
                folder.Documents.Remove(fileName);
                CdmDocumentDefinition docRes = folder.Documents.Add(fileName);
                // add a import of the source document 
                origDoc = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(origDoc, docRes); // just in case we missed the prefix
                docRes.Imports.Add(origDoc, "resolvedFrom");
                docRes.DocumentVersion = this.InDocument.DocumentVersion;
                // make the empty entity
                CdmEntityDefinition entResolved = docRes.Definitions.Add(entName);

                // grab that context that comes from fetchResolvedAttributes. We are sure this tree is a copy that we can own, so no need to copy it again
                CdmAttributeContext attCtx = null;
                if (attCtxAC != null && attCtxAC.Contents != null && attCtxAC.Contents.Count == 1)
                {
                    attCtx = attCtxAC.Contents[0] as CdmAttributeContext;
                }
                entResolved.AttributeContext = attCtx;

                if (attCtx != null)
                {
                    // fix all of the definition references, parent and lineage references, owner documents, etc. in the context tree
                    attCtx.FinalizeAttributeContext(resOptCopy, $"{entName}/attributeContext/", docRes, this.InDocument, "resolvedFrom", true);

                    // TEST CODE
                    // run over the resolved attributes and make sure none have the dummy context
                    //Action<ResolvedAttributeSet> testResolveAttributeCtx = null;
                    //testResolveAttributeCtx = (rasSub) =>
                    //{
                    //    if (rasSub.Set.Count != 0 && rasSub.AttributeContext.AtCoprusPath.StartsWith("cacheHolder"))
                    //        System.Diagnostics.Debug.WriteLine("Bad");
                    //    rasSub.Set.ForEach(ra =>
                    //    {
                    //        if (ra.AttCtx.AtCoprusPath.StartsWith("cacheHolder"))
                    //            System.Diagnostics.Debug.WriteLine("Bad");

                    //        // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
                    //        if (ra.Target is ResolvedAttributeSet)
                    //        {
                    //            testResolveAttributeCtx(ra.Target as ResolvedAttributeSet);
                    //        }
                    //    });
                    //};
                    //testResolveAttributeCtx(ras);

                }

                // add the traits of the entity, also add to attribute context top node
                ResolvedTraitSet rtsEnt = this.FetchResolvedTraits(resOpt);
                rtsEnt.Set.ForEach(rt =>
                {
                    var traitRef = CdmObjectBase.ResolvedTraitToTraitRef(resOptCopy, rt);
                    (entResolved as CdmObjectDefinition).ExhibitsTraits.Add(traitRef);
                    traitRef = CdmObjectBase.ResolvedTraitToTraitRef(resOptCopy, rt); // fresh copy
                    entResolved.AttributeContext?.ExhibitsTraits.Add(traitRef);
                });

                // special trait to explain this is a resolved entity
                entResolved.IndicateAbstractionLevel("resolved", resOpt);

                if (entResolved.AttributeContext != null)
                {
                    // the attributes have been named, shaped, etc for this entity so now it is safe to go and 
                    // make each attribute context level point at these final versions of attributes

                    // what we have is a resolved attribute set (maybe with structure) where each ra points at the best tree node
                    // we also have the tree of context, we need to flip this around so that the right tree nodes point at the paths to the
                    // right attributes. so run over the resolved atts and then add a path reference to each one into the context contents where is last lived
                    IDictionary<string, int> attPath2Order = new Dictionary<string, int>();
                    HashSet<string> finishedGroups = new HashSet<string>();
                    HashSet<CdmAttributeContext> allPrimaryCtx = new HashSet<CdmAttributeContext>(); // keep a list so it is easier to think about these later
                    Action<ResolvedAttributeSet, string> pointContextAtResolvedAtts = null;
                    pointContextAtResolvedAtts = (rasSub, path) =>
                    {
                        rasSub.Set.ForEach(ra =>
                        {
                            var raCtx = ra.AttCtx;
                            var refs = raCtx.Contents;
                            allPrimaryCtx.Add(raCtx);

                            string attRefPath = path + ra.ResolvedName;
                            // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
                            if ((ra.Target as CdmAttribute)?.GetType().GetMethod("GetObjectType") != null)
                            {
                                // it was an attribute, add to the content of the context, also, keep track of the ordering for all of the att paths we make up
                                // as we go through the resolved attributes, this is the order of atts in the final resolved entity
                                if (!attPath2Order.ContainsKey(attRefPath))
                                {
                                    var attRef = this.Ctx.Corpus.MakeObject<CdmObjectReferenceBase>(CdmObjectType.AttributeRef, attRefPath, true);
                                    // only need one explanation for this path to the insert order
                                    attPath2Order.Add(attRef.NamedReference, ra.InsertOrder);
                                    raCtx.Contents.Add(attRef);
                                }
                            }
                            else
                            {
                                // a group, so we know an attribute group will get created later with the name of the group and the things it contains will be in
                                // the members of that group
                                attRefPath += "/members/";
                                if (!finishedGroups.Contains(attRefPath))
                                {
                                    pointContextAtResolvedAtts(ra.Target as ResolvedAttributeSet, attRefPath);
                                    finishedGroups.Add(attRefPath);
                                }
                            }
                        });
                    };

                    pointContextAtResolvedAtts(ras, entName + "/hasAttributes/");

                    // the generated attribute structures sometimes has a LOT of extra nodes that don't say anything or explain anything
                    // our goal now is to prune that tree to just have the stuff one may need
                    // do this by keeping the leafs and all of the lineage nodes for the attributes that end up in the resolved entity
                    // along with some special nodes that explain entity structure and inherit

                    // run over the whole tree and make a set of the nodes that should be saved for sure. This is anything NOT under a generated set 
                    // (so base entity chains, entity attributes entity definitions)
                    HashSet<CdmAttributeContext> nodesToSave = new HashSet<CdmAttributeContext>();
                    Func<CdmObject, bool> SaveStructureNodes = null;
                    SaveStructureNodes = (subItem) =>
                    {
                        CdmAttributeContext ac = subItem as CdmAttributeContext;
                        if (ac == null || ac.Type == CdmAttributeContextType.GeneratedSet)
                        {
                            return true;
                        }
                        nodesToSave.Add(ac);
                        if (ac.Contents == null || ac.Contents.Count == 0)
                        {
                            return true;
                        }
                        // look at all children
                        foreach (var subSub in ac.Contents)
                        {
                            if (SaveStructureNodes(subSub) == false)
                            {
                                return false;
                            }
                        }
                        return true;
                    };
                    if (SaveStructureNodes(attCtx) == false)
                        return null;

                    // next, look at the attCtx for every resolved attribute. follow the lineage chain and mark all of those nodes as ones to save
                    // also mark any parents of those as savers

                    // helper that save the passed node and anything up the parent chain 
                    Func<CdmAttributeContext, bool> SaveParentNodes = null;
                    SaveParentNodes = (currNode) =>
                    {
                        if (nodesToSave.Contains(currNode))
                        {
                            return true;
                        }
                        nodesToSave.Add(currNode);
                        // get the parent 
                        if (currNode.Parent != null && currNode.Parent.ExplicitReference != null)
                        {
                            return SaveParentNodes(currNode.Parent.ExplicitReference as CdmAttributeContext);
                        }
                        return true;
                    };

                    // helper that saves the current node (and parents) plus anything in the lineage (with their parents)
                    Func<CdmAttributeContext, bool> SaveLineageNodes = null;
                    SaveLineageNodes = (currNode) =>
                    {
                        if (SaveParentNodes(currNode) == false)
                        {
                            return false;
                        }
                        if (currNode.Lineage != null && currNode.Lineage.Count > 0)
                        {
                            foreach (var lin in currNode.Lineage)
                            {
                                if (lin.ExplicitReference != null)
                                {
                                    if (SaveLineageNodes(lin.ExplicitReference as CdmAttributeContext) == false)
                                    {
                                        return false;
                                    }
                                }
                            }
                        }
                        return true;
                    };

                    // so, do that ^^^ for every primary context found earlier
                    foreach (var primCtx in allPrimaryCtx)
                    {
                        if (SaveLineageNodes(primCtx) == false)
                        {
                            return null;
                        }
                    }

                    // now the cleanup, we have a set of the nodes that should be saved
                    // run over the tree and re-build the contents collection with only the things to save
                    Func<CdmObject, bool> CleanSubGroup = null;
                    CleanSubGroup = (subItem) =>
                    {
                        if (subItem.ObjectType == CdmObjectType.AttributeRef)
                        {
                            return true; // not empty
                        }

                        CdmAttributeContext ac = subItem as CdmAttributeContext;

                        if (nodesToSave.Contains(ac) == false)
                        {
                            return false; // don't even look at content, this all goes away
                        }

                        if (ac.Contents != null && ac.Contents.Count > 0)
                        {
                            // need to clean up the content array without triggering the code that fixes in document or paths
                            var newContent = new List<CdmObject>();
                            foreach (var sub in ac.Contents)
                            {
                                // true means keep this as a child
                                if (CleanSubGroup(sub) == true)
                                {
                                    newContent.Add(sub);
                                }
                            }
                            // clear the old content and replace
                            ac.Contents.AllItems.Clear();
                            ac.Contents.AllItems.AddRange(newContent);
                        }

                        return true;
                    };
                    CleanSubGroup(attCtx);

                    // create an all-up ordering of attributes at the leaves of this tree based on insert order
                    // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
                    Func<CdmAttributeContext, int?> orderContents = null;
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

                    // resolved attributes can gain traits that are applied to an entity when referenced
                    // since these traits are described in the context, it is redundant and messy to list them in the attribute
                    // so, remove them. create and cache a set of names to look for per context 
                    // there is actually a hierarchy to all attributes from the base entity should have all traits applied independently of the 
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
                            CdmAttributeContext raCtx = ra.AttCtx;

                            if (ra.Target is ResolvedAttributeSet)
                            {
                                // this is a set of attributes.
                                // make an attribute group to hold them
                                CdmAttributeGroupDefinition attGrp = this.Ctx.Corpus.MakeObject<CdmAttributeGroupDefinition>(CdmObjectType.AttributeGroupDef, ra.ResolvedName, false);
                                attGrp.AttributeContext = this.Ctx.Corpus.MakeObject<CdmAttributeContextReference>(CdmObjectType.AttributeContextRef, raCtx.AtCorpusPath, true);
                                // debugLineage
                                //attGrp.AttributeContext.NamedReference = $"{ raCtx.AtCoprusPath}({raCtx.Id})";

                                // take any traits from the set and make them look like traits exhibited by the group
                                HashSet<string> avoidSet = ctx2traitNames[raCtx];
                                // traits with the same name can show up on entities and attributes AND have different meanings.
                                avoidSet.Clear();

                                ResolvedTraitSet rtsAtt = ra.ResolvedTraits;
                                rtsAtt.Set.ForEach(rt =>
                                {
                                    if (rt.Trait.Ugly != true)
                                    {
                                        // don't mention your ugly traits
                                        if (avoidSet?.Contains(rt.TraitName) != true)
                                        {
                                            // avoid the ones from the context
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
                                // debugLineage
                                //att.AttributeContext.NamedReference = $"{ raCtx.AtCoprusPath}({raCtx.Id})";

                                HashSet<string> avoidSet = ctx2traitNames[raCtx];
                                // i don't know why i thought this was the right thing to do,
                                // traits with the same name can show up on entities and attributes AND have different meanings.
                                avoidSet.Clear();
                                // i really need to figure out the effects of this before making this change
                                // without it, some traits don't make it to the resolved entity
                                // with it, too many traits might make it there

                                ResolvedTraitSet rtsAtt = ra.ResolvedTraits;
                                rtsAtt.Set.ForEach(rt =>
                                {
                                    if (rt.Trait.Ugly != true)
                                    { // don't mention your ugly traits
                                        if (avoidSet?.Contains(rt.TraitName) != true)
                                        { // avoid the ones from the context
                                            var traitRef = CdmObjectBase.ResolvedTraitToTraitRef(resOptCopy, rt);
                                            ((CdmTypeAttributeDefinition)att).AppliedTraits.Add(traitRef);

                                            // the trait that points at other entities for foreign keys, that is trouble
                                            // the string value in the table needs to be a relative path from the document of this entity
                                            // to the document of the related entity. but, right now it is a relative path to the source entity
                                            // so find those traits, and adjust the paths in the tables they hold
                                            if (rt.TraitName == "is.linkedEntity.identifier")
                                            {
                                                // grab the content of the table from the new ref (should be a copy of orig) 
                                                List<List<string>> linkTable = null;
                                                if (traitRef.Arguments != null && traitRef.Arguments.Count > 0)
                                                {
                                                    linkTable = ((traitRef.Arguments?[0].Value as CdmEntityReference)?
                                                                    .ExplicitReference as CdmConstantEntityDefinition)?
                                                                    .ConstantValues;
                                                }
                                                if (linkTable != null && linkTable.Count > 0)
                                                {
                                                    foreach (var row in linkTable)
                                                    {
                                                        if (row.Count == 2 || row.Count == 3) // either the old table or the new one with relationship name can be there
                                                        {
                                                            // entity path an attribute name
                                                            string fixedPath = row[0];
                                                            fixedPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(fixedPath, this.InDocument); // absolute from relative to this
                                                            fixedPath = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(fixedPath, docRes); // realtive to new entity
                                                            row[0] = fixedPath;
                                                        }
                                                    }
                                                }
                                            }
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
                                        var newAttRef = this.Ctx.Corpus.MakeRef<CdmAttributeReference>(CdmObjectType.AttributeRef, entityHint + "/(resolvedAttributes)/" + attRef.NamedReference, true);
                                        // inDocument is not propagated during resolution, so set it here
                                        newAttRef.InDocument = arg.InDocument;
                                        arg.Value = newAttRef;
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
                    var entAttributes = entResolved.Attributes;
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
                }

                // we are about to put this content created in the context of various documents (like references to attributes from base entities, etc.)
                // into one specific document. all of the borrowed refs need to work. so, re-write all string references to work from this new document
                // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes.
                // the fix needs to happen in the middle of the refresh
                // trigger the document to refresh current content into the resolved OM
                if (attCtx != null)
                    attCtx.Parent = null; // remove the fake parent that made the paths work
                ResolveOptions resOptNew = resOpt.Copy();
                resOptNew.LocalizeReferencesFor = docRes;
                resOptNew.WrtDoc = docRes;
                if (!await docRes.RefreshAsync(resOptNew))
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(CreateResolvedEntityAsync), this.AtCorpusPath, CdmLogCode.ErrIndexFailed);
                    return null;
                }

                // get a fresh ref
                entResolved = docRes.FetchObjectFromDocumentPath(entName, resOptNew) as CdmEntityDefinition;

                this.Ctx.Corpus.resEntMap[this.AtCorpusPath] = entResolved.AtCorpusPath;

                return entResolved;
            }
        }

        /// <summary>
        /// creates or sets the has.entitySchemaAbstractionLevel trait to logical, composition, resolved or unknown
        /// todo: consider making this public API
        /// </summary>
        internal void IndicateAbstractionLevel(string level, ResolveOptions resOpt)
        {
            // see if entitySchemaAbstractionLevel is a known trait to this entity
            if (resOpt!= null && 
                this.Ctx.Corpus.ResolveSymbolReference(resOpt, this.InDocument, "has.entitySchemaAbstractionLevel", CdmObjectType.TraitDef, retry: false) == null)
            {
                return;
            }

            // get or add the trait
            CdmTraitReference traitRef = this.ExhibitsTraits.Item("has.entitySchemaAbstractionLevel");
            if (traitRef == null)
            {
                traitRef = new CdmTraitReference(this.Ctx, "has.entitySchemaAbstractionLevel", false, true);
                this.ExhibitsTraits.Add(traitRef);
            }
            // get or add the one argument
            CdmArgumentDefinition argDef;
            if (traitRef.Arguments != null && traitRef.Arguments.Count == 1)
            {
                argDef = traitRef.Arguments[0];
            }
            else
            {
                argDef = new CdmArgumentDefinition(this.Ctx, "level");
                traitRef.Arguments.Add(argDef);
            }
            // set it
            argDef.Value = level;
        }
    }
}
