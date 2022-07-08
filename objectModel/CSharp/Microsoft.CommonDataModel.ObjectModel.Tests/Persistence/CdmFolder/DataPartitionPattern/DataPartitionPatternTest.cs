// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
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

        /// <summary>
        /// Testing loading manifest with local entity declaration having an incremental partition pattern without incremental trait.
        /// </summary>
        [TestMethod]
        public async Task TestFromIncrementalPartitionPatternWithoutTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestFromIncrementalPartitionPatternWithoutTrait));
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("Failed to persist object 'DeletePattern'. " +
                        "This object does not contain the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'IncrementalPartitionPatterns'. | FromData"))
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
            Assert.AreEqual(1, entity.IncrementalPartitionPatterns.Count);
            var incrementalPartitionPattern = entity.IncrementalPartitionPatterns[0];
            Assert.AreEqual("UpsertPattern", incrementalPartitionPattern.Name);
            Assert.AreEqual(1, incrementalPartitionPattern.ExhibitsTraits.Count);
            Assert.AreEqual(Constants.IncrementalTraitName, (incrementalPartitionPattern.ExhibitsTraits[0] as CdmTraitReference).FetchObjectDefinitionName());
            Assert.IsTrue(errorMessageVerified);
        }

        /// <summary>
        /// Testing loading manifest with local entity declaration having a data partition pattern with incremental trait.
        /// </summary>
        [TestMethod]
        public async Task TestFromDataPartitionPatternWithIncrementalTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestFromDataPartitionPatternWithIncrementalTrait));
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("Failed to persist object 'UpsertPattern'. " +
                        "This object contains the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'DataPartitionPatterns'. | FromData"))
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
            Assert.AreEqual(1, entity.DataPartitionPatterns.Count);
            Assert.AreEqual("TestingPattern", entity.DataPartitionPatterns[0].Name);
            Assert.IsTrue(errorMessageVerified);
        }

        /// <summary>
        /// Testing saving manifest with local entity declaration having an incremental partition pattern without incremental trait.
        /// </summary>
        [TestMethod]
        public void TestToIncrementalPartitionPatternWithoutTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestToIncrementalPartitionPatternWithoutTrait), noInputAndOutputFolder: true);
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("Failed to persist object 'DeletePartitionPattern'. " +
                        "This object does not contain the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'IncrementalPartitionPatterns'. | ToData"))
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

            var upsertIncrementalPartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, "UpsertPattern", false);
            upsertIncrementalPartitionPattern.RootLocation = "/IncrementalData";
            upsertIncrementalPartitionPattern.RegularExpression = "/(.*)/(.*)/(.*)/Upserts/upsert(\\d+)\\.csv$";
            upsertIncrementalPartitionPattern.Parameters = new List<string> { "year", "month", "day", "upsertPartitionNumber" };
            upsertIncrementalPartitionPattern.ExhibitsTraits.Add(Constants.IncrementalTraitName, new List<Tuple<string, dynamic>>() { new Tuple<string, dynamic>("type", CdmIncrementalPartitionType.Upsert.ToString()) });

            var deletePartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, "DeletePartitionPattern", false);
            deletePartitionPattern.RootLocation = "/IncrementalData";
            deletePartitionPattern.RegularExpression = "/(.*)/(.*)/(.*)/Delete/detele(\\d+)\\.csv$";
            deletePartitionPattern.Parameters = new List<string> { "year", "month", "day", "detelePartitionNumber" };
            localizedEntityDeclaration.IncrementalPartitionPatterns.Add(upsertIncrementalPartitionPattern);
            localizedEntityDeclaration.IncrementalPartitionPatterns.Add(deletePartitionPattern);

            using (Logger.EnterScope(nameof(DataPartitionPatternTest), corpus.Ctx, nameof(TestToIncrementalPartitionPatternWithoutTrait)))
            {
                var manifestData = ManifestPersistence.ToData(manifest, null, null);

                Assert.AreEqual(1, manifestData.Entities.Count);
                var entityData = manifestData.Entities[0];
                Assert.AreEqual(1, entityData.Value<JArray>("incrementalPartitionPatterns").Count);
                var patternData = entityData.Value<JArray>("incrementalPartitionPatterns").First;
                Assert.AreEqual("UpsertPattern", patternData.Value<JToken>("name"));
                Assert.AreEqual(1, patternData.Value<JArray>("exhibitsTraits").Count);
                Assert.AreEqual(Constants.IncrementalTraitName, (patternData.Value<JArray>("exhibitsTraits").First).Value<JToken>("traitReference"));
            }
            Assert.IsTrue(errorMessageVerified);
        }

        /// <summary>
        /// Testing saving manifest with local entity declaration having a data partition pattern with incremental trait.
        /// </summary>
        [TestMethod]
        public void TestToDataPartitionPatternWithIncrementalTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestToDataPartitionPatternWithIncrementalTrait), noInputAndOutputFolder: true);
            bool errorMessageVerified = false;
            // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("Failed to persist object 'UpsertPartitionPattern'. " +
                        "This object contains the trait 'is.partition.incremental', " +
                        "so it should not be in the collection 'DataPartitionPatterns'. | ToData"))
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

            var upsertIncrementalPartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, "UpsertPartitionPattern", false);
            upsertIncrementalPartitionPattern.RootLocation = "/IncrementalData";
            upsertIncrementalPartitionPattern.ExhibitsTraits.Add(Constants.IncrementalTraitName, new List<Tuple<string, dynamic>>() { new Tuple<string, dynamic>("type", CdmIncrementalPartitionType.Upsert.ToString()) });

            var testingPartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, "TestingPartitionPattern", false);
            testingPartitionPattern.RootLocation = "/testingData";
            localizedEntityDeclaration.DataPartitionPatterns.Add(upsertIncrementalPartitionPattern);
            localizedEntityDeclaration.DataPartitionPatterns.Add(testingPartitionPattern);

            using (Logger.EnterScope(nameof(DataPartitionPatternTest), corpus.Ctx, nameof(TestToDataPartitionPatternWithIncrementalTrait)))
            {
                var manifestData = ManifestPersistence.ToData(manifest, null, null);

                Assert.AreEqual(1, manifestData.Entities.Count);
                var entityData = manifestData.Entities[0];
                Assert.AreEqual(1, entityData.Value<JArray>("dataPartitionPatterns").Count);
                var patternData = entityData.Value<JArray>("dataPartitionPatterns").First;
                Assert.AreEqual("TestingPartitionPattern", patternData.Value<JToken>("name"));
            }
            Assert.IsTrue(errorMessageVerified);
        }
    }
}
