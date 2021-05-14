# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import List

from cdm.enums import CdmObjectType, CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition, CdmFolderDefinition, CdmEntityDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionExpansionTest(unittest.TestCase):
    """A test class for testing the ArrayExpansion operation in a projection as well as Expansion in a resolution guidance"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionExpansion')

    @async_test
    async def test_entity_attribute_proj_using_object_model(self):
        """Test for creating a projection with an ArrayExpansion operation on an entity attribute using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_attribute_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an ArrayExpansion operation
        array_expansion_op = corpus.make_object(CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF)
        array_expansion_op.start_ordinal = 1
        array_expansion_op.end_ordinal = 2
        projection.operations.append(array_expansion_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        projection2 = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection2.source = projection_entity_ref

        # Create a RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)
        rename_attrs_op.rename_format = '{m}{o}'
        projection2.operations.append(rename_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref2 = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref2.explicit_reference = projection2

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')
        entity_attribute.entity = projection_entity_ref2
        entity.attributes.append(entity_attribute)

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the projections
        # Original set of attributes: ["id", "name", "value", "date"]
        # Expand 1...2, renameFormat = {m}{o}
        self.assertEqual(8, len(resolved_entity.attributes))
        self.assertEqual('id1', resolved_entity.attributes[0].name)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('value1', resolved_entity.attributes[2].name)
        self.assertEqual('date1', resolved_entity.attributes[3].name)
        self.assertEqual('id2', resolved_entity.attributes[4].name)
        self.assertEqual('name2', resolved_entity.attributes[5].name)
        self.assertEqual('value2', resolved_entity.attributes[6].name)
        self.assertEqual('date2', resolved_entity.attributes[7].name)

    @async_test
    async def test_entity_proj_using_object_model(self):
        """Test for creating a projection with an ArrayExpansion operation on an entity definition using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_entity_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_entity_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)

        # Create an ArrayExpansion operation
        array_expansion_op = corpus.make_object(CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF)
        array_expansion_op.start_ordinal = 1
        array_expansion_op.end_ordinal = 2
        projection.operations.append(array_expansion_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        projection2 = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection2.source = projection_entity_ref

        # Create a RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)
        rename_attrs_op.rename_format = '{m}{o}'
        projection2.operations.append(rename_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref2 = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref2.explicit_reference = projection2

        # Set the entity's ExtendEntity to be the projection
        entity.extends_entity = projection_entity_ref2

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)

        # Verify correctness of the resolved attributes after running the projections
        # Original set of attributes: ["id", "name", "value", "date"]
        # Expand 1...2, renameFormat = {m}{o}
        self.assertEqual(8, len(resolved_entity.attributes))
        self.assertEqual('id1', resolved_entity.attributes[0].name)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('value1', resolved_entity.attributes[2].name)
        self.assertEqual('date1', resolved_entity.attributes[3].name)
        self.assertEqual('id2', resolved_entity.attributes[4].name)
        self.assertEqual('name2', resolved_entity.attributes[5].name)
        self.assertEqual('value2', resolved_entity.attributes[6].name)
        self.assertEqual('date2', resolved_entity.attributes[7].name)

    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an ArrayExpansion operation and a condition using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_conditional_proj_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_conditional_proj_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        projection = ProjectionTestUtils.create_projection(corpus, local_root)
        projection.condition = 'referenceOnly==True'

        # Create an ArrayExpansion operation
        array_expansion_op = corpus.make_object(CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF)
        array_expansion_op.start_ordinal = 1
        array_expansion_op.end_ordinal = 2
        projection.operations.append(array_expansion_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref.explicit_reference = projection

        # Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        projection2 = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection2.source = projection_entity_ref

        # Create a RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)
        rename_attrs_op.rename_format = '{m}{o}'
        projection2.operations.append(rename_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref2 = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_entity_ref2.explicit_reference = projection2

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')
        entity_attribute.entity = projection_entity_ref2
        entity.attributes.append(entity_attribute)

        # Create resolution options with the 'referenceOnly' directive
        res_opt = ResolveOptions(entity.in_document)
        res_opt.directives = AttributeResolutionDirectiveSet(set(['referenceOnly']))

        # Resolve the entity with 'referenceOnly'
        resolved_entity_with_reference_only = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the projections
        # Original set of attributes: ["id", "name", "value", "date"]
        # Expand 1...2, renameFormat = {m}{o}
        self.assertEqual(8, len(resolved_entity_with_reference_only.attributes))
        self.assertEqual('id1', resolved_entity_with_reference_only.attributes[0].name)
        self.assertEqual('name1', resolved_entity_with_reference_only.attributes[1].name)
        self.assertEqual('value1', resolved_entity_with_reference_only.attributes[2].name)
        self.assertEqual('date1', resolved_entity_with_reference_only.attributes[3].name)
        self.assertEqual('id2', resolved_entity_with_reference_only.attributes[4].name)
        self.assertEqual('name2', resolved_entity_with_reference_only.attributes[5].name)
        self.assertEqual('value2', resolved_entity_with_reference_only.attributes[6].name)
        self.assertEqual('date2', resolved_entity_with_reference_only.attributes[7].name)

        # Now resolve the entity with the default directives
        res_opt.directives = AttributeResolutionDirectiveSet(set([]))
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Verify correctness of the resolved attributes after running the projections
        # Original set of attributes: ["id", "name", "value", "date"]
        # Expand 1...2, renameFormat = {m}{o}
        self.assertEqual(4, len(resolved_entity_with_structured.attributes))
        self.assertEqual('id', resolved_entity_with_structured.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_structured.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_structured.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_structured.attributes[3].name)

    @async_test
    async def test_expansion(self):
        """Expansion on an entity attribute"""
        test_name = 'test_expansion'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}
        self.assertEqual(10, len(resolved_entity.attributes))
        self.assertEqual('count', resolved_entity.attributes[0].name)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('age1', resolved_entity.attributes[2].name)
        self.assertEqual('address1', resolved_entity.attributes[3].name)
        self.assertEqual('name2', resolved_entity.attributes[4].name)
        self.assertEqual('age2', resolved_entity.attributes[5].name)
        self.assertEqual('address2', resolved_entity.attributes[6].name)
        self.assertEqual('name3', resolved_entity.attributes[7].name)
        self.assertEqual('age3', resolved_entity.attributes[8].name)
        self.assertEqual('address3', resolved_entity.attributes[9].name)

    @async_test
    async def test_entity_attribute(self):
        """ArrayExpansion on an entity attribute"""
        test_name = 'test_entity_attribute'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}
        self.assertEqual(9, len(resolved_entity.attributes))
        self.assertEqual('name1', resolved_entity.attributes[0].name)
        self.assertEqual('age1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)
        self.assertEqual('name2', resolved_entity.attributes[3].name)
        self.assertEqual('age2', resolved_entity.attributes[4].name)
        self.assertEqual('address2', resolved_entity.attributes[5].name)
        self.assertEqual('name3', resolved_entity.attributes[6].name)
        self.assertEqual('age3', resolved_entity.attributes[7].name)
        self.assertEqual('address3', resolved_entity.attributes[8].name)

    @async_test
    async def test_proj_no_rename(self):
        """ArrayExpansion on an entity attribute without a RenameAttributes"""
        test_name = 'test_proj_no_rename'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3
        # Since there's no rename, the expanded attributes just get merged together
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)

    @async_test
    async def test_extends_entity(self):
        """
        Expansion on an entity definition
        NOTE: This is not supported in resolution guidance
        """
        test_name = 'test_extends_entity'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}
        # ExtendsEntityResolutionGuidance doesn't support doing expansions, so we only get "count" here
        self.assertEqual(1, len(resolved_entity.attributes))
        self.assertEqual('count', resolved_entity.attributes[0].name)

    @async_test
    async def test_extends_entity_proj(self):
        """ArrayExpansion on an entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}
        self.assertEqual(9, len(resolved_entity.attributes))
        self.assertEqual('name1', resolved_entity.attributes[0].name)
        self.assertEqual('age1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)
        self.assertEqual('name2', resolved_entity.attributes[3].name)
        self.assertEqual('age2', resolved_entity.attributes[4].name)
        self.assertEqual('address2', resolved_entity.attributes[5].name)
        self.assertEqual('name3', resolved_entity.attributes[6].name)
        self.assertEqual('age3', resolved_entity.attributes[7].name)
        self.assertEqual('address3', resolved_entity.attributes[8].name)

    @async_test
    async def test_nested_proj(self):
        """Nested projections with ArrayExpansion"""
        test_name = 'test_nested_proj'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3 and then 1...2, renameFormat = {m}_{o}
        self.assertEqual(18, len(resolved_entity.attributes))
        self.assertEqual('name_1_1', resolved_entity.attributes[0].name)
        self.assertEqual('age_1_1', resolved_entity.attributes[1].name)
        self.assertEqual('address_1_1', resolved_entity.attributes[2].name)
        self.assertEqual('name_2_1', resolved_entity.attributes[3].name)
        self.assertEqual('age_2_1', resolved_entity.attributes[4].name)
        self.assertEqual('address_2_1', resolved_entity.attributes[5].name)
        self.assertEqual('name_3_1', resolved_entity.attributes[6].name)
        self.assertEqual('age_3_1', resolved_entity.attributes[7].name)
        self.assertEqual('address_3_1', resolved_entity.attributes[8].name)
        self.assertEqual('name_1_2', resolved_entity.attributes[9].name)
        self.assertEqual('age_1_2', resolved_entity.attributes[10].name)
        self.assertEqual('address_1_2', resolved_entity.attributes[11].name)
        self.assertEqual('name_2_2', resolved_entity.attributes[12].name)
        self.assertEqual('age_2_2', resolved_entity.attributes[13].name)
        self.assertEqual('address_2_2', resolved_entity.attributes[14].name)
        self.assertEqual('name_3_2', resolved_entity.attributes[15].name)
        self.assertEqual('age_3_2', resolved_entity.attributes[16].name)
        self.assertEqual('address_3_2', resolved_entity.attributes[17].name)

    @async_test
    async def test_negative_start_ordinal(self):
        """Start and end ordinals of -2...2"""
        test_name = 'test_negative_start_ordinal'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand -2...2, renameFormat = {m}{o}
        # Since we don't allow negative ordinals, output should be 0...2
        self.assertEqual(9, len(resolved_entity.attributes))
        self.assertEqual('name0', resolved_entity.attributes[0].name)
        self.assertEqual('age0', resolved_entity.attributes[1].name)
        self.assertEqual('address0', resolved_entity.attributes[2].name)
        self.assertEqual('name1', resolved_entity.attributes[3].name)
        self.assertEqual('age1', resolved_entity.attributes[4].name)
        self.assertEqual('address1', resolved_entity.attributes[5].name)
        self.assertEqual('name2', resolved_entity.attributes[6].name)
        self.assertEqual('age2', resolved_entity.attributes[7].name)
        self.assertEqual('address2', resolved_entity.attributes[8].name)

    @async_test
    async def test_start_GT_end_ordinal(self):
        """Start ordinal greater than end ordinal"""
        test_name = 'test_start_GT_end_ordinal'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        # A warning should be logged when startOrdinal > endOrdinal
        def callback(level: 'CdmStatusLevel', message: str):
            if message.find('startOrdinal 2 should not be greater than endOrdinal 0') == -1:
                self.fail('Some unexpected failure - {}!'.format(message))
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 2...0, renameFormat = {m}{o}
        # No array expansion happens here so the input just passes through
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)

    @async_test
    async def test_same_start_end_ordinals(self):
        """Same start and end ordinals"""
        test_name = 'test_same_start_end_ordinals'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...1, renameFormat = {m}{o}
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('name1', resolved_entity.attributes[0].name)
        self.assertEqual('age1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)

    @async_test
    async def test_combine_ops(self):
        """Combine ArrayExpansion, RenameAttributes, and IncludeAttributes in a single projection"""
        test_name = 'test_combine_ops'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}, include [name, age1]
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('name1', resolved_entity.attributes[0].name)
        self.assertEqual('age1', resolved_entity.attributes[1].name)
        self.assertEqual('name2', resolved_entity.attributes[2].name)
        self.assertEqual('name3', resolved_entity.attributes[3].name)

    @async_test
    async def test_polymorphic(self):
        """Expansion on a polymorphic source"""
        test_name = 'test_polymorphic'
        entity_name = 'BusinessPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
        # Expand 1...2, renameFormat = {m}{o}
        self.assertEqual(11, len(resolved_entity.attributes))
        self.assertEqual('count', resolved_entity.attributes[0].name)
        self.assertEqual('emailId1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)
        self.assertEqual('isPrimary1', resolved_entity.attributes[3].name)
        self.assertEqual('phoneId1', resolved_entity.attributes[4].name)
        self.assertEqual('number1', resolved_entity.attributes[5].name)
        self.assertEqual('emailId2', resolved_entity.attributes[6].name)
        self.assertEqual('address2', resolved_entity.attributes[7].name)
        self.assertEqual('isPrimary2', resolved_entity.attributes[8].name)
        self.assertEqual('phoneId2', resolved_entity.attributes[9].name)
        self.assertEqual('number2', resolved_entity.attributes[10].name)

    @async_test
    async def test_polymorphic_proj(self):
        """ArrayExpansion on a polymorphic source"""
        test_name = 'test_polymorphic_proj'
        entity_name = 'BusinessPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            if 'structured' in res_opt:
                # Array expansion is not supported on an attribute group yet.
                continue
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
        # Expand 1...2, renameFormat = {m}{o}
        self.assertEqual(10, len(resolved_entity.attributes))
        self.assertEqual('emailId1', resolved_entity.attributes[0].name)
        self.assertEqual('address1', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary1', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId1', resolved_entity.attributes[3].name)
        self.assertEqual('number1', resolved_entity.attributes[4].name)
        self.assertEqual('emailId2', resolved_entity.attributes[5].name)
        self.assertEqual('address2', resolved_entity.attributes[6].name)
        self.assertEqual('isPrimary2', resolved_entity.attributes[7].name)
        self.assertEqual('phoneId2', resolved_entity.attributes[8].name)
        self.assertEqual('number2', resolved_entity.attributes[9].name)

    @async_test
    async def test_array_source(self):
        """
        Expansion on an array source
        NOTE: This is not supported in resolution guidance due to ordinals from a previous resolution guidance
        not being removed for the next resolution guidance, resulting in ordinals being skipped over in the new
        resolution guidance as it thinks it has already done that round
        """
        test_name = 'test_array_source'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
        # Expand 1...2, renameFormat = {m}_{o}
        # Since resolution guidance doesn't support doing an expansion on an array source, we end up with the
        # following result where it skips expanding attributes with the same ordinal (ex. name1_1, name2_2)
        self.assertEqual(9, len(resolved_entity.attributes))
        self.assertEqual('count_', resolved_entity.attributes[0].name)
        self.assertEqual('personCount_1', resolved_entity.attributes[1].name)
        self.assertEqual('name2_1', resolved_entity.attributes[2].name)
        self.assertEqual('age2_1', resolved_entity.attributes[3].name)
        self.assertEqual('address2_1', resolved_entity.attributes[4].name)
        self.assertEqual('personCount_2', resolved_entity.attributes[5].name)
        self.assertEqual('name1_2', resolved_entity.attributes[6].name)
        self.assertEqual('age1_2', resolved_entity.attributes[7].name)
        self.assertEqual('address1_2', resolved_entity.attributes[8].name)

    @async_test
    async def test_array_source_proj(self):
        """ArrayExpansion on an array source"""
        test_name = 'test_array_source_proj'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
        # Expand 1...2, renameFormat = {m}_{o}
        self.assertEqual(14, len(resolved_entity.attributes))
        self.assertEqual('personCount_1', resolved_entity.attributes[0].name)
        self.assertEqual('name1_1', resolved_entity.attributes[1].name)
        self.assertEqual('age1_1', resolved_entity.attributes[2].name)
        self.assertEqual('address1_1', resolved_entity.attributes[3].name)
        self.assertEqual('name2_1', resolved_entity.attributes[4].name)
        self.assertEqual('age2_1', resolved_entity.attributes[5].name)
        self.assertEqual('address2_1', resolved_entity.attributes[6].name)
        self.assertEqual('personCount_2', resolved_entity.attributes[7].name)
        self.assertEqual('name1_2', resolved_entity.attributes[8].name)
        self.assertEqual('age1_2', resolved_entity.attributes[9].name)
        self.assertEqual('address1_2', resolved_entity.attributes[10].name)
        self.assertEqual('name2_2', resolved_entity.attributes[11].name)
        self.assertEqual('age2_2', resolved_entity.attributes[12].name)
        self.assertEqual('address2_2', resolved_entity.attributes[13].name)

    @async_test
    async def test_group(self):
        """Expansion on an entity with an attribute group"""
        test_name = 'test_group'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}
        self.assertEqual(10, len(resolved_entity.attributes))
        self.assertEqual('count', resolved_entity.attributes[0].name)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('age1', resolved_entity.attributes[2].name)
        self.assertEqual('address1', resolved_entity.attributes[3].name)
        self.assertEqual('name2', resolved_entity.attributes[4].name)
        self.assertEqual('age2', resolved_entity.attributes[5].name)
        self.assertEqual('address2', resolved_entity.attributes[6].name)
        self.assertEqual('name3', resolved_entity.attributes[7].name)
        self.assertEqual('age3', resolved_entity.attributes[8].name)
        self.assertEqual('address3', resolved_entity.attributes[9].name)

    @async_test
    async def test_group_proj(self):
        """ArrayExpansion on an entity with an attribute group"""
        test_name = 'test_group_proj'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}
        self.assertEqual(9, len(resolved_entity.attributes))
        self.assertEqual('name1', resolved_entity.attributes[0].name)
        self.assertEqual('age1', resolved_entity.attributes[1].name)
        self.assertEqual('address1', resolved_entity.attributes[2].name)
        self.assertEqual('name2', resolved_entity.attributes[3].name)
        self.assertEqual('age2', resolved_entity.attributes[4].name)
        self.assertEqual('address2', resolved_entity.attributes[5].name)
        self.assertEqual('name3', resolved_entity.attributes[6].name)
        self.assertEqual('age3', resolved_entity.attributes[7].name)
        self.assertEqual('address3', resolved_entity.attributes[8].name)

    @async_test
    async def test_conditional_proj(self):
        """ArrayExpansion with a condition"""
        test_name = 'test_conditional_proj'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

        # Original set of attributes: ["name", "age", "address"]
        # Expand 1...3, renameFormat = {m}{o}
        # No array expansion, condition was false
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
