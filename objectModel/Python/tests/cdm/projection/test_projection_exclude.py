# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import List

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmFolderDefinition, CdmEntityDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionExcludeTest(unittest.TestCase):
    """A test class for testing the ExcludeAttributes operation in a projection as well as SelectsSomeAvoidNames in a resolution guidance"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'ProjectionExcludeTest')

    @async_test
    async def test_entity_attribute_proj_using_object_model(self):
        """Test for creating a projection with an ExcludeAttributes operation on an entity attribute using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an ExcludeAttributes operation
        exclude_attrs_op = corpus.make_object(CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF)
        exclude_attrs_op.exclude_attributes = ['id', 'date']
        projection.operations.append(exclude_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Excluded attributes: ['id', 'date']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('value', resolved_entity.attributes[1].name)

    @async_test
    async def test_entity_proj_using_object_model(self):
        """Test for creating a projection with an ExcludeAttributes operation on an entity definition using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_entity_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an ExcludeAttributes operation
        exclude_attrs_op = corpus.make_object(CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF)
        exclude_attrs_op.exclude_attributes = ['name', 'value']
        projection.operations.append(exclude_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Set the entity's ExtendEntity to be the projection
        entity.extends_entity = projection_entity_ref

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Excluded attributes: ['name', 'value']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('id', resolved_entity.attributes[0].name)
        self.assertEqual('date', resolved_entity.attributes[1].name)

    @async_test
    async def test_nested_proj_using_object_model(self):
        """Test for creating nested projections with ExcludeAttributes operations using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_nested_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_nested_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an ExcludeAttributes operation
        exclude_attrs_op = corpus.make_object(CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF)
        exclude_attrs_op.exclude_attributes = ['id', 'date']
        projection.operations.append(exclude_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create another projection that uses the previous projection as its source
        projection2 = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection2.source = projection_entity_ref

        # Create an ExcludeAttributes operation
        exclude_attrs_op2 = corpus.make_object(CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF)
        exclude_attrs_op2.exclude_attributes = ['value']
        projection2.operations.append(exclude_attrs_op2)

        # Create an entity reference to hold this projection
        projection_entity_ref2 = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref2.explicit_reference = projection2

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')
        entity_attribute.entity = projection_entity_ref2
        entity.attributes.append(entity_attribute)

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the ExcludeAttributes operations
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Excluded attributes: ['id', 'date'], ['value']
        self.assertEqual(1, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)

    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an ExcludeAttributes operation and a condition using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_conditional_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_conditional_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        projection = ProjectionTestUtils.create_projection(corpus, local_root)
        projection.condition = 'referenceOnly==True'

        # Create an ExcludeAttributes operation
        exclude_attrs_op = corpus.make_object(CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF)
        exclude_attrs_op.exclude_attributes = ['id', 'date']
        projection.operations.append(exclude_attrs_op)

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

        # Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Excluded attributes: ['id', 'date']
        self.assertEqual(2, len(resolved_entity_with_reference_only.attributes))
        self.assertEqual('name', resolved_entity_with_reference_only.attributes[0].name)
        self.assertEqual('value', resolved_entity_with_reference_only.attributes[1].name)

        # Now resolve the entity with the 'structured' directive
        res_opt.directives = AttributeResolutionDirectiveSet(set(['structured']))
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Excluded attributes: none, condition was false
        self.assertEqual(4, len(resolved_entity_with_structured.attributes))
        self.assertEqual('id', resolved_entity_with_structured.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_structured.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_structured.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_structured.attributes[3].name)

    @async_test
    async def test_exclude_attributes(self):
        """ExcludeAttributes on an entity attribute"""
        test_name = 'test_exclude_attributes'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)

    @async_test
    async def test_SSAN(self):
        """SelectsSomeAvoidNames on an entity attribute"""
        test_name = 'test_SSAN'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        # Excluded attributes: ['PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('PersonInfoName', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfoAge', resolved_entity.attributes[1].name)

    @async_test
    async def test_SSAN_rename(self):
        """SelectsSomeAvoidNames on an entity attribute that has renameFormat = '{m}'"""
        test_name = 'test_SSAN_rename'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)

    @async_test
    async def test_single_nested_proj(self):
        """A nested ExcludeAttributes operation in a single projection"""
        test_name = 'test_single_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)

    @async_test
    async def test_nested_proj(self):
        """Nested projections with ExcludeAttributes"""
        test_name = 'test_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['address', 'phoneNumber', 'email'], ['age']
        self.assertEqual(1, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)

    @async_test
    async def test_multiple_exclude(self):
        """Multiple ExcludeAttributes in a single projection"""
        test_name = 'test_multiple_exclude'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['name', 'age', 'address'], ['address', 'email']
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[2].name)
        self.assertEqual('email', resolved_entity.attributes[3].name)

    @async_test
    async def test_extends_entity_proj(self):
        """ExcludeAttributes on an entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'Child'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['phoneNumber', 'email']
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)

    @async_test
    async def test_extends_entity(self):
        """SelectsSomeAvoidNames on an entity definition"""
        test_name = 'test_extends_entity'
        entity_name = 'Child'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['phoneNumber', 'email']
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)

    @async_test
    async def test_polymorphic_proj(self):
        """ExcludeAttributes on a polymorphic source"""
        test_name = 'test_polymorphic_proj'
        entity_name = 'BusinessPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['emailId', 'address', 'isPrimary', 'phoneId', 'number', 'socialId', 'account']
        # Excluded attributes: ['socialId', 'account']
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('number', resolved_entity.attributes[4].name)

    @async_test
    async def test_polymorphic(self):
        """SelectsSomeAvoidNames on a polymorphic source"""
        test_name = 'test_polymorphic'
        entity_name = 'BusinessPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['emailId', 'address', 'isPrimary', 'phoneId', 'number', 'socialId', 'account']
        # Excluded attributes: ['socialId', 'account']
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('number', resolved_entity.attributes[4].name)

    @async_test
    async def test_array_source_proj(self):
        """ExcludeAttributes on an array source"""
        test_name = 'test_array_source_proj'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['personCount', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total)
        # Excluded attributes: ['age1', 'age2', 'age3']
        self.assertEqual(13, len(resolved_entity.attributes))
        self.assertEqual('personCount', resolved_entity.attributes[0].name)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber1', resolved_entity.attributes[3].name)
        self.assertEqual('email1', resolved_entity.attributes[4].name)
        self.assertEqual('name2', resolved_entity.attributes[5].name)
        self.assertEqual('address2', resolved_entity.attributes[6].name)
        self.assertEqual('phoneNumber2', resolved_entity.attributes[7].name)
        self.assertEqual('email2', resolved_entity.attributes[8].name)
        self.assertEqual('name3', resolved_entity.attributes[9].name)
        self.assertEqual('address3', resolved_entity.attributes[10].name)
        self.assertEqual('phoneNumber3', resolved_entity.attributes[11].name)
        self.assertEqual('email3', resolved_entity.attributes[12].name)

    @async_test
    async def test_array_source(self):
        """SelectsSomeAvoidNames on an array source"""
        test_name = 'test_array_source'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['GroupOfPeoplePersonCount', 'GroupOfPeopleName1', 'GroupOfPeopleAge1', 'GroupOfPeopleAddress1',
        #                              'GroupOfPeoplePhoneNumber1', 'GroupOfPeopleEmail1', ..., 'GroupOfPeopleEmail3'] (16 total)
        # Excluded attributes: ['GroupOfPeopleAge1', 'GroupOfPeopleAge2', 'GroupOfPeopleAge3']
        self.assertEqual(13, len(resolved_entity.attributes))
        self.assertEqual('GroupOfPeoplePersonCount', resolved_entity.attributes[0].name)
        self.assertEqual('GroupOfPeopleName1', resolved_entity.attributes[1].name)
        self.assertEqual('GroupOfPeopleAddress1', resolved_entity.attributes[2].name)
        self.assertEqual('GroupOfPeoplePhoneNumber1', resolved_entity.attributes[3].name)
        self.assertEqual('GroupOfPeopleEmail1', resolved_entity.attributes[4].name)
        self.assertEqual('GroupOfPeopleName2', resolved_entity.attributes[5].name)
        self.assertEqual('GroupOfPeopleAddress2', resolved_entity.attributes[6].name)
        self.assertEqual('GroupOfPeoplePhoneNumber2', resolved_entity.attributes[7].name)
        self.assertEqual('GroupOfPeopleEmail2', resolved_entity.attributes[8].name)
        self.assertEqual('GroupOfPeopleName3', resolved_entity.attributes[9].name)
        self.assertEqual('GroupOfPeopleAddress3', resolved_entity.attributes[10].name)
        self.assertEqual('GroupOfPeoplePhoneNumber3', resolved_entity.attributes[11].name)
        self.assertEqual('GroupOfPeopleEmail3', resolved_entity.attributes[12].name)

    @async_test
    async def test_array_source_rename(self):
        """SelectsSomeAvoidNames on an array source that has renameFormat = '{m}'"""
        test_name = 'test_array_source_rename'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['personCount', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total)
        # Excluded attributes: ['age1', 'age2', 'age3']
        self.assertEqual(13, len(resolved_entity.attributes))
        self.assertEqual('personCount', resolved_entity.attributes[0].name)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber1', resolved_entity.attributes[3].name)
        self.assertEqual('email1', resolved_entity.attributes[4].name)
        self.assertEqual('name2', resolved_entity.attributes[5].name)
        self.assertEqual('address2', resolved_entity.attributes[6].name)
        self.assertEqual('phoneNumber2', resolved_entity.attributes[7].name)
        self.assertEqual('email2', resolved_entity.attributes[8].name)
        self.assertEqual('name3', resolved_entity.attributes[9].name)
        self.assertEqual('address3', resolved_entity.attributes[10].name)
        self.assertEqual('phoneNumber3', resolved_entity.attributes[11].name)
        self.assertEqual('email3', resolved_entity.attributes[12].name)

    @async_test
    async def test_conditional_proj(self):
        """ExcludeAttributes with a condition"""
        test_name = 'test_conditional_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)

        resolved_entity2 = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: none, condition was false
        self.assertEqual(5, len(resolved_entity2.attributes))
        self.assertEqual('name', resolved_entity2.attributes[0].name)
        self.assertEqual('age', resolved_entity2.attributes[1].name)
        self.assertEqual('address', resolved_entity2.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity2.attributes[3].name)
        self.assertEqual('email', resolved_entity2.attributes[4].name)

    @async_test
    async def test_empty_exclude(self):
        """ExcludeAttributes with an empty exclude attributes list"""
        test_name = 'test_empty_exclude'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: []
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

    @async_test
    async def test_group_proj(self):
        """ExcludeAttributes on an entity with an attribute group"""
        test_name = 'test_group_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)

    @async_test
    async def test_group(self):
        """SelectsSomeAvoidNames on an entity with an attribute group"""
        test_name = 'test_group'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        # Excluded attributes: ['PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('PersonInfoName', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfoAge', resolved_entity.attributes[1].name)

    @async_test
    async def test_group_rename(self):
        """SelectsSomeAvoidNames on an entity with an attribute group that has renameFormat = '{m}'"""
        test_name = 'test_group_rename'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Excluded attributes: ['address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)

    @async_test
    async def test_EA_name_proj(self):
        """
        ExcludeAttributes with an entity attribute name on an inline entity reference that contains entity attributes
        This is testing that, for the case of the structured directive, we can filter using the name of an entity attribute
        in the inline entity reference to exclude the entire entity attribute group
        """
        test_name = 'test_EA_name_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['structured'])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email', 'title', 'company', 'tenure']
        # Excluded attributes: ['OccupationInfo'] (name of entity attribute that contains 'title', 'company', 'tenure')
        self.assertEqual(1, len(resolved_entity.attributes)) # attribute group created because of structured directive
        att_group = resolved_entity.attributes[0].explicit_reference
        self.assertEqual(5, len(att_group.members))
        self.assertEqual('name', att_group.members[0].name)
        self.assertEqual('age', att_group.members[1].name)
        self.assertEqual('address', att_group.members[2].name)
        self.assertEqual('phoneNumber', att_group.members[3].name)
        self.assertEqual('email', att_group.members[4].name)

    @async_test
    async def test_type_attribute_proj(self):
        """Test resolving a type attribute with a exclude attributes operation"""
        test_name = 'test_type_attribute_proj'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'referenceOnly' ])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Exclude attributes ["address"]
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[2].name)
        self.assertEqual('email', resolved_entity.attributes[3].name)
