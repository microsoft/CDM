# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils



class ProjectionAddAttributeGroupTest(unittest.TestCase):
    """A test class for testing the AddAttributeGroup operation in a projection as well as attribute group creation in a resolution guidance"""

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

    # The path between TestDataPath and test_name.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionAddAttributeGroup')

    @async_test
    async def test_combine_ops_nested_proj(self):
        """Test AddAttributeGroup operation nested with ExcludeAttributes"""
        test_name = 'test_combine_ops_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Exclude attributes: ['age', 'phoneNumber']
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'PersonAttributeGroup')
        self.assertEqual(3, len(att_group_definition.members))
        self.assertEqual('name', att_group_definition.members[0].name)
        self.assertEqual('address', att_group_definition.members[1].name)
        self.assertEqual('email', att_group_definition.members[2].name)

    @async_test
    async def test_combine_ops_proj(self):
        """Test AddAttributeGroup and IncludeAttributes operations in the same projection"""
        test_name = 'test_combine_ops_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Included attributes: ['age', 'phoneNumber']
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'PersonAttributeGroup', 3)
        self.assertEqual(5, len(att_group_definition.members))
        self.assertEqual('name', att_group_definition.members[0].name)
        self.assertEqual('age', att_group_definition.members[1].name)
        self.assertEqual('address', att_group_definition.members[2].name)
        self.assertEqual('phoneNumber', att_group_definition.members[3].name)
        self.assertEqual('email', att_group_definition.members[4].name)

        # Check the attributes coming from the IncludeAttribute operation
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[2].name)

    @async_test
    async def test_conditional_proj(self):
        """Test AddAttributeGroup operation with a 'structured' condition"""
        test_name = 'test_conditional_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'referenceOnly' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition not met, keep attributes in flat list
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

        resolved_entity2 = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition met, put all attributes in an attribute group
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity2.attributes, 'PersonAttributeGroup')
        self.assertEqual(5, len(att_group_definition.members))
        self.assertEqual('name', att_group_definition.members[0].name)
        self.assertEqual('age', att_group_definition.members[1].name)
        self.assertEqual('address', att_group_definition.members[2].name)
        self.assertEqual('phoneNumber', att_group_definition.members[3].name)
        self.assertEqual('email', att_group_definition.members[4].name)

    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an AddAttributeGroup operation and a condition using the object model"""
        test_name = 'test_conditional_proj_using_object_model'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity.
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        projection = ProjectionTestUtils.create_projection(corpus, local_root)
        projection.condition = 'structured==true'

        # Create an AddAttributeGroup operation
        add_att_group_op = corpus.make_object(CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF)
        add_att_group_op.attribute_group_name = 'PersonAttributeGroup'
        projection.operations.append(add_att_group_op)

        # Create an entity reference to hold this projection.
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity.
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')  # type: CdmEntityAttributeDefinition
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Create resolution options with the 'referenceOnly' directive.
        res_opt = ResolveOptions(entity.in_document)
        res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly'})

        # Resolve the entity with 'referenceOnly'
        resolved_entity_with_reference_only = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Condition not met, keep attributes in flat list
        self.assertEqual(4, len(resolved_entity_with_reference_only.attributes))
        self.assertEqual('id', resolved_entity_with_reference_only.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_reference_only.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_reference_only.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_reference_only.attributes[3].name)

        # Now resolve the entity with the 'structured' directive
        res_opt.directives = AttributeResolutionDirectiveSet({'structured'})
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Condition met, put all attributes in an attribute group
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity_with_structured.attributes, 'PersonAttributeGroup')
        self.assertEqual(4, len(att_group_definition.members))
        self.assertEqual('id', att_group_definition.members[0].name)
        self.assertEqual('name', att_group_definition.members[1].name)
        self.assertEqual('value', att_group_definition.members[2].name)
        self.assertEqual('date', att_group_definition.members[3].name)

    @async_test
    async def test_entity_attribute(self):
        """Test resolving an entity attribute using resolution guidance"""
        test_name = 'test_entity_attribute'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'PersonInfo')
        self.assertEqual(5, len(att_group_definition.members))
        self.assertEqual('name', att_group_definition.members[0].name)
        self.assertEqual('age', att_group_definition.members[1].name)
        self.assertEqual('address', att_group_definition.members[2].name)
        self.assertEqual('phoneNumber', att_group_definition.members[3].name)
        self.assertEqual('email', att_group_definition.members[4].name)

    @async_test
    async def test_entity_attribute_proj_using_object_model(self):
        """Test for creating a projection with an AddAttributeGroup operation on an entity attribute using the object model"""
        test_name = 'test_entity_attribute_proj_using_object_model'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)  # type: CdmEntityDefinition

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection

        # Create an AddAttributeGroup operation
        add_att_group_op = corpus.make_object(CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF)  # type: CdmOperationAddAttributeGroup
        add_att_group_op.attribute_group_name = 'PersonAttributeGroup'
        projection.operations.append(add_att_group_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')  # type: CdmEntityAttributeDefinition
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Resolve the entity.
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'PersonAttributeGroup')
        self.assertEqual(4, len(att_group_definition.members))
        self.assertEqual('id', att_group_definition.members[0].name)
        self.assertEqual('name', att_group_definition.members[1].name)
        self.assertEqual('value', att_group_definition.members[2].name)
        self.assertEqual('date', att_group_definition.members[3].name)

    @async_test
    async def test_entity_proj_using_object_model(self):
        """Test for creating a projection with an AddAttributeGroup operation on an entity definition using the object model"""
        test_name = 'test_entity_proj_using_object_model'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)  # type: CdmEntityDefinition

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection

        # Create an AddAttributeGroup operation
        add_att_group_op = corpus.make_object(CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF)  # type: CdmOperationAddAttributeGroup
        add_att_group_op.attribute_group_name = 'PersonAttributeGroup'
        projection.operations.append(add_att_group_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projection_entity_ref.explicit_reference = projection

        # Set the entity's ExtendEntity to be the projection
        entity.extends_entity = projection_entity_ref

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'PersonAttributeGroup')
        self.assertEqual(4, len(att_group_definition.members))
        self.assertEqual('id', att_group_definition.members[0].name)
        self.assertEqual('name', att_group_definition.members[1].name)
        self.assertEqual('value', att_group_definition.members[2].name)
        self.assertEqual('date', att_group_definition.members[3].name)

    @async_test
    async def test_extends_entity_proj(self):
        """Test AddAttributeGroup operation on an entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'Child'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'ChildAttributeGroup')
        self.assertEqual(5, len(att_group_definition.members))
        self.assertEqual('name', att_group_definition.members[0].name)
        self.assertEqual('age', att_group_definition.members[1].name)
        self.assertEqual('address', att_group_definition.members[2].name)
        self.assertEqual('phoneNumber', att_group_definition.members[3].name)
        self.assertEqual('email', att_group_definition.members[4].name)

    @async_test
    async def test_multiple_op_proj(self):
        """Multiple AddAttributeGroup operations on the same projection """
        test_name = 'test_multiple_op_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # This will result in two attribute groups with the same set of attributes being generated
        att_group1 = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'PersonAttributeGroup', 2)  # type: CdmAttributeGroupDefinition
        self.assertEqual(5, len(att_group1.members))
        self.assertEqual('name', att_group1.members[0].name)
        self.assertEqual('age', att_group1.members[1].name)
        self.assertEqual('address', att_group1.members[2].name)
        self.assertEqual('phoneNumber', att_group1.members[3].name)
        self.assertEqual('email', att_group1.members[4].name)

        att_group2 = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'SecondAttributeGroup', 2, 1)  # type: CdmAttributeGroupDefinition
        self.assertEqual(5, len(att_group2.members))
        self.assertEqual('name', att_group2.members[0].name)
        self.assertEqual('age', att_group2.members[1].name)
        self.assertEqual('address', att_group2.members[2].name)
        self.assertEqual('phoneNumber', att_group2.members[3].name)
        self.assertEqual('email', att_group2.members[4].name)

    @async_test
    async def test_nested_proj(self):
        """Nested projections with AddAttributeGroup"""
        test_name = 'test_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        outer_att_group = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'OuterAttributeGroup')  # type: CdmAttributeGroupDefinition
        inner_att_group = ProjectionTestUtils.validate_attribute_group(self, outer_att_group.members, 'InnerAttributeGroup')

        self.assertEqual(5, len(inner_att_group.members))
        self.assertEqual('name', inner_att_group.members[0].name)
        self.assertEqual('age', inner_att_group.members[1].name)
        self.assertEqual('address', inner_att_group.members[2].name)
        self.assertEqual('phoneNumber', inner_att_group.members[3].name)
        self.assertEqual('email', inner_att_group.members[4].name)

    @unittest.skip
    @async_test
    async def test_type_attribute_proj(self):
        """Test resolving a type attribute with an add attribute group operation"""
        test_name = 'test_type_attribute_proj'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, resolved_entity.attributes, 'AddressAttributeGroup', 5, 2)
        self.assertEqual('address', att_group_definition.members[0].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

