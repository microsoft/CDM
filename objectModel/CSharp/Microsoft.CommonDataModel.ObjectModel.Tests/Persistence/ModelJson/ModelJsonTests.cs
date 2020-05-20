// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson;
    using CdmFolderPersistence = ObjectModel.Persistence.CdmFolder;
    using NUnit.Framework;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.IO;
    using Assert = AssertExtension;
    using Newtonsoft.Json.Linq;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System.Collections.Generic;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.Enums;

    /// <summary>
    /// The model json tests.
    /// </summary>
    public class ModelJsonTests : ModelJsonTestsBase
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "ModelJson", "ModelJson");

        /// <summary>
        /// Test ManifestPersistence fromData and toData.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestModelJsonFromAndToData()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestModelJsonFromAndToData));

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(PersistenceLayer.ModelJsonExtension, cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedModelJson = await ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput(nameof(TestModelJsonFromAndToData), PersistenceLayer.ModelJsonExtension, obtainedModelJson);
        }

        /// <summary>
        /// Test loading CDM folder files and model json ManifestPersistence toData.
        /// </summary>
        /// <returns> The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingCdmFolderAndModelJsonToData()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingCdmFolderAndModelJsonToData));

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>($"default{PersistenceLayer.ManifestExtension}", cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedModelJson = await ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(5000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput(nameof(TestLoadingCdmFolderAndModelJsonToData), PersistenceLayer.ModelJsonExtension, obtainedModelJson);
        }

        /// <summary>
        /// Test loading model json result files and CDM folders ManifestPersistence toData.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingModelJsonResultAndCdmFolderToData()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingModelJsonResultAndCdmFolderToData));

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(PersistenceLayer.ModelJsonExtension, cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedCdmFolder = CdmFolderPersistence.ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput(nameof(TestLoadingModelJsonResultAndCdmFolderToData), $"cdmFolder{PersistenceLayer.CdmExtension}", obtainedCdmFolder);
        }

        /// <summary>
        /// Test loading model.json files and CDM folders ManifestPersistence toData.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingModelJsonAndCdmFolderToData()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingModelJsonAndCdmFolderToData));

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(PersistenceLayer.ModelJsonExtension, cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedCdmFolder = CdmFolderPersistence.ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput(nameof(TestLoadingModelJsonAndCdmFolderToData), $"cdmFolder{PersistenceLayer.CdmExtension}", obtainedCdmFolder);
        }

        /// <summary>
        /// Test loading CDM folder result files and model json ManifestPersistence toData.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingCdmFolderResultAndModelJsonToData()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingCdmFolderResultAndModelJsonToData));

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>($"result.model{PersistenceLayer.ManifestExtension}", cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedModelJson = await ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            // remove empty description from entities as they interfere with test.
            obtainedModelJson.Entities.ForEach(RemoveDescriptionFromEntityIfEmpty);
            obtainedModelJson.Description = null;

            this.HandleOutput(nameof(TestLoadingCdmFolderResultAndModelJsonToData), PersistenceLayer.ModelJsonExtension, obtainedModelJson);
        }

        /// <summary>
        /// Test if when loading a model.json file the foundations is imported correctly.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestManifestFoundationImport()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestManifestFoundationImport));

            var callback = new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message1) =>
                {
                    if (statusLevel >= CdmStatusLevel.Error)
                    {
                        Assert.Fail(message1);
                    }
                }
            };
            corpus.SetEventCallback(callback);

            var cdmManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(PersistenceLayer.ModelJsonExtension, corpus.Storage.FetchRootFolder("local"));
        }

        /// <summary>
        /// Test if the imports location are relative to the root level file.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        public async Task TestImportsRelativePath()
        {
            // the corpus path in the imports are relative to the document where it was defined.
            // when saving in model.json the documents are flattened to the manifest level
            // so it is necessary to recalculate the path to be relative to the manifest.
            var corpus = TestHelper.GetLocalCorpus("notImportant", "notImportantLocation");
            var folder = corpus.Storage.FetchRootFolder("local");

            var manifest = new CdmManifestDefinition(corpus.Ctx, "manifest");
            var entityDeclaration = manifest.Entities.Add("EntityName", "EntityName/EntityName.cdm.json/EntityName");
            folder.Documents.Add(manifest);

            var entityFolder = folder.ChildFolders.Add("EntityName");

            var document = new CdmDocumentDefinition(corpus.Ctx, "EntityName.cdm.json");
            document.Imports.Add("subfolder/EntityName.cdm.json");
            document.Definitions.Add("EntityName");
            entityFolder.Documents.Add(document);

            var subFolder = entityFolder.ChildFolders.Add("subfolder");
            subFolder.Documents.Add("EntityName.cdm.json");

            corpus.Storage.FetchRootFolder("remote").Documents.Add(manifest);

            var data = await ManifestPersistence.ToData(manifest, null, null);

            Assert.AreEqual(1, data.Entities.Count);
            var imports = data.Entities[0]["cdm:imports"].ToObject<List<Import>>();
            Assert.AreEqual(1, imports.Count);
            Assert.AreEqual("EntityName/subfolder/EntityName.cdm.json", imports[0].CorpusPath);
        }

        /// <summary>
        /// Test if the referenceModels is generated correctly.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        public async Task TestReferenceModels()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestReferenceModels));

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(PersistenceLayer.ModelJsonExtension, corpus.Storage.FetchRootFolder("local"));

            // entity with same modelId but different location
            var referenceEntity1 = new CdmReferencedEntityDeclarationDefinition(corpus.Ctx, "ReferenceEntity1")
            {
                EntityPath = "remote:/contoso/entity1.model.json/Entity1"
            };
            var modelIdTrait1 = referenceEntity1.ExhibitsTraits.Add("is.propertyContent.multiTrait");
            modelIdTrait1.IsFromProperty = true;
            modelIdTrait1.Arguments.Add("modelId", "f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612");
            manifest.Entities.Add(referenceEntity1);

            // entity without modelId but same location
            var referenceEntity2 = new CdmReferencedEntityDeclarationDefinition(corpus.Ctx, "ReferenceEntity2")
            {
                EntityPath = "remote:/contoso/entity.model.json/Entity2"
            };
            manifest.Entities.Add(referenceEntity2);

            // entity with modelId and new location
            var referenceEntity3 = new CdmReferencedEntityDeclarationDefinition(corpus.Ctx, "ReferenceEntity3")
            {
                EntityPath = "remote:/contoso/entity3.model.json/Entity3"
            };
            var modelIdTrait3 = referenceEntity3.ExhibitsTraits.Add("is.propertyContent.multiTrait");
            modelIdTrait3.IsFromProperty = true;
            modelIdTrait3.Arguments.Add("modelId", "3b2e040a-c8c5-4508-bb42-09952eb04a50");
            manifest.Entities.Add(referenceEntity3);

            // entity with same modelId and same location
            var referenceEntity4 = new CdmReferencedEntityDeclarationDefinition(corpus.Ctx, "ReferenceEntity4")
            {
                EntityPath = "remote:/contoso/entity.model.json/Entity4"
            };
            var modelIdTrait4 = referenceEntity4.ExhibitsTraits.Add("is.propertyContent.multiTrait");
            modelIdTrait4.IsFromProperty = true;
            modelIdTrait4.Arguments.Add("modelId", "f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612");
            manifest.Entities.Add(referenceEntity4);


            var obtainedModelJson = await ManifestPersistence.ToData(manifest, null, null);
            this.HandleOutput(nameof(TestReferenceModels), PersistenceLayer.ModelJsonExtension, obtainedModelJson);
        }

        /// <summary>
        /// Tests loading Model.json and CDM folders ManifestPersistence toData.
        /// </summary>
        [Test]
        public async Task TestExtensibilityLoadingModelJsonAndCdmFolderToData()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestExtensibilityLoadingModelJsonAndCdmFolderToData));
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(PersistenceLayer.ModelJsonExtension, cdmCorpus.Storage.FetchRootFolder("local"));

            var obtainedCdmFolder = CdmFolderPersistence.ManifestPersistence.ToData(cdmManifest, null, null);

            // For EntityReferences, entityPath contains a GUID that will not match the snapshot.
            obtainedCdmFolder.Entities.ForEach(this.RemoveEntityPathForReferencedEntities);

            this.HandleOutput(nameof(TestExtensibilityLoadingModelJsonAndCdmFolderToData), $"cdmFolder{PersistenceLayer.CdmExtension}", obtainedCdmFolder);
        }

        /// <summary>
        /// Tests that a description on a CdmFolder entity sets the description on the ModelJson entity.
        /// </summary>
        [Test]
        public async Task TestSettingModelJsonEntityDescription()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            var cdmManifest = cdmCorpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "test");
            var document = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"entity{PersistenceLayer.CdmExtension}");

            var folder = cdmCorpus.Storage.FetchRootFolder("local");
            folder.Documents.Add(document);

            var entity = document.Definitions.Add(CdmObjectType.EntityDef, "entity") as CdmEntityDefinition;
            entity.Description = "test description";

            cdmManifest.Entities.Add(entity);
            folder.Documents.Add(cdmManifest);

            var obtainedModelJson = await ManifestPersistence.ToData(cdmManifest, null, null);

            Assert.AreEqual("test description", obtainedModelJson.Entities[0]["description"].ToString());
        }

        /// <summary>
        /// Handles the obtained output.
        /// If needed, writes the output to a test debugging file.
        /// It reads expected output and compares it to the actual output.
        /// </summary>
        /// <typeparam name="T"> The type of the actual output.</typeparam>
        /// <param name="testName"> The name of the test.</param>
        /// <param name="outputFileName"> The name of the output file. Used both for expected and actual output.</param>
        /// <param name="actualOutput"> The output obtaind through operations, that is to be compared with the expected output.</param>
        /// <parameter name="doesWriteDebuggingFiles"> Whether debugging files should be written or not. </parameter>
        private void HandleOutput<T>(string testName, string outputFileName, T actualOutput, bool doesWriteTestDebuggingFiles = false)
        {
            var serializedOutput = Serialize(actualOutput);
            if (doesWriteTestDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubpath, testName, outputFileName, serializedOutput);
            }

            var expectedOutput = TestHelper.GetExpectedOutputFileContent(testsSubpath, testName, outputFileName);

            TestHelper.AssertSameObjectWasSerialized(expectedOutput, serializedOutput);
        }

        private void RemoveEntityPathForReferencedEntities(JToken entity)
        {
            var component = entity.First;
            JProperty propertyToRemove = null;
            bool shouldRemove = false;

            while (component != null)
            {
                if (component is JProperty property)
                {
                    if (string.Equals(property.Name, "entityPath"))
                    {
                        propertyToRemove = property;
                    }
                    else if (string.Equals(property.Name, "type"))
                    {
                        if (string.Equals(property.Value.Value<string>(), "ReferencedEntity"))
                        {
                            shouldRemove = true;
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                component = component.Next;
            }
            if (shouldRemove && propertyToRemove != null)
            {
                propertyToRemove.Remove();
            }
        }

        private void RemoveDescriptionFromEntityIfEmpty(JToken entity)
        {
            var component = entity.First;
            while (component != null)
            {
                if (component is JProperty property)
                {
                    if (string.Equals(property.Name, "description") && string.IsNullOrEmpty(property.Value.ToString()))
                    {
                        property.Remove();
                        return;
                    }
                }
                component = component.Next;
            }
        }
    }
}
