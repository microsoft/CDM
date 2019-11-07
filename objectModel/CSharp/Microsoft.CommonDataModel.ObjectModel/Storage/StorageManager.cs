//-----------------------------------------------------------------------
// <copyright file="StorageManager.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    public class StorageManager
    {
        internal CdmCorpusDefinition Corpus { get; }
        internal CdmCorpusContext Ctx => this.Corpus.Ctx;


        /// <summary>
        /// The dictionary of registered namespace <-> adapters.
        /// </summary>
        public IDictionary<string, StorageAdapter> NamespaceAdapters { get; set; }

        internal IDictionary<string, CdmFolderDefinition> NamespaceFolders { get; set; }

        /// <summary>
        /// The namespace that will be used when one is not explicitly provided
        /// </summary>
        public string DefaultNamespace { get; set; }

        public StorageManager(CdmCorpusDefinition corpus)
        {
            this.Corpus = corpus;
            this.NamespaceAdapters = new Dictionary<string, StorageAdapter>();
            this.NamespaceFolders = new Dictionary<string, CdmFolderDefinition>();

            // Set up default adapters.
            this.Mount("local", new LocalAdapter(Directory.GetCurrentDirectory()));
            this.Mount("cdm", new GithubAdapter());
        }

        /// <summary>
        /// Mounts a namespace to the specified adapter.
        /// </summary>
        public void Mount(string nameSpace, StorageAdapter adapter)
        {
            if (adapter != null)
            {
                this.NamespaceAdapters[nameSpace] = adapter;
                CdmFolderDefinition fd = new CdmFolderDefinition(this.Ctx, "");
                fd.Corpus = this.Corpus as CdmCorpusDefinition;
                fd.Namespace = nameSpace;
                this.NamespaceFolders[nameSpace] = fd;
            }
            else
            {
                Logger.Error(nameof(StorageManager), this.Ctx, "The adapter cannot be null.", "Mount");
            }
        }

        /// <summary>
        /// Unmounts a namespace.
        /// </summary>
        public bool Unmount(string nameSpace)
        {
            if (this.NamespaceAdapters.ContainsKey(nameSpace))
            {
                this.NamespaceAdapters.Remove(nameSpace);
                this.NamespaceFolders.Remove(nameSpace);
                return true;
            }
            else
            {
                Logger.Warning(nameof(StorageManager), this.Ctx, "Cannot remove the adapter from non-existing namespace.", "Unmount");
                return false;
            }
        }


        /// <summary>
        /// Allow replacing a storage adapter with another one for testing, leaving folders intact.
        /// </summary>
        internal void SetAdapter(string nameSpace, StorageAdapter adapter)
        {
            if (adapter != null)
            {
                this.NamespaceAdapters[nameSpace] = adapter;
            }
        }

        /// <summary>
        /// Splits the namespace path on namespace and objects.
        /// </summary>
        /// <param name="objectPath"></param>
        /// <returns>The tuple.</returns>
        internal Tuple<string, string> SplitNamespacePath(string objectPath)
        {
            string nameSpace = "";
            if (objectPath.Contains(":"))
            {
                nameSpace = StringUtils.Slice(objectPath, 0, objectPath.IndexOf(":"));
                objectPath = StringUtils.Slice(objectPath, objectPath.IndexOf(":") + 1);
            }
            return new Tuple<string, string>(nameSpace, objectPath);
        }

        /// <summary>
        /// Retrieves the adapter for the specified namespace.
        /// </summary>
        /// <param name="nameSpace"></param>
        /// <returns>The adapter.</returns>
        public StorageAdapter FetchAdapter(string nameSpace)
        {
            if (this.NamespaceFolders.ContainsKey(nameSpace))
            {
                return this.NamespaceAdapters[nameSpace];
            }

            Logger.Error(nameof(StorageManager), this.Ctx, $"Adapter not found for the namespace '{nameSpace}'", "FetchAdapter");

            return null;
        }

        /// <summary>
        /// Given the namespace of a registered storage adapter, return the root folder containing the sub-folders and documents.
        /// </summary>
        public CdmFolderDefinition FetchRootFolder(string nameSpace)
        {
            CdmFolderDefinition folder = null;
            if (nameSpace != null && this.NamespaceFolders.ContainsKey(nameSpace))
                this.NamespaceFolders.TryGetValue(nameSpace, out folder);
            else
                this.NamespaceFolders.TryGetValue(this.DefaultNamespace, out folder);

            if (folder == null)
            {
                Logger.Error(nameof(StorageManager), this.Ctx, $"Adapter not found for the namespace '{nameSpace}'", "getRootFolder");
            }

            return folder;
        }

        /// <summary>
        /// Takes a storage adapter domain path, figures out the right adapter to use and then return a corpus path.
        /// </summary>
        public string AdapterPathToCorpusPath(string adapterPath)
        {
            string result = null;

            // keep trying adapters until one of them likes what it sees
            if (this.NamespaceAdapters != null)
            {
                foreach (KeyValuePair<string, StorageAdapter> kv in this.NamespaceAdapters)
                {
                    result = kv.Value.CreateCorpusPath(adapterPath);
                    if (result != null)
                    {
                        // got one, add the prefix
                        result = $"{kv.Key}:{result}";
                        break;
                    }
                }
            }

            if (result == null)
            {
                Logger.Error(nameof(StorageManager), (ResolveContext)this.Ctx, $"No registered storage adapter understood the path '{adapterPath}'", "adapterPathToCorpusPath");
            }

            return result;
        }

        /// <summary>
        /// Takes a corpus path, figures out the right adapter to use and then return an adapter domain path.
        /// </summary>
        public string CorpusPathToAdapterPath(string corpusPath)
        {
            string result = "";
            // break the corpus path into namespace and ... path
            Tuple<string, string> pathTuple = SplitNamespacePath(corpusPath);
            string nameSpace = pathTuple.Item1;
            if (string.IsNullOrWhiteSpace(nameSpace))
                nameSpace = this.DefaultNamespace;

            // get the adapter registered for this namespace
            StorageAdapter namespaceAdapter = this.FetchAdapter(nameSpace);
            if (namespaceAdapter == null)
            {
                Logger.Error(nameof(CdmCorpusDefinition), (ResolveContext)this.Ctx, $"The namespace '{nameSpace}' has not been registered");
            }
            else
            {
                // ask the storage adapter to 'adapt' this path
                result = namespaceAdapter.CreateAdapterPath(pathTuple.Item2);
            }

            return result;
        }

        /// <summary>
        /// Takes a corpus path (relative or absolute) and creates a valid absolute path with namespace.
        /// </summary>
        public string CreateAbsoluteCorpusPath(string objectPath, CdmObject obj = null)
        {
            if (this.ContainsUnsupportedPathFormat(objectPath))
            {
                // already called statusRpt when checking for unsupported path format.
                return null;
            }

            Tuple<string, string> pathTuple = this.SplitNamespacePath(objectPath);
            string nameSpace = pathTuple.Item1;
            string newObjectPath = pathTuple.Item2;
            string finalNamespace;

            string prefix = "";
            string namespaceFromObj = "";
            if (obj != null && obj is CdmContainerDefinition)
            {
                prefix = ((CdmContainerDefinition)obj).FolderPath;
                namespaceFromObj = ((CdmContainerDefinition)obj).Namespace;
            }
            else if (obj != null)
            {
                prefix = ((CdmDocumentDefinition)obj.InDocument).FolderPath;
                namespaceFromObj = ((CdmDocumentDefinition)obj.InDocument).Namespace;
            }

            if (prefix != null && this.ContainsUnsupportedPathFormat(prefix))
            {
                // already called statusRpt when checking for unsupported path format.
                return null;
            }

            if (!string.IsNullOrEmpty(prefix) && prefix[prefix.Length - 1] != '/')
            {
                Logger.Warning(nameof(CdmCorpusDefinition), (ResolveContext)this.Ctx, "Expected path prefix to end in /, but it didn't. Appended the /", prefix);
                prefix += "/";
            }

            // check if this is a relative path
            if (!string.IsNullOrWhiteSpace(newObjectPath) && !newObjectPath.StartsWith("/"))
            {
                if (obj == null)
                {
                    // relative path and no other info given, assume default and root
                    prefix = "/";

                }
                if (!string.IsNullOrWhiteSpace(nameSpace) && nameSpace != namespaceFromObj)
                {
                    Logger.Error(nameof(CdmCorpusDefinition), this.Ctx, "The namespace '" + nameSpace + "' found on the path does not match the namespace found on the object");
                    return null;
                }
                newObjectPath = prefix + pathTuple.Item2;

                finalNamespace = namespaceFromObj;
                if (string.IsNullOrWhiteSpace(finalNamespace))
                    finalNamespace = string.IsNullOrWhiteSpace(pathTuple.Item1) ? this.DefaultNamespace : pathTuple.Item1;
            }
            else
            {
                finalNamespace = string.IsNullOrWhiteSpace(pathTuple.Item1) ? namespaceFromObj : pathTuple.Item1;
                if (string.IsNullOrWhiteSpace(finalNamespace))
                    finalNamespace = this.DefaultNamespace;
            }

            return (!string.IsNullOrWhiteSpace(finalNamespace) ? $"{finalNamespace}:" : "") + newObjectPath;
        }

        /// <summary>
        /// Fetches the config.
        /// </summary>
        /// <returns>The JObject, representing the config.</returns>
        public string FetchConfig()
        {
            var adaptersArray = new JArray();

            // Construct the JObject for each adapter.
            foreach (var namespaceAdapterTuple in this.NamespaceAdapters)
            {
                var config = namespaceAdapterTuple.Value.FetchConfig();
                if (string.IsNullOrWhiteSpace(config))
                {
                    Logger.Error(nameof(StorageManager), this.Ctx, $"JSON config constructed by adapter is null or empty.", "GenerateAdaptersConfig");
                    continue;
                }

                var jsonConfig = JsonConvert.DeserializeObject<JObject>(config);
                jsonConfig["namespace"] = namespaceAdapterTuple.Key;

                adaptersArray.Add(jsonConfig);
            }

            var resultConfig = new JObject();

            /// App ID might not be set.
            if (this.Corpus.AppId != null)
            {
                resultConfig.Add("appId", this.Corpus.AppId);
            }

            resultConfig.Add("defaultNamespace", this.DefaultNamespace);
            resultConfig.Add("adapters", adaptersArray);

            return JsonConvert.SerializeObject(resultConfig, Formatting.Indented, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }

        /// <summary>
        /// Saves adapters config into a file.
        /// </summary>
        /// <param name="name">The name of a file.</param>
        /// <param name="adapter">The adapter used to save the config to a file.</param>
        public void SaveAdaptersConfig(string name, StorageAdapter adapter)
        {
            adapter.WriteAsync(name, FetchConfig());
        }

        /// <summary>
        /// Mounts the config JSON to the storage manager/corpus.
        /// </summary>
        /// <param name="adapterConfig">The adapters config in JSON.</param>
        /// <param name="doesReturnErrorList">A boolean value that denotes whether we want to return a list of adapters that were not found.</param>
        /// <returns>The list of configs for unrecognized adapters.</returns>
        public List<string> Mount(string adapterConfig, bool doesReturnErrorList = false)
        {
            if (string.IsNullOrWhiteSpace(adapterConfig))
            {
                Logger.Error(nameof(StorageManager), this.Ctx, $"Adapter config cannot be null or empty.", "Mount");
                return null;
            }

            var adapterConfigJson = JsonConvert.DeserializeObject<JObject>(adapterConfig);

            if (adapterConfigJson["appId"] != null)
            {
                this.Corpus.AppId = adapterConfigJson["appId"].ToString();
            }

            if (adapterConfigJson["defaultNamespace"] != null)
            {
                this.DefaultNamespace = adapterConfigJson["defaultNamespace"].ToString();
            }

            var unrecognizedAdapters = new List<string>();

            foreach (var item in adapterConfigJson["adapters"])
            {
                string nameSpace;

                // Check whether the namespace exists.
                if (item["namespace"] != null)
                {
                    nameSpace = item["namespace"].ToString();
                }
                else
                {
                    Logger.Error(nameof(StorageManager), this.Ctx, $"The namespace is missing for one of the adapters in the JSON config.");
                    continue;
                }

                JObject configs = null;

                // Check whether the config exists.
                if (item["config"] != null)
                {
                    configs = item["config"] as JObject;
                }
                else
                {
                    Logger.Error(nameof(StorageManager), this.Ctx, $"Missing JSON config for the namespace {nameSpace}.");
                    continue;
                }
                    
                if (item["type"] == null)
                {
                    Logger.Error(nameof(StorageManager), this.Ctx, $"Missing type in the JSON config for the namespace {nameSpace}.");
                    continue;
                }

                StorageAdapter adapter = null;

                switch (item["type"].ToString())
                {
                    case LocalAdapter.Type:
                        adapter = new LocalAdapter();
                        break;
                    case GithubAdapter.Type:
                        adapter = new GithubAdapter();
                        break;
                    case RemoteAdapter.Type:
                        adapter = new RemoteAdapter();
                        break;
                    case ADLSAdapter.Type:
                        adapter = new ADLSAdapter();
                        break;
                    default:
                        unrecognizedAdapters.Add(item.ToString());
                        break;
                }

                if (adapter != null)
                {
                    adapter.UpdateConfig(configs.ToString());
                    this.Mount(nameSpace, adapter);
                }
            }

            return doesReturnErrorList ? unrecognizedAdapters : null;
        }

        /// <summary>
        /// Takes a corpus path (relative or absolute) and creates a valid relative corpus path with namespace.
        /// <paramref name="objectPath"/> The path that should be made relative, if possible
        /// <paramref name="relativeTo"/> The object that the path should be made relative with respect to.
        /// </summary>
        public string CreateRelativeCorpusPath(string objectPath, CdmContainerDefinition relativeTo = null)
        {
            string newPath = this.CreateAbsoluteCorpusPath(objectPath, relativeTo);

            string namespaceString = relativeTo != null ? $"{relativeTo.Namespace}:" : "";
            if (!string.IsNullOrWhiteSpace(namespaceString) && newPath.StartsWith(namespaceString))
            {
                newPath = newPath.Substring(namespaceString.Length);

                if (relativeTo?.FolderPath != null && newPath.StartsWith(relativeTo.FolderPath))
                {
                    newPath = newPath.Substring(relativeTo.FolderPath.Length);
                }
            }
            return newPath;
        }

        /// <summary>
        /// Checks whether the paths has an unsupported format, such as starting with ./ or containing ../  or  /./
        /// In case unsupported path format is found, function calls statusRpt and returns true.
        /// Returns false if path seems OK.
        /// </summary>
        /// <param name="path">The path that is to be checked.</param>
        /// <returns>True if an unsupported path format was found.</returns>
        private bool ContainsUnsupportedPathFormat(string path)
        {
            string statusMessage;
            if (path.StartsWith("./") || path.StartsWith(".\\"))
                statusMessage = "The path should not start with ./";
            else if (path.Contains("../") || path.Contains("..\\"))
                statusMessage = "The path should not contain ../";
            else if (path.Contains("/./") || path.Contains("\\.\\"))
                statusMessage = "The path should not contain /./";
            else
                return false;

            Logger.Error(nameof(CdmCorpusDefinition), this.Ctx as ResolveContext, statusMessage, path);

            return true;
        }
    }
}
