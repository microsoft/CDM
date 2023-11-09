# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
from typing import Optional
from unittest import TestCase

from cdm.enums import CdmStatusLevel, CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmCorpusDefinition, CdmDataPartitionDefinition, CdmDocumentDefinition, \
    CdmDataPartitionPatternDefinition, CdmManifestDefinition
from tests.common import async_test, TestHelper

def event_callback(status_level: 'CdmStatusLevel', message: str):
    """Declare a blackhole callback. We're focusing on event recorder, don't care about output going to the standard log stream."""

# Dummy value used for correlation ID testing.
DUMMY_CORRELATION_ID = '12345'
TEST_SUB_PATH = 'Utilities'

class TestEventList(TestCase):
    @async_test
    async def test_without_nesting(self):
        """Tests several use cases where no nesting of recording functions happens."""
        corpus = TestHelper.get_local_corpus('Utilities', 'TestEventList') # type: CdmCorpusDefinition
        corpus.set_event_callback(event_callback, CdmStatusLevel.WARNING, DUMMY_CORRELATION_ID)

        # Test fetching an object from invalid namespace results in at least one error message in the recorder
        await corpus.fetch_object_async('foo:/bar')
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_ADAPTER_NOT_FOUND, True, self)

        # Test fetching a good object, this should leave event recorder empty
        await corpus.fetch_object_async('local:/default.manifest.cdm.json')
        self._test_no_logs_state(corpus)

        # Test saving a manifest to invalid namespace results in at least one error message in the recorder
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'dummy')  # type: CdmManifestDefinition
        await manifest.save_as_async('foo:/bar', True)
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_VALDN_MISSING_DOC, True, self)

        # Test resolving a manifest not added to a folder, this should yield at least one error message in the recorder
        await manifest.create_resolved_manifest_async('new dummy', None)
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_RESOLVE_MANIFEST_FAILED, True, self)

        # Test resolving an entity without WRT doc, this should yield at least one error message in the recorder
        entity2 = corpus.make_object(CdmObjectType.ENTITY_DEF, 'MyEntity2')
        await entity2.create_resolved_entity_async('MyEntity2-Resolved')
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_DOC_WRT_DOC_NOT_FOUND, True, self)

        # Test invoking FileStatusCheckAsync on the manifest, this should yield at least one error message in the recorder
        await manifest.file_status_check_async()
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_NULL_NAMESPACE, True, self)

        # Repeat the same test but with status level 'None', no events should be recorded
        corpus.ctx.report_at_level = CdmStatusLevel.NONE
        await entity2.create_resolved_entity_async('MyEntity2-Resolved')
        self._test_no_logs_state(corpus)

        # Test checking file status on a data partition
        # We're at log level 'Progress', so we get the EnterScope/LeaveScope messages too
        corpus.ctx.report_at_level = CdmStatusLevel.PROGRESS
        part = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, "part")  # type: CdmDataPartitionDefinition
        await part.file_status_check_async()
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_PATH_NULL_OBJECT_PATH, True, self)

        # Test checking file status on a data partition pattern
        ref_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, "RefEntDoc")  # type: CdmDocumentDefinition
        part_pattern = corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, "partPattern")  # type: CdmDataPartitionPatternDefinition
        part_pattern.in_document = ref_doc
        await part_pattern.file_status_check_async()
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_NULL_CORPUS_PATH, True, self)

        # Test calculating relationships - no errors/warnings
        await corpus.calculate_entity_graph_async(manifest)
        self._test_basic_logs_state(corpus)

        # Test populating relationships in manifest - no errors/warnings
        await manifest.populate_manifest_relationships_async()
        self._test_basic_logs_state(corpus)

        # Test filtering code logic
        corpus.ctx.suppressed_log_codes.add(CdmLogCode.ERR_PATH_NULL_OBJECT_PATH);
        part2 = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, "part")  # type: CdmDataPartitionDefinition
        await part2.file_status_check_async()

        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_PATH_NULL_OBJECT_PATH, False, self);

    @async_test
    async def test_with_nesting(self):
        """Tests a use case where recording nesting happens, such as CreateResolvedManifestAsync making calls to CreateResolvedEntityAsync."""
        corpus = TestHelper.get_local_corpus('Utilities', 'TestEventList') # type: CdmCorpusDefinition
        corpus.set_event_callback(event_callback, CdmStatusLevel.WARNING, DUMMY_CORRELATION_ID)

        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'dummy')

        # Test resolving a manifest (added to a folder) with an entity in it, this should collect messages from
        # CreateResolvedManifestAsync and CreateResolvedEntityAsync functions
        corpus.storage.fetch_root_folder('local').documents.append(manifest)
        entity1 = corpus.make_object(CdmObjectType.ENTITY_DEF, 'MyEntity1')

        some_attrib1 = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'some_attrib1', False)
        some_attrib1.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'entityId', True)
        entity1.attributes.append(some_attrib1)

        entity1_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, 'MyEntity1.cdm.json')
        entity1_doc.definitions.append(entity1)
        corpus.storage.fetch_root_folder('local').documents.append(entity1_doc)

        manifest.entities.append(entity1)
        await manifest.create_resolved_manifest_async('new dummy 2', None)

        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_RESOLVE_REFERENCE_FAILURE, True, self)

        # Keep for debugging
        # for log_entry in corpus.ctx.events:
        #     for log_entry_key in log_entry:
        #         print(log_entry_key + '=' + (log_entry[log_entry_key]) if log_entry[log_entry_key] else '')
        #     print()

    @async_test
    async def test_storage_manager_events(self):
        """Tests events generated in StorageManager APIs"""
        corpus = TestHelper.get_local_corpus(TEST_SUB_PATH, 'TestEventList')
        corpus.set_event_callback(event_callback, CdmStatusLevel.INFO, DUMMY_CORRELATION_ID)

        corpus.storage.mount('dummy', None)
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_NULL_ADAPTER, True, self)

        corpus.storage.unmount('nothing')
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.WARN_STORAGE_REMOVE_ADAPTER_FAILED, True, self)

        # No errors/warnings expected here
        corpus.storage.fetch_root_folder(None)
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_NULL_NAMESPACE, True, self)

        corpus.storage.adapter_path_to_corpus_path('Test')
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_ADAPTER_PATH, True, self)

        corpus.storage.corpus_path_to_adapter_path('unknown:/Test')
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_ADAPTER_NOT_FOUND, True, self)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_NAMESPACE_NOT_REGISTERED, True, self)

        corpus.storage.create_absolute_corpus_path(None)
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_PATH_NULL_OBJECT_PATH, True, self)

        corpus.storage.create_relative_corpus_path(None)
        self._test_basic_logs_state(corpus)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_PATH_NULL_OBJECT_PATH, True, self)

    @async_test
    async def test_scoping(self):
        """Test logging of API scope entry/exit."""
        corpus = TestHelper.get_local_corpus('Utilities', 'TestEventList') # type: CdmCorpusDefinition
        # For scoping test we need to use log level progress
        corpus.set_event_callback(event_callback, CdmStatusLevel.PROGRESS, DUMMY_CORRELATION_ID)

        # Test fetching a good object, this should result event recorder empty
        await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 2, 'There should have been at least 2 (debug) events recorded when fetching object with correct path')

        self._test_basic_logs_state(corpus)

        # Verify method on entry/exit event
        self.assertTrue(corpus.ctx.events[0]['method'] == 'fetch_object_async',
                        'The first recorded event message should have specified scope method of \'fetch_object_async\'')
        self.assertTrue(corpus.ctx.events[len(corpus.ctx.events) - 1]['method'] == 'fetch_object_async',
            'The last recorded event message should have specified scope method of \'fetch_object_async\'')

        # Keep for debugging
        # for log_entry in corpus.ctx.events:
        #     for log_entry_key in log_entry:
        #         print(log_entry_key + '=' + (log_entry[log_entry_key]) if log_entry[log_entry_key] else '')
        #     print()

    def _test_no_logs_state(self, corpus: CdmCorpusDefinition):
        """Helper function to test that recording is stopped and no logs are recorded."""
        self._test_basic_logs_state(corpus, True)

    def _test_basic_logs_state(self, corpus: CdmCorpusDefinition, expect_no_logs: Optional[bool] = False):
        """Helper function to check for event list state and presence of scope enter/leave logs.
        If expect_no_logs is true, tests that recording is stopped and there are no logs in EventList. If false,
        tests that there are multiple entries and log enter/exit events were logged."""

        self.assertIsNotNone(corpus.ctx.events, 'Events list should not be null')
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')

        if expect_no_logs:
            self.assertTrue(len(corpus.ctx.events) == 0,
                            'There should have been no events recorded when fetching object with correct path')
        else:
            self.assertTrue(len(corpus.ctx.events) > 0, 'There should have been at least one event recorded')
            self.assertTrue('timestamp' in corpus.ctx.events[0], 'The recorded event should have had a timestamp key')
            self.assertTrue(corpus.ctx.events[0]['cid'] == DUMMY_CORRELATION_ID,
                            'The recorded event should have had a correlationId key with the dummy value')

            if corpus.ctx.report_at_level == CdmStatusLevel.PROGRESS:
                self.assertTrue(corpus.ctx.events[0]['message'] == 'Entering scope',
                                'The first recorded event message should have specified that new scope was entered')
                self.assertTrue(corpus.ctx.events[len(corpus.ctx.events) - 1]['message'].startswith('Leaving scope'),
                                'The last recorded event message should have specified that new scope was exited')
