# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
from typing import TYPE_CHECKING
import unittest

from cdm.enums import ImportsLoadStrategy, CdmLogCode, CdmRelationshipDiscoveryStyle
from cdm.storage import LocalAdapter
from cdm.utilities import ResolveOptions, CopyOptions

from tests.common import async_test, TestHelper

if TYPE_CHECKING:
    from cdm.objectmodel import CdmDocumentDefinition, CdmManifestDefinition


class ImportsTests(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Imports')

    @async_test
    async def test_entity_with_missing_import(self):
        """The path between TestDataPath and TestName."""
        test_name = 'test_entity_with_missing_import'
        expected_log_codes = { CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE, CdmLogCode.WARN_RESOLVE_IMPORT_FAILED, CdmLogCode.WARN_DOC_IMPORT_NOT_LOADED }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name, expected_codes=expected_log_codes)

        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD

        doc = await corpus.fetch_object_async('local:/missingImport.cdm.json', res_opt=res_opt)
        self.assertIsNotNone(doc)
        self.assertEqual(1, len(doc.imports))
        self.assertEqual('missing.cdm.json', doc.imports[0].corpus_path)
        self.assertIsNone(doc.imports[0]._document)

    @async_test
    async def test_entity_with_missing_nested_imports_async(self):
        test_name = 'test_entity_with_missing_nested_imports_async'
        expected_log_codes = { CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE, CdmLogCode.WARN_RESOLVE_IMPORT_FAILED, CdmLogCode.WARN_DOC_IMPORT_NOT_LOADED }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name, expected_codes=expected_log_codes)

        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD

        doc = await corpus.fetch_object_async('local:/missingNestedImport.cdm.json', res_opt=res_opt)
        self.assertIsNotNone(doc)
        self.assertEqual(1, len(doc.imports))
        first_import = doc.imports[0]._document
        self.assertEqual(1, len(first_import.imports))
        self.assertEqual('notMissing.cdm.json', first_import.name)
        nested_import = first_import.imports[0]._document
        self.assertIsNone(nested_import)

    @async_test
    async def test_entity_with_same_imports_async(self):
        test_name = 'test_entity_with_same_imports_async'
        expected_log_codes = { CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE, CdmLogCode.WARN_RESOLVE_IMPORT_FAILED, CdmLogCode.WARN_DOC_IMPORT_NOT_LOADED }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name, expected_codes=expected_log_codes)

        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD

        doc = await corpus.fetch_object_async('local:/multipleImports.cdm.json', res_opt=res_opt)
        self.assertIsNotNone(doc)
        self.assertEqual(2, len(doc.imports))
        first_import = doc.imports[0]._document
        self.assertEqual('missingImport.cdm.json', first_import.name)
        self.assertEqual(1, len(first_import.imports))
        second_import = doc.imports[1]._document
        self.assertEqual('notMissing.cdm.json', second_import.name)

    @async_test
    async def test_non_existing_adapter_namespace(self):
        """Test an import with a non-existing namespace name."""
        test_name = 'test_non_existing_adapter_namespace'
        local_adapter = LocalAdapter(TestHelper.get_input_folder_path(self.tests_subpath, test_name))
        expected_log_codes = { CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name, expected_codes=expected_log_codes)

        # Register it as a 'local' adapter.
        corpus.storage.mount('erp', local_adapter)

        # Set local as our default.
        corpus.storage.default_namespace = 'erp'

        # Load a manifest that is trying to import from 'cdm' namespace.
        # The manifest does't exist since the import couldn't get resolved,
        # so the error message will be logged and the null value will be propagated back to a user.
        self.assertIsNone(await corpus.fetch_object_async('erp.missingImportManifest.cdm'))

    @async_test
    async def test_loading_same_imports_async(self):
        """Testing docs that load the same import"""
        test_name = 'test_loading_same_imports_async'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD

        main_doc = await corpus.fetch_object_async('mainEntity.cdm.json', res_opt=res_opt)
        self.assertIsNotNone(main_doc)
        self.assertEqual(2, len(main_doc.imports))

        first_import = main_doc.imports[0]._document
        second_import = main_doc.imports[1]._document

        # since these two imports are loaded asynchronously, we need to make sure that
        # the import that they share (targetImport) was loaded, and that the
        # targetImport doc is attached to both of these import objects
        self.assertEqual(1, len(first_import.imports))
        self.assertIsNotNone(first_import.imports[0]._document)
        self.assertEqual(1, len(second_import.imports))
        self.assertIsNotNone(second_import.imports[0]._document)

    @async_test
    async def test_prioritizing_imports_after_edit(self):
        """Testing that import priorities update correctly when imports are changed"""
        test_name = 'test_prioritizing_imports_after_edit'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        document = await corpus.fetch_object_async('local:/mainDoc.cdm.json')  # type: CdmDocumentDefinition
        res_opt = ResolveOptions(document)
        await document.refresh_async(res_opt)

        self.assertEqual(0, len(document.imports))
        # the current doc itself is added to the list of priorities
        self.assertEqual(1, len(document._import_priorities.import_priority))

        document.imports.append('importDoc.cdm.json', True)
        await document.refresh_async(res_opt)

        self.assertEqual(1, len(document.imports))
        self.assertEqual(2, len(document._import_priorities.import_priority))

    @async_test
    async def test_loading_same_missing_imports_async(self):
        """Testing docs that load the same import"""
        test_name = 'test_loading_same_missing_imports_async'
        expected_log_codes = { CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE, CdmLogCode.WARN_RESOLVE_IMPORT_FAILED, CdmLogCode.WARN_DOC_IMPORT_NOT_LOADED }
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name, expected_codes=expected_log_codes)

        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD

        main_doc = await corpus.fetch_object_async('mainEntity.cdm.json', res_opt=res_opt)
        self.assertIsNotNone(main_doc)
        self.assertEqual(2, len(main_doc.imports))

        # make sure imports loaded correctly, despite them missing imports
        first_import = main_doc.imports[0]._document
        second_import = main_doc.imports[1]._document

        self.assertEqual(1, len(first_import.imports))
        self.assertIsNone(first_import.imports[0]._document)

        self.assertEqual(1, len(second_import.imports))
        self.assertIsNone(first_import.imports[0]._document)

    @async_test
    async def test_loading_already_present_imports_async(self):
        """Testing docs that load the same import"""
        test_name = 'test_loading_already_present_imports_async'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD

        # load the first doc
        main_doc = await corpus.fetch_object_async('mainEntity.cdm.json', res_opt=res_opt)
        self.assertIsNotNone(main_doc)
        self.assertEqual(1, len(main_doc.imports))

        import_doc = main_doc.imports[0]._document
        self.assertIsNotNone(import_doc)

        # now load the second doc, which uses the same import
        # the import should not be loaded again, it should be the same object
        second_doc = await corpus.fetch_object_async('secondEntity.cdm.json', res_opt=res_opt)
        self.assertIsNotNone(second_doc)
        self.assertEqual(1, len(second_doc.imports))

        second_import_doc = main_doc.imports[0]._document
        self.assertIsNotNone(second_import_doc)

        self.assertIs(import_doc, second_import_doc)

    @async_test
    async def test_imports_for_rel_elevated_purpose_traits(self):
        """
        Testing that import for elevated purpose traits for relationships are added.
        """
        test_name = 'test_imports_for_rel_elevated_purpose_traits'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        root_manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')  # type: 'CdmManifestDefinition'
        sub_manifest = await corpus.fetch_object_async(root_manifest.sub_manifests[0].definition)

        await corpus.calculate_entity_graph_async(root_manifest)
        await root_manifest.populate_manifest_relationships_async(CdmRelationshipDiscoveryStyle.EXCLUSIVE)

        # Assert having relative path
        self.assertEqual('specialized/Gold.cdm.json', root_manifest.imports[0].corpus_path)
        self.assertEqual('/Lead.cdm.json', sub_manifest.imports[0].corpus_path)

        corpus.storage.fetch_root_folder('output').documents.append(root_manifest)
        corpus.storage.fetch_root_folder('output').documents.append(sub_manifest)
        copy_options = CopyOptions()
        copy_options.save_config_file = False
        await root_manifest.save_as_async('output:/default.manifest.cdm.json', False, copy_options)
        await sub_manifest.save_as_async('output:/default-submanifest.manifest.cdm.json', False, copy_options)

        TestHelper.compare_folder_files_equality(
            TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name),
            TestHelper.get_actual_output_folder_path(self.tests_subpath, test_name))


