# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
import datetime
import os
import unittest
from typing import Dict

from cdm.enums import CdmStatusLevel, CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDeclarationDefinition, CdmEntityDefinition, CdmFolderDefinition, \
    CdmManifestDefinition, CdmTypeAttributeDefinition
from cdm.persistence.persistence_layer import PersistenceLayer
from cdm.storage import LocalAdapter
from cdm.utilities import CopyOptions

from tests.common import async_test, TestHelper
from tests.mock_storage_adapter import MockStorageAdapter
from tests.syms_test_helper import SymsTestHelper

class PersistenceLayerTest(unittest.TestCase):
    test_subpath = os.path.join('Persistence', 'PersistenceLayer')

    @async_test
    async def test_invalid_json(self):
        test_input_path = TestHelper.get_input_folder_path(self.test_subpath, 'test_invalid_json')

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
    async def test_not_saving_config_file(self):
        """Test setting SaveConfigFile to false and checking if the file is not saved."""

        test_name = 'test_not_saving_config_file'
        corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)

        # Load manifest from input folder.
        manifest = await corpus.fetch_object_async('default.manifest.cdm.json')

        # Move manifest to output folder.
        output_folder = corpus.storage.fetch_root_folder('output')
        for entity_dec in manifest.entities:
            entity = await corpus.fetch_object_async(entity_dec.entity_path, manifest)
            output_folder.documents.append(entity.in_document)

        output_folder.documents.append(manifest)

        # Make sure the output folder is empty.
        TestHelper.delete_files_from_actual_output(TestHelper.get_actual_output_folder_path(self.test_subpath, test_name))

        # Save manifest to output folder.
        copy_options = CopyOptions()
        copy_options.save_config_file = False

        await manifest.save_as_async("default.manifest.cdm.json", False, copy_options)

        # Compare the result.
        TestHelper.compare_folder_files_equality(
            TestHelper.get_expected_output_folder_path(self.test_subpath, test_name),
            TestHelper.get_actual_output_folder_path(self.test_subpath, test_name))

    @async_test
    async def test_loading_invalid_model_json_name(self):
        test_input_path = TestHelper.get_input_folder_path(self.test_subpath, 'test_loading_invalid_model_json_name')

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        # We are trying to load a file with an invalid name, so fetch_object_async should just return None.
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
        # TODO: because we can load documents properly now, save_as_async returns false. Will check the value returned from save_as_async() when the problem is solved
        self.assertFalse('/' + new_manifest_from_model_json_name in all_docs)

    @async_test
    async def test_model_json_type_attribute_persistence(self):
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'TestModelJsonTypeAttributePersistence')

        # we need to create a second adapter to the output folder to fool the OM into thinking it's different
        # this is because there is a bug currently that prevents us from saving and then loading a model.json
        corpus.storage.mount('alternateOutput', LocalAdapter(TestHelper.get_actual_output_folder_path(self.test_subpath, 'TestModelJsonTypeAttributePersistence')))

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
        expected_log_codes = { CdmLogCode.ERR_PERSIST_CLASS_MISSING }
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'TestMissingPersistenceFormat', expected_codes=expected_log_codes)  # type: CdmCorpusDefinition

        folder = corpus.storage.fetch_root_folder(corpus.storage.default_namespace)  # type: CdmFolderDefinition

        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'someManifest')  # type: CdmManifestDefinition
        folder.documents.append(manifest)
        # trying to save to an unsupported format should return false and not fail
        succeded = await manifest.save_as_async('manifest.unSupportedExtension')

        self.assertFalse(succeded)

    @async_test
    @unittest.skipIf(SymsTestHelper.if_syms_run_tests_flag_not_set(), 'SYMS environment variables not set up')
    async def test_syms_saving_and_fetching_document(self):
        syms_adapter = SymsTestHelper.create_adapter_with_clientid()
        await SymsTestHelper.clean_database(syms_adapter, SymsTestHelper.DATABASE_NAME)

        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_syms_saving_and_fetching_document')
        corpus.storage.unmount('remote')

        adls_adapter1 = SymsTestHelper.create_adapter_clientid_with_shared_key(1)
        adls_adapter2 = SymsTestHelper.create_adapter_clientid_with_shared_key(2)
    
        corpus.storage.mount('adls1', adls_adapter1)
        corpus.storage.mount('adls2', adls_adapter2)
        corpus.storage.mount('syms', syms_adapter)

        expected_manifest = await corpus.fetch_object_async('default.manifest.cdm.json')
        expected_manifest.manifest_name = SymsTestHelper.DATABASE_NAME
        await self.run_syms_save_manifest(expected_manifest)
        await self.run_syms_fetch_manifest(corpus, expected_manifest, 'default.manifest.cdm.json')
        await self.run_syms_fetch_document(corpus, expected_manifest)

        expected_modified_manifest = await corpus.fetch_object_async('defaultmodified.manifest.cdm.json')
        expected_modified_manifest.manifest_name = SymsTestHelper.DATABASE_NAME
        expected_modified_manifest.entities[0].set_last_file_modified_time(datetime.datetime.now(datetime.timezone.utc))
        await self.run_syms_save_manifest(expected_modified_manifest)
        await self.run_syms_fetch_manifest(corpus, expected_modified_manifest, 'defaultmodified.manifest.cdm.json')
        await self.run_syms_fetch_document(corpus, expected_modified_manifest)

        await self.run_syms_smart_adls_adapter_mount_logic()
        await SymsTestHelper.clean_database(syms_adapter, SymsTestHelper.DATABASE_NAME)

    @async_test
    @unittest.skipIf(SymsTestHelper.if_syms_run_tests_flag_not_set(), 'SYMS environment variables not set up')
    @unittest.skip
    async def test_syms_load_spark_partition(self):
        '''Test loading a manifest that contains Spark Partitions.'''

        # TODO: uncomment when bug 852342 is fixed.
        # corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_syms_load_spark_partition')
        corpus = CdmCorpusDefinition()
        corpus.storage.unmount('remote')
        
        syms_adapter = SymsTestHelper.create_adapter_with_clientid()
        corpus.storage.mount('syms', syms_adapter)

        adls_adapter = SymsTestHelper.create_adapter_clientid_with_shared_key(1)
        corpus.storage.mount('adls', adls_adapter)

        table_name = 'SparkPartitionTest'
        manifest = await corpus.fetch_object_async(f'syms:/default/{table_name}.manifest.cdm.json')  # type: CdmManifestDefinition
        
        self.assertIsNotNone(manifest)
        self.assertEqual(1, len(manifest.entities[0].data_partition_patterns))
        self.assertEqual(0, len(manifest.entities[0].data_partitions))

        await manifest.file_status_check_async()

        self.assertEqual(4, len(manifest.entities[0].data_partitions))

    @async_test
    async def test_loading_empty_json_data(self):
        expected_log_codes = {CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE}

        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_loading_empty_json_data', None, False, expected_log_codes, False)

        # We are trying to load an empty file, so fetch_object_async should just return None.
        manifest = await corpus.fetch_object_async('empty.Manifest.cdm.json')
        self.assertIsNone(manifest)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE, True, self)

    async def run_syms_save_manifest(self, manifest: CdmManifestDefinition):
        self.assertTrue(await manifest.save_as_async('syms:/{}/{}.manifest.cdm.json'.format(manifest.manifest_name, manifest.manifest_name)))

    async def run_syms_fetch_manifest(self, corpus: CdmCorpusDefinition, manifest_expected: 'CdmManifestDefinition', filename: str, threadnumber:str = ''):
        manifest_read_databases = await corpus.fetch_object_async('syms:/databases.manifest.cdm.json')
        self.assertIsNotNone(manifest_read_databases)
        self.assertEqual('databases.manifest.cdm.json', manifest_read_databases.manifest_name)

        if not any(db.manifest_name == manifest_expected.manifest_name for db in
                   manifest_read_databases.sub_manifests):
            self.fail('Database {} does not exist'.format(manifest_expected.manifest_name))

        manifest_actual = await corpus.fetch_object_async('syms:/{}/{}.manifest.cdm.json'.format(manifest_expected.manifest_name, manifest_expected.manifest_name),
                                                     manifest_read_databases, None, True)
        await manifest_actual.save_as_async('output:/{}{}'.format(filename, threadnumber))
    
        actual_content = TestHelper.get_actual_output_data(self.test_subpath, 'test_syms_saving_and_fetching_document',
                                                              filename)
        expected_content = PersistenceLayer.to_data(manifest_expected, None, None, 'CdmFolder').to_dict()
        ret = TestHelper.compare_same_object(actual_content, expected_content)
        if ret is not '':
            self.fail(ret)

    async def run_syms_fetch_document(self, corpus: 'CdmCorpusDefinition', manifest_expected: 'CdmManifestDefinition'):
        for ent in manifest_expected.entities:
            doc = await corpus.fetch_object_async('syms:/{}/{}.cdm.json'.format(manifest_expected.manifest_name, ent.entity_name))
            self.assertIsNotNone(doc)
            self.assertTrue(doc.name == '{}.cdm.json'.format(ent.entity_name))

            await doc.save_as_async('output:/{}'.format(doc.name))

            doc_local = await corpus.fetch_object_async(doc.name)
            actual_content = TestHelper.get_actual_output_data(self.test_subpath, 'TestSymsSavingAndFetchingDocument',
                                                               doc.name)
            expected_content = PersistenceLayer.to_data(doc_local, None, None, 'CdmFolder').to_dict()
            ret = TestHelper.compare_same_object(actual_content, expected_content)
            if ret is not '':
                self.fail(ret)

    async def run_syms_smart_adls_adapter_mount_logic(self):
        syms_adapter = SymsTestHelper.create_adapter_with_clientid()
        corpus = CdmCorpusDefinition()
        corpus.storage.mount('syms', syms_adapter)
        adls_adapter1 = SymsTestHelper.create_adapter_clientid_with_shared_key(1)
        adls_adapter2 = SymsTestHelper.create_adapter_clientid_with_shared_key(2)

        count_adapter_count_before = len(corpus.storage.namespace_adapters)
        manifest_read_databases = await corpus.fetch_object_async('syms:/databases.manifest.cdm.json')
        manifest = await corpus.fetch_object_async('syms:/{}/{}.manifest.cdm.json'.format(manifest_read_databases.sub_manifests[0].manifest_name,
                                                                                          manifest_read_databases.sub_manifests[0].manifest_name),
                                                   manifest_read_databases, None, True)

        count_adapter_count_after = len(corpus.storage.namespace_adapters)

        self.assertEqual(count_adapter_count_before + 2, count_adapter_count_after)
        self.assertIsNotNone(corpus.storage.adapter_path_to_corpus_path('https://{}{}'.format(adls_adapter1.hostname, adls_adapter1.root)))
        self.assertIsNotNone(corpus.storage.adapter_path_to_corpus_path('https://{}{}'.format(adls_adapter2.hostname, adls_adapter2.root)))
