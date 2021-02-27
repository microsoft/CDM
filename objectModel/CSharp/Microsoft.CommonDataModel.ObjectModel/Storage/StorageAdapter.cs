// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// The CDM Def interface for an adapter object that can read and write documents from a data source.
    /// This was the previous method for a user to create their own storage adapter. The current method is 
    /// to extend the StorageAdapterBase class.
    /// </summary>
    [Obsolete("Please use the StorageAdapterBase class instead.")]
    public interface StorageAdapter
    {
        /// <summary>
        /// The location hint, gives a hint to the reader app about the location where the adapter implementation (Nuget, NPM...) can be obtained.
        /// </summary>
        string LocationHint { get; set; }

        /// <summary>
        /// Returns true if the adapter can read data, false otherwise.
        /// </summary>
        bool CanRead();

        /// <summary>
        /// Returns true if the adapter can write data to its source, false otherwise.
        /// </summary>
        bool CanWrite();

        /// <summary>
        /// Returns data that exists at the path as a JSON string.
        /// </summary>
        Task<string> ReadAsync(string corpusPath);

        /// <summary>
        /// Writes the object data to the specified document path.
        /// </summary>
        Task WriteAsync(string corpusPath, string data);

        /// <summary>
        /// Converts a corpus path into a path in the domain of this adapter.
        /// </summary>
        string CreateAdapterPath(string corpusPath);

        /// <summary>
        /// Converts a path in the domain of this adapter into a corpus path.
        /// </summary>
        string CreateCorpusPath(string adapterPath);

        /// <summary>
        /// Empties the cache of files and folders if the storage adapter uses a cache.
        /// </summary>
        void ClearCache();

        /// <summary>
        /// Returns the last modified time of the specified document.
        /// </summary>
        Task<DateTimeOffset?> ComputeLastModifiedTimeAsync(string corpusPath);

        /// <summary>
        /// Returns a list of corpus paths to all files and folders at or under the provided corpus path to a folder.
        /// </summary>
        Task<List<string>> FetchAllFilesAsync(string folderCorpusPath);

        /// <summary>
        /// Applies the JSON config, has to be called after default constructor.
        /// </summary>
        void UpdateConfig(string config);

        /// <summary>
        /// Constructs the config for the adapter and returns a JSON string representing the config.
        /// </summary>
        string FetchConfig();
    }
 }
