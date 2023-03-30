// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Reflection;
    using System.Threading.Tasks;

    public class StorageManager
    {
        private static readonly string Tag = nameof(StorageManager);

        internal CdmCorpusDefinition Corpus { get; }
        internal CdmCorpusContext Ctx => this.Corpus.Ctx;

        /// <summary>
        /// The dictionary of registered namespace <-> adapters.
        /// </summary>
        public IDictionary<string, StorageAdapterBase> NamespaceAdapters { get; set; }

        internal IDictionary<string, CdmFolderDefinition> NamespaceFolders { get; set; }

        internal IDictionary<string, Type> RegisteredAdapterTypes { get; }

        /// <summary>
        /// The namespaces that have default adapters defined by the program and not by a user.
        /// </summary>
        private ISet<string> systemDefinedNamespaces;

        /// <summary>
        /// The namespace that will be used when one is not explicitly provided.
        /// </summary>
        public string DefaultNamespace { get; set; }

        /// <summary>
        /// Number of documents read concurrently when loading imports.
        /// </summary>
        public int? MaxConcurrentReads
        {
            get
            {
                return this.Corpus.documentLibrary.concurrentReadLock.Permits;
            }
            set
            {
                this.Corpus.documentLibrary.concurrentReadLock.Permits = value;
            }
        }

        /// <summary>
        /// Constructs a StorageManager.
        /// </summary>
        /// <param name="corpus">The corpus that owns this storage manager.</param>
        public StorageManager(CdmCorpusDefinition corpus)
        {
            this.Corpus = corpus;
            this.NamespaceAdapters = new Dictionary<string, StorageAdapterBase>();
            this.NamespaceFolders = new Dictionary<string, CdmFolderDefinition>();
            this.systemDefinedNamespaces = new HashSet<string>();

            // If an adapter (such as ADLSAdapter) is not present in the current assembly
            // we will register it as null for the given key name

            this.RegisteredAdapterTypes = new Dictionary<string, Type>()
            {
                { "local", FetchType("Microsoft.CommonDataModel.ObjectModel.Storage.LocalAdapter") },
                { "adls", FetchType("Microsoft.CommonDataModel.ObjectModel.Storage.ADLSAdapter", "Microsoft.CommonDataModel.ObjectModel.Adapter.Adls") },
                { "remote", FetchType("Microsoft.CommonDataModel.ObjectModel.Storage.RemoteAdapter") },
                { "github", FetchType("Microsoft.CommonDataModel.ObjectModel.Storage.GithubAdapter") },
                { "syms", FetchType("Microsoft.CommonDataModel.ObjectModel.Storage.SymsAdapter", "Microsoft.CommonDataModel.ObjectModel.Adapter.Syms") },
            };

            // Set up default adapters.
            this.Mount("local", new LocalAdapter(Directory.GetCurrentDirectory()));
            systemDefinedNamespaces.Add("local");

            try
            {
                this.Mount("cdm", new CdmStandardsAdapter());
                systemDefinedNamespaces.Add("cdm");
            }
            catch (Exception e)
            {
                Logger.Error(this.Ctx, Tag, nameof(StorageManager), null, CdmLogCode.ErrStorageCdmStandardsMissing, "Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards", e.Message);
            }
        }

        /// <summary>
        /// Returns type from the executing assembly that matches the given name.
        /// </summary>
        /// <param name="typeName">Type name</param>
        /// <returns>Type that matches the given name, or null if not found</returns>
        private Type FetchType(string typeName)
        {
            return Assembly.GetExecutingAssembly().GetType(typeName);
        }

        /// <summary>
        /// Returns type from an assembly that matches the given name.
        /// </summary>
        /// <param name="typeName">Type name</param>
        /// <param name="assemblyName">Assembly name</param>
        /// <returns>Type that matches the given name, or null if not found</returns>
        private Type FetchType(string typeName, string assemblyName)
        {
            try
            {
                return Assembly.Load(assemblyName)?.GetType(typeName);
            }
            catch (Exception ex)
            {
                Logger.Info(this.Ctx, Tag, nameof(FetchType), null,
                    $"Unable to load type '{typeName}' from assembly '{assemblyName}. Exception: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Mounts a namespace to the specified adapter.
        /// </summary>
        public void Mount(string nameSpace, StorageAdapterBase adapter)
        {
            using (Logger.EnterScope(nameof(StorageManager), Ctx, nameof(Mount)))
            {
                if (string.IsNullOrEmpty(nameSpace))
                {
                    Logger.Error(this.Ctx, Tag, nameof(Mount), null, CdmLogCode.ErrStorageNullNamespace);
                    return;
                }

                if (adapter != null)
                {
                    if (adapter is StorageAdapterBase adapterBase)
                    {
                        adapterBase.Ctx = this.Ctx;
                    }

                    this.NamespaceAdapters[nameSpace] = adapter;
                    CdmFolderDefinition fd = new CdmFolderDefinition(this.Ctx, "");
                    fd.Corpus = this.Corpus as CdmCorpusDefinition;
                    fd.Namespace = nameSpace;
                    fd.FolderPath = "/";
                    this.NamespaceFolders[nameSpace] = fd;
                    this.systemDefinedNamespaces.Remove(nameSpace);
                }
                else
                {
                    Logger.Error(this.Ctx, Tag, nameof(Mount), null, CdmLogCode.ErrStorageNullAdapter);
                }
            }
        }

        /// <summary>
        /// Unmounts a namespace.
        /// </summary>
        public bool Unmount(string nameSpace)
        {
            using (Logger.EnterScope(nameof(StorageManager), Ctx, nameof(Unmount)))
            {
                if (string.IsNullOrEmpty(nameSpace))
                {
                    Logger.Error(this.Ctx, Tag, nameof(Unmount), null, CdmLogCode.ErrStorageNullNamespace);
                    return false;
                }

                if (!this.NamespaceAdapters.ContainsKey(nameSpace))
                {
                    Logger.Warning(this.Ctx, Tag, nameof(Unmount), null, CdmLogCode.WarnStorageRemoveAdapterFailed, nameSpace);
                    return false;
                }

                this.NamespaceAdapters.Remove(nameSpace);
                this.NamespaceFolders.Remove(nameSpace);
                this.systemDefinedNamespaces.Remove(nameSpace);

                // The special case, use Resource adapter.
                if (nameSpace == "cdm")
                {
                    this.Mount(nameSpace, new ResourceAdapter());
                    Logger.Warning(this.Ctx, Tag, nameof(Unmount), null, CdmLogCode.WarnUnMountCdmNamespace);
                }

                return true;
            }
        }


        /// <summary>
        /// Allow replacing a storage adapter with another one for testing, leaving folders intact.
        /// </summary>
        internal void SetAdapter(string nameSpace, StorageAdapterBase adapter)
        {
            if (string.IsNullOrEmpty(nameSpace))
            {
                Logger.Error(this.Ctx, Tag, nameof(SetAdapter), null, CdmLogCode.ErrStorageNullNamespace);
                return;
            }

            if (adapter != null)
            {
                this.NamespaceAdapters[nameSpace] = adapter;
            }
            else
            {
                Logger.Error(this.Ctx, Tag, nameof(SetAdapter), null, CdmLogCode.ErrStorageNullAdapter);
            }
        }

        /// <summary>
        /// Retrieves the adapter for the specified namespace.
        /// </summary>
        /// <param name="nameSpace"></param>
        /// <returns>The adapter.</returns>
        public StorageAdapterBase FetchAdapter(string nameSpace)
        {
            if (string.IsNullOrEmpty(nameSpace))
            {
                Logger.Error(this.Ctx, Tag, nameof(FetchAdapter), null, CdmLogCode.ErrStorageNullNamespace);
                return null;
            }

            if (this.NamespaceFolders.ContainsKey(nameSpace))
            {
                return this.NamespaceAdapters[nameSpace];
            }

            Logger.Error(this.Ctx, Tag, nameof(FetchAdapter), null, CdmLogCode.ErrStorageAdapterNotFound, nameSpace);
            return null;
        }

        /// <summary>
        /// Given the namespace of a registered storage adapter, returns the root folder containing the sub-folders and documents.
        /// </summary>
        public CdmFolderDefinition FetchRootFolder(string nameSpace)
        {
            using (Logger.EnterScope(nameof(StorageManager), Ctx, nameof(FetchRootFolder)))
            {
                if (string.IsNullOrEmpty(nameSpace))
                {
                    Logger.Error(this.Ctx, Tag, nameof(FetchRootFolder), null, CdmLogCode.ErrStorageNullNamespace);
                    return null;
                }

                CdmFolderDefinition folder = null;
                if (this.NamespaceFolders.ContainsKey(nameSpace))
                    this.NamespaceFolders.TryGetValue(nameSpace, out folder);
                else if (this.DefaultNamespace != null)
                    this.NamespaceFolders.TryGetValue(this.DefaultNamespace, out folder);

                if (folder == null)
                {
                    Logger.Error(this.Ctx, Tag, nameof(FetchAdapter), null, CdmLogCode.ErrStorageFolderNotFound, nameSpace);
                }

                return folder;
            }
        }

        /// <summary>
        /// Takes a storage adapter domain path, figures out the right adapter to use and then returns a corpus path.
        /// </summary>
        public string AdapterPathToCorpusPath(string adapterPath)
        {
            using (Logger.EnterScope(nameof(StorageManager), Ctx, nameof(AdapterPathToCorpusPath)))
            {
                string result = null;

                // keep trying adapters until one of them likes what it sees
                if (this.NamespaceAdapters != null)
                {
                    foreach (KeyValuePair<string, StorageAdapterBase> kv in this.NamespaceAdapters)
                    {
                        result = kv.Value.CreateCorpusPath(adapterPath);
                        if (result != null)
                        {
                            // got one, add the prefix
                            if (result == "")
                                result = "/";
                            result = $"{kv.Key}:{result}";
                            break;
                        }
                    }
                }

                if (result == null)
                {
                    Logger.Error(this.Ctx, Tag, nameof(AdapterPathToCorpusPath), null, CdmLogCode.ErrStorageInvalidAdapterPath, adapterPath);
                }

                return result;
            }
        }

        /// <summary>
        /// Takes a corpus path, figures out the right adapter to use and then returns an adapter domain path.
        /// </summary>
        public string CorpusPathToAdapterPath(string corpusPath)
        {
            using (Logger.EnterScope(nameof(StorageManager), Ctx, nameof(CorpusPathToAdapterPath)))
            {
                if (string.IsNullOrEmpty(corpusPath))
                {
                    Logger.Error(this.Ctx, Tag, nameof(CorpusPathToAdapterPath), null, CdmLogCode.ErrStorageNullCorpusPath);
                    return null;
                }

                string result = "";
                // break the corpus path into namespace and ... path
                Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(corpusPath);
                if (pathTuple == null)
                {
                    Logger.Error(this.Ctx, Tag, nameof(CorpusPathToAdapterPath), null, CdmLogCode.ErrStorageNullCorpusPath);
                    return null;
                }
                string nameSpace = pathTuple.Item1;
                if (string.IsNullOrWhiteSpace(nameSpace))
                    nameSpace = this.DefaultNamespace;

                // get the adapter registered for this namespace
                StorageAdapterBase namespaceAdapter = this.FetchAdapter(nameSpace);
                if (namespaceAdapter == null)
                {
                    Logger.Error(this.Ctx, Tag, nameof(CorpusPathToAdapterPath), null, CdmLogCode.ErrStorageNamespaceNotRegistered, nameSpace);
                }
                else
                {
                    // ask the storage adapter to 'adapt' this path
                    result = namespaceAdapter.CreateAdapterPath(pathTuple.Item2);
                }

                return result;
            }
        }

        /// <summary>
        /// Takes a corpus path (relative or absolute) and creates a valid absolute path with namespace.
        /// </summary>
        public string CreateAbsoluteCorpusPath(string objectPath, CdmObject obj = null)
        {
            using (Logger.EnterScope(nameof(StorageManager), Ctx, nameof(CreateAbsoluteCorpusPath)))
            {
                if (string.IsNullOrWhiteSpace(objectPath))
                {
                    Logger.Error(this.Ctx, Tag, nameof(CreateAbsoluteCorpusPath), null, CdmLogCode.ErrPathNullObjectPath);
                    return null;
                }

                if (this.ContainsUnsupportedPathFormat(objectPath))
                {
                    // already called statusRpt when checking for unsupported path format.
                    return null;
                }

                Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(objectPath);
                if (pathTuple == null)
                {
                    Logger.Error(this.Ctx, Tag, nameof(CreateAbsoluteCorpusPath), null, CdmLogCode.ErrPathNullObjectPath);
                    return null;
                }
                string nameSpace = pathTuple.Item1;
                string newObjectPath = pathTuple.Item2;
                string finalNamespace;

                string prefix = "";
                string namespaceFromObj = "";
                if (obj != null && obj is CdmContainerDefinition container)
                {
                    prefix = container.FolderPath;
                    namespaceFromObj = container.Namespace;
                }
                else if (obj != null && obj.InDocument != null)
                {
                    prefix = obj.InDocument.FolderPath;
                    namespaceFromObj = obj.InDocument.Namespace;
                }

                if (prefix != null && this.ContainsUnsupportedPathFormat(prefix))
                {
                    // already called statusRpt when checking for unsupported path format.
                    return null;
                }

                if (!string.IsNullOrEmpty(prefix) && prefix[prefix.Length - 1] != '/')
                {
                    Logger.Warning((ResolveContext)this.Ctx, Tag, nameof(CreateAbsoluteCorpusPath), null, CdmLogCode.WarnStorageExpectedPathPrefix, prefix);
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
                        Logger.Error(this.Ctx, Tag, nameof(CreateAbsoluteCorpusPath), null, CdmLogCode.ErrStorageNamespaceMismatch, nameSpace, newObjectPath, prefix, namespaceFromObj);
                        return null;
                    }
                    newObjectPath = prefix + newObjectPath;

                    finalNamespace = string.IsNullOrWhiteSpace(namespaceFromObj) ?
                                        (string.IsNullOrWhiteSpace(nameSpace) ? this.DefaultNamespace : nameSpace) : namespaceFromObj;
                }
                else
                {
                    finalNamespace = string.IsNullOrWhiteSpace(nameSpace) ?
                                        (string.IsNullOrWhiteSpace(namespaceFromObj) ? this.DefaultNamespace : namespaceFromObj) : nameSpace;
                }

                return (!string.IsNullOrWhiteSpace(finalNamespace) ? $"{finalNamespace}:" : "") + newObjectPath;
            }
        }

        /// <summary>
        /// Fetches the config.
        /// </summary>
        /// <returns>The JSON string representing the config.</returns>
        public string FetchConfig()
        {
            var adaptersArray = new JArray();

            // Construct the JObject for each adapter.
            foreach (var namespaceAdapterTuple in this.NamespaceAdapters)
            {
                // Skip system-defined adapters and resource adapters.
                if (this.systemDefinedNamespaces.Contains(namespaceAdapterTuple.Key) || namespaceAdapterTuple.Value is ResourceAdapter)
                {
                    continue;
                }

                var config = namespaceAdapterTuple.Value.FetchConfig();
                if (string.IsNullOrWhiteSpace(config))
                {
                    Logger.Error(this.Ctx, Tag, nameof(FetchConfig), null, CdmLogCode.ErrStorageNullAdapter);
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
        public async Task SaveAdaptersConfigAsync(string name, StorageAdapterBase adapter)
        {
            await adapter.WriteAsync(name, FetchConfig());
        }

        /// <summary>
        /// Mounts the config JSON to the storage manager/corpus.
        /// </summary>
        /// <param name="adapterConfig">The adapters config in JSON.</param>
        /// <param name="doesReturnErrorList">A boolean value that denotes whether we want to return a list of adapters that were not found.</param>
        /// <returns>The list of configs for unrecognized adapters.</returns>
        public List<string> MountFromConfig(string adapterConfig, bool doesReturnErrorList = false)
        {
            if (string.IsNullOrWhiteSpace(adapterConfig))
            {
                Logger.Error(this.Ctx, Tag, nameof(MountFromConfig), null, CdmLogCode.ErrStorageNullAdapterConfig);
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
                    Logger.Error(this.Ctx, Tag, nameof(MountFromConfig), null, CdmLogCode.ErrStorageMissingNamespace);
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
                    Logger.Error(this.Ctx, Tag, nameof(MountFromConfig), null, CdmLogCode.ErrStorageMissingJsonConfig, nameSpace);
                    continue;
                }

                if (item["type"] == null)
                {
                    Logger.Error(this.Ctx, Tag, nameof(MountFromConfig), null, CdmLogCode.ErrStorageMissingTypeJsonConfig, nameSpace);
                    continue;
                }

                Type adapterType = null;

                this.RegisteredAdapterTypes.TryGetValue(item["type"].ToString(), out adapterType);

                if (adapterType == null)
                {
                    unrecognizedAdapters.Add(item.ToString());
                }
                else
                {
                    var adapter = Activator.CreateInstance(adapterType) as StorageAdapterBase;
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
            using (Logger.EnterScope(nameof(StorageManager), Ctx, nameof(CreateRelativeCorpusPath)))
            {
                string newPath = this.CreateAbsoluteCorpusPath(objectPath, relativeTo);

                string namespaceString = relativeTo != null ? $"{relativeTo.Namespace}:" : "";
                if (!string.IsNullOrWhiteSpace(namespaceString) && !string.IsNullOrWhiteSpace(newPath) && newPath.StartsWith(namespaceString))
                {
                    newPath = newPath.Substring(namespaceString.Length);

                    if (relativeTo?.FolderPath != null && newPath.StartsWith(relativeTo.FolderPath))
                    {
                        newPath = newPath.Substring(relativeTo.FolderPath.Length);
                    }
                }
                return newPath;
            }
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
            if (path.StartsWith("./") || path.StartsWith(".\\")
                || path.Contains("../") || path.Contains("..\\")
                || path.Contains("/./") || path.Contains("\\.\\"))
            {
                //Invalid Path.
            }

            else
                return false;

            Logger.Error(this.Ctx, Tag, nameof(ContainsUnsupportedPathFormat), null, CdmLogCode.ErrStorageInvalidPathFormat);
            return true;
        }
    }
}
