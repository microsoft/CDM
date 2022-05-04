// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.ModelJson;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
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

        private readonly bool doesWriteTestDebuggingFiles = false;

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
        /// Manifest.DataPartitions.Arguments can be read in multiple forms,
        /// but should always be serialized as {name: 'theName', value: 'theValue'}.
        /// </summary>
        [TestMethod]
        public void TestDataPartitionArgumentsAreSerializedAppropriately()
        {
            var readFile = TestHelper.GetInputFileContent(testsSubpath, nameof(TestDataPartitionArgumentsAreSerializedAppropriately), "entities.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(
                new ResolveContext(new CdmCorpusDefinition(), null), "entities", "testNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(readFile));
            var obtainedCdmFolder = ManifestPersistence.ToData(cdmManifest, null, null);
            if (doesWriteTestDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubpath, nameof(TestDataPartitionArgumentsAreSerializedAppropriately),
                    "savedManifest.manifest.cdm.json", ModelJsonTestsBase.Serialize(obtainedCdmFolder));
            }
            var expectedOutput = TestHelper.GetExpectedOutputFileContent(testsSubpath, nameof(TestDataPartitionArgumentsAreSerializedAppropriately), "savedManifest.manifest.cdm.json");
            TestHelper.AssertSameObjectWasSerialized(expectedOutput, ModelJsonTestsBase.Serialize(obtainedCdmFolder));
        }

        /// <summary>
        /// Testing programmatically creating manifest with partitions and persisting
        /// </summary>
        [TestMethod]
        public void TestProgrammaticallyCreatePartitions()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestProgrammaticallyCreatePartitions), noInputAndOutputFolder: true);
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

        /// <summary>
        /// Testing loading manifest with local entity declaration having an incremental partition without incremental trait.
        /// </summary>
        [TestMethod]
        public async Task TestFromIncrementalPartitionWithoutTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestFromIncrementalPartitionWithoutTrait));
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("Failed to persist object 'DeletePartition'. " +
                        "This object does not contain the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'IncrementalPartitions'. | FromData"))
                    {
                        errorMessageVerified = true;
                    }
                    else
                    {
                        Assert.Fail("Some unexpected failure - " + message);
                    }
                }
            }, CdmStatusLevel.Warning);

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/entities.manifest.cdm.json");
            Assert.AreEqual(1, manifest.Entities.Count);
            Assert.AreEqual(CdmObjectType.LocalEntityDeclarationDef, manifest.Entities[0].ObjectType);
            var entity = manifest.Entities[0];
            Assert.AreEqual(1, entity.IncrementalPartitions.Count);
            var incrementalPartition = entity.IncrementalPartitions[0];
            Assert.AreEqual("UpsertPartition", incrementalPartition.Name);
            Assert.AreEqual(1, incrementalPartition.ExhibitsTraits.Count);
            Assert.AreEqual(Constants.IncrementalTraitName, (incrementalPartition.ExhibitsTraits[0] as CdmTraitReference).FetchObjectDefinitionName());
            Assert.IsTrue(errorMessageVerified);
        }

        /// <summary>
        /// Testing loading manifest with local entity declaration having a data partition with incremental trait.
        /// </summary>
        [TestMethod]
        public async Task TestFromDataPartitionWithIncrementalTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestFromDataPartitionWithIncrementalTrait));
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    var events = corpus.Ctx.Events;
                    var lastLog = events[events.Count - 1];
                    if (message.Contains("Failed to persist object 'UpsertPartition'. " +
                        "This object contains the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'DataPartitions'. | FromData"))
                    {
                        errorMessageVerified = true;
                    }
                    else
                    {
                        Assert.Fail("Some unexpected failure - " + message);
                    }
                }
            }, CdmStatusLevel.Warning);

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/entities.manifest.cdm.json");
            Assert.AreEqual(1, manifest.Entities.Count);
            Assert.AreEqual(CdmObjectType.LocalEntityDeclarationDef, manifest.Entities[0].ObjectType);
            var entity = manifest.Entities[0];
            Assert.AreEqual(1, entity.DataPartitions.Count);
            Assert.AreEqual("TestingPartition", entity.DataPartitions[0].Name);
            Assert.IsTrue(errorMessageVerified);
        }

        /// <summary>
        /// Testing saving manifest with local entity declaration having an incremental partition without incremental trait.
        /// </summary>
        [TestMethod]
        public void TestToIncrementalPartitionWithoutTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestToIncrementalPartitionWithoutTrait), noInputAndOutputFolder: true);
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    var events = corpus.Ctx.Events;
                    var lastLog = events[events.Count - 1];
                    if (message.Contains("Failed to persist object 'DeletePartition'. " +
                        "This object does not contain the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'IncrementalPartitions'. | ToData"))
                    {
                        errorMessageVerified = true;
                    }
                    else
                    {
                        Assert.Fail("Some unexpected failure - " + message);
                    }
                }
            }, CdmStatusLevel.Warning);

            var manifest = new CdmManifestDefinition(corpus.Ctx, "manifest");
            corpus.Storage.FetchRootFolder("local").Documents.Add(manifest);

            var entity = new CdmEntityDefinition(corpus.Ctx, "entityName", null);
            CdmCollectionHelperFunctions.CreateDocumentForEntity(corpus, entity);
            var localizedEntityDeclaration = manifest.Entities.Add(entity);

            var upsertIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "UpsertPartition", false);
            upsertIncrementalPartition.Location = "/IncrementalData";
            upsertIncrementalPartition.SpecializedSchema = "csv";
            upsertIncrementalPartition.ExhibitsTraits.Add(Constants.IncrementalTraitName, new List<Tuple<string, dynamic>>() { new Tuple<string, dynamic>("type", CdmIncrementalPartitionType.Upsert.ToString()) });

            var deletePartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "DeletePartition", false);
            deletePartition.Location = "/IncrementalData";
            deletePartition.SpecializedSchema = "csv";
            localizedEntityDeclaration.IncrementalPartitions.Add(upsertIncrementalPartition);
            localizedEntityDeclaration.IncrementalPartitions.Add(deletePartition);

            using (Logger.EnterScope(nameof(DataPartitionTest), corpus.Ctx, nameof(TestToIncrementalPartitionWithoutTrait)))
            {
                var manifestData = ManifestPersistence.ToData(manifest, null, null);

                Assert.AreEqual(1, manifestData.Entities.Count);
                var entityData = manifestData.Entities[0];
                Assert.AreEqual(1, entityData.Value<JArray>("incrementalPartitions").Count);
                var partitionData = entityData.Value<JArray>("incrementalPartitions").First;
                Assert.AreEqual("UpsertPartition", partitionData.Value<JToken>("name"));
                Assert.AreEqual(1, partitionData.Value<JArray>("exhibitsTraits").Count);
                Assert.AreEqual(Constants.IncrementalTraitName, (partitionData.Value<JArray>("exhibitsTraits").First).Value<JToken>("traitReference"));
            }
            Assert.IsTrue(errorMessageVerified);
        }

        /// <summary>
        /// Testing saving manifest with local entity declaration having a data partition with incremental trait.
        /// </summary>
        [TestMethod]
        public void TestToDataPartitionWithIncrementalTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestToDataPartitionWithIncrementalTrait), noInputAndOutputFolder: true);
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    var events = corpus.Ctx.Events;
                    var lastLog = events[events.Count - 1];
                    if (message.Contains("Failed to persist object 'UpsertPartition'. " +
                        "This object contains the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'DataPartitions'. | ToData"))
                    {
                        errorMessageVerified = true;
                    }
                    else
                    {
                        Assert.Fail("Some unexpected failure - " + message);
                    }
                }
            }, CdmStatusLevel.Warning);

            var manifest = new CdmManifestDefinition(corpus.Ctx, "manifest");
            corpus.Storage.FetchRootFolder("local").Documents.Add(manifest);

            var entity = new CdmEntityDefinition(corpus.Ctx, "entityName", null);
            CdmCollectionHelperFunctions.CreateDocumentForEntity(corpus, entity);
            var localizedEntityDeclaration = manifest.Entities.Add(entity);

            var upsertIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "UpsertPartition", false);
            upsertIncrementalPartition.Location = "/IncrementalData";
            upsertIncrementalPartition.SpecializedSchema = "csv";
            upsertIncrementalPartition.ExhibitsTraits.Add(Constants.IncrementalTraitName, new List<Tuple<string, dynamic>>() { new Tuple<string, dynamic>("type", CdmIncrementalPartitionType.Upsert.ToString()) });

            var testingPartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "TestingPartition", false);
            testingPartition.Location = "/testingData";
            testingPartition.SpecializedSchema = "csv";
            localizedEntityDeclaration.DataPartitions.Add(upsertIncrementalPartition);
            localizedEntityDeclaration.DataPartitions.Add(testingPartition);

            using (Logger.EnterScope(nameof(DataPartitionTest), corpus.Ctx, nameof(TestToDataPartitionWithIncrementalTrait)))
            {
                var manifestData = ManifestPersistence.ToData(manifest, null, null);

                Assert.AreEqual(1, manifestData.Entities.Count);
                var entityData = manifestData.Entities[0];
                Assert.AreEqual(1, entityData.Value<JArray>("dataPartitions").Count);
                var partitionData = entityData.Value<JArray>("dataPartitions").First;
                Assert.AreEqual("TestingPartition", partitionData.Value<JToken>("name"));
            }

            Assert.IsTrue(errorMessageVerified);
        }
    }
}
