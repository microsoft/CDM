# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from unittest import TestCase

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition
from tests.common import async_test, TestHelper

def event_callback(status_level: 'CdmStatusLevel', message: str):
    '''Declare a blackhole callback. We're focusing on event recorder, don't care about output going to the standard log stream.'''

# Dummy value used for correlation ID testing.
DUMMY_CORRELATION_ID = '12345'

class TestEventList(TestCase):
    @async_test
    async def test_without_nesting(self):
        '''Tests several use cases where no nesting of recording functions happens.'''
        corpus = TestHelper.get_local_corpus('Utilities', 'TestEventList') # type: CdmCorpusDefinition
        corpus.set_event_callback(event_callback, CdmStatusLevel.WARNING, DUMMY_CORRELATION_ID)

        # Test fetching an object from invalid namespace results in at least one error message in the recorder
        await corpus.fetch_object_async('foo:/bar')
        self.assertIsNotNone(corpus.ctx.events, 'ctx.events should not be None')
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 0, 'There should have been at least one event recorded when fetching object with incorrect path')
        self.assertTrue('timestamp' in corpus.ctx.events[0], 'The recorded event should have had a timestamp key')
        self.assertTrue(corpus.ctx.events[0]['correlationId'] == DUMMY_CORRELATION_ID, 'The recorded event should have had a correlationId key with the dummy value')

        # Test fetching a good object, this should leave event recorder empty
        await corpus.fetch_object_async('local:/default.manifest.cdm.json')
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) == 0, 'There should have been no events recorded when fetching object with correct path')

        # Test saving a manifest to invalid namespace results in at least one error message in the recorder
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'dummy')
        await manifest.save_as_async('foo:/bar', True)
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 0, 'There should have been at least one event recorded')
        self.assertTrue('timestamp' in corpus.ctx.events[0], 'The recorded event should have had a timestamp key')
        self.assertTrue(corpus.ctx.events[0]['correlationId'] == DUMMY_CORRELATION_ID, 'The recorded event should have had a correlationId key with the dummy value')

        # Test resolving a manifest not added to a folder, this should yield at least one error message in the recorder
        await manifest.create_resolved_manifest_async('new dummy', None)
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 0, 'There should have been at least one event recorded')
        self.assertTrue('timestamp' in corpus.ctx.events[0], 'The recorded event should have had a timestamp key')
        self.assertTrue(corpus.ctx.events[0]['correlationId'] == DUMMY_CORRELATION_ID, 'The recorded event should have had a correlationId key with the dummy value')

        # Test resolving an entity without WRT doc, this should yield at least one error message in the recorder
        entity2 = corpus.make_object(CdmObjectType.ENTITY_DEF, 'MyEntity2')
        await entity2.create_resolved_entity_async('MyEntity2-Resolved')
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 0, 'There should have been at least one event recorded')
        self.assertTrue('timestamp' in corpus.ctx.events[0], 'The recorded event should have had a timestamp key')
        self.assertTrue(corpus.ctx.events[0]['correlationId'] == DUMMY_CORRELATION_ID, 'The recorded event should have had a correlationId key with the dummy value')

        # Test invoking FileStatusCheckAsync on the manifest, this should yield at least one error message in the recorder
        await manifest.file_status_check_async()
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 0, 'There should have been at least one event recorded')
        self.assertTrue('timestamp' in corpus.ctx.events[0], 'The recorded event should have had a timestamp key')
        self.assertTrue(corpus.ctx.events[0]['correlationId'] == DUMMY_CORRELATION_ID, 'The recorded event should have had a correlationId key with the dummy value')

        # Repeat the same test but with status level 'None', no events should be recorded
        corpus.ctx.report_at_level = CdmStatusLevel.NONE
        await entity2.create_resolved_entity_async('MyEntity2-Resolved')
        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) == 0, 'There should have been no events recorded when fetching object with correct path')

    @async_test
    async def test_with_nesting(self):
        '''Tests a use case where recording nesting happens, such as CreateResolvedManifestAsync making calls to CreateResolvedEntityAsync.'''
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

        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 0, 'There should have been at least one event recorded')
        # We check that there first event recorded was an error from the nested function
        self.assertTrue(corpus.ctx.events[0]['level'] == 'ERROR', 'The first recorded event level should have been \'ERROR\'')
        self.assertTrue(corpus.ctx.events[0]['message'] == 'Unable to resolve the reference \'entityId\' to a known object',
            'The first recorded event message should have specified that \'entityId\' was not resolved')
        self.assertTrue(corpus.ctx.events[0]['correlationId'] == DUMMY_CORRELATION_ID, 'The recorded event should have had a correlationId key with the dummy value')

        # Keep for debugging
        # for log_entry in corpus.ctx.events:
        #     for log_entry_key in log_entry:
        #         print(log_entry_key + '=' + (log_entry[log_entry_key]) if log_entry[log_entry_key] else '')
        #     print()

    @async_test
    async def test_scoping(self):
        '''Test logging of API scope entry/exit.'''
        corpus = TestHelper.get_local_corpus('Utilities', 'TestEventList') # type: CdmCorpusDefinition
        # For scoping test we need to use log level INFO
        corpus.set_event_callback(event_callback, CdmStatusLevel.INFO, DUMMY_CORRELATION_ID)

        # Test fetching a good object, this should result event recorder empty
        await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        self.assertFalse(corpus.ctx.events.is_recording, 'Recording should be disabled at the end of API call')
        self.assertTrue(len(corpus.ctx.events) > 2, 'There should have been at least 2 (debug) events recorded when fetching object with correct path')

        # Verify scope entry event
        self.assertTrue(corpus.ctx.events[0]['message'] == 'Entering scope', 'The first recorded event message should have specified that new scope was entered')
        self.assertTrue(corpus.ctx.events[0]['path'] == 'fetch_object_async', 'The first recorded event message should have specified scope path of \'fetch_object_async\'')

        # Verify scope exit event
        self.assertTrue(corpus.ctx.events[len(corpus.ctx.events) - 1]['message'] == 'Leaving scope',
            'The last recorded event message should have specified that new scope was exited')
        self.assertTrue(corpus.ctx.events[len(corpus.ctx.events) - 1]['path'] == 'fetch_object_async',
            'The last recorded event message should have specified scope path of \'fetch_object_async\'')

        # Keep for debugging
        # for log_entry in corpus.ctx.events:
        #     for log_entry_key in log_entry:
        #         print(log_entry_key + '=' + (log_entry[log_entry_key]) if log_entry[log_entry_key] else '')
        #     print()
