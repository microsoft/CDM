// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Runtime.CompilerServices;

#if INTERNAL_VSTS
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Versioning" + Microsoft.CommonDataModel.AssemblyRef.TestPublicKey)]
#else
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Versioning")]
#endif
namespace Microsoft.CommonDataModel.ObjectModel.Persistence
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Common;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class PersistenceLayer
    {
        private static readonly string Tag = nameof(PersistenceLayer);

        internal const string FolioExtension = ".folio.cdm.json";
        internal const string ManifestExtension = ".manifest.cdm.json";

        internal const string CdmExtension = ".cdm.json";
        internal const string ModelJsonExtension = "model.json";

        internal const string CdmFolder = "CdmFolder";
        internal const string ModelJson = "ModelJson";
        internal const string Syms = "Syms";

        internal const string SymsDatabases = "databases.manifest.cdm.json";

        internal CdmCorpusDefinition Corpus { get; }
        internal CdmCorpusContext Ctx => this.Corpus.Ctx;

        private static IReadOnlyDictionary<string, IPersistenceType> persistenceTypes => new Dictionary<string, IPersistenceType>
        {
            { CdmFolder, new CdmFolderType() },
            { ModelJson, new ModelJsonType() },
            { Syms, new SymsFolderType() },
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
                DateParseHandling = DateParseHandling.None,
            };

            CdmDocumentDefinition docContent = null;
            string jsonData = null;
            DateTimeOffset? fsModifiedTime = null;
            string docPath = folder.FolderPath + docName;
            StorageAdapterBase adapter = this.Corpus.Storage.FetchAdapter(folder.Namespace);

            try
            {
                if (adapter.CanRead())
                {
                    // log message used by navigator, do not change or remove
                    Logger.Debug(this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, $"request file: {docPath}");
                    jsonData = await adapter.ReadAsync(docPath);
                    if (StringUtils.IsBlankByCdmStandard(jsonData))
                    {
                        string errorMsg = "Json Data is null or empty.";
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.ErrPersistFileReadFailure, docPath, folder.Namespace, errorMsg);
                        return null;
                    }
                    // log message used by navigator, do not change or remove
                    Logger.Debug(this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, $"received file: {docPath}");
                }
                else
                {
                    throw new Exception("Storage Adapter is not enabled to read.");
                }
            }
            catch (Exception e)
            {
                // log message used by navigator, do not change or remove
                Logger.Debug(this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, $"fail file: {docPath}");

                // When shallow validation is enabled, log messages about being unable to find referenced documents as warnings instead of errors.
                if (resOpt != null && resOpt.ShallowValidation)
                {
                    Logger.Warning((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.WarnPersistFileReadFailure, docPath, folder.Namespace, e.Message);
                }
                else
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.ErrPersistFileReadFailure, docPath, folder.Namespace, e.Message);
                }
                return null;
            }

            try
            {
                fsModifiedTime = await adapter.ComputeLastModifiedTimeAsync(docPath);
            }
            catch (Exception e)
            {
                Logger.Warning((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.WarnPersistFileModTimeFailure, e.Message);
            }

            if (StringUtils.IsBlankByCdmStandard(docName))
            {
                Logger.Error((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.ErrPersistNullDocName);
                return null;
            }

            // If loading an model.json file, check that it is named correctly.
            if (docName.EndWithOrdinalIgnoreCase(ModelJsonExtension) && !docName.EqualsWithOrdinalIgnoreCase(ModelJsonExtension))
            {
                Logger.Error((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.ErrPersistDocNameLoadFailure, docName, ModelJsonExtension);
                return null;
            }

            try
            {
                if (Persistence.Syms.Utils.CheckIfSymsAdapter(adapter))
                {
                    if (docName.EqualsWithIgnoreCase(SymsDatabases))
                    {
                        SymsDatabasesResponse databases = JsonConvert.DeserializeObject<SymsDatabasesResponse>(jsonData);
                        docContent = Persistence.Syms.ManifestDatabasesPersistence.FromObject(Ctx,docName, folder.Namespace, folder.FolderPath, databases) as CdmDocumentDefinition;
                    }
                    else if (docName.Contains(ManifestExtension))
                    {
                        SymsManifestContent manifestContent =await Persistence.Syms.Utils.GetSymsModel(adapter, jsonData, docPath);
                        docContent = Persistence.Syms.ManifestPersistence.FromObject(Ctx, docName, folder.Namespace, folder.FolderPath, manifestContent) as CdmDocumentDefinition;
                    }
                    else if (docName.Contains(CdmExtension))
                    {
                        // specific table
                        TableEntity table = JsonConvert.DeserializeObject<TableEntity>(jsonData);
                        docContent = Persistence.Syms.DocumentPersistence.FromObject(this.Ctx, folder.Namespace, folder.FolderPath, table);
                    }
                    else
                    {
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.ErrPersistSymsUnsupportedCdmConversion, docName);
                        return null;
                    }
                }
                // Check file extensions, which performs a case-insensitive ordinal string comparison
                else if (docName.EndWithOrdinalIgnoreCase(ManifestExtension) || docName.EndWithOrdinalIgnoreCase(FolioExtension))
                {
                    docContent = Persistence.CdmFolder.ManifestPersistence.FromObject(Ctx, docName, folder.Namespace, folder.FolderPath, JsonConvert.DeserializeObject<ManifestContent>(jsonData)) as CdmDocumentDefinition;
                }
                else if (docName.EndWithOrdinalIgnoreCase(ModelJsonExtension))
                {
                    docContent = await Persistence.ModelJson.ManifestPersistence.FromObject(this.Ctx, JsonConvert.DeserializeObject<Model>(jsonData), folder);
                }
                else if (docName.EndWithOrdinalIgnoreCase(CdmExtension))
                {
                    docContent = Persistence.CdmFolder.DocumentPersistence.FromObject(this.Ctx, docName, folder.Namespace, folder.FolderPath, JsonConvert.DeserializeObject<Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types.DocumentContent>(jsonData));
                }
                else
                {
                    // Could not find a registered persistence class to handle this document type.
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.ErrPersistClassMissing, docName);
                    return null;
                }
            }
            catch (Exception e)
            {
                var errorMsg = e.Message;
                if (e.InnerException != null)
                {
                    errorMsg += $" InnerException: {e.InnerException.Message}";
                }
                Logger.Error((ResolveContext)this.Ctx, Tag, nameof(LoadDocumentFromPathAsync), docPath, CdmLogCode.ErrPersistDocConversionFailure, docName, errorMsg);
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

                if (folder.Documents.AllItems.Find(x => x.Id == docContent.Id) == null)
                {
                    folder.Documents.Add(docContent, docName);
                }

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
            string ns = StorageUtils.SplitNamespacePath(newName).Item1;
            if (StringUtils.IsBlankByCdmStandard(ns))
            {
                ns = doc.Namespace;
                if (StringUtils.IsBlankByCdmStandard(ns))
                {
                    ns = this.Corpus.Storage.DefaultNamespace;
                }
            }

            var adapter = this.Corpus.Storage.FetchAdapter(ns);

            if (adapter == null)
            {
                Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistAdapterNotFoundForNamespace, ns);
                return false;
            }
            else if (adapter.CanWrite() == false)
            {
                Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistAdapterWriteFailure, ns);
                return false;
            }
            else
            {
                if (StringUtils.IsBlankByCdmStandard(newName))
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistNullDocName);
                    return false;
                }

                // What kind of document is requested?
                // Check file extensions using a case-insensitive ordinal string comparison.
                string persistenceType;

                if (Persistence.Syms.Utils.CheckIfSymsAdapter(adapter))
                {
                    if (newName.Equals(SymsDatabases))
                    {
                        // Not supporting saving list of databases at once. May cause perf issue.
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistSymsUnsupportedManifest, newName);
                        return false;
                    }
                    if (!newName.EndWithOrdinalIgnoreCase(ManifestExtension)
                        && !newName.EndWithOrdinalIgnoreCase(CdmExtension)
                        )
                    {
                        // syms support *.cdm and *.manifest.cdm only
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistSymsUnsupportedCdmConversion, newName);
                        return false;
                    }
                    persistenceType = Syms;
                    options.PersistenceTypeName = Syms;
                }
                else
                {
                    if (newName.EndWithOrdinalIgnoreCase(ModelJsonExtension))
                        persistenceType = ModelJson;
                    else
                        persistenceType = CdmFolder;
                }

                if (persistenceType == ModelJson && !newName.EqualsWithOrdinalIgnoreCase(ModelJsonExtension))
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistFailure, newName, ModelJsonExtension);
                    return false;
                }

                // Save the object into a json blob.
                ResolveOptions resOpt = new ResolveOptions() { WrtDoc = doc, Directives = new AttributeResolutionDirectiveSet() };
                dynamic persistedDoc = null;

                try
                {
                   if (newName.EndWithOrdinalIgnoreCase(ModelJsonExtension) || newName.EndWithOrdinalIgnoreCase(ManifestExtension)
                        || newName.EndWithOrdinalIgnoreCase(FolioExtension))
                    {
                        if (persistenceType == "CdmFolder")
                        {
                            persistedDoc = Persistence.CdmFolder.ManifestPersistence.ToData(doc as CdmManifestDefinition, resOpt, options);
                        }
                        else if (persistenceType == Syms)
                        {
                            persistedDoc = await ConvertManifestToSyms(doc as CdmManifestDefinition, adapter, newName, resOpt, options);
                        }
                        else
                        {
                            if (!newName.EqualsWithOrdinalIgnoreCase(ModelJsonExtension))
                            {
                                Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistFailure, newName, ModelJsonExtension);
                                return false;
                            }
                            persistedDoc = await Persistence.ModelJson.ManifestPersistence.ToData(doc as CdmManifestDefinition, resOpt, options);
                        }
                    }
                    
                    else if (newName.EndWithOrdinalIgnoreCase(CdmExtension))
                    {
                        if (persistenceType == "CdmFolder")
                        {
                            persistedDoc = Persistence.CdmFolder.DocumentPersistence.ToData(doc, resOpt, options);
                        }
                        else if (persistenceType == Syms)
                        {
                            persistedDoc = await ConvertDocToSymsTable(Corpus.Ctx, doc, adapter, newName, resOpt, options);
                        }
                        
                    }
                    else
                    {
                        // Could not find a registered persistence class to handle this document type.
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistClassMissing, newName);
                        return false;
                    }
                }
                catch (Exception e)
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistFilePersistError, newName, e.Message);
                    return false;
                }

                if (persistedDoc == null)
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistFilePersistFailed, newName);
                    return false;
                }

                // turn the name into a path
                string newPath = $"{doc.FolderPath}{newName}";
                newPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(newPath, doc);
                if (newPath.StartsWith($"{ns}:"))
                    newPath = newPath.Slice(ns.Length + 1);
                // ask the adapter to make it happen
                try
                {
                    if (persistenceType == Syms)
                    {
                        if (newName.EndWithOrdinalIgnoreCase(ManifestExtension))
                        {
                            await Persistence.Syms.Utils.CreateOrUpdateSymsEntities(persistedDoc, adapter);
                        }
                        else if (newName.EndWithOrdinalIgnoreCase(CdmExtension))
                        {
                            TableEntity tableEntity = (TableEntity)persistedDoc;
                            await Persistence.Syms.Utils.CreateOrUpdateTableEntity(tableEntity, adapter);
                        }
                    }
                    else
                    {
                        var content = JsonConvert.SerializeObject(persistedDoc, Formatting.Indented, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
                        await adapter.WriteAsync(newPath, content);
                    }

                    doc._fileSystemModifiedTime = await adapter.ComputeLastModifiedTimeAsync(newPath);

                    // Write the adapter's config.
                    if (options.SaveConfigFile != false && options.IsTopLevelDocument && persistenceType != Syms)
                    {
                        await this.Corpus.Storage.SaveAdaptersConfigAsync("/config.json", adapter);

                        // The next document won't be top level, so reset the flag.
                        options.IsTopLevelDocument = false;
                    }
                }
                catch (Exception e)
                {
                    Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistFileWriteFailure, newName, e.Message);
                    return false;
                }

                // if we also want to save referenced docs, then it depends on what kind of thing just got saved
                // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
                // definition will save imports, manifests will save imports, schemas, sub manifests
                if (saveReferenced && persistenceType == CdmFolder)
                {
                    if (await doc.SaveLinkedDocuments(options) == false)
                    {
                        Logger.Error((ResolveContext)this.Ctx, Tag, nameof(SaveDocumentAsAsync), doc.AtCorpusPath, CdmLogCode.ErrPersistSaveLinkedDocs, newName);
                        return false;
                    }
                }

                if (newName.EndWithOrdinalIgnoreCase(ManifestExtension))
                {
                    foreach (var entity in (doc as CdmManifestDefinition).Entities)
                    {
                        (entity as CdmLocalEntityDeclarationDefinition).ResetLastFileModifiedOldTime();
                    }
                    foreach (var relationship in (doc as CdmManifestDefinition).Relationships)
                    {
                        (relationship as CdmE2ERelationship).ResetLastFileModifiedOldTime();
                    }
                }

                return true;
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
            sortedKeys.Sort((a, b) => a.Length < b.Length ? 1 : -1);

            foreach (string key in sortedKeys)
            {
                registeredPersistenceFormats.TryGetValue(key, out Type registeredPersistenceFormat);
                // Find the persistence class to use for this document.
                if (registeredPersistenceFormat != null && docName.EndWithOrdinalIgnoreCase(key))
                    return registeredPersistenceFormat;
            }
            return null;
        }

        /// <summary>
        /// Convert to SyMs object from Manifest object.
        /// </summary>
        internal static async Task<SymsManifestContent> ConvertManifestToSyms(CdmManifestDefinition doc, StorageAdapterBase adapter, string path,
            ResolveOptions resOpt, CopyOptions options)
        {
            DatabaseEntity databaseEntity = null;
            bool isDeltaSync = true;
            IList<TableEntity> existingSymsTables = null;
            IList<RelationshipEntity> existingSymsRelationshipEntities = null;
            try
            {
                databaseEntity = JsonConvert.DeserializeObject<DatabaseEntity>(await adapter.ReadAsync(path));
            }
            catch (Exception e)
            {
                if (e.Message.Contains("NotFound"))
                {
                    isDeltaSync = false;
                }
                else
                {
                    throw;
                }
            }

            if (isDeltaSync)
            {
                var entities = await adapter.ReadAsync($"/{databaseEntity.Name}/{databaseEntity.Name}.manifest.cdm.json/entitydefinition");
                existingSymsTables = JsonConvert.DeserializeObject<SymsTableResponse>(entities).Tables;

                var realtionships = await adapter.ReadAsync($"/{databaseEntity.Name}/{databaseEntity.Name}.manifest.cdm.json/relationships");
                existingSymsRelationshipEntities = JsonConvert.DeserializeObject<SymsRelationshipResponse>(realtionships).Relationships;
            }

            return await Persistence.Syms.ManifestPersistence.ToDataAsync(doc, resOpt, options, isDeltaSync, existingSymsTables, existingSymsRelationshipEntities);
        }

        /// <summary>
        /// Convert to SyMs table object from CDM object.
        /// </summary>
        internal static async Task<TableEntity> ConvertDocToSymsTable(CdmCorpusContext ctx, CdmDocumentDefinition doc, StorageAdapterBase adapter, string name,
            ResolveOptions resOpt, CopyOptions options)
        {
            TableEntity existingTableEntity = JsonConvert.DeserializeObject<TableEntity>(await adapter.ReadAsync(name));
            return Persistence.Syms.DocumentPersistence.ToData(ctx, doc, ((JToken)existingTableEntity.Properties).ToObject<TableProperties>(), resOpt, options);
        }
    }
}
