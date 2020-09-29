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

        await self._test_run(test_name, entity_name)

    @async_test
    async def test_simple_without_id(self):
        """Non projection scenario with the referenced entity not having any primary key"""
        test_name = 'test_simple_without_id'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name)

    @async_test
    async def test_without_id_proj(self):
        """Projection scenario with the referenced entity not having any primary key"""
        test_name = 'test_without_id_proj'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name)

    @async_test
    async def test_composite_proj(self):
        """Projection with composite keys"""
        test_name = 'test_composite_proj'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name)

    @async_test
    async def test_nested_composite_proj(self):
        """Projection with nested composite keys"""
        test_name = 'test_nested_composite_proj'
        entity_name = 'Sales'

        await self._test_run(test_name, entity_name)

    @async_test
    async def test_polymorphic_proj(self):
        """Projection with IsPolymorphicSource property set to true"""
        test_name = 'test_polymorphic_proj'
        entity_name = 'Person'

        await self._test_run(test_name, entity_name)

    async def _test_run(self, test_name: str, entity_name: str) -> None:
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
        actual_attr_ctx = self._get_attribute_context_string(resolved_entity, entity_name, actual_output_folder)

        with open(os.path.join(expected_output_folder, 'AttrCtx_{}.txt'.format(entity_name))) as expected_file:
            expected_attr_ctx = expected_file.read()
        self.assertEqual(expected_attr_ctx, actual_attr_ctx)

        await corpus.calculate_entity_graph_async(manifest)
        await manifest.populate_manifest_relationships_async()
        actual_relationships_string = self._list_relationships(corpus, entity, actual_output_folder, entity_name)

        with open(os.path.join(expected_output_folder, 'REL_{}.txt'.format(entity_name))) as expected_file:
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
            with open(os.path.join(expected_output_folder, 'MANIFEST_REL_{}.txt'.format(entity_name))) as expected_file:
                expected_saved_manifest_rel = expected_file.read()
            self.assertEqual(expected_saved_manifest_rel, actual_saved_manifest_rel)

    def _get_relationship_strings(self, relationships: 'CdmCollection[CdmE2ERelationship]') -> str:
        """Get a string version of the relationship collection"""
        bldr = ''
        for rel in relationships:
            bldr += '{}|{}|{}|{}|{}'.format(rel.relationship_name if rel.relationship_name else '', rel.to_entity,
                                            rel.to_entity_attribute, rel.from_entity, rel.from_entity_attribute)
            bldr += '\n'
        return bldr

    def _list_relationships(self, corpus: 'CdmCorpusDefinition', entity: 'CdmEntityDefinition', actual_output_folder: str, entity_name: str) -> str:
        """List the incoming and outgoing relationships"""
        bldr = ''

        bldr += 'Incoming Relationships For: {}:'.format(entity.entity_name)
        bldr += '\n'
        # Loop through all the relationships where other entities point to this entity.
        for relationship in corpus.fetch_incoming_relationships(entity):
            bldr += self._print_relationship(relationship)

        print('Outgoing Relationships For: {}:'.format(entity.entity_name))
        # Now loop through all the relationships where this entity points to other entities.
        for relationship in corpus.fetch_outgoing_relationships(entity):
            bldr += self._print_relationship(relationship)
            bldr += '\n'

        return bldr

    def _print_relationship(self, relationship: 'CdmE2ERelationship') -> str:
        """Print the relationship"""
        bldr = ''

        if relationship.relationship_name:
            bldr += '  Name: {}'.format(relationship.relationship_name)
            bldr += '\n'

        bldr += '  FromEntity: {}'.format(relationship.from_entity)
        bldr += '\n'
        bldr += '  FromEntityAttribute: {}'.format(relationship.from_entity_attribute)
        bldr += '\n'
        bldr += '  ToEntity: {}'.format(relationship.to_entity)
        bldr += '\n'
        bldr += '  ToEntityAttribute: {}'.format(relationship.to_entity_attribute)
        bldr += '\n'
        bldr += '\n'
        print(bldr)

        return bldr

    def _get_attribute_context_string(self, resolved_entity: 'CdmEntityDefinition', entity_name: str, actual_output_folder: str) -> str:
        """Check the attribute context for these test scenarios"""
        return (AttributeContextUtil()).get_attribute_context_strings(resolved_entity, resolved_entity.attribute_context)
