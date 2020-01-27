namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Resolution
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Threading.Tasks;

    [TestClass]
    public class ManifestResolveTest
    {
        /// <summary>
        /// Test if a manifest resolves correctly a referenced entity declaration 
        /// </summary>
        [TestMethod]
        public async Task TestReferencedEntityDeclarationResolution()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SchemaDocumentsPath));
            cdmCorpus.Storage.DefaultNamespace = "cdm";

            var manifest = new CdmManifestDefinition(cdmCorpus.Ctx, "manifest");

            manifest.Entities.Add("Account", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");

            var referencedEntity = new CdmReferencedEntityDeclarationDefinition(cdmCorpus.Ctx, "Address");
            referencedEntity.EntityPath = "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/electronicMedicalRecords.manifest.cdm.json/Address";
            manifest.Entities.Add(referencedEntity);

            cdmCorpus.Storage.FetchRootFolder("cdm").Documents.Add(manifest);

            var resolvedManifest = await manifest.CreateResolvedManifestAsync("resolvedManifest", null);

            Assert.AreEqual(2, resolvedManifest.Entities.Count);
            Assert.AreEqual("core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/resolved/Account.cdm.json/Account", resolvedManifest.Entities[0].EntityPath);
            Assert.AreEqual("cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/electronicMedicalRecords.manifest.cdm.json/Address", resolvedManifest.Entities[1].EntityPath);
        }
    }
}
