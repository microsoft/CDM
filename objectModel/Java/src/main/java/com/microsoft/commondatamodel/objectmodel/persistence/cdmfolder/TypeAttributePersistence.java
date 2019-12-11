package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;

public class TypeAttributePersistence {

  public static CdmTypeAttributeDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
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

    typeAttribute.setExplanation(obj.has("explanation") ? obj.get("explanation").asText() : null);
    typeAttribute.updateDescription(obj.has("description") ? obj.get("description").asText() : null);
    typeAttribute.updateIsReadOnly(obj.has("isReadOnly") ? obj.get("isReadOnly").asBoolean() : null);
    typeAttribute.updateIsNullable(obj.has("isNullable") ? obj.get("isNullable").asBoolean() : null);
    typeAttribute.updateSourceName(obj.has("sourceName") ? obj.get("sourceName").asText() : null);
    typeAttribute.updateSourceOrderingToTrait(obj.has("sourceOrdering") ? obj.get("sourceOrdering").asInt() : null);
    typeAttribute.setDisplayName(obj.has("displayName") ? obj.get("displayName").asText() : null);
    typeAttribute.updateValueConstrainedToList(obj.has("valueConstrainedToList") ? obj.get("valueConstrainedToList").asBoolean() : null);

    if (obj.has("maximumLength")) {
      typeAttribute.updateMaximumLength(obj.get("maximumLength").asInt());
    }

    if (obj.has("maximumValue")) {
      typeAttribute.updateMaximumValue(obj.get("maximumValue").asText());
    }

    if (obj.has("minimumValue")) {
      typeAttribute.updateMinimumValue(obj.get("minimumValue").asText());
    }

    typeAttribute.updateDataFormat(obj.has("dataFormat") ? obj.get("dataFormat").asText() : null);
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
    obj.setAttributeContext(attributeContext != null ? attributeContext.asText() : null);
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
}
