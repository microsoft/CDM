// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    [TestClass]
    public class DataPartitionTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "CdmFolder", "DataPartition");

        /// <summary>
        /// Testing for Manifest with local entity declaration having data partitions.
        /// </summary>
        [TestMethod]
        public void TestLoadLocalEntitiyWithDataPartition()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadLocalEntityWithDataPartition", "entities.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "entities", "testNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.Entities.Count, 1);
            Assert.AreEqual(cdmManifest.Entities[0].ObjectType, CdmObjectType.LocalEntityDeclarationDef);
            var entity = cdmManifest.Entities[0];
            Assert.AreEqual(entity.DataPartitions.Count, 2);
            var relativePartition = entity.DataPartitions[0];
            Assert.AreEqual(relativePartition.Name, "Sample data partition");
            Assert.AreEqual(relativePartition.Location, "test/location");
            Assert.AreEqual(TimeUtils.GetFormattedDateString(relativePartition.LastFileModifiedTime), "2008-09-15T23:53:23.000Z");
            Assert.AreEqual(relativePartition.ExhibitsTraits.Count, 1);
            Assert.AreEqual(relativePartition.SpecializedSchema, "teststring");

            var testList = relativePartition.Arguments["test"];
            Assert.AreEqual(testList.Count, 3);
            Assert.AreEqual(testList[0], "something");
            Assert.AreEqual(testList[1], "somethingelse");
            Assert.AreEqual(testList[2], "anotherthing");

            var keyList = relativePartition.Arguments["KEY"];
            Assert.AreEqual(keyList.Count, 1);
            Assert.AreEqual(keyList[0], "VALUE");

            Assert.IsFalse(relativePartition.Arguments.ContainsKey("wrong"));

            var absolutePartition = entity.DataPartitions[1];
            Assert.AreEqual(absolutePartition.Location, "local:/some/test/location");
        }

        /// <summary>
        /// Testing programmatically creating manifest with partitions and persisting
        /// </summary>
        [TestMethod]
        public void TestProgrammaticallyCreatePartitions()
        {
            var corpus = new CdmCorpusDefinition();
            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "manifest");
            var entity = manifest.Entities.Add("entity");

            var relativePartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "relative partition");
            relativePartition.Location = "relative/path";
            relativePartition.Arguments.Add("test1", new List<string>() { "argument1" });
            relativePartition.Arguments.Add("test2", new List<string>() { "argument2", "argument3" });

            var absolutePartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "absolute partition");
            absolutePartition.Location = "local:/absolute/path";
            // add an empty arguments list to test empty list should not be displayed in ToData json.
            absolutePartition.Arguments.Add("test", new List<string>());

            entity.DataPartitions.Add(relativePartition);
            entity.DataPartitions.Add(absolutePartition);

            var manifestData = ManifestPersistence.ToData(manifest, new ResolveOptions(), new CopyOptions());
            Assert.AreEqual(1, manifestData.Entities.Count);
            var entityData = manifestData.Entities[0];
            var partitionsList = entityData.Value<JArray>("dataPartitions");
            Assert.AreEqual(2, partitionsList.Count);
            var relativePartitionData = partitionsList.First;
            var absolutePartitionData = partitionsList.Last;

            Assert.AreEqual(relativePartition.Location, relativePartitionData.Value<string>("location"));

            var argumentsList = relativePartitionData.Value<JArray>("arguments");
            Assert.AreEqual(3, argumentsList.Count);
            Assert.AreEqual(2, argumentsList[0].Count());
            Assert.AreEqual("test1", argumentsList[0].Value<string>("name"));
            Assert.AreEqual("argument1", argumentsList[0].Value<string>("value"));
            Assert.AreEqual(2, argumentsList[1].Count());
            Assert.AreEqual("test2", argumentsList[1].Value<string>("name"));
            Assert.AreEqual("argument2", argumentsList[1].Value<string>("value"));
            Assert.AreEqual(2, argumentsList[2].Count());
            Assert.AreEqual("test2", argumentsList[2].Value<string>("name"));
            Assert.AreEqual("argument3", argumentsList[2].Value<string>("value"));

            Assert.AreEqual(absolutePartition.Location, absolutePartitionData.Value<string>("location"));
            // test if empty argument list is set to null
            Assert.IsNull(absolutePartitionData.Value<List<object>>("arguments"));
        }
    }
}
