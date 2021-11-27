﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
from tests.common import async_test
from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmAttributeContext, CdmFolderDefinition, CdmTraitDefinition, CdmDocumentDefinition
from .cdm_collection_helper_functions import generate_manifest


class CdmDocumentCollectionTests(unittest.TestCase):
    @async_test
    def test_document_collection_add(self):
        manifest = generate_manifest('C:\\Root\\Path')
        folder = CdmFolderDefinition(manifest.ctx, 'Folder')
        folder._corpus = manifest.ctx.corpus
        folder._folder_path = 'FolderPath/'
        folder._namespace = 'Namespace'
        document = CdmDocumentDefinition(manifest.ctx, 'DocumentName')

        self.assertEqual(0, len(folder.documents))
        added_document = folder.documents.append(document)
        self.assertEqual(1, len(folder.documents))
        self.assertEqual(document, folder.documents[0])
        self.assertEqual(document, added_document)
        self.assertEqual('FolderPath/', document._folder_path)
        self.assertEqual(folder, document.owner)
        self.assertEqual('Namespace', document._namespace)
        self.assertTrue(document._needs_indexing)

    @async_test
    def test_document_collection_insert(self):
        manifest = generate_manifest('C:\\Root\\Path')
        folder = CdmFolderDefinition(manifest.ctx, 'Folder')
        folder.in_document = manifest
        folder._corpus = manifest.ctx.corpus
        folder._folder_path = 'FolderPath/'
        folder._namespace = 'Namespace'
        document = CdmDocumentDefinition(manifest.ctx, 'DocumentName')

        doc1 = folder.documents.append('doc1')
        doc2 = folder.documents.append('doc2')

        manifest._is_dirty = False

        folder.documents.insert(2, document)
        self.assertTrue(manifest._is_dirty)
        self.assertEqual(3, len(folder.documents))
        self.assertEqual(doc1, folder.documents[0])
        self.assertEqual(doc2, folder.documents[1])
        self.assertEqual(document, folder.documents[2])

        self.assertEqual('FolderPath/', document._folder_path)
        self.assertEqual(folder, document.owner)
        self.assertEqual('Namespace', document._namespace)
        self.assertTrue(document._needs_indexing)
        self.assertEqual(folder, document.owner)
        self.assertTrue(document.name in folder._document_lookup)
        self.assertTrue(manifest.ctx.corpus._document_library._contains((folder, document)))

    @async_test
    def test_document_collection_add_with_document_name(self):
        manifest = generate_manifest('C:\\Root\\Path')
        folder = CdmFolderDefinition(manifest.ctx, 'Folder')
        folder._corpus = manifest.ctx.corpus
        folder._folder_path = 'FolderPath/'
        folder._namespace = 'Namespace'

        self.assertEqual(0, len(folder.documents))
        document = folder.documents.append('DocumentName')
        self.assertEqual(1, len(folder.documents))

        self.assertEqual('DocumentName', document.name)
        self.assertEqual(document, folder.documents[0])
        self.assertEqual('FolderPath/', document._folder_path)
        self.assertEqual(folder, document.owner)
        self.assertEqual('Namespace', document._namespace)
        self.assertTrue(document._needs_indexing)

    @async_test
    def test_document_collection_add_range(self):
        manifest = generate_manifest('C:\\Root\\Path')
        folder = CdmFolderDefinition(manifest.ctx, 'Folder')
        folder._corpus = manifest.ctx.corpus
        folder._folder_path = 'FolderPath/'
        folder._namespace = 'Namespace'

        self.assertEqual(0, len(folder.documents))

        document = CdmDocumentDefinition(manifest.ctx, 'DocumentName')
        document2 = CdmDocumentDefinition(manifest.ctx, 'DocumentName2')

        documentList = [document, document2]
        folder.documents.extend(documentList)
        self.assertEqual(2, len(folder.documents))
        self.assertEqual(document, folder.documents[0])
        self.assertEqual(document2, folder.documents[1])

        self.assertEqual('DocumentName', document.name)
        self.assertEqual('FolderPath/', document._folder_path)
        self.assertEqual(folder, document.owner)
        self.assertEqual('Namespace', document._namespace)
        self.assertTrue(document._needs_indexing)

        self.assertEqual('DocumentName2', document2.name)
        self.assertEqual('FolderPath/', document2._folder_path)
        self.assertEqual(folder, document2.owner)
        self.assertEqual('Namespace', document2._namespace)
        self.assertTrue(document2._needs_indexing)

    @async_test
    def test_document_collection_remove(self):
        manifest = generate_manifest('C:\\Root\\Path')
        folder = CdmFolderDefinition(manifest.ctx, 'Folder')
        folder._corpus = manifest.ctx.corpus
        folder._folder_path = 'FolderPath/'
        folder._namespace = 'Namespace'

        self.assertEqual(0, len(folder.documents))

        document = CdmDocumentDefinition(manifest.ctx, 'DocumentName')
        document2 = CdmDocumentDefinition(manifest.ctx, 'DocumentName2')

        documentList = [document, document2]
        folder.documents.extend(documentList)
        self.assertEqual(2, len(folder.documents))
        self.assertEqual(document, folder.documents[0])
        self.assertEqual(document2, folder.documents[1])
        self.assertEqual(folder, document.owner)

        folder.documents.remove(document)
        self.assertFalse(document in folder.documents)
        self.assertEqual(1, len(folder.documents))
        self.assertEqual(document2, folder.documents[0])
        self.assertEqual(None, document.owner)

        folder.documents.remove(document)
        self.assertEqual(1, len(folder.documents))
        self.assertEqual(document2, folder.documents[0])

        folder.documents.append(document)
        self.assertEqual(2, len(folder.documents))
        self.assertEqual(folder, document.owner)
        folder.documents.remove(document.name)
        self.assertEqual(1, len(folder.documents))
        self.assertEqual(document2, folder.documents[0])
        self.assertEqual(None, document.owner)

    @async_test
    def test_document_collection_remove_at(self):
        manifest = generate_manifest('C:\\Root\\Path')
        folder = CdmFolderDefinition(manifest.ctx, 'Folder')
        folder._corpus = manifest.ctx.corpus
        folder._folder_path = 'FolderPath/'
        folder._namespace = 'Namespace'

        self.assertEqual(0, len(folder.documents))

        document = folder.documents.append('DocumentName')
        document2 = folder.documents.append('DocumentName2')
        document3 = folder.documents.append('DocumentName3')

        self.assertEqual(3, len(manifest.ctx.corpus._document_library._list_all_documents()))
        self.assertTrue(manifest.ctx.corpus._document_library._contains((folder, document)))
        self.assertTrue(manifest.ctx.corpus._document_library._contains((folder, document2)))
        self.assertTrue(manifest.ctx.corpus._document_library._contains((folder, document3)))

        self.assertEqual(3, len(folder._document_lookup))
        self.assertTrue((document.name) in folder._document_lookup)
        self.assertTrue((document.name) in folder._document_lookup)
        self.assertTrue((document.name) in folder._document_lookup)

        folder.documents.pop(1)
        folder.documents.remove('DocumentName')
        folder.documents.remove(document3)

        self.assertEqual(0, len(manifest.ctx.corpus._document_library._list_all_documents()))
        self.assertFalse(manifest.ctx.corpus._document_library._contains((folder, document)))
        self.assertFalse(manifest.ctx.corpus._document_library._contains((folder, document2)))
        self.assertFalse(manifest.ctx.corpus._document_library._contains((folder, document3)))

        self.assertEqual(0, len(folder._document_lookup))
        self.assertFalse((document.name) in folder._document_lookup)
        self.assertFalse((document.name) in folder._document_lookup)
        self.assertFalse((document.name) in folder._document_lookup)

    @async_test
    def test_document_collection_clear(self):
        manifest = generate_manifest('C:\\Root\\Path')
        folder = CdmFolderDefinition(manifest.ctx, 'Folder')
        folder._corpus = manifest.ctx.corpus
        folder._folder_path = 'FolderPath/'
        folder._namespace = 'Namespace'

        self.assertEqual(0, len(folder.documents))

        folder.documents.append('DocumentName')
        folder.documents.append('DocumentName2')
        folder.documents.append('DocumentName3')

        folder.documents.clear()

        self.assertEqual(0, len(folder._document_lookup))
        self.assertEqual(0, len(manifest.ctx.corpus._document_library._list_all_documents()))
        self.assertEqual(0, len(folder.documents))
