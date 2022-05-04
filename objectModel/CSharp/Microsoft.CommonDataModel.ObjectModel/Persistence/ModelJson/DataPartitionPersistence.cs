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
    /// The data partition persistence.
    /// </summary>
    class DataPartitionPersistence
    {
        private static readonly string Tag = nameof(DataPartitionPersistence);

        public static async Task<CdmDataPartitionDefinition> FromData(CdmCorpusContext ctx, Partition obj, List<CdmTraitDefinition> extensionTraitDefList, List<CdmTraitDefinition> localExtensionTraitDefList, CdmFolderDefinition documentFolder)
        {
            var partition = ctx.Corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, obj.Name);

            if (!StringUtils.IsBlankByCdmStandard(obj.Description))
                partition.Description = obj.Description;
            partition.Location = ctx.Corpus.Storage.CreateRelativeCorpusPath(
                ctx.Corpus.Storage.AdapterPathToCorpusPath(obj.Location),
                documentFolder);
            partition.RefreshTime = obj.RefreshTime;
            partition.LastFileModifiedTime = obj.LastFileModifiedTime;
            partition.LastFileStatusCheckTime = obj.LastFileStatusCheckTime;


            if (StringUtils.IsBlankByCdmStandard(partition.Location))
            {
                Logger.Warning(ctx as ResolveContext, Tag, nameof(FromData), null, CdmLogCode.WarnPersistPartitionLocMissing, partition.Name);
            }

            if (obj.IsHidden == true)
            {
                var isHiddenTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.hidden", true);
                partition.ExhibitsTraits.Add(isHiddenTrait);
            }

            await Utils.ProcessAnnotationsFromData(ctx, obj, partition.ExhibitsTraits);

            var csvFormatTrait = partition.ExhibitsTraits.Item("is.partition.format.CSV") as CdmTraitReference;
            if (obj.FileFormatSettings != null)
            {
                var partitionTraitExisted = csvFormatTrait != null;
                csvFormatTrait = Utils.CreateCsvTrait(obj.FileFormatSettings, ctx, csvFormatTrait);

                if (csvFormatTrait == null) {
                    Logger.Error(ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistCsvProcessingError);
                    return null;
                }

                if (!partitionTraitExisted)
                {
                    partition.ExhibitsTraits.Add(csvFormatTrait);
                }
            }
            ExtensionHelper.ProcessExtensionFromJson(ctx, obj, partition.ExhibitsTraits, extensionTraitDefList, localExtensionTraitDefList);

            return partition;
        }

        public static async Task<Partition> ToData(CdmDataPartitionDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var result = new Partition
            {
                Name = instance.Name,
                Description = instance.Description,
                Location = instance.Ctx.Corpus.Storage.CorpusPathToAdapterPath(
                    instance.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(
                        instance.Location, instance.InDocument)),
                RefreshTime = instance.RefreshTime,
                FileFormatSettings = null,
                LastFileModifiedTime = instance.LastFileModifiedTime,
                LastFileStatusCheckTime = instance.LastFileStatusCheckTime
            };

            if (result.Name == null)
            {
                Logger.Warning(instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.WarnPersistPartitionNameNull);
                result.Name = "";
            }

            if (StringUtils.IsBlankByCdmStandard(result.Location))
            {
                Logger.Warning(instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.WarnPersistPartitionLocMissing, result.Name);
            }

            await Utils.ProcessTraitsAndAnnotationsToData(instance.Ctx, result, instance.ExhibitsTraits);

            var t2pm = new TraitToPropertyMap(instance);

            var isHiddenTrait = t2pm.FetchTraitReference("is.hidden");
            if (isHiddenTrait != null)
            {
                result.IsHidden = true;
            }

            var csvTrait = t2pm.FetchTraitReference("is.partition.format.CSV");
            if (csvTrait != null)
            {
                var csvFormatSettings = Utils.CreateCsvFormatSettings(csvTrait);

                if (csvFormatSettings != null)
                {
                    result.FileFormatSettings = csvFormatSettings;
                    result.FileFormatSettings.Type = "CsvFormatSettings";
                }
                else
                {
                    Logger.Error(instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.ErrPersistCsvProcessingError);
                    return null;
                }
            }

            return result;
        }
    }
}
