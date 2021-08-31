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
    using Microsoft.CommonDataModel.Tools.Processor;
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
