// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Common;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Linq;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Reflection;
    using System.Threading.Tasks;

    public class PersistenceLayer
    {
        internal const string FolioExtension = ".folio.cdm.json";
        internal const string ManifestExtension = ".manifest.cdm.json";
        internal const string CdmExtension = ".cdm.json";
        internal const string ModelJsonExtension = "model.json";
        internal const string OdiExtension = "odi.json";

        internal const string CdmFolder = "CdmFolder";
        internal const string ModelJson = "ModelJson";
        internal const string Odi = "Odi";

        internal CdmCorpusDefinition Corpus { get; }
        internal CdmCorpusContext Ctx => this.Corpus.Ctx;

        private static readonly IDictionary<string, IPersistenceType> persistenceTypes = new Dictionary<string, IPersistenceType>
        {
            { CdmFolder, new CdmFolderType() },
            { ModelJson, new ModelJsonType() }
        };

        /// <summary>
        /// The dictionary of file extension <-> persistence class that handles the file format.
        /// </summary>
        private ConcurrentDictionary<string, Type> registeredPersistenceFormats;

        /// <summary>
        /// The dictionary of persistence class <-> whether the persistence class has async methods. 
        /// </summary>
        private ConcurrentDictionary<Type, bool> isRegisteredPersistenceAsync;

        /// <summary>
        /// Constructs a PersistenceLayer and registers persistence classes to load and save known file formats.
        /// </summary>
        /// <param name="corpus">The corpus that owns this persistence layer.</param>
        internal PersistenceLayer(CdmCorpusDefinition corpus)
        {
            this.Corpus = corpus;
            this.registeredPersistenceFormats = new ConcurrentDictionary<string, Type>();
            this.isRegisteredPersistenceAsync = new ConcurrentDictionary<Type, bool>();

            // Register known persistence classes.
            this.RegisterFormat(typeof(CdmFolder.ManifestPersistence).FullName);
            this.RegisterFormat(typeof(ModelJson.ManifestPersistence).FullName);
            this.RegisterFormat(typeof(CdmFolder.DocumentPersistence).FullName);
            this.RegisterFormat("Microsoft.CommonDataModel.ObjectModel.Persistence.Odi.ManifestPersistence", "Microsoft.CommonDataModel.ObjectModel.Persistence.Odi");
        }


        public static T FromData<T, U>(CdmCorpusContext ctx, U obj, string persistenceTypeName)
            where T : CdmObject
        {
            var persistenceClass = FetchPersistenceClass<T>(persistenceTypeName);
            var method = persistenceClass.GetMethod("FromData");
            if (method == null)
            {
                string persistenceClassName = typeof(T).Name;
                throw new Exception($"Persistence class {persistenceClassName} in type {persistenceTypeName} does not implement {nameof(FromData)}.");
            }

            var fromData = (Func<CdmCorpusContext, U, T>)Delegate.CreateDelegate(typeof(Func<CdmCorpusContext, U, T>), method);
            return fromData(ctx, obj);
        }

        public static U ToData<T, U>(T instance, ResolveOptions resOpt, CopyOptions options, string persistenceTypeName)
            where T : CdmObject
        {
            var persistenceClass = FetchPersistenceClass<T>(persistenceTypeName);
            var method = persistenceClass.GetMethod("ToData");
            if (method == null)
            {
                string persistenceClassName = typeof(T).Name;
                throw new Exception($"Persistence class {persistenceClassName} in type {persistenceTypeName} does not implement {nameof(ToData)}.");
            }

            var toData = (Func<T, ResolveOptions, CopyOptions, U>)Delegate.CreateDelegate(typeof(Func<T, ResolveOptions, CopyOptions, U>), method);
            return toData(instance, resOpt, options);
        }

        public static Type FetchPersistenceClass<T>(string persistenceTypeName)
            where T : CdmObject
        {
            if (persistenceTypes.TryGetValue(persistenceTypeName, out var persistenceType))
            {
                string persistenceClassName = typeof(T).Name;
                var persistenceClass = persistenceType.RegisteredClasses.FetchPersistenceClass<T>();
                if (persistenceClass == null)
                {
                    throw new Exception($"Persistence class for {persistenceClassName} is not implemented in type {persistenceTypeName}.");
                }

                return persistenceClass;
            }
            else
            {
                throw new Exception($"Persistence type {persistenceTypeName} not implemented.");
            }
        }

        /// <summary>
        /// Loads a document from the folder path.
        /// </summary>
        /// <param name="folder">The folder that contains the document we want to load.</param>
        /// <param name="docName">The document name.</param>
        /// <param name="docContainer">The loaded document, if it was previously loaded.</param>
        /// <param name="resOpt">Optional parameter. The resolve options.</param>
        /// <returns>The loaded document.</returns>
        internal async Task<CdmDocumentDefinition> LoadDocumentFromPathAsync(CdmFolderDefinition folder, string docName, CdmDocumentDefinition docContainer, ResolveOptions resOpt = null)
        {
            // This makes sure date values are consistently parsed exactly as they appear. 
            // Default behavior auto formats date values.
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                DateParseHandling = DateParseHandling.None
            };

            CdmDocumentDefinition docContent = null;
            string jsonData = null;
            DateTimeOffset? fsModifiedTime = null;
            string docPath = folder.FolderPath + docName;
            StorageAdapter adapter = this.Corpus.Storage.FetchAdapter(folder.Namespace);

            try
            {
                if (adapter.CanRead())
                {
                    // log message used by navigator, do not change or remove
                    Logger.Debug(nameof(PersistenceLayer), this.Ctx, $"request file: {docPath}", nameof(LoadDocumentFromPathAsync));
                    jsonData = await adapter.ReadAsync(docPath);
                    // log message used by navigator, do not change or remove
                    Logger.Debug(nameof(PersistenceLayer), this.Ctx, $"received file: {docPath}", nameof(LoadDocumentFromPathAsync));
                }
                else
                {
                    throw new Exception("Storage Adapter is not enabled to read.");
                }
            }
            catch (Exception e)
            {
                // log message used by navigator, do not change or remove
                Logger.Debug(nameof(PersistenceLayer), this.Ctx, $"fail file: {docPath}", nameof(LoadDocumentFromPathAsync));

                string message = $"Could not read '{docPath}' from the '{folder.Namespace}' namespace. Reason '{e.Message}'";
                // When shallow validation is enabled, log messages about being unable to find referenced documents as warnings instead of errors.
                if (resOpt != null && resOpt.ShallowValidation)
                {
                    Logger.Warning(nameof(PersistenceLayer), (ResolveContext)this.Ctx, message, nameof(LoadDocumentFromPathAsync));
                }
                else
                {
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, message, nameof(LoadDocumentFromPathAsync));
                }
                return null;
            }

            try
            {
                fsModifiedTime = await adapter.ComputeLastModifiedTimeAsync(docPath);
            }
            catch (Exception e)
            {
                Logger.Warning(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to compute file last modified time. Reason '{e.Message}'", nameof(LoadDocumentFromPathAsync));
            }

            if (string.IsNullOrWhiteSpace(docName))
            {
                Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Document name cannot be null or empty.", nameof(LoadDocumentFromPathAsync));
                return null;
            }

            // If loading an odi.json/model.json file, check that it is named correctly.
            if (docName.EndWithOrdinalIgnoreCase(OdiExtension) && !docName.EqualsWithOrdinalIgnoreCase(OdiExtension))
            {
                Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to load '{docName}', as it's not an acceptable file name. It must be {OdiExtension}.", nameof(LoadDocumentFromPathAsync));
                return null;
            }

            if (docName.EndWithOrdinalIgnoreCase(ModelJsonExtension) && !docName.EqualsWithOrdinalIgnoreCase(ModelJsonExtension))
            {
                Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to load '{docName}', as it's not an acceptable file name. It must be {ModelJsonExtension}.", nameof(LoadDocumentFromPathAsync));
                return null;
            }

            // Fetch the correct persistence class to use.
            Type persistenceClass = FetchRegisteredPersistenceFormat(docName);
            if (persistenceClass != null)
            {
                try
                {
                    MethodInfo method = persistenceClass.GetMethod(nameof(FromData));
                    object[] parameters = new object[] { this.Ctx, docName, jsonData, folder };

                    // Check if FromData() is asynchronous for this persistence class.
                    if (!isRegisteredPersistenceAsync.ContainsKey(persistenceClass))
                    {
                        // Cache whether this persistence class has async methods.
                        isRegisteredPersistenceAsync.TryAdd(persistenceClass, (bool)persistenceClass.GetField("IsPersistenceAsync").GetValue(null));
                    }

                    if (isRegisteredPersistenceAsync[persistenceClass])
                    {
                        var task = (Task)method.Invoke(null, parameters);
                        await task;
                        docContent = task.GetType().GetProperty("Result").GetValue(task) as CdmDocumentDefinition;
                    }
                    else
                    {
                        docContent = method.Invoke(null, parameters) as CdmDocumentDefinition;
                    }
                }
                catch (Exception e)
                {
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Could not convert '{docName}'. Reason '{e.Message}'", nameof(LoadDocumentFromPathAsync));
                    return null;
                }
            }
            else
            {
                // Could not find a registered persistence class to handle this document type.
                Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Could not find a persistence class to handle the file '{docName}'", nameof(LoadDocumentFromPathAsync));
                return null;
            }

            // Add document to the folder, this sets all the folder/path things, caches name to content association and may trigger indexing on content
            if (docContent != null)
            {
                if (docContainer != null)
                {
                    // there are situations where a previously loaded document must be re-loaded.
                    // the end of that chain of work is here where the old version of the document has been removed from
                    // the corpus and we have created a new document and loaded it from storage and after this call we will probably
                    // add it to the corpus and index it, etc.
                    // it would be really rude to just kill that old object and replace it with this replicant, especially because
                    // the caller has no idea this happened. so... sigh ... instead of returning the new object return the one that
                    // was just killed off but make it contain everything the new document loaded.
                    docContent = docContent.Copy(new ResolveOptions(docContainer, this.Ctx.Corpus.DefaultResolutionDirectives), docContainer) as CdmDocumentDefinition;
                }

                folder.Documents.Add(docContent, docName);

                docContent._fileSystemModifiedTime = fsModifiedTime;
                docContent.IsDirty = false;
            }

            return docContent;
        }

        // A manifest or document can be saved with a new or existing name. 
        // If saved with the same name, then consider this document 'clean' from changes. If saved with a back compat model or
        // to a different name, then the source object is still 'dirty'.
        // An option will cause us to also save any linked documents.
        internal async Task<bool> SaveDocumentAsAsync(CdmDocumentDefinition doc, CopyOptions options, string newName, bool saveReferenced = false)
        {
            // Find out if the storage adapter is able to write.
            string ns = doc.Namespace;
            if (string.IsNullOrWhiteSpace(ns))
                ns = this.Corpus.Storage.DefaultNamespace;
            var adapter = this.Corpus.Storage.FetchAdapter(ns);

            if (adapter == null)
            {
                Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Couldn't find a storage adapter registered for the namespace '{ns}'.", nameof(SaveDocumentAsAsync));
                return false;
            }
            else if (adapter.CanWrite() == false)
            {
                Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"The storage adapter '{ns}' claims it is unable to write files.", nameof(SaveDocumentAsAsync));
                return false;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(newName))
                {
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Document name cannot be null or empty.", nameof(SaveDocumentAsAsync));
                    return false;
                }

                // What kind of document is requested?
                // Check file extensions using a case-insensitive ordinal string comparison.
                string persistenceType = newName.EndWithOrdinalIgnoreCase(ModelJsonExtension)
                    ? ModelJson
                    : (newName.EndWithOrdinalIgnoreCase(OdiExtension) ? Odi : CdmFolder);

                if (persistenceType == Odi && !newName.EqualsWithOrdinalIgnoreCase(OdiExtension))
                {
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to persist '{newName}', as it's not an acceptable file name. It must be {OdiExtension}.", nameof(SaveDocumentAsAsync));
                    return false;
                }

                if (persistenceType == ModelJson && !newName.EqualsWithOrdinalIgnoreCase(ModelJsonExtension))
                {
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to persist '{newName}', as it's not an acceptable file name. It must be {ModelJsonExtension}.", nameof(SaveDocumentAsAsync));
                    return false;
                }

                // Save the object into a json blob.
                ResolveOptions resOpt = new ResolveOptions() { WrtDoc = doc, Directives = new AttributeResolutionDirectiveSet() };
                dynamic persistedDoc;

                // Fetch the correct persistence class to use.
                Type persistenceClass = FetchRegisteredPersistenceFormat(newName);
                if (persistenceClass != null)
                {
                    try
                    {
                        MethodInfo method = persistenceClass.GetMethod(nameof(ToData));
                        object[] parameters = new object[] { doc, resOpt, options };

                        // Check if ToData() is asynchronous for this persistence class.
                        if (!isRegisteredPersistenceAsync.ContainsKey(persistenceClass))
                        {
                            // Cache whether this persistence class has async methods.
                            isRegisteredPersistenceAsync.TryAdd(persistenceClass, (bool)persistenceClass.GetField("IsPersistenceAsync").GetValue(null));
                        }

                        if (isRegisteredPersistenceAsync[persistenceClass])
                        {
                            // We don't know what the return type of ToData() is going to be and Task<T> is not covariant, 
                            // so we can't use Task<dynamic> here. Instead, we just await on a Task object without a return value 
                            // and fetch the Result property from it, which will have the result of ToData().
                            var task = (Task)method.Invoke(null, parameters);
                            await task;
                            persistedDoc = task.GetType().GetProperty("Result").GetValue(task);
                        }
                        else
                        {
                            persistedDoc = method.Invoke(null, parameters);
                        }
                    }
                    catch (Exception e)
                    {
                        Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Could not persist file '{newName}'. Reason '{e.Message}'.", nameof(SaveDocumentAsAsync));
                        return false;
                    }
                }
                else
                {
                    // Could not find a registered persistence class to handle this document type.
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Could not find a persistence class to handle the file '{newName}'.", nameof(SaveDocumentAsAsync));
                    return false;
                }

                if (persistedDoc == null)
                {
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to persist '{newName}'.", nameof(SaveDocumentAsAsync));
                    return false;
                }

                if (persistenceType == Odi)
                {
                    await this.SaveOdiDocuments(persistedDoc, adapter, newName);
                    return true;
                }

                // turn the name into a path
                string newPath = $"{doc.FolderPath}{newName}";
                newPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(newPath, doc);
                if (newPath.StartsWith($"{ns}:"))
                    newPath = newPath.Slice(ns.Length + 1);
                // ask the adapter to make it happen
                try
                {
                    var content = JsonConvert.SerializeObject(persistedDoc, Formatting.Indented, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
                    await adapter.WriteAsync(newPath, content);

                    // Write the adapter's config.
                    if (options.IsTopLevelDocument)
                    {
                        await this.Corpus.Storage.SaveAdaptersConfigAsync("/config.json", adapter);

                        // The next document won't be top level, so reset the flag.
                        options.IsTopLevelDocument = false;
                    }
                }
                catch (Exception e)
                {
                    Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to write to the file '{newName}' for reason {e.Message}.", nameof(SaveDocumentAsAsync));
                    return false;
                }

                // if we also want to save referenced docs, then it depends on what kind of thing just got saved
                // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
                // definition will save imports, manifests will save imports, schemas, sub manifests
                if (saveReferenced && persistenceType == CdmFolder)
                {
                    if (await doc.SaveLinkedDocuments(options) == false)
                    {
                        Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx, $"Failed to save linked documents for file '{newName}'.", nameof(SaveDocumentAsAsync));
                        return false;
                    }
                }

                return true;
            }
        }

        internal async Task SaveOdiDocuments(dynamic doc, StorageAdapter adapter, string newName)
        {
            if (doc == null)
            {
                throw new ArgumentNullException($"Failed to persist document because {nameof(doc)} is null.");
            }

            // Ask the adapter to make it happen.
            try
            {
                var oldDocumentPath = doc.DocumentPath;
                var newDocumentPath = oldDocumentPath.Substring(0, oldDocumentPath.Length - OdiExtension.Length) + newName;
                // Remove namespace from path
                Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(newDocumentPath);
                if (pathTuple == null)
                {
                    Logger.Error(nameof(PersistenceLayer), this.Ctx, "The object path cannot be null or empty.", nameof(SaveOdiDocuments));
                    return;
                }
                var content = JsonConvert.SerializeObject(doc, Formatting.Indented, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
                await adapter.WriteAsync(pathTuple.Item2, content);
            }
            catch (Exception e)
            {
                Logger.Error(nameof(PersistenceLayer), (ResolveContext)this.Ctx,
                    $"Failed to write to the file '{doc.DocumentPath}' for reason {e.Message}.", nameof(SaveOdiDocuments));
            }

            // Save linked documents.
            if (doc.LinkedDocuments != null)
            {
                foreach (var linkedDoc in doc.LinkedDocuments)
                {
                    await SaveOdiDocuments(linkedDoc, adapter, newName);
                }
            }
        }

        /// <summary>
        /// Registers a persistence class to use for loading and saving documents in a specific format.
        /// </summary>
        /// <param name="persistenceClassName">The full name (including the namespace) of the persistence class.</param>
        /// <param name="assemblyName">The name of the assembly that contains this persistence class to load.</param>
        public void RegisterFormat(string persistenceClassName, string assemblyName = null)
        {
            try
            {
                Assembly assembly;
                if (assemblyName == null)
                {
                    // If an assembly name is not provided, just use the assembly that contains the code that is currently executing.
                    assembly = Assembly.GetExecutingAssembly();
                }
                else
                {
                    assembly = Assembly.Load(assemblyName);
                }

                Type persistenceClass = assembly.GetType(persistenceClassName);

                // Get the file formats that this persistence class supports.
                string[] formats = (string[])persistenceClass.GetField("Formats").GetValue(null);
                foreach (string format in formats)
                {
                    registeredPersistenceFormats.TryAdd(format, persistenceClass);
                }
            }
            catch (Exception e)
            {
                Logger.Info(nameof(PersistenceLayer), this.Ctx, $"Unable to register persistence class {persistenceClassName}. Reason: {e.Message}.", nameof(RegisterFormat));
            }
        }

        /// <summary>
        /// Fetches the registered persistence class type to handle the specified document format.
        /// </summary>
        /// <param name="docName">The name of the document. The document's extension is used to determine which persistence class to use.</param>
        /// <returns>The registered persistence class type.</returns>
        private Type FetchRegisteredPersistenceFormat(string docName)
        {
            // sort keys so that longest file extension is tested first
            // i.e. .manifest.cdm.json is checked before .cdm.json
            var sortedKeys = registeredPersistenceFormats.Keys.ToList();
            sortedKeys.Sort((a,b) => a.Length < b.Length ? 1 : -1);

            foreach (string key in sortedKeys)
            {
                registeredPersistenceFormats.TryGetValue(key, out Type registeredPersistenceFormat);
                // Find the persistence class to use for this document.
                if (registeredPersistenceFormat != null && docName.EndWithOrdinalIgnoreCase(key))
                    return registeredPersistenceFormat;
            }
            return null;
        }
    }
}
