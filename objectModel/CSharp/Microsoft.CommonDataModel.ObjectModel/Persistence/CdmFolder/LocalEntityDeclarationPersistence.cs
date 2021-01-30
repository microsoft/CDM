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

    class LocalEntityDeclarationPersistence
    {
        public static CdmLocalEntityDeclarationDefinition FromData(CdmCorpusContext ctx, string prefixPath, JToken obj)
        {
            var localDec = ctx.Corpus.MakeObject<CdmLocalEntityDeclarationDefinition>(
                CdmObjectType.LocalEntityDeclarationDef,
                (string)obj["entityName"]);

            string entityPath = obj.Value<string>("entityPath");

            // Check for the old format, it has to be there then.
            if (entityPath == null)
            {
                entityPath = obj.Value<string>("entitySchema");

                if (entityPath == null)
                {
                    Logger.Error(nameof(LocalEntityDeclarationPersistence), ctx, "Couldn't find entity path or similar.", nameof(FromData));
                }

            }

            localDec.EntityPath = entityPath;

            if (!string.IsNullOrWhiteSpace(obj.Value<string>("lastChildFileModifiedTime")))
            {
                localDec.LastChildFileModifiedTime = DateTimeOffset.Parse(obj["lastChildFileModifiedTime"].ToString());
            }

            if (!string.IsNullOrWhiteSpace(obj.Value<string>("lastFileModifiedTime")))
            {
                localDec.LastFileModifiedTime = DateTimeOffset.Parse(obj["lastFileModifiedTime"].ToString());
            }

            if (!string.IsNullOrWhiteSpace(obj.Value<string>("lastFileStatusCheckTime")))
            {
                localDec.LastFileStatusCheckTime = DateTimeOffset.Parse(obj["lastFileStatusCheckTime"].ToString());
            }

            if (obj["explanation"] != null)
            {
                localDec.Explanation = (string)obj["explanation"];
            }

            if (obj["exhibitsTraits"] != null)
                Utils.AddListToCdmCollection(localDec.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));

            if (obj["dataPartitions"] != null)
            {
                foreach (var dataPartition in obj["dataPartitions"])
                {
                    localDec.DataPartitions.Add(DataPartitionPersistence.FromData(ctx, dataPartition));
                }
            }

            if (obj["dataPartitionPatterns"] != null)
            {
                foreach (var pattern in obj["dataPartitionPatterns"])
                {
                    localDec.DataPartitionPatterns.Add(DataPartitionPatternPersistence.FromData(ctx, pattern));
                }
            }

            return localDec;
        }

        public static EntityDeclarationDefinition ToData(CdmLocalEntityDeclarationDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var result = new EntityDeclarationDefinition
            {
                Type = EntityDeclarationDefinitionType.LocalEntity,
                EntityName = instance.EntityName,
                Explanation = instance.Explanation,
                ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options),
                LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime),
                LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime),
                LastChildFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastChildFileModifiedTime),
                EntityPath = instance.EntityPath,
                DataPartitions = Utils.ListCopyData<DataPartition>(resOpt, instance.DataPartitions, options),
                DataPartitionPatterns = Utils.ListCopyData<DataPartitionPattern>(resOpt, instance.DataPartitionPatterns, options)
            };

            return result;
        }
    }
}
