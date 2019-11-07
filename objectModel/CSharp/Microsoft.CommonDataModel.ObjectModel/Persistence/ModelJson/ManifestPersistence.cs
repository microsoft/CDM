namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    using Newtonsoft.Json.Linq;
    using System.Collections.Concurrent;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;

    /// <summary>
    /// The manifest persistence.
    /// </summary>
    public class ManifestPersistence
    {
        public static async Task<CdmManifestDefinition> FromData(CdmCorpusContext ctx, Model obj, CdmFolderDefinition folder)
        {
            #region Prepare extenisonDoc
            var extensionDoc = ctx.Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef,
                (string.IsNullOrEmpty(folder.Name) ? folder.Namespace : folder.Name) + ".extension.cdm.json");
            CdmCollection<CdmTraitDefinition> extensionTraitDefList = new CdmCollection<CdmTraitDefinition>(ctx, extensionDoc, CdmObjectType.TraitDef);
            #endregion

            #region Set manifest fields
            CdmManifestDefinition manifest = ctx.Corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, obj.Name);

            manifest.Explanation = obj.Description;
            manifest.LastFileModifiedTime = obj.ModifiedTime;
            manifest.LastChildFileModifiedTime = obj.LastChildFileModifiedTime;
            manifest.LastFileStatusCheckTime = obj.LastFileStatusCheckTime;

            if (obj.Application != null)
            {
                var applicationTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.managedBy", false);
                applicationTrait.IsFromProperty = true;

                var arg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "application");
                arg.Value = obj.Application;
                applicationTrait.Arguments.Add(arg);

                manifest.ExhibitsTraits.Add(applicationTrait);
            }

            if (obj.Version != null)
            {
                var versionTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.modelConversion.modelVersion", false);

                var arg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "version");
                arg.Value = obj.Version;
                versionTrait.Arguments.Add(arg);

                manifest.ExhibitsTraits.Add(versionTrait);
            }

            if (obj.Culture != null)
            {
                var cultureTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.partition.culture", false);
                cultureTrait.IsFromProperty = true;

                var arg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "culture");
                arg.Value = obj.Culture;
                cultureTrait.Arguments.Add(arg);

                manifest.ExhibitsTraits.Add(cultureTrait);
            }

            if (obj.IsHidden == true)
            {
                var isHiddenTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.hidden", true);
                isHiddenTrait.IsFromProperty = true;
                manifest.ExhibitsTraits.Add(isHiddenTrait);
            }

            var referenceModels = new Dictionary<string, string>();

            if (obj.ReferenceModels != null)
            {
                var referenceModelsTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.modelConversion.referenceModelMap", false);

                var arg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "referenceModelMap");
                arg.Value = JToken.FromObject(obj.ReferenceModels);
                referenceModelsTrait.Arguments.Add(arg);

                manifest.ExhibitsTraits.Add(referenceModelsTrait);

                foreach (var referenceModel in obj.ReferenceModels)
                {
                    referenceModels.Add(referenceModel.Id, referenceModel.Location);
                }
            }

            var entitySchemaByName = new Dictionary<string, string>();
            if (obj.Entities != null && obj.Entities.Count > 0)
            {
                foreach (var element in obj.Entities)
                {
                    CdmEntityDeclarationDefinition entity = null;

                    if ((string)element["$type"] == "LocalEntity")
                    {
                        entity = await LocalEntityDeclarationPersistence.FromData(ctx, folder, element.ToObject<LocalEntity>(), extensionTraitDefList);
                    }
                    else if ((string)element["$type"] == "ReferenceEntity")
                    {
                        var referenceEntity = element.ToObject<ReferenceEntity>();
                        if (!referenceModels.ContainsKey(referenceEntity.ModelId))
                        {
                            Logger.Error(nameof(ManifestPersistence), ctx, $"Model Id {referenceEntity.ModelId} from {referenceEntity.Name} not found in referenceModels.");

                            return null;
                        }
                        entity = await ReferencedEntityDeclarationPersistence.FromData(ctx, referenceEntity, referenceModels[referenceEntity.ModelId], extensionTraitDefList);
                    }
                    else
                    {
                        Logger.Error(nameof(ManifestPersistence), ctx, "There was an error while trying to parse entity type.");
                    }

                    if (entity != null)
                    {
                        manifest.Entities.Add(entity);
                        if (entity is CdmLocalEntityDeclarationDefinition localEntity)
                        {
                            entitySchemaByName.Add(entity.EntityName, localEntity.EntityPath);
                        }
                        else if (entity is CdmReferencedEntityDeclarationDefinition referenceEntity)
                        {
                            entitySchemaByName.Add(entity.EntityName, referenceEntity.EntityPath);
                        }
                    }
                    else
                    {
                        Logger.Error(nameof(ManifestPersistence), ctx, "There was an error while trying to parse entity type.");
                    }

                }
            }

            if (obj.Relationships != null && obj.Relationships.Count > 0)
            {
                foreach (var element in obj.Relationships)
                {
                    var relationship = await RelationshipPersistence.FromData(ctx, element, entitySchemaByName);
                    if (relationship != null)
                    {
                        manifest.Relationships.Add(relationship);
                    }
                    else
                    {
                        Logger.Error(nameof(ManifestPersistence), ctx, "There was an error while trying to convert model.json local entity to cdm local entity declaration.");
                    }
                }
            }

            if (obj.Imports != null)
            {
                foreach (var element in obj.Imports)
                {
                    manifest.Imports.Add(CdmFolder.ImportPersistence.FromData(ctx, element));
                }
            }

            await Utils.ProcessAnnotationsFromData(ctx, obj, manifest.ExhibitsTraits);
            ExtensionHelper.ProcessExtensionFromJson(ctx, obj, manifest.ExhibitsTraits, extensionTraitDefList);
            #endregion

            #region Use extensionDoc, finalize importDocs

            List<CdmImport> importDocs = await ExtensionHelper.StandardImportDetection(ctx, extensionTraitDefList);
            CreateExtensionDocAndAddToFolderAndImports(ctx, extensionDoc, extensionTraitDefList, folder, importDocs);
            await AddImportDocsToManifest(ctx, importDocs, manifest);
            #endregion

            // We need to set up folder path and namespace of a manifest to be able to retrieve that object.
            folder.Documents.Add(manifest);

            return manifest;
        }

        /// <summary>
        /// Adds the remaining definitions of extensions to extensionDoc.
        /// Then adds extensionDoc to the folder of the manifest and
        /// adds it's path to the list of imports
        /// </summary>
        /// <param name="ctx">The context</param>
        /// <param name="extensionDoc">The document where the definitions will be added. This document will be added to folder and it's path to importDocs</param>
        /// <param name="extensionTraitDefList">The list of definitions to be added to schema.</param>
        /// <param name="folder">The folder that contains the manifest and where the document containing the schema will be placed.</param>
        /// <param name="importDocs">The list of paths of documents containing schemas for the manifest.</param>
        private static void CreateExtensionDocAndAddToFolderAndImports(CdmCorpusContext ctx, CdmDocumentDefinition extensionDoc, CdmCollection<CdmTraitDefinition> extensionTraitDefList, CdmFolderDefinition folder, List<CdmImport> importDocs)
        {
            if (extensionTraitDefList.Count > 0)
            {
                // pull out the extension trait definitions into a new custom extension document
                extensionTraitDefList.Select((CdmTraitDefinition cdmTraitDef) => (CdmObjectDefinition)cdmTraitDef).ToList().ForEach((CdmObjectDefinition cdmObjectDef) =>
                {
                    extensionDoc.Definitions.Add(cdmObjectDef);
                });
                extensionDoc.Folder = folder;

                // import the cdm extensions into this new document that has the custom extensions
                CdmImport baseExtensionImport = ctx.Corpus.MakeObject<CdmImport>(CdmObjectType.Import);
                baseExtensionImport.CorpusPath = "cdm:/extensions/base.extension.cdm.json";
                extensionDoc.Imports.Add(baseExtensionImport);

                // add the extension doc to the folder, will wire everything together as needed
                folder.Documents.Add(extensionDoc);

                // import this new customer extension doc into the list of imports for the origial doc
                CdmImport extensionImport = ctx.Corpus.MakeObject<CdmImport>(CdmObjectType.Import);
                extensionImport.CorpusPath = ctx.Corpus.Storage.CreateRelativeCorpusPath(extensionDoc.AtCorpusPath, extensionDoc);
                importDocs.Add(extensionImport);
            }
        }

        /// <summary>
        /// Adds the list of documents with extensions schema definitions to the manifest.
        /// </summary>
        /// <param name="ctx">the context</param>
        /// <param name="importDocs">The list of paths of documents with relevant schema definitions.</param>
        /// <param name="manifest">The manifest that needs to import the docs.</param>
        /// <returns></returns>
        private static async Task AddImportDocsToManifest(CdmCorpusContext ctx, List<CdmImport> importDocs, CdmManifestDefinition manifest)
        {
            foreach (var importDoc in importDocs)
            {
                foreach (var entityDef in manifest.Entities)
                {
                    if (entityDef.ObjectType == CdmObjectType.LocalEntityDeclarationDef)
                    {
                        // get the document for the entity being pointed at
                        string entityPath = (entityDef as CdmLocalEntityDeclarationDefinition).EntityPath;

                        var objectFromCorpusPath = await ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(entityPath);
                        var cdmDocument = objectFromCorpusPath.InDocument as CdmDocumentDefinition;

                        if (!cdmDocument.Imports.Any((CdmImport importPresent) => importPresent.CorpusPath == importDoc.CorpusPath))
                        {
                            cdmDocument.Imports.Add(importDoc);
                        }
                    }
                }
                if (!manifest.Imports.Any((CdmImport importPresent) => importPresent.CorpusPath == importDoc.CorpusPath))
                {
                    manifest.Imports.Add(importDoc);
                }
            }
        }

        public async static Task<Model> ToData(CdmManifestDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var result = new Model()
            {
                Name = instance.ManifestName,
                Description = instance.Explanation,
                ModifiedTime = instance.LastFileModifiedTime,
                LastChildFileModifiedTime = instance.LastChildFileModifiedTime,
                LastFileStatusCheckTime = instance.LastFileStatusCheckTime
            };

            TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);

            CdmTraitReference isHiddenTrait = t2pm.FetchTraitReference("is.hidden");
            if (isHiddenTrait != null)
            {
                result.IsHidden = true;
            }

            CdmTraitReference applicationTrait = t2pm.FetchTraitReference("is.managedBy");
            if (applicationTrait != null)
            {
                result.Application = applicationTrait.Arguments.AllItems[0].Value as string;
            }

            CdmTraitReference versionTrait = t2pm.FetchTraitReference("is.modelConversion.modelVersion");
            if (versionTrait != null)
            {
                result.Version = versionTrait.Arguments.AllItems[0].Value;
            }
            else
            {
                // version property is required. If it doesn't exist set default.
                result.Version = "1.0";
            }

            CdmTraitReference cultureTrait = t2pm.FetchTraitReference("is.partition.culture");
            if (cultureTrait != null)
            {
                result.Culture = cultureTrait.Arguments.AllItems[0].Value as string;
            }

            Dictionary<string, string> referenceEntityLocations = new Dictionary<string, string>();
            Dictionary<string, string> referenceModels = new Dictionary<string, string>();

            CdmTraitReference referenceModelsTrait = t2pm.FetchTraitReference("is.modelConversion.referenceModelMap");
            if (referenceModelsTrait != null)
            {
                JArray refModels = referenceModelsTrait.Arguments.AllItems[0].Value as JArray;

                foreach (JObject referenceModel in refModels)
                {
                    var referenceModelId = referenceModel["id"];
                    var referenceModelIdAsString = referenceModelId.ToString();
                    var referenceModelLocation = referenceModel["location"];
                    var referenceModelLocationAsString = referenceModelLocation.ToString();
                    referenceModels.Add(referenceModelIdAsString, referenceModelLocationAsString);
                    referenceEntityLocations.Add(referenceModelLocationAsString, referenceModelIdAsString);
                }
            }

            await Utils.ProcessAnnotationsToData(instance.Ctx, result, instance.ExhibitsTraits);

            if (instance.Entities != null && instance.Entities.Count > 0)
            {
                List<Task> promises = new List<Task>();
                var obtainedEntities = new ConcurrentBag<JToken>();
                foreach (var entity in instance.Entities)
                {
                    Task createdPromise = Task.Run(async () =>
                    {
                        dynamic element = null;
                        if (entity.ObjectType == CdmObjectType.LocalEntityDeclarationDef)
                        {
                            element = await LocalEntityDeclarationPersistence.ToData(
                                entity as CdmLocalEntityDeclarationDefinition,
                                resOpt,
                                options
                                );
                        }
                        else if (entity.ObjectType == CdmObjectType.ReferencedEntityDeclarationDef)
                        {
                            element = await ReferencedEntityDeclarationPersistence.ToData(
                                entity as CdmReferencedEntityDeclarationDefinition,
                                resOpt,
                                options
                               );

                            ReferenceEntity referenceEntity = element as ReferenceEntity;
                            string location = instance.Ctx.Corpus.Storage.CorpusPathToAdapterPath(
                                entity.EntityPath);

                            if (referenceEntity.ModelId != null)
                            {
                                if (referenceModels[referenceEntity.ModelId] == null)
                                {
                                    referenceModels[referenceEntity.ModelId] = location;
                                }
                            }
                            else if (referenceEntityLocations[location] != null)
                            {
                                referenceEntity.ModelId = referenceEntityLocations[location];
                            }
                            else
                            {
                                referenceEntity.ModelId = Guid.NewGuid().ToString();
                                referenceModels[referenceEntity.ModelId] = location;
                                referenceEntityLocations[location] = referenceEntity.ModelId;
                            }
                        }

                        if (element != null)
                        {
                            obtainedEntities.Add(JToken.FromObject(element));
                        }
                        else
                        {
                            Logger.Error(nameof(ManifestPersistence), instance.Ctx, "There was an error while trying to convert entity declaration to model json format.");
                        }
                    });
                    promises.Add(createdPromise);
                    // TODO: Currently function is synchronous. Remove next line to turn it asynchronous.
                    // Currently some functions called are not thread safe.
                    await createdPromise;
                }
                await Task.WhenAll(promises);
                result.Entities = obtainedEntities.ToList();
            }

            if (referenceModels.Count > 0)
            {
                result.ReferenceModels = new List<ReferenceModel>();
                foreach (var referenceModel in referenceModels)
                {
                    result.ReferenceModels.Add(new ReferenceModel()
                    {
                        Id = referenceModel.Key,
                        Location = referenceModel.Value
                    });
                }
            }

            if (instance.Relationships != null && instance.Relationships.Count > 0)
            {
                result.Relationships = new List<SingleKeyRelationship>();

                foreach (var cdmRelationship in instance.Relationships)
                {
                    var relationship = await RelationshipPersistence.ToData(cdmRelationship, resOpt, options);

                    if (relationship != null)
                    {
                        result.Relationships.Add(relationship);
                    }
                    else
                    {
                        Logger.Error(nameof(ManifestPersistence), instance.Ctx, "There was an error while trying to convert cdm relationship to model.json relationship.");
                    }
                }
            }

            if (instance.Imports != null && instance.Imports.Count > 0)
            {
                result.Imports = new List<Import>();
                foreach (var element in instance.Imports)
                {
                    result.Imports.Add(CdmFolder.ImportPersistence.ToData(element, resOpt, options));
                }
            }

            return result;
        }
    }
}
