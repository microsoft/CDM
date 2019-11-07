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

    /// <summary>
    /// The model json tests.
    /// </summary>
    public class ModelJsonTests : ModelJsonTestsBase
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "ModelJson", "ModelJson");

        private bool doesWriteTestDebuggingFiles = TestHelper.DoesWriteTestDebuggingFiles;

        private readonly string CdmRootPath = Path.Combine(TestHelper.TestDataPath, "Persistence", "CdmFolder", "TestCorpus");
        private readonly string ModelJsonExtensibilityRootPath = Path.Combine(TestHelper.TestDataPath, "Persistence", "ModelJson", "Extensibility");

        /// <summary>
        /// Test ManifestPersistence fromData and toData and save it back to a file.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestFromAndToData()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestFromAndToData");
            var cdmCorpus = this.GetLocalCorpus(testInputPath);

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json", cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedModelJson = await ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput("TestFromAndToData", "model.json", obtainedModelJson);
        }

        /// <summary>
        /// Test loading CDM folder files and save the model.json file.
        /// </summary>
        /// <returns> The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingCdmFolderAndSavingModelJson()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestLoadingCdmFolderAndSavingModelJson");
            var cdmCorpus = this.GetLocalCorpus(testInputPath);

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json", cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");
            
            watch.Restart();
            var obtainedModelJson= await ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(5000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput("TestLoadingCdmFolderAndSavingModelJson", "model.json", obtainedModelJson);
        }

        /// <summary>
        /// Test loading model json result files and save it as CDM folders files.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingModelJsonResultAndSavingCdmFolder()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestLoadingModelJsonResultAndSavingCdmFolder");
            var cdmCorpus = this.GetLocalCorpus(testInputPath);

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("result.manifest.model.json", cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedCdmFolder = CdmFolderPersistence.ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput("TestLoadingModelJsonResultAndSavingCdmFolder", "cdmFolder.json", obtainedCdmFolder);
        }

        /// <summary>
        /// Test loading model.json files and save as CDM folders files.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingModelJsonAndSavingCdmFolder()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestLoadingModelJsonAndSavingCdmFolder");
            var cdmCorpus = this.GetLocalCorpus(testInputPath);

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json", cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedCdmFolder = CdmFolderPersistence.ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            this.HandleOutput("TestLoadingModelJsonAndSavingCdmFolder", "cdmFolder.json", obtainedCdmFolder);
        }

        /// <summary>
        /// Test loading CDM folder result files and save as model.json.
        /// </summary>
        /// <returns>The <see cref="Task"/>.</returns>
        [Test]
        [Retry(3)]
        public async Task TestLoadingCdmFolderResultAndSavingModelJson()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestLoadingCdmFolderResultAndSavingModelJson");
            var cdmCorpus = this.GetLocalCorpus(testInputPath);

            var watch = Stopwatch.StartNew();
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("result.model.manifest.cdm.json", cdmCorpus.Storage.FetchRootFolder("local"));
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Loading from data");

            watch.Restart();
            var obtainedModelJson = await ManifestPersistence.ToData(cdmManifest, null, null);
            watch.Stop();
            Assert.Performance(1000, watch.ElapsedMilliseconds, "Parsing to data");

            // remove empty description from entities as they interfere with test.
            obtainedModelJson.Entities.ForEach(RemoveDescriptionFromEntityIfEmpty);
            obtainedModelJson.Description = null;

            this.HandleOutput("TestLoadingCdmFolderResultAndSavingModelJson", "model.json", obtainedModelJson);
        }

        /// <summary>
        /// Tests loading Model.json and converting to a CdmFolder.
        /// </summary>
        [Test]
        public async Task TestExtensibilityLoadingModelJsonAndSavingCdmFolder()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestExtensibilityLoadingModelJsonAndSavingCdmFolder");
            var cdmCorpus = this.GetLocalCorpus(testInputPath);
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("SerializerTesting-model.json", cdmCorpus.Storage.FetchRootFolder("local"));

            var obtainedCdmFolder = CdmFolderPersistence.ManifestPersistence.ToData(cdmManifest, null, null);

            // For EntityReferences, entityPath contains a GUID that will not match the snapshot.
            obtainedCdmFolder.Entities.ForEach(this.RemoveEntityPathForReferencedEntities);

            this.HandleOutput("TestExtensibilityLoadingModelJsonAndSavingCdmFolder", "cdmFolder.json", obtainedCdmFolder);
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
        private void HandleOutput<T>(string testName, string outputFileName, T actualOutput)
        {
            var serializedOutput = Serialize(actualOutput);
            if (this.doesWriteTestDebuggingFiles)
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
