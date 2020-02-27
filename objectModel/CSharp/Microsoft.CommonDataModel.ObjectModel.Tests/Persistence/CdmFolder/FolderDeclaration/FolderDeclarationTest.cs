// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.IO;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json;

    [TestClass]
    public class FolderDeclarationTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "FolderDeclaration");

        /// <summary>
        /// Testing for folder impl instance with subfolders.
        /// </summary>
        [TestMethod]
        public void TestLoadFolderWithSubFolders()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadFolderWithSubFolders", "subManifest.manifest.cdm.json");

            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "testEntity", "testNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.SubManifests.Count, 1);
            var subManifest = cdmManifest.SubManifests[0];
            Assert.AreEqual(subManifest.GetName(), "sub folder declaration");
            Assert.AreEqual(subManifest.Explanation, "test sub explanation");
            Assert.AreEqual(subManifest.Definition, "test definition");
        }
    }
}
