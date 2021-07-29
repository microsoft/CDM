// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.ReferenceEntity;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class ReferencedEntityDeclarationPersistence {
  private static final String TAG = ReferencedEntityDeclarationPersistence.class.getSimpleName();

  public static CompletableFuture<CdmEntityDeclarationDefinition> fromData(
      final CdmCorpusContext ctx,
      final ReferenceEntity obj,
      final String location) {
    final CdmEntityDeclarationDefinition referencedEntity = ctx.getCorpus()
        .makeObject(CdmObjectType.ReferencedEntityDeclarationDef, obj.getName());
    final String corpusPath = ctx.getCorpus().getStorage().adapterPathToCorpusPath(location);

    referencedEntity.setEntityName(obj.getName());
    referencedEntity.setEntityPath(corpusPath + "/" + obj.getSource());
    referencedEntity.setExplanation(obj.getDescription());
    referencedEntity.setLastFileModifiedTime(obj.getLastFileModifiedTime());
    referencedEntity.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());

    return Utils.processAnnotationsFromData(ctx, obj, referencedEntity.getExhibitsTraits()).thenCompose(v -> {
      if (obj.isHidden() != null && obj.isHidden()) {
        final CdmTraitReference isHiddenTrait = ctx.getCorpus().makeRef(CdmObjectType.TraitRef, "is.hidden", true);
        isHiddenTrait.setFromProperty(true);
        referencedEntity.getExhibitsTraits().add(isHiddenTrait);
      }

      final CdmTraitReference trait = ctx.getCorpus().makeRef(CdmObjectType.TraitRef, "is.propertyContent.multiTrait", false);
      trait.setFromProperty(true);
      final CdmArgumentDefinition argument = ctx.getCorpus().makeObject(CdmObjectType.ArgumentDef, "modelId");
      argument.setValue(obj.getModelId());
      trait.getArguments().add(argument);
      referencedEntity.getExhibitsTraits().add(trait);

      final List<CdmTraitDefinition> extensionTraitDefList = new ArrayList<>();
      final CdmTraitCollection extensionTraits = new CdmTraitCollection(ctx, referencedEntity);
      ExtensionHelper.processExtensionFromJson(ctx, obj, extensionTraits, extensionTraitDefList);

      if (extensionTraitDefList.size() > 0) {
        Logger.warning(ctx, TAG, "fromData", null, CdmLogCode.WarnPersistCustomExtNotSupported, referencedEntity.getEntityName());
      }

      return CompletableFuture.completedFuture(referencedEntity);
    });
  }

  public static CompletableFuture<ReferenceEntity> toData(final CdmEntityDeclarationDefinition instance,
      final ResolveOptions resOpt, final CopyOptions options) {

    final int sourceIndex = instance.getEntityPath().lastIndexOf("/");

    if (sourceIndex == -1) {
      Logger.error(instance.getCtx(), TAG, "toData", instance.getAtCorpusPath(), CdmLogCode.ErrPersistModelJsonEntityRefConversionError, instance.getEntityName());
      return CompletableFuture.completedFuture(null);
    }

    final ReferenceEntity referenceEntity = new ReferenceEntity();
    referenceEntity.setType("ReferenceEntity");
    referenceEntity.setName(instance.getEntityName());
    referenceEntity.setSource(instance.getEntityPath().substring(sourceIndex + 1));
    referenceEntity.setDescription(instance.getExplanation());
    referenceEntity.setLastFileModifiedTime(instance.getLastFileModifiedTime());
    referenceEntity.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());

    Utils.processTraitsAndAnnotationsToData(instance.getCtx(), referenceEntity, instance.getExhibitsTraits());
    final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);

    final CdmTraitReference isHiddenTrait = t2pm.fetchTraitReference("is.hidden");
    if (isHiddenTrait != null) {
      referenceEntity.setHidden(true);
    }

    final CdmTraitReference propertiesTrait = t2pm.fetchTraitReference("is.propertyContent.multiTrait");
    if (propertiesTrait != null) {
      referenceEntity.setModelId(propertiesTrait.getArguments().get(0).getValue().toString());
    }

    return CompletableFuture.completedFuture(referenceEntity);
  }
}
