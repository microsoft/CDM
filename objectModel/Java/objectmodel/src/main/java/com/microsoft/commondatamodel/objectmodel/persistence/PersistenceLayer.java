// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.CdmFolderType;
import com.microsoft.commondatamodel.objectmodel.persistence.common.PersistenceType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ModelJsonType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang3.StringUtils;

// TODO-BQ: This class will need a revisit, it is dealing with way too much reflection.
public class PersistenceLayer {
  private static final String TAG = PersistenceLayer.class.getSimpleName();

  final CdmCorpusDefinition corpus;
  final CdmCorpusContext ctx;

    public static final String folioExtension = ".folio.cdm.json";
    public static final String manifestExtension = ".manifest.cdm.json";
    public static final String cdmExtension = ".cdm.json";
    public static final String modelJsonExtension = "model.json";
    public static final String cdmFolder = "CdmFolder";
    public static final String modelJson = "ModelJson";

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
     * @param folder       folder
     * @param docName      document name
     * @param docContainer Doc container
     * @return CompletableFuture of CdmDocumentDefinition
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CompletableFuture<CdmDocumentDefinition> loadDocumentFromPathAsync(
            final CdmFolderDefinition folder,
            final String docName,
            final CdmDocumentDefinition docContainer) {
        return loadDocumentFromPathAsync(folder, docName, docContainer, null);
    }


    /**
     * @param folder       folder
     * @param docName      document name
     * @param docContainer Doc container
     * @param resOpt       Resolve options
     * @return CompletableFuture of CdmDocumentDefinition
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
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
            final StorageAdapterBase adapter = this.corpus.getStorage().fetchAdapter(folder.getNamespace());
            try {
                if (adapter.canRead()) {
                    // log message used by navigator, do not change or remove
                    Logger.debug(this.ctx, TAG, "loadDocumentFromPathAsync", docPath, Logger.format("request file: {0}", docPath));
                    jsonData = adapter.readAsync(docPath).get();
                    // log message used by navigator, do not change or remove
                    Logger.debug(this.ctx, TAG, "loadDocumentFromPathAsync", docPath, Logger.format("received file: {0}", docPath));
                } else {
                    throw new Exception("Storage Adapter is not enabled to read.");
                }
            } catch (final Exception e) {
                // log message used by navigator, do not change or remove
                Logger.debug(this.ctx, TAG, "loadDocumentFromPathAsync", docPath, Logger.format("fail file: {0}", docPath));

                // When shallow validation is enabled, log messages about being unable to find referenced documents as warnings instead of errors.
                if (resOpt != null && resOpt.getShallowValidation()) {
                    Logger.warning(this.ctx, TAG, "loadDocumentFromPathAsync", docPath, CdmLogCode.WarnPersistFileReadFailure, docPath, folder.getNamespace(), e.getLocalizedMessage());
                } else {
                    Logger.error(ctx, TAG, "loadDocumentFromPathAsync", docPath, CdmLogCode.ErrPersistFileReadFailure, docPath, folder.getNamespace(), e.getLocalizedMessage());
                }
                return null;
            }

            try {
                fsModifiedTime = adapter.computeLastModifiedTimeAsync(docPath).join();
            } catch (final Exception e) {
                Logger.error(ctx, TAG, "loadDocumentFromPathAsync", docPath, CdmLogCode.WarnPersistFileModTimeFailure, e.getMessage());
            }

            if (StringUtils.isEmpty(docName)) {
                Logger.error(ctx, TAG, "loadDocumentFromPathAsync", docPath, CdmLogCode.ErrPersistNullDocName);
                return null;
            }

            // If loading an model.json file, check that it is named correctly.
            if (StringUtils.endsWithIgnoreCase(docName, CdmConstants.MODEL_JSON_EXTENSION) && !StringUtils.equalsIgnoreCase(docName, CdmConstants.MODEL_JSON_EXTENSION)) {
                Logger.error(ctx, TAG, "loadDocumentFromPathAsync", docPath, CdmLogCode.ErrPersistDocNameLoadFailure, docName, CdmConstants.MODEL_JSON_EXTENSION);
                return null;
            }

            try {
                // Check file extensions, which performs a case-insensitive ordinal string comparison
                if (docName.toLowerCase().endsWith(PersistenceLayer.manifestExtension) || docName.toLowerCase().endsWith(PersistenceLayer.folioExtension)) {
                    docContent = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence.fromData(ctx, docName, jsonData, folder);
                } else if (docName.toLowerCase().endsWith(PersistenceLayer.modelJsonExtension)) {
                    docContent = com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ManifestPersistence.fromData(this.ctx, docName, jsonData, folder).join();
                } else if (docName.toLowerCase().endsWith(PersistenceLayer.cdmExtension)) {
                    docContent = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence.fromData(this.ctx, docName, jsonData, folder);
                } else {
                    // Could not find a registered persistence class to handle this document type.
                    Logger.error(ctx, TAG, "loadDocumentFromPathAsync", docPath, CdmLogCode.ErrPersistClassMissing, docName);
                    return null;
                }
            } catch (final Exception e) {
                String errorMsg = e.getLocalizedMessage();
                if (e.getCause() != null) {
                    errorMsg += " InnerException: " + e.getCause().getLocalizedMessage();
                }
                Logger.error(ctx, TAG, "loadDocumentFromPathAsync", docPath, CdmLogCode.ErrPersistDocConversionFailure,  docName, errorMsg);
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

                CdmDocumentDefinition content = (CdmDocumentDefinition)docContent;
                if (folder.getDocuments().allItems.stream().filter((x) -> x.getId() == content.getId()).findFirst().orElse(null) == null) {
                     folder.getDocuments().add((CdmDocumentDefinition) docContent, docName);
                 }

                docContent.setFileSystemModifiedTime(fsModifiedTime);
                docContent.setDirty(false);
            }

            return docContent;
        });
    }

    /**
     * @param doc     Document
     * @param newName New name
     * @return CompletableFuture
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CompletableFuture<Boolean> saveDocumentAsAsync(final CdmDocumentDefinition doc, final String newName) {
        return saveDocumentAsAsync(doc, newName, false);
    }

    /**
     * @param doc            Document
     * @param newName        New name
     * @param saveReferenced Save referenced
     * @return CompletableFuture
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CompletableFuture<Boolean> saveDocumentAsAsync(final CdmDocumentDefinition doc, final String newName, final boolean saveReferenced) {
        return saveDocumentAsAsync(doc, newName, saveReferenced, null);
    }


    /**
     * @param doc            Document
     * @param newName        New name
     * @param saveReferenced Save referenced
     * @param options        Options
     * @return CompletableFuture
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
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
            final StorageAdapterBase adapter = this.corpus.getStorage().fetchAdapter(ns);

            if (adapter == null) {
                Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistAdapterNotFoundForNamespace, ns);
                return false;
            } else if (!adapter.canWrite()) {
                Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistAdapterWriteFailure, ns);
                return false;
            } else {
                if (StringUtils.isEmpty(newName)) {
                    Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistNullDocName);
                    return false;
                }

                // What kind of document is requested?
                // Check file extensions using a case-insensitive ordinal string comparison.
                final String persistenceType =
                        StringUtils.endsWithIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION)
                                ? modelJson : cdmFolder;

                if (persistenceType == modelJson && !StringUtils.equalsIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION)) {
                    Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistFailure, newName, CdmConstants.MODEL_JSON_EXTENSION);
                    return false;
                }

                // Save the object into a json blob
                final ResolveOptions resOpt = new ResolveOptions(doc);
                final Object persistedDoc;

                try {
                    if (newName.toLowerCase().endsWith(PersistenceLayer.modelJsonExtension) || newName.toLowerCase().endsWith(PersistenceLayer.manifestExtension) || newName.toLowerCase().endsWith(PersistenceLayer.folioExtension)) {
                        if (persistenceType.equals(PersistenceLayer.cdmFolder)) {
                            persistedDoc = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence.toData((CdmManifestDefinition) doc, resOpt, options);
                        } else {
                            if (!newName.toLowerCase().equals(PersistenceLayer.modelJsonExtension)) {
                                Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistFailure,  newName, CdmConstants.MODEL_JSON_EXTENSION);
                                return false;
                            }
                            persistedDoc = com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ManifestPersistence.toData((CdmManifestDefinition) doc, resOpt, options).join();
                        }
                    } else if (newName.toLowerCase().endsWith(PersistenceLayer.cdmExtension)) {
                        persistedDoc = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence.toData(doc, resOpt, options);
                    } else {
                        // Could not find a registered persistence class to handle this document type.
                        Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistClassMissing, newName);
                        return false;
                    }
                } catch (final Exception e) {
                    Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistFilePersistError, newName, e.getLocalizedMessage());
                    return false;
                }


                if (persistedDoc == null) {
                    Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistFilePersistFailed, newName);
                    return false;
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

                    if (!Boolean.FALSE.equals(options.getSaveConfigFile()) && options.isTopLevelDocument()) {
                        this.corpus.getStorage().saveAdapterConfigAsync("/config.json", adapter).join();
                        // The next document won't be top level, so reset the flag.
                        options.setTopLevelDocument(false);
                    }
                } catch (final Exception e) {
                    Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistFileWriteFailure, newName, e.getLocalizedMessage());
                    return false;
                }

                // if we also want to save referenced docs, then it depends on what kind of thing just got saved
                // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
                // definition will save imports, manifests will save imports, schemas, sub manifests
                if (saveReferenced && persistenceType.equals(cdmFolder)) {
                    if (!doc.saveLinkedDocumentsAsync(options).join()) {
                        Logger.error(ctx, TAG, "saveDocumentAsAsync", doc.getAtCorpusPath(), CdmLogCode.ErrPersistSaveLinkedDocs, newName);
                        return false;
                    }
                }
            }
            return true;
        });
    }
}
