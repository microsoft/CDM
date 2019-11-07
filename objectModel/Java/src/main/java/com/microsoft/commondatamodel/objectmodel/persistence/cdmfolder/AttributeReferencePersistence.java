package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class AttributeReferencePersistence {
  public static CdmAttributeReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    final boolean simpleReference = true;
    final String attribute = obj.asText();

    return ctx.getCorpus().makeRef(CdmObjectType.AttributeRef, attribute, simpleReference);
  }

  public static Object toData(final CdmAttributeReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }
}
