// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReferenceBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;

public class TraitReferencePersistence {
  public static CdmTraitReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    if (obj == null) {
      return null;
    }

    boolean simpleReference = true;
    Boolean optional = null;
    final Object trait;
    JsonNode args = null;
    CdmTraitReference trVerb = null;
    ArrayList<CdmTraitReferenceBase> appliedTraits = null;

    if (obj.isValueNode()) {
      trait = obj;
    } else {
      simpleReference = false;
      args = obj.get("arguments");

      optional = Utils.propertyFromDataToBoolean(obj.get("optional"));

      if (obj.get("traitReference").isValueNode()) {
        trait = obj.get("traitReference").asText();
      } else {
        trait = TraitPersistence.fromData(ctx, obj.get("traitReference"));
      }

      trVerb = TraitReferencePersistence.fromData(ctx, obj.get("verb"));
      appliedTraits = Utils.createTraitReferenceList(ctx, obj.get("appliedTraits"));
    }

    final CdmTraitReference traitReference = ctx.getCorpus().makeRef(CdmObjectType.TraitRef, trait, simpleReference);

    if (optional != null) {
      traitReference.setOptional(optional);
    }

    if (args != null) {
      args.forEach(a -> traitReference.getArguments().add(ArgumentPersistence.fromData(ctx, a)));
    }

    traitReference.setVerb(trVerb);
    Utils.addListToCdmCollection(traitReference.getAppliedTraits(), appliedTraits);

    return traitReference;
  }

  public static Object toData(final CdmTraitReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }
}
