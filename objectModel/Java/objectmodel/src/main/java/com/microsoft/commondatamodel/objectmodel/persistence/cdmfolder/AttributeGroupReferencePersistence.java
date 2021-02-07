// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class AttributeGroupReferencePersistence {

  public static CdmAttributeGroupReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    return fromData(ctx, obj, null);
  }

  public static CdmAttributeGroupReference fromData(final CdmCorpusContext ctx, final JsonNode obj, final String entityName) {
    if (obj == null) {
      return null;
    }
    boolean simpleReference = true;
    final Object attributeGroup;
    if (obj.isValueNode()) {
      attributeGroup = obj;
    } else {
      simpleReference = false;
      if (obj.get("attributeGroupReference").isValueNode() && obj.get("attributeGroupReference") != null) {
        attributeGroup = obj.get("attributeGroupReference").asText();
      } else {
        attributeGroup = AttributeGroupPersistence.fromData(ctx, obj.get("attributeGroupReference"), entityName);
      }
    }

    return ctx.getCorpus().makeRef(CdmObjectType.AttributeGroupRef,
            attributeGroup, simpleReference);
  }

  public static Object toData(final CdmAttributeGroupReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }
}
