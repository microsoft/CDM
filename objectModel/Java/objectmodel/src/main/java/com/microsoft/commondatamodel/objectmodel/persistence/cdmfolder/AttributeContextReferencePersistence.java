package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContextReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class AttributeContextReferencePersistence {
  public static CdmAttributeContextReference fromData(final CdmCorpusContext ctx, final Object obj) {
    if (obj instanceof String) {
      return ctx.getCorpus().makeObject(CdmObjectType.AttributeContextRef, (String) obj);
    }
    if (obj instanceof JsonNode && ((JsonNode) obj).isValueNode()) {
      return ctx.getCorpus().makeObject(CdmObjectType.AttributeContextRef, ((JsonNode) obj).asText());
    }
    return null;
  }

  public static Object toData(
      final CdmAttributeContextReference instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    return CdmObjectRefPersistence.toData(instance, resOpt, options);
  }

}
