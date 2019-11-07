namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Text.RegularExpressions;

    class DataPartitionPatternPersistence
    {
        public static CdmDataPartitionPatternDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var newPattern = ctx.Corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, (string)obj["name"]);
            newPattern.RootLocation = (string)obj["rootLocation"];
            if (obj["regularExpression"] != null)
            {
                newPattern.RegularExpression = (string)obj["regularExpression"];
            }

            if (obj["parameters"] != null)
            {
                newPattern.Parameters = obj["parameters"].ToObject<List<string>>();
            }

            if (obj["lastFileStatusCheckTime"] != null)
            {
                newPattern.LastFileStatusCheckTime = DateTimeOffset.Parse(obj.Value<string>("lastFileStatusCheckTime"));
            }

            if (obj["lastFileModifiedTime"] != null)
            {
                newPattern.LastFileModifiedTime = DateTimeOffset.Parse(obj.Value<string>("lastFileModifiedTime"));
            }

            if (obj["explanation"] != null)
            {
                newPattern.Explanation = (string)obj["explanation"];
            }

            if (obj["specializedSchema"] != null)
            {
                newPattern.SpecializedSchema = (string)obj["specializedSchema"];
            }

            if (obj["exhibitsTraits"] != null)
            {
                Utils.AddListToCdmCollection(newPattern.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            }

            return newPattern;
        }

        public static DataPartitionPattern ToData(CdmDataPartitionPatternDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var result = new DataPartitionPattern
            {
                Name = instance.Name,
                LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime),
                LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime),
                Explanation = instance.Explanation,
                RootLocation = instance.RootLocation,
                RegularExpression = instance.RegularExpression.ToString(),
                Parameters = instance.Parameters,
                SpecializedSchema = instance.SpecializedSchema,
                ExhibitsTraits = Utils.ListCopyData(resOpt, instance.ExhibitsTraits, options)
            };

            return result;
        }
    }
}
