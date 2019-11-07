package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ReferencedEntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import java.time.OffsetDateTime;

public class ReferencedEntityDeclarationPersistence {
  public static CdmEntityDeclarationDefinition fromData(final CdmCorpusContext ctx, final String prefixPath, final JsonNode obj) {
    final CdmEntityDeclarationDefinition newRef = ctx.getCorpus().makeObject(
            CdmObjectType.ReferencedEntityDeclarationDef, obj.get("entityName").asText());

    if (obj.has("entityPath")) {
      newRef.setEntityPath(prefixPath + obj.get("entityPath").asText());
    } else {
      newRef.setEntityPath(prefixPath + obj.get("entityDeclaration").asText());
    }

    if (obj.get("lastFileStatusCheckTime") != null) {
      newRef.setLastFileStatusCheckTime(OffsetDateTime.parse(obj.get("lastFileStatusCheckTime").asText()));
    }

    if (obj.get("lastFileModifiedTime") != null) {
      newRef.setLastFileModifiedTime(OffsetDateTime.parse(obj.get("lastFileModifiedTime").asText()));
    }

    if (obj.get("explanation") != null) {
      newRef.setExplanation(obj.get("explanation").asText());
    }

    if (obj.get("exhibitsTraits") != null) {
      Utils.addListToCdmCollection(newRef.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.get("exhibitsTraits")));
    }

    return newRef;
  }

  public static ReferencedEntityDeclaration toData(
      final CdmReferencedEntityDeclarationDefinition instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    final ReferencedEntityDeclaration result = new ReferencedEntityDeclaration();

    result.setType(EntityDeclaration.EntityDeclarationDefinitionType.ReferencedEntity);
    result.setLastFileStatusCheckTime(TimeUtils.formatDateStringIfNotNull(instance.getLastFileStatusCheckTime()));
    result.setLastFileModifiedTime(TimeUtils.formatDateStringIfNotNull(instance.getLastFileModifiedTime()));
    result.setExplanation(instance.getExplanation());
    result.setEntityName(instance.getEntityName());
    result.setEntityPath(instance.getEntityPath());
    result.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));

    return result;
  }
}
