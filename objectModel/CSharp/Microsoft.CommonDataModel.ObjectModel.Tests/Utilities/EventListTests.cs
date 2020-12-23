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
            Assert.IsNotNull(corpus.Ctx.Events, "Ctx.Events should not be null");
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count > 0, "There should have been at least one event recorded when fetching object with incorrect path");
            Assert.IsTrue(corpus.Ctx.Events[0].ContainsKey("timestamp"), "The recorded event should have had a timestamp key");
            Assert.IsTrue(corpus.Ctx.Events[0]["correlationId"] == DummyCorrelationId, "The recorded event should have had a correlationId key with the dummy value");

            // Test fetching a good object, this should leave event recorder empty
            _ = await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/default.manifest.cdm.json");
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count == 0, "There should have been no events recorded when fetching object with correct path");

            // Test saving a manifest to invalid namespace results in at least one error message in the recorder
            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "dummy");
            await manifest.SaveAsAsync("foo:/bar", true);
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count > 0, "There should have been at least one event recorded");
            Assert.IsTrue(corpus.Ctx.Events[0].ContainsKey("timestamp"), "The recorded event should have had a timestamp key");
            Assert.IsTrue(corpus.Ctx.Events[0]["correlationId"] == DummyCorrelationId, "The recorded event should have had a correlationId key with the dummy value");

            // Test resolving a manifest not added to a folder, this should yield at least one error message in the recorder
            await manifest.CreateResolvedManifestAsync("new dummy", null);
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count > 0, "There should have been at least one event recorded");
            Assert.IsTrue(corpus.Ctx.Events[0].ContainsKey("timestamp"), "The recorded event should have had a timestamp key");
            Assert.IsTrue(corpus.Ctx.Events[0]["correlationId"] == DummyCorrelationId, "The recorded event should have had a correlationId key with the dummy value");

            // Test resolving an entity without WRT doc, this should yield at least one error message in the recorder
            var entity2 = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, "MyEntity2");
            await entity2.CreateResolvedEntityAsync("MyEntity2-Resolved");
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count > 0, "There should have been at least one event recorded");
            Assert.IsTrue(corpus.Ctx.Events[0].ContainsKey("timestamp"), "The recorded event should have had a timestamp key");
            Assert.IsTrue(corpus.Ctx.Events[0]["correlationId"] == DummyCorrelationId, "The recorded event should have had a correlationId key with the dummy value");

            // Test invoking FileStatusCheckAsync on the manifest, this should yield at least one error message in the recorder
            await manifest.FileStatusCheckAsync();
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count > 0, "There should have been at least one event recorded");
            Assert.IsTrue(corpus.Ctx.Events[0].ContainsKey("timestamp"), "The recorded event should have had a timestamp key");
            Assert.IsTrue(corpus.Ctx.Events[0]["correlationId"] == DummyCorrelationId, "The recorded event should have had a correlationId key with the dummy value");

            // Repeat the same test but with status level 'None', no events should be recorded
            corpus.Ctx.ReportAtLevel = CdmStatusLevel.None;
            await entity2.CreateResolvedEntityAsync("MyEntity2-Resolved");
            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count == 0, "There should have been no events recorded when fetching object with correct path");
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

            Assert.IsFalse(corpus.Ctx.Events.IsRecording, "Recording should be disabled at the end of API call");
            Assert.IsTrue(corpus.Ctx.Events.Count > 0, "There should have been at least one event recorded");
            // We check that there first event recorded was an error from the nested function
            Assert.IsTrue(corpus.Ctx.Events[0]["level"] == "Error", "The first recorded event level should have been 'Error'");
            Assert.IsTrue(corpus.Ctx.Events[0]["message"] == "Unable to resolve the reference 'entityId' to a known object",
                "The first recorded event message should have specified that 'entityId' was not resolved");
            Assert.IsTrue(corpus.Ctx.Events[0]["correlationId"] == DummyCorrelationId, "The recorded event should have had a correlationId key with the dummy value");

            // Keep for debugging
            //corpus.Ctx.Events.ForEach(logEntry => {
            //    logEntry.ToList().ForEach(logEntryPair => Console.WriteLine($"{logEntryPair.Key}={logEntryPair.Value}"));
            //    Console.WriteLine();
            //});
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

            // Verify scope entry event
            Assert.IsTrue(corpus.Ctx.Events[0]["message"] == "Entering scope", "The first recorded event message should have specified that new scope was entered");
            Assert.IsTrue(corpus.Ctx.Events[0]["path"] == "FetchObjectAsync", "The first recorded event message should have specified scope path of 'FetchObjectAsync'");

            // Verify scope exit event
            Assert.IsTrue(corpus.Ctx.Events[corpus.Ctx.Events.Count - 1]["message"] == "Leaving scope",
                "The last recorded event message should have specified that new scope was exited");
            Assert.IsTrue(corpus.Ctx.Events[corpus.Ctx.Events.Count - 1]["path"] == "FetchObjectAsync",
                "The last recorded event message should have specified scope path of 'FetchObjectAsync'");

            // Keep for debugging
            //corpus.Ctx.Events.ForEach(logEntry => {
            //    logEntry.ToList().ForEach(logEntryPair => Console.WriteLine($"{logEntryPair.Key}={logEntryPair.Value}"));
            //    Console.WriteLine();
            // });
        }
    }
}
