// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.AttributeGroup;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class AttributeGroupPersistence {

  public static CdmAttributeGroupDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    return fromData(ctx, obj, null);
  }

  public static CdmAttributeGroupDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj, final String entityName) {
    if (obj == null) {
      return null;
    }

    final CdmAttributeGroupDefinition attributeGroup =
            ctx.getCorpus()
                    .makeObject(CdmObjectType.AttributeGroupDef, obj.has("attributeGroupName") ? obj.get("attributeGroupName").asText() : null);

    if (obj.get("explanation") != null) {
      attributeGroup.setExplanation(obj.get("explanation").asText());
    }

    attributeGroup.setAttributeContext(
            AttributeContextReferencePersistence.fromData(ctx, obj.get("attributeContext")));
    Utils.addListToCdmCollection(attributeGroup.getExhibitsTraits(),
            Utils.createTraitReferenceList(ctx, obj.get("exhibitsTraits")));

    if (obj.get("members") != null) {
      for (final JsonNode att : obj.get("members")) {
        attributeGroup.getMembers().add((Utils.createAttribute(ctx, att, entityName)));
      }
    }

    return attributeGroup;
  }

  public static Object toData(final CdmAttributeGroupDefinition instance, final ResolveOptions resOpt,
                              final CopyOptions options) {
    final AttributeGroup result = new AttributeGroup();
    result.setExplanation(instance.getExplanation());
    result.setAttributeGroupName(instance.getAttributeGroupName());
    result.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt,  options));
    if (instance.getAttributeContext() != null) {
      result.setAttributeContext((String) instance.getAttributeContext().copyData(resOpt, options));
    }

    result.setMembers(Utils.listCopyDataAsArrayNode(instance.getMembers(), resOpt, options));
    return result;
  }
}
