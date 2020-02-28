# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
from tests.common import async_test
from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmAttributeContext, CdmFolderDefinition, CdmTraitDefinition
from .cdm_collection_helper_functions import generate_manifest


class CdmDefinitionCollectionTest(unittest.TestCase):
    @async_test
    def test_cdm_definition_collection_add(self):
        document = generate_manifest('C:\\Nothing')
        document._is_dirty = False

        attribute = CdmAttributeContext(document.ctx, 'the attribute')
        folder = CdmFolderDefinition(document.ctx, 'The folder')
        trait = CdmTraitDefinition(document.ctx, 'The trait')

        added_attribute = document.definitions.append(attribute)
        added_folder = document.definitions.append(folder)
        added_trait = document.definitions.append(trait)

        self.assertTrue(document._is_dirty)
        self.assertEqual(3, len(document.definitions))
        self.assertEqual(attribute, added_attribute)
        self.assertEqual(folder, added_folder)
        self.assertEqual(trait, added_trait)
        self.assertEqual(attribute, document.definitions[0])
        self.assertEqual(folder, document.definitions[1])
        self.assertEqual(trait, document.definitions[2])
        self.assertEqual(document, attribute.in_document)
        self.assertEqual(document, trait.in_document)
        self.assertEqual(document, attribute.owner)
        self.assertEqual(document, folder.owner)
        self.assertEqual(document, trait.owner)

    @async_test
    def test_cdm_definition_collection_insert(self):
        document = generate_manifest('C:\\Nothing')

        ent1 = document.definitions.append('ent1')
        ent2 = document.definitions.append('ent2')

        document._is_dirty = False

        attribute = CdmAttributeContext(document.ctx, 'the attribute')

        document.definitions.insert(0, attribute)

        self.assertEqual(3, len(document.definitions))
        self.assertTrue(document._is_dirty)
        self.assertEqual(attribute, document.definitions[0])
        self.assertEqual(document, attribute.in_document)
        self.assertEqual(document, attribute.owner)
        self.assertEqual(ent1, document.definitions[1])
        self.assertEqual(ent2, document.definitions[2])

    @async_test
    def test_cdm_definition_collection_add_entity_by_providing_name(self):
        document = generate_manifest('C:\\Nothing')

        document._is_dirty = False
        entity = document.definitions.append('theNameOfTheEntity')
        self.assertTrue(document._is_dirty)
        self.assertEqual(entity, document.definitions[0])
        self.assertEqual(document, entity.in_document)
        self.assertEqual(document, entity.owner)
        self.assertEqual('theNameOfTheEntity', entity.entity_name)

    @async_test
    def test_cdm_definition_collection_add_by_providing_type_and_name(self):
        document = generate_manifest('C:\\Nothing')
        document._is_dirty = False

        attribute = document.definitions.append('Name of attribute', CdmObjectType.ATTRIBUTE_CONTEXT_DEF)
        trait = document.definitions.append('Name of trait', CdmObjectType.TRAIT_DEF)

        self.assertTrue(document._is_dirty)
        self.assertEqual(attribute, document.definitions[0])
        self.assertEqual(trait, document.definitions[1])
        self.assertEqual(document, attribute.in_document)
        self.assertEqual(document, attribute.owner)
        self.assertEqual(document, trait.in_document)
        self.assertEqual(document, trait.owner)

    @async_test
    def test_cdm_definition_collection_add_range(self):
        document = generate_manifest('C:\\Nothing')
        document._is_dirty = False

        attribute = CdmAttributeContext(document.ctx, 'the attribute')
        folder = CdmFolderDefinition(document.ctx, 'The folder')
        trait = CdmTraitDefinition(document.ctx, 'The trait')

        definitionsList = [attribute, folder, trait]
        document.definitions.extend(definitionsList)

        self.assertTrue(document._is_dirty)
        self.assertEqual(3, len(document.definitions))
        self.assertEqual(attribute, document.definitions[0])
        self.assertEqual(folder, document.definitions[1])
        self.assertEqual(trait, document.definitions[2])
        self.assertEqual(document, attribute.in_document)
        self.assertEqual(document, trait.in_document)
        self.assertEqual(document, attribute.owner)
        self.assertEqual(document, folder.owner)
        self.assertEqual(document, trait.owner)
