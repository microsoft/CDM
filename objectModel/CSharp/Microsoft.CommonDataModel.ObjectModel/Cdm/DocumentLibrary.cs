// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Concurrent;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// Synchronizes all dictionaries relating to the documents (and their statuses) in the corpus.
    /// </summary>
    internal class DocumentLibrary
    {
        private readonly List<Tuple<CdmFolderDefinition, CdmDocumentDefinition>> allDocuments;
        private readonly CdmCorpusDefinition corpus;
        private readonly ISet<CdmDocumentDefinition> docsCurrentlyIndexing;
        private readonly ISet<string> docsCurrentlyLoading;
        private readonly ISet<string> docsNotFound;
        private readonly IDictionary<string, Tuple<CdmFolderDefinition, CdmDocumentDefinition>> pathLookup;

        private readonly string TAG = nameof(DocumentLibrary);

        internal readonly ConcurrentSemaphore concurrentReadLock;

        internal DocumentLibrary(CdmCorpusDefinition corpus)
        {
            this.allDocuments = new List<Tuple<CdmFolderDefinition, CdmDocumentDefinition>>();
            this.concurrentReadLock = new ConcurrentSemaphore();
            this.corpus = corpus;
            this.docsCurrentlyIndexing = new HashSet<CdmDocumentDefinition>();
            this.docsCurrentlyLoading = new HashSet<string>();
            this.docsNotFound = new HashSet<string>();
            this.pathLookup = new Dictionary<string, Tuple<CdmFolderDefinition, CdmDocumentDefinition>>();
        }

        /// <summary>
        /// Adds a folder and document to the list of all documents in the corpus. Also adds the document path to the path lookup.
        /// </summary>
        /// <param name="path">The document path.</param>
        /// <param name="folder">The folder.</param>
        /// <param name="doc">The document.</param>
        internal void AddDocumentPath(string path, CdmFolderDefinition folder, CdmDocumentDefinition doc)
        {
            lock (this.allDocuments)
            {
                if (!this.pathLookup.ContainsKey(path))
                {
                    this.allDocuments.Add(Tuple.Create(folder, doc));
                    this.pathLookup.Add(path, Tuple.Create(folder, doc));
                    folder.DocumentLookup.Add(doc.Name, doc);
                }
            }
        }

        /// <summary>
        /// Removes a folder and document from the list of all documents in the corpus. Also removes the document path from the path lookup.
        /// </summary>
        /// <param name="path">The document path.</param>
        /// <param name="folder">The folder.</param>
        /// <param name="doc">The document.</param>
        internal void RemoveDocumentPath(string path, CdmFolderDefinition folder, CdmDocumentDefinition doc)
        {
            lock (this.allDocuments)
            {
                if (this.pathLookup.ContainsKey(path))
                {
                    this.pathLookup.Remove(path);
                    int index = this.allDocuments.IndexOf(Tuple.Create(folder, doc));
                    this.allDocuments.RemoveAt(index);
                }
            }
        }

        /// <summary>
        /// Returns a list of all the documents that are not indexed.
        /// </summary>
        internal List<CdmDocumentDefinition> ListDocsNotIndexed(CdmDocumentDefinition rootDoc, ISet<string> docsLoaded)
        {
            var docsNotIndexed = new List<CdmDocumentDefinition>();
            lock (this.allDocuments)
            {
                // gets all the documents that needs indexing and set the currentlyIndexing flag to true.
                foreach (var docPath in docsLoaded)
                {
                    var doc = this.FetchDocument(docPath);
                    if (doc == null)
                    {
                        continue;
                    }

                    // The root document that started this indexing process is already masked for indexing, don't mark it again.
                    if (doc != rootDoc)
                    {
                        if (this.MarkDocumentForIndexing(doc))
                        {
                            docsNotIndexed.Add(doc);
                        }
                    }
                    else
                    {
                        docsNotIndexed.Add(rootDoc);
                    }
                }
            }
            return docsNotIndexed;
        }

        /// <summary>
        /// Returns a list of all the documents in the corpus.
        /// </summary>
        internal List<CdmDocumentDefinition> ListAllDocuments()
        {
            lock (this.allDocuments)
            {
                List<CdmDocumentDefinition> allDocuments = new List<CdmDocumentDefinition>();
                foreach (Tuple<CdmFolderDefinition, CdmDocumentDefinition> fd in this.allDocuments)
                {
                    allDocuments.Add(fd.Item2);
                }
                return allDocuments;
            }
        }

        /// <summary>
        /// Fetches a document from the path lookup.
        /// </summary>
        /// <param name="path">The document path.</param>
        /// <returns>The document with the given path.</returns>
        internal CdmDocumentDefinition FetchDocument(string path)
        {
            lock (this.allDocuments)
            {
                if (!this.docsNotFound.Contains(path))
                {
                    this.pathLookup.TryGetValue(path, out Tuple<CdmFolderDefinition, CdmDocumentDefinition> lookup);
                    if (lookup != null)
                    {
                        return lookup.Item2;
                    }
                }
                return null;
            }
        }

        /// <summary>
        /// Sets a document's status to loading if the document needs to be loaded.
        /// </summary>
        /// <param name="docPath">The document path.</param>
        /// <returns>Whether a document needs to be loaded.</returns>
        internal bool NeedToLoadDocument(string docPath, ISet<string> docsLoading)
        {
            lock (this.allDocuments)
            {
                this.pathLookup.TryGetValue(docPath, out Tuple<CdmFolderDefinition, CdmDocumentDefinition> lookup);
                var document = lookup?.Item2;

                // first check if the document was not found or is currently loading.
                // if the document was loaded previously, check if its imports were not indexed and it's not being indexed currently.
                var needToLoad = !this.docsNotFound.Contains(docPath) && !docsLoading.Contains(docPath) && (document == null || (!document.ImportsIndexed && !document.CurrentlyIndexing));

                if (needToLoad)
                {
                    docsLoading.Add(docPath);
                }

                return needToLoad;
            }
        }

        /// <summary>
        /// Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it failed to load.
        /// </summary>
        /// <param name="docPath">The document path.</param>
        /// <param name="doc">The document that was loaded.</param>
        /// <returns>Returns true if the document has loaded, false if it failed to load.</returns>
        private void MarkAsLoadedOrFailed(string docPath, CdmContainerDefinition doc)
        {
            lock (this.allDocuments)
            {
                // Doc is no longer loading.
                this.docsCurrentlyLoading.Remove(docPath);

                if (doc == null)
                {
                    // The doc failed to load, so set doc as not found.
                    this.docsNotFound.Add(docPath);
                }
            }
        }

        /// <summary>
        /// Removes a document from the list of documents that are not indexed to mark it as indexed.
        /// </summary>
        /// <param name="doc">The document.</param>
        internal void MarkDocumentAsIndexed(CdmDocumentDefinition doc)
        {
            lock (this.allDocuments)
            {
                doc.CurrentlyIndexing = false;
                this.docsCurrentlyIndexing.Remove(doc);
            }
        }

        /// <summary>
        /// Adds a document to the list of documents that are not indexed to mark it for indexing.
        /// </summary>
        /// <param name="doc">The document.</param>
        /// <returns>If the document needs indexing or not.</returns>
        internal bool MarkDocumentForIndexing(CdmDocumentDefinition doc)
        {
            lock (this.allDocuments)
            {
                if (doc.NeedsIndexing && !doc.CurrentlyIndexing)
                {
                    // If the document was not indexed before and it's not currently being indexed.
                    this.docsCurrentlyIndexing.Add(doc);
                    doc.CurrentlyIndexing = true;
                }

                return doc.NeedsIndexing;
            }
        }

        /// <summary>
        /// Whether a specific pair of folder-document exists in the list of all documents in the corpus.
        /// </summary>
        /// <param name="fd">The folder-document pair.</param>
        internal bool Contains(Tuple<CdmFolderDefinition, CdmDocumentDefinition> fd)
        {
            return this.allDocuments.Contains(fd);
        }

        /// <summary>
        /// Loads a folder or document given its corpus path.
        /// </summary>
        /// <param name="objectPath"></param>
        /// <param name="forceReload"></param>
        /// <param name="resOpt"></param>
        /// <param name="indexing"></param>
        /// <returns></returns>
        internal Task<CdmContainerDefinition> LoadFolderOrDocument(string objectPath, bool forceReload = false, ResolveOptions resOpt = null)
        {
            lock (this.allDocuments)
            {
                // If the document is already loaded and the user do not want to force a reload, return the document previously loaded.
                if (!forceReload && this.pathLookup.ContainsKey(objectPath))
                {
                    CdmContainerDefinition doc = this.pathLookup[objectPath].Item2;
                    return Task.FromResult(doc);
                }

                // Mark as loading.
                this.docsCurrentlyLoading.Add(objectPath);
            }

            // The document needs to be loaded. Create a task to load it and add to the list of documents currently loading.
            var task = Task.Run(async () =>
            {
                var result = await this._LoadFolderOrDocument(objectPath, forceReload, resOpt);
                this.MarkAsLoadedOrFailed(objectPath, result);
                return result;
            });

            return task;
        }

        /// <summary>
        /// Loads a folder or document given its obejct path.
        /// </summary>
        /// <param name="objectPath"></param>
        /// <param name="forceReload"></param>
        /// <param name="resOpt"></param>
        /// <returns></returns>
        private async Task<CdmContainerDefinition> _LoadFolderOrDocument(string objectPath, bool forceReload = false, ResolveOptions resOpt = null)
        {
            if (string.IsNullOrWhiteSpace(objectPath))
            {
                return null;
            }

            // first check for namespace
            Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(objectPath);
            if (pathTuple == null)
            {
                Logger.Error(this.corpus.Ctx, TAG, nameof(LoadFolderOrDocument), objectPath, CdmLogCode.ErrPathNullObjectPath);
                return null;
            }
            string nameSpace = !string.IsNullOrWhiteSpace(pathTuple.Item1) ? pathTuple.Item1 : this.corpus.Storage.DefaultNamespace;
            objectPath = pathTuple.Item2;

            if (!objectPath.StartsWith("/"))
            {
                return null;
            }

            var namespaceFolder = this.corpus.Storage.FetchRootFolder(nameSpace);
            StorageAdapter namespaceAdapter = this.corpus.Storage.FetchAdapter(nameSpace);
            if (namespaceFolder == null || namespaceAdapter == null)
            {
                Logger.Error(this.corpus.Ctx, TAG, nameof(LoadFolderOrDocument), objectPath, CdmLogCode.ErrStorageNamespaceNotRegistered, nameSpace);
                return null;
            }
            CdmFolderDefinition lastFolder = namespaceFolder.FetchChildFolderFromPath(objectPath, false);

            // don't create new folders, just go as far as possible
            if (lastFolder == null)
            {
                return null;
            }

            // maybe the search is for a folder?
            string lastPath = lastFolder.FolderPath;
            if (lastPath == objectPath)
            {
                return lastFolder;
            }

            // remove path to folder and then look in the folder
            objectPath = StringUtils.Slice(objectPath, lastPath.Length);

            this.concurrentReadLock.Acquire();
            
            // During this step the document will be added to the pathLookup when it is added to a folder.
            var doc = await lastFolder.FetchDocumentFromFolderPathAsync(objectPath, forceReload, resOpt);

            this.concurrentReadLock.Release();

            return doc;
        }
    }
}
