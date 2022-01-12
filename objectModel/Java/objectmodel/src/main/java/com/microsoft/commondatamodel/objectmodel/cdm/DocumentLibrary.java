// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StorageUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.concurrent.ConcurrentSemaphore;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Synchronizes all dictionaries relating to the documents (and their statuses) in the corpus.
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class DocumentLibrary {
    private static String TAG = DocumentLibrary.class.getSimpleName();

    List<Pair<CdmFolderDefinition, CdmDocumentDefinition>> allDocuments;
    public ConcurrentSemaphore concurrentReadLock;
    CdmCorpusDefinition corpus;
    Set<String> docsCurrentlyLoading;
    Set<CdmDocumentDefinition> docsCurrentlyIndexing;
    Set<String> docsNotFound;
    Lock documentLibraryLock;
    Map<String, Pair<CdmFolderDefinition, CdmDocumentDefinition>> pathLookup;

    DocumentLibrary(CdmCorpusDefinition corpus) {
        this.allDocuments = new ArrayList<>();
        this.concurrentReadLock = new ConcurrentSemaphore();
        this.corpus = corpus;
        this.docsCurrentlyLoading = new HashSet<>();
        this.docsCurrentlyIndexing = new HashSet<>();
        this.docsNotFound = new HashSet<>();
        this.documentLibraryLock = new ReentrantLock();
        this.pathLookup = new LinkedHashMap<>();
    }

    /**
     * Adds a folder and document from the list of all documents in the corpus. Also adds the document path to the path
     * lookup.
     * @param path The document path.
     * @param folder The folder.
     * @param doc The document.
     */
    void addDocumentPath(String path, CdmFolderDefinition folder, CdmDocumentDefinition doc) {
        this.documentLibraryLock.lock();

        if (!this.pathLookup.containsKey(path)) {
            this.allDocuments.add(new ImmutablePair<>(folder, doc));
            this.pathLookup.put(path, new ImmutablePair<>(folder, doc));
            folder.getDocumentLookup().put(doc.getName(), doc);
        }

        this.documentLibraryLock.unlock();
    }

    /**
     * Removes a folder and document from the list of all documents in the corpus. Also removes the document path from
     * the path lookup.
     * @param path The document path.
     * @param folder The folder.
     * @param doc The document.
     */
    void removeDocumentPath(String path, CdmFolderDefinition folder, CdmDocumentDefinition doc) {
        this.documentLibraryLock.lock();

        if (this.pathLookup.containsKey(path)) {
            this.pathLookup.remove(path);
            final int index = this.allDocuments.indexOf(ImmutablePair.of(folder, doc));
            this.allDocuments.remove(index);
        }

        this.documentLibraryLock.unlock();
    }

    /**
     * Returns a list of all the documents that are not indexed.
     */
    List<CdmDocumentDefinition> listDocsNotIndexed(CdmDocumentDefinition rootDoc, Set<String> docsLoaded) {
        this.documentLibraryLock.lock();

        List<CdmDocumentDefinition> docsNotIndexed = new ArrayList<>();
        // gets all the documents that needs indexing and set the currentlyIndexing flag to true.
        for (String docPath : docsLoaded) {
            CdmDocumentDefinition doc = this.fetchDocument(docPath);
            if (doc == null) {
                continue;
            }

            // The root document that started this indexing process is already masked for indexing, don't mark it again.
            if (doc != rootDoc) {
                if (this.markDocumentForIndexing(doc)) {
                    docsNotIndexed.add(doc);
                }
            } else {
                docsNotIndexed.add(rootDoc);
            }
        }

        this.documentLibraryLock.unlock();
        return docsNotIndexed;
    }

    /**
     * Returns a list of all the documents in the corpus.
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     * @return List of CdmDocumentDefinition
     */
    @Deprecated
    public List<CdmDocumentDefinition> listAllDocuments() {
        this.documentLibraryLock.lock();

        List<CdmDocumentDefinition> list = new ArrayList<>();
        for (Pair<CdmFolderDefinition, CdmDocumentDefinition> pair : this.allDocuments) {
            list.add(pair.getRight());
        }

        this.documentLibraryLock.unlock();
        return list;
    }

    /**
     * Fetches a document from the path lookup.
     * @param path The document path.
     * @return The document with the given path.
     */
    CdmDocumentDefinition fetchDocument(String path) {
        this.documentLibraryLock.lock();

        CdmDocumentDefinition doc = null;
        if (!this.docsNotFound.contains(path)) {
            final Pair<CdmFolderDefinition, CdmDocumentDefinition> lookup = this.pathLookup.get(path);

            if (lookup != null) {
                doc = lookup.getRight();
            }
        }

        this.documentLibraryLock.unlock();
        return doc;
    }

    /**
     * Sets a document's status to loading if the document needs to be loaded.
     * @param docPath The document name.
     * @return Whether a document needs to be loaded.
     */
    boolean needToLoadDocument(String docPath, Set<String> docsLoaded) {
        this.documentLibraryLock.lock();

        CdmDocumentDefinition document = this.pathLookup.containsKey(docPath) ? this.pathLookup.get(docPath).getValue() : null;

        // first check if the document was not found or is currently loading.
        // if the document was loaded previously, check if its imports were not indexed and it's not being indexed currently.
        boolean needToLoad = !this.docsNotFound.contains(docPath) && !docsLoaded.contains(docPath)
                && (document == null || (!document.isImportsIndexed() && !document.isCurrentlyIndexing()));

        if (needToLoad) {
            docsLoaded.add(docPath);
        }

        this.documentLibraryLock.unlock();

        return needToLoad;
    }

    /**
     * Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it
     * failed to load.
     * @param docPath The document name.
     * @param doc The document that was loaded.
     * @return Returns true if the document has loaded, false if it failed to load.
     */
    void markAsLoadedOrFailed(String docPath, CdmContainerDefinition doc) {
        this.documentLibraryLock.lock();

        // Doc is no longer loading.
        this.docsCurrentlyLoading.remove(docPath);

        if (doc == null) {
            // The doc failed to load, so set doc as not found.
            this.docsNotFound.add(docPath);
        }

        this.documentLibraryLock.unlock();
    }

    /**
     * Removes a document from the list of documents that are not indexed to mark it as indexed.
     * @param doc
     */
    void markDocumentAsIndexed(CdmDocumentDefinition doc) {
        this.documentLibraryLock.lock();
        doc.setCurrentlyIndexing(false);
        this.docsCurrentlyIndexing.remove(doc);
        this.documentLibraryLock.unlock();
    }

    /**
     * Adds a document to the list of documents that are not indexed to mark it for indexing.
     * @param doc The document.
     */
    boolean markDocumentForIndexing(CdmDocumentDefinition doc) {
        this.documentLibraryLock.lock();

        if (doc.getNeedsIndexing() && !doc.isCurrentlyIndexing()) {
            // If the document was not indexed before and it's not currently being indexed.
            this.docsCurrentlyIndexing.add(doc);
            doc.setCurrentlyIndexing(true);
        }

        this.documentLibraryLock.unlock();

        return doc.getNeedsIndexing();
    }

    /**
     * Whether a specific pair of folder-document exists in the list of all documents in the corpus.
     * @param fd The folder-document pair.
     * @return boolean
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean contains(Pair<CdmFolderDefinition, CdmDocumentDefinition> fd) {
        return this.allDocuments.contains(fd);
    }

    CompletableFuture<? extends CdmContainerDefinition> loadFolderOrDocumentAsync(final String objectPath) {
        return loadFolderOrDocumentAsync(objectPath, false);
    }

    CompletableFuture<? extends CdmContainerDefinition> loadFolderOrDocumentAsync(String objectPath,
                                                                                          final boolean forceReload) {
        return loadFolderOrDocumentAsync(objectPath, forceReload, null);
    }

    CompletableFuture<? extends CdmContainerDefinition> loadFolderOrDocumentAsync(String objectPath,
                                                                                  final boolean forceReload,
                                                                                  final ResolveOptions resOpt) {
        this.documentLibraryLock.lock();

        // If the document is already loaded and the user do not want to force a reload, return the document previously loaded.
        if (!forceReload && this.pathLookup.containsKey(objectPath))
        {
            CdmContainerDefinition doc = this.pathLookup.get(objectPath).getRight();
            this.documentLibraryLock.unlock();
            return CompletableFuture.completedFuture(doc);
        }

        // Mark as loading.
        this.docsCurrentlyLoading.add(objectPath);

        this.documentLibraryLock.unlock();

        // The document needs to be loaded. Create a task to load it and add to the list of documents currently loading.
        return CompletableFuture.supplyAsync(() -> {
            CdmContainerDefinition result = this._loadFolderOrDocumentAsync(objectPath, forceReload, resOpt);
            this.markAsLoadedOrFailed(objectPath, result);
            return result;
        });
    }

    private CdmContainerDefinition _loadFolderOrDocumentAsync(String objectPath,
                                                                                          final boolean forceReload,
                                                                                          final ResolveOptions resOpt) {
        if (StringUtils.isNullOrTrimEmpty(objectPath)) {
            return null;
        }
        // first check for namespace
        final Map.Entry<String, String> pathTuple = StorageUtils.splitNamespacePath(objectPath);
        if (pathTuple == null) {
            Logger.error(this.corpus.getCtx(), TAG, "loadFolderOrDocumentAsync", objectPath, CdmLogCode.ErrPathNullObjectPath);
            return null;
        }
        final String nameSpace = !StringUtils.isNullOrTrimEmpty(pathTuple.getKey()) ? pathTuple.getKey()
                : this.corpus.getStorage().getDefaultNamespace();
        objectPath = pathTuple.getValue();

        if (objectPath.startsWith("/")) {
            final CdmFolderDefinition namespaceFolder = this.corpus.getStorage().fetchRootFolder(nameSpace);
            final StorageAdapterBase namespaceAdapter = this.corpus.getStorage().fetchAdapter(nameSpace);

            if (namespaceFolder == null || namespaceAdapter == null) {
                Logger.error(this.corpus.getCtx(), TAG, "loadFolderOrDocumentAsync", objectPath, CdmLogCode.ErrStorageNamespaceNotRegistered, nameSpace);
                return null;
            }

            final CdmFolderDefinition lastFolder = namespaceFolder
                    .fetchChildFolderFromPath(objectPath, false);

            // don't create new folders, just go as far as possible
            if (lastFolder != null) {
                // maybe the search is for a folder?
                final String lastPath = lastFolder.getFolderPath();
                if (lastPath.equals(objectPath)) {
                    return lastFolder;
                }

                // remove path to folder and then look in the folder
                final String newObjectPath = StringUtils.slice(objectPath, lastPath.length());

                this.concurrentReadLock.acquire().join();

                // // During this step the document will be added to the pathLookup when it is added to a folder.
                CdmDocumentDefinition doc = lastFolder.fetchDocumentFromFolderPathAsync(newObjectPath, forceReload, resOpt).join();

                this.concurrentReadLock.release();

                return doc;
            }
        }

        return null;
    }
}
