// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Attribute;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EntityPersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(EntityPersistence.class);

  public static CompletableFuture<CdmEntityDefinition> fromData(
      final CdmCorpusContext ctx,
      final LocalEntity obj,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList) {
    final CdmEntityDefinition entity = ctx.getCorpus().makeObject(CdmObjectType.EntityDef, obj.getName());
    entity.setDescription(obj.getDescription());

    return Utils.processAnnotationsFromData(ctx, obj, entity.getExhibitsTraits()).thenApply(v -> {
      if (obj.getAttributes() != null) {
        for (final Attribute attribute : obj.getAttributes()) {
          final CdmAttributeItem typeAttribute =
              TypeAttributePersistence.fromData(
                  ctx,
                  attribute,
                  extensionTraitDefList,
                  localExtensionTraitDefList)
                  .join();
          if (typeAttribute != null) {
            entity.getAttributes().add(typeAttribute);
          } else {
            LOGGER.error("There was an error while trying to convert model.json attribute to cdm attribute.");

            return null;
          }
        }
      }
      ExtensionHelper.processExtensionFromJson(
          ctx,
          obj,
          entity.getExhibitsTraits(),
          extensionTraitDefList,
          localExtensionTraitDefList);

      return entity;
    });
  }

  public static CompletableFuture<LocalEntity> toData(
      final CdmEntityDefinition instance,
      final CdmCorpusContext ctx,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    final LocalEntity result = new LocalEntity();
    result.setName(instance.getEntityName());
    result.setDescription(instance.getDescription());
    result.setType(EntityDeclaration.EntityDeclarationDefinitionType.LocalEntity);

    return Utils.processAnnotationsToData(instance.getCtx(), result, instance.getExhibitsTraits()).thenApply(v -> {
      if (instance.getAttributes() != null) {
        result.setAttributes(new ArrayList<>());
        for (final CdmAttributeItem element : instance.getAttributes()) {
          // TODO-BQ: verify if the order of attribute being added is important.
          // TODO: handle when attribute is something else other than CdmTypeAttributeDefinition.
          if (element instanceof CdmTypeAttributeDefinition) {
            final Attribute attribute = TypeAttributePersistence
                .toData((CdmTypeAttributeDefinition) element, resOpt, options).join();
            if (attribute != null) {
              result.getAttributes().add(attribute);
            } else {
              LOGGER.error("There was an error while trying to convert model.json attribute to cdm attribute.");
              return null;
            }
          }
        }
      }

      return result;
    });
  }
}
