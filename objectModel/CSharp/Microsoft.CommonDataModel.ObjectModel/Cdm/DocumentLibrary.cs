// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Concurrent;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;

    /// <summary>
    /// Synchronizes all dictionaries relating to the documents (and their statuses) in the corpus.
    /// </summary>
    internal class DocumentLibrary
    {
        internal List<Tuple<CdmFolderDefinition, CdmDocumentDefinition>> allDocuments;
        internal ConcurrentSemaphore concurrentReadLock;
        internal IDictionary<string, byte> docsCurrentlyLoading;
        internal IDictionary<CdmDocumentDefinition, byte> docsNotIndexed;
        internal IDictionary<string, byte> docsNotFound;
        private IDictionary<string, Tuple<CdmFolderDefinition, CdmDocumentDefinition>> pathLookup;

        internal DocumentLibrary()
        {
            this.allDocuments = new List<Tuple<CdmFolderDefinition, CdmDocumentDefinition>>();
            this.concurrentReadLock = new ConcurrentSemaphore();
            this.pathLookup = new Dictionary<string, Tuple<CdmFolderDefinition, CdmDocumentDefinition>>();
            this.docsNotFound = new Dictionary<string, byte>();
            this.docsNotIndexed = new Dictionary<CdmDocumentDefinition, byte>();
            this.docsCurrentlyLoading = new Dictionary<string, byte>();
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
        internal List<CdmDocumentDefinition> ListDocsNotIndexed()
        {
            var docsNotIndexed = new List<CdmDocumentDefinition>();
            lock (this.allDocuments)
            {
                // gets all the documents that needs indexing and set the currentlyIndexing flag to true.
                foreach (var doc in this.docsNotIndexed.Keys)
                {
                    doc.CurrentlyIndexing = true;
                    docsNotIndexed.Add(doc);
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
                if (!this.docsNotFound.ContainsKey(path))
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
        internal bool NeedToLoadDocument(string docPath)
        {
            lock (this.allDocuments)
            {
                this.pathLookup.TryGetValue(docPath, out Tuple<CdmFolderDefinition, CdmDocumentDefinition> lookup);
                var document = lookup?.Item2;

                // first check if the document was not found or is currently loading already.
                // if the document was loaded previously, check if its imports were not indexed and it's not being indexed currently.
                var needToLoad = !this.docsNotFound.ContainsKey(docPath) && !this.docsCurrentlyLoading.ContainsKey(docPath) && (document == null || (!document.ImportsIndexed && !document.CurrentlyIndexing));

                if (needToLoad)
                {
                    docsCurrentlyLoading.Add(docPath, 1);
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
        internal bool MarkDocumentAsLoadedOrFailed(string docPath, CdmDocumentDefinition doc)
        {
            lock (this.allDocuments)
            {
                // Doc is no longer loading.
                this.docsCurrentlyLoading.Remove(docPath);

                if (doc != null)
                {
                    // Doc needs to be indexed.
                    this.docsNotIndexed.Add(doc, 1);
                    doc.CurrentlyIndexing = true;

                    return true;
                }
                else
                {
                    // The doc failed to load, so set doc as not found.
                    this.docsNotFound.Add(docPath, 1);

                    return false;
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
                this.docsNotIndexed.Remove(doc);
            }
        }

        /// <summary>
        /// Adds a document to the list of documents that are not indexed to mark it for indexing.
        /// </summary>
        /// <param name="doc">The document.</param>
        internal void MarkDocumentForIndexing(CdmDocumentDefinition doc)
        {
            lock (this.allDocuments)
            {
                this.docsNotIndexed[doc] = 1;
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
    }
}
