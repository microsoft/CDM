// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections.ProjectionPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;

public class TypeAttributePersistence {
  private static final String TAG = TypeAttributePersistence.class.getSimpleName();

  public static CdmTypeAttributeDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    return fromData(ctx, obj, null);
  }

  public static CdmTypeAttributeDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj,
      final String entityName) {
    if (obj == null) {
      return null;
    }

    final CdmTypeAttributeDefinition typeAttribute = ctx.getCorpus().makeObject(CdmObjectType.TypeAttributeDef,
        obj.has("name") ? obj.get("name").asText() : null);

    typeAttribute.setPurpose(PurposeReferencePersistence.fromData(ctx, obj.get("purpose")));
    typeAttribute.setDataType(DataTypeReferencePersistence.fromData(ctx, obj.get("dataType")));

    typeAttribute.setCardinality(Utils.cardinalitySettingsFromData(obj.get("cardinality"), typeAttribute));

    typeAttribute.setAttributeContext(AttributeContextReferencePersistence.fromData(ctx, obj.get("attributeContext")));
    Utils.addListToCdmCollection(typeAttribute.getAppliedTraits(),
        Utils.createTraitReferenceList(ctx, obj.get("appliedTraits")));
    typeAttribute
        .setResolutionGuidance(AttributeResolutionGuidancePersistence.fromData(ctx, obj.get("resolutionGuidance")));

    if (obj.has("isPrimaryKey") && obj.get("isPrimaryKey").asBoolean() && entityName != null) {
      TraitToPropertyMap t2pMap = new TraitToPropertyMap(typeAttribute);
      t2pMap.updatePropertyValue(CdmPropertyName.IS_PRIMARY_KEY,
          entityName + "/(resolvedAttributes)/" + typeAttribute.getName());
    }

    typeAttribute.setExplanation(Utils.propertyFromDataToString(obj.get("explanation")));
    typeAttribute.updateDescription(Utils.propertyFromDataToString(obj.get("description")));
    typeAttribute.updateIsReadOnly(Utils.propertyFromDataToBoolean(obj.get("isReadOnly")));
    typeAttribute.updateIsNullable(Utils.propertyFromDataToBoolean(obj.get("isNullable")));
    typeAttribute.updateSourceName(Utils.propertyFromDataToString(obj.get("sourceName")));
    typeAttribute.updateSourceOrdering(Utils.propertyFromDataToInt(obj.get("sourceOrdering")));
    typeAttribute.updateDisplayName(Utils.propertyFromDataToString(obj.get("displayName")));
    typeAttribute.updateValueConstrainedToList(Utils.propertyFromDataToBoolean(obj.get("valueConstrainedToList")));
    typeAttribute.updateMaximumLength(Utils.propertyFromDataToInt(obj.get("maximumLength")));
    typeAttribute.updateMaximumValue(Utils.propertyFromDataToString(obj.get("maximumValue")));
    typeAttribute.updateMinimumValue(Utils.propertyFromDataToString(obj.get("minimumValue")));
    typeAttribute.updateDefaultValue(obj.get("defaultValue"));
    typeAttribute.setProjection(ProjectionPersistence.fromData(ctx, obj.get("projection")));

    final String dataFormat = obj.has("dataFormat") ? obj.get("dataFormat").asText() : null;
    if (dataFormat != null) {
      CdmDataFormat cdmDataFormat = CdmDataFormat.fromString(dataFormat);
      if (cdmDataFormat != CdmDataFormat.Unknown) {
        typeAttribute.updateDataFormat(cdmDataFormat);
      } else {
        Logger.warning(ctx, TAG, "fromData", null, CdmLogCode.WarnPersistEnumNotFound, dataFormat);
      }
    }

    return typeAttribute;
  }

  public static TypeAttribute toData(final CdmTypeAttributeDefinition instance, final ResolveOptions resOpt,
      final CopyOptions options) {
    if (instance == null) {
      return null;
    }

    final TypeAttribute obj = new TypeAttribute();
    obj.setExplanation(instance.getExplanation());
    obj.setDescription((String) instance.fetchProperty(CdmPropertyName.DESCRIPTION));
    obj.setName(instance.getName());
    obj.setPurpose(Utils.jsonForm(instance.getPurpose(), resOpt, options));
    obj.setDataType(Utils.jsonForm(instance.getDataType(), resOpt, options));
    obj.setAppliedTraits(Utils.listCopyDataAsArrayNode(instance.getAppliedTraits().getAllItems().stream()
        .filter(trait -> trait instanceof CdmTraitGroupReference || !((CdmTraitReference) trait).isFromProperty())
        .collect(Collectors.toList()), resOpt, options));

    obj.setProjection(Utils.jsonForm(instance.getProjection(), resOpt, options));

    final JsonNode attributeContext = Utils.jsonForm(instance.getAttributeContext(), resOpt, options);
    obj.setAttributeContext(attributeContext != null ? attributeContext : null);
    obj.setCardinalitySettings(
        instance.getCardinality() != null ? JMapper.MAP.valueToTree(instance.getCardinality()) : null);
    obj.setResolutionGuidance(Utils.jsonForm(instance.getResolutionGuidance(), resOpt, options));

    if (instance.fetchProperty(CdmPropertyName.IS_READ_ONLY) instanceof Boolean
        && (Boolean) instance.fetchProperty(CdmPropertyName.IS_READ_ONLY) != false) {
      obj.setIsReadOnly((Boolean) instance.fetchProperty(CdmPropertyName.IS_READ_ONLY));
    }
    if (instance.fetchProperty(CdmPropertyName.IS_NULLABLE) instanceof Boolean
        && (Boolean) instance.fetchProperty(CdmPropertyName.IS_NULLABLE)) {
      obj.setIsNullable((Boolean) instance.fetchProperty(CdmPropertyName.IS_NULLABLE));
    }
    if (instance.fetchProperty(CdmPropertyName.VALUE_CONSTRAINED_TO_LIST) instanceof Boolean
        && (Boolean) instance.fetchProperty(CdmPropertyName.VALUE_CONSTRAINED_TO_LIST)) {
      obj.setValueConstrainedToList((Boolean) instance.fetchProperty(CdmPropertyName.VALUE_CONSTRAINED_TO_LIST));
    }
    if (instance.fetchProperty(CdmPropertyName.IS_PRIMARY_KEY) instanceof Boolean
        && (Boolean) instance.fetchProperty(CdmPropertyName.IS_PRIMARY_KEY)) {
      obj.setIsPrimaryKey((Boolean) instance.fetchProperty(CdmPropertyName.IS_PRIMARY_KEY));
    }

    final Integer sourceOrdering = instance.fetchProperty(CdmPropertyName.SOURCE_ORDERING) == null ? null
        : Integer.parseInt((String) instance.fetchProperty(CdmPropertyName.SOURCE_ORDERING));
    obj.setSourceOrdering(sourceOrdering != null && sourceOrdering != 0 ? sourceOrdering : null);

    obj.setSourceName((String) instance.fetchProperty(CdmPropertyName.SOURCE_NAME));
    obj.setDisplayName((String) instance.fetchProperty(CdmPropertyName.DISPLAY_NAME));
    obj.setDescription((String) instance.fetchProperty(CdmPropertyName.DESCRIPTION));

    if (instance.fetchProperty(CdmPropertyName.MAXIMUM_LENGTH) instanceof Integer) {
      obj.setMaximumLength((Integer) instance.fetchProperty(CdmPropertyName.MAXIMUM_LENGTH));
    }
    obj.setMaximumValue((String) instance.fetchProperty(CdmPropertyName.MAXIMUM_VALUE));
    obj.setMinimumValue((String) instance.fetchProperty(CdmPropertyName.MINIMUM_VALUE));
    final String dataformat = (String) instance.fetchProperty(CdmPropertyName.DATA_FORMAT);
    obj.setDataFormat(Objects.equals(dataformat, CdmDataFormat.Unknown.toString()) ? null : dataformat);

    final Object defaultValue = instance.fetchProperty(CdmPropertyName.DEFAULT);
    if (defaultValue instanceof ArrayList) {
      obj.setDefaultValue(((ArrayList) defaultValue).size() > 0 ? JMapper.MAP.valueToTree(defaultValue) : null);
    } else if (defaultValue instanceof JsonNode) {
      obj.setDefaultValue((JsonNode) defaultValue);
    }

    return obj;
  }
}
