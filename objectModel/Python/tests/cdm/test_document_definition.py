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
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_circular_import_with_moniker')  # type: CdmCorpusDefinition
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

        # doc_b and doc_c should have the hasCircularImport set to True.
        self.assertTrue(doc_b._import_priorities.has_circular_import)
        self.assertTrue(doc_c._import_priorities.has_circular_import)

    @async_test
    async def test_deeper_circular_import_with_moniker(self):
        """Test when A -> B -> C/M -> D -> C.
        In this case, although B imports C with a moniker, C should be in the A's priorityimports because it is imported by D."""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_deeper_circular_import_with_moniker')
        folder = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        doc_a = CdmDocumentDefinition(corpus.ctx, 'A.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_a)
        doc_a.imports.append('B.cdm.json')

        doc_b = CdmDocumentDefinition(corpus.ctx, 'B.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_b)
        doc_b.imports.append('C.cdm.json', 'moniker')

        doc_c = CdmDocumentDefinition(corpus.ctx, 'C.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_c)
        doc_c.imports.append('D.cdm.json')

        doc_d = CdmDocumentDefinition(corpus.ctx, 'D.cdm.json')  # type: CdmDocumentDefinition
        folder.documents.append(doc_d)
        doc_d.imports.append('C.cdm.json')

        # _index_if_needed will internally call prioritizeimports on every document.
        await doc_b._index_if_needed(ResolveOptions(), True)
        await doc_a._index_if_needed(ResolveOptions(), True)

        self.assertEqual(4, len(doc_a._import_priorities.import_priority))
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_a], 0, False)
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_b], 1, False)
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_d], 2, False)
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_c], 3, False)

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
    async def test_reading_cached_import_priority(self):
        """Test when A -> B -> C/M -> D.
        Index doc_b first then doc_a. Make sure that C does not appear in doc_a priority list."""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_reading_cached_import_priority')
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

        # index doc_b first and check its import priorities.
        await doc_b._index_if_needed(ResolveOptions(), True)

        self.assertEqual(3, len(doc_b._import_priorities.import_priority))
        self._assertImportInfo(doc_b._import_priorities.import_priority[doc_b], 0, False)
        self._assertImportInfo(doc_b._import_priorities.import_priority[doc_d], 1, False)
        self._assertImportInfo(doc_b._import_priorities.import_priority[doc_c], 2, True)

        # now index doc_a, which should read doc_b's priority list from the cache.
        await doc_a._index_if_needed(ResolveOptions(), True)
        self.assertEqual(3, len(doc_a._import_priorities.import_priority))
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_a], 0, False)
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_b], 1, False)
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_d], 2, False)

    @async_test
    async def test_monikered_import_is_added_to_end(self):
        """Test if monikered imports are added to the end of the priority list.
        A -> B/M -> C"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_monikered_import_is_added_to_end')
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

        # should contain all three documents.
        self.assertEqual(3, len(doc_a._import_priorities.import_priority))
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_a], 0, False)
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_c], 1, False)
        # doc_b is monikered so it should appear at the end of the list.
        self._assertImportInfo(doc_a._import_priorities.import_priority[doc_b], 2, True)

        # make sure that the has circular import is set to False.
        self.assertFalse(doc_a._import_priorities.has_circular_import)
        self.assertFalse(doc_b._import_priorities.has_circular_import)
        self.assertFalse(doc_c._import_priorities.has_circular_import)

    @async_test
    async def test_document_forcereload(self):
        test_name = 'test_document_force_reload'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        # load the document and entity the first time
        await corpus.fetch_object_async('doc.cdm.json/entity')
        # reload the same doc and make sure it is reloaded correctly
        reloadedEntity = await corpus.fetch_object_async('doc.cdm.json/entity', None, None, True)  # type: CdmEntityDefinition

        # if the reloaded doc is not indexed correctly, the entity will not be able to be found
        self.assertIsNotNone(reloadedEntity)

    @async_test
    async def test_document_version_set_on_resolution(self):
        """Tests if the document_version is set on the resolved document"""
        test_name = "test_document_version_set_on_resolution"
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')  # type: CdmManifestDefinition
        document = await corpus.fetch_object_async('local:/Person.cdm.json')  # type: CdmDocumentDefinition

        self.assertEqual('2.1.3', manifest.document_version)
        self.assertEqual('1.5', document.document_version)

        res_manifest = await manifest.create_resolved_manifest_async('res-{}'.format(manifest.name), None)  # type: CdmManifestDefinition
        res_entity = await corpus.fetch_object_async(res_manifest.entities[0].entity_path, res_manifest)  # type: CdmEntityDefinition
        res_document = res_entity.in_document

        self.assertEqual('2.1.3', res_manifest.document_version)
        self.assertEqual('1.5', res_document.document_version)

    def _mark_documents_to_index(self, documents: CdmDocumentCollection):
        """Sets the document's is_dirty flag to True and reset the import_priority."""
        for document in documents:
            document._needs_indexing = True
            document._import_priorities = None

    def _assertImportInfo(self, import_info: 'ImportInfo', expected_priority: int, expected_is_moniker: bool):
        """Helper function to assert the ImportInfo class."""
        self.assertEqual(expected_priority, import_info.priority)
        self.assertEqual(expected_is_moniker, import_info.is_moniker)

