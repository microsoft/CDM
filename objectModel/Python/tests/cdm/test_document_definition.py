# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
import os

from cdm.objectmodel import CdmCorpusDefinition, CdmDocumentCollection, CdmDocumentDefinition, CdmFolderDefinition
from cdm.utilities import ResolveOptions

from tests.common import async_test, TestHelper


class DocumentDefinitionTests(unittest.TestCase):
    """Tests for the CdmDocumentDefinition class."""
    tests_subpath = os.path.join('Cdm', 'Document')

    @async_test
    async def test_circular_import_with_moniker(self):
        """Test when A -> M/B -> C -> B.
        In this case, although A imports B with a moniker, B should be in the priorityimports because it is imported by C."""        
        corpus = TestHelper.get_local_corpus('', '')  # type: CdmCorpusDefinition
        folder = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        doc_a = CdmDocumentDefinition(corpus.ctx, 'A.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_a)
        doc_a.imports.append('B.cdm.json', "moniker")

        doc_b = CdmDocumentDefinition(corpus.ctx, 'B.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_b)
        doc_b.imports.append('C.cdm.json')

        doc_c = CdmDocumentDefinition(corpus.ctx, 'C.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_c)
        doc_c.imports.append('B.cdm.json')

        # forces doc_b to be indexed first.
        await doc_b._index_if_needed(ResolveOptions(), True)
        await doc_a._index_if_needed(ResolveOptions(), True)

        # should contain A, B and C.
        self.assertEqual(3, len(doc_a._import_priorities.import_priority))

        self.assertFalse(doc_a._import_priorities.has_circular_import)

        # doc_b and doc_c should have the hasCircularImport set to true.
        self.assertTrue(doc_b._import_priorities.has_circular_import)
        self.assertTrue(doc_c._import_priorities.has_circular_import)

    @async_test
    async def test_deeper_circular_import_with_moniker(self):
        """Test when A -> B -> C/M -> D -> C.
        In this case, although B imports C with a moniker, C should be in the A's priorityimports because it is imported by D."""
        corpus = TestHelper.get_local_corpus('', '')
        folder = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        doc_a = CdmDocumentDefinition(corpus.ctx, 'A.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_a)
        doc_a.imports.append('B.cdm.json')

        doc_b = CdmDocumentDefinition(corpus.ctx, 'B.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_b)
        doc_b.imports.append('C.cdm.json', "moniker")

        doc_c = CdmDocumentDefinition(corpus.ctx, 'C.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_c)
        doc_c.imports.append('D.cdm.json')

        doc_d = CdmDocumentDefinition(corpus.ctx, 'D.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_d)
        doc_d.imports.append('C.cdm.json')

        # _index_if_needed will internally call prioritizeimports on every document.
        await doc_a._index_if_needed(ResolveOptions(), True)

        self.assertEqual(4, len(doc_a._import_priorities.import_priority))

        #  reset the _imports_priorities.
        self._mark_documents_to_index(folder.documents)

        # forces doc_c to be indexed first, so the priorityList will be read from the cache this time.
        await doc_c._index_if_needed(ResolveOptions(), True)
        await doc_a._index_if_needed(ResolveOptions(), True)

        self.assertEqual(4, len(doc_a._import_priorities.import_priority))

        # indexes the rest of the documents.
        await doc_b._index_if_needed(ResolveOptions(), True)
        await doc_d._index_if_needed(ResolveOptions(), True)

        self.assertFalse(doc_a._import_priorities.has_circular_import)
        self.assertFalse(doc_b._import_priorities.has_circular_import)
        self.assertTrue(doc_c._import_priorities.has_circular_import)
        self.assertTrue(doc_d._import_priorities.has_circular_import)

    @async_test
    async def test_monikered_import_is_not_added(self):
        """Test if monikered imports are not being added to the priority_list.
        A -> B/M -> C"""
        corpus = TestHelper.get_local_corpus('', '')
        folder = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        doc_a = CdmDocumentDefinition(corpus.ctx, 'A.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_a)
        doc_a.imports.append('B.cdm.json', "moniker")

        doc_b = CdmDocumentDefinition(corpus.ctx, 'B.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_b)
        doc_b.imports.append('C.cdm.json')

        doc_c = CdmDocumentDefinition(corpus.ctx, 'C.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_c)

        # forces doc_b to be indexed first, so the priority_list will be read from the cache this time.
        await doc_b._index_if_needed(ResolveOptions(), True)
        await doc_a._index_if_needed(ResolveOptions(), True)

        # should only contain doc_a and doc_c, doc_b should be excluded.
        self.assertEqual(2, len(doc_a._import_priorities.import_priority))

        self.assertFalse(doc_a._import_priorities.has_circular_import)
        self.assertFalse(doc_b._import_priorities.has_circular_import)
        self.assertFalse(doc_c._import_priorities.has_circular_import)

    @async_test
    async def test_document_forcereload(self):
        testName = 'testDocumentForceReload'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, testName)  # type: CdmCorpusDefinition

        # load the document and entity the first time
        await corpus.fetch_object_async('doc.cdm.json/entity')
        # reload the same doc and make sure it is reloaded correctly
        reloadedEntity = await corpus.fetch_object_async('doc.cdm.json/entity', None, None, True)  # type: CdmEntityDefinition

        # if the reloaded doc is not indexed correctly, the entity will not be able to be found
        self.assertIsNotNone(reloadedEntity)

    def _mark_documents_to_index(self, documents: CdmDocumentCollection):
        """Sets the document's is_dirty flag to true and reset the import_priority."""
        for document in documents:
            document._needs_indexing = True
            document._import_priorities = None

