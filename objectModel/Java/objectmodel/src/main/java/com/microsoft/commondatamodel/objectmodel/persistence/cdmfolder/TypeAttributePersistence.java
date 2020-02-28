// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;

import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TypeAttributePersistence {
  private static Logger LOGGER = LoggerFactory.getLogger(TypeAttributePersistence.class);

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
    typeAttribute.setAttributeContext(AttributeContextReferencePersistence.fromData(ctx, obj.get("attributeContext")));
    Utils.addListToCdmCollection(typeAttribute.getAppliedTraits(), Utils.createTraitReferenceList(ctx, obj.get("appliedTraits")));
    typeAttribute.setResolutionGuidance(AttributeResolutionGuidancePersistence.fromData(ctx, obj.get("resolutionGuidance")));

    if (obj.has("isPrimaryKey") && obj.get("isPrimaryKey").asBoolean() && entityName != null) {
      TraitToPropertyMap t2pMap = new TraitToPropertyMap(typeAttribute);
      t2pMap.updatePropertyValue(CdmPropertyName.IS_PRIMARY_KEY, entityName + "/(resolvedAttributes)/" + typeAttribute.getName());
    }

    if (obj.has("explanation")) {
      final String explanation = TypeAttributePersistence.propertyFromDataToString(obj.get("explanation"));
      if (explanation != null) {
        typeAttribute.setExplanation(explanation);
      }
    }
    if (obj.has("description")) {
      final String description = TypeAttributePersistence.propertyFromDataToString(obj.get("description"));
      if (description != null) {
        typeAttribute.updateDescription(description);
      }
    }
    if (obj.has("isReadOnly")) {
      typeAttribute.updateIsReadOnly(TypeAttributePersistence.propertyFromDataToBoolean(obj.get("isReadOnly")));
    }
    if (obj.has("isNullable")) {
      typeAttribute.updateIsNullable(TypeAttributePersistence.propertyFromDataToBoolean(obj.get("isNullable")));
    }
    if (obj.has("sourceName")) {
      final String sourceName = TypeAttributePersistence.propertyFromDataToString(obj.get("sourceName"));
      if (sourceName != null) {
        typeAttribute.updateSourceName(sourceName);
      }
    }
    if (obj.has("sourceOrdering")) {
      typeAttribute.updateSourceOrderingToTrait(TypeAttributePersistence.propertyFromDataToInt(obj.get("sourceOrdering")));
    }
    if (obj.has("displayName")) {
      final String displayName = TypeAttributePersistence.propertyFromDataToString(obj.get("displayName"));
      if (displayName != null) {
        typeAttribute.setDisplayName(displayName);
      }
    }
    if (obj.has("valueConstrainedToList")) {
      typeAttribute.updateValueConstrainedToList(TypeAttributePersistence.propertyFromDataToBoolean(obj.get("valueConstrainedToList")));
    }
    if (obj.has("maximumLength")) {
      typeAttribute.updateMaximumLength(TypeAttributePersistence.propertyFromDataToInt(obj.get("maximumLength")));
    }
    if (obj.has("maximumValue")) {
      final String maximumValue = TypeAttributePersistence.propertyFromDataToString(obj.get("maximumValue"));
      if (maximumValue != null) {
        typeAttribute.updateMaximumValue(maximumValue);
      }
    }
    if (obj.has("minimumValue")) {
      final String minimumValue = TypeAttributePersistence.propertyFromDataToString(obj.get("minimumValue"));
      if (minimumValue != null) {
        typeAttribute.updateMinimumValue(minimumValue);
      }
    }

    final String dataFormat = obj.has("dataFormat") ? obj.get("dataFormat").asText() : null;
    if (dataFormat != null) {
      CdmDataFormat cdmDataFormat = CdmDataFormat.fromString(dataFormat);
      if (cdmDataFormat != CdmDataFormat.Unknown) {
        typeAttribute.updateDataFormat(cdmDataFormat);
      } else {
        LOGGER.warn("Couldn't find an enum value for {}.", dataFormat);
      }
    }
    typeAttribute.updateDefaultValue(obj.get("defaultValue"));

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
      obj.setDefaultValue(JMapper.MAP.valueToTree(defaultValue));
    } else if (defaultValue instanceof JsonNode) {
      obj.setDefaultValue((JsonNode) defaultValue);
    }

    return obj;
  }

  /**
   * Converts dynamic input into a string for a property (ints are converted to string)
   * @param value The value that should be converted to a string.
   * @return The value converted into a string
   */
  private static String propertyFromDataToString(final Object value) {
    final String stringValue = getStringFromJson(value);
    if (stringValue != null && !stringValue.equals("")) {
      return stringValue;
    } 

    final Integer intValue = getIntFromJson(value);
    if (intValue != null) {
      return Integer.toString(intValue);
    }

    return null;
  }

  /**
   * Converts dynamic input into an int for a property (numbers represented as strings are converted to int)
   * @param value The value that should be converted to an Integer.
   * @return The value converted into an Integer
   */
  private static Integer propertyFromDataToInt(final Object value) {
    final Integer intValue = getIntFromJson(value);
    if (intValue != null) {
      return intValue;
    }

    final String stringValue = getStringFromJson(value);
    if (stringValue != null) {
      try{
        return Integer.valueOf(stringValue);
      } catch (NumberFormatException ex) {
      }
    }

    return null;
  }

  /**
   * Converts dynamic input into a boolean for a property (booleans represented as strings are converted to boolean)
   * @param value The value that should be converted to a boolean.
   * @return The value converted into a boolean
   */
  private static Boolean propertyFromDataToBoolean(final Object value) {
    if (value instanceof Boolean) {
      return (Boolean)value;
    } else if (value instanceof BooleanNode) {
      return ((BooleanNode)value).asBoolean();
    }

    final String stringValue = getStringFromJson(value);
    if (stringValue.equals("True") || stringValue.equals("true")) {
      return true;
    } else if (stringValue.equals("False") || stringValue.equals("false")) {
      return false;
    }

    return null;
  }

  /**
   * Helper function to extract string value from a JsonNode object
   * @param value A JsonNode that contains a string or a JsonNode object
   * @return The string value inside of the JsonNode
   */
  private static String getStringFromJson(final Object value) {
    if (value instanceof String) {
      return (String)value;
    } else if (value instanceof TextNode) {
      return ((TextNode)value).asText();
    }
    return null;
  }

  /**
   * Helper function to extract Integer value from a JsonNode object
   * @param value A JsonNode that contains an Integer or a JsonNode object
   * @return The Integer value inside of the JsonNode
   */
  private static Integer getIntFromJson(final Object value) {
    if (value instanceof Integer) {
      return (Integer)value;
    } else if (value instanceof IntNode) {
      return (Integer)((IntNode)value).intValue();
    }
    return null;
  }
}
