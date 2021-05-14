// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Samples
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ReadLocalSaveAdlsTests
    {
        /// <summary> 
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = "Samples";

        private string rootRelativePath;

        [TestInitialize]
        public void CheckSampleRunTestsFlag()
        {
            // Check if ADLS_RUNTESTS flag is set.
            AdlsTestHelper.CheckADLSEnvironment();
            
            // Check if SAMPLE_RUNTESTS flag is set.
            if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("SAMPLE_RUNTESTS")))
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("SAMPLE_RUNTESTS environment variable not set.");
            }
        }

        [TestMethod]
        public async Task TestReadLocalSaveAdls()
        {
            TestHelper.DeleteFilesFromActualOutput(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestReadLocalSaveAdls)));
            rootRelativePath = $"Samples/TestReadLocalSaveAdls/{Environment.GetEnvironmentVariable("USERNAME")}_{Environment.GetEnvironmentVariable("COMPUTERNAME")}_CSharp";
            
            // Modify partition.location in model.json and save it into actual output
            AdlsModelJsonTestHelper.UpdateInputAndExpectedAndSaveToActualSubFolder(
                testsSubpath,
                nameof(TestReadLocalSaveAdls),
                rootRelativePath,
                "model.json",
                "OrdersProductsCustomersLinked",
                DateTimeOffset.Now.ToString()
            );

            CdmCorpusDefinition cdmCorpus = this.SetupCdmCorpus();
            await this.ReadLocalSaveAdls(cdmCorpus);

            // Check the model.json file in ADLS and delete it.
            string actualContent = await cdmCorpus.Storage.FetchAdapter("adls").ReadAsync("model.json");
            AdlsModelJsonTestHelper.SaveModelJsonToActualOutput(testsSubpath, nameof(TestReadLocalSaveAdls), "model.json", actualContent);

            string expectedContent = AdlsModelJsonTestHelper.GetExpectedFileContent(testsSubpath, nameof(TestReadLocalSaveAdls), "model.json");
            TestHelper.AssertSameObjectWasSerialized(expectedContent, actualContent);
        }

        private CdmCorpusDefinition SetupCdmCorpus()
        {
            // ------------------------------------------------------------------------------------------------------------
            // Instantiate corpus and set up the default namespace to be local
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";

            // ------------------------------------------------------------------------------------------------------------
            // Set up adapters for managing access to different files-system locations c

            // Fake cdm, normaly use the CDM Standards adapter
            // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SampleSchemaFolderPath));

            cdmCorpus.Storage.Mount(
                "local",
                new LocalAdapter(AdlsModelJsonTestHelper.GetActualSubFolderPath(testsSubpath, nameof(TestReadLocalSaveAdls), AdlsModelJsonTestHelper.inputFolderName))
            );

            // Example how to mount to the ADLS - make sure the hostname and root entered here are also changed
            // in the example.model.json file we load in the next section
            cdmCorpus.Storage.Mount(
                "adls",
                AdlsTestHelper.CreateAdapterWithClientId(rootRelativePath)
            );

            return cdmCorpus;
        }

        private async Task ReadLocalSaveAdls(CdmCorpusDefinition cdmCorpus)
        {
            // ------------------------------------------------------------------------------------------------------------
            // Load a model.json file from local FS

            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/model.json");

            // ------------------------------------------------------------------------------------------------------------
            // Explore entities and partitions defined in the model

            Console.WriteLine("Listing entity declarations:");
            foreach (CdmEntityDeclarationDefinition decl in manifest.Entities)
            {
                Console.WriteLine("  " + decl.EntityName);

                // TODO: This can be rewritten in a different way since data partition gives null for referenced entities, suggestions are welcome.
                if (decl.ObjectType == CdmObjectType.LocalEntityDeclarationDef)
                {
                    foreach (CdmDataPartitionDefinition dataPart in decl.DataPartitions)
                    {
                        Console.WriteLine("    " + dataPart.Location);
                    }
                }
            }

            // ------------------------------------------------------------------------------------------------------------
            // Make changes to the model

            // Create a new document where the new entity's definition will be stored
            var newEntityDoc = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, "NewEntity.cdm.json", false);
            newEntityDoc.Imports.Add("cdm:/foundations.cdm.json");
            cdmCorpus.Storage.FetchRootFolder("local").Documents.Add(newEntityDoc);

            var newEntity = newEntityDoc.Definitions.Add(CdmObjectType.EntityDef, "NewEntity") as CdmEntityDefinition;

            // Define new string attribute and add it to the entity definition
            var newAttribute = cdmCorpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "NewAttribute", false);
            newAttribute.DataFormat = CdmDataFormat.String;
            newEntity.Attributes.Add(newAttribute);

            // Call will create EntityDeclarationDefinition based on entity definition and add it to manifest.Entities
            var newEntityDecl = manifest.Entities.Add(newEntity);

            // Define a partition and add it to the local declaration
            var newPartition = cdmCorpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "NewPartition", false);
            newPartition.Location = "adls:/NewPartition.csv";
            newEntityDecl.DataPartitions.Add(newPartition);

            // ------------------------------------------------------------------------------------------------------------
            // Save the file to ADLSg2 - we achieve that by adding the manifest to the root folder of
            // the ADLS file-system and performing a save on the manifest

            CdmFolderDefinition adlsFolder = cdmCorpus.Storage.FetchRootFolder("adls");
            adlsFolder.Documents.Add(manifest);
            await manifest.SaveAsAsync("model.json", true);
        }
    }
}
