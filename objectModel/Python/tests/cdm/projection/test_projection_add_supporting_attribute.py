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

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeItem, CdmCollection


class ProjectionAddSupportingAttributeTest(unittest.TestCase):
    """A test class for testing the AddSupportingAttribute operation in a projection and in a resolution guidance"""

    # All possible combinations of the different resolution directives
    res_opts_combinations = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['referenceOnly', 'virtual'],
        ['normalized', 'structured'],
        ['normalized', 'structured', 'virtual'],
        ['referenceOnly', 'normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured', 'virtual']
    ]

    # The path between test_data_path and test_name.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionAddSupportingAttribute')

    @async_test
    async def test_combine_ops_proj(self):
        """AddSupportingAttribute with replaceAsForeignKey operation in the same projection"""
        test_name = 'test_combine_ops_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Supporting attribute: 'PersonInfo_display', rename 'address' to 'homeAddress'
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('homeAddress', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('address', resolved_entity.attributes[5].name)
        self.assertEqual('PersonInfo_display', resolved_entity.attributes[6].name)
        self.validate_in_support_of_attribute(resolved_entity.attributes[6], 'email')

    @async_test
    async def test_conditional_proj(self):
        """Test AddAttributeGroup operation with a 'referenceOnly' and 'virtual' condition"""
        test_name = 'test_conditional_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition not met, don't include supporting attribute
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

        resolved_entity2 = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly', 'virtual'])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition met, include the supporting attribute
        self.assertEqual(6, len(resolved_entity2.attributes))
        self.assertEqual('name', resolved_entity2.attributes[0].name)
        self.assertEqual('age', resolved_entity2.attributes[1].name)
        self.assertEqual('address', resolved_entity2.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity2.attributes[3].name)
        self.assertEqual('email', resolved_entity2.attributes[4].name)
        self.assertEqual('PersonInfo_display', resolved_entity2.attributes[5].name)
        self.validate_in_support_of_attribute(resolved_entity2.attributes[5], 'email')

    @async_test
    async def test_entity_attribute(self):
        """Test resolving an entity attribute using resolution guidance"""
        test_name = 'test_entity_attribute'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition

        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('id', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo_display', resolved_entity.attributes[1].name)
        self.validate_in_support_of_attribute(resolved_entity.attributes[1], 'id', False)

        # Resolve without directives
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('PersonInfo_display', resolved_entity.attributes[5].name)
        self.validate_in_support_of_attribute(resolved_entity.attributes[5], 'email', False)

    @async_test
    async def test_entity_attribute_proj(self):
        """Test resolving an entity attribute with add supporting attribute operation"""
        test_name = 'test_entity_attribute_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('PersonInfo_display', resolved_entity.attributes[5].name)
        self.validate_in_support_of_attribute(resolved_entity.attributes[5], 'email')

    @async_test
    async def test_extends_entity(self):
        """addSupportingAttribute on an entity definition using resolution guidance"""
        test_name = 'test_extends_entity'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        self.maxDiff = None

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Supporting attribute: 'PersonInfo_display' (using extendsEntityResolutionGuidance)
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('PersonInfo_display', resolved_entity.attributes[5].name)
        self.validate_in_support_of_attribute(resolved_entity.attributes[5], 'email', False)

    @async_test
    async def test_extends_entity_proj(self):
        """addSupportingAttribute on an entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Supporting attribute: 'PersonInfo_display' (using extendsEntityResolutionGuidance)
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('PersonInfo_display', resolved_entity.attributes[5].name)
        self.validate_in_support_of_attribute(resolved_entity.attributes[5], 'email')

    @async_test
    async def test_nested_proj(self):
        """Nested replaceAsForeignKey with addSupporingAttribute"""
        test_name = 'test_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('personId', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo_display', resolved_entity.attributes[1].name)
        self.validate_in_support_of_attribute(resolved_entity.attributes[1], 'personId')
    
    @async_test
    async def test_nested_type_attribute_proj(self):
        """Test resolving a type attribute with a nested add supporting attribute operation"""
        test_name = 'test_nested_t_a_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])  # type: CdmEntityDefinition

        # Original set of attributes: ["PersonInfo"]
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        supporting_attribute = resolved_entity.attributes[1]  # type: CdmTypeAttributeDefinition
        self.assertEqual('name_display', supporting_attribute.name)
        self.validate_in_support_of_attribute(supporting_attribute, 'name', False)

    @async_test
    async def test_type_attribute(self):
        """Test resolving a type attribute using resolution guidance"""
        test_name = 'test_type_attribute'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['structured'])  # type: CdmEntityDefinition

        # Original set of attributes: ["PersonInfo"]
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo', resolved_entity.attributes[0].name)
        supporting_attribute = resolved_entity.attributes[1]  # type: CdmTypeAttributeDefinition
        self.assertEqual('PersonInfo_display', supporting_attribute.name)
        self.validate_in_support_of_attribute(supporting_attribute, 'PersonInfo', False)

    @async_test
    async def test_type_attribute_proj(self):
        """Test resolving a type attribute with an add supporting attribute operation"""
        test_name = 'test_type_attribute_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])  # type: CdmEntityDefinition

        # Original set of attributes: ["PersonInfo"]
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo', resolved_entity.attributes[0].name)
        supporting_attribute = resolved_entity.attributes[1]  # type: CdmTypeAttributeDefinition
        self.assertEqual('PersonInfo_display', supporting_attribute.name)
        self.validate_in_support_of_attribute(supporting_attribute, 'PersonInfo', False)


    def validate_in_support_of_attribute(self, supporting_attribute: 'CdmAttributeItem', from_attribute: str, check_virtual_trait: bool = True):
        """Validates that the supporting attribute has the 'is.addedInSupportOf' and 'is.virtual.attribute' traits"""
        in_support_of_trait = supporting_attribute.applied_traits.item('is.addedInSupportOf')  # type: Optional[CdmTraitReference]
        self.assertIsNotNone(in_support_of_trait)
        self.assertEqual(1, len(in_support_of_trait.arguments))
        self.assertEqual(from_attribute, in_support_of_trait.arguments[0].value)

        if check_virtual_trait:
            self.assertIsNotNone(supporting_attribute.applied_traits.item('is.virtual.attribute'), 'Missing is.virtual.attribute traits')
