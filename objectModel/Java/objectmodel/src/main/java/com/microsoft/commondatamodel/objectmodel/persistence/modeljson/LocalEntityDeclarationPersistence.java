// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Partition;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class LocalEntityDeclarationPersistence {
  private static final String TAG = LocalEntityDeclarationPersistence.class.getSimpleName();

  public static CompletableFuture<CdmEntityDeclarationDefinition> fromData(
      final CdmCorpusContext ctx,
      final CdmFolderDefinition documentFolder,
      final LocalEntity obj,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final CdmManifestDefinition manifest) {
    final CdmLocalEntityDeclarationDefinition localEntity = ctx.getCorpus()
        .makeObject(CdmObjectType.LocalEntityDeclarationDef, obj.getName());

    final List<CdmTraitDefinition> localExtensionTraitDefList = new ArrayList<>();
    return DocumentPersistence.fromData(ctx, obj, extensionTraitDefList, localExtensionTraitDefList)
        .thenCompose(entityDoc -> {

          documentFolder.getDocuments().add(entityDoc);

          // CdmEntityDefinition schema path is the path to the doc containing the entity definition.
          localEntity.setEntityPath(
              ctx.getCorpus()
                  .getStorage()
                  .createRelativeCorpusPath(
                      entityDoc.getAtCorpusPath() + "/" + obj.getName(),
                      documentFolder));
          localEntity.setVirtualLocation(documentFolder.getFolderPath() + PersistenceLayer.modelJsonExtension);
          localEntity.setExplanation(obj.getDescription());
          localEntity.setLastChildFileModifiedTime(obj.getLastChildFileModifiedTime());
          localEntity.setLastFileModifiedTime(obj.getLastFileModifiedTime());
          localEntity.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());

          if (obj.isHidden() != null && obj.isHidden()) {
            final CdmTraitReference isHiddenTrait =
                ctx.getCorpus().makeRef(
                    CdmObjectType.TraitRef,
                    "is.hidden",
                    true);
            isHiddenTrait.setFromProperty(true);
            localEntity.getExhibitsTraits().add(isHiddenTrait);
          }

          // Add traits for schema entity info.
          if (obj.getSchemas() != null) {
            final TraitToPropertyMap t2pm = new TraitToPropertyMap(localEntity);
            t2pm.updatePropertyValue(CdmPropertyName.CDM_SCHEMAS, obj.getSchemas());
          }

          // Data partitions are part of the local entity, add them here.
          final List<Partition> partitions = obj.getPartitions();
          if (partitions != null) {
            for (final Partition element : partitions) {
              final CdmDataPartitionDefinition cdmPartition =
                  DataPartitionPersistence.fromData(
                      ctx,
                      element,
                      extensionTraitDefList,
                      localExtensionTraitDefList,
                      documentFolder)
                      .join();
              if (cdmPartition != null) {
                localEntity.getDataPartitions().add(cdmPartition);
              } else {
                Logger.error(ctx, TAG, "fromData", null, CdmLogCode.ErrPersistModelJsonDocConversionError);
                return CompletableFuture.completedFuture(null);
              }
            }
          }

          final List<CdmImport> importDocs =
              ExtensionHelper.standardImportDetection(ctx, extensionTraitDefList, localExtensionTraitDefList).join();
          ExtensionHelper.addImportDocsToManifest(ctx, importDocs, entityDoc);
          return CompletableFuture.completedFuture(localEntity);
        });
  }

  public static CompletableFuture<LocalEntity> toData(
      final CdmEntityDeclarationDefinition instance,
      final CdmManifestDefinition manifest,
      final ResolveOptions resOpt,
      final CopyOptions options) {

    return DocumentPersistence.toData(instance.getEntityPath(), manifest, instance.getCtx(), resOpt, options)
        .thenCompose(localEntity -> {
          if (localEntity != null) {
            final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);
            final CdmTraitReference isHiddenTrait = t2pm.fetchTraitReference("is.hidden");

            if (localEntity.getDescription() == null) {
                localEntity.setDescription(instance.getExplanation());
            }
            localEntity.setLastChildFileModifiedTime(instance.getLastChildFileModifiedTime());
            localEntity.setLastFileModifiedTime(instance.getLastFileModifiedTime());
            localEntity.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());

            if (isHiddenTrait != null) {
              localEntity.setHidden(true);
            }

            final Object propertyValues = t2pm.fetchPropertyValue(CdmPropertyName.CDM_SCHEMAS);
            if (propertyValues instanceof ArrayList<?>) {
              final ArrayList<String> schemas = (ArrayList<String>) propertyValues;
              localEntity.setSchemas(schemas);
            }

            if (localEntity.getTraits() != null) {
              localEntity.setTraits(localEntity.getTraits());
            }

            if (instance.getDataPartitions() != null && instance.getDataPartitions().getCount() > 0) {
              localEntity.setPartitions(new ArrayList<>());
              for (final CdmDataPartitionDefinition element : instance.getDataPartitions()) {
                final Partition partition = DataPartitionPersistence.toData(element, resOpt, options).join();

                if (partition != null) {
                  localEntity.getPartitions().add(partition);
                }
              }
            }

            return CompletableFuture.completedFuture(localEntity);
          }

          return CompletableFuture.completedFuture(null);
        });
  }
}
