# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import CdmOperationType
from cdm.persistence import PersistenceLayer
from tests.common import TestHelper, async_test


class ProjectionsTest(unittest.TestCase):
    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Persistence', 'CdmFolder', 'Projection')

    @async_test
    async def test_load_projection(self):
        """Basic test to load persisted Projections based entities"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_load_projection')

        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        expected = 'TestSource'
        actual = None
        actual_type = CdmObjectType.ERROR

        # TestEntityStringReference.cdm.json
        ent_test_entity_string_reference = await corpus.fetch_object_async('local:/TestEntityStringReference.cdm.json/TestEntityStringReference', manifest)
        self.assertIsNotNone(ent_test_entity_string_reference)
        actual = ent_test_entity_string_reference.extends_entity.named_reference
        actual_type = ent_test_entity_string_reference.extends_entity.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.ENTITY_REF, actual_type)

        # TestEntityEntityReference.cdm.json
        ent_test_entity_entity_reference = await corpus.fetch_object_async('local:/TestEntityEntityReference.cdm.json/TestEntityEntityReference', manifest)
        self.assertIsNotNone(ent_test_entity_entity_reference)
        actual = ent_test_entity_entity_reference.extends_entity.named_reference
        actual_type = ent_test_entity_entity_reference.extends_entity.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.ENTITY_REF, actual_type)

        # TestEntityProjection.cdm.json
        ent_test_entity_projection = await corpus.fetch_object_async('local:/TestEntityProjection.cdm.json/TestEntityProjection', manifest)
        self.assertIsNotNone(ent_test_entity_projection)
        actual = ent_test_entity_projection.extends_entity.explicit_reference.source.named_reference
        actual_type = ent_test_entity_projection.extends_entity.explicit_reference.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.PROJECTION_DEF, actual_type)

        # TestEntityNestedProjection.cdm.json
        ent_test_entity_nested_projection = await corpus.fetch_object_async('local:/TestEntityNestedProjection.cdm.json/TestEntityNestedProjection', manifest)
        self.assertIsNotNone(ent_test_entity_nested_projection)
        actual = ent_test_entity_nested_projection.extends_entity.explicit_reference.source.explicit_reference.source.explicit_reference.source.named_reference
        actual_type = ent_test_entity_nested_projection.extends_entity.explicit_reference.source.explicit_reference.source.explicit_reference.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.PROJECTION_DEF, actual_type)

        # TestEntityAttributeStringReference.cdm.json
        ent_test_entity_attribute_string_reference = await corpus.fetch_object_async('local:/TestEntityAttributeStringReference.cdm.json/TestEntityAttributeStringReference', manifest)
        self.assertIsNotNone(ent_test_entity_attribute_string_reference)
        actual = ent_test_entity_attribute_string_reference.attributes[0].entity.named_reference
        actual_type = ent_test_entity_attribute_string_reference.attributes[0].entity.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.ENTITY_REF, actual_type)

        # TestEntityAttributeEntityReference.cdm.json
        ent_test_entity_attribute_entity_reference = await corpus.fetch_object_async('local:/TestEntityAttributeEntityReference.cdm.json/TestEntityAttributeEntityReference', manifest)
        self.assertIsNotNone(ent_test_entity_attribute_entity_reference)
        actual = ent_test_entity_attribute_entity_reference.attributes[0].entity.named_reference
        actual_type = ent_test_entity_attribute_entity_reference.attributes[0].entity.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.ENTITY_REF, actual_type)

        # TestEntityAttributeProjection.cdm.json
        ent_test_entity_attribute_projection = await corpus.fetch_object_async('local:/TestEntityAttributeProjection.cdm.json/TestEntityAttributeProjection', manifest)
        self.assertIsNotNone(ent_test_entity_attribute_projection)
        actual = ent_test_entity_attribute_projection.attributes[0].entity.explicit_reference.source.named_reference
        actual_type = ent_test_entity_attribute_projection.attributes[0].entity.explicit_reference.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.PROJECTION_DEF, actual_type)

        # TestEntityAttributeNestedProjection.cdm.json
        ent_test_entity_attribute_nested_projection = await corpus.fetch_object_async('local:/TestEntityAttributeNestedProjection.cdm.json/TestEntityAttributeNestedProjection', manifest)
        self.assertIsNotNone(ent_test_entity_attribute_nested_projection)
        actual = ent_test_entity_attribute_nested_projection.attributes[0].entity.explicit_reference.source.explicit_reference.source.explicit_reference.source.named_reference
        actual_type = ent_test_entity_attribute_nested_projection.attributes[0].entity.explicit_reference.source.explicit_reference.source.explicit_reference.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(CdmObjectType.PROJECTION_DEF, actual_type)

        # TestOperationCollection.cdm.json
        ent_test_operation_collection = await corpus.fetch_object_async('local:/TestOperationCollection.cdm.json/TestOperationCollection', manifest)
        self.assertIsNotNone(ent_test_operation_collection)
        actual_operation_count = len(ent_test_operation_collection.extends_entity.explicit_reference.operations)
        self.assertEqual(9, actual_operation_count)
        operations = ent_test_operation_collection.extends_entity.explicit_reference.operations
        self.assertEqual(CdmOperationType.ADD_COUNT_ATTRIBUTE, operations[0].type)
        self.assertEqual(CdmOperationType.ADD_SUPPORTING_ATTRIBUTE, operations[1].type)
        self.assertEqual(CdmOperationType.ADD_TYPE_ATTRIBUTE, operations[2].type)
        self.assertEqual(CdmOperationType.EXCLUDE_ATTRIBUTES, operations[3].type)
        self.assertEqual(CdmOperationType.ARRAY_EXPANSION, operations[4].type)
        self.assertEqual(CdmOperationType.COMBINE_ATTRIBUTES, operations[5].type)
        self.assertEqual(CdmOperationType.RENAME_ATTRIBUTES, operations[6].type)
        self.assertEqual(CdmOperationType.REPLACE_AS_FOREIGN_KEY, operations[7].type)
        self.assertEqual(CdmOperationType.INCLUDE_ATTRIBUTES, operations[8].type)

        # TestEntityTrait.cdm.json
        ent_test_entity_trait = await corpus.fetch_object_async('local:/TestEntityTrait.cdm.json/TestEntityTrait', manifest)
        self.assertIsNotNone(ent_test_entity_trait)
        self.assertEqual('TestAttribute', ent_test_entity_trait.attributes[0].name)
        self.assertEqual('testDataType', ent_test_entity_trait.attributes[0].data_type.named_reference)

        # TestEntityExtendsTrait.cdm.json
        ent_test_entity_extends_trait = await corpus.fetch_object_async('local:/TestEntityExtendsTrait.cdm.json/TestEntityExtendsTrait', manifest)
        self.assertIsNotNone(ent_test_entity_extends_trait)
        self.assertEqual('TestExtendsTraitAttribute', ent_test_entity_extends_trait.attributes[0].name)
        self.assertEqual('testDerivedDataType', ent_test_entity_extends_trait.attributes[0].data_type.named_reference)

        # TestProjectionTrait.cdm.json
        ent_test_projection_trait = await corpus.fetch_object_async('local:/TestProjectionTrait.cdm.json/TestProjectionTrait', manifest)
        self.assertIsNotNone(ent_test_projection_trait)
        self.assertEqual('TestProjectionAttribute', ent_test_projection_trait.attributes[0].name)
        self.assertEqual('testDataType', ent_test_projection_trait.attributes[0].data_type.named_reference)

        # TestProjectionExtendsTrait.cdm.json
        ent_test_projection_extends_trait = await corpus.fetch_object_async('local:/TestProjectionExtendsTrait.cdm.json/TestProjectionExtendsTrait', manifest)
        self.assertIsNotNone(ent_test_projection_extends_trait)
        self.assertEqual('TestProjectionAttributeB', ent_test_projection_extends_trait.attributes[0].name)
        self.assertEqual('testExtendsDataTypeB', ent_test_projection_extends_trait.attributes[0].data_type.named_reference)

    @async_test
    async def test_save_projection(self):
        """Basic test to save persisted Projections based entities"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_save_projection')  # type CdmCorpusDefinition

        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')  # type CdmManifestDefinition

        entity_sales = await corpus.fetch_object_async('local:/Sales.cdm.json/Sales', manifest)  # type CdmEntityDefinition
        self.assertIsNotNone(entity_sales)

        actual_root = corpus.storage.fetch_root_folder("output")  # type CdmFolderDefinition
        self.assertIsNotNone(actual_root)

        actual_root._documents.append(entity_sales.in_document, 'Persisted_Sales.cdm.json')
        await actual_root._documents.__getitem__(0).save_as_async('output:/Persisted_Sales.cdm.json')

        entity_actual = await corpus.fetch_object_async('output:/Persisted_Sales.cdm.json/Sales', manifest)  # type CdmEntityDefinition
        self.assertIsNotNone(entity_actual)

        entity_content_actual = PersistenceLayer.to_data(entity_actual, None, None, 'CdmFolder')  # type Entity
        self.assertIsNotNone(entity_content_actual)
        self.assertIsNotNone(entity_content_actual.hasAttributes)
        self.assertTrue(len(entity_content_actual.hasAttributes) == 1)
        self.assertFalse('"entityReference"' in str(entity_content_actual.hasAttributes[0]))
