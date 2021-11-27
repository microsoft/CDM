// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;

    class DataPartitionPatternPersistence
    {
        private static readonly string Tag = nameof(DataPartitionPatternPersistence);

        public static CdmDataPartitionPatternDefinition FromData(CdmCorpusContext ctx, dynamic obj, string name, string symsRootPath, FormatType formatType)
        {
            var dataPartitionPattern = ctx.Corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, name);
            if ( obj is StorageDescriptor ) 
            {
                var sd = (StorageDescriptor)obj;
                var properties = sd.Properties;

                var symsPath = Utils.CreateSymsAbsolutePath(symsRootPath, sd.Source.Location);
                dataPartitionPattern.RootLocation = Utils.SymsPathToCorpusPath(symsPath, ctx.Corpus.Storage);

                if (formatType == FormatType.Csv)
                {
                    dataPartitionPattern.GlobPattern = "/**/*.csv";
                }
                else if (formatType == FormatType.Parquet)
                {
                    dataPartitionPattern.GlobPattern = "/**/*.parquet";
                }
                else
                {
                    Logger.Error(ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistSymsUnsupportedTableFormat);
                    return null;
                }

                var trait = Utils.CreatePartitionTrait(sd.Format.Properties, ctx, formatType);
                if (trait != null)
                {
                    dataPartitionPattern.ExhibitsTraits.Add(trait);
                }
                else
                {
                    Logger.Error(ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistSymsUnsupportedTableFormat);
                    return null;
                }

                if (properties != null)
                {
                    if (properties.ContainsKey("cdm:name"))
                    {
                        dataPartitionPattern.Name = (string)obj.Properties["cdm:name"];
                    }
                    if (properties.ContainsKey("cdm:lastFileStatusCheckTime"))
                    {
                        dataPartitionPattern.LastFileStatusCheckTime = DateTimeOffset.Parse(obj.Properties["cdm:lastFileStatusCheckTime"].ToString());
                    }
                    if (properties.ContainsKey("cdm:lastFileModifiedTime"))
                    {
                        dataPartitionPattern.LastFileModifiedTime = DateTimeOffset.Parse(obj.Properties["cdm:lastFileModifiedTime"].ToString());
                    }
                    if (properties.ContainsKey("cdm:traits"))
                    {
                        Utils.AddListToCdmCollection(dataPartitionPattern.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj.Properties["cdm:traits"]));
                    }
                }
            }
            else
            {
                dataPartitionPattern.Name = (string)obj["name"];
                dataPartitionPattern.RootLocation = (string)obj["rootLocation"];

                if (obj["globPattern"] != null)
                {
                    dataPartitionPattern.GlobPattern = (string)obj["globPattern"];
                }

                if (obj["regularExpression"] != null)
                {
                    dataPartitionPattern.RegularExpression = (string)obj["regularExpression"];
                }

                if (obj["parameters"] != null)
                {
                    dataPartitionPattern.Parameters = obj["parameters"].ToObject<List<string>>();
                }

                if (obj["lastFileStatusCheckTime"] != null)
                {
                    dataPartitionPattern.LastFileStatusCheckTime = DateTimeOffset.Parse(obj["lastFileStatusCheckTime"].ToString());
                }

                if (obj["lastFileModifiedTime"] != null)
                {
                    dataPartitionPattern.LastFileModifiedTime = DateTimeOffset.Parse(obj["lastFileModifiedTime"].ToString());
                }

                if (obj["explanation"] != null)
                {
                    dataPartitionPattern.Explanation = (string)obj["explanation"];
                }

                if (obj["specializedSchema"] != null)
                {
                    dataPartitionPattern.SpecializedSchema = (string)obj["specializedSchema"];
                }

                Utils.AddListToCdmCollection(dataPartitionPattern.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            }


            return dataPartitionPattern;
        }
    }


}
