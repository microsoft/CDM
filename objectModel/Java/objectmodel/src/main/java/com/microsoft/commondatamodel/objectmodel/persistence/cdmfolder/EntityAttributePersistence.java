// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class EntityAttributePersistence {

  public static CdmEntityAttributeDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    final CdmEntityAttributeDefinition entityAttribute =
        ctx.getCorpus().makeObject(CdmObjectType.EntityAttributeDef,
            obj.get("name").asText());

    if (obj.has("explanation")) {
      entityAttribute.setExplanation(obj.get("explanation").asText());
    }

    entityAttribute.setEntity(EntityReferencePersistence.fromData(ctx, obj.get("entity")));

    entityAttribute.setPurpose(PurposeReferencePersistence.fromData(ctx, obj.get("purpose")));
    Utils.addListToCdmCollection(entityAttribute.getAppliedTraits(),
        Utils.createTraitReferenceList(ctx, obj.get("appliedTraits")));
    entityAttribute.setResolutionGuidance(AttributeResolutionGuidancePersistence.fromData(ctx, obj.get("resolutionGuidance")));
    return entityAttribute;
  }

  public static EntityAttribute toData(final CdmEntityAttributeDefinition instance, final ResolveOptions resOpt,
                                       final CopyOptions options) {
    final EntityAttribute result = new EntityAttribute();

    result.setExplanation(instance.getExplanation());
    result.setName(instance.getName());
    result.setEntity(Utils.jsonForm(instance.getEntity(), resOpt, options));
    result.setPurpose(Utils.jsonForm(instance.getPurpose(), resOpt, options));
    result.setAppliedTraits(Utils.listCopyDataAsArrayNode(instance.getAppliedTraits(), resOpt, options));
    result.setResolutionGuidance(
            JMapper.MAP.valueToTree(Utils.jsonForm(instance.getResolutionGuidance(), resOpt, options)));
    return result;
  }
}
