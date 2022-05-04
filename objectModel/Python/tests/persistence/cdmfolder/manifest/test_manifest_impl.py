# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime, timezone
import os
import time
import unittest

from cdm.enums import CdmStatusLevel, CdmLogCode
from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition
from cdm.persistence.cdmfolder import ManifestPersistence
from cdm.persistence.cdmfolder.types import ManifestContent
from cdm.storage import LocalAdapter
from cdm.utilities import time_utils

from tests.common import async_test, TestHelper


class ManifestImplTest(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'CdmFolder', 'Manifest')

    def get_corpus(self):
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        return corpus

    def test_load_folder_with_no_entity_folders(self):
        """Testing for manifest impl instance with no entities and no sub manifests."""
        test_name = 'test_load_folder_with_no_entity_folders'
        corpus = self.get_corpus()
        content = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'empty.manifest.cdm.json')
        cdm_manifest = ManifestPersistence.from_object(corpus.ctx, 'cdmTest', 'someNamespace', '/', ManifestContent().decode(content))
        self.assertEqual(cdm_manifest.schema, 'CdmManifestDefinition.cdm.json')
        self.assertEqual(cdm_manifest.manifest_name, 'cdmTest')
        self.assertEqual(cdm_manifest.json_schema_semantic_version, '1.0.0')
        self.assertEqual(time_utils._get_formatted_date_string(cdm_manifest.last_file_modified_time), '2008-09-15T23:53:23.000Z')
        self.assertEqual(cdm_manifest.explanation, 'test cdm folder for cdm version 1.0+')
        self.assertEqual(1, len(cdm_manifest.imports))
        self.assertEqual(cdm_manifest.imports[0].corpus_path, '/primitives.cdm.json')
        self.assertEqual(0, len(cdm_manifest.entities))
        self.assertEqual(1, len(cdm_manifest.exhibits_traits))
        self.assertEqual(0, len(cdm_manifest.sub_manifests))

    def test_manifest_with_everything(self):
        """Testing for manifest impl instance with everything."""
        test_name = 'test_manifest_with_everything'
        corpus = self.get_corpus()
        content = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'complete.manifest.cdm.json')
        cdm_manifest = ManifestPersistence.from_object(corpus.ctx, 'docName', 'someNamespace', '/', ManifestContent().decode(content))
        self.assertEqual(1, len(cdm_manifest.sub_manifests))
        self.assertEqual(2, len(cdm_manifest.entities))
        self.assertEqual('cdmTest', cdm_manifest.manifest_name)

        content = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'noname.manifest.cdm.json')
        cdm_manifest = ManifestPersistence.from_object(corpus.ctx, 'docName.manifest.cdm.json', 'someNamespace', '/', ManifestContent().decode(content))
        self.assertEqual(1, len(cdm_manifest.sub_manifests))
        self.assertEqual(2, len(cdm_manifest.entities))
        self.assertEqual('docName', cdm_manifest.manifest_name)

    def test_folio_with_everything(self):
        """Testing for back-comp folio loading."""
        test_name = 'test_folio_with_everything'
        corpus = self.get_corpus()
        content = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'complete.folio.cdm.json')
        cdm_manifest = ManifestPersistence.from_object(corpus.ctx, 'docName', 'someNamespace', '/', ManifestContent().decode(content))
        self.assertEqual(1, len(cdm_manifest.sub_manifests))
        self.assertEqual(2, len(cdm_manifest.entities))
        self.assertEqual('cdmTest', cdm_manifest.manifest_name)

        content = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'noname.folio.cdm.json')
        cdm_manifest = ManifestPersistence.from_object(corpus.ctx, 'docName.folio.cdm.json', 'someNamespace', '/', ManifestContent().decode(content))
        self.assertEqual(1, len(cdm_manifest.sub_manifests))
        self.assertEqual(2, len(cdm_manifest.entities))
        self.assertEqual('docName', cdm_manifest.manifest_name)

    def test_manifest_for_copy_data(self):
        """Test for copy data."""
        test_name = 'test_manifest_for_copy_data'
        corpus = self.get_corpus()
        content = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'complete.manifest.cdm.json')
        cdm_manifest = ManifestPersistence.from_object(corpus.ctx, 'docName', 'someNamespace', '/', ManifestContent().decode(content))

        manifest_object = ManifestPersistence.to_data(cdm_manifest, None, None)
        self.assertEqual(manifest_object.schema, 'CdmManifestDefinition.cdm.json')
        self.assertEqual(manifest_object.jsonSchemaSemanticVersion, '1.0.0')
        self.assertEqual(manifest_object.documentVersion, '2.0.0')
        self.assertEqual(manifest_object.manifestName, 'cdmTest')
        self.assertEqual(manifest_object.explanation, 'test cdm folder for cdm version 1.0+')
        self.assertEqual(1, len(manifest_object.imports))
        self.assertEqual(manifest_object.imports[0].corpusPath, '/primitives.cdm.json')
        self.assertEqual(1, len(manifest_object.exhibitsTraits))
        self.assertEqual(2, len(manifest_object.entities))
        self.assertEqual(manifest_object.entities[0]['entityName'], 'testEntity')
        self.assertEqual(1, len(manifest_object.subManifests))
        self.assertEqual(manifest_object.subManifests[0].definition, 'test definition')
        self.assertEqual(manifest_object.lastFileModifiedTime, None)

    @async_test
    async def test_loads_and_sets_times_correctly(self):
        """Test modified times for manifest and files beneath it"""

        input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_loads_and_sets_times_correctly')
        time_before_load = datetime.now(timezone.utc)

        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loads_and_sets_times_correctly')

        def callback(level: CdmStatusLevel, message: str):
            self.fail('Unexpected log: ' + message)
        cdm_corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        cdm_corpus.storage.mount('someNamespace', LocalAdapter(input_path))

        cdm_manifest = await cdm_corpus.fetch_object_async('someNamespace:/default.manifest.cdm.json')
        status_time_at_load = cdm_manifest.last_file_status_check_time
        # hard coded because the time comes from inside the file
        self.assertEqual(time_utils._get_formatted_date_string(status_time_at_load), '2019-02-01T15:36:19.410Z')

        self.assertIsNotNone(cdm_manifest._file_system_modified_time)
        self.assertGreater(time_before_load, cdm_manifest._file_system_modified_time)

        time.sleep(1)

        await cdm_manifest.file_status_check_async()

        self.assertGreater(cdm_manifest.last_file_status_check_time, time_before_load)
        self.assertGreater(cdm_manifest.last_file_status_check_time, status_time_at_load)
        self.assertEqual(1, len(cdm_manifest.sub_manifests))
        self.assertGreater(cdm_manifest.sub_manifests[0].last_file_status_check_time, time_before_load)
        self.assertEqual(1, len(cdm_manifest.entities))
        self.assertEqual(1, len(cdm_manifest.entities[0].data_partitions))

        entity = cdm_manifest.entities[0]
        sub_manifest = cdm_manifest.sub_manifests[0]
        max_time = time_utils._max_time(entity.last_file_modified_time, sub_manifest.last_file_modified_time)
        self.assertEqual(time_utils._get_formatted_date_string(cdm_manifest.last_child_file_modified_time), time_utils._get_formatted_date_string(max_time))

    def test_valid_root_path(self):
        """Checks Absolute corpus path can be created with valid input."""
        corpus = CdmCorpusDefinition()
        # checks with None object
        absolute_path = corpus.storage.create_absolute_corpus_path('Abc/Def')
        self.assertEqual('/Abc/Def', absolute_path)
        absolute_path = corpus.storage.create_absolute_corpus_path('/Abc/Def')
        self.assertEqual('/Abc/Def', absolute_path)
        absolute_path = corpus.storage.create_absolute_corpus_path('cdm:/Abc/Def')
        self.assertEqual('cdm:/Abc/Def', absolute_path)
        manifest = CdmManifestDefinition(None, None)

        manifest._namespace = ''
        manifest._folder_path = 'Mnp/Qrs/'
        absolute_path = corpus.storage.create_absolute_corpus_path('Abc/Def', manifest)
        self.assertEqual('Mnp/Qrs/Abc/Def', absolute_path)

        manifest._namespace = 'cdm'
        manifest._folder_path = 'Mnp/Qrs/'
        absolute_path = corpus.storage.create_absolute_corpus_path('/Abc/Def', manifest)
        self.assertEqual('cdm:/Abc/Def', absolute_path)

        manifest._namespace = 'cdm'
        manifest._folder_path = 'Mnp/Qrs/'
        absolute_path = corpus.storage.create_absolute_corpus_path('Abc/Def', manifest)
        self.assertEqual('cdm:Mnp/Qrs/Abc/Def', absolute_path)

    def test_path_that_does_not_end_in_slash(self):
        """FolderPath should always end with a /
        This checks the behavior if FolderPath does not end with a /
        ('/' should be appended and a warning be sent through callback function)"""

        expected_log_codes = { CdmLogCode.WARN_STORAGE_EXPECTED_PATH_PREFIX }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_path_that_does_not_end_in_slash', expected_codes=expected_log_codes, no_input_and_output_folder=True)

        manifest = CdmManifestDefinition(None, None)
        manifest._namespace = 'cdm'
        manifest._folder_path = 'Mnp'
        absolute_path = corpus.storage.create_absolute_corpus_path('Abc', manifest)
        self.assertEqual('cdm:Mnp/Abc', absolute_path)

        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.WARN_STORAGE_EXPECTED_PATH_PREFIX, True, self)

    def test_path_root_invalid_object_path(self):
        """Tests absolute paths cannot be created with wrong parameters.
        Checks behavior if objectPath is invalid."""
        expected_log_codes = { CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_path_root_invalid_object_path', expected_codes=expected_log_codes, no_input_and_output_folder=True)

        corpus.storage.create_absolute_corpus_path('./Abc')
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        corpus.storage.create_absolute_corpus_path('/./Abc')
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        corpus.storage.create_absolute_corpus_path('../Abc')
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        corpus.storage.create_absolute_corpus_path('Abc/./Def')
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        corpus.storage.create_absolute_corpus_path('Abc/../Def')
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

    def test_path_root_invalid_folder_path(self):
        """"Tests absolute paths cannot be created with wrong parameters.
        Checks behavior if FolderPath is invalid."""
        expected_log_codes = { CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_path_root_invalid_folder_path', expected_codes=expected_log_codes, no_input_and_output_folder=True)

        manifest = CdmManifestDefinition(None, None)
        manifest._namespace = 'cdm'
        manifest._folder_path = './Mnp'
        corpus.storage.create_absolute_corpus_path('Abc', manifest)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        manifest = CdmManifestDefinition(None, None)
        manifest._namespace = 'cdm'
        manifest._folder_path = '/./Mnp'
        corpus.storage.create_absolute_corpus_path('Abc', manifest)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        manifest = CdmManifestDefinition(None, None)
        manifest._namespace = 'cdm'
        manifest._folder_path = '../Mnp'
        corpus.storage.create_absolute_corpus_path('Abc', manifest)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        manifest = CdmManifestDefinition(None, None)
        manifest._namespace = 'cdm'
        manifest._folder_path = 'Mnp/./Qrs'
        corpus.storage.create_absolute_corpus_path('Abc', manifest)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

        manifest = CdmManifestDefinition(None, None)
        manifest._namespace = 'cdm'
        manifest._folder_path = 'Mnp/../Qrs'
        corpus.storage.create_absolute_corpus_path('Abc', manifest)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT, True, self)

    def test_manifest_with_blank_fields(self):
        """Testing for manifest impl instance with blank or empty values for manifest schema, name etc."""
        test_name = 'test_manifest_with_blank_fields'
        corpus = self.get_corpus()
        content = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'blank.manifest.cdm.json')
        cdm_manifest = ManifestPersistence.from_object(corpus.ctx, 'cdmTest', 'someNamespace', '/', ManifestContent().decode(content))
        self.assertIsNone(cdm_manifest.schema)
        self.assertIsNone(cdm_manifest.document_version)
        self.assertEqual(time_utils._get_formatted_date_string(cdm_manifest.last_file_modified_time), '2008-09-15T23:53:23.000Z')
        self.assertEqual(cdm_manifest.explanation, 'test cdm folder for cdm version 1.0+')
        self.assertEqual(1, len(cdm_manifest.imports))
        self.assertEqual(cdm_manifest.imports[0].corpus_path, '/primitives.cdm.json')
        self.assertEqual(0, len(cdm_manifest.entities))
        self.assertEqual(1, len(cdm_manifest.exhibits_traits))
        self.assertEqual(0, len(cdm_manifest.sub_manifests))
