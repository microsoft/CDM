package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.CsvFormatSettings;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Partition;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataPartitionPersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(DataPartitionPersistence.class);


  public static CompletableFuture<CdmDataPartitionDefinition> fromData(final CdmCorpusContext ctx, final Partition obj,
                                                                       final CdmCollection<CdmTraitDefinition> extensionTraitDefList) {
    final CdmDataPartitionDefinition partition = ctx.getCorpus().makeObject(CdmObjectType.DataPartitionDef, obj.getName());
    partition.setDescription(obj.getDescription());
    partition.setLocation(ctx.getCorpus().getStorage().adapterPathToCorpusPath(obj.getLocation()));
    partition.setRefreshTime(obj.getRefreshTime());
    partition.setLastFileModifiedTime(obj.getLastFileModifiedTime());
    partition.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());

    if (obj.isHidden() != null && obj.isHidden()) {
      final CdmTraitReference isHiddenTrait = ctx.getCorpus().makeRef(CdmObjectType.TraitRef, "is.hidden", true);
      partition.getExhibitsTraits().add(isHiddenTrait);
    }

    return Utils.processAnnotationsFromData(ctx, obj, partition.getExhibitsTraits()).thenCompose(v -> {
      if (obj.getFileFormatSettings() != null) {
        final CdmTraitReference csvFormatTrait = Utils.createCsvTrait(obj.getFileFormatSettings(), ctx);
        if (csvFormatTrait == null) {
          LOGGER.error("There was a problem while processing csv format settings inside data partition.");

          return CompletableFuture.completedFuture(null);
        }
        partition.getExhibitsTraits().add(csvFormatTrait);
      }

      ExtensionHelper.processExtensionFromJson(ctx, obj, partition.getExhibitsTraits(), extensionTraitDefList);
      return CompletableFuture.completedFuture(partition);
    });
  }

  public static CompletableFuture<Partition> toData(final CdmDataPartitionDefinition instance, final ResolveOptions resOpt,
                                                    final CopyOptions options) {
    final Partition result = new Partition();
    result.setName(instance.getName());
    result.setDescription(instance.getDescription());
    result.setLocation(instance.getCtx().getCorpus().getStorage().corpusPathToAdapterPath(instance.getLocation()));
    result.setRefreshTime(instance.getRefreshTime());
    result.setFileFormatSettings(null);
    result.setLastFileModifiedTime(instance.getLastFileModifiedTime());
    result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());

    return Utils.processAnnotationsToData(instance.getCtx(), result, instance.getExhibitsTraits()).thenCompose(v -> {
      final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);

      if(t2pm.fetchTraitReferenceName("is.hidden") != null) {
        result.setHidden(true);
      }

      final CdmTraitReference csvTrait = t2pm.fetchTraitReferenceName("is.partition.format.CSV");
      if (csvTrait != null) {
        final CsvFormatSettings csvFormatSettings = Utils.createCsvFormatSettings(csvTrait);

        if (csvFormatSettings != null) {
          result.setFileFormatSettings(csvFormatSettings);
          result.getFileFormatSettings().setType("CsvFormatSettings");
        } else {
          LOGGER.error("There was a problem while processing csv format trait inside data partition.");

          return CompletableFuture.completedFuture(null);
        }
      }

      return CompletableFuture.completedFuture(result);
    });
  }
}
