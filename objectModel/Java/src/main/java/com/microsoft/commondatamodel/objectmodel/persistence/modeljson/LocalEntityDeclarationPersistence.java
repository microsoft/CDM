package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Partition;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LocalEntityDeclarationPersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(LocalEntityDeclarationPersistence.class);

  public static CompletableFuture<CdmEntityDeclarationDefinition> fromData(
      final CdmCorpusContext ctx,
      final CdmFolderDefinition documentFolder,
      final LocalEntity obj,
      final CdmCollection<CdmTraitDefinition> extensionTraitDefList) {
    final CdmEntityDeclarationDefinition localEntity = ctx.getCorpus()
            .makeObject(CdmObjectType.LocalEntityDeclarationDef, obj.getName());

    return DocumentPersistence.fromData(ctx, obj, extensionTraitDefList).thenCompose(entityDoc -> {
      if (entityDoc == null) {
        LOGGER.error("There was an error while trying to fetch the entity doc from local entity declaration persistence.");
        return CompletableFuture.completedFuture(null);
      }

      documentFolder.getDocuments().add(entityDoc);

      // CdmEntityDefinition schema path is the path to the doc containing the entity definition.
      localEntity.setEntityPath(
          ctx.getCorpus()
              .getStorage()
              .createRelativeCorpusPath(
                  entityDoc.getAtCorpusPath() + "/" + obj.getName(),
                  entityDoc));
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
          final CdmDataPartitionDefinition cdmPartition = DataPartitionPersistence.fromData(ctx, element, extensionTraitDefList).join();
          if (cdmPartition != null) {
            localEntity.getDataPartitions().add(cdmPartition);
          } else {
            LOGGER.error("There was an error while trying to fetch the entity doc from local entity declaration persistence.");

            return CompletableFuture.completedFuture(null);
          }
        }
      }

      return CompletableFuture.completedFuture(localEntity);
    });
  }

  public static CompletableFuture<LocalEntity> toData(
      final CdmEntityDeclarationDefinition instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {

    return DocumentPersistence.toData(instance.getEntityPath(), instance.getCtx(), resOpt, options)
            .thenCompose(localEntity -> {
              if (localEntity != null) {
                final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);
                final CdmTraitReference isHiddenTrait = t2pm.fetchTraitReferenceName("is.hidden");

                localEntity.setDescription(instance.getExplanation());
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
                    } else {
                      LOGGER.error("There was an error while trying to convert cdm data partition to model.json partition.");
                      return CompletableFuture.completedFuture(null);
                    }
                  }
                }

                return CompletableFuture.completedFuture(localEntity);
              }

              return CompletableFuture.completedFuture(null);
            });
  }
}
