// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;

public class TypeAttributePersistence {
  public static CdmTypeAttributeDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    return fromData(ctx, obj, null);
  }

  public static CdmTypeAttributeDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj, final String entityName) {
    if (obj == null) {
      return null;
    }

    final CdmTypeAttributeDefinition typeAttribute = ctx.getCorpus()
        .makeObject(CdmObjectType.TypeAttributeDef, obj.has("name") ? obj.get("name").asText() : null);

    typeAttribute.setPurpose(PurposeReferencePersistence.fromData(ctx, obj.get("purpose")));
    typeAttribute.setDataType(DataTypeReferencePersistence.fromData(ctx, obj.get("dataType")));

    if (obj.get("cardinality") != null) {
      String minCardinality = null;
      if (obj.get("cardinality").get("minimum") != null) {
        minCardinality = obj.get("cardinality").get("minimum").asText();
      }

      String maxCardinality = null;
      if (obj.get("cardinality").get("maximum") != null) {
        maxCardinality = obj.get("cardinality").get("maximum").asText();
      }

      if (StringUtils.isNullOrTrimEmpty(minCardinality) || StringUtils.isNullOrTrimEmpty(maxCardinality)) {
        Logger.error(TypeAttributePersistence.class.getSimpleName(), ctx, "Both minimum and maximum are required for the Cardinality property.", "fromData");
      }

      if (!CardinalitySettings.isMinimumValid(minCardinality)) {
        Logger.error(TypeAttributePersistence.class.getSimpleName(), ctx, Logger.format("Invalid minimum cardinality {0}.", minCardinality), "fromData");
      }

      if (!CardinalitySettings.isMaximumValid(maxCardinality)) {
        Logger.error(TypeAttributePersistence.class.getSimpleName(), ctx, Logger.format("Invalid maximum cardinality {0}.", maxCardinality), "fromData");
      }

      if (!StringUtils.isNullOrTrimEmpty(minCardinality) &&
          !StringUtils.isNullOrTrimEmpty(maxCardinality) &&
          CardinalitySettings.isMinimumValid(minCardinality) &&
          CardinalitySettings.isMaximumValid(maxCardinality)) {
        typeAttribute.setCardinality(new CardinalitySettings(typeAttribute));
        typeAttribute.getCardinality().setMinimum(minCardinality);
        typeAttribute.getCardinality().setMaximum(maxCardinality);
      }
    }

    typeAttribute.setAttributeContext(AttributeContextReferencePersistence.fromData(ctx, obj.get("attributeContext")));
    Utils.addListToCdmCollection(typeAttribute.getAppliedTraits(), Utils.createTraitReferenceList(ctx, obj.get("appliedTraits")));
    typeAttribute.setResolutionGuidance(AttributeResolutionGuidancePersistence.fromData(ctx, obj.get("resolutionGuidance")));

    if (obj.has("isPrimaryKey") && obj.get("isPrimaryKey").asBoolean() && entityName != null) {
      TraitToPropertyMap t2pMap = new TraitToPropertyMap(typeAttribute);
      t2pMap.updatePropertyValue(CdmPropertyName.IS_PRIMARY_KEY, entityName + "/(resolvedAttributes)/" + typeAttribute.getName());
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

    final String dataFormat = obj.has("dataFormat") ? obj.get("dataFormat").asText() : null;
    if (dataFormat != null) {
      CdmDataFormat cdmDataFormat = CdmDataFormat.fromString(dataFormat);
      if (cdmDataFormat != CdmDataFormat.Unknown) {
        typeAttribute.updateDataFormat(cdmDataFormat);
      } else {
        Logger.warning(
            TypeAttributePersistence.class.getSimpleName(),
            ctx,
            Logger.format("Couldn't find an enum value for {0}.", dataFormat),
            "fromData"
        );
      }
    }

    return typeAttribute;
  }

  public static TypeAttribute toData(final CdmTypeAttributeDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
    final TypeAttribute obj = new TypeAttribute();
    obj.setExplanation(instance.getExplanation());
    obj.setDescription((String) instance.fetchProperty(CdmPropertyName.DESCRIPTION));
    obj.setName(instance.getName());
    obj.setPurpose(Utils.jsonForm(instance.getPurpose(), resOpt, options));
    obj.setDataType(Utils.jsonForm(instance.getDataType(), resOpt, options));
    obj.setAppliedTraits(Utils.listCopyDataAsArrayNode(
        instance.getAppliedTraits().getAllItems()
            .stream()
            .filter(trait -> !trait.isFromProperty())
            .collect(Collectors.toList()),
        resOpt,
        options));

    final JsonNode attributeContext = Utils.jsonForm(instance.getAttributeContext(), resOpt, options);
    obj.setAttributeContext(attributeContext != null ? attributeContext : null);
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

    final Integer sourceOrdering = instance.fetchProperty(CdmPropertyName.SOURCE_ORDERING) == null
        ? null
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
      obj.setDefaultValue(((ArrayList)defaultValue).size() > 0 ? JMapper.MAP.valueToTree(defaultValue) : null);
    } else if (defaultValue instanceof JsonNode) {
      obj.setDefaultValue((JsonNode) defaultValue);
    }

    return obj;
  }
}
