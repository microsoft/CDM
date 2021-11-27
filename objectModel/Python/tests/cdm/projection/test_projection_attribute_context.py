# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionAttributeContextTest(unittest.TestCase):
    """A test class to verify the attribute context tree and traits generated for various resolution scenarios
    given a default resolution option/directive."""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'ProjectionAttributeContextTest')

    @async_test
    async def test_entity_string_reference(self):
        """Extends entity with a string reference"""
        test_name = 'test_entity_string_reference'
        entity_name = 'TestEntStrRef'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])


    @async_test
    async def test_entity_entity_reference(self):
        """Extends entity with an entity reference"""
        test_name = 'test_entity_entity_reference'
        entity_name = 'TestEntEntRef'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])


    @async_test
    async def test_entity_projection(self):
        """Extends entity with a projection"""
        test_name = 'test_entity_projection'
        entity_name = 'TestEntityProjection'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])


    @async_test
    async def test_entity_nested_projection(self):
        """Extends entity with a nested projection"""
        test_name = 'test_entity_nested_projection'
        entity_name = 'NestedProjection'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])


    @async_test
    async def test_entity_attribute_string_reference(self):
        """Entity attribute referenced with a string"""
        test_name = 'test_entity_attribute_string_reference'
        entity_name = 'TestEntAttrStrRef'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])


    @async_test
    async def test_entity_attribute_entity_reference(self):
        """Entity attribute referenced with an entity reference"""
        test_name = 'test_entity_attribute_entity_reference'
        entity_name = 'TestEntAttrEntRef'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])


    @async_test
    async def test_entity_attribute_projection(self):
        """Entity attribute referenced with a projection"""
        test_name = 'test_entity_attribute_projection'
        entity_name = 'TestEntAttrProj'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])


    @async_test
    async def test_entity_attribute_nested_projection(self):
        """Entity attribute referenced with a nested projection"""
        test_name = 'test_entity_attribute_nested_projection'
        entity_name = 'NestedProjection'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])

    @async_test
    async def test_entity_trait(self):
        """Entity that exhibits custom traits"""
        test_name = 'test_entity_trait'
        entity_name = 'TestEntityTrait'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        resolved_entity = await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])

        # Attribute Name
        self.assertEqual('TestAttribute', resolved_entity.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_entity.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_entity.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_entity.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_entity.attributes[0].applied_traits[4].arguments[0].value)

    @async_test
    async def test_entity_extends_trait(self):
        """Entity that extends and exhibits custom traits"""
        test_name = 'test_entity_extends_trait'
        entity_name = 'ExtendsTrait'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        resolved_entity = await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])

        # Attribute Name
        self.assertEqual('TestExtendsTraitAttribute', resolved_entity.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_entity.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTraitDerived', resolved_entity.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_entity.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_entity.attributes[0].applied_traits[4].arguments[0].value)

    @async_test
    async def test_projection_trait(self):
        """Entity with projection that exhibits custom traits"""
        test_name = 'test_projection_trait'
        entity_name = 'TestProjectionTrait'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        resolved_entity = await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])

        # Attribute Name
        self.assertEqual('TestProjectionAttribute', resolved_entity.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_entity.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_entity.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_entity.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_entity.attributes[0].applied_traits[4].arguments[0].value)

    @async_test
    async def test_projection_extends_trait(self):
        """Entity with projection that extends and exhibits custom traits"""
        test_name = 'test_projection_extends_trait'
        entity_name = 'ExtendsTrait'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        resolved_entity = await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, [])

        # Attribute Name
        self.assertEqual('TestProjectionAttribute', resolved_entity.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_entity.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_entity.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_entity.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_entity.attributes[0].applied_traits[4].arguments[0].value)

        # Attribute Name
        self.assertEqual('TestProjectionAttributeB', resolved_entity.attributes[1].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_entity.attributes[1].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_entity.attributes[1].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_entity.attributes[1].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_entity.attributes[1].applied_traits[4].arguments[0].value)

        # Trait Name
        self.assertEqual('testExtendsTraitB', resolved_entity.attributes[1].applied_traits[5].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_entity.attributes[1].applied_traits[5].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_entity.attributes[1].applied_traits[5].arguments[0].value)
        # Trait Param Name
        self.assertEqual('testExtendsTraitBParam1', resolved_entity.attributes[1].applied_traits[5].arguments[1]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestExtendsTraitB Param 1 DefaultValue', resolved_entity.attributes[1].applied_traits[5].arguments[1].value)
