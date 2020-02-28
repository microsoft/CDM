// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.AttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityByReference;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Expansion;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.SelectsSubAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.List;

public class AttributeResolutionGuidancePersistence {

  public static CdmAttributeResolutionGuidance fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    if (obj == null) {
      return null;
    }
    final CdmAttributeResolutionGuidance attributeResolution = ctx.getCorpus().makeObject(
        CdmObjectType.AttributeResolutionGuidanceDef);

    attributeResolution.setRemoveAttribute(obj.has("removeAttribute")
        ? obj.get("removeAttribute").asBoolean()
        : null);
    attributeResolution.setImposedDirectives(obj.get("imposedDirectives") == null ? null
        : JMapper.MAP.convertValue(obj.get("imposedDirectives"), new TypeReference<List<String>>() {
    }));
    attributeResolution.setRemovedDirectives(obj.get("removedDirectives") == null ? null
        : JMapper.MAP.convertValue(obj.get("removedDirectives"), new TypeReference<List<String>>() {
    }));
    attributeResolution.setCardinality(obj.has("cardinality")
        ? obj.get("cardinality").asText()
        : null);
    attributeResolution.setRenameFormat(obj.has("renameFormat")
        ? obj.get("renameFormat").asText() :
        null);
    if (obj.has("addSupportingAttribute")) {
      attributeResolution.setAddSupportingAttribute(
          (CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("addSupportingAttribute")));
    }

    if (obj.has("expansion")) {
      final JsonNode expansion = obj.get("expansion");
      attributeResolution.setExpansion(attributeResolution.makeExpansion());
      attributeResolution.getExpansion()
          .setStartingOrdinal(expansion.has("startingOrdinal")
              ? expansion.get("startingOrdinal").asInt()
              : null);
      attributeResolution.getExpansion()
          .setMaximumExpansion(expansion.has("maximumExpansion")
              ? expansion.get("maximumExpansion").asInt()
              : null);
      if (expansion.has("countAttribute")) {
        attributeResolution.getExpansion().setCountAttribute((CdmTypeAttributeDefinition) Utils
            .createAttribute(ctx,
                expansion.get("countAttribute")));
      }
    }
    if (obj.has("entityByReference")) {
      final JsonNode entityByReference = obj.get("entityByReference");
      attributeResolution.setEntityByReference(attributeResolution.makeEntityByReference());
      attributeResolution.getEntityByReference()
          .setAllowReference(entityByReference.has("allowReference")
              ? entityByReference.get("allowReference").asBoolean()
              : null);
      attributeResolution.getEntityByReference().setAlwaysIncludeForeignKey(
          entityByReference.has("alwaysIncludeForeignKey")
              ? entityByReference.get("alwaysIncludeForeignKey").asBoolean()
              : null);
      attributeResolution.getEntityByReference().setReferenceOnlyAfterDepth(
          entityByReference.has("referenceOnlyAfterDepth")
              ? entityByReference.get("referenceOnlyAfterDepth").asInt()
              : null);
      if (entityByReference.has("foreignKeyAttribute")) {
        attributeResolution.getEntityByReference().setForeignKeyAttribute(
            (CdmTypeAttributeDefinition) Utils
                .createAttribute(ctx, entityByReference.get("foreignKeyAttribute")));
      }
    }
    if (obj.has("selectsSubAttribute")) {
      attributeResolution.setSelectsSubAttribute(attributeResolution.makeSelectsSubAttribute());
      attributeResolution.getSelectsSubAttribute().setSelects(
          (obj.get("selectsSubAttribute").has("selects")) ? obj.get("selectsSubAttribute")
              .get("selects").asText() : null);
      if (obj.get("selectsSubAttribute").has("selectedTypeAttribute")) {
        attributeResolution.getSelectsSubAttribute().setSelectedTypeAttribute(
            (CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("selectsSubAttribute")
                .get("selectedTypeAttribute")));
      }
      if (obj.get("selectsSubAttribute").has("selectsSomeTakeNames")) {
        attributeResolution.getSelectsSubAttribute().setSelectsSomeTakeNames(
            JMapper.MAP.convertValue(obj.get("selectsSubAttribute")
            .get("selectsSomeTakeNames"), new TypeReference<List<String>>(){}));
      }
      if (obj.get("selectsSubAttribute").has("selectsSomeAvoidNames")) {
        attributeResolution.getSelectsSubAttribute().setSelectsSomeAvoidNames(
            JMapper.MAP.convertValue(obj.get("selectsSubAttribute")
                .get("selectsSomeAvoidNames"), new TypeReference<List<String>>(){}));
      }
    }

    return attributeResolution;
  }

  public static AttributeResolutionGuidance toData(final CdmAttributeResolutionGuidance instance,
                                                   final ResolveOptions resOpt, final CopyOptions options) {
    final AttributeResolutionGuidance obj = new AttributeResolutionGuidance();

    obj.setRemoveAttribute(instance.getRemoveAttribute());
    obj.setImposedDirectives(instance.getImposedDirectives());
    obj.setRemovedDirectives(instance.getRemovedDirectives());
    obj.setAddSupportingAttribute(
            Utils.jsonForm(instance.getAddSupportingAttribute(), resOpt, options));
    obj.setCardinality(instance.getCardinality());
    obj.setRenameFormat(instance.getRenameFormat());

    if (instance.getExpansion() != null) {
      final Expansion expansion = new Expansion();

      expansion.setStartingOrdinal(instance.getExpansion().getStartingOrdinal());
      expansion.setMaximumExpansion(instance.getExpansion().getMaximumExpansion());
      expansion
              .setCountAttribute(
                      Utils.jsonForm(instance.getExpansion().getCountAttribute(), resOpt, options));

      obj.setExpansion(expansion);
    }
    if (instance.getEntityByReference() != null) {
      final EntityByReference entityByReference = new EntityByReference();

      entityByReference
              .setAlwaysIncludeForeignKey(
                      instance.getEntityByReference().doesAlwaysIncludeForeignKey());
      entityByReference
              .setReferenceOnlyAfterDepth(instance.getEntityByReference().getReferenceOnlyAfterDepth());
      entityByReference.setAllowReference(instance.getEntityByReference().doesAllowReference());
      entityByReference.setForeignKeyAttribute(
              Utils
                      .jsonForm(instance.getEntityByReference().getForeignKeyAttribute(), resOpt, options));

      obj.setEntityByReference(entityByReference);
    }
    if (instance.getSelectsSubAttribute() != null) {
      final SelectsSubAttribute selectsSubAttribute = new SelectsSubAttribute();

      selectsSubAttribute.setSelects(instance.getSelectsSubAttribute().getSelects());
      selectsSubAttribute.setSelectedTypeAttribute(
              Utils.jsonForm(instance.getSelectsSubAttribute().getSelectedTypeAttribute(), resOpt,
                      options));
      selectsSubAttribute.setSelectsSomeTakeNames(instance.getSelectsSubAttribute().getSelectsSomeTakeNames());
      selectsSubAttribute.setSelectsSomeAvoidNames(instance.getSelectsSubAttribute().getSelectsSomeAvoidNames());

      obj.setSelectsSubAttribute(selectsSubAttribute);
    }
    return obj;
  }
}
