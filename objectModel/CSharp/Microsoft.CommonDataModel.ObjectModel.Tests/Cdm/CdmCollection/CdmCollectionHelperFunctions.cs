namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;

    public static class CdmCollectionHelperFunctions
    {

        /// <summary>
        /// Creates a manifest used for the tests.
        /// </summary>
        /// <param name="localRootPath">A string used as root path for "local" namespace.</param>
        /// <returns>Created corpus.</returns>
        public static CdmManifestDefinition GenerateManifest(string localRootPath)
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";

            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            cdmCorpus.Storage.Mount("local", new LocalAdapter(localRootPath));

            // Add CDM namespace.
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(localRootPath));

            var manifest = new CdmManifestDefinition(cdmCorpus.Ctx, "manifest");
            manifest.FolderPath = "/";
            manifest.Namespace = "local";

            return manifest;
        }

        /// <summary>
        /// For an entity, it creates a document that will contain the entity.
        /// </summary>
        /// <param name="cdmCorpus">The corpus everything belongs to.</param>
        /// <param name="entity">The entity we want a document for.</param>
        /// <returns>A document containing desired entity.</returns>
        public static CdmDocumentDefinition CreateDocumentForEntity(CdmCorpusDefinition cdmCorpus, CdmEntityDefinition entity, string nameSpace = "local")
        {
            var cdmFolderDef = cdmCorpus.Storage.FetchRootFolder(nameSpace);
            var entityDoc = cdmCorpus.MakeObject<CdmDocumentDefinition>(Enums.CdmObjectType.DocumentDef, $"{entity.EntityName}.cdm.json", false);

            cdmFolderDef.Documents.Add(entityDoc);
            entityDoc.Definitions.Add(entity);
            return entityDoc;
        }
    }
}
