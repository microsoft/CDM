# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.objectmodel import CdmEntityDefinition, CdmCorpusDefinition, CdmE2ERelationship, CdmCollection
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class CalculateRelationshipTest(unittest.TestCase):
    """Test to validate calculate_entity_graph_async function"""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Relationship', 'TestCalculateRelationship')

    @async_test
    async def test_simple_with_id(self):
        """Non projection scenario with the referenced entity having a primary key"""
        test_name = 'test_simple_with_id'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name, False)

    @async_test
    async def test_without_id_proj(self):
        """Projection scenario with the referenced entity not having any primary key"""
        test_name = 'test_without_id_proj'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name, True)

    @async_test
    async def test_diff_ref_loation(self):
        """Projection scenario with the referenced entity in a different folder"""
        test_name = 'test_diff_ref_location'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name, True)

    @async_test
    async def test_composite_proj(self):
        """Projection with composite keys"""
        test_name = 'test_composite_proj'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name, True)

    @async_test
    async def test_nested_composite_proj(self):
        """Projection with nested composite keys"""
        test_name = 'test_nested_composite_proj'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name, True)

    @async_test
    async def test_polymorphic_without_proj(self):
        """Non projection scenario with selectsSubAttribute set to one"""
        test_name = 'test_polymorphic_without_proj'
        entity_name = 'CustomPerson'

        await self._test_run(test_name, entity_name, False)

    @async_test
    async def test_polymorphic_proj(self):
        """Projection with IsPolymorphicSource property set to true"""
        test_name = 'test_polymorphic_proj'
        entity_name = 'Person'

        await self._test_run(test_name, entity_name, True)

    @async_test
    async def test_composite_key_polymorphic_relationship(self):
        """Test a composite key relationship with a polymorphic entity."""
        test_name = 'test_composite_key_polymorphic_relationship'
        entity_name = 'Person'

        await self._test_run(test_name, entity_name, True)

    @async_test
    async def test_composite_key_polymorphic_relationship(self):
        """Test a composite key relationship with multiple entity attribute but not polymorphic."""
        test_name = 'test_composite_key_non_polymorphic_relationship'
        entity_name = 'Person'

        await self._test_run(test_name, entity_name, True)

    async def _test_run(self, test_name: str, entity_name: str, is_entity_set: bool, update_expected_output: bool = False) -> None:
        """Common test code for these test cases"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        expected_output_folder = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        actual_output_folder = TestHelper.get_actual_output_folder_path(self.tests_subpath, test_name)

        if not os.path.exists(actual_output_folder):
            os.makedirs(actual_output_folder)

        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')
        self.assertIsNotNone(manifest)
        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(entity)
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])
        self._assert_entity_shape_in_resolved_entity(resolved_entity, is_entity_set)

        await AttributeContextUtil.validate_attribute_context(self, expected_output_folder, entity_name, resolved_entity, update_expected_output)

        await corpus.calculate_entity_graph_async(manifest)
        await manifest.populate_manifest_relationships_async()
        actual_relationships_string = self._list_relationships(corpus, entity, actual_output_folder, entity_name)

        relationships_filename = 'REL_{}.txt'.format(entity_name)
        with open(os.path.join(actual_output_folder, relationships_filename), 'w') as actual_file:
            actual_file.write(actual_relationships_string)

        with open(os.path.join(expected_output_folder, relationships_filename)) as expected_file:
            expected_relationships_string = expected_file.read()
        self.assertEqual(expected_relationships_string, actual_relationships_string)

        output_folder = corpus.storage.fetch_root_folder('output')
        output_folder.documents.append(manifest)

        manifest_file_name = 'saved.manifest.cdm.json'
        await manifest.save_as_async(manifest_file_name, True)
        actual_manifest_path = os.path.join(actual_output_folder, manifest_file_name)
        if not os.path.exists(actual_manifest_path):
            self.fail('Unable to save manifest with relationship')
        else:
            saved_manifest = await corpus.fetch_object_async('output:/{}'.format(manifest_file_name))
            actual_saved_manifest_rel = self._get_relationship_strings(saved_manifest.relationships)
            manifest_relationships_filename = 'MANIFEST_REL_{}.txt'.format(entity_name)
            with open(os.path.join(actual_output_folder, manifest_relationships_filename), 'w') as actual_file:
                actual_file.write(actual_saved_manifest_rel)
            with open(os.path.join(expected_output_folder, manifest_relationships_filename)) as expected_file:
                expected_saved_manifest_rel = expected_file.read()
            self.assertEqual(expected_saved_manifest_rel, actual_saved_manifest_rel)

    def _assert_entity_shape_in_resolved_entity(self, resolved_entity: 'CdmEntityDefinition', is_entity_set: bool) \
            -> None:
        for att in resolved_entity.attributes:
            for trait_ref in att.applied_traits:
                if trait_ref.named_reference == 'is.linkedEntity.identifier' and len(trait_ref.arguments) > 0:
                    const_ent = trait_ref.arguments[0].value.fetch_object_definition()
                    if const_ent and const_ent.entity_shape:
                        entity_shape = const_ent.entity_shape.named_reference
                        self.assertEqual('entitySet', entity_shape) if is_entity_set else self.assertEqual('entityGroupSet', entity_shape)
                        return               
        self.fail('Unable to find entity shape from resolved model.')

    def _get_relationship_strings(self, relationships: 'CdmCollection[CdmE2ERelationship]') -> str:
        """Get a string version of the relationship collection"""
        bldr = ''
        for rel in relationships:
            bldr += '{}|{}|{}|{}|{}'.format(rel.relationship_name if rel.relationship_name else '', rel.to_entity,
                                            rel.to_entity_attribute, rel.from_entity, rel.from_entity_attribute)
            bldr += '\n'
        return bldr

    def _get_relationship_string(self, rel: 'CdmE2ERelationship') -> str:
        """Get a string version of the relationship collection"""
        name_and_pipe = ''
        if rel.relationship_name:
            name_and_pipe = rel.relationship_name + '|'

        return '{}{}|{}|{}|{}\n'.format(name_and_pipe, rel.to_entity,
                                        rel.to_entity_attribute, rel.from_entity, rel.from_entity_attribute)

    def _list_relationships(self, corpus: 'CdmCorpusDefinition', entity: 'CdmEntityDefinition', actual_output_folder: str, entity_name: str) -> str:
        """List the incoming and outgoing relationships"""
        bldr = ''
        rel_cache = set()

        bldr += 'Incoming Relationships For: {}:\n'.format(entity.entity_name)
        # Loop through all the relationships where other entities point to this entity.
        for relationship in corpus.fetch_incoming_relationships(entity):
            cache_key = self._get_relationship_string(relationship)
            if cache_key not in rel_cache:
                bldr += self._print_relationship(relationship)
                rel_cache.add(cache_key)

        print('Outgoing Relationships For: {}:'.format(entity.entity_name))
        # Now loop through all the relationships where this entity points to other entities.
        for relationship in corpus.fetch_outgoing_relationships(entity):
            cache_key = self._get_relationship_string(relationship)
            if cache_key not in rel_cache:
                bldr += self._print_relationship(relationship) + '\n'
                rel_cache.add(cache_key)

        return bldr

    def _print_relationship(self, relationship: 'CdmE2ERelationship') -> str:
        """Print the relationship"""
        bldr = ''

        if relationship.relationship_name:
            bldr += '  Name: {}\n'.format(relationship.relationship_name)

        bldr += '  FromEntity: {}\n'.format(relationship.from_entity)
        bldr += '  FromEntityAttribute: {}\n'.format(relationship.from_entity_attribute)
        bldr += '  ToEntity: {}\n'.format(relationship.to_entity)
        bldr += '  ToEntityAttribute: {}\n'.format(relationship.to_entity_attribute)
        
        if relationship.exhibits_traits:
            bldr += '  ExhibitsTraits:\n'
            order_applied_traits = sorted(relationship.exhibits_traits, key=lambda x: x.named_reference)
            for trait in order_applied_traits:
                bldr += '      {}\n'.format(trait.named_reference)

                for args in trait.arguments:
                    attr_ctx_util = AttributeContextUtil()
                    bldr += '          {}\n'.format(attr_ctx_util.get_argument_values_as_strings(args))
            
        bldr += '\n'
        print(bldr)

        return bldr

    def _get_attribute_context_string(self, resolved_entity: 'CdmEntityDefinition', entity_name: str, actual_output_folder: str) -> str:
        """Check the attribute context for these test scenarios"""
        return (AttributeContextUtil()).get_attribute_context_strings(resolved_entity)
