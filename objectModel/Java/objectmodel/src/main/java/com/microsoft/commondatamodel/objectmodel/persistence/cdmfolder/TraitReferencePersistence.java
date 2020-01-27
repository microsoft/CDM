package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class TraitReferencePersistence {
  public static CdmTraitReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    if (obj == null) {
      return null;
    }

    boolean simpleReference = true;
    final Object trait;
    JsonNode args = null;

    if (obj.isValueNode()) {
      trait = obj;
    } else {
      simpleReference = false;
      args = obj.get("arguments");
      if (obj.get("traitReference").isValueNode()) {
        trait = obj.get("traitReference").asText();
      } else {
        trait = TraitPersistence.fromData(ctx, obj.get("traitReference"));
      }
    }

    final CdmTraitReference traitReference = ctx.getCorpus().makeRef(CdmObjectType.TraitRef, trait, simpleReference);
    if (args != null) {
      args.forEach(a -> traitReference.getArguments().add(ArgumentPersistence.fromData(ctx, a)));
    }
    return traitReference;
  }

  public static Object toData(final CdmTraitReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }
}
