// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Threading.Tasks;

    /// <summary>
    /// Collection of tests to verify event recorder behavior.
    /// </summary>
    [TestClass]
    public class EventListTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = "Utilities";

        /// <summary>
        /// Dummy value used for correlation ID testing.
        /// </summary>
        private readonly string DummyCorrelationId = "12345";

        /// <summary>
        /// Declare a blackhole callback. We're focusing on event recorder, don't care about output going to the standard log stream.
        /// </summary>
        private readonly EventCallback eventCallback = new EventCallback
        {
            Invoke = (level, message) =>
            {
                // NOOP
            }
        };

        /// <summary>
        /// Tests several use cases where no nesting of recording functions happens.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestWithoutNesting()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEventList");
            corpus.SetEventCallback(eventCallback, CdmStatusLevel.Warning, DummyCorrelationId);

            // Test fetching an object from invalid namespace results in at least one error message in the recorder
            _ = await corpus.FetchObjectAsync<CdmDocumentDefinition>("foo:/bar");
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNamespaceNotRegistered, true);

            // Test fetching a good object, this should leave event recorder empty
            _ = await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/default.manifest.cdm.json");
            TestNoLogsState(corpus);

            // Test saving a manifest to invalid namespace results in at least one error message in the recorder
            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "dummy");
            await manifest.SaveAsAsync("foo:/bar", true);
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrValdnMissingDoc, true);

            // Test resolving a manifest not added to a folder, this should yield at least one error message in the recorder
            await manifest.CreateResolvedManifestAsync("new dummy", null);
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrResolveManifestFailed, true);

            // Test resolving an entity without WRT doc, this should yield at least one error message in the recorder
            var entity2 = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, "MyEntity2");
            await entity2.CreateResolvedEntityAsync("MyEntity2-Resolved");
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrDocWrtDocNotfound, true);

            // Test invoking FileStatusCheckAsync on the manifest, this should yield at least one error message in the recorder
            await manifest.FileStatusCheckAsync();
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullNamespace, true);

            // Repeat the same test but with status level 'None', no events should be recorded
            corpus.Ctx.ReportAtLevel = CdmStatusLevel.None;
            await entity2.CreateResolvedEntityAsync("MyEntity2-Resolved");
            TestNoLogsState(corpus);

            // Test checking file status on a data partition
            // We're at log level 'Progress', so we get the EnterScope/LeaveScope messages too
            corpus.Ctx.ReportAtLevel = CdmStatusLevel.Progress;
            var part = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "part");
            await part.FileStatusCheckAsync();
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, true);

            // Test checking file status on a data partition pattern
            var refDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, "RefEntDoc");
            var partPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(CdmObjectType.DataPartitionPatternDef, "partPattern");
            partPattern.InDocument = refDoc;
            await partPattern.FileStatusCheckAsync();
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullCorpusPath, true);

            // Test calculating relationships - no errors/warnings
            await corpus.CalculateEntityGraphAsync(manifest);
            TestBasicLogsState(corpus);

            // Test populating relationships in manifest - no errors/warnings
            await manifest.PopulateManifestRelationshipsAsync();
            TestBasicLogsState(corpus);

            // Test filtering code logic 
            corpus.Ctx.SuppressedLogCodes.Add(CdmLogCode.ErrPathNullObjectPath);
            var part2 = corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "part2");
            await part2.FileStatusCheckAsync();

            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, false);
        }

        /// <summary>
        /// Tests a use case where recording nesting happens, such as CreateResolvedManifestAsync making calls to CreateResolvedEntityAsync
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestWithNesting()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEventList");
            corpus.SetEventCallback(eventCallback, CdmStatusLevel.Warning, DummyCorrelationId);

            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "dummy");

            // Test resolving a manifest (added to a folder) with an entity in it, this should collect messages from
            // CreateResolvedManifestAsync and CreateResolvedEntityAsync functions
            corpus.Storage.FetchRootFolder("local").Documents.Add(manifest);
            var entity1 = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, "MyEntity1");

            var someAttrib1 = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "someAttrib1", false);
            someAttrib1.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "entityId", true);
            entity1.Attributes.Add(someAttrib1);

            var entity1Doc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, "MyEntity1.cdm.json");
            entity1Doc.Definitions.Add(entity1);
            corpus.Storage.FetchRootFolder("local").Documents.Add(entity1Doc);

            manifest.Entities.Add(entity1);
            await manifest.CreateResolvedManifestAsync("new dummy 2", null);

            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrResolveReferenceFailure, true);

            // Keep for debugging
            //corpus.Ctx.Events.ForEach(logEntry => {
            //    logEntry.ToList().ForEach(logEntryPair => Console.WriteLine($"{logEntryPair.Key}={logEntryPair.Value}"));
            //    Console.WriteLine();
            //});
        }

        /// <summary>
        /// Tests events generated in StorageManager APIs
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public void TestStorageManagerEvents()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEventList");
            corpus.SetEventCallback(eventCallback, CdmStatusLevel.Info, DummyCorrelationId);

            corpus.Storage.Mount("dummy", null);
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullAdapter, true);

            corpus.Storage.Unmount("nothing");
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.WarnStorageRemoveAdapterFailed, true);

            // No errors/warnings expected here
            corpus.Storage.FetchRootFolder(null);
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullNamespace, true);

            corpus.Storage.AdapterPathToCorpusPath("Test");
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidAdapterPath, true);

            corpus.Storage.CorpusPathToAdapterPath("unknown:/Test");
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageAdapterNotFound, true);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNamespaceNotRegistered, true);

            corpus.Storage.CreateAbsoluteCorpusPath(null);
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, true);

            corpus.Storage.CreateRelativeCorpusPath(null);
            TestBasicLogsState(corpus);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, true);
        }

        /// <summary>
        /// Test logging of API scope entry/exit.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestScoping()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEventList");
            // For scoping test we need to use log level Info
            corpus.SetEventCallback(eventCallback, CdmStatusLevel.Info, DummyCorrelationId);

            // Test fetching a good object, this should result event recorder empty
            _ = await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/default.manifest.cdm.json");
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count > 2, "There should have been at least 2 (debug) events recorded when fetching object with correct path");

            TestBasicLogsState(corpus);
            
            // Verify method on entry/exit event
            Assert.IsTrue(corpus.Ctx.Events[0]["method"] == "FetchObjectAsync<CdmDocumentDefinition>", "The first recorded event message should have specified scope method of 'FetchObjectAsync'");
            Assert.IsTrue(corpus.Ctx.Events[corpus.Ctx.Events.Count - 1]["method"] == "FetchObjectAsync<CdmDocumentDefinition>",
                "The last recorded event message should have specified scope method of 'FetchObjectAsync'");

            // Keep for debugging
            //corpus.Ctx.Events.ForEach(logEntry => {
            //    logEntry.ToList().ForEach(logEntryPair => Console.WriteLine($"{logEntryPair.Key}={logEntryPair.Value}"));
            //    Console.WriteLine();
            // });
        }

        /// <summary>
        /// Helper function to test that recording is stopped and no logs are recorded.
        /// </summary>
        /// <param name="corpus"></param>
        private void TestNoLogsState(CdmCorpusDefinition corpus)
        {
            TestBasicLogsState(corpus, true);
        }

        /// <summary>
        /// Helper function to check for event list state and presence of scope enter/leave logs.
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="expectNoLogs">If true, tests that recording is stopped and there are no logs in EventList. If false,
        /// tests that there are multiple entries and log enter/exit events were logged.</param>
        private void TestBasicLogsState(CdmCorpusDefinition corpus, bool expectNoLogs = false)
        {
            Assert.IsNotNull(corpus.Ctx.Events, "Events list should not be null");
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");

            if (expectNoLogs)
            {
                Assert.IsTrue(corpus.Ctx.Events.Count == 0, "There should have been no events recorded when fetching object with correct path");
            }
            else
            {
                Assert.IsTrue(corpus.Ctx.Events.Count > 0, "There should have been at least one event recorded");
                Assert.IsTrue(corpus.Ctx.Events[0].ContainsKey("timestamp"), "The recorded event should have had a timestamp key");
                Assert.IsTrue(corpus.Ctx.Events[0]["cid"] == DummyCorrelationId, "The recorded event should have had a correlationId key with the dummy value");

                if (corpus.Ctx.ReportAtLevel == CdmStatusLevel.Progress)
                {
                    Assert.IsTrue(corpus.Ctx.Events[0]["message"] == "Entering scope",
                        "The first recorded event message should have specified that new scope was entered");
                    Assert.IsTrue(corpus.Ctx.Events[corpus.Ctx.Events.Count - 1]["message"].StartsWith("Leaving scope"),
                         "The last recorded event message should have specified that new scope was exited");
                }
            }
        }
    }
}
