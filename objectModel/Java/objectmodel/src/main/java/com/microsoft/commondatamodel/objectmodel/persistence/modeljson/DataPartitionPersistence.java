// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.CsvFormatSettings;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Partition;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public class DataPartitionPersistence {
  public static CompletableFuture<CdmDataPartitionDefinition> fromData(
      final CdmCorpusContext ctx,
      final Partition obj,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList,
      final CdmFolderDefinition documentFolder) {
    final CdmDataPartitionDefinition partition = ctx.getCorpus().makeObject(CdmObjectType.DataPartitionDef, obj.getName());
    if (!StringUtils.isNullOrTrimEmpty(obj.getDescription())) {
      partition.setDescription(obj.getDescription());
    }
    partition.setLocation(
        ctx.getCorpus().getStorage().createRelativeCorpusPath(
            ctx.getCorpus().getStorage().adapterPathToCorpusPath(obj.getLocation()),
            documentFolder));
    partition.setRefreshTime(obj.getRefreshTime());
    partition.setLastFileModifiedTime(obj.getLastFileModifiedTime());
    partition.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());

    if (Strings.isNullOrEmpty(partition.getLocation())) {
      Logger.warning(
          DataPartitionPersistence.class.getSimpleName(),
          ctx,
          Logger.format("Couldn't find data partition's location for partition {0}.", partition.getName()),
          "fromData"
      );
    }

    if (obj.isHidden() != null && obj.isHidden()) {
      final CdmTraitReference isHiddenTrait = ctx.getCorpus().makeRef(CdmObjectType.TraitRef, "is.hidden", true);
      partition.getExhibitsTraits().add(isHiddenTrait);
    }

    return Utils.processAnnotationsFromData(ctx, obj, partition.getExhibitsTraits()).thenCompose(v -> {
      if (obj.getFileFormatSettings() != null) {
        final CdmTraitReference csvFormatTrait = Utils.createCsvTrait(obj.getFileFormatSettings(), ctx);
        if (csvFormatTrait == null) {
          Logger.error(
              DataPartitionPersistence.class.getSimpleName(),
              ctx,
              "There was a problem while processing csv format settings inside data partition.",
              "fromData"
          );

          return CompletableFuture.completedFuture(null);
        }
        partition.getExhibitsTraits().add(csvFormatTrait);
      }

      ExtensionHelper.processExtensionFromJson(
          ctx,
          obj,
          partition.getExhibitsTraits(),
          extensionTraitDefList,
          localExtensionTraitDefList);
      return CompletableFuture.completedFuture(partition);
    });
  }

  public static CompletableFuture<Partition> toData(
      final CdmDataPartitionDefinition instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    final Partition result = new Partition();
    result.setName(instance.getName());
    result.setDescription(instance.getDescription());
    result.setLocation(
        instance.getCtx().getCorpus().getStorage().corpusPathToAdapterPath(
            instance.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(
                instance.getLocation(),
                instance.getInDocument())));
    result.setRefreshTime(instance.getRefreshTime());
    result.setFileFormatSettings(null);
    result.setLastFileModifiedTime(instance.getLastFileModifiedTime());
    result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());

    if (Strings.isNullOrEmpty(result.getLocation())) {
      Logger.warning(
          DataPartitionPersistence.class.getSimpleName(),
          instance.getCtx(),
          Logger.format("Couldn't find data partition's location for partition {0}.", result.getName()),
          "toData"
      );
    }

    Utils.processTraitsAndAnnotationsToData(instance.getCtx(), result, instance.getExhibitsTraits());
    final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);

    if (t2pm.fetchTraitReferenceName("is.hidden") != null) {
      result.setHidden(true);
    }

    final CdmTraitReference csvTrait = t2pm.fetchTraitReferenceName("is.partition.format.CSV");
    if (csvTrait != null) {
      final CsvFormatSettings csvFormatSettings = Utils.createCsvFormatSettings(csvTrait);

      if (csvFormatSettings != null) {
        result.setFileFormatSettings(csvFormatSettings);
        result.getFileFormatSettings().setType("CsvFormatSettings");
      } else {
        Logger.error(DataPartitionPersistence.class.getSimpleName(), instance.getCtx(), "There was a problem while processing csv format trait inside data partition.");

        return CompletableFuture.completedFuture(null);
      }
    }

    return CompletableFuture.completedFuture(result);
  }
}
