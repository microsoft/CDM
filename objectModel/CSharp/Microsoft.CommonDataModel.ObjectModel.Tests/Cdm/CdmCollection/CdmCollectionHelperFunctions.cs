namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;

    public static class CdmCollectionHelperFunctions
    {

        /// <summary>
        /// Creates a Corpus used for the tests.
        /// </summary>
        /// <param name="localRootPath">A string used as root path for "local" namespace.</param>
        /// <returns>Created corpus.</returns>
        public static CdmManifestDefinition GenerateManifest(string localRootPath)
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";

            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            cdmCorpus.Storage.Mount("local", new LocalAdapter(localRootPath));

            // add cdm namespace
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(localRootPath));

            var manifest = new CdmManifestDefinition(cdmCorpus.Ctx, "manifest");
            manifest.FolderPath = "/";
            manifest.Namespace = "local";

            return manifest;
        }
    }
}
