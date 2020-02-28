// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.IO;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json;

    [TestClass]
    public class BackCompEntityDeclaration
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "CdmFolder", "BackCompEntityDeclaration");

        /// <summary>
        /// Test load legacy entity declaration.
        /// </summary>
        [TestMethod]
        public void TestLoadLegacyEntityDeclaration()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadLegacyEntityDeclaration", "entities.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "", "", "", JsonConvert.DeserializeObject<ManifestContent>(content));
            // Local entity declaration.
            Assert.AreEqual("testPath", cdmManifest.Entities[0].EntityPath);

            // Referenced entity declaration.
            Assert.AreEqual("Account.cdm.json/Account", cdmManifest.Entities[1].EntityPath);
        }
    }
}
