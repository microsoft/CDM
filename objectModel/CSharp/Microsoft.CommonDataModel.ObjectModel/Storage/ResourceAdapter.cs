// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;

    /// <summary>
    /// The resource adapter, enables the access to the files that are marked as embedded resources.
    /// </summary>
    public class ResourceAdapter : StorageAdapter
    {
        /// <inheritdoc />
        public string LocationHint { get; set; } = null;

        /// <summary>
        /// The resource path root (every path will have this as a start).
        /// </summary>
        private readonly string root = "Microsoft.CommonDataModel.ObjectModel.Resources";

        /// <inheritdoc />
        public bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public bool CanWrite()
        {
            return false;
        }

        /// <inheritdoc />
        public void ClearCache()
        {
            // No need to implement cache.
        }

        /// <inheritdoc />
        public Task<DateTimeOffset?> ComputeLastModifiedTimeAsync(string corpusPath)
        {
            return Task.FromResult<DateTimeOffset?>(DateTimeOffset.UtcNow);
        }

        /// <inheritdoc />
        public string CreateAdapterPath(string corpusPath)
        {
            if (string.IsNullOrEmpty(corpusPath))
            {
                return null;
            }

            return $"{root}{corpusPath}";
        }

        /// <inheritdoc />
        public string CreateCorpusPath(string adapterPath)
        {
            if (string.IsNullOrEmpty(adapterPath) || !adapterPath.StartsWith(root))
            {
                return null;
            }

            return adapterPath.Substring(root.Length);
        }

        /// <inheritdoc />
        public Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            return null;
        }

        /// <inheritdoc />
        public string FetchConfig()
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc />
        public async Task<string> ReadAsync(string corpusPath)
        {
            // Convert the corpus path to the resource path.
            var resourcePath = this.CreateAdapterPath(corpusPath).Replace('/', '.').Replace('-', '_');

            // Get the resource stream.
            var assembly = Assembly.GetExecutingAssembly();
            var resourceStream = assembly.GetManifestResourceStream(resourcePath);

            if (resourceStream == null)
            {
                throw new Exception($"There is no resource found for {corpusPath}.");
            }

            try
            {
                using (var reader = new StreamReader(resourceStream, Encoding.UTF8))
                {
                    return await reader.ReadToEndAsync();
                }
            }
            catch (Exception exception)
            {
                throw new Exception($"There was an issue while reading file at {corpusPath}. Exception: {exception.Message.ToString()}");
            }
        }

        /// <inheritdoc />
        public void UpdateConfig(string config)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc />
        public Task WriteAsync(string corpusPath, string data)
        {
            throw new NotImplementedException();
        }
    }
}
