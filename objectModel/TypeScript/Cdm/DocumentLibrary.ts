// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmDocumentDefinition,
    CdmFolderDefinition
} from '../internal';

import { ConcurrentSemaphore } from '../Utilities/Concurrent/concurrentSemaphore';

/**
 * @internal
 * Synchronizes all dictionaries relating to the documents (and their statuses) in the corpus.
 */
export class DocumentLibrary {
    /**
     * @internal
     */
    public docsNotLoaded: Set<string>;
    /**
     * @internal
     */
    public docsCurrentlyLoading: Set<string>;
    /**
     * @internal
     */
    public docsNotIndexed: Set<CdmDocumentDefinition>;
    /**
     * @internal
     */
    public docsNotFound: Set<string>;
    /**
     * @internal
     */
    public allDocuments: [CdmFolderDefinition, CdmDocumentDefinition][];
    /**
     * @internal
     */
    public pathLookup: Map<string, [CdmFolderDefinition, CdmDocumentDefinition]>;
    /**
     * @internal
     */
    public concurrentReadLock: ConcurrentSemaphore;

    constructor() {
        this.allDocuments = [];
        this.pathLookup = new Map<string, [CdmFolderDefinition, CdmDocumentDefinition]>();
        this.docsNotLoaded = new Set<string>();
        this.docsCurrentlyLoading = new Set<string>();
        this.docsNotFound = new Set<string>();
        this.docsNotIndexed = new Set<CdmDocumentDefinition>();
        this.concurrentReadLock = new ConcurrentSemaphore();
    }

    /**
     * @internal
     *
     * Adds a folder and document to the list of all documents in the corpus. Also adds the document path to the path lookup.
     * @param path The document path.
     * @param folder The folder.
     * @param doc The document
     */
    public addDocumentPath(path: string, folder: CdmFolderDefinition, doc: CdmDocumentDefinition) {
        if (!this.pathLookup.has(path)) {
            this.allDocuments.push([folder, doc]);
            this.pathLookup.set(path, [folder, doc]);
        }
    }

    /**
     * @internal
     *
     * Removes a folder and document from the list of all documents in the corpus. Also removes the document path from the path lookup.
     * @param path The document path.
     * @param folder The folder.
     * @param doc The document.
     */
    public removeDocumentPath(path: string, folder: CdmFolderDefinition, doc: CdmDocumentDefinition) {
        if (this.pathLookup.has(path)) {
            this.pathLookup.delete(path);
            const index: number = this.allDocuments.indexOf([folder, doc]);
            this.allDocuments.splice(index, 1);
        }
    }

    /**
     * @internal
     *
     * Returns a list of all the documents that are not loaded.
     */
    public listDocsNotIndexed(): Set<CdmDocumentDefinition> {
        const docsNotIndexed: Set<CdmDocumentDefinition> = new Set();
        // gets all the documents that needs indexing and set the currentlyIndexing flag to true.
        this.docsNotIndexed.forEach(doc => {
            doc.currentlyIndexing = true;
            docsNotIndexed.add(doc);
        });
        return docsNotIndexed;
    }

    /**
     * @internal
     *
     * Returns a list of all the documents that are not loaded.
     */
    public listDocsNotLoaded(): Set<string> {
        return this.docsNotLoaded;
    }

    /**
     * @internal
     *
     * Returns a list of all the documents in the corpus.
     */
    public listAllDocuments(): Set<CdmDocumentDefinition> {
        const list: Set<CdmDocumentDefinition> = new Set<CdmDocumentDefinition>();
        this.allDocuments.forEach((fd) => {
            list.add(fd[1]);
        });
        return list;
    }

    /**
     * @internal
     *
     * Adds a document to the list of documents that are not loaded if its path does not exist in the path lookup.
     * @param path The document path.
     */
    public addToDocsNotLoaded(path: string) {
        if (!this.docsNotFound.has(path)) {
            const lookup: [CdmFolderDefinition, CdmDocumentDefinition] = this.pathLookup.get(path.toLowerCase());
            // If the imports were not indexed yet there might be documents imported that weren't loaded.
            if (!lookup || (!lookup[1].importsIndexed && !lookup[1].currentlyIndexing)) {
                this.docsNotLoaded.add(path);
            }
        }
    }

    /**
     * @internal
     * Fetches a document from the path lookup.
     * @param path The document path.
     */
    public fetchDocument(path: string): CdmDocumentDefinition {
        if (!this.docsNotFound.has(path)) {
            const lookup: [CdmFolderDefinition, CdmDocumentDefinition] = this.pathLookup.get(path.toLowerCase());
            if (lookup) {
                const currentDoc: CdmDocumentDefinition = lookup['1'];
                return currentDoc;
            }
        }
        return null;
    }

    /**
     * @internal
     *
     * Sets a document's status to loading if the document needs to be loaded.
     * @param docName The document name.
     */
    public needToLoadDocument(docName: string, docsNowLoaded: Set<CdmDocumentDefinition>): boolean {
        let needToLoad: boolean = false;
        let doc: CdmDocumentDefinition;

        if (this.docsNotLoaded.has(docName) && !this.docsNotFound.has(docName) && !this.docsCurrentlyLoading.has(docName)) {
            // Set status to loading.
            this.docsNotLoaded.delete(docName);

            // The document was loaded already, skip it.
            if (this.pathLookup.has(docName.toLowerCase())) {
                const lookup: [CdmFolderDefinition, CdmDocumentDefinition] =
                    this.pathLookup.get(docName.toLowerCase());
                doc = lookup['1'];
            } else {
                this.docsCurrentlyLoading.add(docName);
                needToLoad = true;
            }
        }

        if (doc) {
            this.markDocumentAsLoadedOrFailed(doc, docName, docsNowLoaded);
        }

        return needToLoad;
    }

    /**
     * @internal
     *
     * Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it failed to load.
     * @param doc The document that was loaded.
     * @param docName The document name.
     * @param docsNowLoaded The dictionary of documents that are now loaded.
     */
    public markDocumentAsLoadedOrFailed(doc: CdmDocumentDefinition, docName: string, docsNowLoaded: Set<CdmDocumentDefinition>): boolean {
        // Doc is no longer loading.
        this.docsCurrentlyLoading.delete(docName);

        if (doc) {
            // Doc is now loaded.
            docsNowLoaded.add(doc);
            // Doc needs to be indexed.
            this.docsNotIndexed.add(doc);
            doc.currentlyIndexing = true;

            return true;
        } else {
            // The doc failed to load, so set doc as not found.
            this.docsNotFound.add(docName);

            return false;
        }
    }

    /**
     * @internal
     *
     * Removes a document from the list of documents that are not indexed to mark it as indexed.
     * @param doc The document.
     */
    public markDocumentAsIndexed(doc: CdmDocumentDefinition) {
        this.docsNotIndexed.delete(doc);
    }

    /**
     * @internal
     *
     * Adds a document to the list of documents that are not indexed to mark it for indexing.
     * @param doc The document.
     */
    public markDocumentForIndexing(doc: CdmDocumentDefinition) {
        this.docsNotIndexed.add(doc);
    }

    /**
     * @internal
     *
     * Whether a specific pair of folder-document exists in the list of all documents in the corpus.
     * @param fd The folder-document pair.
     */
    public contains(fd: [CdmFolderDefinition, CdmDocumentDefinition]): boolean {
        for (let i = 0; i < this.allDocuments.length; i++) {
            if (this.allDocuments[i][0] === fd[0] && this.allDocuments[i][1] === fd[1]) {
                return true;
            }
        }
        return false;
    }
}