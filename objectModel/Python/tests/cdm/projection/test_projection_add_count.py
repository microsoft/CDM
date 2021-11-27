# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType
from cdm.storage import LocalAdapter
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionAddCountTest(unittest.TestCase):
    """A test class for testing the AddCountAttribute operation in a projection as well as CountAttribute in a resolution guidance"""

    # All possible combinations of the different resolution directives
    res_opts_combinations = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured']
    ]

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'ProjectionAddCountTest')

    @async_test
    async def test_entity_attribute_proj_using_object_model(self):
        """Test for creating a projection with an AddCountAttribute operation on an entity attribute using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an AddCountAttribute operation
        add_count_attr_op = corpus.make_object(CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF)
        add_count_attr_op.count_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'testCount')
        add_count_attr_op.count_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'integer', True)
        projection.operations.append(add_count_attr_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the AddCountAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # Count attribute: "testCount"
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('id', resolved_entity.attributes[0].name)
        self.assertEqual('name', resolved_entity.attributes[1].name)
        self.assertEqual('value', resolved_entity.attributes[2].name)
        self.assertEqual('date', resolved_entity.attributes[3].name)
        self.assertEqual('testCount', resolved_entity.attributes[4].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[4].applied_traits[1].named_reference)

    @async_test
    async def test_entity_proj_using_object_model(self):
        """Test for creating a projection with an AddCountAttribute operation on an entity definition using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_entity_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an AddCountAttribute operation
        add_count_attr_op = corpus.make_object(CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF)
        add_count_attr_op.count_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'testCount')
        add_count_attr_op.count_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'integer', True)
        projection.operations.append(add_count_attr_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Set the entity's ExtendEntity to be the projection
        entity.extends_entity = projection_entity_ref

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the AddCountAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # Count attribute: "testCount"
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('id', resolved_entity.attributes[0].name)
        self.assertEqual('name', resolved_entity.attributes[1].name)
        self.assertEqual('value', resolved_entity.attributes[2].name)
        self.assertEqual('date', resolved_entity.attributes[3].name)
        self.assertEqual('testCount', resolved_entity.attributes[4].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[4].applied_traits[1].named_reference)

    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an AddCountAttribute operation and a condition using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_conditional_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_conditional_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        projection = ProjectionTestUtils.create_projection(corpus, local_root)
        projection.condition = 'referenceOnly==True'

        # Create an AddCountAttribute operation
        add_count_attr_op = corpus.make_object(CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF)
        add_count_attr_op.count_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'testCount')
        add_count_attr_op.count_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'integer', True)
        projection.operations.append(add_count_attr_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Create resolution options with the 'referenceOnly' directive
        res_opt = ResolveOptions(entity.in_document)
        res_opt.directives = AttributeResolutionDirectiveSet(set(['referenceOnly']))

        # Resolve the entity with 'referenceOnly'
        resolved_entity_with_reference_only = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the AddCountAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # Count attribute: "testCount"
        self.assertEqual(5, len(resolved_entity_with_reference_only.attributes))
        self.assertEqual('id', resolved_entity_with_reference_only.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_reference_only.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_reference_only.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_reference_only.attributes[3].name)
        self.assertEqual('testCount', resolved_entity_with_reference_only.attributes[4].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity_with_reference_only.attributes[4].applied_traits[1].named_reference)

        # Now resolve the entity with the 'structured' directive
        res_opt.directives = AttributeResolutionDirectiveSet(set(['structured']))
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the AddCountAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # No Count attribute added, condition was false
        self.assertEqual(4, len(resolved_entity_with_structured.attributes))
        self.assertEqual('id', resolved_entity_with_structured.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_structured.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_structured.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_structured.attributes[3].name)

    @async_test
    async def test_add_count_attribute(self):
        """AddCountAttribute on an entity attribute"""
        test_name = 'test_add_count_attribute'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount"
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('someCount', resolved_entity.attributes[5].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[5].applied_traits[1].named_reference)

    @async_test
    async def test_count_attribute(self):
        """CountAttribute on an entity attribute"""
        test_name = 'test_count_attribute'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount"
        # For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('someCount', resolved_entity.attributes[0].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[0].applied_traits[1].named_reference)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('age1', resolved_entity.attributes[2].name)
        self.assertEqual('address1', resolved_entity.attributes[3].name)
        self.assertEqual('phoneNumber1', resolved_entity.attributes[4].name)
        self.assertEqual('email1', resolved_entity.attributes[5].name)

    @async_test
    async def test_extends_entity_proj(self):
        """AddCountAttribute on an entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount"
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('someCount', resolved_entity.attributes[5].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[5].applied_traits[1].named_reference)

    @async_test
    async def test_extends_entity(self):
        """CountAttribute on an entity definition"""
        test_name = 'test_extends_entity'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount"
        # For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        # ExtendsEntityResolutionGuidance doesn't support doing expansions, so we only get the Count attribute
        self.assertEqual(1, len(resolved_entity.attributes))
        self.assertEqual('someCount', resolved_entity.attributes[0].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[0].applied_traits[1].named_reference)

    @async_test
    async def test_with_nested_array_expansion(self):
        """Nested projections with ArrayExpansion, then AddCountAttribute, and then RenameAttributes"""
        test_name = 'test_with_nested_array_expansion'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "personCount", expand 1...2, renameFormat = {m}{o}
        self.assertEqual(11, len(resolved_entity.attributes))
        self.assertEqual('name1', resolved_entity.attributes[0].name)
        self.assertEqual('age1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber1', resolved_entity.attributes[3].name)
        self.assertEqual('email1', resolved_entity.attributes[4].name)
        self.assertEqual('name2', resolved_entity.attributes[5].name)
        self.assertEqual('age2', resolved_entity.attributes[6].name)
        self.assertEqual('address2', resolved_entity.attributes[7].name)
        self.assertEqual('phoneNumber2', resolved_entity.attributes[8].name)
        self.assertEqual('email2', resolved_entity.attributes[9].name)
        self.assertEqual('personCount', resolved_entity.attributes[10].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[10].applied_traits[1].named_reference)
        self.assertEqual('indicates.expansionInfo.count', resolved_entity.attributes[10].applied_traits[2].named_reference)

    @async_test
    async def test_combine_ops(self):
        """AddCountAttribute with other operations in the same projection"""
        test_name = 'test_combine_ops'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount", count attribute: "anotherCount", rename "name" to "firstName"
        self.assertEqual(8, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('someCount', resolved_entity.attributes[5].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[5].applied_traits[1].named_reference)
        self.assertEqual('anotherCount', resolved_entity.attributes[6].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[6].applied_traits[1].named_reference)
        self.assertEqual('firstName', resolved_entity.attributes[7].name)

    @async_test
    async def test_combine_ops_nested_proj(self):
        """Nested projections with AddCountAttribute and other operations"""
        test_name = 'test_combine_ops_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount", renameFormat = new_{m}, include ["new_name", "age", "new_someCount"]
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('new_name', resolved_entity.attributes[0].name)
        self.assertEqual('new_age', resolved_entity.attributes[1].name)
        self.assertEqual('new_someCount', resolved_entity.attributes[2].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[2].applied_traits[1].named_reference)

    @async_test
    async def test_conditional_proj(self):
        """AddCountAttribute with a conditionn"""
        test_name = 'test_conditional_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount"
        # Condition is false, so no Count attribute added
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

    @async_test
    async def test_group_proj(self):
        """AddCountAttribute on an entity with an attribute group"""
        test_name = 'test_group_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount"
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('someCount', resolved_entity.attributes[5].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[5].applied_traits[1].named_reference)

    @async_test
    async def test_group(self):
        """CountAttribute on an entity with an attribute group"""
        test_name = 'test_group'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount"
        # For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('someCount', resolved_entity.attributes[0].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[0].applied_traits[1].named_reference)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('age1', resolved_entity.attributes[2].name)
        self.assertEqual('address1', resolved_entity.attributes[3].name)
        self.assertEqual('phoneNumber1', resolved_entity.attributes[4].name)
        self.assertEqual('email1', resolved_entity.attributes[5].name)

    @async_test
    async def test_duplicate(self):
        """Two AddCountAttribute operations in a single projection using the same Count attribute"""
        test_name = 'test_duplicate'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Count attribute: "someCount", count attribute: "someCount"
        # "someCount" should get merged into one
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('someCount', resolved_entity.attributes[5].name)
        self.assertEqual('is.linkedEntity.array.count', resolved_entity.attributes[5].applied_traits[1].named_reference)
