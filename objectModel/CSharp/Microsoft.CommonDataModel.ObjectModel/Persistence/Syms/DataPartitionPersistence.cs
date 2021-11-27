// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    class DataPartitionPersistence
    {
        private static readonly string Tag = nameof(DataPartitionPersistence);

        public static CdmDataPartitionDefinition FromData(CdmCorpusContext ctx, StorageDescriptor obj, string symsRootPath, FormatType formatType)
        {
            var newPartition = ctx.Corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef);

            var symsPath = Utils.CreateSymsAbsolutePath(symsRootPath, obj.Source.Location);
            newPartition.Location = Utils.SymsPathToCorpusPath(symsPath, ctx.Corpus.Storage);

            var trait = Utils.CreatePartitionTrait(obj.Format.Properties, ctx, formatType);
            if (trait != null)
            {
                newPartition.ExhibitsTraits.Add(trait);
            }
            else
            {
                Logger.Error(ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistSymsUnsupportedTableFormat);
                return null;
            }

            var properties = obj.Properties;
            if (properties != null)
            {
                if (properties.ContainsKey("cdm:name"))
                {
                    newPartition.Name = (string)properties["cdm:name"];
                }
                if (properties.ContainsKey("cdm:lastFileStatusCheckTime"))
                {
                    newPartition.LastFileStatusCheckTime = DateTimeOffset.Parse(properties["cdm:lastFileStatusCheckTime"].ToString());
                }
                if (properties.ContainsKey("cdm:lastFileModifiedTime"))
                {
                    newPartition.LastFileModifiedTime = DateTimeOffset.Parse(properties["cdm:lastFileModifiedTime"].ToString());
                }
                if (properties.ContainsKey("cdm:traits"))
                {
                    Utils.AddListToCdmCollection(newPartition.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, properties["cdm:traits"]));
                }
            }

            return newPartition;
        }

        public static StorageDescriptor ToData(CdmDataPartitionDefinition instance, StorageDescriptor obj, ResolveOptions resOpt, CopyOptions options)
        {
            obj.Properties = new Dictionary<string, JToken>();

            if (instance.Name != null)
            {
                obj.Properties["cdm:name"] = instance.Name;
            }

            if (instance.LastFileStatusCheckTime != null)
            {
                obj.Properties["cdm:lastFileStatusCheckTime"] = instance.LastFileStatusCheckTime;
            }

            if (instance.LastFileModifiedTime != null)
            {
                obj.Properties["cdm:lastFileModifiedTime"] = instance.LastFileModifiedTime;
            }

            if (instance.ExhibitsTraits != null)
            {
                TraitToPropertyMap tpm = new TraitToPropertyMap(instance);
                var csvTrait = tpm.FetchTraitReference("is.partition.format.CSV");
                if (csvTrait != null)
                {
                    instance.ExhibitsTraits.Remove("is.partition.format.CSV");
                }

                if (instance.ExhibitsTraits.Count > 0)
                {
                    obj.Properties["cdm:traits"] = JToken.FromObject(Utils.ListCopyData<TraitReferenceDefinition>(resOpt, instance.ExhibitsTraits, options),
                       new JsonSerializer { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
                }
                if (csvTrait != null)
                {
                    instance.ExhibitsTraits.Add(csvTrait);
                }
            }

            var properties = FillPropertyBagFromCsvTrait(instance);

            if (properties != null)
            {
                obj.Format = new FormatInfo
                {
                    InputFormat = InputFormat.OrgapachehadoopmapredSequenceFileInputFormat,
                    OutputFormat = OutputFormat.OrgapachehadoophiveqlioHiveSequenceFileOutputFormat,
                    SerializeLib = SerializeLib.Orgapachehadoophiveserde2lazyLazySimpleSerDe,
                    FormatType = FormatType.Csv,
                    Properties = properties
                };
            }
            else
            {
                // error
                return null;
            }

            return obj;
        }

        private static IDictionary<string, JToken> FillPropertyBagFromCsvTrait(CdmDataPartitionDefinition instance, IDictionary<string, JToken> properties = null)
        {
            TraitToPropertyMap tpm = new TraitToPropertyMap(instance);
            var csvTrait = tpm.FetchTraitReference("is.partition.format.CSV");
            if (csvTrait != null)
            {
                if (properties == null)
                {
                    properties = new Dictionary<string, JToken>();
                }

                foreach (var csvTraitArg in csvTrait.Arguments)
                {
                    string key;
                    // map to syms define properties
                    switch (csvTraitArg.Name)
                    {
                        case "columnHeaders":
                            key = "header";
                            break;
                        case "delimiter":
                            key = "field.delim";
                            break;
                        default:
                            key = csvTraitArg.Value;
                            break;
                    }

                    properties[key] = csvTraitArg.Value;
                }
                
            }

            return properties;
        }

    }
}
