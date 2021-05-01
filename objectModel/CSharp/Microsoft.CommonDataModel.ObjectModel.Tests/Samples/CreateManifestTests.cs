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
    public class CreateManifestTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = "Samples";
        
        [TestInitialize]
        public void CheckSampleRunTestsFlag()
        {
            if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("SAMPLE_RUNTESTS")))
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("SAMPLE_RUNTESTS environment variable not set.");
            }
        }

        [TestMethod]
        public async Task TestCreateManifest()
        {
            TestHelper.DeleteFilesFromActualOutput(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestCreateManifest)));

            await this.CreateManifest(this.SetupCdmCorpus());
            TestHelper.AssertFolderFilesEquality(
                TestHelper.GetExpectedOutputFolderPath(testsSubpath, nameof(TestCreateManifest)),
                TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestCreateManifest)));
        }

        private CdmCorpusDefinition SetupCdmCorpus()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestCreateManifest))));
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SampleSchemaFolderPath));

            return cdmCorpus;
        }

        private async Task CreateManifest(CdmCorpusDefinition cdmCorpus)
        {
            Console.WriteLine("Make placeholder manifest");
            // Make the temp manifest and add it to the root of the local documents in the corpus
            CdmManifestDefinition manifestAbstract = cdmCorpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "tempAbstract");

            // Add each declaration, this example is about medical appointments and care plans
            manifestAbstract.Entities.Add("Account", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");
            manifestAbstract.Entities.Add("Address", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Address.cdm.json/Address");
            manifestAbstract.Entities.Add("CarePlan", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CarePlan.cdm.json/CarePlan");
            manifestAbstract.Entities.Add("CodeableConcept", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CodeableConcept.cdm.json/CodeableConcept");
            manifestAbstract.Entities.Add("Contact", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Contact.cdm.json/Contact");
            manifestAbstract.Entities.Add("Device", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Device.cdm.json/Device");
            manifestAbstract.Entities.Add("EmrAppointment", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EmrAppointment.cdm.json/EmrAppointment");
            manifestAbstract.Entities.Add("Encounter", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Encounter.cdm.json/Encounter");
            manifestAbstract.Entities.Add("EpisodeOfCare", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EpisodeOfCare.cdm.json/EpisodeOfCare");
            manifestAbstract.Entities.Add("Location", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Location.cdm.json/Location");

            // Add the temp manifest to the root of the local documents in the corpus.
            var localRoot = cdmCorpus.Storage.FetchRootFolder("local");
            localRoot.Documents.Add(manifestAbstract);

            // Create the resolved version of everything in the root folder too
            Console.WriteLine("Resolve the placeholder");
            var manifestResolved = await manifestAbstract.CreateResolvedManifestAsync("default", "");

            // Add an import to the foundations doc so the traits about partitons will resolve nicely
            manifestResolved.Imports.Add("cdm:/foundations.cdm.json");

            Console.WriteLine("Save the documents");
            foreach (CdmEntityDeclarationDefinition eDef in manifestResolved.Entities)
            {
                // Get the entity being pointed at
                var localEDef = eDef;
                var entDef = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(localEDef.EntityPath, manifestResolved);
                // Make a fake partition, just to demo that
                var part = cdmCorpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, $"{entDef.EntityName}-data-description");
                localEDef.DataPartitions.Add(part);
                part.Explanation = "not real data, just for demo";

                // Define the location of the partition, relative to the manifest
                var location = $"local:/{entDef.EntityName}/partition-data.csv";
                part.Location = cdmCorpus.Storage.CreateRelativeCorpusPath(location, manifestResolved);

                // Add trait to partition for csv params
                var csvTrait = part.ExhibitsTraits.Add("is.partition.format.CSV", false) as CdmTraitReference;
                csvTrait.Arguments.Add("columnHeaders", "true");
                csvTrait.Arguments.Add("delimiter", ",");

                // Get the actual location of the partition file from the corpus
                string partPath = cdmCorpus.Storage.CorpusPathToAdapterPath(location);

                // Make a fake file with nothing but header for columns
                string header = "";
                foreach (CdmTypeAttributeDefinition att in entDef.Attributes)
                {
                    if (header != "")
                        header += ",";
                    header += att.Name;
                }

                Directory.CreateDirectory(cdmCorpus.Storage.CorpusPathToAdapterPath($"local:/{entDef.EntityName}"));
                File.WriteAllText(partPath, header);
            }

            await manifestResolved.SaveAsAsync($"{manifestResolved.ManifestName}.manifest.cdm.json", true);
        }
    }
}
