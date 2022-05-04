// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ImportPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.utilities.Constants;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

public class DocumentPersistence {
  private static final String TAG = DocumentPersistence.class.getSimpleName();

  public static CompletableFuture<CdmDocumentDefinition> fromData(
      final CdmCorpusContext ctx,
      final LocalEntity obj,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList) {
    return CompletableFuture.supplyAsync(() -> {
      final String docName = obj.getName() + CdmConstants.CDM_EXTENSION;
      final CdmDocumentDefinition document = ctx.getCorpus()
          .makeObject(
              CdmObjectType.DocumentDef,
              docName);

      // Import at least foundations.
      document.getImports().add(Constants.FoundationsCorpusPath);

      final CdmEntityDefinition entity =
          EntityPersistence.fromData(
              ctx,
              obj,
              extensionTraitDefList,
              localExtensionTraitDefList)
              .join();
      if (entity == null) {
        Logger.error(ctx, TAG, "fromData", null, CdmLogCode.ErrPersistModelJsonEntityConversionError, obj.getName());
        return null;
      }

      if (obj.getImports() != null) {
        for (final Import anImport : obj.getImports()) {
          if (Objects.equals(Constants.FoundationsCorpusPath, anImport.getCorpusPath())) {
            // Don't add foundations twice.
            continue;
          }

          document.getImports().add(ImportPersistence.fromData(ctx, anImport));
        }
      }

      document.getDefinitions().add(entity);

      return document;
    });
  }

  public static CompletableFuture<LocalEntity> toData(
      final Object documentObjectOrPath,
      final CdmManifestDefinition manifest,
      final CdmCorpusContext ctx,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    if (documentObjectOrPath instanceof String) {
      return ctx.getCorpus()
          .fetchObjectAsync((String) documentObjectOrPath, manifest)
          .thenApply(cdmEntity -> {
            if (cdmEntity instanceof CdmEntityDefinition) {
              final LocalEntity entity = EntityPersistence.toData(
                  (CdmEntityDefinition) cdmEntity,
                  ctx,
                  resOpt,
                  options
              ).join();
              final CdmObject owner = cdmEntity.getOwner();
              if (owner instanceof CdmDocumentDefinition) {
                final CdmDocumentDefinition documentDefinition = (CdmDocumentDefinition) owner;
                if (documentDefinition.getImports().getCount() > 0) {
                  entity.setImports(new ArrayList<>());
                  documentDefinition.getImports().forEach(element -> {
                    final Import cdmImport = ImportPersistence.toData(element, resOpt, options);
                    // the corpus path in the imports are relative to the document where it was defined.
                    // when saving in model.json the documents are flattened to the manifest level
                    // so it is necessary to recalculate the path to be relative to the manifest.
                    String absolutePath = ctx.getCorpus()
                        .getStorage()
                        .createAbsoluteCorpusPath(cdmImport.getCorpusPath(), documentDefinition);
                    if (!StringUtils.isBlankByCdmStandard(documentDefinition.getNamespace()) && absolutePath.startsWith(documentDefinition.getNamespace() + ":")) {
                      absolutePath = absolutePath.substring(documentDefinition.getNamespace().length() + 1);
                    }
                    cdmImport.setCorpusPath(ctx.getCorpus()
                        .getStorage()
                        .createRelativeCorpusPath(absolutePath, manifest));
                    entity.getImports().add(cdmImport);
                  });
                }
              } else {
                Logger.warning(ctx, TAG, "toData", manifest.getAtCorpusPath(), CdmLogCode.WarnPersistEntityMissing, ((CdmEntityDefinition) cdmEntity).getName());
              }

              return entity;
            } else {
              Logger.error(ctx, TAG, "toData", manifest.getAtCorpusPath(), CdmLogCode.ErrPersistCdmEntityFetchError);
              return null;
            }
          });
    }

    return CompletableFuture.completedFuture(null);
  }
}
