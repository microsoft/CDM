//-----------------------------------------------------------------------
// <copyright file="ResourceAdapter.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
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

        /// <summary>
        /// The list of folders that resources should contain.
        /// </summary>
        private readonly string[] resourceFolders = { "extensions", "ODI_analogs/customer", "ODI_analogs" };

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

            var adapterPath = string.Join(".", corpusPath.Split('/')).Replace("-", "_");

            return $"{root}{adapterPath}";
        }

        /// <inheritdoc />
        public string CreateCorpusPath(string adapterPath)
        {
            if (string.IsNullOrEmpty(adapterPath) || !adapterPath.StartsWith(root))
            {
                return null;
            }

            var corpusPathWithDots = adapterPath.Substring(root.Length + 1);

            var corpusPathWithDotsArray = corpusPathWithDots.Split('.');

            // Iterate through possible folders.
            foreach (var folder in resourceFolders)
            {
                var folderPathArray = folder.Split('/');

                // Check if the folder and the subfolder match.
                if (corpusPathWithDotsArray.Length > 1 && folderPathArray.Length > 1
                    && corpusPathWithDotsArray[0] == folderPathArray[0] && corpusPathWithDotsArray[1] == folderPathArray[1])
                {
                    return $"/{folder.Replace("_", "-")}/{corpusPathWithDots.Substring(folder.Length + 1)}";
                }
                // Check if just the folder is a match.
                else if (corpusPathWithDotsArray.Length > 0 && corpusPathWithDotsArray[0] == folder)
                {
                    return $"/{folder.Replace("_", "-")}/{corpusPathWithDots.Substring(folder.Length + 1)}";
                }
            }

            // If the adapter path doesn't contain any folder.
            return $"/{corpusPathWithDots}";
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
            var assembly = Assembly.GetExecutingAssembly();

            // Convert the corpus path to the resource path.
            var resourcePath = this.CreateAdapterPath(corpusPath);

            // Get the resource stream.
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
