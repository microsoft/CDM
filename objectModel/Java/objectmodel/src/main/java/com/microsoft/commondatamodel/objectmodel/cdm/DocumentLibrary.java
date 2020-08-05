// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
    List<Pair<CdmFolderDefinition, CdmDocumentDefinition>> allDocuments;
    Map<String, Pair<CdmFolderDefinition, CdmDocumentDefinition>> pathLookup;
    Map<String, Short> docsNotLoaded;
    Map<String, Short> docsCurrentlyLoading;
    Map<CdmDocumentDefinition, Short> docsNotIndexed;
    Map<String, Short> docsNotFound;
    Lock documentLibraryLock;

    DocumentLibrary() {
        this.allDocuments = new ArrayList<>();
        this.pathLookup = new LinkedHashMap<>();
        this.docsNotLoaded = new LinkedHashMap<>();
        this.docsCurrentlyLoading = new LinkedHashMap<>();
        this.docsNotFound = new LinkedHashMap<>();
        this.docsNotIndexed = new LinkedHashMap<>();
        this.documentLibraryLock = new ReentrantLock();
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
     * Returns a list of all the documents that are not loaded.
     */
    List<String> listDocsNotLoaded() {
        this.documentLibraryLock.lock();

        List<String> list = new ArrayList<>();
        for (Map.Entry<String, Short> entry : this.docsNotLoaded.entrySet()) {
            list.add(entry.getKey());
        }

        this.documentLibraryLock.unlock();
        return list;
    }

    /**
     * Returns a list of all the documents that are not indexed.
     */
    List<CdmDocumentDefinition> listDocsNotIndexed() {
        this.documentLibraryLock.lock();

        List<CdmDocumentDefinition> list = new ArrayList<>();
        for (Map.Entry<CdmDocumentDefinition, Short> entry : this.docsNotIndexed.entrySet()) {
            list.add(entry.getKey());
        }

        this.documentLibraryLock.unlock();
        return list;
    }

    /**
     * Returns a list of all the documents in the corpus.
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
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
     * Adds a document to the list of documents that are not loaded if its path does not exist in the path lookup.
     * @param path The document path.
     */
    void addToDocsNotLoaded(String path) {
        this.documentLibraryLock.lock();

        if (!this.docsNotFound.containsKey(path)) {
            Pair<CdmFolderDefinition, CdmDocumentDefinition> lookup = this.pathLookup.get(path.toLowerCase());
            if (lookup == null) {
                this.docsNotLoaded.put(path, (short) 1);
            }
        }

        this.documentLibraryLock.unlock();
    }

    /**
     * Fetches a document from the path lookup and adds it to the list of documents that are not indexed.
     * @param path The document path.
     * @return The document with the given path.
     */
    CdmDocumentDefinition fetchDocumentAndMarkForIndexing(String path) {
        this.documentLibraryLock.lock();

        CdmDocumentDefinition doc = null;
        if (!this.docsNotFound.containsKey(path)) {
            final Pair<CdmFolderDefinition, CdmDocumentDefinition> lookup = this.pathLookup.get(path.toLowerCase());

            if (lookup != null) {
                if (!lookup.getRight().isImportsIndexed() && !lookup.getRight().isCurrentlyIndexing()) {
                    // Mark for indexing.
                    lookup.getRight().setCurrentlyIndexing(true);
                    this.docsNotIndexed.put(lookup.getRight(), (short) 1);
                }
                doc = lookup.getRight();
            }
        }

        this.documentLibraryLock.unlock();
        return doc;
    }

    /**
     * Sets a document's status to loading if the document needs to be loaded.
     * @param docName The document name.
     * @return Whether a document needs to be loaded.
     */
    boolean needToLoadDocument(String docName) {
        this.documentLibraryLock.lock();

        boolean needToLoad = false;
        if (this.docsNotLoaded.containsKey(docName) && !this.docsNotFound.containsKey(docName) && !this.docsCurrentlyLoading.containsKey(docName)) {
            // Set status to loading.
            this.docsNotLoaded.remove(docName);
            this.docsCurrentlyLoading.put(docName, (short) 1);
            needToLoad = true;
        }

        this.documentLibraryLock.unlock();
        return needToLoad;
    }

    /**
     * Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it
     * failed to load.
     * @param doc The document that was loaded.
     * @param docName The document name.
     * @param docsNowLoaded The dictionary of documents that are now loaded.
     * @return Returns true if the document has loaded, false if it failed to load.
     */
    boolean markDocumentAsLoadedOrFailed(CdmDocumentDefinition doc, String docName, Map<CdmDocumentDefinition, Short> docsNowLoaded) {
        this.documentLibraryLock.lock();

        boolean hasLoaded = false;
        // Doc is no longer loading.
        this.docsCurrentlyLoading.remove(docName);

        if (doc != null) {
            // Doc is now loaded.
            docsNowLoaded.put(doc, (short) 1);
            // Doc needs to be indexed.
            this.docsNotIndexed.put(doc, (short) 1);
            doc.setCurrentlyIndexing(true);
            hasLoaded = true;
        } else {
            // The doc failed to load, so set doc as not found.
            this.docsNotFound.put(docName, (short) 1);
        }

        this.documentLibraryLock.unlock();
        return hasLoaded;
    }

    /**
     * Removes a document from the list of documents that are not indexed to mark it as indexed.
     * @param doc
     */
    void markDocumentAsIndexed(CdmDocumentDefinition doc) {
        this.documentLibraryLock.lock();
        this.docsNotIndexed.remove(doc);
        this.documentLibraryLock.unlock();
    }

    /**
     * Adds a document to the list of documents that are not indexed to mark it for indexing.
     * @param doc The document.
     */
    void markDocumentForIndexing(CdmDocumentDefinition doc) {
        this.documentLibraryLock.lock();
        this.docsNotIndexed.put(doc, (short) 1);
        this.documentLibraryLock.unlock();
    }

    /**
     * Whether a specific pair of folder-document exists in the list of all documents in the corpus.
     * @param fd The folder-document pair.
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean contains(Pair<CdmFolderDefinition, CdmDocumentDefinition> fd) {
        return this.allDocuments.contains(fd);
    }
}
