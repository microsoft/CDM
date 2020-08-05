# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test, TestHelper, TestUtils


class ProjectionAttributeContextTest(unittest.TestCase):
    """A test class to verify the attribute context tree and traits generated for various resolution scenarios
    given a default resolution option/directive."""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionAttributeContext')

    @async_test
    async def test_entity_string_reference(self):
        """Extends entity with a string reference"""
        test_name = 'test_entity_string_reference'
        entity_name = 'TestEntityStringReference'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_string_reference = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_string_reference)
        resolved_test_entity_string_reference = await TestUtils._get_resolved_entity(corpus, ent_test_entity_string_reference, [])
        self.assertIsNotNone(resolved_test_entity_string_reference)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_string_reference)

    @async_test
    async def test_entity_entity_reference(self):
        """Extends entity with an entity reference"""
        test_name = 'test_entity_entity_reference'
        entity_name = 'TestEntityEntityReference'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_entity_reference = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_entity_reference)
        resolved_test_entity_entity_reference = await TestUtils._get_resolved_entity(corpus, ent_test_entity_entity_reference, [])
        self.assertIsNotNone(resolved_test_entity_entity_reference)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_entity_reference)

    @async_test
    async def test_entity_projection(self):
        """Extends entity with a projection"""
        test_name = 'test_entity_projection'
        entity_name = 'TestEntityProjection'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_projection = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_projection)
        resolved_test_entity_projection = await TestUtils._get_resolved_entity(corpus, ent_test_entity_projection, [])
        self.assertIsNotNone(resolved_test_entity_projection)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_projection)

    @async_test
    async def test_entity_nested_projection(self):
        """Extends entity with a nested projection"""
        test_name = 'test_entity_nested_projection'
        entity_name = 'TestEntityNestedProjection'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_nested_projection = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_nested_projection)
        resolved_test_entity_nested_projection = await TestUtils._get_resolved_entity(corpus, ent_test_entity_nested_projection, [])
        self.assertIsNotNone(resolved_test_entity_nested_projection)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_nested_projection)

    @async_test
    async def test_entity_attribute_string_reference(self):
        """Entity attribute referenced with a string"""
        test_name = 'test_entity_attribute_string_reference'
        entity_name = 'TestEntityAttributeStringReference'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_attribute_string_reference = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_attribute_string_reference)
        resolved_test_entity_attribute_string_reference = await TestUtils._get_resolved_entity(corpus, ent_test_entity_attribute_string_reference, [])
        self.assertIsNotNone(resolved_test_entity_attribute_string_reference)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_attribute_string_reference)

    @async_test
    async def test_entity_attribute_entity_reference(self):
        """Entity attribute referenced with an entity reference"""
        test_name = 'test_entity_attribute_entity_reference'
        entity_name = 'TestEntityAttributeEntityReference'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_attribute_entity_reference = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_attribute_entity_reference)
        resolved_test_entity_attribute_entity_reference = await TestUtils._get_resolved_entity(corpus, ent_test_entity_attribute_entity_reference, [])
        self.assertIsNotNone(resolved_test_entity_attribute_entity_reference)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_attribute_entity_reference)

    @async_test
    async def test_entity_attribute_projection(self):
        """Entity attribute referenced with a projection"""
        test_name = 'test_entity_attribute_projection'
        entity_name = 'TestEntityAttributeProjection'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_attribute_projection = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_attribute_projection)
        resolved_test_entity_attribute_projection = await TestUtils._get_resolved_entity(corpus, ent_test_entity_attribute_projection, [])
        self.assertIsNotNone(resolved_test_entity_attribute_projection)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_attribute_projection)

    @async_test
    async def test_entity_attribute_nested_projection(self):
        """Entity attribute referenced with a nested projection"""
        test_name = 'test_entity_attribute_nested_projection'
        entity_name = 'TestEntityAttributeNestedProjection'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_attribute_nested_projection = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_attribute_nested_projection)
        resolved_test_entity_attribute_nested_projection = await TestUtils._get_resolved_entity(corpus, ent_test_entity_attribute_nested_projection, [])
        self.assertIsNotNone(resolved_test_entity_attribute_nested_projection)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_attribute_nested_projection)

    @async_test
    async def test_entity_trait(self):
        """Entity that exhibits custom traits"""
        test_name = 'test_entity_trait'
        entity_name = 'TestEntityTrait'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_trait = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_trait)
        resolved_test_entity_trait = await TestUtils._get_resolved_entity(corpus, ent_test_entity_trait, [])
        self.assertIsNotNone(resolved_test_entity_trait)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_trait)

        # Attribute Name
        self.assertEqual('TestAttribute', resolved_test_entity_trait.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_test_entity_trait.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_test_entity_trait.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_test_entity_trait.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_test_entity_trait.attributes[0].applied_traits[4].arguments[0].value)

    @async_test
    async def test_entity_extends_trait(self):
        """Entity that extends and exhibits custom traits"""
        test_name = 'test_entity_extends_trait'
        entity_name = 'TestEntityExtendsTrait'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_entity_extends_trait = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_entity_extends_trait)
        resolved_test_entity_extends_trait = await TestUtils._get_resolved_entity(corpus, ent_test_entity_extends_trait, [])
        self.assertIsNotNone(resolved_test_entity_extends_trait)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_entity_extends_trait)

        # Attribute Name
        self.assertEqual('TestExtendsTraitAttribute', resolved_test_entity_extends_trait.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_test_entity_extends_trait.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTraitDerived', resolved_test_entity_extends_trait.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_test_entity_extends_trait.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_test_entity_extends_trait.attributes[0].applied_traits[4].arguments[0].value)

    @async_test
    async def test_projection_trait(self):
        """Entity with projection that exhibits custom traits"""
        test_name = 'test_projection_trait'
        entity_name = 'TestProjectionTrait'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_projection_trait = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_projection_trait)
        resolved_test_projection_trait = await TestUtils._get_resolved_entity(corpus, ent_test_projection_trait, [])
        self.assertIsNotNone(resolved_test_projection_trait)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_projection_trait)

        # Attribute Name
        self.assertEqual('TestProjectionAttribute', resolved_test_projection_trait.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_test_projection_trait.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_test_projection_trait.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_test_projection_trait.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_test_projection_trait.attributes[0].applied_traits[4].arguments[0].value)

    @async_test
    async def test_projection_extends_trait(self):
        """Entity with projection that extends and exhibits custom traits"""
        test_name = 'test_projection_extends_trait'
        entity_name = 'TestProjectionExtendsTrait'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        ent_test_projection_extends_trait = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_test_projection_extends_trait)
        resolved_test_projection_extends_trait = await TestUtils._get_resolved_entity(corpus, ent_test_projection_extends_trait, [])
        self.assertIsNotNone(resolved_test_projection_extends_trait)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, entity_name, resolved_test_projection_extends_trait)

        # Attribute Name
        self.assertEqual('TestProjectionAttribute', resolved_test_projection_extends_trait.attributes[0].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_test_projection_extends_trait.attributes[0].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_test_projection_extends_trait.attributes[0].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_test_projection_extends_trait.attributes[0].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_test_projection_extends_trait.attributes[0].applied_traits[4].arguments[0].value)

        # Attribute Name
        self.assertEqual('TestProjectionAttributeB', resolved_test_projection_extends_trait.attributes[1].name)
        # Trait Name
        self.assertEqual('does.haveDefault', resolved_test_projection_extends_trait.attributes[1].applied_traits[3].named_reference)
        # Trait Name
        self.assertEqual('testTrait', resolved_test_projection_extends_trait.attributes[1].applied_traits[4].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_test_projection_extends_trait.attributes[1].applied_traits[4].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_test_projection_extends_trait.attributes[1].applied_traits[4].arguments[0].value)

        # Trait Name
        self.assertEqual('testExtendsTraitB', resolved_test_projection_extends_trait.attributes[1].applied_traits[5].named_reference)
        # Trait Param Name
        self.assertEqual('testTraitParam1', resolved_test_projection_extends_trait.attributes[1].applied_traits[5].arguments[0]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestTrait Param 1 DefaultValue', resolved_test_projection_extends_trait.attributes[1].applied_traits[5].arguments[0].value)
        # Trait Param Name
        self.assertEqual('testExtendsTraitBParam1', resolved_test_projection_extends_trait.attributes[1].applied_traits[5].arguments[1]._resolved_parameter.name)
        # Trait Param Default Value
        self.assertEqual('TestExtendsTraitB Param 1 DefaultValue', resolved_test_projection_extends_trait.attributes[1].applied_traits[5].arguments[1].value)
