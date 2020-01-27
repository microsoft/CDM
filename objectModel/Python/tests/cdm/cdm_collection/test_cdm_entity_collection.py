import unittest
from tests.common import async_test
from cdm.objectmodel import CdmEntityDefinition, CdmDocumentDefinition, CdmCorpusDefinition, CdmManifestDefinition
from cdm.storage import LocalAdapter
from cdm.enums import CdmObjectType, CdmStatusLevel
from cdm.objectmodel.cdm_entity_collection import CdmEntityCollection
from .cdm_collection_helper_functions import generate_manifest, create_document_for_entity


class CdmEntityCollectionTests(unittest.TestCase):
    @async_test
    def test_manifest_add_entity_with_localized_paths(self):
        manifest = generate_manifest('C:\\Root\\Path')
        cdm_corpus = manifest.ctx.corpus

        entity = CdmEntityDefinition(cdm_corpus.ctx, 'entityName', None)
        entity.explanation = 'The explanation of the entity'

        create_document_for_entity(cdm_corpus, entity)

        cdm_entity = CdmEntityDefinition(cdm_corpus.ctx, 'cdm_entityName', None)
        create_document_for_entity(cdm_corpus, cdm_entity, 'cdm')

        localized_entity_declaration = manifest.entities.append(entity)
        cdm_entity_declaration = manifest.entities.append(cdm_entity)

        self.assertEqual('The explanation of the entity', localized_entity_declaration.explanation)
        self.assertEqual('entityName.cdm.json/entityName', localized_entity_declaration.entity_path)
        self.assertEqual('entityName', localized_entity_declaration.entity_name)
        self.assertEqual('cdm:/cdm_entityName.cdm.json/cdm_entityName', cdm_entity_declaration.entity_path)
        self.assertEqual('entityName', localized_entity_declaration.entity_name)

        self.assertEqual(2, len(manifest.entities))
        self.assertEqual(localized_entity_declaration, manifest.entities[0])
        self.assertEqual(cdm_entity_declaration, manifest.entities[1])

    @async_test
    def test_manifest_can_add_entity_declaration(self):
        manifest = generate_manifest('C:\\Root\\Path')
        entity = CdmEntityDefinition(manifest.ctx, 'entityName', None)

        create_document_for_entity(manifest.ctx.corpus, entity)

        entity_declaration = manifest.ctx.corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF,
                                                             entity.entity_name, False)  # type: CdmLocalEntityDeclarationDefinition
        entity_declaration.entity_path = '{}/{}'.format(entity.owner.at_corpus_path, entity.entity_name)

        manifest.entities.append(entity_declaration)

        self.assertEqual('local:/entityName.cdm.json/entityName', entity_declaration.entity_path)
        self.assertEqual('entityName', entity_declaration.entity_name)

        self.assertEqual(1, len(manifest.entities))
        self.assertEqual(entity_declaration, manifest.entities[0])

    @async_test
    def test_manifest_can_add_entity_definition(self):
        manifest = generate_manifest('C:\\Root\\Path')
        entity = CdmEntityDefinition(manifest.ctx, 'entityName', None)

        create_document_for_entity(manifest.ctx.corpus, entity)
        manifest.entities.append(entity)

        self.assertEqual(1, len(manifest.entities))
        self.assertEqual('entityName', manifest.entities[0].entity_name)

    def test_manifest_cannot_add_entity_definition_without_creating_document(self):
        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'
        function_was_called = False
        function_parameter1 = CdmStatusLevel.INFO
        function_parameter2 = ''

        def callback(status_level: 'CdmStatusLevel', message: str):
            nonlocal function_was_called, function_parameter1, function_parameter2
            function_was_called = True
            function_parameter1 = status_level
            function_parameter2 = message

        cdm_corpus.set_event_callback(callback)

        cdm_corpus.storage.mount('local', LocalAdapter('C:\\Root\\Path'))

        manifest = CdmManifestDefinition(cdm_corpus.ctx, 'manifest')
        manifest.folder_path = '/'
        manifest.namespace = 'local'
        entity = CdmEntityDefinition(manifest.ctx, 'entityName', None)

        manifest.entities.append(entity)
        self.assertTrue(function_was_called)
        self.assertEqual(CdmStatusLevel.ERROR, function_parameter1)
        self.assertTrue('Expected entity to have an \'Owner\' document set. Cannot create entity declaration to add to manifest.' in function_parameter2)

    @async_test
    def test_manifest_add_list_of_entity_declarations(self):
        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'
        cdm_corpus.storage.mount('local', LocalAdapter('CdmCorpus/LocalPath'))

        ctx = cdm_corpus.ctx

        cdmDocument = CdmDocumentDefinition(ctx, 'NameOfDocument')
        collection = CdmEntityCollection(ctx, cdmDocument)

        entity_list = []

        for i in range(0, 2):
            entity = CdmEntityDefinition(cdm_corpus.ctx, 'entityName_{}'.format(i), None)
            create_document_for_entity(cdm_corpus, entity)
            entity_list.append(entity)

        self.assertEqual(0, len(collection))

        collection.extend(entity_list)

        self.assertEqual(2, len(collection))

        for i in range(0, 2):
            self.assertEqual('entityName_{}'.format(i), collection[i].entity_name)

    @async_test
    def test_cdm_entity_collection_remove_entity_declaration_definition(self):
        manifest = generate_manifest('C:\\Root\\Path')
        entity = CdmEntityDefinition(manifest.ctx, 'entityName', None)
        create_document_for_entity(manifest.ctx.corpus, entity)
        other_entity = CdmEntityDefinition(manifest.ctx, 'otherEntityName', None)
        create_document_for_entity(manifest.ctx.corpus, other_entity)

        manifest.entities.append(entity)
        manifest.entities.append(other_entity)

        self.assertEqual(2, len(manifest.entities))

        manifest.entities.remove(entity)

        self.assertFalse(entity in manifest.entities)
        self.assertEqual(1, len(manifest.entities))
        self.assertEqual(other_entity.entity_name, manifest.entities[0].entity_name)

        manifest.entities.remove(entity)
        self.assertEqual(1, len(manifest.entities))
