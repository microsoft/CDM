// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    using System;

    /// <summary>
    /// Enumeration of operation types
    /// </summary>
    public enum CdmOperationType
    {
        Error,
        AddCountAttribute,
        AddSupportingAttribute,
        AddTypeAttribute,
        ExcludeAttributes,
        ArrayExpansion,
        CombineAttributes,
        RenameAttributes,
        ReplaceAsForeignKey,
        IncludeAttributes,
        AddAttributeGroup,
        AlterTraits,
        AddArtifactAttribute,
    }

    internal class OperationTypeConvertor
    {
        internal static string OperationTypeToString(CdmOperationType opType)
        {
            switch (opType)
            {
                case CdmOperationType.AddCountAttribute:
                    return "addCountAttribute";
                case CdmOperationType.AddSupportingAttribute:
                    return "addSupportingAttribute";
                case CdmOperationType.AddTypeAttribute:
                    return "addTypeAttribute";
                case CdmOperationType.ExcludeAttributes:
                    return "excludeAttributes";
                case CdmOperationType.ArrayExpansion:
                    return "arrayExpansion";
                case CdmOperationType.CombineAttributes:
                    return "combineAttributes";
                case CdmOperationType.RenameAttributes:
                    return "renameAttributes";
                case CdmOperationType.ReplaceAsForeignKey:
                    return "replaceAsForeignKey";
                case CdmOperationType.IncludeAttributes:
                    return "includeAttributes";
                case CdmOperationType.AddAttributeGroup:
                    return "addAttributeGroup";
                case CdmOperationType.AlterTraits:
                    return "alterTraits";
                case CdmOperationType.AddArtifactAttribute:
                    return "addArtifactAttribute";
                case CdmOperationType.Error:
                default:
                    throw new InvalidOperationException();
            }
        }

        /// <summary>
        /// Gets the operation type from the object type.
        /// </summary>
        /// <param name="objectType"></param>
        /// <returns></returns>
        internal static CdmOperationType FromObjectType(CdmObjectType objectType)
        {
            switch (objectType)
            {
                case CdmObjectType.OperationAddAttributeGroupDef:
                    return CdmOperationType.AddAttributeGroup;
                case CdmObjectType.OperationAddCountAttributeDef:
                    return CdmOperationType.AddCountAttribute;
                case CdmObjectType.OperationAddSupportingAttributeDef:
                    return CdmOperationType.AddSupportingAttribute;
                case CdmObjectType.OperationAddTypeAttributeDef:
                    return CdmOperationType.AddTypeAttribute;
                case CdmObjectType.OperationArrayExpansionDef:
                    return CdmOperationType.ArrayExpansion;
                case CdmObjectType.OperationCombineAttributesDef:
                    return CdmOperationType.CombineAttributes;
                case CdmObjectType.OperationAlterTraitsDef:
                    return CdmOperationType.AlterTraits;
                case CdmObjectType.OperationExcludeAttributesDef:
                    return CdmOperationType.ExcludeAttributes;
                case CdmObjectType.OperationIncludeAttributesDef:
                    return CdmOperationType.IncludeAttributes;
                case CdmObjectType.OperationRenameAttributesDef:
                    return CdmOperationType.RenameAttributes;
                case CdmObjectType.OperationReplaceAsForeignKeyDef:
                    return CdmOperationType.ReplaceAsForeignKey;
                case CdmObjectType.OperationAddArtifactAttributeDef:
                    return CdmOperationType.AddArtifactAttribute;
                default:
                    return CdmOperationType.Error;
            }
        }
    }
}
