# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType
from cdm.storage import LocalAdapter
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionAddTypeTest(unittest.TestCase):
    """A test class for testing the AddTypeAttribute operation in a projection as well as SelectedTypeAttribute in a resolution guidance"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionAddType')

    @async_test
    async def test_entity_attribute_proj_using_object_model(self):
        """Test for creating a projection with an AddTypeAttribute operation on an entity attribute using the object model"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an AddTypeAttribute operation
        add_type_attr_op = corpus.make_object(CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF)
        add_type_attr_op.type_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'testType')
        add_type_attr_op.type_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'entityName', True)
        projection.operations.append(add_type_attr_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # Type attribute: "testType"
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('id', resolved_entity.attributes[0].name)
        self.assertEqual('name', resolved_entity.attributes[1].name)
        self.assertEqual('value', resolved_entity.attributes[2].name)
        self.assertEqual('date', resolved_entity.attributes[3].name)
        self.assertEqual('testType', resolved_entity.attributes[4].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[4].applied_traits[4].named_reference)

    @async_test
    async def test_entity_proj_using_object_model(self):
        """Test for creating a projection with an AddTypeAttribute operation on an entity definition using the object model"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_entity_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an AddTypeAttribute operation
        add_type_attr_op = corpus.make_object(CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF)
        add_type_attr_op.type_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'testType')
        add_type_attr_op.type_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'entityName', True)
        projection.operations.append(add_type_attr_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Set the entity's ExtendEntity to be the projection
        entity.extends_entity = projection_entity_ref

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # Type attribute: "testType"
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('id', resolved_entity.attributes[0].name)
        self.assertEqual('name', resolved_entity.attributes[1].name)
        self.assertEqual('value', resolved_entity.attributes[2].name)
        self.assertEqual('date', resolved_entity.attributes[3].name)
        self.assertEqual('testType', resolved_entity.attributes[4].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[4].applied_traits[4].named_reference)


    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an AddTypeAttribute operation and a condition using the object model"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_conditional_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_conditional_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        projection = ProjectionTestUtils.create_projection(corpus, local_root)
        projection.condition = 'referenceOnly==True'

        # Create an AddTypeAttribute operation
        add_type_attr_op = corpus.make_object(CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF)
        add_type_attr_op.type_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'testType')
        add_type_attr_op.type_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'entityName', True)
        projection.operations.append(add_type_attr_op)

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

        # Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # Type attribute: "testType"
        self.assertEqual(5, len(resolved_entity_with_reference_only.attributes))
        self.assertEqual('id', resolved_entity_with_reference_only.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_reference_only.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_reference_only.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_reference_only.attributes[3].name)
        self.assertEqual('testType', resolved_entity_with_reference_only.attributes[4].name)
        self.assertIsNotNone(resolved_entity_with_reference_only.attributes[4].applied_traits.item('is.linkedEntity.name'))

        # Now resolve the entity with the 'structured' directive
        res_opt.directives = AttributeResolutionDirectiveSet(set(['structured']))
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        # Original set of attributes: ["id", "name", "value", "date"]
        # No Type attribute added, condition was false
        self.assertEqual(4, len(resolved_entity_with_structured.attributes))
        self.assertEqual('id', resolved_entity_with_structured.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_structured.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_structured.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_structured.attributes[3].name)

    @async_test
    async def test_add_type_attribute_proj(self):
        """AddTypeAttribute on an entity attribute"""
        test_name = 'test_add_type_attribute_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Type attribute: "someType"
        self.assertEqual(8, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('number', resolved_entity.attributes[4].name)
        self.assertEqual('socialId', resolved_entity.attributes[5].name)
        self.assertEqual('account', resolved_entity.attributes[6].name)
        self.assertEqual('someType', resolved_entity.attributes[7].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[7].applied_traits[4].named_reference)

    @async_test
    async def test_selected_type_attr(self):
        """SelectedTypeAttribute on an entity attribute"""
        test_name = 'test_selected_type_attr'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Type attribute: "someType"
        self.assertEqual(8, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('number', resolved_entity.attributes[4].name)
        self.assertEqual('socialId', resolved_entity.attributes[5].name)
        self.assertEqual('account', resolved_entity.attributes[6].name)
        self.assertEqual('someType', resolved_entity.attributes[7].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[7].applied_traits[4].named_reference)

    @async_test
    async def test_extends_entity_proj(self):
        """AddTypeAttribute on an entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Type attribute: "someType"
        self.assertEqual(8, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('number', resolved_entity.attributes[4].name)
        self.assertEqual('socialId', resolved_entity.attributes[5].name)
        self.assertEqual('account', resolved_entity.attributes[6].name)
        self.assertEqual('someType', resolved_entity.attributes[7].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[7].applied_traits[4].named_reference)

    @async_test
    async def test_extends_entity(self):
        """SelectedTypeAttribute on an entity definition"""
        test_name = 'test_extends_entity'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Type attribute: "someType" (using extendsEntityResolutionGuidance)
        self.assertEqual(8, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('number', resolved_entity.attributes[4].name)
        self.assertEqual('socialId', resolved_entity.attributes[5].name)
        self.assertEqual('account', resolved_entity.attributes[6].name)
        self.assertEqual('someType', resolved_entity.attributes[7].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[7].applied_traits[4].named_reference)

    @async_test
    async def test_add_type_with_combine_proj(self):
        """AddTypeAttribute on an entity attribute (after a CombineAttributes)"""
        test_name = 'test_add_type_with_combine_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('address', resolved_entity.attributes[0].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[1].name)
        self.assertEqual('number', resolved_entity.attributes[2].name)
        self.assertEqual('account', resolved_entity.attributes[3].name)
        self.assertEqual('contactId', resolved_entity.attributes[4].name)
        self.assertEqual('contactType', resolved_entity.attributes[5].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[5].applied_traits[4].named_reference)

    @async_test
    async def test_combine_ops_proj(self):
        """AddTypeAttribute with other operations in the same projection"""
        test_name = 'test_combine_ops_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Type attribute: "someType", rename "address" to "homeAddress"
        self.assertEqual(9, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('number', resolved_entity.attributes[4].name)
        self.assertEqual('socialId', resolved_entity.attributes[5].name)
        self.assertEqual('account', resolved_entity.attributes[6].name)
        self.assertEqual('someType', resolved_entity.attributes[7].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[7].applied_traits[4].named_reference)
        self.assertEqual('homeAddress', resolved_entity.attributes[8].name)

    @async_test
    async def test_combine_ops_nested_proj(self):
        """Nested projections with AddTypeAttribute and other operations"""
        test_name = 'test_combine_ops_nested_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType",
        # rename ["contactId", "isPrimary"] as "new_{m}", include ["contactId", "new_isPrimary", "contactType"]
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('new_isPrimary', resolved_entity.attributes[0].name)
        self.assertEqual('new_contactId', resolved_entity.attributes[1].name)
        self.assertEqual('contactType', resolved_entity.attributes[2].name)
        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[2].applied_traits[4].named_reference)

    @async_test
    async def test_conditional_proj(self):
        """AddTypeAttribute with a condition"""
        test_name = 'test_conditional_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_subpath)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
        # Condition for projection containing AddTypeAttribute is false, so no Type attribute is created
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('address', resolved_entity.attributes[0].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[1].name)
        self.assertEqual('number', resolved_entity.attributes[2].name)
        self.assertEqual('account', resolved_entity.attributes[3].name)
        self.assertEqual('contactId', resolved_entity.attributes[4].name)
