// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Threading.Tasks;

    using Assert = AssertExtension;
    using cdmDocument = ObjectModel.Persistence.CdmFolder.DocumentPersistence;
    using cdmManifestPersistence = ObjectModel.Persistence.CdmFolder.ManifestPersistence;

    /// <summary>
    /// Class containing tests related to MetadataObject class (and it's children) use, serialization and deserialization.
    /// </summary>
    [TestClass]
    public class ModelJsonExtensibilityTests : ModelJsonTestsBase
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "ModelJson", "ModelJsonExtensibility");

        /// <summary>
        /// Whether debugging files should be written or not.
        /// </summary>
        private bool doesWriteTestDebuggingFiles = false;

        /// <summary>
        /// Tests the serializer and the deserializer.
        /// Checks whether reading a Model.Json file into an instance of <see cref="Model"/> class and then serializing back results in a "similar" string. (the order of serialization can vary)
        /// Serializing back timedate is tricky, as the strings can differ if the serializer uses a different format / timezone than original file. (using GMT time)
        /// C# only test. This test does not have a Typescript equivalent.
        /// </summary>
        [TestMethod]
        public void TestSerializer()
        {
            var originalModelJson = TestHelper.GetInputFileContent(testsSubpath, "TestSerializer", "SerializerTesting-model.json");
            var deserialized = Deserialize<Model>(originalModelJson);
            var serialized = Serialize(deserialized);
            if (doesWriteTestDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubpath, "TestSerializer", "SerializerTesting-model.json", serialized);
            }

            TestHelper.AssertSameObjectWasSerialized(originalModelJson, serialized);
        }

        /// <summary>
        /// Tests the serializer and the deserializer.
        /// Checks whether the serializer correctly uses "Order" metadata property to decide the order of serialization.
        /// C# only test. This test does not have a Typescript equivalent.
        /// </summary>
        [TestMethod]
        public void TestSerializerOrderMetadataProperty()
        {
            var originalModelJson = TestHelper.GetInputFileContent(testsSubpath, "TestSerializerOrderMetadataProperty", "SerializerTesting-entity.json");
            var deserialized = Deserialize<Entity>(originalModelJson);
            var serialized = Serialize(deserialized);
            if (doesWriteTestDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubpath, "TestSerializerOrderMetadataProperty", "SerializerTesting -entity.json", serialized);
            }

            TestHelper.AssertSameObjectWasSerialized(originalModelJson, serialized);
            originalModelJson.Replace("\r\n", "\n");
            serialized.Replace("\r\n", "\n");
            // "$type" appears on same position.
            Assert.AreEqual(originalModelJson.IndexOf('$'), serialized.IndexOf('$'));
        }

        /// <summary>
        /// Tests the serializer and the deserializer work for different time zones.
        /// C# only test. This test does not have a Typescript equivalent.
        /// </summary>
        [TestMethod]
        public void TestEntityTimeDateReadInLocalFormat()
        {
            var originalModelJson = TestHelper.GetInputFileContent(testsSubpath, "TestEntityTimeDateReadInLocalFormat", "SerializerTesting-entity2.json");
            var deserialized = Deserialize<Entity>(originalModelJson);

            var expectedSerializedLastChildFileModifiedTime = "\"2018-12-19T02:05:03.2374986+00:00\"";
            var expectedSerializedLastFileModifiedTime = "\"2018-12-19T05:05:03.2374986+00:00\"";
            var expectedSerializedLastFileStatusCheckTime = "\"2018-12-19T21:35:03.2374986+00:00\"";

            var lastChildFileModifiedTime = deserialized?.LastChildFileModifiedTime;
            var lastFileModifiedTime = deserialized?.LastFileModifiedTime;
            var lastFileStatusCheckTime = deserialized?.LastFileStatusCheckTime;

            Assert.AreEqual(expectedSerializedLastChildFileModifiedTime, Serialize(lastChildFileModifiedTime));
            Assert.AreEqual(expectedSerializedLastFileModifiedTime, Serialize(lastFileModifiedTime));
            Assert.AreEqual(expectedSerializedLastFileStatusCheckTime, Serialize(lastFileStatusCheckTime));


            string serialized = Serialize(deserialized);
            Assert.IsTrue(serialized.Contains(expectedSerializedLastChildFileModifiedTime));
            Assert.IsTrue(serialized.Contains(expectedSerializedLastFileModifiedTime));
            Assert.IsTrue(serialized.Contains(expectedSerializedLastFileStatusCheckTime));
        }

        /// <summary>
        /// Checks whether reading a Model.Json into a <see cref="Model"/>,
        /// converting to a <see cref="CdmManifestDefinition"/>,
        /// converting back to a <see cref="Model"/>
        /// and then serializing back to a string
        /// results in a similar content (up to a different order of serialization)
        /// </summary>
        [TestMethod]
        public async Task TestModelJsonExtensibility()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestModelJsonExtensibility");
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json", cdmCorpus.Storage.FetchRootFolder("local"));
            var obtainedModel = await ManifestPersistence.ToData(cdmManifest, null, null);

            // The imports were generated during processing and are not present in the original file.
            obtainedModel.Imports = null;

            if (doesWriteTestDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubpath, "TestModelJsonExtensibility", "SerializerTesting-model.json", Serialize(obtainedModel));
            }
            var obtainedModelJson = Serialize(obtainedModel);

            var originalModelJson = TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestModelJsonExtensibility", "SerializerTesting-model.json");

            TestHelper.AssertSameObjectWasSerialized(originalModelJson, obtainedModelJson);
        }

        /// <summary>
        /// Tests the performance of the serializer.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        [NUnit.Framework.Retry(3)]
        public void TestSerializerPerformance()
        {
            var hugeEntity = this.CreateHugeModel(10000);
            var serializeStopwatch = Stopwatch.StartNew();
            var serialized = Serialize(hugeEntity);
            serializeStopwatch.Stop();
            var deserializeStopwatch = Stopwatch.StartNew();
            var deserialized = Deserialize<Model>(serialized);
            deserializeStopwatch.Stop();
            var serializerTime = serializeStopwatch.ElapsedMilliseconds;
            var deserializerTime = deserializeStopwatch.ElapsedMilliseconds;

            Assert.Performance(500, serializerTime, "Serializing");
            Assert.Performance(1500, deserializerTime, "Deserializing");
        }

        /// <summary>
        /// Reads Model.Json, converts to manifest and compares files from obtained manifest to stored files.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task ModelJsonExtensibilityManifestDocumentsTest()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "ModelJsonExtensibilityManifestDocuments");
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json", cdmCorpus.Storage.FetchRootFolder("local"));
            var folderObject = cdmCorpus.Storage.FetchRootFolder("default");

            var serializedManifest = Serialize(cdmManifestPersistence.ToData(manifest, null, null));

            if (doesWriteTestDebuggingFiles)
            {
                foreach (var doc in folderObject.Documents)
                {
                    if (doc.Name == manifest.Name)
                    {
                        continue;
                    }

                    var docContent = cdmDocument.ToData(doc, null, null);

                    var serializedDocument = Serialize(docContent);

                    TestHelper.WriteActualOutputFileContent(testsSubpath, "ModelJsonExtensibilityManifestDocuments", doc.Name, serializedDocument);
                }

                TestHelper.WriteActualOutputFileContent(testsSubpath, "ModelJsonExtensibilityManifestDocuments", manifest.Name, serializedManifest);
            }

            foreach (var doc in folderObject.Documents)
            {
                // manifest shows up twice. once as a manifest and again as the model.json conversion cached
                if (doc.Name == manifest.Name)
                {
                    continue;
                }

                string serializedDocument = Serialize(cdmDocument.ToData(doc, null, null));

                var expectedOutputDocument = TestHelper.GetExpectedOutputFileContent(testsSubpath, "ModelJsonExtensibilityManifestDocuments", doc.Name);

                TestHelper.AssertSameObjectWasSerialized(expectedOutputDocument, serializedDocument);
            }

            var expectedOutputManifest = TestHelper.GetExpectedOutputFileContent(testsSubpath, "ModelJsonExtensibilityManifestDocuments", manifest.Name);
            TestHelper.AssertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);
        }

        /// <summary>
        /// Creates an instance of <see cref="Model"/> with huge content.
        /// This is used to test the serializer performance.
        /// </summary>
        /// <param name="dimension">The dimension of the desired class. This actually controls the number of elements in the lists of the <see cref="Model"/></param>
        /// <returns>An instance of <see cref="Model"/> that contains many <see cref="SingleKeyRelationship"/> and <see cref="ReferenceModel"/>.</returns>
        private Model CreateHugeModel(int dimension)
        {
            var ret = new Model();
            ret.Description = "The description of the Entity";
            ret.LastChildFileModifiedTime = DateTimeOffset.Now;
            ret.LastFileStatusCheckTime = DateTimeOffset.Now;
            ret.Name = "The name of the entity";
            ret.ReferenceModels = new List<ReferenceModel>();
            for (int i = 0; i < dimension; i++)
            {
                var referenceModel = new ReferenceModel()
                {
                    Id = "ReferenceModel Id no " + i,
                    Location = "Location no" + i
                };
                ret.ReferenceModels.Add(referenceModel);
            }
            ret.Relationships = new List<SingleKeyRelationship>();
            for (int i = 0; i < dimension; i++)
            {
                var extensionFields = new JObject();
                for (int j = 1; j < 3; j++) {
                    extensionFields.TryAdd("extension " + j, "value of extension " + j + " for relationship " + i);
                }

                var relationship = new SingleKeyRelationship()
                {
                    FromAttribute = new AttributeReference()
                    {
                        EntityName = "FromAttribute.EntityName no " + i,
                        AttributeName = "FromAttribute.AttributeName no" + i
                    },
                    ToAttribute = new AttributeReference()
                    {
                        EntityName = "ToAttribute.EntityName no" + i,
                        AttributeName = "ToAttribute.AttributeName" + i
                    },
                    Type = "Type of Realtionship no " + i,
                    Name = "Name of Realtionship no " + i,
                    Description = "Description of Relatioship no " + i,
                    ExtensionFields = extensionFields
                };
                ret.Relationships.Add(relationship);
            }
            return ret;
        }
    }
}
