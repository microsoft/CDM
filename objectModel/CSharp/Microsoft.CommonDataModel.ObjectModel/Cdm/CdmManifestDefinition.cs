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
                copy.Entities.Add(ent);
            copy.Relationships.Clear();
            foreach (var rel in this.Relationships)
                copy.Relationships.Add(rel);
            copy.SubManifests.Clear();
            foreach (var man in this.SubManifests)
                copy.SubManifests.Add(man);
            copy.ExhibitsTraits.Clear();
            foreach (var et in this.ExhibitsTraits)
                copy.ExhibitsTraits.Add(et);

            return copy;
        }


        /// Creates a resolved copy of the manifest.
        /// newEntityDocumentNameFormat specifies a pattern to use when creating documents for resolved entites.
        /// The default is "{f}resolved/{n}.cdm.json" to avoid a document name conflict with documents in the same folder as the manifest. 
        /// Every instance of the string {n} is replaced with the entity name from the source manifest.
        /// Every instance of the string {f} is replaced with the folder path from the source manifest to the source entity
        /// (if there is one that is possible as a relative location, else nothing).
        public async Task<CdmManifestDefinition> CreateResolvedManifestAsync(string newManifestName, string newEntityDocumentNameFormat, AttributeResolutionDirectiveSet Directives = null)
        {
            if (this.Entities == null)
            {
                return null;
            }

            if (this.Folder == null)
            {
                Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"Cannot resolve the manifest '{this.ManifestName}' because it has not been added to a folder", nameof(CreateResolvedManifestAsync));
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
                    Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"New folder for manifest not found {newFolderPath}", nameof(CreateResolvedManifestAsync));
                    return null;
                }
                newManifestName = newManifestName.Substring(resolvedManifestPathSplit);
            }
            else
            {
                resolvedManifestFolder = this.Owner as CdmFolderDefinition;
            }

            Logger.Debug(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"resolving manifest {sourceManifestPath}", nameof(CreateResolvedManifestAsync));

            // Using the references present in the resolved entities, get an entity
            // create an imports doc with all the necessary resolved entity references and then resolve it
            var resolvedManifest = new CdmManifestDefinition(this.Ctx, newManifestName);

            // bring over any imports in this document or other bobbles
            resolvedManifest.Schema = this.Schema;
            resolvedManifest.Explanation = this.Explanation;
            foreach (CdmImport imp in this.Imports) {
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
                var entDef = await this.GetEntityFromReference(entity, this);
                if (entDef == null)
                {
                    Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"Unable to get entity from reference", nameof(CreateResolvedManifestAsync));
                    return null;
                }

                if (entDef.InDocument.Folder == null)
                {
                    Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"The document containing the entity '{entDef.EntityName}' is not in a folder", nameof(CreateResolvedManifestAsync));
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
                var folder = await this.Ctx.Corpus.FetchObjectAsync<CdmFolderDefinition>(newDocumentPath) as CdmFolderDefinition;
                if (folder == null)
                {
                    Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"New folder not found {newDocumentPath}", nameof(CreateResolvedManifestAsync));
                    return null;
                }

                // Next create the resolved entity
                AttributeResolutionDirectiveSet withDirectives = Directives != null ? Directives : this.Ctx.Corpus.DefaultResolutionDirectives;
                var resOpt = new ResolveOptions
                {
                    WrtDoc = entDef.InDocument,
                    Directives = withDirectives?.Copy()
                };

                Logger.Debug(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"    resolving entity {sourceEntityFullPath} to document {newDocumentFullPath}", nameof(CreateResolvedManifestAsync));

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

            Logger.Debug(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"    calculating relationships", nameof(CreateResolvedManifestAsync));

            // calculate the entity graph for just this manifest and any submanifests
            await this.Ctx.Corpus.CalculateEntityGraphAsync(resolvedManifest);
            // stick results into the relationships list for the manifest
            // only put in relationships that are between the entities that are used in the manifest
            await resolvedManifest.PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive);

            // needed until Matt's changes with collections where I can propigate
            resolvedManifest.IsDirty = true;
            return resolvedManifest;
        }

        /// <summary>
        /// Populates the relationships that the entities in the current manifest are involved in.
        /// </summary>
        public async Task PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle option = CdmRelationshipDiscoveryStyle.All)
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
                            string cacheKey = rel2CacheKey(rel);
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
                            string cacheKey = rel2CacheKey(inRel);
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

                                        string baseRelCacheKey = rel2CacheKey(newRel);
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

        // finds and returns an entity object from an EntityDeclaration object that probably comes from a manifest
        internal async Task<CdmEntityDefinition> GetEntityFromReference(CdmEntityDeclarationDefinition entity, CdmManifestDefinition manifest)
        {
            string entityPath = await this.GetEntityPathFromDeclaration(entity, manifest);
            CdmEntityDefinition result = await this.Ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(entityPath);

            if (result == null)
                Logger.Error(nameof(CdmManifestDefinition), this.Ctx, $"failed to resolve entity {entityPath}", nameof(GetEntityFromReference));

            return result;
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
            using ((this.Ctx.Corpus.Storage.FetchAdapter(this.InDocument.Namespace) as StorageAdapterBase)?.CreateFileQueryCacheContext())
            {
                DateTimeOffset? modifiedTime = await this.Ctx.Corpus.GetLastModifiedTimeAsyncFromObject(this);

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

        /// Query the manifest for a set of entities that match an input query.
        /// A JSON object (or a string that can be parsed into one) of the form {"entityName":"", "attributes":[{see QueryOnTraitsAsync for CdmEntityDef for details}]}. 
        /// Returns null for 0 results or an array of json objects, each matching the shape of the input query, with entity and attribute names filled in.
        private Task<List<object>> QueryOnTraitsAsync(dynamic querySpec)
        {
            // TODO: This is part of a planned work and currently not used (marked 3 Oct 2019)
            throw new NotImplementedException("Part of an ongoing work");
        }

        // Helper that fixes a path from local to absolute.
        // Gets the object from that path then looks at the document where the object is found.
        // If dirty, the document is saved with the original name.
        private async Task<bool> SaveDirtyLink(string relative, CopyOptions options)
        {
            // get the document object from the import
            string docPath = Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(relative, this);
            if (docPath == null)
            {
                Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"Invalid corpus path {relative}", nameof(SaveDirtyLink));
                return false;
            }
            CdmObject objAt = await Ctx.Corpus.FetchObjectAsync<CdmObject>(docPath);
            if (objAt == null)
            {
                Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"Couldn't get object from path {docPath}", nameof(SaveDirtyLink));
                return false;
            }

            CdmDocumentDefinition docImp = objAt.InDocument as CdmDocumentDefinition;

            if (docImp != null)
            {
                if (docImp.IsDirty)
                {
                    // save it with the same name
                    if (await docImp.SaveAsAsync(docImp.Name, true, options) == false)
                    {
                        Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"failed saving document {docImp.Name}", nameof(SaveDirtyLink));
                        return false;
                    }
                }
            }

            return true;
        }

        override internal async Task<bool> SaveLinkedDocuments(CopyOptions options = null)
        {
            if (options == null)
            {
                options = new CopyOptions();
            }

            if (this.Imports != null)
            {
                foreach (CdmImport imp in this.Imports)
                {
                    if (await SaveDirtyLink(imp.CorpusPath, options) == false)
                    {
                        Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"failed saving imported document {imp.AtCorpusPath}", nameof(SaveLinkedDocuments));
                        return false;
                    }
                }
            }
            if (this.Entities != null)
            {
                // only the local entity declarations please
                foreach (CdmEntityDeclarationDefinition def in this.Entities)
                {
                    if (def.ObjectType == CdmObjectType.LocalEntityDeclarationDef)
                    {
                        CdmLocalEntityDeclarationDefinition defImp = def as CdmLocalEntityDeclarationDefinition;
                        if (await SaveDirtyLink(defImp.EntityPath, options) == false)
                        {
                            Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"failed saving local entity schema document {defImp.EntityPath}", nameof(SaveLinkedDocuments));
                            return false;
                        }

                        // also, partitions can have their own schemas
                        if (defImp.DataPartitions != null)
                        {
                            foreach (CdmDataPartitionDefinition part in defImp.DataPartitions)
                            {
                                if (part.SpecializedSchema != null)
                                {
                                    if (await SaveDirtyLink(defImp.EntityPath, options) == false)
                                    {
                                        Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"failed saving local entity schema document {defImp.EntityPath}", nameof(SaveLinkedDocuments));
                                        return false;
                                    }
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
                                    if (await SaveDirtyLink(part.SpecializedSchema, options) == false)
                                    {
                                        Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"failed saving partition schema document {part.SpecializedSchema}", nameof(SaveLinkedDocuments));
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.SubManifests != null)
            {
                foreach (CdmManifestDeclarationDefinition sub in this.SubManifests)
                {
                    if (await SaveDirtyLink(sub.Definition, options) == false)
                    {
                        Logger.Error(nameof(CdmManifestDefinition), this.Ctx as ResolveContext, $"failed saving sub-manifest document {sub.DeclaredPath}", nameof(SaveLinkedDocuments));
                        return false;
                    }
                }
            }

            return true;
        }

        // Standardized way of turning a relationship object into a key for caching
        // without using the object itself as a key (could be duplicate relationship objects).
        internal string rel2CacheKey(CdmE2ERelationship rel)
        {
            string nameAndPipe = string.Empty;
            if (!string.IsNullOrWhiteSpace(rel.Name))
            {
                nameAndPipe = $"{rel.Name}|";
            }
            return $"{nameAndPipe}{rel.ToEntity}|{rel.ToEntityAttribute}|{rel.FromEntity}|{rel.FromEntityAttribute}";
        }

        internal CdmE2ERelationship LocalizeRelToManifest(CdmE2ERelationship rel)
        {
            CdmE2ERelationship relCopy = this.Ctx.Corpus.MakeObject<CdmE2ERelationship>(CdmObjectType.E2ERelationshipDef, rel.Name);
            relCopy.ToEntity = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(rel.ToEntity, this);
            relCopy.FromEntity = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(rel.FromEntity, this);
            relCopy.ToEntityAttribute = rel.ToEntityAttribute;
            relCopy.FromEntityAttribute = rel.FromEntityAttribute;
            return relCopy;
        }
    }
}
