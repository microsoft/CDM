// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.IO;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    [TestClass]
    public class DataPartitionPatternTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "DataPartitionPattern");

        /// <summary>
        /// Testing for folder with local entity declaration with data partition patterns.
        /// </summary>
        [TestMethod]
        public void TestLoadLocalEntitiyWithDataPartitionPattern()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadLocalEntityWithDataPartitionPattern", "entities.manifest.cdm.json");

            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "entities", "testNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(2, cdmManifest.Entities.Count);

            var entity1 = cdmManifest.Entities[0];
            Assert.AreEqual(CdmObjectType.LocalEntityDeclarationDef, entity1.ObjectType);
            Assert.AreEqual(1, entity1.DataPartitionPatterns.Count);
            var pattern1 = entity1.DataPartitionPatterns[0];
            Assert.AreEqual("testPattern", pattern1.Name);
            Assert.AreEqual("test explanation", pattern1.Explanation);
            Assert.AreEqual("test location", pattern1.RootLocation);
            Assert.AreEqual("\\s*", pattern1.RegularExpression.ToString());
            Assert.AreEqual(2, pattern1.Parameters.Count);
            Assert.AreEqual("testParam1", pattern1.Parameters[0]);
            Assert.AreEqual("testParam2", pattern1.Parameters[1]);
            Assert.AreEqual("test special schema", pattern1.SpecializedSchema);
            Assert.AreEqual(1, pattern1.ExhibitsTraits.Count);

            var entity2 = cdmManifest.Entities[1];
            Assert.AreEqual(CdmObjectType.LocalEntityDeclarationDef, entity2.ObjectType);
            Assert.AreEqual(1, entity2.DataPartitionPatterns.Count);
            var pattern2 = entity2.DataPartitionPatterns[0];
            Assert.AreEqual("testPattern2", pattern2.Name);
            Assert.AreEqual("test location2", pattern2.RootLocation);
            Assert.AreEqual("/*.csv", pattern2.GlobPattern);

            var manifestData = ManifestPersistence.ToData(cdmManifest, new ResolveOptions(), new CopyOptions());
            Assert.AreEqual(2, manifestData.Entities.Count);

            var entityData1 = manifestData.Entities[0];
            Assert.AreEqual(1, entityData1.Value<JArray>("dataPartitionPatterns").Count);
            var patternData1 = entityData1.Value<JArray>("dataPartitionPatterns").First;
            Assert.AreEqual("testPattern", patternData1.Value<JToken>("name"));
            Assert.AreEqual("test explanation", patternData1.Value<JToken>("explanation"));
            Assert.AreEqual("test location", patternData1.Value<JToken>("rootLocation"));
            Assert.AreEqual("\\s*", patternData1.Value<JToken>("regularExpression"));
            Assert.AreEqual(2, patternData1.Value<JArray>("parameters").Count);
            Assert.AreEqual("testParam1", patternData1.Value<JArray>("parameters")[0]);
            Assert.AreEqual("testParam2", patternData1.Value<JArray>("parameters")[1]);
            Assert.AreEqual("test special schema", patternData1.Value<JToken>("specializedSchema"));
            Assert.AreEqual(1, patternData1.Value <JArray>("exhibitsTraits").Count);

            var entityData2 = manifestData.Entities[1];
            Assert.AreEqual(1, entityData2.Value<JArray>("dataPartitionPatterns").Count);
            var patternData2 = entityData2.Value<JArray>("dataPartitionPatterns").First;
            Assert.AreEqual("testPattern2", patternData2.Value<JToken>("name"));
            Assert.AreEqual("test location2", patternData2.Value<JToken>("rootLocation"));
            Assert.AreEqual("/*.csv", patternData2.Value<JToken>("globPattern"));
        }
    }
}
