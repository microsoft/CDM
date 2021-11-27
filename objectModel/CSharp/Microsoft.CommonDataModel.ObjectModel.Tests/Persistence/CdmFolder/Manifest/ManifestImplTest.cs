// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ManifestImplTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "Manifest");

        /// <summary>
        /// Testing for manifest impl instance with no entities and no sub manifests.
        /// </summary>
        [TestMethod]
        public void TestLoadFolderWithNoEntityFolders()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadFolderWithNoEntityFolders", "empty.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "cdmTest", "someNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.Schema, "CdmManifestDefinition.cdm.json");
            Assert.AreEqual(cdmManifest.ManifestName, "cdmTest");
            Assert.AreEqual(cdmManifest.JsonSchemaSemanticVersion, "1.0.0");
            Assert.AreEqual(TimeUtils.GetFormattedDateString((DateTimeOffset)cdmManifest.LastFileModifiedTime), "2008-09-15T23:53:23.000Z");
            Assert.AreEqual(cdmManifest.Explanation, "test cdm folder for cdm version 1.0+");
            Assert.AreEqual(cdmManifest.Imports.Count, 1);
            Assert.AreEqual(cdmManifest.Imports[0].CorpusPath, "/primitives.cdm.json");
            Assert.AreEqual(cdmManifest.Entities.Count, 0);
            Assert.AreEqual(cdmManifest.ExhibitsTraits.Count, 1);
            Assert.AreEqual(cdmManifest.SubManifests.Count, 0);
        }

        /// <summary>
        /// Testing for manifest impl instance with everything.
        /// </summary>
        [TestMethod]
        public void TestManifestWithEverything()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestManifestWithEverything", "complete.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "docName", "someNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.SubManifests.Count, 1);
            Assert.AreEqual(cdmManifest.Entities.Count, 2);
            Assert.AreEqual("cdmTest", cdmManifest.ManifestName);

            content = TestHelper.GetInputFileContent(testsSubpath, "TestManifestWithEverything", "noname.manifest.cdm.json");
            cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "docName.manifest.cdm.json", "someNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.SubManifests.Count, 1);
            Assert.AreEqual(cdmManifest.Entities.Count, 2);
            Assert.AreEqual("docName", cdmManifest.ManifestName);
        }

        /// <summary>
        /// Testing for back-comp folio loading.
        /// </summary>
        [TestMethod]
        public void TestFolioWithEverything()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestFolioWithEverything", "complete.folio.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "docName", "someNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(1, cdmManifest.SubManifests.Count);
            Assert.AreEqual(2, cdmManifest.Entities.Count);
            Assert.AreEqual("cdmTest", cdmManifest.ManifestName);

            content = TestHelper.GetInputFileContent(testsSubpath, "TestFolioWithEverything", "noname.folio.cdm.json");
            cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "docName.folio.cdm.json", "someNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(1, cdmManifest.SubManifests.Count);
            Assert.AreEqual(2, cdmManifest.Entities.Count);
            Assert.AreEqual("docName", cdmManifest.ManifestName);
        }

        /// <summary>
        /// Test for copy data.
        /// </summary>
        [TestMethod]
        public void TestManifestForCopyData()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestManifestForCopyData", "complete.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "docName", "someNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            ManifestContent manifestObject = ManifestPersistence.ToData(cdmManifest, null, null);
            Assert.AreEqual(manifestObject.Schema, "CdmManifestDefinition.cdm.json");
            Assert.AreEqual(manifestObject.JsonSchemaSemanticVersion, "1.0.0");
            Assert.AreEqual(manifestObject.DocumentVersion, "2.0.0");
            Assert.AreEqual(manifestObject.ManifestName, "cdmTest");
            Assert.AreEqual(manifestObject.Explanation, "test cdm folder for cdm version 1.0+");
            Assert.AreEqual(manifestObject.Imports.Count, 1);
            Assert.AreEqual(manifestObject.Imports[0].CorpusPath, "/primitives.cdm.json");
            Assert.AreEqual(manifestObject.ExhibitsTraits.Count, 1);
            Assert.AreEqual(manifestObject.Entities.Count, 2);
            Assert.AreEqual(manifestObject.Entities[0]["entityName"], "testEntity");
            Assert.AreEqual(manifestObject.SubManifests.Count, 1);
            Assert.AreEqual(manifestObject.SubManifests[0].Definition, "test definition");
            Assert.AreEqual(manifestObject.LastFileModifiedTime, null);
        }

        /// <summary>
        /// Test modified times for manifest and files beneath it
        /// </summary>
        [TestMethod]
        public async Task TestLoadsAndSetsTimesCorrectly()
        {
            var inputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestLoadsAndSetsTimesCorrectly");
            var timeBeforeLoad = DateTime.Now;

            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestLoadsAndSetsTimesCorrectly");
            cdmCorpus.SetEventCallback(new EventCallback { 
                Invoke = (CdmStatusLevel level, string message) => Assert.Fail($"Unexpected log: {message}") 
            }, CdmStatusLevel.Warning);
            cdmCorpus.Storage.Mount("someNamespace", new LocalAdapter(inputPath));

            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("someNamespace:/default.manifest.cdm.json");
            var statusTimeAtLoad = cdmManifest.LastFileStatusCheckTime;
            // hard coded because the time comes from inside the file
            Assert.AreEqual(TimeUtils.GetFormattedDateString(statusTimeAtLoad), "2019-02-01T15:36:19.410Z");

            Assert.IsNotNull(cdmManifest._fileSystemModifiedTime);
            Assert.IsTrue(cdmManifest._fileSystemModifiedTime < timeBeforeLoad);

            System.Threading.Thread.Sleep(100);

            await cdmManifest.FileStatusCheckAsync();

            Assert.IsTrue(cdmManifest.LastFileStatusCheckTime > timeBeforeLoad);
            Assert.IsTrue(cdmManifest.LastFileStatusCheckTime > statusTimeAtLoad);
            Assert.AreEqual(cdmManifest.SubManifests.Count, 1);
            Assert.IsTrue(cdmManifest.SubManifests.AllItems[0].LastFileStatusCheckTime > timeBeforeLoad);
            Assert.AreEqual(cdmManifest.Entities.Count, 1);
            Assert.AreEqual(cdmManifest.Entities.AllItems[0].DataPartitions.Count, 1);

            var entity = cdmManifest.Entities.AllItems[0];
            var subManifest = cdmManifest.SubManifests.AllItems[0] as CdmManifestDeclarationDefinition;
            var maxTime = TimeUtils.MaxTime(entity.LastFileModifiedTime, subManifest.LastFileModifiedTime);
            Assert.AreEqual(TimeUtils.GetFormattedDateString(cdmManifest.LastChildFileModifiedTime), TimeUtils.GetFormattedDateString(maxTime));
        }

        /// <summary>
        /// Checks Absolute corpus path can be created with valid input.
        /// </summary>
        [TestMethod]
        public void TestValidRootPath()
        {
            var corpus = new CdmCorpusDefinition();
            // checks with null object
            var absolutePath = corpus.Storage.CreateAbsoluteCorpusPath("Abc/Def");
            Assert.AreEqual("/Abc/Def", absolutePath);

            absolutePath = corpus.Storage.CreateAbsoluteCorpusPath("/Abc/Def");
            Assert.AreEqual("/Abc/Def", absolutePath);

            absolutePath = corpus.Storage.CreateAbsoluteCorpusPath("cdm:/Abc/Def");
            Assert.AreEqual("cdm:/Abc/Def", absolutePath);

            absolutePath = corpus.Storage.CreateAbsoluteCorpusPath("Abc/Def",
                new CdmManifestDefinition(null, null) { Namespace = "", FolderPath = "Mnp/Qrs/" });
            Assert.AreEqual("Mnp/Qrs/Abc/Def", absolutePath);

            absolutePath = corpus.Storage.CreateAbsoluteCorpusPath("/Abc/Def",
                new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "Mnp/Qrs/" });
            Assert.AreEqual("cdm:/Abc/Def", absolutePath);

            absolutePath = corpus.Storage.CreateAbsoluteCorpusPath("Abc/Def",
                new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "Mnp/Qrs/" });
            Assert.AreEqual("cdm:Mnp/Qrs/Abc/Def", absolutePath);
        }

        /// <summary>
        /// FolderPath should always end with a /
        /// This checks the behavior if FolderPath does not end with a /
        /// ('/' should be appended and a warning be sent through callback function)
        /// </summary>
        [TestMethod]
        public void TestPathThatDoesNotEndInSlash()
        {
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.WarnStorageExpectedPathPrefix };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPathThatDoesNotEndInSlash), expectedCodes: expectedLogCodes, noInputAndOutputFolder: true);

            var absolutePath = corpus.Storage.CreateAbsoluteCorpusPath("Abc",
                new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "Mnp" });
            Assert.AreEqual("cdm:Mnp/Abc", absolutePath);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.WarnStorageExpectedPathPrefix, true);
        }

        /// <summary>
        /// Tests absolute paths cannot be created with wrong parameters.
        /// Checks behavior if objectPath is invalid.
        /// </summary>
        [TestMethod]
        public void TestPathRootInvalidObjectPath()
        {
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrStorageInvalidPathFormat };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPathRootInvalidObjectPath), expectedCodes: expectedLogCodes, noInputAndOutputFolder: true);
            corpus.Storage.CreateAbsoluteCorpusPath("./Abc");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("/./Abc");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("../Abc");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("Abc/./Def");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("Abc/../Def");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);
        }

        /// <summary>
        /// Tests absolute paths cannot be created with wrong parameters.
        /// Checks behavior if FolderPath is invalid.
        /// </summary>
        [TestMethod]
        public void TestPathRootInvalidFolderPath()
        {
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrStorageInvalidPathFormat };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPathRootInvalidFolderPath), expectedCodes: expectedLogCodes, noInputAndOutputFolder: true);

            corpus.Storage.CreateAbsoluteCorpusPath("Abc", new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "./Mnp" });
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("Abc", new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "/./Mnp" });
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("Abc", new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "../Mnp" });
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("Abc", new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "Mnp/./Qrs" });
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

            corpus.Storage.CreateAbsoluteCorpusPath("Abc", new CdmManifestDefinition(null, null) { Namespace = "cdm", FolderPath = "Mnp/../Qrs" });
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);
        }
    }
}
