// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.TestHelper;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import org.testng.annotations.Test;

import org.testng.Assert;

public class EventListTest {
    /** The path between TestDataPath and TestName. */
    private static final String TESTS_SUBPATH = "Utilities";

    /** Dummy value used for correlation ID testing. */
    private static final String DUMMY_CORRELATION_ID = "12345";

    /** Declare a blackhole callback. We're focusing on event recorder, don't care about output going to the standard log stream. */
    private final EventCallback eventCallback = (level, message) -> {
        // NOOP
    };

    /**
     * Tests several use cases where no nesting of recording functions happens.
     * @throws InterruptedException
     */
    @Test
    public void testWithoutNesting() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestEventList");
        corpus.setEventCallback(eventCallback, CdmStatusLevel.Warning);
        corpus.getCtx().setCorrelationId(DUMMY_CORRELATION_ID);

        // Test fetching an object from invalid namespace results in at least one error message in the recorder
        corpus.fetchObjectAsync("foo:/bar").join();
        Assert.assertNotNull(corpus.getCtx().getEvents(), "Ctx.events should not be null");
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNamespaceNotRegistered, true);

        // Test fetching a good object, this should leave event recorder empty
        corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        testNoLogsState(corpus);

        // Test saving a manifest to invalid namespace results in at least one error message in the recorder
        CdmManifestDefinition manifest = corpus.makeObject(CdmObjectType.ManifestDef, "dummy");
        manifest.saveAsAsync("foo:/bar", true).join();
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrValdnMissingDoc, true);

        // Test resolving a manifest not added to a folder, this should yield at least one error message in the recorder
        manifest.createResolvedManifestAsync("new dummy", null).join();
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrResolveManifestFailed, true);

        // Test resolving an entity without WRT doc, this should yield at least one error message in the recorder
        CdmEntityDefinition entity2 = corpus.makeObject(CdmObjectType.EntityDef, "MyEntity2");
        entity2.createResolvedEntityAsync("MyEntity2-Resolved").join();
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrDocWrtDocNotfound, true);

        // Test invoking FileStatusCheckAsync on the manifest, this should yield at least one error message in the recorder
        manifest.fileStatusCheckAsync().join();
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullNamespace, true);

        // Repeat the same test but with status level 'None', no events should be recorded
        corpus.getCtx().setReportAtLevel(CdmStatusLevel.None);
        entity2.createResolvedEntityAsync("MyEntity2-Resolved").join();
        testNoLogsState(corpus);

        // Test checking file status on a data partition
        // We're at log level 'Progress', so we get the EnterScope/LeaveScope messages too
        corpus.getCtx().setReportAtLevel(CdmStatusLevel.Progress);
        CdmDataPartitionDefinition part = corpus.makeObject(CdmObjectType.DataPartitionDef, "part");
        part.fileStatusCheckAsync().join();
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, true);

        // Test checking file status on a data partition pattern
        CdmDocumentDefinition refDoc = corpus.makeObject(CdmObjectType.DocumentDef, "RefEntDoc");
        CdmDataPartitionPatternDefinition partPattern = corpus.makeObject(CdmObjectType.DataPartitionPatternDef, "partPattern");
        partPattern.setInDocument(refDoc);
        partPattern.fileStatusCheckAsync().join();
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullCorpusPath, true);

        // Test calculating relationships - no errors/warnings
        corpus.calculateEntityGraphAsync(manifest).join();
        testBasicLogsState(corpus);

        // Test populating relationships in manifest - no errors/warnings
        manifest.populateManifestRelationshipsAsync().join();
        testBasicLogsState(corpus);

        // Test filtering code logic
        corpus.getCtx().getSuppressedLogCodes().add(CdmLogCode.ErrPathNullObjectPath);
        CdmDataPartitionDefinition part2 = corpus.makeObject(CdmObjectType.DataPartitionDef, "part2");
        part2.fileStatusCheckAsync().join();

        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, false);
    }

    /**
     * Tests a use case where recording nesting happens, such as CreateResolvedManifestAsync making calls to CreateResolvedEntityAsync
     * @throws InterruptedException
     */
    @Test
    public void testWithNesting() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestEventList");
        corpus.setEventCallback(eventCallback, CdmStatusLevel.Warning);
        corpus.getCtx().setCorrelationId(DUMMY_CORRELATION_ID);

        CdmManifestDefinition manifest = corpus.makeObject(CdmObjectType.ManifestDef, "dummy");

        // Test resolving a manifest (added to a folder) with an entity in it, this should collect messages from
        // CreateResolvedManifestAsync and CreateResolvedEntityAsync functions
        corpus.getStorage().fetchRootFolder("local").getDocuments().add(manifest);
        CdmEntityDefinition entity1 = corpus.makeObject(CdmObjectType.EntityDef, "MyEntity1");

        CdmTypeAttributeDefinition someAttrib1 = corpus.makeObject(CdmObjectType.TypeAttributeDef, "someAttrib1", false);
        someAttrib1.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "entityId", true));
        entity1.getAttributes().add(someAttrib1);

        CdmDocumentDefinition entity1Doc = corpus.makeObject(CdmObjectType.DocumentDef, "MyEntity1.cdm.json");
        entity1Doc.getDefinitions().add(entity1);
        corpus.getStorage().fetchRootFolder("local").getDocuments().add(entity1Doc);

        manifest.getEntities().add(entity1);
        manifest.createResolvedManifestAsync("new dummy 2", null).join();

        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrResolveReferenceFailure, true);

        // Keep for debugging
//        corpus.getCtx().getEvents().forEach(logEntry -> {
//            logEntry.forEach((key, value) -> System.out.println(key + "=" + value));
//            System.out.println();
//        });
    }

    /**
     * Tests events generated in StorageManager APIs
     */
    @Test
    public void testStorageManagerEvents() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestEventList");
        corpus.setEventCallback(eventCallback, CdmStatusLevel.Info, DUMMY_CORRELATION_ID);

        corpus.getStorage().mount("dummy", null);
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullAdapter, true);

        corpus.getStorage().unmount("nothing");
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.WarnStorageRemoveAdapterFailed, true);

        // No errors/warnings expected here
        corpus.getStorage().fetchRootFolder(null);
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNullNamespace, true);

        corpus.getStorage().adapterPathToCorpusPath("Test");
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidAdapterPath, true);

        corpus.getStorage().corpusPathToAdapterPath("unknown:/Test");
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageAdapterNotFound, true);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageNamespaceNotRegistered, true);

        corpus.getStorage().createAbsoluteCorpusPath(null);
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, true);

        corpus.getStorage().createRelativeCorpusPath(null);
        testBasicLogsState(corpus);
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrPathNullObjectPath, true);

    }

    /**
     * Test logging of API scope entry/exit.
     * @throws InterruptedException
     */
    @Test
    public void testScoping() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestEventList");
        // For scoping test we need to use log level Info
        corpus.setEventCallback(eventCallback, CdmStatusLevel.Info);
        corpus.getCtx().setCorrelationId(DUMMY_CORRELATION_ID);

        // Test fetching a good object, this should result event recorder empty
        corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        Assert.assertFalse(corpus.getCtx().getEvents().isRecording(), "Recording should be disabled at the end of API call");
        Assert.assertTrue(corpus.getCtx().getEvents().size() > 2,
                "There should have been at least 2 (debug) events recorded when fetching object with correct path");

        testBasicLogsState(corpus);

        // Verify method on entry/exit events
        Assert.assertEquals(corpus.getCtx().getEvents().get(0).get("method"), "fetchObjectAsync",
                "The first recorded event message should have specified scope callingfunc of 'fetchObjectAsync'");
        Assert.assertEquals(corpus.getCtx().getEvents().get(corpus.getCtx().getEvents().size() - 1).get("method"), "fetchObjectAsync",
                "The last recorded event message should have specified scope callingfunc of 'fetchObjectAsync'");

//         // Keep for debugging
//        corpus.getCtx().getEvents().forEach(logEntry -> {
//            logEntry.forEach((key, value) -> System.out.println(key + "=" + value));
//            System.out.println();
//         });
    }

    /**
     * Helper function to test that recording is stopped and no logs are recorded.
     * @param corpus CdmCorpusDefinition
     */
    private void testNoLogsState(CdmCorpusDefinition corpus) {
        testBasicLogsState(corpus, true);
    }

    /**
     * Helper function to check for event list state and tests that there are multiple entries and log enter/exit events were logged.
     * @param corpus CdmCorpusDefinition
     */
    private void testBasicLogsState(CdmCorpusDefinition corpus) {
        testBasicLogsState(corpus, false);
    }

    /**
     * Helper function to check for event list state and presence of scope enter/leave logs.
     * @param corpus CdmCorpusDefinition
     * @param expectNoLogs If true, tests that recording is stopped and there are no logs in EventList. If false,
     *                     tests that there are multiple entries and log enter/exit events were logged.
     */
    private void testBasicLogsState(CdmCorpusDefinition corpus, boolean expectNoLogs) {
        Assert.assertNotNull(corpus.getCtx().getEvents(), "Events list should not be null");
        Assert.assertFalse(corpus.getCtx().getEvents().isRecording(), "Recording should be disabled at the end of API call");

        if (expectNoLogs) {
            Assert.assertEquals(corpus.getCtx().getEvents().size(), 0,
                    "There should have been no events recorded when fetching object with correct path");
        } else {
            Assert.assertTrue(corpus.getCtx().getEvents().size() > 0, "There should have been at least one event recorded");
            Assert.assertTrue(corpus.getCtx().getEvents().get(0).containsKey("timestamp"), "The recorded event should have had a timestamp key");
            Assert.assertEquals(corpus.getCtx().getEvents().get(0).get("cid"), DUMMY_CORRELATION_ID,
                    "The recorded event should have had a correlationId key with the dummy value");

            if (corpus.getCtx().getReportAtLevel() == CdmStatusLevel.Progress) {
                Assert.assertEquals(corpus.getCtx().getEvents().get(0).get("message"), "Entering scope",
                        "The first recorded event message should have specified that new scope was entered");
                Assert.assertTrue(corpus.getCtx().getEvents().get(corpus.getCtx().getEvents().size() - 1).get("message").startsWith("Leaving scope"),
                        "The last recorded event message should have specified that new scope was exited");
            }
        }
    }
}
