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
    using System.Collections.Generic;

    /// <summary>
    /// Projection persistence
    /// </summary>
    public class ProjectionPersistence
    {
        public static CdmProjection FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmProjection projection = ctx.Corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);

            CdmEntityReference source = EntityReferencePersistence.FromData(ctx, obj["source"]);

            if (obj["explanation"] != null)
            {
                projection.Explanation = (string)obj["explanation"];
            }

            projection.Condition = obj["condition"]?.ToString();
            projection.RunSequentially = (bool?)obj["runSequentially"];

            if (obj["operations"] != null)
            {
                List<JObject> operationJsons = obj["operations"]?.ToObject<List<JObject>>();
                foreach (JObject operationJson in operationJsons)
                {
                    string type = (string)operationJson["$type"];
                    switch (type)
                    {
                        case "addCountAttribute":
                            CdmOperationAddCountAttribute addCountAttributeOp = OperationAddCountAttributePersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(addCountAttributeOp);
                            break;
                        case "addSupportingAttribute":
                            CdmOperationAddSupportingAttribute addSupportingAttributeOp = OperationAddSupportingAttributePersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(addSupportingAttributeOp);
                            break;
                        case "addTypeAttribute":
                            CdmOperationAddTypeAttribute addTypeAttributeOp = OperationAddTypeAttributePersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(addTypeAttributeOp);
                            break;
                        case "excludeAttributes":
                            CdmOperationExcludeAttributes excludeAttributesOp = OperationExcludeAttributesPersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(excludeAttributesOp);
                            break;
                        case "arrayExpansion":
                            CdmOperationArrayExpansion arrayExpansionOp = OperationArrayExpansionPersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(arrayExpansionOp);
                            break;
                        case "combineAttributes":
                            CdmOperationCombineAttributes combineAttributesOp = OperationCombineAttributesPersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(combineAttributesOp);
                            break;
                        case "renameAttributes":
                            CdmOperationRenameAttributes renameAttributesOp = OperationRenameAttributesPersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(renameAttributesOp);
                            break;
                        case "replaceAsForeignKey":
                            CdmOperationReplaceAsForeignKey replaceAsForeignKeyOp = OperationReplaceAsForeignKeyPersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(replaceAsForeignKeyOp);
                            break;
                        case "includeAttributes":
                            CdmOperationIncludeAttributes includeAttributesOp = OperationIncludeAttributesPersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(includeAttributesOp);
                            break;
                        case "addAttributeGroup":
                            CdmOperationAddAttributeGroup addAttributeGroupOp = OperationAddAttributeGroupPersistence.FromData(ctx, operationJson);
                            projection.Operations.Add(addAttributeGroupOp);
                            break;
                        default:
                            Logger.Error(nameof(ProjectionPersistence), ctx, $"Invalid operation type '{type}'.", nameof(FromData));
                            break;
                    }
                }
            }

            projection.Source = source;

            return projection;
        }

        public static Projection ToData(CdmProjection instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            dynamic source = null;
            if (instance.Source != null && instance.Source.GetType() == typeof(string))
            {
                source = instance.Source;
            }
            else if (instance.Source != null && !string.IsNullOrWhiteSpace(instance.Source.NamedReference) && instance.Source.ExplicitReference == null)
            {
                source = instance.Source.NamedReference;
            }
            else if (instance.Source != null && instance.Source.GetType() == typeof(CdmEntityReference))
            {
                source = EntityReferencePersistence.ToData(instance.Source, resOpt, options);
            }

            List<OperationBase> operations = null;
            if (instance.Operations != null && instance.Operations.Count > 0)
            {
                operations = new List<OperationBase>();
                foreach (CdmOperationBase operation in instance.Operations)
                {
                    switch (operation.ObjectType)
                    {
                        case CdmObjectType.OperationAddCountAttributeDef:
                            OperationAddCountAttribute addCountAttributeOp = OperationAddCountAttributePersistence.ToData(operation as CdmOperationAddCountAttribute, resOpt, options);
                            operations.Add(addCountAttributeOp);
                            break;
                        case CdmObjectType.OperationAddSupportingAttributeDef:
                            OperationAddSupportingAttribute addSupportingAttributeOp = OperationAddSupportingAttributePersistence.ToData(operation as CdmOperationAddSupportingAttribute, resOpt, options);
                            operations.Add(addSupportingAttributeOp);
                            break;
                        case CdmObjectType.OperationAddTypeAttributeDef:
                            OperationAddTypeAttribute addTypeAttributeOp = OperationAddTypeAttributePersistence.ToData(operation as CdmOperationAddTypeAttribute, resOpt, options);
                            operations.Add(addTypeAttributeOp);
                            break;
                        case CdmObjectType.OperationExcludeAttributesDef:
                            OperationExcludeAttributes excludeAttributesOp = OperationExcludeAttributesPersistence.ToData(operation as CdmOperationExcludeAttributes, resOpt, options);
                            operations.Add(excludeAttributesOp);
                            break;
                        case CdmObjectType.OperationArrayExpansionDef:
                            OperationArrayExpansion arrayExpansionOp = OperationArrayExpansionPersistence.ToData(operation as CdmOperationArrayExpansion, resOpt, options);
                            operations.Add(arrayExpansionOp);
                            break;
                        case CdmObjectType.OperationCombineAttributesDef:
                            OperationCombineAttributes combineAttributesOp = OperationCombineAttributesPersistence.ToData(operation as CdmOperationCombineAttributes, resOpt, options);
                            operations.Add(combineAttributesOp);
                            break;
                        case CdmObjectType.OperationRenameAttributesDef:
                            OperationRenameAttributes renameAttributesOp = OperationRenameAttributesPersistence.ToData(operation as CdmOperationRenameAttributes, resOpt, options);
                            operations.Add(renameAttributesOp);
                            break;
                        case CdmObjectType.OperationReplaceAsForeignKeyDef:
                            OperationReplaceAsForeignKey replaceAsForeignKeyOp = OperationReplaceAsForeignKeyPersistence.ToData(operation as CdmOperationReplaceAsForeignKey, resOpt, options);
                            operations.Add(replaceAsForeignKeyOp);
                            break;
                        case CdmObjectType.OperationIncludeAttributesDef:
                            OperationIncludeAttributes includeAttributesOp = OperationIncludeAttributesPersistence.ToData(operation as CdmOperationIncludeAttributes, resOpt, options);
                            operations.Add(includeAttributesOp);
                            break;
                        case CdmObjectType.OperationAddAttributeGroupDef:
                            OperationAddAttributeGroup addAttributeGroupOp = OperationAddAttributeGroupPersistence.ToData(operation as CdmOperationAddAttributeGroup, resOpt, options);
                            operations.Add(addAttributeGroupOp);
                            break;
                        default:
                            OperationBase baseOp = new OperationBase();
                            baseOp.Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.Error);
                            operations.Add(baseOp);
                            break;
                    }
                }
            }

            return new Projection
            {
                Explanation = instance.Explanation,
                Source = source,
                Operations = operations,
                Condition = instance.Condition,
                RunSequentially = instance.RunSequentially
            };
        }
    }
}
