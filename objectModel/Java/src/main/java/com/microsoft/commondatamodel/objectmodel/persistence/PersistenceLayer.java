package com.microsoft.commondatamodel.objectmodel.persistence;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.enums.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.CdmFolderType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DocumentContent;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.persistence.common.PersistenceType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// TODO-BQ: This class will need a revisit, it is dealing with way too much reflection.
public class PersistenceLayer {
  private static final Map<String, PersistenceType> persistenceTypeMap = new LinkedHashMap<>();
  private static final Logger LOGGER = LoggerFactory.getLogger(PersistenceLayer.class);

  static {
    persistenceTypeMap.put("CdmFolder", new CdmFolderType());
  }

  public static <T extends CdmObject, U> CdmObject fromData(final CdmCorpusContext ctx, final U obj,
                                                            final String persistenceTypeName, final Class<T> classInterface) {
    final Class<?> persistenceClass = PersistenceLayer
        .findPersistenceClass(persistenceTypeName, classInterface);
    try {
      final Method method = persistenceClass
          .getMethod("fromData", CdmCorpusContext.class, obj.getClass());
      return (CdmObject) method.invoke(null, ctx, obj);
    } catch (final NoSuchMethodException e) {
      final String persistenceClassName = classInterface.getName();
      throw new RuntimeException(
          "Persistence class " + persistenceClassName + " in type " + persistenceTypeName
              + " does not implement ToData.", e);
    } catch (final IllegalAccessException | InvocationTargetException e) {
      final String persistenceClassName = classInterface.getName();
      throw new RuntimeException(
          "Persistence class " + persistenceClassName + " in type " + persistenceTypeName
              + " fail to call toData.", e);
    }
  }

  // TODO-BQ: Possible edge case when instance = null.
  public static <T extends CdmObject> Object toData(final T instance, final ResolveOptions resOpt,
                                                    final CopyOptions options, final String persistenceTypeName, final Class<T> classInterface) {
    final Class<?> persistenceClass = PersistenceLayer
        .findPersistenceClass(persistenceTypeName, classInterface);
    try {
      final Method method = persistenceClass
          .getMethod("toData", classInterface, ResolveOptions.class, CopyOptions.class);
      return method.invoke(null, instance, resOpt, options);
    } catch (final NoSuchMethodException e) {
      final String persistenceClassName = classInterface.getName();
      throw new RuntimeException(
          "Persistence class " + persistenceClassName + " in type " + persistenceTypeName
              + " does not implement toData.", e);
    } catch (final IllegalAccessException | InvocationTargetException e) {
      final String persistenceClassName = classInterface.getName();
      throw new RuntimeException(
          "Persistence class " + persistenceClassName + " in type " + persistenceTypeName
              + " fail to call toData.", e);
    }
  }

  public static <T extends CdmObject> Class findPersistenceClass(final String persistenceTypeName,
                                                                 final Class<T> classInterface) {
    if (persistenceTypeMap.containsKey(persistenceTypeName)) {
      final Class<?> persistenceClass = persistenceTypeMap.get(persistenceTypeName).getRegisteredClasses()
          .getPersistenceClass(classInterface);
      if (persistenceClass == null) {
        throw new RuntimeException(
            "Persistence class for " + classInterface.getName() + " is not implemented in type "
                + persistenceTypeName + ".");
      }
      return persistenceClass;
    } else {
      throw new RuntimeException("Persistence type " + persistenceTypeName + " not implemented.");
    }
  }

  public static CompletableFuture<CdmDocumentDefinition> loadDocumentFromPathAsync(
      final CdmFolderDefinition folder,
      final String docName,
      final CdmDocumentDefinition docContainer) {
    return CompletableFuture.supplyAsync(() -> {
      CdmDocumentDefinition doc;
      String jsonData = null;
      OffsetDateTime fsModifiedTime = null;
      final CdmCorpusContext ctx = folder.getCtx();
      final String docPath = folder.getFolderPath() + docName;
      final StorageAdapter adapter = ctx.getCorpus().getStorage().fetchAdapter(folder.getNamespace());
      try {
        if (adapter.canRead()) {
          jsonData = adapter.readAsync(docPath).join();
          fsModifiedTime = adapter.computeLastModifiedTimeAsync(docPath).join();
          LOGGER.info("read file: '{}'", docPath);
        }
      } catch (final Exception e) {
        LOGGER.error(
            "Could not read '{}' from the '{}' namespace. Reason '{}'",
            docPath,
            folder.getNamespace(),
            e.getLocalizedMessage());
        return null;
      }

      try {
        // Check file extensions, which performs a case-insensitive ordinal string comparison
        if (StringUtils.endsWithIgnoreCase(docPath, CdmConstants.MANIFEST_EXTENSION)
            || StringUtils.endsWithIgnoreCase(docPath, CdmConstants.FOLIO_EXTENSION)) {
          doc = ManifestPersistence.fromData(
              ctx,
              docName,
              folder.getNamespace(),
              folder.getFolderPath(),
              JMapper.MAP.readValue(jsonData, ManifestContent.class));
        } else if (StringUtils.endsWithIgnoreCase(docPath, CdmConstants.MODEL_JSON_EXTENSION)) {
          if (!StringUtils.equalsIgnoreCase(docName, CdmConstants.MODEL_JSON_EXTENSION)) {
            LOGGER.error("Failed to load '{}', as it's not an acceptable file name. It must be model.json.", docName);
            return null;
          }
          doc = com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ManifestPersistence
              .fromData(
                  ctx,
                  JMapper.MAP.readValue(jsonData, Model.class),
                  folder).join();
        } else {
          doc =
              DocumentPersistence.fromData(
                  ctx,
                  docName,
                  folder.getNamespace(),
                  folder.getFolderPath(),
                  JMapper.MAP.readValue(jsonData, DocumentContent.class));
        }
      } catch (final IOException e) {
        LOGGER.error("Could not covert '{}'. Reason '{}'", jsonData, e.getLocalizedMessage());
        return null;
      }

      if (doc != null) {
        if (docContainer != null) {
          // There are situations where a previously loaded document must be re-loaded.
          // The end of that chain of work is here where the old version of the document has been
          // removed from the corpus and we have created a new document and loaded it from storage
          // and after this call we will probably add it to the corpus and index it, etc.
          // It would be really rude to just kill that old object and replace it with this replica,
          // especially because the caller has no idea this happened. So... sigh ... instead of
          // returning the new object return the one that was just killed off but make it contain
          // everything the new document loaded.
          doc = (CdmDocumentDefinition) doc.copy(new ResolveOptions(docContainer), docContainer);
        }

        folder.getDocuments().add(doc, docName);

        doc.setFileSystemModifiedTime(fsModifiedTime);
        doc.setDirty(false);
      }

      return doc;
    });
  }
}
