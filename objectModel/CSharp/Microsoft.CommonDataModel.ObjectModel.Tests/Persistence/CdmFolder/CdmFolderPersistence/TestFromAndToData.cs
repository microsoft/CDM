// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json;

    [TestClass]
    public class CdmFolderPersistenceTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "CdmFolder", "CdmFolderPersistence");

        /// <summary>
        /// Test loading and saving cdm folder files.
        /// </summary>
        [TestMethod]
        public async Task TestFromAndToData()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestFromAndToData), isLanguageSpecific: true);

            var folder = corpus.Storage.FetchRootFolder("local");
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"default{PersistenceLayer.ManifestExtension}", folder);
            var actualData = ManifestPersistence.ToData(manifest, null, null);

            foreach(var entity in manifest.Entities)
            {
                await corpus.FetchObjectAsync<CdmEntityDefinition>(entity.EntityPath, manifest);
            }

            corpus.Storage.FetchRootFolder("output").Documents.Add(manifest);
            await manifest.SaveAsAsync($"default{PersistenceLayer.ManifestExtension}", saveReferenced: true);

            var expected_data = TestHelper.GetExpectedOutputFileContent(testsSubpath, nameof(TestFromAndToData), $"default{PersistenceLayer.ManifestExtension}");
            TestHelper.AssertSameObjectWasSerialized(expected_data, 
                JsonConvert.SerializeObject(actualData, Formatting.Indented, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
        }
    }
}
