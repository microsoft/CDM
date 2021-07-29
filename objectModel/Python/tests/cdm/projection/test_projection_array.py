# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils



class ProjectionArrayTest(unittest.TestCase):
    """A test class for testing the array type with a set of foundational operations in a projection"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionArray')

    @async_test
    async def test_entity_attribute(self):
        """Test Array type on an entity attribute"""
        test_name = 'test_entity_attribute'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        non_structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ["name", "age", "address"]
        # in non-structured form
        # Expand 1...3;
        # renameFormat = {m}{o};
        # alterTraits = { has.expansionInfo.list(expansionName: "{a}", ordinal: "{o}", memberAttribute: "{m}") , "argumentsContainWildcards" : true }
        # addArtifactAttribute : "personCount"
        # alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "personCount" , "argumentsContainWildcards" : true }
        self.assertEqual(10, len(non_structured_resolved_entity.attributes))
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[0], 'name1', 1, 'ThreePeople', 'name')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[1], 'age1', 1, 'ThreePeople', 'age')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[2], 'address1', 1, 'ThreePeople', 'address')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[3], 'name2', 2, 'ThreePeople', 'name')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[4], 'age2', 2, 'ThreePeople', 'age')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[5], 'address2', 2, 'ThreePeople', 'address')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[6], 'name3', 3, 'ThreePeople', 'name')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[7], 'age3', 3, 'ThreePeople', 'age')
        ProjectionTestUtils.validate_expansion_info_trait(self, non_structured_resolved_entity.attributes[8], 'address3', 3, 'ThreePeople', 'address')
        self.assertEqual("personCount", (non_structured_resolved_entity.attributes[9]).name)
        self.assertEqual("indicates.expansionInfo.count", non_structured_resolved_entity.attributes[9].applied_traits[1].named_reference)
        self.assertEqual("ThreePeople", non_structured_resolved_entity.attributes[9].applied_traits[1].arguments[0].value)

        # Original set of attributes: ["name", "age", "address"]
        # in structured form
        # alterTraits = { is.dataFormat.list }
        # addAttributeGroup: favoriteMusketeers
        structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])
        self.assertEqual(1, len(structured_resolved_entity.attributes))
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, structured_resolved_entity.attributes, 'favoriteMusketeers')
        self.assertIsNotNone(att_group_definition.exhibits_traits.item('is.dataFormat.list'))

    @async_test
    async def test_type_attribute(self):
        """Test Array type on an type attribute"""
        test_name = 'test_type_attribute'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        non_structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ["Favorite Terms"]
        # in non-structured form
        # Expand 1...2;
        # renameFormat = Term {o};
        # alterTraits = { has.expansionInfo.list(expansionName: "{m}", ordinal: "{o}") , "argumentsContainWildcards" : true }
        # addArtifactAttribute : "number of favorite terms"
        # alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "number of favorite terms" , "argumentsContainWildcards" : true }
        self.assertEqual(3, len(non_structured_resolved_entity.attributes))
        self.assertEqual("Term 1", (non_structured_resolved_entity.attributes[0]).name)
        self.assertEqual("Term 2", (non_structured_resolved_entity.attributes[1]).name)
        self.assertEqual("number of favorite terms", (non_structured_resolved_entity.attributes[2]).name)
        self.assertEqual("indicates.expansionInfo.count", non_structured_resolved_entity.attributes[2].applied_traits[1].named_reference)
        self.assertEqual("Favorite Terms", non_structured_resolved_entity.attributes[2].applied_traits[1].arguments[0].value)

        # Original set of attributes: ["Favorite Terms"]
        # in structured form
        # alterTraits = { is.dataFormat.list }
        structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])
        self.assertEqual(1, len(structured_resolved_entity.attributes))
        self.assertEqual("Favorite Terms", (structured_resolved_entity.attributes[0]).name)
        self.assertIsNotNone(structured_resolved_entity.attributes[0].applied_traits.item('is.dataFormat.list'))
