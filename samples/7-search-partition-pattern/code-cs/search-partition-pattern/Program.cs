// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace search_partition_pattern
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;

    /*
    * ----------------------------------------------------------------------------------------------------------------------------------------
    * This sample demonstrates how to perform a data partition pattern search on an existing entity.
    * Note: A data partition pattern describes a search space over a set of files that can be used to infer or discover and list new data partition files
    * The steps are:
    *   1. Load an entity named 'Account' from some public standards
    *   2. Create a data partition pattern and add it to 'Account' entity
    *   3. Find all the associated partition files, and add them to the data partition to the entity in the manifest
    *   4. Resolve the manifest and save the new documents
    * ----------------------------------------------------------------------------------------------------------------------------------------
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
            string sampleEntityName = "Account";

            // Mount is as a local device.
            cdmCorpus.Storage.Mount("local", new LocalAdapter(pathFromExeToExampleRoot + "7-search-partition-pattern"));
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
            // make the temp manifest and add it to the root of the local documents in the corpus
            CdmManifestDefinition manifestAbstract = cdmCorpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "tempAbstract");

            // Add the temp manifest to the root of the local documents in the corpus.
            var localRoot = cdmCorpus.Storage.FetchRootFolder("local");
            localRoot.Documents.Add(manifestAbstract, "tempAbstract.manifest.cdm.json");

            // Add an entity named Account from some public standards
            Console.WriteLine("Add an entity named Account from some public standards");
            var personDeclarationDefinition = manifestAbstract.Entities.Add(sampleEntityName, "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");

            // Create a data partition pattern
            var dataPartitionPattern = cdmCorpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, "sampleDataPartitionPattern", false);
            dataPartitionPattern.RootLocation = "local:dataFiles";
            dataPartitionPattern.RegularExpression = "/(\\d{4})/(\\w+)/cohort(\\d+)\\.csv$";
            Console.WriteLine($"    Assign regular expression of the data partition pattern to: {dataPartitionPattern.RegularExpression}");
            Console.WriteLine($"    Assign root location of the data partition pattern to: {dataPartitionPattern.RootLocation}");
            dataPartitionPattern.Explanation = "/ capture 4 digits / capture a word / capture one or more digits after the word cohort but before .csv";
            dataPartitionPattern.Parameters = new List<string> { "year", "month", "cohortNumber" };

            // Add the data partition pattern we just created to the entity data partition pattern collection
            personDeclarationDefinition.DataPartitionPatterns.Add(dataPartitionPattern);

            // Calling FileStatusCheckAsync to pick up the all data partition files which names match the data partition pattern,
            // and add them to the entity in the manifest
            await manifestAbstract.FileStatusCheckAsync();

            // List all data partition locations.
            Console.WriteLine($"\nlist of all data partition locations for the entity Account matches the data partition pattern:");
            
            foreach (CdmDataPartitionDefinition dataPartition in personDeclarationDefinition.DataPartitions)
            {
                Console.WriteLine($"    {dataPartition.Location}");
            }

            Console.WriteLine("Resolve the manifest");
            var manifestResolved = await manifestAbstract.CreateResolvedManifestAsync("default", null);
            await manifestResolved.SaveAsAsync($"{manifestResolved.ManifestName}.manifest.cdm.json", true);

            // You can save the doc as a model.json format as an option
            // await manifestResolved.SaveAsAsync("model.json", true);
        }
    }
}
