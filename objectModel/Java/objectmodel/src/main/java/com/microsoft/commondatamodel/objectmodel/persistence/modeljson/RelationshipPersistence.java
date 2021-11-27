// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.AttributeReference;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.SingleKeyRelationship;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * The relationship persistence.
 */
public class RelationshipPersistence {
  private static final String TAG = RelationshipPersistence.class.getSimpleName();
  public static CompletableFuture<CdmE2ERelationship> fromData(
      final CdmCorpusContext ctx,
      final SingleKeyRelationship obj,
      final Map<String, String> entityPathByName) {
    // The type attribute is not being set by the default serializer because of the Order property.
    // Since we just have one type for now this should be okay.
    /*if (obj.Type != "SingleKeyRelationship")
    {
      // We don't have any other type of a relationship yet!
      return null;
    }*/

    if (!entityPathByName.containsKey(obj.getFromAttribute().getEntityName())) {
      Logger.warning(ctx, TAG, "fromData", null, CdmLogCode.WarnPersistRelUndefinedSourceEntity , obj.getFromAttribute().getEntityName());
      return CompletableFuture.completedFuture(null);
    }
    if (!entityPathByName.containsKey(obj.getToAttribute().getEntityName())) {
      Logger.warning(ctx, TAG, "fromData", null, CdmLogCode.WarnPersistRelUndefinedSourceEntity , obj.getFromAttribute().getEntityName());
      return CompletableFuture.completedFuture(null);
    }

    final CdmE2ERelationship relationship = ctx.getCorpus()
        .makeObject(CdmObjectType.E2ERelationshipDef, obj.getName());

    return Utils.processAnnotationsFromData(ctx, obj, relationship.getExhibitsTraits())
        .thenApply(v -> {
          relationship.setExplanation(obj.getDescription());
          relationship
              .setFromEntity(entityPathByName.get(obj.getFromAttribute().getEntityName()));
          relationship.setToEntity(entityPathByName.get(obj.getToAttribute().getEntityName()));
          relationship.setFromEntityAttribute(obj.getFromAttribute().getAttributeName());
          relationship.setToEntityAttribute(obj.getToAttribute().getAttributeName());

          return relationship;
        });
  }

  public static CompletableFuture<SingleKeyRelationship> toData(
      final CdmE2ERelationship instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    final AttributeReference fromAttribute = new AttributeReference();
    fromAttribute.setEntityName(getEntityName(instance.getFromEntity()));
    fromAttribute.setAttributeName(instance.getFromEntityAttribute());

    final AttributeReference toAttribute = new AttributeReference();
    toAttribute.setEntityName(getEntityName(instance.getToEntity()));
    toAttribute.setAttributeName(instance.getToEntityAttribute());

    final SingleKeyRelationship result = new SingleKeyRelationship();
    result.setType("SingleKeyRelationship");
    result.setDescription(instance.getExplanation());
    result.setName(instance.getName());
    result.setFromAttribute(fromAttribute);
    result.setToAttribute(toAttribute);

    Utils.processTraitsAndAnnotationsToData(instance.getCtx(), result, instance.getExhibitsTraits());
    
    return CompletableFuture.completedFuture(result);
  }

  private static String getEntityName(final String corpusPath) {
    final int lastSlashIndex = corpusPath.lastIndexOf("/");
    if (lastSlashIndex != -1) {
      return StringUtils.slice(corpusPath, lastSlashIndex + 1);
    }

    return corpusPath;
  }
}
