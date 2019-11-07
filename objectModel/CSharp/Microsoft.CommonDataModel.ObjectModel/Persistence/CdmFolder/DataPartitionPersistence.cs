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
                if (arg.Properties().Count() != 1)
                {
                    Logger.Warning(nameof(DataPartitionPatternPersistence), (ResolveContext)ctx, $"invalid set of arguments provided for data partition corresponding to location: {obj["location"]}");
                }

                var key = arg.Properties().First().Name;
                var value = (string)arg[key];
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
            var argumentsCopy = new List<KeyValuePair<string, string>>();
            foreach (var argumentList in instance.Arguments)
            {
                foreach (var argumentValue in argumentList.Value)
                {
                    argumentsCopy.Add(new KeyValuePair<string, string>(argumentList.Key, argumentValue));
                }
            }

            var result = new DataPartition
            {
                Location = instance.Location,
                LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime),
                LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime),
                ExhibitsTraits = Utils.ListCopyData(resOpt, instance.ExhibitsTraits?.Where(trait => !trait.IsFromProperty)?.ToList(), options),
                Arguments = argumentsCopy,
                SpecializedSchema = instance.SpecializedSchema
            };

            return result;
        }
    }
}
