// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// The local entity declaration persistence.
    /// </summary>
    class LocalEntityDeclarationPersistence
    {

        public static async Task<CdmLocalEntityDeclarationDefinition> FromData(CdmCorpusContext ctx, CdmFolderDefinition documentFolder, LocalEntity obj, List<CdmTraitDefinition> extensionTraitDefList, CdmManifestDefinition manifest)
        {
            var localEntity = ctx.Corpus.MakeObject<CdmLocalEntityDeclarationDefinition>(CdmObjectType.LocalEntityDeclarationDef, obj.Name);

            var localExtensionTraitDefList = new List<CdmTraitDefinition>();

            var entityDoc = await DocumentPersistence.FromData(ctx, obj, extensionTraitDefList, localExtensionTraitDefList);

            if (entityDoc == null)
            {
                Logger.Error(nameof(LocalEntityDeclarationPersistence), ctx, "There was an error while trying to fetch the entity doc from local entity declaration persistence.");
                return null;
            }

            documentFolder.Documents.Add(entityDoc);

            // Entity schema path is the path to the doc containing the entity definition.
            localEntity.EntityPath = ctx.Corpus.Storage.CreateRelativeCorpusPath($"{entityDoc.AtCorpusPath}/{obj.Name}", manifest);
            localEntity.Explanation = obj.Description;
            localEntity.LastChildFileModifiedTime = obj.LastChildFileModifiedTime;
            localEntity.LastFileModifiedTime = obj.LastFileModifiedTime;
            localEntity.LastFileStatusCheckTime = obj.LastFileStatusCheckTime;

            if (obj.IsHidden == true)
            {
                var isHiddenTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.hidden", true);
                isHiddenTrait.IsFromProperty = true;
                localEntity.ExhibitsTraits.Add(isHiddenTrait);
            }

            // Add traits for schema entity info.
            if (obj.Schemas != null)
            {
                var t2pm = new TraitToPropertyMap(localEntity);
                t2pm.UpdatePropertyValue("cdmSchemas", obj.Schemas);
            }

            // Data partitions are part of the local entity, add them here.
            if (obj.Partitions != null)
            {
                foreach (var element in obj.Partitions)
                {
                    var cdmPartition = await DataPartitionPersistence.FromData(ctx, element, extensionTraitDefList, localExtensionTraitDefList, documentFolder);

                    if (cdmPartition != null)
                    {
                        localEntity.DataPartitions.Add(cdmPartition);
                    }
                    else
                    {
                        Logger.Error(nameof(LocalEntityDeclarationPersistence), ctx, "There was an error while trying to fetch the entity doc from local entity declaration persistence.");
                        return null;
                    }
                }
            }

            List<CdmImport> importDocs = await ExtensionHelper.StandardImportDetection(ctx, extensionTraitDefList, localExtensionTraitDefList);
            ExtensionHelper.AddImportDocsToManifest(ctx, importDocs, entityDoc);

            return localEntity;
        }

        public static async Task<LocalEntity> ToData(CdmLocalEntityDeclarationDefinition instance, CdmManifestDefinition manifest, ResolveOptions resOpt, CopyOptions options)
        {
            var localEntity = await DocumentPersistence.ToData(instance.EntityPath, manifest, resOpt, options, instance.Ctx);

            if (localEntity != null)
            {
                var t2pm = new TraitToPropertyMap(instance);
                var isHiddenTrait = t2pm.FetchTraitReference("is.hidden");

                localEntity.Description = instance.Explanation;
                localEntity.LastChildFileModifiedTime = instance.LastChildFileModifiedTime;
                localEntity.LastFileModifiedTime = instance.LastFileModifiedTime;
                localEntity.LastFileStatusCheckTime = instance.LastFileStatusCheckTime;

                if (isHiddenTrait != null)
                {
                    localEntity.IsHidden = true;
                }

                if (t2pm.FetchPropertyValue("cdmSchemas") is List<string> schemas)
                {
                    localEntity.Schemas = schemas;
                }

                if (instance.DataPartitions != null && instance.DataPartitions.Count > 0)
                {
                    localEntity.Partitions = new List<Partition>();

                    foreach (var element in instance.DataPartitions)
                    {
                        var partition = await DataPartitionPersistence.ToData(element, resOpt, options);

                        if (partition != null)
                        {
                            localEntity.Partitions.Add(partition);
                        }
                        else
                        {
                            Logger.Error(nameof(LocalEntityDeclarationPersistence), instance.Ctx, "There was an error while trying to convert cdm data partition to model.json partition.");
                            return null;
                        }
                    }
                }
            }

            return localEntity;
        }
    }
}
