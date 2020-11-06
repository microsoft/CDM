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
        internal IDictionary<string, byte> docsNotLoaded;
        internal IDictionary<string, byte> docsCurrentlyLoading;
        internal IDictionary<CdmDocumentDefinition, byte> docsNotIndexed;
        internal IDictionary<string, byte> docsNotFound;
        internal List<Tuple<CdmFolderDefinition, CdmDocumentDefinition>> allDocuments;
        internal IDictionary<string, Tuple<CdmFolderDefinition, CdmDocumentDefinition>> pathLookup;
        internal ConcurrentSemaphore concurrentReadLock;

        internal DocumentLibrary()
        {
            this.allDocuments = new List<Tuple<CdmFolderDefinition, CdmDocumentDefinition>>();
            this.pathLookup = new Dictionary<string, Tuple<CdmFolderDefinition, CdmDocumentDefinition>>();
            this.docsNotLoaded = new Dictionary<string, byte>();
            this.docsCurrentlyLoading = new Dictionary<string, byte>();
            this.docsNotFound = new Dictionary<string, byte>();
            this.docsNotIndexed = new Dictionary<CdmDocumentDefinition, byte>();
            this.concurrentReadLock = new ConcurrentSemaphore();
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
        /// Returns a list of all the documents that are not loaded.
        /// </summary>
        internal List<String> ListDocsNotLoaded()
        {
            lock (this.allDocuments)
            {
                return new List<String>(this.docsNotLoaded.Keys);
            }
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
        /// Adds a document to the list of documents that are not loaded if its path does not exist in the path lookup.
        /// </summary>
        /// <param name="path">The document path.</param>
        internal void AddToDocsNotLoaded(string path)
        {
            lock (this.allDocuments)
            {
                if (!this.docsNotFound.ContainsKey(path))
                {
                    this.pathLookup.TryGetValue(path.ToLower(), out Tuple<CdmFolderDefinition, CdmDocumentDefinition> lookup);
                    // If the imports were not indexed yet there might be documents imported that weren't loaded.
                    if (lookup == null || (!lookup.Item2.ImportsIndexed && !lookup.Item2.CurrentlyIndexing))
                    {
                        this.docsNotLoaded[path] = 1;
                    }
                }
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
                    this.pathLookup.TryGetValue(path.ToLower(), out Tuple<CdmFolderDefinition, CdmDocumentDefinition> lookup);
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
        /// <param name="docName">The document name.</param>
        /// <returns>Whether a document needs to be loaded.</returns>
        internal bool NeedToLoadDocument(string docName, ConcurrentDictionary<CdmDocumentDefinition, byte> docsNowLoaded)
        {
            bool needToLoad = false;
            CdmDocumentDefinition doc = null;

            lock (this.allDocuments)
            {
                if (this.docsNotLoaded.ContainsKey(docName) && !this.docsNotFound.ContainsKey(docName) && !this.docsCurrentlyLoading.ContainsKey(docName))
                {
                    // Set status to loading.
                    this.docsNotLoaded.Remove(docName);

                    // The document was loaded already, skip it.
                    if (this.pathLookup.TryGetValue(docName.ToLower(), out var lookup))
                    {
                        doc = lookup.Item2;
                    }
                    else
                    {
                        this.docsCurrentlyLoading.Add(docName, 1);
                        needToLoad = true;
                    }
                }                
            }

            if (doc != null)
            {
                MarkDocumentAsLoadedOrFailed(doc, docName, docsNowLoaded);
            }

            return needToLoad;
        }

        /// <summary>
        /// Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it failed to load.
        /// </summary>
        /// <param name="doc">The document that was loaded.</param>
        /// <param name="docName">The document name.</param>
        /// <param name="docsNowLoaded">The dictionary of documents that are now loaded.</param>
        /// <returns>Returns true if the document has loaded, false if it failed to load.</returns>
        internal bool MarkDocumentAsLoadedOrFailed(CdmDocumentDefinition doc, string docName, ConcurrentDictionary<CdmDocumentDefinition, byte> docsNowLoaded)
        {
            lock (this.allDocuments)
            {
                // Doc is no longer loading.
                this.docsCurrentlyLoading.Remove(docName);

                if (doc != null)
                {
                    // Doc is now loaded.
                    docsNowLoaded.TryAdd(doc, 1);
                    // Doc needs to be indexed.
                    this.docsNotIndexed.Add(doc, 1);
                    doc.CurrentlyIndexing = true;

                    return true;
                }
                else
                {
                    // The doc failed to load, so set doc as not found.
                    this.docsNotFound.Add(docName, 1);

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
