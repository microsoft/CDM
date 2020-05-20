# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper
from tests.mock_storage_adapter import MockStorageAdapter


class PersistenceLayerTest(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'PersistenceLayer')

    @async_test
    async def test_invalid_json(self):
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_invalid_json')

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        invalid_manifest = None
        try:
            invalid_manifest = await corpus.fetch_object_async('local:/invalidManifest.manifest.cdm.json')
        except Exception as e:
            self.fail('Error should not be thrown when input json is invalid.')

        self.assertIsNone(invalid_manifest)

    @async_test
    async def test_loading_invalid_model_json_name(self):
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_loading_invalid_model_json_name')

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        # We are trying to load a file with an invalid name, so fetch_object_async should just return null.
        invalid_model_json = await corpus.fetch_object_async('test.model.json')
        self.assertIsNone(invalid_model_json)

    @async_test
    async def test_saving_invalid_model_json_name(self):
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.unmount('cdm')
        corpus.storage.default_namespace = 'local'
        manifest = CdmManifestDefinition(corpus.ctx, 'manifest')
        corpus.storage.fetch_root_folder('local').documents.append(manifest)

        all_docs = {}  # type: Dict[str, str]
        test_adapter = MockStorageAdapter(all_docs)
        corpus.storage._set_adapter('local', test_adapter)

        new_manifest_from_model_json_name = 'my.model.json'
        await manifest.save_as_async(new_manifest_from_model_json_name, True)
        # TODO: because we can load documents properly now, SaveAsAsync returns false. Will check the value returned from SaveAsAsync() when the problem is solved
        self.assertFalse('/' + new_manifest_from_model_json_name in all_docs)

    @async_test
    async def test_model_json_type_attribute_persistence(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestModelJsonTypeAttributePersistence')

        # we need to create a second adapter to the output folder to fool the OM into thinking it's different
        # this is because there is a bug currently that prevents us from saving and then loading a model.json
        corpus.storage.mount('alternateOutput', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'TestModelJsonTypeAttributePersistence')))

        # create manifest
        entity_name = 'TestTypeAttributePersistence'
        local_root = corpus.storage.fetch_root_folder('local')
        output_root = corpus.storage.fetch_root_folder('output')
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'tempAbstract')  # type: CdmManifestDefinition
        manifest.imports.append('cdm:/foundations.cdm.json', None)
        local_root.documents.append(manifest)

        # create entity
        doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, entity_name + '.cdm.json')  # type: CdmManifestDefinition
        doc.imports.append('cdm:/foundations.cdm.json', None)
        local_root.documents.append(doc, doc.name)
        entity_def = doc.definitions.append(entity_name, CdmObjectType.ENTITY_DEF)  # type: CdmEntityDeclarationDefinition

        # create type attribute
        cdm_type_attribute_definition = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, entity_name, False)  # type: CdmTypeAttributeDefinition
        cdm_type_attribute_definition.is_read_only = True
        entity_def.attributes.append(cdm_type_attribute_definition)

        manifest.entities.append(entity_def)

        manifest_resolved = await manifest.create_resolved_manifest_async('default', None)
        output_root.documents.append(manifest_resolved)
        manifest_resolved.imports.append('cdm:/foundations.cdm.json')
        await manifest_resolved.save_as_async('model.json', True)
        new_manifest = await corpus.fetch_object_async('alternateOutput:/model.json')  # type: CdmManifestDefinition

        new_ent = await corpus.fetch_object_async(new_manifest.entities[0].entity_path, manifest)  # type: CdmEntityDefinition
        type_attribute = new_ent.attributes[0]
        self.assertTrue(type_attribute.is_read_only)

    @async_test
    async def test_missing_persistence_format(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestMissingPersistenceFormat')  # type: CdmCorpusDefinition
        folder = corpus.storage.fetch_root_folder(corpus.storage.default_namespace)  # type: CdmFolderDefinition

        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'someManifest')  # type: CdmManifestDefinition
        folder.documents.append(manifest)
        # trying to save to an unsupported format should return false and not fail
        succeded = await manifest.save_as_async('manifest.unSupportedExtension')
        self.assertFalse(succeded)
