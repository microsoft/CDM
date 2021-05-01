// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitGroupReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class TraitGroupReferencePersistence {
  public static CdmTraitGroupReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    // Note: Trait group reference by definition cannot be specified as a simple named reference

    if (obj == null || obj.get("traitGroupReference") == null) {
      return null;
    }

    final Object traitGroup;
    Boolean optional = Utils.propertyFromDataToBoolean(obj.get("optional"));

    if (obj.get("traitGroupReference").isValueNode()) {
      traitGroup = obj.get("traitGroupReference").asText();
    } else {
      traitGroup = TraitGroupPersistence.fromData(ctx, obj.get("traitGroupReference"));
    }

    final CdmTraitGroupReference traitGroupReference = ctx.getCorpus().makeRef(CdmObjectType.TraitGroupRef, traitGroup, false);

    if (optional != null) {
      traitGroupReference.setOptional(optional);
    }

    return traitGroupReference;
  }

  public static Object toData(final CdmTraitGroupReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }
}
