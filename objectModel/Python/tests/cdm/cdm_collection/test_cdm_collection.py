# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
from tests.common import async_test
from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmAttributeContext, CdmCorpusDefinition, CdmDocumentDefinition, CdmEntityDefinition, CdmEntityReference
from cdm.storage import LocalAdapter
from cdm.objectmodel.cdm_collection import CdmCollection
from .cdm_collection_helper_functions import generate_manifest, create_document_for_entity


class CdmCollectionTests(unittest.TestCase):
    @async_test
    def test_cdm_collection_append_method(self):
        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'
        cdm_corpus.storage.mount('local', LocalAdapter('CdmCorpus/LocalPath'))

        ctx = cdm_corpus.ctx

        cdm_document = CdmDocumentDefinition(ctx, 'NameOfDocument')
        collection = CdmCollection(ctx, cdm_document, CdmObjectType.ATTRIBUTE_CONTEXT_DEF)

        appended_attribute_context = collection.append('nameOfNewAttribute')
        self.assertEqual(1, len(collection))
        self.assertEqual('nameOfNewAttribute', collection[0].name)
        self.assertEqual(cdm_document, collection[0].owner)
        self.assertEqual(ctx, collection[0].ctx)

        self.assertEqual(collection[0], appended_attribute_context)

        attribute_context = CdmAttributeContext(ctx, 'NameOfAttributeContext')
        appended_attribute = collection.append(attribute_context)
        self.assertEqual(2, len(collection))
        self.assertEqual(attribute_context, appended_attribute)
        self.assertEqual(attribute_context, collection[1])
        self.assertEqual(cdm_document, attribute_context.owner)

    def test_cdm_collection_remove_method(self):
        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'
        cdm_corpus.storage.mount('local', LocalAdapter('CdmCorpus/LocalPath'))

        ctx = cdm_corpus.ctx

        cdm_document = CdmDocumentDefinition(ctx, 'NameOfDocument')
        collection = CdmCollection(ctx, cdm_document, CdmObjectType.ATTRIBUTE_CONTEXT_DEF)

        appended_document = collection.append('nameOfNewDocument')
        collection.append('otherDocument')

        self.assertEqual(2, len(collection))

        collection.remove(appended_document)
        self.assertTrue(appended_document not in collection)

        # try to remove a second time.
        collection.remove(appended_document)
        self.assertTrue(appended_document not in collection)
        self.assertEqual(1, len(collection))

    def test_cdm_collection_remove_at(self):
        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'
        cdm_corpus.storage.mount('local', LocalAdapter('CdmCorpus/LocalPath'))

        ctx = cdm_corpus.ctx

        cdm_document = CdmDocumentDefinition(ctx, 'NameOfDocument')
        collection = CdmCollection(ctx, cdm_document, CdmObjectType.ATTRIBUTE_CONTEXT_DEF)

        collection.append('nameOfNewDocument')
        appended_document2 = collection.append('otherDocument')

        self.assertEqual(2, len(collection))

        collection.pop(0)
        self.assertEqual(1, len(collection))
        self.assertEqual(appended_document2, collection[0])
        collection.pop(1)
        self.assertEqual(1, len(collection))
        self.assertEqual(appended_document2, collection[0])
        collection.pop(0)
        self.assertEqual(0, len(collection))

    def test_cdm_collection_appending_list(self):
        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'
        cdm_corpus.storage.mount('local', LocalAdapter('CdmCorpus/LocalPath'))

        ctx = cdm_corpus.ctx

        cdm_document = CdmDocumentDefinition(ctx, 'NameOfDocument')
        collection = CdmCollection(ctx, cdm_document, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF)

        entity_list = []

        for i in range(0, 2):
            entity = CdmEntityDefinition(cdm_corpus.ctx, 'entityName_{}'.format(i), None)
            create_document_for_entity(cdm_corpus, entity)

            entity_declaration = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF,
                                                        entity.entity_name, False)  # type: CdmLocalEntityDeclarationDefinition
            entity_declaration.entity_path = '{}/{}'.format(entity.owner.at_corpus_path, entity.entity_name)
            entity_declaration.owner = entity.owner
            entity_list.append(entity_declaration)

        self.assertEqual(0, len(collection))

        collection.extend(entity_list)

        self.assertEqual(2, len(collection))

        for i in range(0, 2):
            self.assertEqual('entityName_{}'.format(i), collection[i].entity_name)

    def test_cdm_collection_change_makes_document_dirty(self):
        manifest = generate_manifest('C:\\Nothing')

        collection = CdmCollection(manifest.ctx, manifest, CdmObjectType.ENTITY_REF)

        manifest._is_dirty = False
        collection.append(CdmEntityReference(manifest.ctx, 'name', False))
        self.assertTrue(manifest._is_dirty)
        manifest._is_dirty = False
        collection.append('theName')
        self.assertTrue(manifest._is_dirty)
        entity = CdmEntityReference(manifest.ctx, 'otherEntity', False)
        entity_list = [entity]
        manifest._is_dirty = False
        collection.extend(entity_list)
        self.assertTrue(manifest._is_dirty)
        manifest._is_dirty = False
        entity2 = CdmEntityReference(manifest.ctx, 'otherEntity2', False)
        collection.insert(0, entity2)
        self.assertTrue(manifest._is_dirty)

        manifest._is_dirty = False
        collection.remove(entity)
        self.assertTrue(manifest._is_dirty)

        manifest._is_dirty = False
        collection.pop(0)
        self.assertTrue(manifest._is_dirty)

        manifest._is_dirty = False
        collection.clear()
        self.assertTrue(manifest._is_dirty)
