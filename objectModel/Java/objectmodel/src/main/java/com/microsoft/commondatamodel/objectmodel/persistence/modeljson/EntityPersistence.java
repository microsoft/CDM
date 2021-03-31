// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Attribute;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class EntityPersistence {
  private static String tag = EntityPersistence.class.getSimpleName();

  public static CompletableFuture<CdmEntityDefinition> fromData(
      final CdmCorpusContext ctx,
      final LocalEntity obj,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList) {
    final CdmEntityDefinition entity = ctx.getCorpus().makeObject(CdmObjectType.EntityDef, obj.getName());
    if (!StringUtils.isNullOrTrimEmpty(obj.getDescription())) {
      entity.setDescription(obj.getDescription());
    }

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
            Logger.error(ctx, tag, "fromData", null, CdmLogCode.ErrPersistModelJsonAttrConversionFailure);
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
    result.setDescription((String) instance.getProperty(CdmPropertyName.DESCRIPTION));
    result.setType(EntityDeclaration.EntityDeclarationDefinitionType.LocalEntity);

    Utils.processTraitsAndAnnotationsToData(instance.getCtx(), result, instance.getExhibitsTraits());
    if (instance.getAttributes() != null) {
      result.setAttributes(new ArrayList<>());
      for (final CdmAttributeItem element : instance.getAttributes()) {
        if (element.getObjectType() != CdmObjectType.TypeAttributeDef) {
          Logger.error(ctx, tag, "toData", element.getAtCorpusPath(), CdmLogCode.ErrPersistManifestSavingFailure);
          return null;
        }
        // TODO-BQ: verify if the order of attribute being added is important.
        // TODO: handle when attribute is something else other than CdmTypeAttributeDefinition.
        if (element instanceof CdmTypeAttributeDefinition) {
          final Attribute attribute = TypeAttributePersistence
              .toData((CdmTypeAttributeDefinition) element, resOpt, options).join();
          if (attribute != null) {
            result.getAttributes().add(attribute);
          } else {
            Logger.error(ctx, tag, "toData", element.getAtCorpusPath(), CdmLogCode.ErrPersistModelJsonAttrConversionFailure);
            return null;
          }
        }
      }
    }

    return CompletableFuture.completedFuture(result);
  }
}
