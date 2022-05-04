// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ManifestPersistence
    {
        private static readonly string Tag = nameof(ManifestPersistence);

        /// <summary>
        /// The file format/extension types this persistence class supports.
        /// </summary>
        public static readonly string[] Formats = { PersistenceLayer.ManifestExtension };
        private static readonly string dbLocationTrait = "is.storagesource";
        private static readonly string dbLocationTraitArgName = "namespace";

        public static CdmManifestDefinition FromObject(CdmCorpusContext ctx, string docName, string nameSpace, string path, SymsManifestContent dataObj)
        {
            DatabaseEntity database = dataObj.Database;

            if (database == null || database.Type != SASEntityType.DATABASE)
            {
                Logger.Error((ResolveContext)ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistSymsInvalidDbObject);
                return null;
            }

            DatabaseProperties databaseProperties = ((JToken)database.Properties).ToObject<DatabaseProperties>();

            if (databaseProperties == null || databaseProperties.Source == null)
            {
                Logger.Error((ResolveContext)ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistSymsInvalidDbPropObject);
                return null;
            }

            var properties = databaseProperties.Properties;
            var manifest = ctx.Corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef);

            manifest.ManifestName = dataObj.Database.Name;
            manifest.Name = docName;
            manifest.FolderPath = path;
            manifest.Namespace = nameSpace;
            manifest.Explanation = databaseProperties.Description;

            if (properties != null)
            {
                if (properties.ContainsKey("cdm:schema"))
                {
                    manifest.Schema = properties["cdm:schema"].ToObject<string>();
                }
                if (properties.ContainsKey("cdm:jsonSchemaSemanticVersion"))
                {
                    manifest.JsonSchemaSemanticVersion = properties["cdm:jsonSchemaSemanticVersion"].ToObject<string>();
                }
                if (properties.ContainsKey("cdm:documentVersion"))
                {
                    manifest.DocumentVersion = properties["cdm:documentVersion"].ToObject<string>();
                }
                else if (properties.ContainsKey("cdm:traits"))
                {
                    Utils.AddListToCdmCollection(manifest.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, properties["cdm:traits"]));
                }
                if (properties.ContainsKey("cdm:imports"))
                {
                    foreach (var importObj in properties["cdm:imports"].ToObject<List<Import>>())
                    {
                        manifest.Imports.Add(ImportPersistence.FromData(ctx, importObj));
                    }
                }
                if (properties.ContainsKey("cdm:lastFileStatusCheckTime"))
                {
                    manifest.LastFileStatusCheckTime = DateTimeOffset.Parse(properties["cdm:lastFileStatusCheckTime"].ToObject<string>());
                }
                if (properties.ContainsKey("cdm:lastFileModifiedTime"))
                {
                    manifest.LastFileModifiedTime = DateTimeOffset.Parse(properties["cdm:lastFileModifiedTime"].ToObject<string>());
                }
                if (properties.ContainsKey("cdm:lastChildFileModifiedTime"))
                {
                    manifest.LastChildFileModifiedTime = DateTimeOffset.Parse(properties["cdm:lastChildFileModifiedTime"].ToObject<string>());
                }
            }

            var t2pm = new TraitToPropertyMap(manifest);
            var sourceTrait = t2pm.FetchTraitReference(dbLocationTrait);
            if (sourceTrait == null)
            {
                sourceTrait = Utils.CreateSourceTrait(ctx, dbLocationTrait, dbLocationTraitArgName);
                manifest.ExhibitsTraits.Add(sourceTrait);
            }

            var adlsPath = Utils.SymsPathToAdlsAdapterPath(databaseProperties.Source.Location);
            var adlsCorpusPath = ctx.Corpus.Storage.AdapterPathToCorpusPath(adlsPath);
            if (adlsCorpusPath == null)
            {
                Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(sourceTrait.Arguments[0].Value);
                if (null == Utils.CreateAndMountAdlsAdapterFromAdlsPath(ctx.Corpus.Storage, adlsPath, pathTuple.Item1))
                {
                    Logger.Error((ResolveContext)ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistSymsAdlsAdapterNotMounted, adlsPath);
                    return null;
                }
            }

            if (dataObj.Entities != null)
            {
                foreach (var entityObj in dataObj.Entities)
                {
                    if (entityObj.Type == SASEntityType.TABLE)
                    {
                        var entity = LocalEntityDeclarationPersistence.FromData(ctx, entityObj, manifest, databaseProperties.Source.Location);
                        if (entity != null)
                        {
                            manifest.Entities.Add(entity);
                        }
                        else
                        {
                            Logger.Warning((ResolveContext)ctx, Tag, nameof(FromObject), null, CdmLogCode.WarnPersistSymsEntitySkipped, entityObj.Name);
                        }
                    }
                }
            }

            if (!manifest.Imports.Any((CdmImport importPresent) => importPresent.CorpusPath == Constants.FoundationsCorpusPath))
            {
                manifest.Imports.Add(Constants.FoundationsCorpusPath);
            }

            if (dataObj.Relationships != null)
            {
                foreach (var relationshipEntity in dataObj.Relationships)
                {
                    manifest.Relationships.AddRange(E2ERelationshipPersistence.FromData(ctx, relationshipEntity));
                }
            }

            // TODO : Submanifest
            return manifest;
        }

        public static async Task<SymsManifestContent> ToDataAsync(CdmManifestDefinition instance,ResolveOptions resOpt, CopyOptions options, 
            bool isDeltaSync = false, IList<TableEntity> existingSymsTables = null, IList<RelationshipEntity> existingSymsRelationships = null)
        {
            var source = CreateDataSource(instance);
            if (source == null)
                return null; 

            var properties = CreateDatabasePropertyBags(instance, resOpt, options);

            Dictionary<string, TableEntity> existingTableEntities = null;
            List<string> removedSymsTable = null;
            if ( existingSymsTables != null && existingSymsTables.Count > 0)
            {
                // convert to dictionary for better searching
                existingTableEntities = existingSymsTables.ToDictionary(x => x.Name, x => x);
                removedSymsTable = existingSymsTables.Select(x => x.Name).Except(instance.Entities.Select(x => x.EntityName)).ToList();
            }
            var addedOrModifiedSymsTables = await CreateSymsTablesObjects(instance, resOpt, options, source.Location, existingTableEntities);

            // TODO : Submanifest

            Dictionary<string, RelationshipEntity> existingRelationshipEntities = null;
            List<string> removedSymsRelationships = null;
            if (existingSymsRelationships != null && existingSymsRelationships.Count > 0)
            {
                existingRelationshipEntities = existingSymsRelationships.ToDictionary(x => x.Name, x => x);
                removedSymsRelationships = existingSymsRelationships.Select(x => x.Name).Except(instance.Relationships.Select(x => x.Name)).ToList();
            }
            var addedOrModifiedSymsRelationships = CreateRelationships(instance, existingRelationshipEntities, resOpt, options);

            DatabaseProperties dbProperties = new DatabaseProperties
            {
                Description = instance.Explanation != null ? instance.Explanation : $"{instance.ManifestName} syms database",
                Source = source,
                Properties = properties
            };

            var databaseEntity = new DatabaseEntity
            {
                Name = instance.ManifestName,
                Properties = dbProperties,
                Type = SASEntityType.DATABASE
            };

            return new SymsManifestContent
            {
                Database = databaseEntity,
                Entities = addedOrModifiedSymsTables,
                Relationships = addedOrModifiedSymsRelationships,
                InitialSync = !isDeltaSync,
                RemovedEntities = removedSymsTable,
                RemovedRelationships = removedSymsRelationships
            };
        }

        private static DataSource CreateDataSource(CdmManifestDefinition instance)
        {
            var source = new DataSource();
            var t2pm = new TraitToPropertyMap(instance);
            var sourceTraits = t2pm.FetchTraitReference(dbLocationTrait);
            if (sourceTraits != null && sourceTraits.Arguments != null && sourceTraits.Arguments.Count == 1
                && sourceTraits.Arguments[0].Name == dbLocationTraitArgName)
            {
                source.Location = Utils.CorpusPathToSymsPath(sourceTraits.Arguments[0].Value, instance.Ctx.Corpus.Storage);
            }

            if (source.Location == null)
            {
                Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToDataAsync), instance.AtCorpusPath,
                        CdmLogCode.ErrPersistSymsStorageSourceTraitError, dbLocationTrait, dbLocationTraitArgName);
                return null;
            }

            return source;
        }

        private static Dictionary<string, JToken> CreateDatabasePropertyBags(CdmManifestDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var properties = new Dictionary<string, JToken>();

            var lastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime);
            var lastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime);
            var lastChildFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastChildFileModifiedTime);

            if (lastFileStatusCheckTime != null)
            {
                properties["cdm:lastFileStatusCheckTime"] = JToken.FromObject(lastFileStatusCheckTime);
            }

            if (lastFileModifiedTime != null)
            {
                properties["cdm:lastFileModifiedTime"] = JToken.FromObject(lastFileModifiedTime);
            }

            if (lastChildFileModifiedTime != null)
            {
                properties["cdm:lastChildFileModifiedTime"] = JToken.FromObject(lastChildFileModifiedTime);
            }

            if (instance.JsonSchemaSemanticVersion != null)
            {
                properties["cdm:jsonSchemaSemanticVersion"] = JToken.FromObject(instance.JsonSchemaSemanticVersion);
            }

            if (instance.Schema != null)
            {
                properties["cdm:schema"] = JToken.FromObject(instance.Schema);
            }

            if (instance.DocumentVersion != null)
            {
                properties["cdm:documentVersion"] = JToken.FromObject(instance.DocumentVersion);
            }

            if (instance.Imports != null && instance.Imports.Count > 0)
            {
                properties["cdm:imports"] =
                    JToken.FromObject(Utils.ListCopyData<Import>(resOpt, instance.Imports, options));
            }

            if (instance.ExhibitsTraits != null && instance.ExhibitsTraits.Count > 0)
            {
                properties["cdm:traits"] = JToken.FromObject(Utils.ListCopyData<TraitReferenceDefinition>(resOpt, instance.ExhibitsTraits, options),
                    new JsonSerializer { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }

            return properties;
        }

        public static async Task<List<TableEntity>> CreateSymsTablesObjects(CdmManifestDefinition instance,
            ResolveOptions resOpt, CopyOptions options, string location, IDictionary<string, TableEntity> existingTableEntities = null)
        {
            List<TableEntity> symsTables = new List<TableEntity>();
            if (instance.Entities != null && instance.Entities.Count > 0)
            {
                List<Task> promises = new List<Task>();
                var obtainedEntities = new ConcurrentBag<TableEntity>();
                foreach (var entity in instance.Entities)
                {
                    Task createdPromise = Task.Run(async () =>
                    {
                        dynamic element = null;

                        if (entity.ObjectType == CdmObjectType.LocalEntityDeclarationDef && 
                        Utils.IsEntityAddedOrModified(entity as CdmLocalEntityDeclarationDefinition, existingTableEntities)) 
                        {
                            element = await LocalEntityDeclarationPersistence.ToDataAsync(
                                    entity as CdmLocalEntityDeclarationDefinition,
                                    instance, location, resOpt, options
                                );

                            if (element != null)
                            {
                                obtainedEntities.Add(element);
                            }
                            else
                            {
                                Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToDataAsync), instance.AtCorpusPath, CdmLogCode.ErrPersistSymsEntityDeclConversionFailure, entity.EntityName);
                            }
                        }
                        
                    });
                    try
                    {
                        // TODO: Currently function is synchronous. Remove next line to turn it asynchronous.
                        // Currently some functions called are not thread safe.
                        await createdPromise;
                        promises.Add(createdPromise);
                    }
                    catch (Exception ex)
                    {
                        Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToDataAsync), instance.AtCorpusPath, CdmLogCode.ErrPersistSymsEntityDeclConversionException, entity.EntityName, ex.Message);
                    }
                }
                await Task.WhenAll(promises);
                symsTables = obtainedEntities.ToList();
            }

            return symsTables;
        }

        private static List<RelationshipEntity> CreateRelationships(CdmManifestDefinition instance, IDictionary<string, RelationshipEntity> existingRelationshipEntities,
             ResolveOptions resOpt, CopyOptions options)
        {
            var relationships = new Dictionary<string, RelationshipEntity>();
            if (instance.Relationships != null && instance.Relationships.Count > 0)
            {
                foreach (var cdmRelationship in instance.Relationships)
                {
                    if (Utils.IsRelationshipAddedorModified(cdmRelationship, existingRelationshipEntities))
                    {
                        if (!relationships.ContainsKey(instance.Name))
                        {
                            var relationship = E2ERelationshipPersistence.ToData(cdmRelationship, instance.ManifestName, resOpt, options);
                            if (relationship != null)
                            {
                                relationships[relationship.Name] = relationship;
                            }
                            else
                            {
                                Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToDataAsync), instance.AtCorpusPath, CdmLogCode.ErrPersistModelJsonRelConversionError);
                            }
                        }
                        else
                        {
                            var relationshipEntity = relationships[instance.Name];
                            ((RelationshipProperties)relationshipEntity.Properties).ColumnRelationshipInformations.Add(new ColumnRelationshipInformation(cdmRelationship.FromEntityAttribute, cdmRelationship.ToEntityAttribute));
                        }
                    }
                }
            }

            return relationships.Values.ToList();
        }
    }
}
