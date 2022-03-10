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

        import_list = [CdmImport(document.ctx, 'CorpusPath1', 'Moniker1'),
                       CdmImport(document.ctx, 'CorpusPath2', 'Moniker2'),
                       CdmImport(document.ctx, 'CorpusPath3', None)]
        document.imports.extend(import_list)

        self.assertTrue(document._is_dirty)
        self.assertEqual(3, len(document.imports))
        self.assertEqual(import_list[0], document.imports[0])
        self.assertEqual(import_list[1], document.imports[1])
        self.assertEqual('CorpusPath1', document.imports[0].corpus_path)
        self.assertEqual('Moniker1', document.imports.item('CorpusPath1', 'Moniker1').moniker)
        self.assertEqual(document.ctx, document.imports.item('CorpusPath1', 'Moniker1').ctx)
        self.assertEqual('CorpusPath2', document.imports[1].corpus_path)
        self.assertIsNone(document.imports.item('CorpusPath2'))
        self.assertIsNotNone(document.imports.item('CorpusPath2', None, False))
        self.assertIsNone(document.imports.item('CorpusPath2', None, True))
        self.assertIsNotNone(document.imports.item('CorpusPath2', 'Moniker2', True))
        self.assertIsNotNone(document.imports.item('CorpusPath2', 'Moniker3', False))
        self.assertEqual('Moniker2', document.imports.item('CorpusPath2', 'Moniker2').moniker)
        self.assertEqual(document.ctx, document.imports.item('CorpusPath2', 'Moniker2').ctx)
        self.assertEqual(import_list[2], document.imports.item('CorpusPath3'))

