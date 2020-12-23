//Microsoft Corporation.All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{

    /// <summary>
    /// The CDM base class for an adapter object that can read and write documents from a data source.
    /// This allows a user flexibility to interact with data from multiple sources without having 
    /// to manually copy data to the location where the Object Model is running. By deriving from this 
    /// this class, users can to create their own adapter if needed.
    /// </summary>
    public abstract class StorageAdapterBase : StorageAdapter
    {
        /// <summary>
        /// The CDM corpus context, gives information for the logger.
        /// </summary>
        internal CdmCorpusContext Ctx { get; set; }

        /// <summary>
        /// The location hint, gives a hint to the reader app about the location where the adapter implementation (Nuget, NPM...) can be obtained.
        /// </summary>
        public string LocationHint { get; set; }

        /// <summary>
        /// Converts a corpus path into a path in the domain of this adapter.
        /// </summary>
        public virtual string CreateAdapterPath(string corpusPath)
        {
            return corpusPath;
        }

        /// <summary>
        /// Converts a path in the domain of this adapter into a corpus path.
        /// </summary>
        public virtual string CreateCorpusPath(string adapterPath)
        {
            return adapterPath;
        }

        /// <summary>
        /// Returns true if the adapter can read data, false otherwise.
        /// </summary>
        public virtual bool CanRead()
        {
            return false;
        }

        /// <summary>
        /// Returns true if the adapter can write data to its source, false otherwise.
        /// </summary>
        public virtual bool CanWrite()
        {
            return false;
        }

        /// <summary>
        /// Returns data that exists at the path as a JSON string.
        /// </summary>
        public virtual Task<string> ReadAsync(string corpusPath)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Writes the object data to the specified document path.
        /// </summary>
        public virtual Task WriteAsync(string corpusPath, string data)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Returns the last modified time of the specified document.
        /// </summary>
        public virtual Task<DateTimeOffset?> ComputeLastModifiedTimeAsync(string corpusPath)
        {
            return Task.FromResult<DateTimeOffset?>(DateTimeOffset.UtcNow);
        }

        /// <summary>
        /// Returns a list of corpus paths to all files and folders at or under the provided corpus path to a folder.
        /// </summary>
        public virtual Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            return null;
        }

        /// <summary>
        /// Applies the JSON config, has to be called after default constructor.
        /// </summary>
        public virtual void UpdateConfig(string config)
        {
        }

        /// <summary>
        /// Constructs the config for the adapter and returns a JSON string representing the config.
        /// </summary>
        public virtual string FetchConfig()
        {
            return "{}";
        }

        #region cache logic

        /// <summary>
        /// Empties the cache of files and folders if the storage adapter uses a cache.
        /// </summary>
        public virtual void ClearCache()
        {
        }

        /// <summary>
        /// If true inherited classes should cache and reuse file query results if they support this
        /// </summary>
        protected bool IsCacheEnabled { get { return activeCacheContexts.Count > 0; } }

        /// <summary>
        /// Calling this function tells the adapter it may cache and reuse file query results, as opposed to
        /// reissuing queries to the underlying file storage, which may be a costly operation. This adapter is 
        /// allowed to cache and reuse queries until the object returned by this function is been disposed. If 
        /// this function is called multiple times, caching is allowed until all objects returned by this 
        /// function are disposed. Intended usage is for callers to wrap a set of operations that should use
        /// caching with a using statement for the returned object.
        /// </summary>
        public IDisposable CreateFileQueryCacheContext()
        {
            return new CacheContext(this);
        }

        private HashSet<CacheContext> activeCacheContexts = new HashSet<CacheContext>();

        /// <summary>
        /// This class is used to track requests to enable file query caching. Each time a request to enable 
        /// caching is made an instance of this class is created and added the the adapter's activeCacheContexts
        /// set. When this class is disposed it is removed from that set. When any items are in the set the 
        /// adapter's caching is enabled.
        /// </summary>
        private class CacheContext : IDisposable
        {
            private StorageAdapterBase adapter;

            public CacheContext(StorageAdapterBase adapter)
            {
                this.adapter = adapter;
                this.adapter.activeCacheContexts.Add(this);
            }

            public void Dispose()
            {
                this.adapter.activeCacheContexts.Remove(this);
                if (!this.adapter.IsCacheEnabled)
                {
                    this.adapter.ClearCache();
                }
            }
        }

        #endregion
    }
}
