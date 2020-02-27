# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel
from cdm.storage import LocalAdapter
from cdm.objectmodel import CdmCorpusDefinition, CdmTypeAttributeDefinition
from cdm.persistence import PersistenceLayer
from cdm.utilities import CopyOptions, ResolveOptions

from tests.common import async_test, TestHelper


class TestEntity(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'CdmFolder', 'Entity')

    @async_test
    async def test_entity_properties(self):
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_entity_properties')

        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        obj = await corpus.fetch_object_async('local:/entA.cdm.json/Entity A')
        att = obj.attributes[0]  # type: CdmTypeAttributeDefinition
        result = next(filter(lambda x: x.named_reference == 'is.constrained', att.applied_traits), None)

        self.assertIsNotNone(result)
        self.assertEqual(att.maximum_length, 30)
        self.assertIsNone(att.maximum_value)
        self.assertIsNone(att.minimum_value)

        # removing the only argument should remove the trait
        att.maximum_length = None
        result = next(filter(lambda x: x.named_reference == 'is.constrained', att.applied_traits), None)
        self.assertIsNone(att.maximum_length)
        self.assertIsNone(result)
    
    @async_test
    async def test_from_and_to_data_with_elevated_traits(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_from_and_to_data_with_elevated_traits')
        # need to set schema docs to the cdm namespace instead of using resources
        corpus.storage.mount("cdm", LocalAdapter(TestHelper.get_schema_docs_root()))
        def callback(level, message):
            self.assertTrue('unable to resolve an entity' not in message)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        entity = await corpus.fetch_object_async('local:/Account.cdm.json/Account')  # type: CdmEntityDefinition
        res_entity = await  entity.create_resolved_entity_async('{}_'.format(entity.entity_name))  # type: CdmEntityDefinition
        PersistenceLayer.to_data(res_entity, ResolveOptions(wrt_doc=res_entity.in_document), CopyOptions(string_refs=True), PersistenceLayer.CDM_FOLDER)

    @async_test
    async def test_loading_entity_with_shallow_validation(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loading_entity_with_shallow_validation')
        corpus.storage.mount("cdm", LocalAdapter(TestHelper.get_schema_docs_root()))
        def callback(level, message):
            # when messages regarding references not being resolved or loaded are logged, check that they are warnings and not errors.
            if 'Unable to resolve the reference' in message or 'Could not read' in message:
                self.assertEqual(level, CdmStatusLevel.WARNING)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # load entity with shallow_validation = true.
        await corpus.fetch_object_async('local:/Entity.cdm.json/Entity', None, True)
        # load resolved entity with shallow_validation = true.
        await corpus.fetch_object_async('local:/ResolvedEntity.cdm.json/ResolvedEntity', None, True)

    @async_test
    async def test_loading_entity_without_shallow_validation(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loading_entity_with_shallow_validation')
        corpus.storage.mount("cdm", LocalAdapter(TestHelper.get_schema_docs_root()))
        def callback(level, message):
            # when messages regarding references not being resolved or loaded are logged, check that they are errors.
            if 'Unable to resolve the reference' in message or 'Could not read' in message:
                self.assertEqual(level, CdmStatusLevel.ERROR)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # load entity with shallow_validation = false.
        await corpus.fetch_object_async('local:/Entity.cdm.json/Entity')
        # load resolved entity with shallow_validation = false.
        await corpus.fetch_object_async('local:/ResolvedEntity.cdm.json/ResolvedEntity')
