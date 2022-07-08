// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Samples
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;

    [TestClass]
    public class SearchPartitionPatternTests
    {
        /// <summary> 
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = "Samples";

        [TestInitialize]
        public void CheckSampleRunTestsFlag()
        {
            if (Environment.GetEnvironmentVariable("SAMPLE_RUNTESTS") != "1")
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("SAMPLE_RUNTESTS environment variable not set.");
            }
        }

        [TestMethod]
        public async Task TestSearchPartitionPattern()
        {
            TestHelper.DeleteFilesFromActualOutput(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestSearchPartitionPattern)));
            TestHelper.CopyFilesFromInputToActualOutput(testsSubpath, nameof(TestSearchPartitionPattern));

            await SearchPartitionPattern(SetupCdmCorpus());

            // Replace all the "lastFileStatusCheckTime" value in the manifest to "2020-08-01T00:00:00.000Z".
            string manifestPath = Path.Combine(
                TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestSearchPartitionPattern)),
                "default.manifest.cdm.json");
            string content = File.ReadAllText(manifestPath);
            content = Regex.Replace(content, "\"lastFileStatusCheckTime\": \".*\"", "\"lastFileStatusCheckTime\": \"2020-08-01T00:00:00.000Z\"");
            content = Regex.Replace(content, "\"lastFileModifiedTime\": \".*\"", "\"lastFileModifiedTime\": \"2020-08-02T00:00:00.000Z\"");
            content = Regex.Replace(content, "\"lastChildFileModifiedTime\": \".*\"", "\"lastChildFileModifiedTime\": \"2020-08-02T00:00:00.000Z\"");

            File.WriteAllText(manifestPath, content);

            TestHelper.AssertFolderFilesEquality(
                TestHelper.GetExpectedOutputFolderPath(testsSubpath, nameof(TestSearchPartitionPattern)),
                TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestSearchPartitionPattern)), true);
        }

        private CdmCorpusDefinition SetupCdmCorpus()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestSearchPartitionPattern))));
            cdmCorpus.Storage.DefaultNamespace = "local";

            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SampleSchemaFolderPath));

            return cdmCorpus;
        }

        private async Task SearchPartitionPattern(CdmCorpusDefinition cdmCorpus)
        {
            string sampleEntityName = "Account";

            Console.WriteLine("Make placeholder manifest");
            // Make the temp manifest and add it to the root of the local documents in the corpus
            CdmManifestDefinition manifestAbstract = cdmCorpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "tempAbstract");

            // Add the temp manifest to the root of the local documents in the corpus.
            var localRoot = cdmCorpus.Storage.FetchRootFolder("local");
            localRoot.Documents.Add(manifestAbstract, "tempAbstract.manifest.cdm.json");

            // Add an entity named Account from some public standards
            Console.WriteLine("Add an entity named Account from some public standards");
            var accountDeclarationDefinition = manifestAbstract.Entities.Add(sampleEntityName, "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");

            // Create a data partition pattern
            var dataPartitionPattern = CreatePartitionPatternDefinition(cdmCorpus, "sampleDataPartitionPattern");
            dataPartitionPattern.Explanation = "/ capture 4 digits / capture a word / capture one or more digits after the word cohort but before .csv";
            Console.WriteLine($"    Assign regular expression of the data partition pattern to: {dataPartitionPattern.RegularExpression}");
            Console.WriteLine($"    Assign root location of the data partition pattern to: {dataPartitionPattern.RootLocation}");

            // Add the data partition pattern we just created to the entity data partition pattern collection
            accountDeclarationDefinition.DataPartitionPatterns.Add(dataPartitionPattern);

            // Create incremental partition patterns
            var upsertIncrementalPartitionPattern = CreatePartitionPatternDefinition(cdmCorpus, "UpsertPattern", true, true);
            AddIncrementalPartitionTrait(upsertIncrementalPartitionPattern, CdmIncrementalPartitionType.Upsert);
            Console.WriteLine($"\n    Assign regular expression of the first incremental partition pattern to: {upsertIncrementalPartitionPattern.RegularExpression}");
            Console.WriteLine($"    Assign root location of the first incremental partition pattern to: {upsertIncrementalPartitionPattern.RootLocation}");

            var deleteIncrementalPartitionPattern = CreatePartitionPatternDefinition(cdmCorpus, "DeletePattern", true);
            AddIncrementalPartitionTrait(deleteIncrementalPartitionPattern, CdmIncrementalPartitionType.Delete, "FullDataPattern");
            Console.WriteLine($"\n    Assign regular expression of the second incremental partition pattern to: {deleteIncrementalPartitionPattern.RegularExpression}");
            Console.WriteLine($"    Assign root location of the second incremental partition pattern to: {deleteIncrementalPartitionPattern.RootLocation}");

            // Add the incremental partition patterns we just created to the entity increment partition pattern collection
            accountDeclarationDefinition.IncrementalPartitionPatterns.Add(upsertIncrementalPartitionPattern);
            accountDeclarationDefinition.IncrementalPartitionPatterns.Add(deleteIncrementalPartitionPattern);

            // Add an import to the foundations doc so the traits about partitons will resolve nicely
            manifestAbstract.Imports.Add("cdm:/foundations.cdm.json");

            // Calling FileStatusCheckAsync to pick up the all data partition files which names match the data partition pattern,
            // and add them to the entity in the manifest
            await manifestAbstract.FileStatusCheckAsync(PartitionFileStatusCheckType.FullAndIncremental);

            // List all data partition locations.
            Console.WriteLine($"\nlist of all data partition locations for the entity Account matches the data partition pattern:");

            foreach (CdmDataPartitionDefinition dataPartition in accountDeclarationDefinition.DataPartitions)
            {
                Console.WriteLine($"    {dataPartition.Location}");
            }

            // List all incremental partition locations.
            Console.WriteLine($"\nlist of all incremental partition locations for the entity Account matches the incremental partition pattern:");

            foreach (CdmDataPartitionDefinition incrementalPartition in accountDeclarationDefinition.IncrementalPartitions)
            {
                Console.WriteLine($"    {incrementalPartition.Location}");
            }

            Console.WriteLine("Resolve the manifest");
            var manifestResolved = await manifestAbstract.CreateResolvedManifestAsync("default", null);
            await manifestResolved.SaveAsAsync($"{manifestResolved.ManifestName}.manifest.cdm.json", true);

            // You can save the doc as a model.json format as an option
            // await manifestResolved.SaveAsAsync("model.json", true);
        }

        /// <summary>
        /// Add incremental partition trait "is.partition.incremental" and supplied arguments to the given data partition pattern.
        /// </summary>
        /// <param name="patternDef"> The data partition pattern. </param>
        /// <param name="type"> The CdmIncrementalPartitionType, this is a required argument for the incremental trait. </param>
        /// <param name="fullDataPartitionPatternName"> The name of the full data partition pattern name, this is optional. </param>
        private static void AddIncrementalPartitionTrait(CdmDataPartitionPatternDefinition patternDef, CdmIncrementalPartitionType type, string fullDataPartitionPatternName = null)
        {
            var typeTuple = new Tuple<string, dynamic>("type", type.ToString());
            var arguments = new List<Tuple<string, dynamic>>() { typeTuple };
            if (!string.IsNullOrEmpty(fullDataPartitionPatternName))
            {
                arguments.Add(new Tuple<string, dynamic>("fullDataPartitionPatternName", fullDataPartitionPatternName));
            }

            patternDef.ExhibitsTraits.Add("is.partition.incremental", arguments);
        }

        /// <summary>
        /// Create a CdmDataPartitionPatternDefinition object with the given name and set up the required properties of the object.
        /// </summary>
        /// <param name="corpus"> The corpus. </param>
        /// <param name="name"> The name of the data partition pattern object. </param>
        /// <param name="isIncrementalPartitionPattern"> Whether this is an incrmental partition pattern object. </param>
        /// <param name="isUpsert"> Whether this is an upsert incrmental partition pattern object. </param>
        private static CdmDataPartitionPatternDefinition CreatePartitionPatternDefinition(CdmCorpusDefinition corpus, string name, bool isIncrementalPartitionPattern = false, bool isUpsert = false)
        {
            var partitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, name, false);
            partitionPattern.RootLocation = isIncrementalPartitionPattern ? "/IncrementalData" : "FullData";
            if (!isIncrementalPartitionPattern)
            {
                // the line below demonstrates using "GlobPattern" which can be used instead of "RegularExpression"
                // dataPartitionPattern.GlobPattern = "/*/cohort*.csv";
                partitionPattern.RegularExpression = "/(\\d{4})/(\\w+)/cohort(\\d+)\\.csv$";
                partitionPattern.Parameters = new List<string> { "year", "month", "cohortNumber" };
            }
            else
            {
                var folderName = isUpsert ? "Upserts" : "Deletes";
                var partitionNumberString = isUpsert ? "upsertPartitionNumber" : "deletePartitionNumber";
                partitionPattern.RegularExpression = $"/(.*)/(.*)/(.*)/{folderName}/(\\d+)\\.csv$";
                partitionPattern.Parameters = new List<string> { "year", "month", "day", partitionNumberString };
            }

            return partitionPattern;
        }
    }
}
