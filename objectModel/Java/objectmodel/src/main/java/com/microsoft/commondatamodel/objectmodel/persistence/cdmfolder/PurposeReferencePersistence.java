package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmPurposeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.List;

public class PurposeReferencePersistence {
  public static CdmPurposeReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    if (obj == null) {
      return null;
    }

    boolean simpleReference = true;
    final Object purpose;
    List<CdmTraitReference> appliedTraits = null;

    if (obj.isValueNode()) {
      purpose = obj;
    } else {
      simpleReference = false;
      if (obj.get("purposeReference").isValueNode()) {
        purpose = obj.get("purposeReference").asText();
      } else {
        purpose = PurposePersistence.fromData(ctx, obj.get("purposeReference"));
      }
    }

    final CdmPurposeReference purposeReference = ctx.getCorpus().makeRef(CdmObjectType.PurposeRef, purpose, simpleReference);
    if (!(obj.isValueNode())) {
      appliedTraits = Utils.createTraitReferenceList(ctx, obj.get("appliedTraits"));
    }

    Utils.addListToCdmCollection(purposeReference.getAppliedTraits(), appliedTraits);

    return purposeReference;
  }

  public static Object toData(final CdmPurposeReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }
}
