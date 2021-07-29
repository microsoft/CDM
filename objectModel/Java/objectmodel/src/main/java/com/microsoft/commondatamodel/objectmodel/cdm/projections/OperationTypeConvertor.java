// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
 @Deprecated
public class OperationTypeConvertor {
    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     * @param opType CdmOperationType
     * @return String
     */
    @Deprecated
    public static String operationTypeToString(CdmOperationType opType) {
        switch (opType) {
            case AddCountAttribute:
                return "addCountAttribute";
            case AddSupportingAttribute:
                return "addSupportingAttribute";
            case AddTypeAttribute:
                return "addTypeAttribute";
            case ExcludeAttributes:
                return "excludeAttributes";
            case ArrayExpansion:
                return "arrayExpansion";
            case CombineAttributes:
                return "combineAttributes";
            case RenameAttributes:
                return "renameAttributes";
            case ReplaceAsForeignKey:
                return "replaceAsForeignKey";
            case IncludeAttributes:
                return "includeAttributes";
            case AddAttributeGroup:
                return "addAttributeGroup";
            case AlterTraits:
                return "alterTraits";
            case AddArtifactAttribute:
                return "addArtifactAttribute";
            case Error:
            default:
                throw new UnsupportedOperationException();
        }
    }

    

  /**
   * @deprecated
   * Gets the operation type from the object type.
   */
  public static CdmOperationType fromObjectType(CdmObjectType objectType) {
    switch (objectType) {
      case OperationAddAttributeGroupDef:
        return CdmOperationType.AddAttributeGroup;
      case OperationAddCountAttributeDef:
        return CdmOperationType.AddCountAttribute;
      case OperationAddSupportingAttributeDef:
        return CdmOperationType.AddSupportingAttribute;
      case OperationAddTypeAttributeDef:
        return CdmOperationType.AddTypeAttribute;
      case OperationArrayExpansionDef:
        return CdmOperationType.ArrayExpansion;
      case OperationCombineAttributesDef:
        return CdmOperationType.CombineAttributes;
      case OperationExcludeAttributesDef:
        return CdmOperationType.ExcludeAttributes;
      case OperationIncludeAttributesDef:
        return CdmOperationType.IncludeAttributes;
      case OperationRenameAttributesDef:
        return CdmOperationType.RenameAttributes;
      case OperationReplaceAsForeignKeyDef:
        return CdmOperationType.ReplaceAsForeignKey;
      case OperationAlterTraitsDef:
        return CdmOperationType.AlterTraits;
      case OperationAddArtifactAttributeDef:
        return CdmOperationType.AddArtifactAttribute;
      default:
        return CdmOperationType.Error;
    }
  }
}
