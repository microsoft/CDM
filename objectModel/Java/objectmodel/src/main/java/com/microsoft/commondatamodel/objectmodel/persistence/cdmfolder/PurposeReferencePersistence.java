// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
    Boolean optional = null;
    final Object purpose;
    List<CdmTraitReference> appliedTraits = null;

    if (obj.isValueNode()) {
      purpose = obj;
    } else {
      simpleReference = false;

      optional = Utils.propertyFromDataToBoolean(obj.get("optional"));

      if (obj.get("purposeReference").isValueNode()) {
        purpose = obj.get("purposeReference").asText();
      } else {
        purpose = PurposePersistence.fromData(ctx, obj.get("purposeReference"));
      }
    }

    final CdmPurposeReference purposeReference = ctx.getCorpus().makeRef(CdmObjectType.PurposeRef, purpose, simpleReference);

    if (optional != null) {
      purposeReference.setOptional(optional);
    }

    if (!(obj.isValueNode())) {
      Utils.addListToCdmCollection(purposeReference.getAppliedTraits(), Utils.createTraitReferenceList(ctx, obj.get("appliedTraits")));
    }


    return purposeReference;
  }

  public static Object toData(final CdmPurposeReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }
}
