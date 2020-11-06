// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.CdmFolderType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.common.PersistenceType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ModelJsonType;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import com.microsoft.commondatamodel.objectmodel.utilities.StorageUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;

// TODO-BQ: This class will need a revisit, it is dealing with way too much reflection.
public class PersistenceLayer {
  final CdmCorpusDefinition corpus;
  final CdmCorpusContext ctx;

  public static final String cdmFolder = "CdmFolder";
  public static final String modelJson = "ModelJson";
  public static final String odi = "Odi";

  private static final Map<String, PersistenceType> persistenceTypeMap = new LinkedHashMap<>();

  static {
    persistenceTypeMap.put(cdmFolder, new CdmFolderType());
    persistenceTypeMap.put(modelJson, new ModelJsonType());
  }

  /**
   * The dictionary of file extension <-> persistence class that handles the file format.
   */
  private ConcurrentHashMap<String, Class> registeredPersistenceFormats;

  /**
   * The dictionary of persistence class <-> whether the persistence class has async methods.
   */
  private ConcurrentHashMap<Class, Boolean> isRegisteredPersistenceAsync;

  public PersistenceLayer(final CdmCorpusDefinition corpus) {
    this.corpus = corpus;
    this.ctx = this.corpus.getCtx();
    this.registeredPersistenceFormats = new ConcurrentHashMap<>();
    this.isRegisteredPersistenceAsync = new ConcurrentHashMap<>();

    this.registerFormat(ManifestPersistence.class.getCanonicalName());
    this.registerFormat(com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ManifestPersistence.class.getCanonicalName());
    this.registerFormat(DocumentPersistence.class.getCanonicalName());
    this.registerFormat("com.microsoft.commondatamodel.objectmodel.persistence.odi.ManifestPersistence");
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

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param folder folder
   * @param docName document name
   * @param docContainer Doc container
   * @return CompletableFuture of CdmDocumentDefinition 
   */
  @Deprecated
  public CompletableFuture<CdmDocumentDefinition> loadDocumentFromPathAsync(
      final CdmFolderDefinition folder,
      final String docName,
      final CdmDocumentDefinition docContainer) {
    return loadDocumentFromPathAsync(folder, docName, docContainer, null);
  }


  
  /** 
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param folder folder
   * @param docName document name
   * @param docContainer Doc container
   * @param resOpt Resolve options
   * @return CompletableFuture of CdmDocumentDefinition 
   */
  @Deprecated
  public CompletableFuture<CdmDocumentDefinition> loadDocumentFromPathAsync(
      final CdmFolderDefinition folder,
      final String docName,
      final CdmDocumentDefinition docContainer,
      final ResolveOptions resOpt) {
    return CompletableFuture.supplyAsync(() -> {
      CdmDocumentDefinition docContent;
      String jsonData = null;
      OffsetDateTime fsModifiedTime = null;
      final String docPath = folder.getFolderPath() + docName;
      final StorageAdapter adapter = this.corpus.getStorage().fetchAdapter(folder.getNamespace());
      try {
        if (adapter.canRead()) {
          // log message used by navigator, do not change or remove
          Logger.debug(PersistenceLayer.class.getSimpleName(), this.ctx, Logger.format("request file: {0}", docPath), "loadDocumentFromPathAsync");
          jsonData = adapter.readAsync(docPath).get();
          // log message used by navigator, do not change or remove
          Logger.debug(PersistenceLayer.class.getSimpleName(), this.ctx, Logger.format("received file: {0}", docPath), "loadDocumentFromPathAsync");
        } else {
          throw new Exception("Storage Adapter is not enabled to read.");
        }
      } catch (final Exception e) {
        // log message used by navigator, do not change or remove
        Logger.debug(PersistenceLayer.class.getSimpleName(), this.ctx, Logger.format("fail file: {0}", docPath), "loadDocumentFromPathAsync");

        String message = Logger.format("Could not read '{0}' from the '{1}' namespace. Reason '{2}'", docPath, folder.getNamespace(), e.getLocalizedMessage());
        // When shallow validation is enabled, log messages about being unable to find referenced documents as warnings instead of errors.
        if (resOpt != null && resOpt.getShallowValidation()) {
          Logger.warning(PersistenceLayer.class.getSimpleName(), this.ctx, message, "loadDocumentFromPathAsync");
        } else {
          Logger.error(PersistenceLayer.class.getSimpleName(), this.ctx, message, "loadDocumentFromPathAsync");
        }
        return null;
      }

      try {
        fsModifiedTime = adapter.computeLastModifiedTimeAsync(docPath).join();
      } catch (final Exception e) {
        Logger.warning(
            PersistenceLayer.class.getSimpleName(),
            this.ctx,
            Logger.format("Failed to compute file last modified time. Reason '{0}'", e.getLocalizedMessage()),
            "loadDocumentFromPathAsync"
        );
      }

      if (StringUtils.isEmpty(docName)) {
        Logger.error(PersistenceLayer.class.getSimpleName(), this.ctx, "Document name cannot be null or empty.", "loadDocumentFromPathAsync");
        return null;
      }

      // If loading an odi.json/model.json file, check that it is named correctly.
      if (StringUtils.endsWithIgnoreCase(docName, CdmConstants.ODI_EXTENSION) && !StringUtils.equalsIgnoreCase(docName, CdmConstants.ODI_EXTENSION)) {
        Logger.error(
            PersistenceLayer.class.getSimpleName(),
            this.ctx,
            Logger.format("Failed to load '{0}', as it's not an acceptable file name. It must be {1}.", docName, CdmConstants.ODI_EXTENSION),
            "loadDocumentFromPathAsync"
        );
        return null;
      }

      if (StringUtils.endsWithIgnoreCase(docName, CdmConstants.MODEL_JSON_EXTENSION) && !StringUtils.equalsIgnoreCase(docName, CdmConstants.MODEL_JSON_EXTENSION)) {
        Logger.error(
            PersistenceLayer.class.getSimpleName(),
            this.ctx,
            Logger.format("Failed to load '{0}', as it's not an acceptable file name. It must be {1}.", docName, CdmConstants.MODEL_JSON_EXTENSION),
            "loadDocumentFromPathAsync"
        );
        return null;
      }

      // Fetch the correct persistence class to use.
      Class persistenceClass = this.fetchRegisteredPersistenceFormat(docName);
      if (persistenceClass != null) {
        try {
          Method method = persistenceClass.getMethod("fromData", CdmCorpusContext.class, String.class, String.class, CdmFolderDefinition.class);

          // Check if fromData() is asynchronous for this persistence class.
          if (!isRegisteredPersistenceAsync.containsKey(persistenceClass)) {
            // Cache whether this persistence class has async methods.
            isRegisteredPersistenceAsync.put(persistenceClass, (boolean) persistenceClass.getField("isPersistenceAsync").get(null));
          }

          if (isRegisteredPersistenceAsync.get(persistenceClass)) {
            CompletableFuture<CdmDocumentDefinition> task = (CompletableFuture<CdmDocumentDefinition>) method.invoke(null, this.ctx, docName, jsonData, folder);
            docContent = task.join();
          } else {
            docContent = (CdmDocumentDefinition) method.invoke(null, this.ctx, docName, jsonData, folder);
          }
        } catch (final Exception e) {
          Logger.error(
              PersistenceLayer.class.getSimpleName(),
              this.ctx,
              Logger.format("Could not convert '{0}'. Reason '{1}'.", docName, e.getLocalizedMessage()),
              "loadDocumentFromPathAsync"
          );
          return null;
        }  
      } else {
        // Could not find a registered persistence class to handle this document type.
        Logger.error(
            PersistenceLayer.class.getSimpleName(),
            this.ctx,
            Logger.format("Could not find a persistence class to handle the file '{0}'.", docName),
            "loadDocumentFromPathAsync"
        );
        return null;
      }
      
      // Add document to the folder, this sets all the folder/path things, caches name to content association and may trigger indexing on content.
      if (docContent != null) {
        if (docContainer != null) {
          // There are situations where a previously loaded document must be re-loaded.
          // The end of that chain of work is here where the old version of the document has been
          // removed from the corpus and we have created a new document and loaded it from storage
          // and after this call we will probably add it to the corpus and index it, etc.
          // It would be really rude to just kill that old object and replace it with this replica,
          // especially because the caller has no idea this happened. So... sigh ... instead of
          // returning the new object return the one that was just killed off but make it contain
          // everything the new document loaded.
          docContent = (CdmDocumentDefinition) docContent.copy(new ResolveOptions(docContainer, this.ctx.getCorpus().getDefaultResolutionDirectives()), docContainer);
        }

        folder.getDocuments().add((CdmDocumentDefinition)docContent, docName);

        docContent.setFileSystemModifiedTime(fsModifiedTime);
        docContent.setDirty(false);
      }

      return docContent;
    });
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param doc Document
   * @param newName New name
   * @return CompletableFuture 
   */
  @Deprecated
  public CompletableFuture<Boolean> saveDocumentAsAsync(final CdmDocumentDefinition doc, final String newName) {
    return saveDocumentAsAsync(doc, newName, false);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param doc Document
   * @param newName New name
   * @param saveReferenced Save referenced
   * @return CompletableFuture 
   */
  @Deprecated
  public CompletableFuture<Boolean> saveDocumentAsAsync(final CdmDocumentDefinition doc, final String newName, final boolean saveReferenced) {
    return saveDocumentAsAsync(doc, newName, saveReferenced, null);
  }
 

  
  /** 
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param doc Document
   * @param newName New name
   * @param saveReferenced Save referenced
   * @param options Options
   * @return CompletableFuture 
   */
  @Deprecated
  public CompletableFuture<Boolean> saveDocumentAsAsync(
      final CdmDocumentDefinition doc,
      final String newName,
      final boolean saveReferenced,
      final CopyOptions options) {
    // Find out if the storage adapter is able to write.
    return CompletableFuture.supplyAsync(() -> {
      String ns = doc.getNamespace();
      if (StringUtils.isEmpty(ns)) {
        ns = this.corpus.getStorage().getDefaultNamespace();
      }
      final StorageAdapter adapter = this.corpus.getStorage().fetchAdapter(ns);

      if (adapter == null) {
        Logger.error(
            PersistenceLayer.class.getSimpleName(),
            this.ctx,
            Logger.format("Couldn't find a storage adapter registered for the namespace '{0}'", ns),
            "saveDocumentAsAsync"
        );
        return false;
      } else if (!adapter.canWrite()) {
        Logger.error(
            PersistenceLayer.class.getSimpleName(),
            this.ctx,
            Logger.format("The storage adapter '{0}' claims it is unable to write files.", ns),
            "saveDocumentAsAsync"
        );
        return false;
      } else {
        if (StringUtils.isEmpty(newName)) {
          Logger.error(PersistenceLayer.class.getSimpleName(), this.ctx, "Document name cannot be null or empty.", "saveDocumentAsAsync");
          return false;
        }

        // What kind of document is requested?
        // Check file extensions using a case-insensitive ordinal string comparison.
        final String persistenceType =
            StringUtils.endsWithIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION)
                ? modelJson
                : StringUtils.endsWithIgnoreCase(newName, CdmConstants.ODI_EXTENSION)? odi : cdmFolder;

        if (persistenceType == odi && !StringUtils.equalsIgnoreCase(newName, CdmConstants.ODI_EXTENSION)) {
          Logger.error(
              PersistenceLayer.class.getSimpleName(),
              this.ctx,
              Logger.format("Failed to persist '{0}', as it's not an acceptable filename.  It must be {1}.", newName, CdmConstants.ODI_EXTENSION),
              "saveDocumentAsAsync"
          );
          return false;
        }

        if (persistenceType == modelJson && !StringUtils.equalsIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION)) {
          Logger.error(
              PersistenceLayer.class.getSimpleName(),
              this.ctx,
              Logger.format("Failed to persist '{0}', as it's not an acceptable filename.  It must be {1}.", newName, CdmConstants.MODEL_JSON_EXTENSION),
              "saveDocumentAsAsync"
          );
          return false;
        }

        // Save the object into a json blob
        final ResolveOptions resOpt = new ResolveOptions(doc);
        final Object persistedDoc;
        
        // Fetch the correct persistence class to use.
        Class persistenceClass = this.fetchRegisteredPersistenceFormat(newName);
        if (persistenceClass != null) {
          try {
            Method method;
            // The method signatures of toData() differs slightly depending on if we are doing a manifest persistence
            // or a document persistence. Since Class.getMethod() requires the exact parameter types of the method we
            // want to "get", we do this file extension check here so that we can provide the accurate parameter types.
            if (
              StringUtils.endsWithIgnoreCase(newName, CdmConstants.ODI_EXTENSION) ||
              StringUtils.endsWithIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION) ||
              StringUtils.endsWithIgnoreCase(newName, CdmConstants.MANIFEST_EXTENSION) ||
              StringUtils.endsWithIgnoreCase(newName, CdmConstants.FOLIO_EXTENSION)
            ) {
              method = persistenceClass.getMethod("toData", CdmManifestDefinition.class, ResolveOptions.class, CopyOptions.class);
            } else {
              method = persistenceClass.getMethod("toData", CdmDocumentDefinition.class, ResolveOptions.class, CopyOptions.class);
            }
            
            // Check if toData() is asynchronous for this persistence class.
            if (!isRegisteredPersistenceAsync.containsKey(persistenceClass)) {
              // Cache whether this persistence class has async methods.
              isRegisteredPersistenceAsync.put(persistenceClass, (boolean) persistenceClass.getField("isPersistenceAsync").get(null));
            }

            if (isRegisteredPersistenceAsync.get(persistenceClass)) {
              CompletableFuture<Object> task = (CompletableFuture<Object>) method.invoke(null, doc, resOpt, options);
              persistedDoc = task.join();
            } else {
              persistedDoc = (Object) method.invoke(null, doc, resOpt, options);
            }
          } catch (final Exception e) {
            Logger.error(
                PersistenceLayer.class.getSimpleName(),
                this.ctx,
                Logger.format("Could not persist file '{0}'. Reason '{1}'.", newName, e.getLocalizedMessage()),
                "saveDocumentAsAsync"
            );
            return false;
          }
        } else {
          // Could not find a registered persistence class to handle this document type.
          Logger.error(
              PersistenceLayer.class.getSimpleName(),
              this.ctx,
              Logger.format("Could not find a persistence class to handle the file '{0}'.", newName),
              "saveDocumentAsAsync"
          );
          return false;
        }

        if (persistedDoc == null) {
          Logger.error(
              PersistenceLayer.class.getSimpleName(),
              this.ctx,
              Logger.format("Failed to persist '{0}'", newName),
              "saveDocumentAsAsync"
          );
          return false;
        }

        if (persistenceType.equals(odi)) {
          this.saveOdiDocumentsAsync(persistedDoc, adapter, newName).join();
          return true;
        }

        // turn the name into a path
        String newPath = doc.getFolderPath() + newName;
        newPath = this.corpus.getStorage().createAbsoluteCorpusPath(newPath, doc);
        if (newPath.startsWith(ns + ":")) {
          newPath = newPath.substring(ns.length() + 1);
        }
        // ask the adapter to make it happen
        try {
          adapter.writeAsync(newPath, JMapper.WRITER.writeValueAsString(persistedDoc)).join();

          doc.setFileSystemModifiedTime(adapter.computeLastModifiedTimeAsync(newPath).join());

          if (options.isTopLevelDocument()) {
            this.corpus.getStorage().saveAdapterConfigAsync("/config.json", adapter).join();
            // The next document won't be top level, so reset the flag.
            options.setTopLevelDocument(false);
          }
        } catch (final Exception e) {
          Logger.error(
              PersistenceLayer.class.getSimpleName(),
              this.ctx,
              Logger.format("Failed to write to the file '{0}' for reason {1}.", newName, e.getLocalizedMessage()),
              "saveDocumentAsAsync"
          );
          return false;
        }

        // if we also want to save referenced docs, then it depends on what kind of thing just got saved
        // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
        // definition will save imports, manifests will save imports, schemas, sub manifests
        if (saveReferenced && persistenceType.equals(cdmFolder)) {
          if (!doc.saveLinkedDocumentsAsync(options).join()) {
            Logger.error(
                PersistenceLayer.class.getSimpleName(),
                this.ctx,
                Logger.format("Failed to save linked documents for file '{0}'", newName),
                "saveDocumentAsAsync"
            );
            return false;
          }
        }
      }
      return true;
    });
  }

  CompletableFuture<Void> saveOdiDocumentsAsync(Object doc, StorageAdapter adapter, String newName) {
    return CompletableFuture.runAsync(() -> {
      if (doc == null) {
        throw new IllegalArgumentException("Document is null");
      }
      
      String oldDocumentPath = null;
      try {
        // Ask the adapter to make it happen
        Class odiDocumentClass = Class.forName("com.microsoft.commondatamodel.objectmodel.persistence.odi.types.Document");
        oldDocumentPath = (String) odiDocumentClass.getMethod("getDocumentPath").invoke(doc);
        String newDocumentPath = oldDocumentPath.substring(0, oldDocumentPath.length() - CdmConstants.ODI_EXTENSION.length()) + newName;
        // Remove namespace from path
        final Pair<String, String> pathTuple = StorageUtils.splitNamespacePath(newDocumentPath);
        if (pathTuple == null) {
          Logger.error(PersistenceLayer.class.getSimpleName(), this.ctx, "The object path cannot be null or empty.", "saveOdiDocumentsAsync");
          return;
        }
        adapter.writeAsync(pathTuple.getRight(), JMapper.MAP.writeValueAsString(doc)).join();

        // Save linked documents
        List<Object> linkedDocuments = (List<Object>) odiDocumentClass.getMethod("getLinkedDocuments").invoke(doc);
        if (linkedDocuments != null) {
          linkedDocuments.forEach(linkedDoc -> saveOdiDocumentsAsync(linkedDoc, adapter, newName).join());
        }
      } catch (final Exception e) {
        Logger.error(
            PersistenceLayer.class.getSimpleName(),
            this.ctx,
            Logger.format("Failed to write to the file '{0}' for reason {1}", oldDocumentPath, e.getMessage()),
            "saveOdiDocumentsAsync"
        );
      }
    });
  }

  public void registerFormat(String persistenceClassName) {
    this.registerFormat(persistenceClassName, null);
  }

  public void registerFormat(String persistenceClassName, String assemblyName) {
    try {
      Class persistenceClass = Class.forName(persistenceClassName);

      // Get the file formats that this persistence class supports.
      String[] formats = (String[]) persistenceClass.getField("formats").get(null);
      for (String format : formats) {
        registeredPersistenceFormats.put(format, persistenceClass);
      }
    } catch (final Exception e) {
      Logger.info(
          PersistenceLayer.class.getSimpleName(),
          this.ctx,
          Logger.format("Unable to register persistence class {0}. Reason: {1}.", persistenceClassName, e.getLocalizedMessage()),
          "registerFormat"
      );
    }
  }

  private Class fetchRegisteredPersistenceFormat(String docName) {
    // sort keys so that longest file extension is tested first
    // i.e. .manifest.cdm.json is checked before .cdm.json
    final SortedSet<String> sortedKeys = new TreeSet<>(new Comparator<String>() {
      @Override
      public int compare(String a, String b) {
        if (a.length() > b.length()) {
          return -1;
        } else {
          return 1;
        }
      }
    });
    sortedKeys.addAll(registeredPersistenceFormats.keySet());

    for (String key : sortedKeys) {
      final Class registeredPersistenceFormat = registeredPersistenceFormats.get(key);
      // Find the persistence class to use for this document.
      if (registeredPersistenceFormat != null && StringUtils.endsWithIgnoreCase(docName, key)) {
        return registeredPersistenceFormat;
      }
    }
    return null;
  }
}
