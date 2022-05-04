// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    using Newtonsoft.Json.Linq;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Newtonsoft.Json;

    /// <summary>
    /// The manifest persistence.
    /// </summary>
    public class ManifestPersistence
    {
        private static readonly string Tag = nameof(ManifestPersistence);

        /// <summary>
        /// Whether this persistence class has async methods.
        /// </summary>
        public static readonly bool IsPersistenceAsync = true;

        /// <summary>
        /// The file format/extension types this persistence class supports.
        /// </summary>
        public static readonly string[] Formats = { PersistenceLayer.ModelJsonExtension };

        public static async Task<CdmManifestDefinition> FromObject(CdmCorpusContext ctx, Model obj, CdmFolderDefinition folder)
        {
            #region Prepare extensionDoc
            List<CdmTraitDefinition> extensionTraitDefList = new List<CdmTraitDefinition>();
            #endregion

            #region Set manifest fields
            CdmManifestDefinition manifest = ctx.Corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, obj.Name);

            // We need to set up folder path and namespace of a manifest to be able to retrieve that object.
            folder.Documents.Add(manifest);

            if (obj.Imports != null)
            {
                foreach (var element in obj.Imports)
                {
                    manifest.Imports.Add(CdmFolder.ImportPersistence.FromData(ctx, element));
                }
            }

            if (!manifest.Imports.Any((CdmImport importPresent) => importPresent.CorpusPath == Constants.FoundationsCorpusPath))
            {
                manifest.Imports.Add(Constants.FoundationsCorpusPath);
            }

            manifest.Explanation = obj.Description;
            manifest.LastFileModifiedTime = obj.ModifiedTime;
            manifest.LastChildFileModifiedTime = obj.LastChildFileModifiedTime;
            manifest.LastFileStatusCheckTime = obj.LastFileStatusCheckTime;

            if (!StringUtils.IsBlankByCdmStandard(obj.DocumentVersion))
            {
                manifest.DocumentVersion = obj.DocumentVersion;
            }

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
                        entity = await LocalEntityDeclarationPersistence.FromData(ctx, folder, element.ToObject<LocalEntity>(), extensionTraitDefList, manifest);
                    }
                    else if ((string)element["$type"] == "ReferenceEntity")
                    {
                        var referenceEntity = element.ToObject<ReferenceEntity>();
                        if (!referenceModels.ContainsKey(referenceEntity.ModelId))
                        {
                            Logger.Error((ResolveContext)ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistModelJsonModelIdNotFound, referenceEntity.ModelId, referenceEntity.Name);
                            return null;
                        }
                        entity = await ReferencedEntityDeclarationPersistence.FromData(ctx, referenceEntity, referenceModels[referenceEntity.ModelId]);
                    }
                    else
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistModelJsonEntityParsingError);
                    }

                    if (entity != null)
                    {
                        manifest.Entities.Add(entity);
                        entitySchemaByName.Add(entity.EntityName, entity.EntityPath);
                    }
                    else
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistModelJsonEntityParsingError);
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
                        Logger.Warning(ctx, Tag, nameof(FromObject), null, CdmLogCode.WarnPersistModelJsonRelReadFailed);
                    }
                }
            }

            await Utils.ProcessAnnotationsFromData(ctx, obj, manifest.ExhibitsTraits);

            var localExtensionTraitDefList = new List<CdmTraitDefinition>();
            ExtensionHelper.ProcessExtensionFromJson(ctx, obj, manifest.ExhibitsTraits, extensionTraitDefList, localExtensionTraitDefList);
            #endregion

            #region Use extensionDoc, finalize importDocs

            List<CdmImport> importDocs = await ExtensionHelper.StandardImportDetection(ctx, extensionTraitDefList, localExtensionTraitDefList);
            ExtensionHelper.AddImportDocsToManifest(ctx, importDocs, manifest);

            CreateExtensionDocAndAddToFolderAndImports(ctx, extensionTraitDefList, folder);
            #endregion

            return manifest;
        }

        public static async Task<CdmManifestDefinition> FromData(CdmCorpusContext ctx, string docName, string jsonData, CdmFolderDefinition folder)
        {
            var obj = JsonConvert.DeserializeObject<Model>(jsonData);
            return await FromObject(ctx, obj, folder);
        }

        /// <summary>
        /// Adds the remaining definitions of extensions to extensionDoc.
        /// Then adds extensionDoc to the folder of the manifest and
        /// adds it's path to the list of imports
        /// </summary>
        /// <param name="ctx">The context</param>
        /// <param name="extensionTraitDefList">The list of definitions to be added to schema.</param>
        /// <param name="folder">The folder that contains the manifest and where the document containing the schema will be placed.</param>
        private static void CreateExtensionDocAndAddToFolderAndImports(CdmCorpusContext ctx, List<CdmTraitDefinition> extensionTraitDefList, CdmFolderDefinition folder)
        {
            if (extensionTraitDefList.Count > 0)
            {
                var extensionDoc = ctx.Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, ExtensionHelper.ExtensionDocName);

                // pull out the extension trait definitions into a new custom extension document
                extensionTraitDefList.Select((CdmTraitDefinition cdmTraitDef) => (CdmObjectDefinition)cdmTraitDef).ToList().ForEach((CdmObjectDefinition cdmObjectDef) =>
                {
                    extensionDoc.Definitions.Add(cdmObjectDef);
                });

                // import the cdm extensions into this new document that has the custom extensions
                extensionDoc.Imports.Add("cdm:/extensions/base.extension.cdm.json");

                // add the extension doc to the folder, will wire everything together as needed
                folder.Documents.Add(extensionDoc);
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
                LastFileStatusCheckTime = instance.LastFileStatusCheckTime,
                DocumentVersion = instance.DocumentVersion
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
                JArray refModels = referenceModelsTrait.Arguments[0].Value as JArray;

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

            await Utils.ProcessTraitsAndAnnotationsToData(instance.Ctx, result, instance.ExhibitsTraits);

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
                                    instance,
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

                            var location = instance.Ctx.Corpus.Storage.CorpusPathToAdapterPath(entity.EntityPath);
                            if (StringUtils.IsBlankByCdmStandard(location))
                            {
                                Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.ErrPersistModelJsonInvalidEntityPath);
                                element = null;
                            }

                            if (element is ReferenceEntity referenceEntity)
                            {
                                // path separator can differ depending on the adapter, cover the case where path uses '/' or '\'
                                int lastSlashLocation = location.LastIndexOf("/") > location.LastIndexOf("\\") ? location.LastIndexOf("/") : location.LastIndexOf("\\");
                                if (lastSlashLocation > 0)
                                    location = location.Slice(0, lastSlashLocation);

                                if (referenceEntity.ModelId != null)
                                {
                                    if (referenceModels.TryGetValue(referenceEntity.ModelId, out var savedLocation) && savedLocation != location)
                                    {
                                        Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.ErrPersistModelJsonModelIdDuplication);
                                        element = null;
                                    }
                                    else if (savedLocation == null)
                                    {
                                        referenceModels[referenceEntity.ModelId] = location;
                                        referenceEntityLocations[location] = referenceEntity.ModelId;
                                    }
                                }
                                else if (referenceEntity.ModelId == null && referenceEntityLocations.ContainsKey(location))
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
                        }

                        if (element != null)
                        {
                            obtainedEntities.Add(JToken.FromObject(element));
                        }
                        else
                        {
                            Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.ErrPersistModelJsonEntityDeclarationConversionError, entity.EntityName);
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
                        Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.ErrPersistModelJsonEntityDeclarationConversionFailure, entity.EntityName, ex.Message);
                    }
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
