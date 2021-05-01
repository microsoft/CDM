# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmEntityAttributeDefinition, CdmEntityDefinition, CdmEntityReference, CdmProjection, CdmTypeAttributeDefinition
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionMiscellaneousTest(unittest.TestCase):
    """Various projections scenarios, partner scenarios, bug fixes"""

    foundation_json_path = 'cdm:/foundations.cdm.json'

    res_opts_combinations = [
        set([]),
        set(['referenceOnly']),
        set(['normalized']),
        set(['structured']),
        set(['referenceOnly', 'normalized']),
        set(['referenceOnly', 'structured']),
        set(['normalized', 'structured']),
        set(['referenceOnly', 'normalized', 'structured'])
    ]

    # The path between TestDataPath and Test_name.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionMiscellaneous')

    @async_test
    async def test_invalid_operation_type(self):
        """
        Test case scenario for Bug #24 from the projections internal bug bash
        Reference Link: https:#commondatamodel.visualstudio.com/CDM/_workitems/edit/24
        """
        test_name = 'test_invalid_operation_type'

        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        def callback(level, message):
            if 'ProjectionPersistence | Invalid operation type \'replaceAsForeignKey11111\'. | from_data' not in message:
                self.fail(message)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('default.manifest.cdm.json')

        # Raise error: 'ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'.| from_data',
        # when attempting to load a projection with an invalid operation
        entity_name = 'SalesNestedFK'
        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(entity)

    @async_test
    async def test_zero_minimum_cardinality(self):
        """
        Test case scenario for Bug #23 from the projections internal bug bash
        Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/23
        """
        test_name = "test_zero_minimum_cardinality"

        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        def callback(level, message):
            self.fail(message)

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # Create Local Root Folder
        local_root = corpus.storage.fetch_root_folder('local')

        # Create Manifest
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'default')
        local_root.documents.append(manifest, 'default.manifest.cdm.json')

        entity_name = 'TestEntity'

        # Create Entity
        entity = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)
        entity.extends_entity = corpus.make_ref(CdmObjectType.ENTITY_REF, 'CdmEntity', True)

        # Create Entity Document
        document = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        document.definitions.append(entity)
        local_root.documents.append(document, document.name)
        manifest.entities.append(entity)

        attribute_name = 'testAttribute'
        attribute_data_type = 'string'
        attribute_purpose = 'hasA'

        # Create Type Attribute
        attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attribute_name, False)
        foo = attribute.is_nullable
        attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, attribute_data_type, True)
        attribute.purpose = corpus.make_ref(CdmObjectType.PURPOSE_REF, attribute_purpose, True)
        attribute.display_name = attribute_name

        if entity:
            entity.attributes.append(attribute)

        attribute.cardinality = CardinalitySettings(attribute)
        attribute.cardinality.minimum = '0'
        attribute.cardinality.maximum = '*'

        self.assertTrue(attribute.is_nullable)

    @async_test
    async def test_circular_entity_attributes(self):
        """Tests if it resolves correct when there are two entity attributes in circular denpendency using projection"""
        
        test_name = 'test_circular_entity_attributes'
        entity_name = 'A'

        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        entity = await corpus.fetch_object_async('{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition

        res_entity = await entity.create_resolved_entity_async('resolved-{}'.format(entity_name))  # type: CdmEntityDefinition

        self.assertIsNotNone(res_entity)
        self.assertEqual(2, len(res_entity.attributes))

    def test_entity_attribute_source(self):
        """Tests if not setting the projection "source" on an entity attribute triggers an error log"""

        corpus = CdmCorpusDefinition()
        error_count = 0
        def callback(level: 'CdmStatusLevel', message: str):
            nonlocal error_count
            error_count += 1

        corpus.set_event_callback(callback, CdmStatusLevel.ERROR)
        projection = CdmProjection(corpus.ctx)
        entity_attribute = CdmEntityAttributeDefinition(corpus.ctx, 'attribute')
        entity_attribute.entity = CdmEntityReference(corpus.ctx, projection, False)

        # First case, a projection without source.
        projection.validate()
        self.assertEqual(1, error_count)
        error_count = 0

        # Second case, a projection with a nested projection.
        inner_projection = CdmProjection(corpus.ctx)
        projection.source = CdmEntityReference(corpus.ctx, inner_projection, False)
        projection.validate()
        inner_projection.validate()
        self.assertEqual(1, error_count)
        error_count = 0

        # Third case, a projection with an explicit entity definition.
        inner_projection.source = CdmEntityReference(corpus.ctx, CdmEntityDefinition(corpus.ctx, 'Entity'), False)
        projection.validate()
        inner_projection.validate()
        self.assertEqual(0, error_count)

        # Third case, a projection with a named reference.
        inner_projection.source = CdmEntityReference(corpus.ctx, 'Entity', False)
        projection.validate()
        inner_projection.validate()
        self.assertEqual(0, error_count)

    @async_test
    async def test_max_depth_on_polymorphic_entity(self):
        """Tests resolution of an entity when maximum depth is reached while resolving a polymorphic entity"""
        test_name = 'test_max_depth_on_polymorphic_entity'
        entity_name = 'A'

        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        entity = await corpus.fetch_object_async('{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition

        res_opt = ResolveOptions(entity)
        res_opt.max_depth = 1
        res_entity = await entity.create_resolved_entity_async('resolved-{}'.format(entity_name), res_opt)  # type: CdmEntityDefinition

        self.assertIsNotNone(res_entity)
        self.assertEqual(4, len(res_entity.attributes))

    def test_type_attribute_source(self):
        """Tests if setting the projection "source" on a type attribute triggers an error log"""

        corpus = CdmCorpusDefinition()
        error_count = 0
        def callback(level: 'CdmStatusLevel', message: str):
            nonlocal error_count
            error_count += 1

        corpus.set_event_callback(callback, CdmStatusLevel.ERROR)
        projection = CdmProjection(corpus.ctx)
        type_attribute = CdmTypeAttributeDefinition(corpus.ctx, 'attribute')
        type_attribute.projection = projection

        # First case, a projection without source.
        projection.validate()
        self.assertEqual(0, error_count)

        # Second case, a projection with a nested projection.
        inner_projection = CdmProjection(corpus.ctx)
        projection.source = CdmEntityReference(corpus.ctx, inner_projection, False)
        projection.validate()
        inner_projection.validate()
        self.assertEqual(0, error_count)

        # Third case, a projection with an explicit entity definition.
        inner_projection.source = CdmEntityReference(corpus.ctx, CdmEntityDefinition(corpus.ctx, 'Entity'), False)
        projection.validate()
        inner_projection.validate()
        self.assertEqual(1, error_count)
        error_count = 0

        # Third case, a projection with a named reference.
        inner_projection.source = CdmEntityReference(corpus.ctx, 'Entity', False)
        projection.validate()
        inner_projection.validate()
        self.assertEqual(1, error_count)

    @async_test
    async def test_run_sequentially(self):
        """Tests setting the "runSequentially" flag to true"""

        test_name = 'test_run_sequentially'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Rename attributes 'age' to 'yearsOld' then 'phoneNumber' to 'contactNumber' followed by a add count attribute.
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('yearsOld', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('contactNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('countAttribute', resolved_entity.attributes[5].name)

    @async_test
    async def test_run_sequentially_and_source_input(self):
        """Tests setting the "runSequentially" flag to true mixed with "sourceInput" set to true"""

        test_name = 'test_run_sequentially_and_source_input'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Replace 'age' with 'ageFK' and 'address' with 'addressFK' as foreign keys, followed by a add count attribute.
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('ageFK', resolved_entity.attributes[0].name)
        self.assertEqual('addressFK', resolved_entity.attributes[1].name)
        self.assertEqual('countAttribute', resolved_entity.attributes[2].name)

