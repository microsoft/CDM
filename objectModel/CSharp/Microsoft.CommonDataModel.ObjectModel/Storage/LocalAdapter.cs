//-----------------------------------------------------------------------
// <copyright file="LocalAdapter.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;

    public class LocalAdapter : StorageAdapter
    {
        /// <summary>
        /// The root path of the schema documents.
        /// </summary>
        public string Root { get; private set; }

        /// <summary>
        /// The full root of schema documents.
        /// </summary>
        internal string FullRoot { get; private set; }

        /// <inheritdoc />
        public string LocationHint { get; set; }

        internal const string Type = "local";

        /// <summary>
        /// Constructs a LocalAdapter.
        /// </summary>
        /// <param name="root">The root path of the schema documents.</param>
        public LocalAdapter(string root)
        {
            if (root == null)
            {
                throw new Exception("The root has to be specified and cannot be null.");
            }

            this.Root = root;
            this.FullRoot = Path.GetFullPath(root);
        }

        /// <summary>
        /// The default constructor, a user has to apply JSON config after creating it this way.
        /// </summary>
        public LocalAdapter()
        {
        }

        /// <inheritdoc />
        public bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public async Task<string> ReadAsync(string corpusPath)
        {
            string path = this.CreateAdapterPath(corpusPath);
            byte[] result;
            using (FileStream stream = File.Open(path, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                result = new byte[stream.Length];
                await stream.ReadAsync(result, 0, (int)stream.Length);
                if (stream.Length == 0)
                    throw new Exception($"The requested document '{path}' is empty");
            }
            return Encoding.UTF8.GetString(result);
        }

        /// <inheritdoc />
        public bool CanWrite()
        {
            return true;
        }

        /// <inheritdoc />
        public async Task WriteAsync(string corpusPath, string data)
        {
            // ensure that the path exists before trying to write the file
            string path = this.CreateAdapterPath(corpusPath);
            if (ensurePath(path) == false)
            {
                throw new Exception($"Could not create folder for document '{path}'");
            }
            
            using (FileStream stream = File.Open(path, FileMode.Create))
            {
                byte[] bytes = Encoding.UTF8.GetBytes(data);
                await stream.WriteAsync(bytes, 0, bytes.Length);
            }
        }

        /// <inheritdoc />
        public string CreateAdapterPath(string corpusPath)
        {
            if (corpusPath.Contains(":"))
                corpusPath = StringUtils.Slice(corpusPath, corpusPath.IndexOf(":") + 1);
            if (Path.IsPathRooted(this.FullRoot))
                return Path.GetFullPath(this.FullRoot + corpusPath);
            return Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), this.FullRoot) + corpusPath);
        }

        /// <inheritdoc />
        public void ClearCache()
        {
            return;
        }

        /// <inheritdoc />
        public string CreateCorpusPath(string adapterPath)
        {
            if (adapterPath.StartsWith("http")) {
                return null;
            }

            // make this a file system path and normalize it
            string formattedAdapterPath = Path.GetFullPath(adapterPath);
            formattedAdapterPath = formattedAdapterPath.Replace('\\', '/');
            string formattedRoot = this.FullRoot.Replace('\\', '/');

            // might not be an adapterPath that we understand. check that first 
            if (formattedAdapterPath.StartsWith(formattedRoot))
            {
                return formattedAdapterPath.Slice(formattedRoot.Length).Replace("\\", "/");
            }
            
            return null; // signal that we didn't recognize path as one for this adapter
        }

        /// <inheritdoc />
        public Task<DateTimeOffset?> ComputeLastModifiedTimeAsync(string corpusPath)
        {
            var adapterPath = this.CreateAdapterPath(corpusPath);
            FileInfo fileInfo = new FileInfo(adapterPath);
            if (fileInfo.Exists)
                return Task.FromResult((DateTimeOffset?)fileInfo.LastWriteTimeUtc);
            else
                return Task.FromResult<DateTimeOffset?>(null);
        }

        /// <inheritdoc />
        public async Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            // Returns a list corpus paths to all files and folders at or under the
            // provided corpus path to a folder
            return await this._getAllFiles(folderCorpusPath);
        }

        /// <summary>
        /// Returns true if the directory exists from the given path, false otherwise
        /// </summary>
        private Task<bool> DirExists(string folderPath)
        {
            string adapterPath = this.CreateAdapterPath(folderPath);
            return Task.FromResult(Directory.Exists(adapterPath));
        }

        private async Task<List<string>> _getAllFiles(string corpusPath)
        {
            var allFiles = new List<string>();
            string adapterPath = this.CreateAdapterPath(corpusPath);

            string[] content = Directory.GetFileSystemEntries(adapterPath);

            foreach (var childPath in content)
            {
                string childCorpusPath = this.CreateCorpusPath(childPath);
                bool isDir = await this.DirExists(childCorpusPath);

                if (isDir)
                {
                    List<string> subFiles = await this._getAllFiles(childCorpusPath);
                    allFiles.AddRange(subFiles);
                }
                else
                {
                    allFiles.Add(childCorpusPath);
                }
            }
            return allFiles;
        }

        // recursive check for / create path to house a document
        private bool ensurePath(string pathFor)
        {
            int pathEnd = pathFor.LastIndexOf(Path.DirectorySeparatorChar);
            if (pathEnd == -1)
                return false;
            string pathTo = pathFor.Substring(0, pathEnd);
            if (Directory.Exists(pathTo))
                return true;

            // make sure there is a place to put the directory that is missing
            if (ensurePath(pathTo) == false)
                return false;

            if (Directory.CreateDirectory(pathTo) == null)
                return false;
            return true;
        }

        /// <inheritdoc />
        public string FetchConfig()
        {
            var resultConfig = new JObject
            {
                { "type", Type }
            };

            var configObject = new JObject
            {
                { "root", this.Root }
            };

            if (this.LocationHint != null)
            {
                configObject.Add("locationHint", this.LocationHint);
            }

            resultConfig.Add("config", configObject);

            return resultConfig.ToString();
        }

        /// <inheritdoc />
        public void UpdateConfig(string config)
        {
            if (config == null)
            {
                throw new Exception("Local adapter needs a config.");
            }

            var configJson = JsonConvert.DeserializeObject<JObject>(config);

            if (configJson["root"] == null)
            {
                throw new Exception("The root has to be specified and cannot be null.");
            }

            this.Root = configJson["root"].ToString();

            if (configJson["locationHint"] != null)
            {
                this.LocationHint = configJson["locationHint"].ToString();
            }

            this.FullRoot = Path.GetFullPath(this.Root);
        }
    }
}
