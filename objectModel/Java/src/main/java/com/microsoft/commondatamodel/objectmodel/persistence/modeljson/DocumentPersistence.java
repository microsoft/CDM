package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ImportPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DocumentPersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(DocumentPersistence.class);

  public static CompletableFuture<CdmDocumentDefinition> fromData(
      final CdmCorpusContext ctx,
      final LocalEntity obj,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList) {
    return CompletableFuture.supplyAsync(() -> {
      final String docName = obj.getName() + ".cdm.json";
      final CdmDocumentDefinition document = ctx.getCorpus()
          .makeObject(
              CdmObjectType.DocumentDef,
              docName);

      // Import at least foundations.
      document.getImports().add("cdm:/foundations.cdm.json");

      final CdmEntityDefinition entity =
          EntityPersistence.fromData(
              ctx,
              obj,
              extensionTraitDefList,
              localExtensionTraitDefList)
              .join();
      if (entity == null) {
        LOGGER.error(
            "There was an error while trying to convert a model.json entity to the CDM entity."
        );
        return null;
      }

      if (obj.getImports() != null) {
        for (final Import anImport : obj.getImports()) {
          if (Objects.equals("cdm:/foundations.cdm.json", anImport.getCorpusPath())) {
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
          .fetchObjectAsync((String) documentObjectOrPath)
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
                    final String absolutePath = ctx.getCorpus()
                        .getStorage()
                        .createAbsoluteCorpusPath(cdmImport.getCorpusPath(), documentDefinition);
                    cdmImport.setCorpusPath(ctx.getCorpus()
                        .getStorage()
                        .createRelativeCorpusPath(absolutePath, manifest));
                    entity.getImports().add(cdmImport);
                  });
                }
              } else {
                LOGGER.warn(
                    "Entity '{}' is not inside a document or its owner is not a document.",
                    ((CdmEntityDefinition) cdmEntity).getName());
              }

              return entity;
            } else {
              LOGGER.error("There was an error while trying to fetch cdm entity doc.");
              return null;
            }
          });
    }

    return CompletableFuture.completedFuture(null);
  }
}
