// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.AttributeContext;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Entity;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class EntityPersistence {

  public static CdmEntityDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {

    final CdmEntityDefinition entity =
        ctx.getCorpus()
            .makeObject(
                CdmObjectType.EntityDef,
                obj.has("entityName")
                    ? obj.get("entityName").asText()
                    : null);
    entity.setExtendsEntity(EntityReferencePersistence.fromData(ctx, obj.get("extendsEntity")));
    entity.setExtendsEntityResolutionGuidance(
        AttributeResolutionGuidancePersistence.fromData(
            ctx,
            obj.get("extendsEntityResolutionGuidance")));

    if (obj.get("explanation") != null)
      entity.setExplanation(obj.get("explanation").asText());

    Utils.addListToCdmCollection(
        entity.getExhibitsTraits(),
        Utils.createTraitReferenceList(ctx, obj.get("exhibitsTraits")));
    if (obj.has("attributeContext")) {
      entity.setAttributeContext(
          AttributeContextPersistence.fromData(
              ctx,
              JMapper.MAP.convertValue(obj.get("attributeContext"),
                  AttributeContext.class)));
    }

    Utils.addListToCdmCollection(
        entity.getAttributes(),
        Utils.createAttributeList(ctx, obj.get("hasAttributes"), entity.getEntityName()));
    entity.setSourceName(obj.has("sourceName") ? obj.get("sourceName").asText() : null);
    entity.setDisplayName(obj.has("displayName") ? obj.get("displayName").asText() : null);
    if (obj.has("description")) {
        String descriptionText = obj.get("description").asText();
        entity.setDescription(!StringUtils.isNullOrTrimEmpty(descriptionText) ? descriptionText: null);
    }
    entity.setVersion(obj.has("version") ? obj.get("version").asText() : null);
    entity.setCdmSchemas(obj.has("cdmSchemas")
        ? null
        : JMapper.MAP.convertValue(obj.get("cdmSchemas"), new TypeReference<List<String>>() {
    }));
    return entity;
  }

  public static Entity toData(
      final CdmEntityDefinition instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    final Entity obj = new Entity();
    obj.setExplanation(instance.getExplanation());
    obj.setEntityName(instance.getEntityName());
    obj.setExtendsEntity(Utils.jsonForm(instance.getExtendsEntity(), resOpt, options));
    obj.setExtendsEntityResolutionGuidance(
        Utils.jsonForm(
            instance.getExtendsEntityResolutionGuidance(),
            resOpt,
            options));
    obj.setExhibitsTraits(Utils.listCopyDataAsArrayNode(
        instance.getExhibitsTraits().getAllItems()
            .stream()
            .filter(trait -> !trait.isFromProperty())
            .collect(Collectors.toList()),
        resOpt,
        options));

    obj.setSourceName((String) instance.getProperty(CdmPropertyName.SOURCE_NAME));
    obj.setDisplayName((String) instance.getProperty(CdmPropertyName.DISPLAY_NAME));
    obj.setDescription((String) instance.getProperty(CdmPropertyName.DESCRIPTION));
    obj.setVersion((String) instance.getProperty(CdmPropertyName.VERSION));
    obj.setCdmSchemas((ArrayList<String>) instance.getProperty(CdmPropertyName.CDM_SCHEMAS));

    // after the properties so they show up first in doc
    obj.setAttributes(Utils.listCopyDataAsArrayNode(instance.getAttributes(), resOpt, options));
    obj.setAttributeContext(Utils.jsonForm(instance.getAttributeContext(), resOpt, options));

    return obj;
  }
}
