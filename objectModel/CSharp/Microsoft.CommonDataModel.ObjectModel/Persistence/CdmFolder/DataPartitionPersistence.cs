// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    class DataPartitionPersistence
    {
        public static CdmDataPartitionDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var newPartition = ctx.Corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef);
            newPartition.Location = (string)obj["location"];

            if (obj["name"] != null)
            {
                newPartition.Name = (string)obj["name"];
            }

            if (obj["specializedSchema"] != null)
            {
                newPartition.SpecializedSchema = (string)obj["specializedSchema"];
            }

            if (obj["lastFileStatusCheckTime"] != null)
            {
                newPartition.LastFileStatusCheckTime = DateTimeOffset.Parse(obj.Value<string>("lastFileStatusCheckTime"));
            }

            if (obj["lastFileModifiedTime"] != null)
            {
                newPartition.LastFileModifiedTime = DateTimeOffset.Parse(obj.Value<string>("lastFileModifiedTime"));
            }

            if (obj["exhibitsTraits"] != null)
            {
                Utils.AddListToCdmCollection(newPartition.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            }

            if (obj["arguments"] == null)
            {
                return newPartition;
            }

            foreach (var argToken in obj["arguments"])
            {
                var arg = (JObject)argToken;
                string key = null;
                string value = null;
                if (arg.Properties().Count() == 1)
                {
                    key = arg.Properties().First().Name;
                    value = (string)arg[key];
                }
                else
                {
                    key = (string)(arg["key"] != null ? arg["key"]: arg["name"]);
                    value = (string)arg["value"];
                }

                if (key == null || value == null)
                {
                    Logger.Warning(nameof(DataPartitionPatternPersistence), (ResolveContext)ctx, $"invalid set of arguments provided for data partition corresponding to location: {obj["location"]}");
                    continue;
                }

                
                if (newPartition.Arguments.ContainsKey(key))
                {
                    newPartition.Arguments[key].Add(value);
                }
                else
                {
                    newPartition.Arguments[key] = new List<string>() { value };
                }
            }

            return newPartition;
        }

        public static DataPartition ToData(CdmDataPartitionDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var argumentsCopy = new List<Argument>();
            if (instance.Arguments != null)
            {
                foreach (var argumentList in instance.Arguments)
                {
                    foreach (var argumentValue in argumentList.Value)
                    {
                        argumentsCopy.Add(
                            new Argument()
                            {
                                Name = argumentList.Key,
                                Value = argumentValue
                            }
                        );
                    }
                }
            }

            var result = new DataPartition
            {
                Name = instance.Name,
                Location = instance.Location,
                LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime),
                LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime),
                ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options),
                Arguments = argumentsCopy.Count() > 0 ? argumentsCopy : null,
                SpecializedSchema = instance.SpecializedSchema
            };

            return result;
        }
    }
}
