// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmContainerDefinition,
    CdmDocumentDefinition,
    cdmLogCode,
    CdmFolderDefinition,
    Logger,
    StorageAdapter,
    resolveOptions
} from '../internal';
import { StorageUtils } from '../Utilities/StorageUtils';

import { ConcurrentSemaphore } from '../Utilities/Concurrent/concurrentSemaphore';

/**
 * @internal
 * Synchronizes all dictionaries relating to the documents (and their statuses) in the corpus.
 */
export class DocumentLibrary {
    private allDocuments: [CdmFolderDefinition, CdmDocumentDefinition][];
    private corpus: CdmCorpusDefinition;
    private docsCurrentlyIndexing: Set<CdmDocumentDefinition>;
    private docsCurrentlyLoading: Set<string>;
    private docsNotFound: Set<string>;
    private pathLookup: Map<string, [CdmFolderDefinition, CdmDocumentDefinition]>;
    
    private readonly TAG: string = DocumentLibrary.name;

    /**
     * @internal
     */
    public concurrentReadLock: ConcurrentSemaphore;


    constructor(corpus: CdmCorpusDefinition) {
        this.allDocuments = [];
        this.concurrentReadLock = new ConcurrentSemaphore();
        this.corpus = corpus;
        this.docsCurrentlyIndexing = new Set<CdmDocumentDefinition>();
        this.docsCurrentlyLoading = new Set<string>();
        this.docsNotFound = new Set<string>();
        this.pathLookup = new Map<string, [CdmFolderDefinition, CdmDocumentDefinition]>();
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
            folder.documentLookup.set(doc.name, doc);
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
    public listDocsNotIndexed(rootDoc: CdmDocumentDefinition, docsLoaded: Set<string>): Set<CdmDocumentDefinition> {
        const docsNotIndexed: Set<CdmDocumentDefinition> = new Set();
        // gets all the documents that needs indexing and set the currentlyIndexing flag to true.
        docsLoaded.forEach(docPath => {
            const doc: CdmDocumentDefinition = this.fetchDocument(docPath);
            if (!doc) {
                return;
            }

            // The root document that started this indexing process is already masked for indexing, don't mark it again.
            if (doc != rootDoc) {
                if (this.markDocumentForIndexing(doc)) {
                    docsNotIndexed.add(doc);
                }
            } else {
                docsNotIndexed.add(doc);
            }
        });
        return docsNotIndexed;
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
     * Fetches a document from the path lookup.
     * @param path The document path.
     */
    public fetchDocument(path: string): CdmDocumentDefinition {
        if (!this.docsNotFound.has(path)) {
            const lookup: [CdmFolderDefinition, CdmDocumentDefinition] = this.pathLookup.get(path);
            if (lookup) {
                const currentDoc: CdmDocumentDefinition = lookup[1];
                return currentDoc;
            }
        }
        return null;
    }

    /**
     * @internal
     *
     * Sets a document's status to loading if the document needs to be loaded.
     * @param docPath The document path.
     */
    public needToLoadDocument(docPath: string, docsLoading: Set<string>): boolean {
        const doc: CdmDocumentDefinition = this.pathLookup.has(docPath) ? this.pathLookup.get(docPath)[1] : undefined;

        // first check if the document was not found or is currently loading.
        // if the document was loaded previously, check if its imports were not indexed and it's not being indexed currently.
        const needToLoad: boolean = !this.docsNotFound.has(docPath) && !docsLoading.has(docPath) && (!doc || (!doc.importsIndexed && !doc.currentlyIndexing));

        if (needToLoad) {
            docsLoading.add(docPath);
        }

        return needToLoad;
    }

    /**
     * @internal
     *
     * Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it failed to load.
     * @param doc The document that was loaded.
     * @param docPath The document path.
     * @param docsNowLoaded The dictionary of documents that are now loaded.
     */
    public markAsLoadedOrFailed(docPath: string, doc: CdmContainerDefinition): void {
        // Doc is no longer loading.
        this.docsCurrentlyLoading.delete(docPath);

        if (!doc) {
            // The doc failed to load, so set doc as not found.
            this.docsNotFound.add(docPath);
        }
    }

    /**
     * @internal
     *
     * Removes a document from the list of documents that are not indexed to mark it as indexed.
     * @param doc The document.
     */
    public markDocumentAsIndexed(doc: CdmDocumentDefinition) {
        doc.currentlyIndexing = false;
        this.docsCurrentlyIndexing.delete(doc);
    }

    /**
     * @internal
     *
     * Adds a document to the list of documents that are not indexed to mark it for indexing.
     * @param doc The document.
     */
    public markDocumentForIndexing(doc: CdmDocumentDefinition): boolean {
        if (doc.needsIndexing && !doc.currentlyIndexing) {
            // If the document was not indexed before and it's not currently being indexed.
            this.docsCurrentlyIndexing.add(doc);
            doc.currentlyIndexing = true;
        }

        return doc.needsIndexing;
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

    /**
     * @internal
     */
     public async loadFolderOrDocument(objectPath: string, forceReload: boolean = false, resOpt: resolveOptions = null): Promise<CdmContainerDefinition> {
        // If the document is already loaded and the user do not want to force a reload, return the document previously loaded.
        if (!forceReload && this.pathLookup.has(objectPath)) {
            const doc: CdmContainerDefinition = this.pathLookup.get(objectPath)[1];
            return doc;
        }

        // Mark as loading.
        this.docsCurrentlyLoading.add(objectPath);

        // The document needs to be loaded. Create a task to load it and add to the list of documents currently loading.
        var task = async () =>
        {
            var result = await this._loadFolderOrDocument(objectPath, forceReload, resOpt);
            this.markAsLoadedOrFailed(objectPath, result);
            return result;
        };

        return await task();
     }

    /**
     * @internal
     */
     private async _loadFolderOrDocument(objectPath: string, forceReload: boolean = false, resOpt: resolveOptions = null): Promise<CdmContainerDefinition> {
        // let bodyCode = () =>
        {
            if (!objectPath) {
                return undefined;
            }

            // first check for namespace
            const pathTuple: [string, string] = StorageUtils.splitNamespacePath(objectPath);
            if (!pathTuple) {
                Logger.error(this.corpus.ctx, this.TAG, this.loadFolderOrDocument.name, objectPath, cdmLogCode.ErrPathNullObjectPath);

                return undefined;
            }

            const namespace: string = pathTuple[0] || this.corpus.storage.defaultNamespace;
            objectPath = pathTuple[1];

            if (!objectPath.startsWith('/')) {
                return undefined;
            }

            const namespaceFolder: CdmFolderDefinition = this.corpus.storage.fetchRootFolder(namespace);
            const namespaceAdapter: StorageAdapter = this.corpus.storage.fetchAdapter(namespace);
            if (!namespaceFolder || !namespaceAdapter) {
                Logger.error(this.corpus.ctx, this.TAG, this.loadFolderOrDocument.name, objectPath, cdmLogCode.ErrStorageNamespaceNotRegistered, namespace, objectPath);

                return;
            }
            const lastFolder: CdmFolderDefinition = namespaceFolder.fetchChildFolderFromPath(objectPath, false);

            // don't create new folders, just go as far as possible
            if (!lastFolder) {
                return undefined;
            }

            // maybe the search is for a folder?
            const lastPath: string = lastFolder.folderPath;
            if (lastPath === objectPath) {
                return lastFolder;
            }

            // remove path to folder and then look in the folder
            objectPath = objectPath.slice(lastPath.length);

            return lastFolder.fetchDocumentFromFolderPathAsync(objectPath, forceReload, resOpt);
        }
        // return p.measure(bodyCode);
    }
}