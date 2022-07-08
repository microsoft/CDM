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
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;

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
            Assert.Performance(9800, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput(nameof(TestLoadingCdmFolderAndModelJsonToData), "model.json", obtainedModelJson, isLanguageSpecific: true);
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

            Assert.IsNull(cdmManifest.Imports.Item(Constants.FoundationsCorpusPath, checkMoniker: false));
            Assert.AreEqual(1, obtainedModelJson.Imports.Count);
            Assert.AreEqual(Constants.FoundationsCorpusPath, obtainedModelJson.Imports[0].CorpusPath);

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
                    if (statusLevel >= CdmStatusLevel.Warning)
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
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "notImportantLocation");
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
            var modelIdTrait1 = referenceEntity1.ExhibitsTraits.Add("is.propertyContent.multiTrait") as CdmTraitReference;
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
            var modelIdTrait3 = referenceEntity3.ExhibitsTraits.Add("is.propertyContent.multiTrait") as CdmTraitReference;
            modelIdTrait3.IsFromProperty = true;
            modelIdTrait3.Arguments.Add("modelId", "3b2e040a-c8c5-4508-bb42-09952eb04a50");
            manifest.Entities.Add(referenceEntity3);

            // entity with same modelId and same location
            var referenceEntity4 = new CdmReferencedEntityDeclarationDefinition(corpus.Ctx, "ReferenceEntity4")
            {
                EntityPath = "remote:/contoso/entity.model.json/Entity4"
            };
            var modelIdTrait4 = referenceEntity4.ExhibitsTraits.Add("is.propertyContent.multiTrait") as CdmTraitReference;
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
        /// Tests that traits that convert into annotations are properly converted on load and save
        /// </summary>
        [Test]
        public async Task TestLoadingAndSavingCdmTraits()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingAndSavingCdmTraits));
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json");
            var entity = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("someEntity.cdm.json/someEntity");
            Assert.NotNull(entity.ExhibitsTraits.Item("is.CDM.entityVersion"));

            var manifestData = await ManifestPersistence.ToData(manifest, new ResolveOptions(manifest.InDocument), new CopyOptions());
            var versionAnnotation = (manifestData.Entities[0]["annotations"][0]).ToObject<Annotation>();
            Assert.AreEqual("<version>", versionAnnotation.Value);
        }

        /// <summary>
        /// Tests that the "date" and "time" data types are correctly loaded/saved from/to a model.json.
        /// </summary>
        [Test]
        public async Task TestLoadingAndSavingDateAndTimeDataTypes()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingAndSavingDateAndTimeDataTypes));

            // Load the manifest and resolve it
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");
            var resolvedManifest = await manifest.CreateResolvedManifestAsync("resolved", null);

            // Convert loaded manifest to model.json
            var modelJson = await ManifestPersistence.ToData(resolvedManifest, null, null);

            // Verify that the attributes' data types were correctly persisted as "date" and "time"
            Assert.AreEqual("date", modelJson.Entities[0]["attributes"][0]["dataType"].ToString());
            Assert.AreEqual("time", modelJson.Entities[0]["attributes"][1]["dataType"].ToString());

            // Now check that these attributes' data types are still "date" and "time" when loading the model.json back to manifest
            // We first need to create a second adapter to the input folder to fool the OM into thinking it's different
            // This is because there's a bug that currently prevents us from saving and then loading a model.json under the same namespace
            cdmCorpus.Storage.Mount("local2", new LocalAdapter(TestHelper.GetInputFolderPath(testsSubpath, nameof(TestLoadingAndSavingDateAndTimeDataTypes))));

            var manifestFromModelJson = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local2:/model.json");
            var entity = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(manifestFromModelJson.Entities[0].EntityPath, manifestFromModelJson);

            // Verify that the attributes' data types were correctly loaded as "date" and "time"
            Assert.AreEqual(CdmDataFormat.Date, (entity.Attributes[0] as CdmTypeAttributeDefinition).DataFormat);
            Assert.AreEqual(CdmDataFormat.Time, (entity.Attributes[1] as CdmTypeAttributeDefinition).DataFormat);
        }

        /// <summary>
        /// Test model.json is correctly created without an entity when the location is not recognized
        /// </summary>
        [Test]
        public async Task TestIncorrectModelLocation()
        {
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrStorageInvalidAdapterPath, CdmLogCode.ErrPersistModelJsonEntityParsingError, CdmLogCode.ErrPersistModelJsonRefEntityInvalidLocation };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestIncorrectModelLocation", expectedCodes: expectedLogCodes);
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("model.json");
            Assert.NotNull(manifest);
            Assert.AreEqual(0, manifest.Entities.Count);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrPersistModelJsonRefEntityInvalidLocation, true);
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
        /// <parameter name="doesWriteTestDebuggingFiles"> Whether debugging files should be written or not. </parameter>
        /// <param name="isLanguageSpecific">There is a subfolder called CSharp.</param>
        private void HandleOutput<T>(string testName, string outputFileName, T actualOutput, bool doesWriteTestDebuggingFiles = false, bool isLanguageSpecific = false)
        {
            var serializedOutput = Serialize(actualOutput);
            if (doesWriteTestDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubpath, testName, outputFileName, serializedOutput);
            }

            var expectedOutput = TestHelper.GetExpectedOutputFileContent(testsSubpath, testName, outputFileName, isLanguageSpecific: isLanguageSpecific);

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
