# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import Optional

from cdm.enums import CdmObjectType

from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition, CdmTypeAttributeDefinition, \
    CdmAttributeGroupDefinition, CdmAttributeGroupReference
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionMapTest(unittest.TestCase):
    """A test class for testing the map type with a set of foundational operations in a projection"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionMap')

    @async_test
    async def test_entity_attribute(self):
        """Test map type on an entity attribute"""
        test_name = 'test_entity_attribute'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        non_structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ["name", "age", "address"]
        # in non-structured form
        # addArtifactAttribute : { "key" , "insertAtTop": true }
        # Expand 1...3;
        # renameAttributes = { {a}_{o}_key, apply to "key" }
        # renameAttributes = { {a}_{m}_{o}_value, apply to "name", "age", "address" }
        # alterTraits = { indicates.expansionInfo.mapKey(expansionName: "{a}", ordinal: "{o}") , apply to "key" , "argumentsContainWildcards" : true }
        # alterTraits = { has.expansionInfo.mapValue(expansionName: "{a}", ordinal: "{o}", memberAttribute: "{m}") , apply to "name", "age", "address"  , "argumentsContainWildcards" : true }
        # addArtifactAttribute : "personCount"
        # alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "personCount" , "argumentsContainWildcards" : true }
        self.assertEqual(13, len(non_structured_resolved_entity.attributes))
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[0], 'ThreePeople_1_key', 1, 'ThreePeople', is_key=True)
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[1], 'ThreePeople_name_1_value', 1, 'ThreePeople', 'name')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[2], 'ThreePeople_age_1_value', 1, 'ThreePeople', 'age')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[3], 'ThreePeople_address_1_value', 1, 'ThreePeople', 'address')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[4], 'ThreePeople_2_key', 2, 'ThreePeople', is_key=True)
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[5], 'ThreePeople_name_2_value', 2, 'ThreePeople', 'name')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[6], 'ThreePeople_age_2_value', 2, 'ThreePeople', 'age')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[7], 'ThreePeople_address_2_value', 2, 'ThreePeople', 'address')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[8], 'ThreePeople_3_key', 3, 'ThreePeople', is_key=True)
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[9], 'ThreePeople_name_3_value', 3, 'ThreePeople', 'name')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[10], 'ThreePeople_age_3_value', 3, 'ThreePeople', 'age')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[11], 'ThreePeople_address_3_value', 3, 'ThreePeople', 'address')
        self.assertEqual("personCount", (non_structured_resolved_entity.attributes[12]).name)
        self.assertEqual("indicates.expansionInfo.count", non_structured_resolved_entity.attributes[12].applied_traits[1].named_reference)
        self.assertEqual("ThreePeople", non_structured_resolved_entity.attributes[12].applied_traits[1].arguments[0].value)

        # Original set of attributes: ["name", "age", "address"]
        # in structured form
        # addAttributeGroup: favorite people
        # alterTraits = { is.dataFormat.mapValue }
        # addArtifactAttribute : { "favorite People Key" (with trait "is.dataFormat.mapKey") , "insertAtTop": true }
        # addAttributeGroup: favorite People Group
        # alterTraits = { is.dataFormat.map }
        structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])
        self.assertEqual(1, len(structured_resolved_entity.attributes))
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, structured_resolved_entity.attributes, 'favorite People Group')  # type: CdmAttributeGroupDefinition
        self.assertIsNotNone(att_group_definition.exhibits_traits.item('is.dataFormat.map'))
        self.assertEqual("favorite People Key", att_group_definition.members[0].name)
        self.assertIsNotNone(att_group_definition.members[0].applied_traits.item('is.dataFormat.mapKey'))
        self.assertEqual(CdmObjectType.ATTRIBUTE_GROUP_REF, att_group_definition.members[1].object_type)
        inner_att_group_ref = att_group_definition.members[1]  # type: CdmAttributeGroupReference
        self.assertIsNotNone(inner_att_group_ref.explicit_reference)
        inner_att_group_definition = inner_att_group_ref.explicit_reference  # type: CdmAttributeGroupDefinition
        self.assertEqual('favorite people', inner_att_group_definition.attribute_group_name)
        self.assertIsNotNone(inner_att_group_definition.exhibits_traits.item('is.dataFormat.mapValue'))

    @async_test
    async def test_type_attribute(self):
        """Test map type on a type attribute"""
        test_name = 'test_type_attribute'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        non_structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ["Favorite Terms"]
        # in non-structured form
        # addArtifactAttribute : { "Term key" , "insertAtTop": true }
        # Expand 1...2;
        # renameAttributes = { {m}_{o}_key, apply to "Term key" }
        # renameAttributes = { {m}_{o}_value, apply to "FavoriteTerms" }
        # alterTraits = { indicates.expansionInfo.mapKey(expansionName: "{a}", ordinal: "{o}") , apply to "Term key" , "argumentsContainWildcards" : true }
        # alterTraits = { has.expansionInfo.mapValue(expansionName: "{m}", ordinal: "{o}") , apply to "FavoriteTerms"  , "argumentsContainWildcards" : true }
        # addArtifactAttribute : number of favorite terms"
        # alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "number of favorite terms" , "argumentsContainWildcards" : true }
        self.assertEqual(5, len(non_structured_resolved_entity.attributes))
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[0], 'Term key_1_key', 1, 'FavoriteTerms', is_key=True)
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[1], 'FavoriteTerms_1_value', 1, 'FavoriteTerms')
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[2], 'Term key_2_key', 2, 'FavoriteTerms', is_key=True)
        self.validate_attribute_trait(non_structured_resolved_entity.attributes[3], 'FavoriteTerms_2_value', 2, 'FavoriteTerms')
        self.assertEqual("number of favorite terms", (non_structured_resolved_entity.attributes[4]).name)
        self.assertEqual("indicates.expansionInfo.count", non_structured_resolved_entity.attributes[4].applied_traits[1].named_reference)
        self.assertEqual("FavoriteTerms", non_structured_resolved_entity.attributes[4].applied_traits[1].arguments[0].value)

        # Original set of attributes: ["Favorite Terms"]
        # in structured form
        # alterTraits = { is.dataFormat.list }
        structured_resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])
        self.assertEqual(1, len(structured_resolved_entity.attributes))
        att_group_definition = ProjectionTestUtils.validate_attribute_group(self, structured_resolved_entity.attributes, 'favorite Term Group')  # type: CdmAttributeGroupDefinition
        self.assertIsNotNone(att_group_definition.exhibits_traits.item('is.dataFormat.map'))
        self.assertEqual("Favorite Terms Key", att_group_definition.members[0].name)
        self.assertIsNotNone(att_group_definition.members[0].applied_traits.item('is.dataFormat.mapKey'))
        self.assertEqual("FavoriteTerms", att_group_definition.members[1].name)
        self.assertIsNotNone(att_group_definition.members[1].applied_traits.item('is.dataFormat.mapValue'))

    def validate_attribute_trait(self, attribute: 'CdmTypeAttributeDefinition', expected_attr_name: str, ordinal: int,
                                 expansion_name: str, member_attribute: Optional[str] = None, is_key: Optional[bool] = False):
        self.assertEqual(expected_attr_name, attribute.name)
        trait = attribute.applied_traits.item('indicates.expansionInfo.mapKey' if is_key else 'has.expansionInfo.mapValue')
        self.assertIsNotNone(trait)
        self.assertEqual(expansion_name, trait.arguments.fetch_value('expansionName'))
        self.assertEqual(str(ordinal), trait.arguments.fetch_value('ordinal'))
        self.assertEqual(member_attribute, trait.arguments.fetch_value('memberAttribute'))