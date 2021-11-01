// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Microsoft.CommonDataModel.ObjectModel.Storage;

    public class CdmManifestDefinition : CdmDocumentDefinition, CdmObjectDefinition, CdmFileStatus
    {
        private static readonly string Tag = nameof(CdmManifestDefinition);
        /// <summary>
        /// Gets or sets the manifest name.
        /// </summary>
        public string ManifestName { get; set; }

        /// <summary>
        /// Gets or sets the manifest explanation.
        /// </summary>
        public string Explanation { get; set; }

        /// <summary>
        /// Gets or sets the last file status check time.
        /// </summary>
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// Gets or sets the last file modified time.
        /// </summary>
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the last child file modified time.
        /// </summary>
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }

        /// <summary>
        /// Gets the collection of sub-manifests.
        /// </summary>
        public CdmCollection<CdmManifestDeclarationDefinition> SubManifests { get; }

        /// <summary>
        /// Gets the entities (could only be CdmLocalEntityDeclaration or CdmReferencedEntityDeclaration).
        /// </summary>
        public CdmEntityCollection Entities { get; }

        /// <inheritdoc />
        public CdmTraitCollection ExhibitsTraits { get; }

        /// <summary>
        /// Gets the collection of references that exist where either the from entity or the to entity is defined in this folder.
        /// </summary>
        public CdmCollection<CdmE2ERelationship> Relationships { get; }

        /// <inheritdoc />
        public string GetName()
        {
            return this.ManifestName;
        }

        internal string GetObjectPath()
        {
            return this.AtCorpusPath;
        }

        /// <summary>
        /// Constructs a CdmManifestDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The manifest name.</param>
        public CdmManifestDefinition(CdmCorpusContext ctx, string name)
            : base(ctx, $"{name}.manifest.cdm.json")
        {
            this.ObjectType = CdmObjectType.ManifestDef;
            this.ManifestName = name;

            this.SubManifests = new CdmCollection<CdmManifestDeclarationDefinition>(this.Ctx, this, CdmObjectType.ManifestDeclarationDef);
            this.Entities = new CdmEntityCollection(this.Ctx, this);
            this.Relationships = new CdmCollection<CdmE2ERelationship>(this.Ctx, this, CdmObjectType.E2ERelationshipDef);
            this.ExhibitsTraits = new CdmTraitCollection(this.Ctx, this);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ManifestDef;
        }

        /// <inheritdoc />
        public new bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (preChildren != null && preChildren.Invoke(this, pathFrom))
                return false;
            if (this.Definitions != null)
                if (this.Definitions.VisitList(pathFrom, preChildren, postChildren))
                    return true;
            if (this.Entities != null)
            {
                if (this.Entities.VisitList(pathFrom, preChildren, postChildren))
                    return true;
            }
            if (this.Relationships != null)
                if (this.Relationships.VisitList(pathFrom + "/relationships/", preChildren, postChildren))
                    return true;
            if (this.SubManifests != null)
                if (this.SubManifests.VisitList(pathFrom + "/subManifests/", preChildren, postChildren))
                    return true;
            if (postChildren != null && postChildren.Invoke(this, pathFrom))
                return true;
            return false;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            // since we need to call the base copy which will only return a document when there is no host, make a fake host here
            CdmManifestDefinition tempHost = host as CdmManifestDefinition;
            if (tempHost == null)
                tempHost = new CdmManifestDefinition(this.Ctx, this.ManifestName);

            CdmManifestDefinition copy = base.Copy(resOpt, tempHost) as CdmManifestDefinition;
            copy.ManifestName = this.ManifestName;
            copy.Explanation = this.Explanation;
            copy.LastFileStatusCheckTime = this.LastFileStatusCheckTime;
            copy.LastFileModifiedTime = this.LastFileModifiedTime;
            copy.LastChildFileModifiedTime = this.LastChildFileModifiedTime;

            copy.Entities.Clear();
            foreach (var ent in this.Entities)
                copy.Entities.Add(ent.Copy(resOpt) as CdmEntityDeclarationDefinition);
            copy.Relationships.Clear();
            foreach (var rel in this.Relationships)
                copy.Relationships.Add(rel.Copy(resOpt) as CdmE2ERelationship);
            copy.SubManifests.Clear();
            foreach (var man in this.SubManifests)
                copy.SubManifests.Add(man.Copy(resOpt) as CdmManifestDeclarationDefinition);
            copy.ExhibitsTraits.Clear();
            foreach (var et in this.ExhibitsTraits)
                copy.ExhibitsTraits.Add(et.Copy() as CdmTraitReferenceBase);

            return copy;
        }


        /// <summary>
        /// Creates a resolved copy of the manifest.
        /// newEntityDocumentNameFormat specifies a pattern to use when creating documents for resolved entites.
        /// The default is "{f}resolved/{n}.cdm.json" to avoid a document name conflict with documents in the same folder as the manifest. 
        /// Every instance of the string {n} is replaced with the entity name from the source manifest.
        /// Every instance of the string {f} is replaced with the folder path from the source manifest to the source entity
        /// (if there is one that is possible as a relative location, else nothing).
        /// </summary>
        /// <param name="newManifestName"></param>
        /// <param name="newEntityDocumentNameFormat"></param>
        /// <param name="Directives"></param>
        /// <returns></returns>
        public async Task<CdmManifestDefinition> CreateResolvedManifestAsync(string newManifestName, string newEntityDocumentNameFormat, AttributeResolutionDirectiveSet Directives = null)
        {
            using (Logger.EnterScope(nameof(CdmManifestDefinition), Ctx, nameof(CreateResolvedManifestAsync)))
            {
                if (this.Entities == null)
                {
                    return null;
                }
                if (this.Folder == null)
                {
                    Logger.Error(this.Ctx as ResolveContext,Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, CdmLogCode.ErrResolveManifestFailed, this.ManifestName);
                    return null;
                }

                if (newEntityDocumentNameFormat == null)
                    newEntityDocumentNameFormat = "{f}resolved/{n}.cdm.json";
                else if (newEntityDocumentNameFormat == "") // for back compat
                    newEntityDocumentNameFormat = "{n}.cdm.json";
                else if (!newEntityDocumentNameFormat.Contains("{n}")) // for back compat
                    newEntityDocumentNameFormat = newEntityDocumentNameFormat + "/{n}.cdm.json";

                string sourceManifestPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(this.AtCorpusPath, this);
                string sourceManifestFolderPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(this.Folder.AtCorpusPath, this);

                int resolvedManifestPathSplit = newManifestName.LastIndexOf("/") + 1;
                CdmFolderDefinition resolvedManifestFolder;
                if (resolvedManifestPathSplit > 0)
                {
                    var resolvedManifestPath = newManifestName.Substring(0, resolvedManifestPathSplit);
                    var newFolderPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(resolvedManifestPath, this);
                    resolvedManifestFolder = await this.Ctx.Corpus.FetchObjectAsync<CdmFolderDefinition>(newFolderPath);
                    if (resolvedManifestFolder == null)
                    {
                        Logger.Error(this.Ctx as ResolveContext, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, CdmLogCode.ErrResolveFolderNotFound, newFolderPath);
                        return null;
                    }
                    newManifestName = newManifestName.Substring(resolvedManifestPathSplit);
                }
                else
                {
                    resolvedManifestFolder = this.Owner as CdmFolderDefinition;
                }

                if (resolvedManifestFolder.Documents.Item(newManifestName) != null)
                {
                    Logger.Error(this.Ctx as ResolveContext, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, CdmLogCode.ErrResolveManifestExists, newManifestName, resolvedManifestFolder.AtCorpusPath);
                    return null;
                }

                Logger.Debug(this.Ctx as ResolveContext, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, $"resolving manifest {sourceManifestPath}");

                // Using the references present in the resolved entities, get an entity
                // create an imports doc with all the necessary resolved entity references and then resolve it
                // sometimes they might send the docname, that makes sense a bit, don't include the suffix in the name
                if (newManifestName.ToLowerInvariant().EndsWith(".manifest.cdm.json"))
                    newManifestName = newManifestName.Substring(0, newManifestName.Length - ".manifest.cdm.json".Length);
                var resolvedManifest = new CdmManifestDefinition(this.Ctx, newManifestName);

                // bring over any imports in this document or other bobbles
                resolvedManifest.Schema = this.Schema;
                resolvedManifest.Explanation = this.Explanation;
                resolvedManifest.DocumentVersion = this.DocumentVersion;
                foreach (CdmImport imp in this.Imports)
                {
                    resolvedManifest.Imports.Add((CdmImport)imp.Copy());
                }

                // add the new document to the folder
                if (resolvedManifestFolder.Documents.Add(resolvedManifest) == null)
                {
                    // when would this happen? 
                    return null;
                }

                foreach (var entity in this.Entities)
                {

                    string entityPath = await this.GetEntityPathFromDeclaration(entity, this);
                    CdmEntityDefinition entDef = await this.Ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(entityPath);

                    if (entDef == null)
                        Logger.Error(this.Ctx, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, CdmLogCode.ErrResolveEntityFailure, entityPath);

                    if (entDef.InDocument.Folder == null)
                    {
                        Logger.Error(this.Ctx as ResolveContext, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, CdmLogCode.ErrDocIsNotFolder, entDef.EntityName);
                        return null;
                    }
                    // get the path from this manifest to the source entity. this will be the {f} replacement value
                    string sourceEntityFullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(entDef.InDocument.Folder.AtCorpusPath, this);
                    string f = "";
                    if (sourceEntityFullPath.StartsWith(sourceManifestFolderPath))
                    {
                        f = sourceEntityFullPath.Substring(sourceManifestFolderPath.Length);
                    }

                    string newDocumentFullPath = newEntityDocumentNameFormat.Replace("{n}", entDef.EntityName);

                    newDocumentFullPath = newDocumentFullPath.Replace("{f}", f);
                    newDocumentFullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(newDocumentFullPath, this);

                    int newDocumentPathSplit = newDocumentFullPath.LastIndexOf("/") + 1;
                    string newDocumentPath = newDocumentFullPath.Substring(0, newDocumentPathSplit);
                    string newDocumentName = newDocumentFullPath.Substring(newDocumentPathSplit);

                    // make sure the new folder exists
                    var folder = await this.Ctx.Corpus.FetchObjectAsync<CdmFolderDefinition>(newDocumentPath);
                    if (folder == null)
                    {
                        Logger.Error(this.Ctx as ResolveContext, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, CdmLogCode.ErrResolveFolderNotFound, newDocumentPath);
                        return null;
                    }

                    // Next create the resolved entity
                    AttributeResolutionDirectiveSet withDirectives = Directives != null ? Directives : this.Ctx.Corpus.DefaultResolutionDirectives;
                    var resOpt = new ResolveOptions
                    {
                        WrtDoc = entDef.InDocument,
                        Directives = withDirectives?.Copy()
                    };

                    Logger.Debug(this.Ctx as ResolveContext, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, $"resolving entity {sourceEntityFullPath} to document {newDocumentFullPath}");

                    var resolvedEntity = await entDef.CreateResolvedEntityAsync(entDef.EntityName, resOpt, folder, newDocumentName);
                    if (resolvedEntity == null)
                    {
                        // Fail all resolution, if any one entity resolution fails
                        return null;
                    }

                    var result = entity.Copy(resOpt) as CdmEntityDeclarationDefinition;
                    if (result.ObjectType == CdmObjectType.LocalEntityDeclarationDef)
                    {
                        result.EntityPath = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(resolvedEntity.AtCorpusPath, resolvedManifest) ?? result.AtCorpusPath;
                    }

                    resolvedManifest.Entities.Add(result);
                }

                Logger.Debug(this.Ctx as ResolveContext, Tag, nameof(CreateResolvedManifestAsync), this.AtCorpusPath, "calculating relationships");

                // calculate the entity graph for just this manifest and any submanifests
                await this.Ctx.Corpus.CalculateEntityGraphAsync(resolvedManifest);
                // stick results into the relationships list for the manifest
                // only put in relationships that are between the entities that are used in the manifest
                await resolvedManifest.PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive);

                // needed until Matt's changes with collections where I can propigate
                resolvedManifest.IsDirty = true;
                return resolvedManifest;
            }
        }

        /// <summary>
        /// Populates the relationships that the entities in the current manifest are involved in.
        /// </summary>
        public async Task PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle option = CdmRelationshipDiscoveryStyle.All)
        {
            using (Logger.EnterScope(nameof(CdmManifestDefinition), Ctx, nameof(PopulateManifestRelationshipsAsync)))
            {
                this.Relationships.Clear();
                HashSet<string> relCache = new HashSet<string>();

                if (this.Entities != null)
                {
                    foreach (CdmEntityDeclarationDefinition entDec in this.Entities)
                    {
                        string entPath = await this.GetEntityPathFromDeclaration(entDec, this);
                        CdmEntityDefinition currEntity = await this.Ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(entPath);

                        if (currEntity == null)
                            continue;

                        // handle the outgoing relationships
                        List<CdmE2ERelationship> outgoingRels = this.Ctx.Corpus.FetchOutgoingRelationships(currEntity);
                        if (outgoingRels != null)
                        {
                            foreach (CdmE2ERelationship rel in outgoingRels)
                            {
                                string cacheKey = rel.CreateCacheKey();
                                if (!relCache.Contains(cacheKey) && this.IsRelAllowed(rel, option))
                                {
                                    this.Relationships.Add(this.LocalizeRelToManifest(rel));
                                    relCache.Add(cacheKey);
                                }
                            }
                        }

                        List<CdmE2ERelationship> incomingRels = this.Ctx.Corpus.FetchIncomingRelationships(currEntity);

                        if (incomingRels != null)
                        {
                            foreach (CdmE2ERelationship inRel in incomingRels)
                            {
                                // get entity object for current toEntity
                                CdmEntityDefinition currentInBase = await this.Ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(inRel.ToEntity, this);

                                if (currentInBase == null)
                                    continue;

                                // create graph of inheritance for to currentInBase
                                // graph represented by an array where entity at i extends entity at i+1
                                List<CdmEntityDefinition> toInheritanceGraph = new List<CdmEntityDefinition>();
                                while (currentInBase != null)
                                {
                                    var resOpt = new ResolveOptions
                                    {
                                        WrtDoc = currentInBase.InDocument
                                    };
                                    currentInBase = currentInBase.ExtendsEntity?.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                                    if (currentInBase != null)
                                        toInheritanceGraph.Add(currentInBase);
                                }

                                // add current incoming relationship
                                string cacheKey = inRel.CreateCacheKey();
                                if (!relCache.Contains(cacheKey) && this.IsRelAllowed(inRel, option))
                                {
                                    this.Relationships.Add(this.LocalizeRelToManifest(inRel));
                                    relCache.Add(cacheKey);
                                }

                                // if A points at B, A's base classes must point at B as well
                                foreach (CdmEntityDefinition baseEntity in toInheritanceGraph)
                                {
                                    List<CdmE2ERelationship> incomingRelsForBase = this.Ctx.Corpus.FetchIncomingRelationships(baseEntity);

                                    if (incomingRelsForBase != null)
                                    {
                                        foreach (CdmE2ERelationship inRelBase in incomingRelsForBase)
                                        {
                                            CdmE2ERelationship newRel = new CdmE2ERelationship(this.Ctx, "")
                                            {
                                                FromEntity = inRelBase.FromEntity,
                                                FromEntityAttribute = inRelBase.FromEntityAttribute,
                                                ToEntity = inRel.ToEntity,
                                                ToEntityAttribute = inRel.ToEntityAttribute
                                            };

                                            string baseRelCacheKey = newRel.CreateCacheKey();
                                            if (!relCache.Contains(baseRelCacheKey) && this.IsRelAllowed(newRel, option))
                                            {
                                                this.Relationships.Add(this.LocalizeRelToManifest(newRel));
                                                relCache.Add(baseRelCacheKey);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (this.SubManifests != null)
                    {
                        foreach (CdmManifestDeclarationDefinition subManifestDef in this.SubManifests)
                        {
                            var corpusPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(subManifestDef.Definition, this);
                            var subManifest = await this.Ctx.Corpus.FetchObjectAsync<CdmManifestDefinition>(corpusPath);
                            await subManifest.PopulateManifestRelationshipsAsync(option);
                        }
                    }
                }
            }
        }

        private bool IsRelAllowed(CdmE2ERelationship rel, CdmRelationshipDiscoveryStyle option)
        {
            if (option == CdmRelationshipDiscoveryStyle.None)
            {
                return false;
            }
            else if (option == CdmRelationshipDiscoveryStyle.Exclusive)
            {
                string absoluteFromEntString = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(rel.FromEntity, this);
                // only true if from and to entities are both found in the entities list of this folio
                bool fromEntInManifest = this.Entities.Where(x =>
                {
                    return this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(x.EntityPath, this) == absoluteFromEntString;
                }).ToList().Count > 0;

                string absoluteToEntString = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(rel.ToEntity, this);
                bool toEntInManifest = this.Entities.Where(x =>
                {
                    return this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(x.EntityPath, this) == absoluteToEntString;
                }).ToList().Count > 0;

                return fromEntInManifest && toEntInManifest;
            }
            else
            {
                return true;
            }
        }

        internal async Task<string> GetEntityPathFromDeclaration(CdmEntityDeclarationDefinition entityDec, CdmObject obj = null)
        {
            // keep following referenceEntityDeclaration paths until a LocalentityDeclaration is hit
            while (entityDec is CdmReferencedEntityDeclarationDefinition)
            {
                string currCorpusPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(entityDec.EntityPath, obj);
                entityDec = await this.Ctx.Corpus.FetchObjectAsync<CdmEntityDeclarationDefinition>(currCorpusPath);
                if (entityDec == null)
                    return null;
                obj = entityDec.InDocument;
            }

            return entityDec != null ? this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(entityDec.EntityPath, obj) : null;
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            using (Logger.EnterScope(nameof(CdmManifestDefinition), Ctx, nameof(FileStatusCheckAsync)))
            {
                using (this.Ctx.Corpus.Storage.FetchAdapter(this.InDocument.Namespace)?.CreateFileQueryCacheContext())
                {
                    DateTimeOffset? modifiedTime = await this.Ctx.Corpus.GetLastModifiedTimeFromObjectAsync(this);

                    this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
                    if (this.LastFileModifiedTime == null)
                        this.LastFileModifiedTime = this._fileSystemModifiedTime;

                    // reload the manifest if it has been updated in the file system
                    if (modifiedTime != this._fileSystemModifiedTime)
                    {
                        await this.Reload();
                        this.LastFileModifiedTime = TimeUtils.MaxTime(modifiedTime, this.LastFileModifiedTime);
                        this._fileSystemModifiedTime = this.LastFileModifiedTime;
                    }

                    foreach (var entity in this.Entities)
                        await entity.FileStatusCheckAsync();

                    foreach (var subManifest in this.SubManifests)
                        await subManifest.FileStatusCheckAsync();
                }
            }
        }

        /// <inheritdoc />
        public Task ReportMostRecentTimeAsync(DateTimeOffset? childTime)
        {
            if (childTime != null)
                this.LastChildFileModifiedTime = TimeUtils.MaxTime(childTime, this.LastChildFileModifiedTime);
#if NET45
            return Task.FromResult(0);
#else
            return Task.CompletedTask;
#endif
        }

        /// <summary>
        /// Query the manifest for a set of entities that match an input query.
        /// A JSON object (or a string that can be parsed into one) of the form {"entityName":"", "attributes":[{see QueryOnTraitsAsync for CdmEntityDef for details}]}. 
        /// Returns null for 0 results or an array of json objects, each matching the shape of the input query, with entity and attribute names filled in.
        /// </summary>
        /// <param name="querySpec"></param>
        /// <returns></returns>
        private Task<List<object>> QueryOnTraitsAsync(dynamic querySpec)
        {
            // TODO: This is part of a planned work and currently not used (marked 3 Oct 2019)
            throw new NotImplementedException("Part of an ongoing work");
        }


        /// <summary>
        /// Helper that fixes a path from local to absolute.
        /// Gets the object from that path then looks at the document where the object is found.
        /// If dirty, the document is saved with the original name.
        /// </summary>
        /// <param name="relative"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        private async Task<bool> SaveDirtyLink(string relative, CopyOptions options)
        {
            // get the document object from the import
            string docPath = Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(relative, this);
            if (docPath == null)
            {
                Logger.Error(this.Ctx as ResolveContext, Tag, nameof(SaveDirtyLink), this.AtCorpusPath, CdmLogCode.ErrValdnInvalidCorpusPath, relative);
                return false;
            }
            CdmObject objAt = await Ctx.Corpus.FetchObjectAsync<CdmObject>(docPath);
            if (objAt == null)
            {
                Logger.Error(this.Ctx as ResolveContext, Tag, nameof(SaveDirtyLink), this.AtCorpusPath, CdmLogCode.ErrPersistObjectNotFound, docPath);
                return false;
            }

            CdmDocumentDefinition docImp = objAt.InDocument;

            if (docImp != null && docImp.IsDirty)
            {
                // save it with the same name
                if (await docImp.SaveAsAsync(docImp.Name, true, options) == false)
                {
                    Logger.Error(this.Ctx as ResolveContext, Tag, nameof(SaveDirtyLink), this.AtCorpusPath, CdmLogCode.ErrDocEntityDocSavingFailure, docImp.Name);
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Helper that fixes a path from local to absolute.Gets the object from that path. 
        /// Created from SaveDirtyLink in order to be able to save docs in parallel.
        /// Represents the part of SaveDirtyLink that could not be parallelized.
        /// </summary>
        /// <param name="relativePath"></param>
        /// <returns></returns>
        private async Task<CdmDocumentDefinition> FetchDocumentDefinition(string relativePath)
        {
            // get the document object from the import
            string docPath = Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(relativePath, this);
            if (docPath == null)
            {
                Logger.Error(this.Ctx as ResolveContext, Tag, nameof(FetchDocumentDefinition), this.AtCorpusPath, CdmLogCode.ErrValdnInvalidCorpusPath, relativePath);
                return null;
            }

            ResolveOptions resOpt = new ResolveOptions
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
            };
            CdmObject objAt = await Ctx.Corpus.FetchObjectAsync<CdmObject>(docPath, null, resOpt);
            if (objAt == null)
            {
                Logger.Error(this.Ctx as ResolveContext, Tag, nameof(FetchDocumentDefinition), this.AtCorpusPath, CdmLogCode.ErrPersistObjectNotFound, docPath);
                return null;
            }

            CdmDocumentDefinition document = objAt.InDocument;
            return document;
        }

        /// <summary>
        /// Saves CdmDocumentDefinition if dirty.
        /// Was created from SaveDirtyLink in order to be able to save docs in parallel.
        /// Represents the part of SaveDirtyLink that could be parallelized.
        /// </summary>
        /// <param name="docImp"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        private async Task<bool> SaveDocumentIfDirty(CdmDocumentDefinition docImp, CopyOptions options)
        {
            if (docImp != null && docImp.IsDirty)
            {
                // save it with the same name
                if (await docImp.SaveAsAsync(docImp.Name, true, options) == false)
                {
                    Logger.Error(this.Ctx as ResolveContext, Tag, nameof(SaveDocumentIfDirty), this.AtCorpusPath, CdmLogCode.ErrDocEntityDocSavingFailure, docImp.Name);
                    return false;
                }
            }
            return true;
        }

        override internal async Task<bool> SaveLinkedDocuments(CopyOptions options = null)
        {
            HashSet<string> links = new HashSet<string>();
            if (options == null)
            {
                options = new CopyOptions();
            }

            if (this.Imports != null)
            {
                this.Imports.ToList().ForEach(x => links.Add(x.CorpusPath));
            }
            if (this.Entities != null)
            {
                // only the local entity declarations please
                foreach (CdmEntityDeclarationDefinition def in this.Entities)
                {
                    if (def.ObjectType == CdmObjectType.LocalEntityDeclarationDef)
                    {
                        CdmLocalEntityDeclarationDefinition defImp = def as CdmLocalEntityDeclarationDefinition;
                        links.Add(defImp.EntityPath);

                        // also, partitions can have their own schemas
                        if (defImp.DataPartitions != null)
                        {
                            foreach (CdmDataPartitionDefinition part in defImp.DataPartitions)
                            {
                                if (part.SpecializedSchema != null)
                                {
                                    links.Add(part.SpecializedSchema);
                                }
                            }
                        }
                        // so can patterns
                        if (defImp.DataPartitionPatterns != null)
                        {
                            foreach (CdmDataPartitionPatternDefinition part in defImp.DataPartitionPatterns)
                            {
                                if (part.SpecializedSchema != null)
                                {
                                    links.Add(part.SpecializedSchema);
                                }
                            }
                        }
                    }
                }
            }

            // Get all Cdm documents sequentially
            List<CdmDocumentDefinition> docs = new List<CdmDocumentDefinition>();
            foreach (var link in links)
            {
                CdmDocumentDefinition document = await FetchDocumentDefinition(link);
                if (document == null)
                {
                    return false;
                }
                docs.Add(document);
            }

            // Save all dirty Cdm documents in parallel
            IEnumerable<Task<bool>> tasks = docs.Select(doc => SaveDocumentIfDirty(doc, options));
            var results = await Task.WhenAll(tasks);

            if (this.SubManifests != null)
            {
                foreach (var subDeclaration in this.SubManifests)
                {
                    CdmManifestDefinition subManifest = await FetchDocumentDefinition(subDeclaration.Definition) as CdmManifestDefinition;
                    if (subManifest == null || !await SaveDocumentIfDirty(subManifest, options))
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        internal CdmE2ERelationship LocalizeRelToManifest(CdmE2ERelationship rel)
        {
            CdmE2ERelationship relCopy = this.Ctx.Corpus.MakeObject<CdmE2ERelationship>(CdmObjectType.E2ERelationshipDef, rel.Name);
            relCopy.ToEntity = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(rel.ToEntity, this);
            relCopy.FromEntity = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(rel.FromEntity, this);
            relCopy.ToEntityAttribute = rel.ToEntityAttribute;
            relCopy.FromEntityAttribute = rel.FromEntityAttribute;
            relCopy.ExhibitsTraits.AddRange(rel.ExhibitsTraits);
            return relCopy;
        }
    }
}
