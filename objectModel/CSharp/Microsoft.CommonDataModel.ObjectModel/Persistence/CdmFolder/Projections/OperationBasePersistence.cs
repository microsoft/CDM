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

    class OperationBasePersistence
    {
        private static readonly string Tag = nameof(OperationBasePersistence);

        public static T FromData<T>(CdmCorpusContext ctx, CdmObjectType objectType, JToken obj)
            where T : CdmOperationBase
        {
            if (obj == null)
            {
                return default(T);
            }

            CdmOperationBase operation = ctx.Corpus.MakeObject<CdmOperationBase>(objectType);
            CdmOperationType operationType = OperationTypeConvertor.FromObjectType(objectType);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(operationType)))
            {
                Logger.Error(ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistProjInvalidOpsType, obj["$type"].ToString());
            }
            else
            {
                operation.Type = operationType;
            }

            operation.Condition = obj["condition"]?.ToString();
            operation.Explanation = obj["explanation"]?.ToString();
            operation.SourceInput = (bool?)obj["sourceInput"];

            return operation as T;
        }

        public static T ToData<T>(CdmOperationBase instance, ResolveOptions resOpt, CopyOptions options)
                where T : OperationBase
        {
            T obj = MakeDataObject<T>(instance.ObjectType);
            obj.Type = OperationTypeConvertor.OperationTypeToString(instance.Type);
            obj.Condition = instance.Condition;
            obj.Explanation = instance.Explanation;
            obj.SourceInput = instance.SourceInput;

            return obj as T;
        }

        /// <summary>
        /// Instantiates a data object based on the object type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="objectType"></param>
        /// <returns></returns>
        private static T MakeDataObject<T>(CdmObjectType objectType)
            where T : OperationBase
        {
            switch(objectType)
            {
                case CdmObjectType.OperationAddAttributeGroupDef:
                    return new OperationAddAttributeGroup() as T;
                case CdmObjectType.OperationAddCountAttributeDef:
                    return new OperationAddCountAttribute() as T;
                case CdmObjectType.OperationAddSupportingAttributeDef:
                    return new OperationAddSupportingAttribute() as T;
                case CdmObjectType.OperationAddTypeAttributeDef:
                    return new OperationAddTypeAttribute() as T;
                case CdmObjectType.OperationArrayExpansionDef:
                    return new OperationArrayExpansion() as T;
                case CdmObjectType.OperationCombineAttributesDef:
                    return new OperationCombineAttributes() as T;
                case CdmObjectType.OperationExcludeAttributesDef:
                    return new OperationExcludeAttributes() as T;
                case CdmObjectType.OperationIncludeAttributesDef:
                    return new OperationIncludeAttributes() as T;
                case CdmObjectType.OperationRenameAttributesDef:
                    return new OperationRenameAttributes() as T;
                case CdmObjectType.OperationReplaceAsForeignKeyDef:
                    return new OperationReplaceAsForeignKey() as T;
                case CdmObjectType.OperationAlterTraitsDef:
                    return new OperationAlterTraits() as T;
                case CdmObjectType.OperationAddArtifactAttributeDef:
                    return new OperationAddArtifactAttribute() as T;
            }

            return null;
        }
    }
}
