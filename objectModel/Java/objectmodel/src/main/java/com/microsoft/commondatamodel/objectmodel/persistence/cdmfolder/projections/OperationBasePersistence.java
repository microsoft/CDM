// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationBase;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddAttributeGroup;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddCountAttribute;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddSupportingAttribute;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddTypeAttribute;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationArrayExpansion;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationBase;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationExcludeAttributes;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationIncludeAttributes;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationReplaceAsForeignKey;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class OperationBasePersistence {
  private static final String TAG = OperationBasePersistence.class.getSimpleName();

  public static <T extends CdmOperationBase> T fromData(final CdmCorpusContext ctx, final CdmObjectType objectType, final JsonNode obj) {
    if (obj == null) {
      return null;
    }

    CdmOperationBase operation = ctx.getCorpus().makeObject(objectType);
    CdmOperationType operationType = OperationTypeConvertor.fromObjectType(objectType);
    String operationName = OperationTypeConvertor.operationTypeToString(operationType);

    if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), operationName)) {
      Logger.error(ctx, TAG, "fromData", operation.getAtCorpusPath(), CdmLogCode.ErrPersistProjInvalidType, obj.get("$type").toString());
    } else {
        operation.setType(operationType);
    }

    if (obj.get("condition") != null) {
      operation.setCondition(obj.get("condition").asText());
    }

    if (obj.get("explanation") != null) {
        operation.setExplanation(obj.get("explanation").asText());
    }

    if (obj.get("sourceInput") != null) {
      operation.setSourceInput(obj.get("sourceInput").asBoolean());
    }

    return (T) operation;
  }

  public static <T extends OperationBase> T toData(final CdmOperationBase instance, ResolveOptions resOpt, CopyOptions options) {
    if (instance == null) {
      return null;
    }

    T obj = makeDataObject(instance.getObjectType());
    obj.setType(OperationTypeConvertor.operationTypeToString(instance.getType()));
    obj.setCondition(instance.getCondition());
    obj.setExplanation(instance.getExplanation());
    obj.setSourceInput(instance.getSourceInput());

    return (T)obj;
  }

  /**
   * Instantiates a data object based on the object type.
   */
  private static <T extends OperationBase> T makeDataObject(CdmObjectType objectType) {
    OperationBase obj;
    switch(objectType) {
      case OperationAddAttributeGroupDef:
        obj = new OperationAddAttributeGroup();
        break;
      case OperationAddCountAttributeDef:
        obj = new OperationAddCountAttribute();
        break;
      case OperationAddSupportingAttributeDef:
        obj = new OperationAddSupportingAttribute();
        break;
      case OperationAddTypeAttributeDef:
        obj = new OperationAddTypeAttribute();
        break;
      case OperationArrayExpansionDef:
        obj = new OperationArrayExpansion();
        break;
      case OperationCombineAttributesDef:
        obj = new OperationCombineAttributes();
        break;
      case OperationExcludeAttributesDef:
        obj = new OperationExcludeAttributes();
        break;
      case OperationIncludeAttributesDef:
        obj = new OperationIncludeAttributes();
        break;
      case OperationRenameAttributesDef:
        obj = new OperationRenameAttributes();
        break;
      case OperationReplaceAsForeignKeyDef:
        obj = new OperationReplaceAsForeignKey();
        break;
      default:
        return null;
    }

    return (T) obj;
  }
}