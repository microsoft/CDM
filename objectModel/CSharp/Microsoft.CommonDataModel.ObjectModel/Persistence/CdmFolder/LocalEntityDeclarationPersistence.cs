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

    class LocalEntityDeclarationPersistence
    {
        private static readonly string Tag = nameof(LocalEntityDeclarationPersistence);

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
                    Logger.Error(ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistEntityPathNotFound, (string)obj["entityName"]);
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

            Utils.AddListToCdmCollection(localDec.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));

            if (obj["dataPartitions"] != null)
            {
                foreach (var dataPartition in obj["dataPartitions"])
                {
                    var dataPartitionDef = DataPartitionPersistence.FromData(ctx, dataPartition);
                    if (dataPartitionDef.IsIncremental)
                    {
                        ErrorMessage((ResolveContext)ctx, nameof(FromData), null, dataPartitionDef, true);
                    }
                    else
                    {
                        localDec.DataPartitions.Add(dataPartitionDef);
                    }
                }
            }

            if (obj["dataPartitionPatterns"] != null)
            {
                foreach (var pattern in obj["dataPartitionPatterns"])
                {
                    var dataPartitionPatternDef = DataPartitionPatternPersistence.FromData(ctx, pattern);
                    if (dataPartitionPatternDef.IsIncremental)
                    {
                        ErrorMessage((ResolveContext)ctx, nameof(FromData), null, dataPartitionPatternDef, true);
                    }
                    else
                    {
                        localDec.DataPartitionPatterns.Add(dataPartitionPatternDef);
                    }
                }
            }

            if (obj["incrementalPartitions"] != null)
            {
                foreach (var incrementalPartition in obj["incrementalPartitions"])
                {
                    var incrementalPartitionDef = DataPartitionPersistence.FromData(ctx, incrementalPartition);
                    if (!incrementalPartitionDef.IsIncremental)
                    {
                        ErrorMessage((ResolveContext)ctx, nameof(FromData), null, incrementalPartitionDef, false);
                    }
                    else
                    {
                        localDec.IncrementalPartitions.Add(incrementalPartitionDef);
                    }
                }
            }

            if (obj["incrementalPartitionPatterns"] != null)
            {
                foreach (var incrementalPattern in obj["incrementalPartitionPatterns"])
                {
                    var incrementalPartitionPatternDef = DataPartitionPatternPersistence.FromData(ctx, incrementalPattern);
                    if (!incrementalPartitionPatternDef.IsIncremental)
                    {
                        ErrorMessage((ResolveContext)ctx, nameof(FromData), null, incrementalPartitionPatternDef, false);
                    }
                    else
                    {
                        localDec.IncrementalPartitionPatterns.Add(incrementalPartitionPatternDef);
                    }
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
                DataPartitions = Utils.ListCopyData<DataPartition>(resOpt, instance.DataPartitions, options, ensureNonIncremental(instance)),
                DataPartitionPatterns = Utils.ListCopyData<DataPartitionPattern>(resOpt, instance.DataPartitionPatterns, options, ensureNonIncremental(instance)),
                IncrementalPartitions = Utils.ListCopyData<DataPartition>(resOpt, instance.IncrementalPartitions, options, ensureIncremental(instance)),
                IncrementalPartitionPatterns = Utils.ListCopyData<DataPartitionPattern>(resOpt, instance.IncrementalPartitionPatterns, options, ensureIncremental(instance))
            };

            return result;
        }

        private static void ErrorMessage(CdmCorpusContext ctx, string methodName, string corpusPath, CdmDataPartitionDefinition obj, bool isIncremental)
        {
            if (isIncremental)
            {
                Logger.Error(ctx, Tag, methodName, corpusPath, CdmLogCode.ErrPersistIncrementalConversionError, obj.Name, Constants.IncrementalTraitName, nameof(CdmLocalEntityDeclarationDefinition.DataPartitions));
            }
            else
            {
                Logger.Error(ctx, Tag, methodName, corpusPath, CdmLogCode.ErrPersistNonIncrementalConversionError, obj.Name, Constants.IncrementalTraitName, nameof(CdmLocalEntityDeclarationDefinition.IncrementalPartitions));
            }
        }

        private static void ErrorMessage(CdmCorpusContext ctx, string methodName, string corpusPath, CdmDataPartitionPatternDefinition obj, bool isIncremental)
        {
            if (isIncremental)
            {
                Logger.Error(ctx, Tag, methodName, corpusPath, CdmLogCode.ErrPersistIncrementalConversionError, obj.Name, Constants.IncrementalTraitName, nameof(CdmLocalEntityDeclarationDefinition.DataPartitionPatterns));
            }
            else
            {
                Logger.Error(ctx, Tag, methodName, corpusPath, CdmLogCode.ErrPersistNonIncrementalConversionError, obj.Name, Constants.IncrementalTraitName, nameof(CdmLocalEntityDeclarationDefinition.IncrementalPartitionPatterns));
            }
        }

        private static Func<dynamic, bool> ensureNonIncremental(CdmLocalEntityDeclarationDefinition instance)
        {
            bool compare(dynamic obj)
            {
                if ((obj is CdmDataPartitionDefinition && (obj as CdmDataPartitionDefinition).IsIncremental) ||
                    (obj is CdmDataPartitionPatternDefinition && (obj as CdmDataPartitionPatternDefinition).IsIncremental))
                {
                    ErrorMessage(instance.Ctx, nameof(ToData), instance.AtCorpusPath, obj, true);
                    return false;
                }
                return true;
            }
            return compare;
        }

        private static Func<dynamic, bool> ensureIncremental(CdmLocalEntityDeclarationDefinition instance)
        {
            bool compare(dynamic obj)
            {
                if ((obj is CdmDataPartitionDefinition && !(obj as CdmDataPartitionDefinition).IsIncremental) ||
                    (obj is CdmDataPartitionPatternDefinition && !(obj as CdmDataPartitionPatternDefinition).IsIncremental))
                {
                    ErrorMessage(instance.Ctx, nameof(ToData), instance.AtCorpusPath, obj, false);
                    return false;
                }
                return true;
            }
            return compare;
        }
    }
}
