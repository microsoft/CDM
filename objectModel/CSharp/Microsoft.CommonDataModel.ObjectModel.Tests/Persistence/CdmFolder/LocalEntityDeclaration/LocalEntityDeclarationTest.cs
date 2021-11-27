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
    public class LocalEntityDeclarationTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "CdmFolder", "LocalEntityDeclaration");

        /// <summary>
        /// Testing for folder impl instance with local entity declaration.
        /// Creates Manifest using empty string as namespace.
        /// </summary>
        [TestMethod]
        public void TestLoadNoPartition()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadNoPartition", "entities.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "", "", "", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(1, cdmManifest.Entities.Count);
            Assert.AreEqual(cdmManifest.Entities[0].ObjectType, CdmObjectType.LocalEntityDeclarationDef);
            var entity = cdmManifest.Entities[0];
            Assert.AreEqual("Account", entity.EntityName);
            Assert.AreEqual("Account explanation", entity.Explanation);
            Assert.AreEqual("Account.cdm.json/Account", entity.EntityPath);
            Assert.AreEqual(1, entity.ExhibitsTraits.Count);
            Assert.AreEqual(0, entity.DataPartitions.Count);
            Assert.AreEqual(0, entity.DataPartitionPatterns.Count);
        }

        /// <summary>
        /// Testing for folder impl instance with local entity declaration with relative path.
        /// This checks the result when manifest was created with a non-null namespace. Entity path should match what was passed into the file
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public void TestLoadNoPartitionNamespaceSet()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadNoPartitionNamespaceSet", "entities.manifest.cdm.json");
            ManifestContent manifestContent = JsonConvert.DeserializeObject<ManifestContent>(content);
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "testEntity", "testNamespace", "/", manifestContent);
            Assert.AreEqual(cdmManifest.Entities.Count, 1);
            Assert.AreEqual(cdmManifest.Entities[0].ObjectType, CdmObjectType.LocalEntityDeclarationDef);
            var entity = cdmManifest.Entities[0];
            Assert.AreEqual("Account", entity.EntityName);
            Assert.AreEqual("Account explanation", entity.Explanation);
            Assert.AreEqual("Account.cdm.json/Account", entity.EntityPath);
            Assert.AreEqual(1, entity.ExhibitsTraits.Count);
            Assert.AreEqual(0, entity.DataPartitions.Count);
            Assert.AreEqual(0, entity.DataPartitionPatterns.Count);

            var manifestToData = ManifestPersistence.ToData(cdmManifest, null, null);
            Assert.AreEqual("Account.cdm.json/Account", manifestToData.Entities[0].Value<string>("entityPath"));
        }

        /// <summary>
        /// Testing for folder impl instance with local entity declaration with absolute path.
        /// This checks the result when manifest was created with a non-null namespace. Entity path should match what was passed into the file
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public void TestLoadNoPartitionAbsoluteNamespaceSet()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadNoPartitionAbsoluteNamespaceSet", "entities.manifest.cdm.json");
            ManifestContent manifestContent = JsonConvert.DeserializeObject<ManifestContent>(content);
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "testEntity", "testNamespace", "/", manifestContent);
            Assert.AreEqual(cdmManifest.Entities.Count, 1);
            Assert.AreEqual(cdmManifest.Entities[0].ObjectType, CdmObjectType.LocalEntityDeclarationDef);
            var entity = cdmManifest.Entities[0];
            Assert.AreEqual("Account", entity.EntityName);
            Assert.AreEqual("Account explanation", entity.Explanation);
            Assert.AreEqual("testNamespace:/Account.cdm.json/Account", entity.EntityPath);
            Assert.AreEqual(1, entity.ExhibitsTraits.Count);
            Assert.AreEqual(0, entity.DataPartitions.Count);
            Assert.AreEqual(0, entity.DataPartitionPatterns.Count);

            var manifestToData = ManifestPersistence.ToData(cdmManifest, null, null);
            Assert.AreEqual("testNamespace:/Account.cdm.json/Account", manifestToData.Entities[0].Value<string>("entityPath"));
        }
    }
}
