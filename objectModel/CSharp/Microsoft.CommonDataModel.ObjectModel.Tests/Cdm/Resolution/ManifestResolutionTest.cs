// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Resolution
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ManifestResolutionTest
    {
        private string testsSubpath = Path.Combine("Cdm", "Resolution", "ManifestResolutionTest");

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

        /// <summary>
        /// Test that resolving a manifest that hasn't been added to a folder doesn't throw any exceptions.
        /// </summary>
        [TestMethod]
        public async Task TestResolvingManifestNotInFolder()
        {
            try
            {
                var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrResolveManifestFailed };
                var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestResolvingManifestNotInFolder), expectedCodes: expectedLogCodes, noInputAndOutputFolder: true);

                var manifest = cdmCorpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "test");
                var entity = cdmCorpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, "entity");
                var document = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"entity{PersistenceLayer.CdmExtension}");
                document.Definitions.Add(entity);

                // Don't add the document containing the entity to a folder either.
                manifest.Entities.Add(entity);
                await manifest.CreateResolvedManifestAsync("resolved", null);

                TestHelper.AssertCdmLogCodeEquality(cdmCorpus, CdmLogCode.ErrResolveManifestFailed, true);
            }
            catch (Exception)
            {
                Assert.Fail("Exception should not be thrown when resolving a manifest that is not in a folder.");
            }
        }

        /// <summary>
        /// Test that saving a resolved manifest will not cause original logical entity doc to be marked dirty.
        /// </summary>
        [TestMethod]
        public async Task TestLinkedResolvedDocSavingNotDirtyingLogicalEntities()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestLinkedResolvedDocSavingNotDirtyingLogicalEntities");

            var manifestAbstract = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "default");
            
            manifestAbstract.Imports.Add("cdm:/foundations.cdm.json");
            manifestAbstract.Entities.Add("B", "local:/B.cdm.json/B");
            corpus.Storage.FetchRootFolder("output").Documents.Add(manifestAbstract);

            var manifestResolved = await manifestAbstract.CreateResolvedManifestAsync("default-resolved", "{n}/{n}.cdm.json");

            Assert.IsTrue(!corpus.Storage.NamespaceFolders["local"].Documents[0].IsDirty
                            && !corpus.Storage.NamespaceFolders["local"].Documents[1].IsDirty,
                            "Referenced logical document should not become dirty when manifest is resolved");
        }

        /// <summary>
        /// Test that correct error is shown when trying to create a resolved manifest with a name that already exists
        /// </summary>
        [TestMethod]
        public async Task TestResolvingManifestWithSameName()
        {
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrResolveManifestExists };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolvingManifestWithSameName", expectedCodes: expectedLogCodes);

            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "test");
            corpus.Storage.NamespaceFolders["local"].Documents.Add(manifest);
            var resManifest = await manifest.CreateResolvedManifestAsync(manifest.Name, "{n}/{n}.cdm.json");

            Assert.IsNull(resManifest);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrResolveManifestExists, true);
        }
    }
}
