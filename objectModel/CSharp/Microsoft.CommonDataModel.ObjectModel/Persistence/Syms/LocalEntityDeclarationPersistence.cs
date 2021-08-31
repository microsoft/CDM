// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    class LocalEntityDeclarationPersistence
    {
        private static readonly string Tag = nameof(LocalEntityDeclarationPersistence);

        public static CdmLocalEntityDeclarationDefinition FromData(CdmCorpusContext ctx, TableEntity table, CdmManifestDefinition manifest, string symsRootPath)
        {
            string tableName = table.Name;
            var localDec = ctx.Corpus.MakeObject<CdmLocalEntityDeclarationDefinition>(
                CdmObjectType.LocalEntityDeclarationDef,
                tableName);

            localDec.EntityPath = ctx.Corpus.Storage.CreateRelativeCorpusPath($"{tableName}.cdm.json/{tableName}", manifest);

            TableProperties tableProperties = ((JToken)table.Properties).ToObject<TableProperties>();
            var properties = tableProperties.Properties;

            if (properties != null)
            {
                if (properties.ContainsKey("cdm:isHidden"))
                {
                    var isHiddenTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.hidden", true);
                    isHiddenTrait.IsFromProperty = true;
                    localDec.ExhibitsTraits.Add(isHiddenTrait);
                }
                if (properties.ContainsKey("cdm:lastChildFileModifiedTime"))
                {
                    localDec.LastChildFileModifiedTime = DateTimeOffset.Parse(properties["cdm:lastChildFileModifiedTime"].ToObject<string>());
                }
                if (properties.ContainsKey("cdm:lastFileModifiedTime"))
                {
                    localDec.LastFileModifiedTime = DateTimeOffset.Parse(properties["cdm:lastFileModifiedTime"].ToObject<string>());
                }
                if (properties.ContainsKey("cdm:lastFileStatusCheckTime"))
                {
                    localDec.LastFileStatusCheckTime = DateTimeOffset.Parse(properties["cdm:lastFileStatusCheckTime"].ToObject<string>());
                }
                if (properties.ContainsKey("cdm:explanation"))
                {
                    localDec.Explanation = properties["cdm:explanation"].ToObject<string>();
                }
                if (properties.ContainsKey("cdm:entityDecTraits"))
                {
                    Utils.AddListToCdmCollection(localDec.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, properties["cdm:entityDecTraits"]));
                }
            }

            if (tableProperties.Partitioning != null && tableProperties.Partitioning.Keys != null)
            {
                // TODO :This is spark data partitioning.
                Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), localDec.AtCorpusPath, CdmLogCode.ErrPersistSymsPartitionNotSupported, tableName);
                return null;
            }
            else
            {
                if (tableProperties.StorageDescriptor != null && tableProperties.StorageDescriptor.Format != null)
                {
                    if (tableProperties.StorageDescriptor.Source.Location == "")
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), localDec.AtCorpusPath, CdmLogCode.ErrPersistSymsTableMissingDataLocation, tableName);
                        return null;
                    }

                    if (tableProperties.StorageDescriptor.Format.FormatType == FormatType.Csv)
                    {
                        if (tableProperties.StorageDescriptor.Source.Location.EndWithOrdinalIgnoreCase(".csv"))
                        {
                            // Location points to file. create data partition.
                            var dataPartition = DataPartitionPersistence.FromData(ctx, tableProperties.StorageDescriptor, symsRootPath);
                            localDec.DataPartitions.Add(dataPartition);
                        }
                        else if (System.IO.Path.GetExtension(tableProperties.StorageDescriptor.Source.Location) == String.Empty)
                        {
                            var dataPartitionPattern = DataPartitionPatternPersistence.FromData(ctx, tableProperties.StorageDescriptor, $"{table.Name}PartitionPattern", symsRootPath);
                            localDec.DataPartitionPatterns.Add(dataPartitionPattern);
                        }
                        else
                        {
                            // restore data partition pattern if exist
                            if (properties != null && properties.ContainsKey("cdm:dataPartitionPatterns"))
                            {
                                var dataPartitionPattern = DataPartitionPatternPersistence.FromData(ctx, properties["cdm:dataPartitionPatterns"], $"{table.Name}PartitionPattern", symsRootPath);
                                localDec.DataPartitionPatterns.Add(dataPartitionPattern);
                            }
                            else
                            {
                                Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), localDec.AtCorpusPath, CdmLogCode.ErrPersistSymsTableInvalidDataLocation, tableName);
                                return null;
                            }
                        }
                    }
                    else if (tableProperties.StorageDescriptor.Format.FormatType == FormatType.Parquet)
                    {
                        // TODO : Parquet or other.
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), localDec.AtCorpusPath, CdmLogCode.ErrPersistSymsTableFormatTypeNotSupported, tableName);
                        return null;
                    }
                    else
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), localDec.AtCorpusPath, CdmLogCode.ErrPersistSymsTableFormatTypeNotSupported, tableName);
                        return null;
                    }
                }
            }
            return localDec;
        }

        public static async Task<TableEntity> ToDataAsync(CdmLocalEntityDeclarationDefinition instance, CdmManifestDefinition manifest, string symsRootPath,
             ResolveOptions resOpt, CopyOptions options)
        {
            TableEntity tableEntity = await DocumentPersistence.ToDataAsync(instance.EntityPath, manifest, instance.Ctx, resOpt, options);

            if (tableEntity != null)
            {
                TableProperties teProperties = (TableProperties)tableEntity.Properties;
                var properties = CreateTablePropertyBags(instance, resOpt, options, teProperties.Properties);

                if (instance.DataPartitions != null && instance.DataPartitions.Count > 0)
                {
                    List<string> paths = new List<string>();
                    foreach (var element in instance.DataPartitions)
                    {
                        if (element.Location != null)
                        {
                            var adlsPath = instance.Ctx.Corpus.Storage.CorpusPathToAdapterPath(element.Location);
                            string location = element.Location;
                            if (adlsPath == null)
                            {
                                Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToDataAsync), instance.AtCorpusPath, CdmLogCode.ErrPersistSymsAdlsAdapterMissing, element.Location);
                                return null;
                            }
                            var symsPath = Utils.AdlsAdapterPathToSymsPath(adlsPath);
                            if (symsPath != null)
                            {
                                location = symsPath;
                            }
                            else
                            {
                                var pathTuple = StorageUtils.SplitNamespacePath(element.Location);
                                location = Utils.CreateSymsAbsolutePath(symsRootPath, pathTuple.Item2);
                            }

                            paths.Add(location);
                        }

                        teProperties.StorageDescriptor = DataPartitionPersistence.ToData(element, teProperties.StorageDescriptor, resOpt, options);
                    }

                    // Logic to find common root folder.
                    IEnumerable<string> samples = paths.ToArray();
                    teProperties.StorageDescriptor.Source.Location = new string(samples.First().Substring(0, samples.Min(s => s.Length))
                                                                        .TakeWhile((c, i) => samples.All(s => s[i] == c)).ToArray());
                }
                else
                {
                    // location and format is mandatory for syms.
                    teProperties.StorageDescriptor.Source.Location = Utils.CreateSymsAbsolutePath(symsRootPath, instance.EntityName);
                }

                teProperties.Properties = properties;
            }

            return tableEntity;
        }

        private static IDictionary<string, JToken> CreateTablePropertyBags(CdmLocalEntityDeclarationDefinition instance, ResolveOptions resOpt, CopyOptions options, IDictionary<string, JToken> properties)
        {
            if (properties == null)
            {
                properties = new Dictionary<string, JToken>();
            }

            if (instance.EntityPath != null)
            {
                Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(instance.EntityPath);
                if (pathTuple == null)
                {
                    Logger.Error((ResolveContext)instance.Ctx, Tag, nameof(ToDataAsync), instance.AtCorpusPath, CdmLogCode.ErrPersistSymsEntityPathNull, instance.EntityName);
                    return null;
                }
                properties["cdm:entityPath"] = JToken.FromObject(pathTuple.Item2);
            }

            var t2pm = new TraitToPropertyMap(instance);
            var isHiddenTrait = t2pm.FetchTraitReference("is.hidden");

            if (!properties.ContainsKey("cdm:description"))
            {
                properties["cdm:description"] = instance.Explanation;
            }

            if (instance.LastChildFileModifiedTime != null)
            {
                properties["cdm:lastChildFileModifiedTime"] = instance.LastChildFileModifiedTime;
            }

            if (instance.LastFileModifiedTime != null)
            {
                properties["cdm:lastFileModifiedTime"] = instance.LastFileModifiedTime;
            }

            if (instance.LastFileStatusCheckTime != null)
            {
                properties["cdm:lastFileStatusCheckTime"] = instance.LastFileStatusCheckTime;
            }

            if (isHiddenTrait != null)
            {
                properties["cdm:isHidden"] = true;
            }

            if (instance.ExhibitsTraits != null && instance.ExhibitsTraits.Count > 0)
            {
                properties["cdm:entityDecTraits"] = JToken.FromObject(Utils.ListCopyData<TraitReferenceDefinition>(resOpt, instance.ExhibitsTraits, options),
                    new JsonSerializer { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }

            return properties;
        }
    }
}