// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace create_manifest
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    /*
     * ---------------------------------------------------------------------------------------------------------------------------------------
     * This sample is going to simulate the steps a tool would follow in order to create a new manifest document in some user storage folder 
     * when the shapes of the entities in that folder are all taken from some public standards with no extensions or additions
     * The steps are:
     *      1. Create a temporary 'manifest' object at the root of the corpus that contains a list of the selected entities
     *      2. Each selected entity points at an 'abstract' schema defintion in the public standards. These entity docs are too hard to
     *          deal with because of abstractions and inheritence, etc. So to make things concrete, we want to make a 'resolved' version of
     *          each entity doc in our local folder. To do this, we call CreateResolvedManifestAsync on our starting manifest
     *          This will resolve everything and find all of the relationships between entities for us
     *      3. Save the new documents
     *  --------------------------------------------------------------------------------------------------------------------------------------
     */

    class Program
    {
        static async Task Main(string[] args)
        {
            // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
            var cdmCorpus = new CdmCorpusDefinition();

            Console.WriteLine("Configure storage adapters");

            // Configure storage adapters to point at the target local manifest location and at the fake public standards
            string pathFromExeToExampleRoot = "../../../../../../";

            cdmCorpus.Storage.Mount("local", new LocalAdapter(pathFromExeToExampleRoot + "2-create-manifest/sample-data"));
            cdmCorpus.Storage.DefaultNamespace = "local"; // local is our default. so any paths that start out navigating without a device tag will assume local

            // Fake cdm, normaly use the github adapter
            // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

            // Example how to mount to the ADLS.
            // cdmCorpus.Storage.Mount("adls",
            //    new ADLSAdapter(
            // "<ACCOUNT-NAME>.dfs.core.windows.net", // Hostname.
            // "/<FILESYSTEM-NAME>", // Root.
            // "72f988bf-86f1-41af-91ab-2d7cd011db47",  // Tenant ID.
            // "<CLIENT-ID>",  // Client ID.
            // "<CLIENT-SECRET>" // Client secret.
            // ));

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
            foreach(CdmEntityDeclarationDefinition eDef in manifestResolved.Entities)
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
                var csvTrait = part.ExhibitsTraits.Add("is.partition.format.CSV", false);
                csvTrait.Arguments.Add("columnHeaders", "true");
                csvTrait.Arguments.Add("delimiter", ",");
                
                // Get the actual location of the partition file from the corpus
                string partPath = cdmCorpus.Storage.CorpusPathToAdapterPath(location);

                // Make a fake file with nothing but header for columns
                string header = "";
                foreach(CdmTypeAttributeDefinition att in entDef.Attributes)
                {
                    if (header != "")
                        header += ",";
                    header += att.Name;
                }

                Directory.CreateDirectory(cdmCorpus.Storage.CorpusPathToAdapterPath($"local:/{ entDef.EntityName}"));
                File.WriteAllText(partPath, header);
            }

            await manifestResolved.SaveAsAsync($"{manifestResolved.ManifestName}.manifest.cdm.json", true);
        }
    }
}
