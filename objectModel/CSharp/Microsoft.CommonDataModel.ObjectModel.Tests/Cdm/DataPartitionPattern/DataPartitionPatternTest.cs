// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.DataPartitionPattern
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;

    [TestClass]
    public class DataPartitionPatternTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "DataPartitionPattern");

        /// <summary>
        /// Tests refreshing files that match the regular expression
        /// </summary>
        [TestMethod]
        public async Task TestRefreshesDataPartitionPatterns()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRefreshDataPartitionPatterns");
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/patternManifest.manifest.cdm.json");

            var partitionEntity = cdmManifest.Entities.AllItems[1];
            Assert.AreEqual(partitionEntity.DataPartitions.Count, 1);

            var timeBeforeLoad = DateTime.Now;

            await cdmManifest.FileStatusCheckAsync();

            // file status check should check patterns and add two more partitions that match the pattern
            // should not re-add already existing partitions

            // Mac and Windows behave differently when listing file content, so we don't want to be strict about partition file order
            int totalExpectedPartitionsFound = 0;
            foreach (CdmDataPartitionDefinition partition in partitionEntity.DataPartitions.AllItems)
            {
                switch (partition.Location)
                {
                    case "partitions/existingPartition.csv":
                        totalExpectedPartitionsFound++;
                        break;

                    case "partitions/someSubFolder/someSubPartition.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(partition.SpecializedSchema, "test special schema");
                        Assert.IsTrue(partition.LastFileStatusCheckTime > timeBeforeLoad);

                        // inherits the exhibited traits from pattern
                        Assert.AreEqual(partition.ExhibitsTraits.Count, 1);
                        Assert.AreEqual(partition.ExhibitsTraits.AllItems[0].NamedReference, "is");

                        Assert.AreEqual(partition.Arguments.Count, 1);
                        Assert.IsTrue(partition.Arguments.ContainsKey("testParam1"));
                        List<string> argArray = partition.Arguments["testParam1"];
                        Assert.AreEqual(argArray.Count, 1);
                        Assert.AreEqual(argArray[0], "/someSubFolder/someSub");
                        break;
                    case "partitions/newPartition.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(partition.Arguments.Count, 1);
                        break;
                    case "partitions/2018/folderCapture.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(partition.Arguments.Count, 1);
                        Assert.AreEqual(partition.Arguments.ContainsKey("year"), true);
                        Assert.AreEqual(partition.Arguments["year"][0], "2018");
                        break;
                    case "partitions/2018/8/15/folderCapture.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(partition.Arguments.Count, 3);
                        Assert.AreEqual(partition.Arguments.ContainsKey("year"), true);
                        Assert.AreEqual(partition.Arguments["year"][0], "2018");
                        Assert.AreEqual(partition.Arguments.ContainsKey("month"), true);
                        Assert.AreEqual(partition.Arguments["month"][0], "8");
                        Assert.AreEqual(partition.Arguments.ContainsKey("day"), true);
                        Assert.AreEqual(partition.Arguments["day"][0], "15");
                        break;
                    case "partitions/2018/8/15/folderCaptureRepeatedGroup.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(partition.Arguments.Count, 1);
                        Assert.AreEqual(partition.Arguments.ContainsKey("day"), true);
                        Assert.AreEqual(partition.Arguments["day"][0], "15");
                        break;
                    case "partitions/testTooFew.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(partition.Arguments.Count, 0);
                        break;
                    case "partitions/testTooMany.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(partition.Arguments.Count, 0);
                        break;
                }
            }

            Assert.AreEqual(totalExpectedPartitionsFound, 8);
        }

        /// <summary>
        /// Tests data partition objects created by a partition pattern do not share the same trait with the partition pattern
        /// </summary>
        [TestMethod]
        public async Task TestRefreshesDataPartitionPatternsWithTrait()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestRefreshesDataPartitionPatternsWithTrait));
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/patternManifest.manifest.cdm.json");

            var partitionEntity = manifest.Entities.AllItems[0];
            Assert.AreEqual(1, partitionEntity.DataPartitionPatterns.Count);
            Assert.AreEqual(0, partitionEntity.DataPartitions.Count);

            var traitDef = new CdmTraitDefinition(corpus.Ctx, "testTrait");
            traitDef.Parameters.Add(new CdmParameterDefinition(corpus.Ctx, "argument value"));
            var patternTraitRef = partitionEntity.DataPartitionPatterns[0].ExhibitsTraits.Add("testTrait") as CdmTraitReference;
            patternTraitRef.Arguments.Add("int", 1);
            patternTraitRef.Arguments.Add("bool", true);
            patternTraitRef.Arguments.Add("string", "a");

            await manifest.FileStatusCheckAsync();

            Assert.AreEqual(2, partitionEntity.DataPartitions.Count);
            patternTraitRef = partitionEntity.DataPartitionPatterns[0].ExhibitsTraits.Item("testTrait") as CdmTraitReference;
            Assert.AreEqual(1, patternTraitRef.Arguments[0].Value);
            Assert.IsTrue(patternTraitRef.Arguments[1].Value);
            patternTraitRef.Arguments[0].Value = 3;
            patternTraitRef.Arguments[1].Value = false;

            var partitionTraitRef = partitionEntity.DataPartitions[0].ExhibitsTraits.Item("testTrait") as CdmTraitReference;
            Assert.AreNotEqual(partitionTraitRef, patternTraitRef);
            Assert.AreEqual(1, partitionTraitRef.Arguments[0].Value);
            Assert.IsTrue(partitionTraitRef.Arguments[1].Value);
            partitionTraitRef.Arguments[0].Value = 2;

            Assert.AreEqual(1, (partitionEntity.DataPartitions[1].ExhibitsTraits.Item("testTrait") as CdmTraitReference).Arguments[0].Value);
        }

        /// <summary>
        /// Tests refreshing incremental partition files that match the regular expression
        /// </summary>
        [TestMethod]
        public async Task TestIncrementalPatternsRefreshesFullAndIncremental()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestIncrementalPatternsRefreshesFullAndIncremental));
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            var partitionEntity = manifest.Entities[0];
            Assert.AreEqual(0, partitionEntity.DataPartitions.Count);
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);
            Assert.AreEqual(1, partitionEntity.DataPartitionPatterns.Count);
            Assert.AreEqual(2, partitionEntity.IncrementalPartitionPatterns.Count);

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.FullAndIncremental);

            // Mac and Windows behave differently when listing file content, so we don't want to be strict about partition file order
            int totalExpectedPartitionsFound = 0;

            Assert.AreEqual(1, partitionEntity.DataPartitions.Count);
            totalExpectedPartitionsFound++;
            Assert.IsFalse(partitionEntity.DataPartitions[0].IsIncremental);

            foreach (CdmDataPartitionDefinition partition in partitionEntity.IncrementalPartitions)
            {
                switch (partition.Location)
                {
                    case "/IncrementalData/2018/8/15/Deletes/delete1.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(4, partition.Arguments.Count);
                        Assert.IsTrue(partition.Arguments.ContainsKey("year"));
                        Assert.AreEqual("2018", partition.Arguments["year"][0]);
                        Assert.IsTrue(partition.Arguments.ContainsKey("month"));
                        Assert.AreEqual("8", partition.Arguments["month"][0]);
                        Assert.IsTrue(partition.Arguments.ContainsKey("day"));
                        Assert.AreEqual("15", partition.Arguments["day"][0]);
                        Assert.IsTrue(partition.Arguments.ContainsKey("deletePartitionNumber"));
                        Assert.AreEqual("1", partition.Arguments["deletePartitionNumber"][0]);
                        Assert.AreEqual(1, partition.ExhibitsTraits.Count);
                        var trait1 = partition.ExhibitsTraits[0];
                        Assert.AreEqual(Constants.IncrementalTraitName, trait1.FetchObjectDefinitionName());
                        Assert.AreEqual("DeletePattern", (trait1 as CdmTraitReference).Arguments.Item(Constants.IncrementalPatternParameterName).Value);
                        Assert.AreEqual(CdmIncrementalPartitionType.Delete.ToString(), (trait1 as CdmTraitReference).Arguments.Item("type").Value);
                        Assert.AreEqual("FullDataPattern", (trait1 as CdmTraitReference).Arguments.Item("fullDataPartitionPatternName").Value);
                        break;
                    case "/IncrementalData/2018/8/15/Deletes/delete2.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(4, partition.Arguments.Count);
                        Assert.AreEqual("2018", partition.Arguments["year"][0]);
                        Assert.AreEqual("8", partition.Arguments["month"][0]);
                        Assert.AreEqual("15", partition.Arguments["day"][0]);
                        Assert.AreEqual("2", partition.Arguments["deletePartitionNumber"][0]);
                        var trait2 = partition.ExhibitsTraits[0];
                        Assert.AreEqual(Constants.IncrementalTraitName, trait2.FetchObjectDefinitionName());
                        Assert.AreEqual("DeletePattern", (trait2 as CdmTraitReference).Arguments.Item(Constants.IncrementalPatternParameterName).Value);
                        Assert.AreEqual(CdmIncrementalPartitionType.Delete.ToString(), (trait2 as CdmTraitReference).Arguments.Item("type").Value);
                        Assert.AreEqual("FullDataPattern", (trait2 as CdmTraitReference).Arguments.Item("fullDataPartitionPatternName").Value);
                        break;
                    case "/IncrementalData/2018/8/15/Upserts/upsert1.csv":
                        totalExpectedPartitionsFound++;
                        Assert.AreEqual(4, partition.Arguments.Count);
                        Assert.AreEqual("2018", partition.Arguments["year"][0]);
                        Assert.AreEqual("8", partition.Arguments["month"][0]);
                        Assert.AreEqual("15", partition.Arguments["day"][0]);
                        Assert.AreEqual("1", partition.Arguments["upsertPartitionNumber"][0]);
                        var trait3 = partition.ExhibitsTraits[0];
                        Assert.AreEqual(Constants.IncrementalTraitName, trait3.FetchObjectDefinitionName());
                        Assert.AreEqual("UpsertPattern", (trait3 as CdmTraitReference).Arguments.Item(Constants.IncrementalPatternParameterName).Value);
                        Assert.AreEqual(CdmIncrementalPartitionType.Upsert.ToString(), (trait3 as CdmTraitReference).Arguments.Item("type").Value);
                        break;
                    default:
                        totalExpectedPartitionsFound++;
                        break;
                }
            }

            Assert.AreEqual(4, totalExpectedPartitionsFound);
        }

        /// <summary>
        /// Tests only refreshing delete type incremental partition files.
        /// </summary>
        [TestMethod]
        public async Task TestIncrementalPatternsRefreshesDeleteIncremental()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestIncrementalPatternsRefreshesDeleteIncremental));
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            // Test without incremental partition added
            var partitionEntity = manifest.Entities[0];
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);
            Assert.AreEqual(2, partitionEntity.IncrementalPartitionPatterns.Count);
            var traitRef0 = partitionEntity.IncrementalPartitionPatterns[0].ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
            Assert.AreEqual(CdmIncrementalPartitionType.Upsert.ToString(), traitRef0.Arguments.Item("type").Value.ToString());
            var traitRef1 = partitionEntity.IncrementalPartitionPatterns[1].ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
            Assert.AreEqual(CdmIncrementalPartitionType.Delete.ToString(), traitRef1.Arguments.Item("type").Value.ToString());
            
            var timeBeforeLoad = DateTime.Now.AddSeconds(-1);
            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);

            int totalExpectedPartitionsFound = 0;
            foreach (CdmDataPartitionDefinition partition in partitionEntity.IncrementalPartitions)
            {
                if (partition.LastFileStatusCheckTime > timeBeforeLoad)
                {
                    totalExpectedPartitionsFound++;
                    var traitRef = partition.ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
                    Assert.AreEqual(CdmIncrementalPartitionType.Delete.ToString(), traitRef.Arguments.Item("type").Value.ToString());
                }
            }

            Assert.AreEqual(2, totalExpectedPartitionsFound);

            //////////////////////////////////////////////////////////////////

            // Test with incremental partition added
            partitionEntity.IncrementalPartitions.Clear();
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);

            timeBeforeLoad = DateTime.Now.AddSeconds(-1);
            var upsertIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "2019UpsertPartition1", false);
            upsertIncrementalPartition.LastFileStatusCheckTime = timeBeforeLoad;
            upsertIncrementalPartition.Location = "/IncrementalData/Upserts/upsert1.csv";
            upsertIncrementalPartition.ExhibitsTraits.Add(Constants.IncrementalTraitName, new List<Tuple<string, dynamic>>() { new Tuple<string, dynamic>("type", CdmIncrementalPartitionType.Upsert.ToString()) });

            var deleteIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "2019DeletePartition1", false);
            deleteIncrementalPartition.LastFileStatusCheckTime = timeBeforeLoad;
            deleteIncrementalPartition.Location = "/IncrementalData/Deletes/delete1.csv";
            deleteIncrementalPartition.ExhibitsTraits.Add(Constants.IncrementalTraitName, new List<Tuple<string, dynamic>>() { new Tuple<string, dynamic>("type", CdmIncrementalPartitionType.Delete.ToString()) });

            partitionEntity.IncrementalPartitions.Add(upsertIncrementalPartition);
            partitionEntity.IncrementalPartitions.Add(deleteIncrementalPartition);
            Assert.AreEqual(2, partitionEntity.IncrementalPartitionPatterns.Count);
            Assert.AreEqual(2, partitionEntity.IncrementalPartitions.Count);

            totalExpectedPartitionsFound = 0;

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);

            foreach (CdmDataPartitionDefinition partition in partitionEntity.IncrementalPartitions)
            {
                if (partition.LastFileStatusCheckTime > timeBeforeLoad)
                { 
                    totalExpectedPartitionsFound++;
                    var traitRef = partition.ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
                    Assert.AreEqual(CdmIncrementalPartitionType.Delete.ToString(), traitRef.Arguments.Item("type").Value.ToString());
                }
            }

            Assert.AreEqual(3, totalExpectedPartitionsFound);
        }

        /// <summary>
        /// Tests refreshing partition pattern with invalid incremental partition trait and invalid arguments.
        /// </summary>
        [TestMethod]
        public async Task TestPatternRefreshesWithInvalidTraitAndArgument()
        {
            // providing invalid enum value of CdmIncrementalPartitionType in string
            // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": "typo"}]
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrEnumConversionFailure };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPatternRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            var partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitionPatterns[0].IsIncremental);

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrEnumConversionFailure, true);

            //////////////////////////////////////////////////////////////////

            // providing invalid argument value - supply integer
            // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": 123}]
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrTraitInvalidArgumentValueType };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPatternRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitionPatterns[0].IsIncremental);
            var traitRef = partitionEntity.IncrementalPartitionPatterns[0].ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
            traitRef.Arguments.Item("type").Value = 123;

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitInvalidArgumentValueType, true);

            //////////////////////////////////////////////////////////////////

            // not providing argument
            // "traitReference": "is.partition.incremental", "arguments": []]
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrTraitArgumentMissing };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPatternRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitionPatterns[0].IsIncremental);
            traitRef = partitionEntity.IncrementalPartitionPatterns[0].ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
            traitRef.Arguments.Clear();

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitArgumentMissing, true);

            //////////////////////////////////////////////////////////////////

            // not providing trait
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrMissingIncrementalPartitionTrait };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPatternRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitionPatterns[0].IsIncremental);
            partitionEntity.IncrementalPartitionPatterns[0].ExhibitsTraits.Clear();

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrMissingIncrementalPartitionTrait, true);

            //////////////////////////////////////////////////////////////////

            // data partition pattern in DataPartitionPatterns collection contains incremental partition trait
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrUnexpectedIncrementalPartitionTrait };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPatternRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitionPatterns[0].IsIncremental);
            var patternCopy = partitionEntity.IncrementalPartitionPatterns[0].Copy() as CdmDataPartitionPatternDefinition;
            partitionEntity.DataPartitionPatterns.Add(patternCopy);

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Full);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrUnexpectedIncrementalPartitionTrait, true);
        }

        /// <summary>
        /// Tests refreshing incremental partition with invalid incremental partition trait and invalid arguments.
        /// </summary>
        [TestMethod]
        public async Task TestPartitionRefreshesWithInvalidTraitAndArgument()
        {
            // providing invalid enum value of CdmIncrementalPartitionType in string
            // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": "typo"}]
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrEnumConversionFailure };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPartitionRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/partition.manifest.cdm.json");

            var partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitions.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitions[0].IsIncremental);

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrEnumConversionFailure, true);

            //////////////////////////////////////////////////////////////////

            // providing invalid argument value - supply integer
            // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": 123}]
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrTraitInvalidArgumentValueType };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPartitionRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/partition.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitions.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitions[0].IsIncremental);
            var traitRef = partitionEntity.IncrementalPartitions[0].ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
            traitRef.Arguments.Item("type").Value = 123;

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitInvalidArgumentValueType, true);

            //////////////////////////////////////////////////////////////////

            // not providing argument
            // "traitReference": "is.partition.incremental", "arguments": []]
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrTraitArgumentMissing };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPartitionRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/partition.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitions.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitions[0].IsIncremental);
            traitRef = partitionEntity.IncrementalPartitions[0].ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
            traitRef.Arguments.Clear();

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitArgumentMissing, true);

            //////////////////////////////////////////////////////////////////

            // not providing trait
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrMissingIncrementalPartitionTrait };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPartitionRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/partition.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitions.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitions[0].IsIncremental);
            partitionEntity.IncrementalPartitions[0].ExhibitsTraits.Clear();

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Incremental);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrMissingIncrementalPartitionTrait, true);

            //////////////////////////////////////////////////////////////////

            // data partition in DataPartitions collection contains incremental partition trait
            expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrUnexpectedIncrementalPartitionTrait };
            corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPartitionRefreshesWithInvalidTraitAndArgument), expectedCodes: expectedLogCodes);
            manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/partition.manifest.cdm.json");

            partitionEntity = manifest.Entities[0];
            Assert.AreEqual(1, partitionEntity.IncrementalPartitions.Count);
            Assert.IsTrue(partitionEntity.IncrementalPartitions[0].IsIncremental);
            var partitionCopy = partitionEntity.IncrementalPartitions[0].Copy() as CdmDataPartitionDefinition;
            partitionEntity.DataPartitions.Add(partitionCopy);

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Full);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrUnexpectedIncrementalPartitionTrait, true);
        }

        /// <summary>
        /// Tests FileStatusCheckAsync(), FileStatusCheckAsync(PartitionFileStatusCheckType.Full), and FileStatusCheckAsync(PartitionFileStatusCheckType.None).
        /// </summary>
        [TestMethod]
        public async Task TestPartitionFileRefreshTypeFullOrNone()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPartitionFileRefreshTypeFullOrNone));
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/pattern.manifest.cdm.json");

            // Test manifest.FileStatusCheckAsync();
            var partitionEntity = manifest.Entities[0];
            Assert.AreEqual(0, partitionEntity.DataPartitions.Count);
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);
            Assert.AreEqual(1, partitionEntity.DataPartitionPatterns.Count);
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);

            await manifest.FileStatusCheckAsync();

            Assert.AreEqual(1, partitionEntity.DataPartitions.Count);
            Assert.IsFalse(partitionEntity.DataPartitions[0].IsIncremental);
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);

            //////////////////////////////////////////////////////////////////

            // Test manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Full);
            partitionEntity.DataPartitions.Clear();
            partitionEntity.IncrementalPartitions.Clear();
            Assert.AreEqual(0, partitionEntity.DataPartitions.Count);
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);
            Assert.AreEqual(1, partitionEntity.DataPartitionPatterns.Count);
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.Full);

            Assert.AreEqual(1, partitionEntity.DataPartitions.Count);
            Assert.IsFalse(partitionEntity.DataPartitions[0].IsIncremental);
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);

            //////////////////////////////////////////////////////////////////

            // Test manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.None);
            partitionEntity.DataPartitions.Clear();
            partitionEntity.IncrementalPartitions.Clear();
            Assert.AreEqual(0, partitionEntity.DataPartitions.Count);
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);
            Assert.AreEqual(1, partitionEntity.DataPartitionPatterns.Count);
            Assert.AreEqual(1, partitionEntity.IncrementalPartitionPatterns.Count);

            System.Threading.Thread.Sleep(100);
            var timeBeforeLoad = DateTime.Now;
            Assert.IsTrue(manifest.LastFileStatusCheckTime < timeBeforeLoad);

            await manifest.FileStatusCheckAsync(PartitionFileStatusCheckType.None);

            Assert.AreEqual(0, partitionEntity.DataPartitions.Count);
            Assert.AreEqual(0, partitionEntity.IncrementalPartitions.Count);
            Assert.IsTrue(manifest.LastFileStatusCheckTime >= timeBeforeLoad);
        }

        /// <summary>
        /// Testing that error is handled when partition pattern contains a folder that does not exist
        /// </summary>
        [TestMethod]
        public async Task TestPatternWithNonExistingFolder()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestPatternWithNonExistingFolder");
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestPatternWithNonExistingFolder", "entities.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(corpus, null), "entities", "local", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            int errorLogged = 0;
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("Failed to fetch all files in the folder location 'local:/testLocation' described by a partition pattern. Exception:"))
                    {
                        errorLogged++;
                    }
                }
            }, CdmStatusLevel.Warning);

            await cdmManifest.FileStatusCheckAsync();
            Assert.AreEqual(1, errorLogged);
            Assert.AreEqual(cdmManifest.Entities[0].DataPartitions.Count, 0);
            // make sure the last check time is still being set
            Assert.IsNotNull(cdmManifest.Entities[0].DataPartitionPatterns[0].LastFileStatusCheckTime);
        }

        /// <summary>
        /// Testing that partition is correctly found when namespace of pattern differs from namespace of the manifest
        /// </summary>
        [TestMethod]
        public async Task TestPatternWithDifferentNamespace()
        {
            string testName = "TestPatternWithDifferentNamespace";
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            LocalAdapter localAdapter = (LocalAdapter)cdmCorpus.Storage.FetchAdapter("local");
            var localPath = localAdapter.FullRoot;
            cdmCorpus.Storage.Mount("other", new LocalAdapter(Path.Combine(localPath, "other")));
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/patternManifest.manifest.cdm.json");

            await cdmManifest.FileStatusCheckAsync();

            Assert.AreEqual(1, cdmManifest.Entities[0].DataPartitions.Count);
        }

        /// <summary>
        /// Testing that patterns behave correctly with variations to rootLocation
        /// </summary>
        [TestMethod]
        public async Task TestVariationsInRootLocation()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestVariationsInRootLocation");
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("pattern.manifest.cdm.json");
            await manifest.FileStatusCheckAsync();

            CdmLocalEntityDeclarationDefinition startsWithSlash = manifest.Entities[0] as CdmLocalEntityDeclarationDefinition;
            Assert.AreEqual(".*testfile.csv", startsWithSlash.DataPartitionPatterns[0].RegularExpression);
            Assert.AreEqual(1, startsWithSlash.DataPartitions.Count);
            Assert.AreEqual("/partitions/testfile.csv", startsWithSlash.DataPartitions[0].Location);

            CdmLocalEntityDeclarationDefinition endsWithSlash = manifest.Entities[1] as CdmLocalEntityDeclarationDefinition;
            Assert.AreEqual(".*testfile.csv", endsWithSlash.DataPartitionPatterns[0].RegularExpression);
            Assert.AreEqual(1, endsWithSlash.DataPartitions.Count);
            Assert.AreEqual("partitions/testfile.csv", endsWithSlash.DataPartitions[0].Location);

            CdmLocalEntityDeclarationDefinition noSlash = manifest.Entities[2] as CdmLocalEntityDeclarationDefinition;
            Assert.AreEqual(".*testfile.csv", noSlash.DataPartitionPatterns[0].RegularExpression);
            Assert.AreEqual(1, noSlash.DataPartitions.Count);
            Assert.AreEqual("partitions/testfile.csv", noSlash.DataPartitions[0].Location);
        }

        /// <summary>
        /// Testing data partition patterns that use glob patterns
        /// </summary>
        [TestMethod]
        public async Task TestPartitionPatternWithGlob()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestPartitionPatternWithGlob");

            int patternWithGlobAndRegex = 0;
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("CdmDataPartitionPatternDefinition | The Data Partition Pattern contains both a glob pattern (/testfile.csv) and a regular expression (/subFolder/testSubFile.csv) set, the glob pattern will be used. | FileStatusCheckAsync"))
                        patternWithGlobAndRegex++;
                }
            }, CdmStatusLevel.Warning);

            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("pattern.manifest.cdm.json");
            await manifest.FileStatusCheckAsync();

            // one pattern object contains both glob and regex
            Assert.AreEqual(1, patternWithGlobAndRegex);

            int index = 0;
            // make sure '.' in glob is not converted to '.' in regex
            CdmLocalEntityDeclarationDefinition dotIsEscaped = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(dotIsEscaped.DataPartitionPatterns[0].GlobPattern, "test.ile.csv");
            Assert.AreEqual(dotIsEscaped.DataPartitions.Count, 0);
            index++;

            // star pattern should match anything in the root folder
            CdmLocalEntityDeclarationDefinition onlyStar = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(onlyStar.DataPartitionPatterns[0].GlobPattern, "*");
            Assert.AreEqual(onlyStar.DataPartitions.Count, 1);
            Assert.AreEqual(onlyStar.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // star can match nothing
            CdmLocalEntityDeclarationDefinition starNoMatch = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(starNoMatch.DataPartitionPatterns[0].GlobPattern, "/testfile*.csv");
            Assert.AreEqual(starNoMatch.DataPartitions.Count, 1);
            Assert.AreEqual(starNoMatch.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // star at root level
            // this should match any files at root level, none in subfolders
            CdmLocalEntityDeclarationDefinition starAtRoot = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(starAtRoot.DataPartitionPatterns[0].GlobPattern, "/*.csv");
            Assert.AreEqual(starAtRoot.DataPartitions.Count, 1);
            Assert.AreEqual(starAtRoot.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // star at deeper level
            CdmLocalEntityDeclarationDefinition starAtDeeperLevel = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(starAtDeeperLevel.DataPartitionPatterns[0].GlobPattern, "/*/*.csv");
            Assert.AreEqual(starAtDeeperLevel.DataPartitions.Count, 1);
            Assert.AreEqual(starAtDeeperLevel.DataPartitions[0].Location, "/partitions/subFolder/testSubFile.csv");
            index++;

            // pattern that ends with star
            CdmLocalEntityDeclarationDefinition endsWithStar = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(endsWithStar.DataPartitionPatterns[0].GlobPattern, "/testfile*");
            Assert.AreEqual(endsWithStar.DataPartitions.Count, 1);
            Assert.AreEqual(endsWithStar.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // globstar (**) on its own matches
            CdmLocalEntityDeclarationDefinition globStar = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(globStar.DataPartitionPatterns[0].GlobPattern, "**");
            Assert.AreEqual(2, globStar.DataPartitions.Count);
            Assert.AreEqual(1, globStar.DataPartitions.Where(x =>
                x.Location == "/partitions/testfile.csv"
              ).ToList().Count);
            Assert.AreEqual(1, globStar.DataPartitions.Where(x =>
                x.Location == "/partitions/subFolder/testSubFile.csv"
              ).ToList().Count);
            index++;

            // globstar at the beginning of the pattern
            CdmLocalEntityDeclarationDefinition beginsWithGlobstar = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(beginsWithGlobstar.DataPartitionPatterns[0].GlobPattern, "/**.csv");
            Assert.AreEqual(1, beginsWithGlobstar.DataPartitions.Count);
            Assert.AreEqual(beginsWithGlobstar.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // globstar at the end of the pattern
            CdmLocalEntityDeclarationDefinition endsWithGlobstar = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(endsWithGlobstar.DataPartitionPatterns[0].GlobPattern, "/**");
            Assert.AreEqual(endsWithGlobstar.DataPartitions.Count, 2);
            Assert.AreEqual(1, endsWithGlobstar.DataPartitions.Where(x =>
                x.Location == "/partitions/testfile.csv"
              ).ToList().Count);
            Assert.AreEqual(1, endsWithGlobstar.DataPartitions.Where(x =>
                x.Location == "/partitions/subFolder/testSubFile.csv"
              ).ToList().Count);
            index++;

            // globstar matches zero or more folders
            CdmLocalEntityDeclarationDefinition zeroOrMoreFolders = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(zeroOrMoreFolders.DataPartitionPatterns[0].GlobPattern, "/**/*.csv");
            Assert.AreEqual(2, zeroOrMoreFolders.DataPartitions.Count);
            Assert.AreEqual(1, zeroOrMoreFolders.DataPartitions.Where(x =>
                x.Location == "/partitions/testfile.csv"
              ).ToList().Count);
            Assert.AreEqual(1, zeroOrMoreFolders.DataPartitions.Where(x =>
                x.Location == "/partitions/subFolder/testSubFile.csv"
              ).ToList().Count);
            index++;

            // globstar matches zero or more folders without starting slash
            CdmLocalEntityDeclarationDefinition zeroOrMoreNoStartingSlash = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(zeroOrMoreNoStartingSlash.DataPartitionPatterns[0].GlobPattern, "/**/*.csv");
            Assert.AreEqual(2, zeroOrMoreNoStartingSlash.DataPartitions.Count);
            Assert.AreEqual(1, zeroOrMoreNoStartingSlash.DataPartitions.Where(x =>
                x.Location == "/partitions/testfile.csv"
              ).ToList().Count);
            Assert.AreEqual(1, zeroOrMoreNoStartingSlash.DataPartitions.Where(x =>
                x.Location == "/partitions/subFolder/testSubFile.csv"
              ).ToList().Count);
            index++;

            // question mark in the middle of a pattern
            CdmLocalEntityDeclarationDefinition questionMark = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(questionMark.DataPartitionPatterns[0].GlobPattern, "/test?ile.csv");
            Assert.AreEqual(1, questionMark.DataPartitions.Count);
            Assert.AreEqual(questionMark.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // question mark at the beginning of a pattern
            CdmLocalEntityDeclarationDefinition beginsWithQuestionMark = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(beginsWithQuestionMark.DataPartitionPatterns[0].GlobPattern, "/?estfile.csv");
            Assert.AreEqual(1, beginsWithQuestionMark.DataPartitions.Count);
            Assert.AreEqual(beginsWithQuestionMark.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // question mark at the end of a pattern
            CdmLocalEntityDeclarationDefinition endsWithQuestionMark = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(endsWithQuestionMark.DataPartitionPatterns[0].GlobPattern, "/testfile.cs?");
            Assert.AreEqual(1, endsWithQuestionMark.DataPartitions.Count);
            Assert.AreEqual(endsWithQuestionMark.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // backslash in glob can match slash
            CdmLocalEntityDeclarationDefinition backslashInPattern = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(backslashInPattern.DataPartitionPatterns[0].GlobPattern, "\\testfile.csv");
            Assert.AreEqual(1, backslashInPattern.DataPartitions.Count);
            Assert.AreEqual(backslashInPattern.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            // pattern object includes glob pattern and regular expression
            CdmLocalEntityDeclarationDefinition globAndRegex = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(globAndRegex.DataPartitionPatterns[0].GlobPattern, "/testfile.csv");
            Assert.AreEqual(globAndRegex.DataPartitionPatterns[0].RegularExpression, "/subFolder/testSubFile.csv");
            Assert.AreEqual(1, globAndRegex.DataPartitions.Count);
            // matching this file means the glob pattern was (correctly) used
            Assert.AreEqual(globAndRegex.DataPartitions[0].Location, "/partitions/testfile.csv");
        }

        /// <summary>
        /// Testing data partition patterns that use glob patterns with variations in path style
        /// </summary>
        [TestMethod]
        public async Task TestGlobPathVariation()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestGlobPathVariation");

            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("pattern.manifest.cdm.json");
            await manifest.FileStatusCheckAsync();

            int index = 0;
            CdmLocalEntityDeclarationDefinition noSlash = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(noSlash.DataPartitionPatterns[0].RootLocation, "/partitions");
            Assert.AreEqual(noSlash.DataPartitionPatterns[0].GlobPattern, "*.csv");
            Assert.AreEqual(noSlash.DataPartitions.Count, 1);
            Assert.AreEqual(noSlash.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            CdmLocalEntityDeclarationDefinition rootLocationSlash = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(rootLocationSlash.DataPartitionPatterns[0].RootLocation, "/partitions/");
            Assert.AreEqual(rootLocationSlash.DataPartitionPatterns[0].GlobPattern, "*.csv");
            Assert.AreEqual(rootLocationSlash.DataPartitions.Count, 1);
            Assert.AreEqual(rootLocationSlash.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            CdmLocalEntityDeclarationDefinition globPatternSlash = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(globPatternSlash.DataPartitionPatterns[0].RootLocation, "/partitions");
            Assert.AreEqual(globPatternSlash.DataPartitionPatterns[0].GlobPattern, "/*.csv");
            Assert.AreEqual(globPatternSlash.DataPartitions.Count, 1);
            Assert.AreEqual(globPatternSlash.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            CdmLocalEntityDeclarationDefinition bothSlash = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(bothSlash.DataPartitionPatterns[0].RootLocation, "/partitions/");
            Assert.AreEqual(bothSlash.DataPartitionPatterns[0].GlobPattern, "/*.csv");
            Assert.AreEqual(bothSlash.DataPartitions.Count, 1);
            Assert.AreEqual(bothSlash.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            CdmLocalEntityDeclarationDefinition noSlashOrStarAtStart = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(noSlashOrStarAtStart.DataPartitionPatterns[0].RootLocation, "/partitions/");
            Assert.AreEqual(noSlashOrStarAtStart.DataPartitionPatterns[0].GlobPattern, "t*.csv");
            Assert.AreEqual(noSlashOrStarAtStart.DataPartitions.Count, 1);
            Assert.AreEqual(noSlashOrStarAtStart.DataPartitions[0].Location, "/partitions/testfile.csv");
            index++;

            CdmLocalEntityDeclarationDefinition noSlashOrStarAndRootLocation = (CdmLocalEntityDeclarationDefinition)manifest.Entities[index];
            Assert.AreEqual(noSlashOrStarAndRootLocation.DataPartitionPatterns[0].RootLocation, "/partitions");
            Assert.AreEqual(noSlashOrStarAndRootLocation.DataPartitionPatterns[0].GlobPattern, "t*.csv");
            Assert.AreEqual(noSlashOrStarAndRootLocation.DataPartitions.Count, 1);
            Assert.AreEqual(noSlashOrStarAndRootLocation.DataPartitions[0].Location, "/partitions/testfile.csv");
        }

        /// <summary>
        /// Verifies that performing file status check on manifest with a partition with
        /// null location is gracefully handled.
        /// </summary>
        [TestMethod]
        public async Task TestFileStatusCheckOnNullLocation()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestFileStatusCheckOnNullLocation");
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    Assert.AreEqual(statusLevel, CdmStatusLevel.Error, "Error level message should have been reported");
                    Assert.IsTrue(
                        message == "StorageManager | The object path cannot be null or empty. | CreateAbsoluteCorpusPath" ||
                        message == "CdmCorpusDefinition | The object path cannot be null or empty. | GetLastModifiedTimeFromPartitionPathAsync",
                       "Unexpected error message received");
                }
            }, CdmStatusLevel.Warning);

            // Create manifest
            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "TestModel");
            corpus.Storage.FetchRootFolder("local").Documents.Add(manifest);

            // Create entity
            var entDoc = corpus.Storage.FetchRootFolder("local").Documents.Add("MyEntityDoc.cdm.json");

            var entDef = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, "MyEntity");
            entDoc.Definitions.Add(entDef);

            var entDecl = manifest.Entities.Add(entDef);

            // Create partition
            var part = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "MyPartition");
            entDecl.DataPartitions.Add(part);

            // This should not throw exception
            await manifest.FileStatusCheckAsync();
        }
    }
}
