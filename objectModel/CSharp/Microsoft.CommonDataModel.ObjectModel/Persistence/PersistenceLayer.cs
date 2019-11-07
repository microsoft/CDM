//-----------------------------------------------------------------------
// <copyright file="PersistenceLayer.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Common;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Text;
    using System.Threading.Tasks;

    public static class PersistenceLayer
    {
        private static readonly IDictionary<string, IPersistenceType> persistenceTypes = new Dictionary<string, IPersistenceType>
        {
            { "CdmFolder", new CdmFolderType() }
        };

        public static T FromData<T, U>(CdmCorpusContext ctx, U obj, string persistenceTypeName)
            where T : CdmObject
        {
            var persistenceClass = FetchPersistenceClass<T>(persistenceTypeName);
            var method = persistenceClass.GetMethod("FromData");
            if (method == null)
            {
                string persistenceClassName = typeof(T).Name;
                throw new Exception($"Persistence class {persistenceClassName} in type {persistenceTypeName} does not implement FromData.");
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
                throw new Exception($"Persistence class {persistenceClassName} in type {persistenceTypeName} does not implement ToData.");
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

        public static async Task<CdmDocumentDefinition> LoadDocumentFromPathAsync(CdmFolderDefinition folder, string docName)
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
            CdmCorpusContext ctx = folder.Ctx;
            string docPath = folder.FolderPath + docName;
            StorageAdapter adapter = ctx.Corpus.Storage.FetchAdapter(folder.Namespace);

            try
            {
                if (adapter.CanRead())
                {
                    jsonData = await adapter.ReadAsync(docPath);
                    fsModifiedTime = await adapter.ComputeLastModifiedTimeAsync(docPath);
                    Logger.Info(nameof(CdmFolderDefinition), ctx, $"read file: {docPath}", "LoadDocumentFromPathAsync");
                }
            }
            catch (Exception e)
            {
                Logger.Error(nameof(CdmFolderDefinition), (ResolveContext)ctx, $"Could not read '{docPath}' from the '{ctx.Corpus.Namespace}' namespace. Reason '{e.Message}'", "LoadDocumentFromPathAsync");
                return null;
            }

            try
            {
                // Check file extensions, which performs a case-insensitive ordinal string comparison
                if (docPath.EndsWith(CdmCorpusDefinition.FetchManifestExtension(), StringComparison.OrdinalIgnoreCase)
                    || docPath.EndsWith(CdmCorpusDefinition.FetchFolioExtension(), StringComparison.OrdinalIgnoreCase))
                {
                    docContent = ManifestPersistence.FromData(ctx, docName, folder.Namespace, folder.FolderPath, JsonConvert.DeserializeObject<ManifestContent>(jsonData)) as CdmDocumentDefinition;
                }
                else if (docPath.EndsWith(CdmCorpusDefinition.FetchModelJsonExtension(), StringComparison.OrdinalIgnoreCase))
                {
                    docContent = await ModelJson.ManifestPersistence.FromData(ctx, JsonConvert.DeserializeObject<Model>(jsonData), folder);
                }
                else
                {
                    docContent = DocumentPersistence.FromData(ctx, docName, folder.Namespace, folder.FolderPath, JsonConvert.DeserializeObject<DocumentContent>(jsonData));
                }
            }
            catch (Exception e)
            {
                Logger.Error(nameof(CdmFolderDefinition), (ResolveContext)ctx, $"Could not convert '{docPath}'. Reason '{e.Message}'", "LoadDocumentFromPathAsync");
                return null;
            }

            // Add document to the folder, this sets all the folder/path things, caches name to content association and may trigger indexing on content
            if (docContent != null)
            {            
                folder.Documents.Add(docContent, docName);

                docContent._fileSystemModifiedTime = fsModifiedTime;
                docContent.IsDirty = false;
            }

            return docContent;
        }
    }
}
