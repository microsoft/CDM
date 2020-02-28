# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
from tests.common import async_test
from cdm.objectmodel import CdmImport
from .cdm_collection_helper_functions import generate_manifest


class TestCdmImportCollectionAdd(unittest.TestCase):
    @async_test
    def test_cdm_import_collection_add(self):
        document = generate_manifest('C:\\Nothing')
        document._is_dirty = False
        self.assertFalse(document._is_dirty)
        import_value = CdmImport(document.ctx, 'corpusPath', 'moniker')
        addedImport = document.imports.append(import_value)

        self.assertTrue(document._is_dirty)
        self.assertEqual(1, len(document.imports))
        self.assertEqual(addedImport, addedImport)
        self.assertEqual(addedImport, document.imports[0])
        self.assertEqual('corpusPath', addedImport.corpus_path)
        self.assertEqual('moniker', addedImport.moniker)
        self.assertEqual(document.ctx, addedImport.ctx)

    # @async_test
    def test_cdm_import_collection_add_corpus_path(self):
        document = generate_manifest('C:\\Nothing')
        document._is_dirty = False
        import_value = document.imports.append('corpusPath')

        self.assertTrue(document._is_dirty)
        self.assertEqual(1, len(document.imports))
        self.assertEqual(import_value, document.imports[0])
        self.assertEqual('corpusPath', import_value.corpus_path)
        self.assertIsNone(import_value.moniker)
        self.assertEqual(document.ctx, import_value.ctx)

    # @async_test
    def test_cdm_import_collection_add_corpus_path_and_moniker(self):
        document = generate_manifest('C:\\Nothing')
        document._is_dirty = False
        import_value = document.imports.append('corpusPath', 'moniker')

        self.assertTrue(document._is_dirty)
        self.assertEqual(1, len(document.imports))
        self.assertEqual(import_value, document.imports[0])
        self.assertEqual('corpusPath', import_value.corpus_path)
        self.assertEqual('moniker', import_value.moniker)
        self.assertEqual(document.ctx, import_value.ctx)

    # @async_test
    def test_cdm_import_collection_add_range(self):
        document = generate_manifest('C:\\Nothing')
        document._is_dirty = False

        import_list = [CdmImport(document.ctx, 'CorpusPath1', 'Moniker1'), CdmImport(document.ctx, 'CorpusPath2', 'Moniker2')]
        document.imports.extend(import_list)

        self.assertTrue(document._is_dirty)
        self.assertEqual(2, len(document.imports))
        self.assertEqual(import_list[0], document.imports[0])
        self.assertEqual(import_list[1], document.imports[1])
        self.assertEqual('CorpusPath1', import_list[0].corpus_path)
        self.assertEqual('Moniker1', import_list[0].moniker)
        self.assertEqual(document.ctx, import_list[0].ctx)
        self.assertEqual('CorpusPath2', import_list[1].corpus_path)
        self.assertEqual('Moniker2', import_list[1].moniker)
        self.assertEqual(document.ctx, import_list[1].ctx)
