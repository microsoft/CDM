// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ReferencedEntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.time.OffsetDateTime;

public class ReferencedEntityDeclarationPersistence {
  private static final String TAG = ReferencedEntityDeclarationPersistence.class.getSimpleName();

  public static CdmEntityDeclarationDefinition fromData(
      final CdmCorpusContext ctx,
      final String prefixPath,
      final JsonNode obj) {
    final CdmEntityDeclarationDefinition newRef = ctx.getCorpus().makeObject(
        CdmObjectType.ReferencedEntityDeclarationDef, obj.get("entityName").asText());

    String entityPath = obj.has("entityPath")
        ? obj.get("entityPath").asText()
        : obj.get("entityDeclaration").asText();
    if (entityPath == null) {
      Logger.error(ctx, TAG, "fromData", null, CdmLogCode.ErrPersistEntityPathNotFound);
    }

    // The entity path has to be absolute.
    // If the namespace is not present then add the "prefixPath" which has the absolute folder path.
    if (entityPath != null && !entityPath.contains(":/")) {
      entityPath = prefixPath + entityPath;
    }

    newRef.setEntityPath(entityPath);

    if (obj.get("lastFileStatusCheckTime") != null) {
      newRef.setLastFileStatusCheckTime(OffsetDateTime.parse(obj.get("lastFileStatusCheckTime").asText()));
    }

    if (obj.get("lastFileModifiedTime") != null) {
      newRef.setLastFileModifiedTime(OffsetDateTime.parse(obj.get("lastFileModifiedTime").asText()));
    }

    if (obj.get("explanation") != null) {
      newRef.setExplanation(obj.get("explanation").asText());
    }

    Utils.addListToCdmCollection(newRef.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.get("exhibitsTraits")));

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
