# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.storage import LocalAdapter

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition, CdmAttributeGroupDefinition, \
    CdmTypeAttributeDefinition, CdmAttributeGroupReference, CdmTraitReference, CdmOperationAlterTraits, CdmProjection
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionAlterTraitsTest(unittest.TestCase):
    """A test class for testing the AlterTraits operation in a projection"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'ProjectionAlterTraitsTest')

    trait_group_file_path = os.path.join('..', '..', 'testData', 'Cdm', 'Projection', 'ProjectionAlterTraitsTest')

    @async_test
    async def test_alter_traits_on_type_attr_proj(self):
        """Test AlterTraits on an type attribute"""
        test_name = 'test_alter_traits_on_type_attr_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        self.assertEqual(1, len(resolved_entity.attributes))
        self.validate_trait(resolved_entity.attributes[0], 'FavoriteTerm', True)

    @async_test
    async def test_alter_traits_on_enti_attr_proj(self):
        """Test AlterTraits on an entity attribute"""
        test_name = 'test_alter_traits_on_enti_attr_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        self.assertEqual(5, len(resolved_entity.attributes))
        self.validate_trait(resolved_entity.attributes[0], 'name', True)
        self.validate_trait(resolved_entity.attributes[1], 'age')
        self.validate_trait(resolved_entity.attributes[2], 'address')
        self.validate_trait(resolved_entity.attributes[3], 'phoneNumber')
        self.validate_trait(resolved_entity.attributes[4], 'email')

    @async_test
    async def test_alter_traits_on_attr_grp_proj(self):
        """Test AlterTraits on an attribute group"""
        test_name = 'test_alter_traits_on_attr_grp_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        att_group_reference = resolved_entity.attributes[0]  # type: CdmAttributeGroupReference
        att_group_definition = att_group_reference.explicit_reference  # type: CdmAttributeGroupDefinition
        self.assertEqual(5, len(att_group_definition.members))
        self.assertIsNotNone(att_group_definition.exhibits_traits.item('means.TraitG100'))
        self.assertIsNotNone(att_group_definition.exhibits_traits.item("means.TraitG200"))
        self.assertIsNone(att_group_definition.exhibits_traits.item("means.TraitG300"))
        self.assertIsNotNone(att_group_definition.exhibits_traits.item("means.TraitG400"))
        trait_g4 = att_group_definition.exhibits_traits.item('means.TraitG4')
        self.assertIsNotNone(trait_g4)
        self.assertEqual(trait_g4.arguments.fetch_value('precision'), '5')
        self.assertEqual(trait_g4.arguments.fetch_value('scale'), '15')

    @async_test
    async def test_combine_ops_nested_proj(self):
        """Test AlterTraits operation nested with IncludeAttributes and RenameAttribute"""
        test_name = 'test_combine_ops_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Include attributes: ["age", "phoneNumber", "name"]
        # Add attribute: ["newName"]
        # alter traits on ["newName", "name", + { "means.TraitG100" , "JobTitleBase" } - { "means.TraitG300" } ]
        # Rename attribute ["newName" -> "renaming-{m}" ]
        # alter traits on ["renaming-newName", + { "means.TraitG4(precision:5, scale:15)" } ]
        self.assertEqual(4, len(resolved_entity.attributes))
        self.validate_trait(resolved_entity.attributes[0], 'age', False, True)
        self.validate_trait(resolved_entity.attributes[1], 'phoneNumber', False, True)
        self.validate_trait(resolved_entity.attributes[2], 'name')
        self.validate_trait(resolved_entity.attributes[3], 'renaming-newName', True)

    @async_test
    async def test_conditional_proj(self):
        """Test AddArtifactAttribute operation with a 'structured' condition"""
        test_name = 'test_conditional_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'referenceOnly' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition not met, no traits are added
        self.assertEqual(5, len(resolved_entity.attributes))
        self.validate_trait(resolved_entity.attributes[0], 'name', False, True)
        self.validate_trait(resolved_entity.attributes[1], 'age', False, True)
        self.validate_trait(resolved_entity.attributes[2], 'address', False, True)
        self.validate_trait(resolved_entity.attributes[3], 'phoneNumber', False, True)
        self.validate_trait(resolved_entity.attributes[4], 'email', False, True)

        resolved_entity2 = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition met, new traits are added
        self.assertEqual(5, len(resolved_entity2.attributes))
        self.validate_trait(resolved_entity2.attributes[0], 'name', True)
        self.validate_trait(resolved_entity2.attributes[1], 'age')
        self.validate_trait(resolved_entity2.attributes[2], 'address')
        self.validate_trait(resolved_entity2.attributes[3], 'phoneNumber')
        self.validate_trait(resolved_entity2.attributes[4], 'email')

    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an AddArtifactAttribute operation and a condition using the object model"""
        test_name = 'test_conditional_proj_using_object_model'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)
        local_root = corpus.storage.fetch_root_folder('local')
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        # Create an entity.
        entity = ProjectionTestUtils.create_entity(corpus, local_root)
        entity.in_document.imports.append('traitGroup:/TraitGroup.cdm.json')

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection
        projection.condition = 'structured==true'
        projection.run_sequentially = True

        # Create an AlterTraits operation
        alter_traits_op_1 = corpus.make_object(CdmObjectType.OPERATION_ALTER_TRAITS_DEF)  # type: CdmOperationAlterTraits
        alter_traits_op_1.traits_to_add = []
        alter_traits_op_1.traits_to_add.append(corpus.make_ref(CdmObjectType.TRAIT_REF, "means.TraitG100", True))
        alter_traits_op_1.traits_to_add.append(corpus.make_ref(CdmObjectType.TRAIT_GROUP_REF, "JobTitleBase", True))
        alter_traits_op_1.traits_to_remove = []
        alter_traits_op_1.traits_to_remove.append(corpus.make_ref(CdmObjectType.TRAIT_REF, "means.TraitG300", True))
        projection.operations.append(alter_traits_op_1)

        alter_traits_op_2 = corpus.make_object(CdmObjectType.OPERATION_ALTER_TRAITS_DEF)  # type: CdmOperationAlterTraits
        alter_traits_op_2.traits_to_add = []
        trait_g4 = corpus.make_ref(CdmObjectType.TRAIT_REF, "means.TraitG4", True)  # type: CdmTraitReference
        trait_g4.arguments.append('precision', '5')
        trait_g4.arguments.append('scale', '15')
        alter_traits_op_2.traits_to_add.append(trait_g4)
        alter_traits_op_2.apply_to = []
        alter_traits_op_2.apply_to.append('name')
        projection.operations.append(alter_traits_op_2)

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

        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Condition not met, no traits are added
        self.assertEqual(4, len(resolved_entity_with_reference_only.attributes))
        self.validate_trait(resolved_entity_with_reference_only.attributes[0], 'id', False, True)
        self.validate_trait(resolved_entity_with_reference_only.attributes[1], 'name', False, True)
        self.validate_trait(resolved_entity_with_reference_only.attributes[2], 'value', False, True)
        self.validate_trait(resolved_entity_with_reference_only.attributes[3], 'date', False, True)

        # Now resolve the entity with the 'structured' directive
        res_opt.directives = AttributeResolutionDirectiveSet({'structured'})
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Condition met, new traits are added
        self.assertEqual(4, len(resolved_entity_with_structured.attributes))
        self.validate_trait(resolved_entity_with_structured.attributes[0], 'id')
        self.validate_trait(resolved_entity_with_structured.attributes[1], 'name', True)
        self.validate_trait(resolved_entity_with_structured.attributes[2], 'value')
        self.validate_trait(resolved_entity_with_structured.attributes[3], 'date')

    @async_test
    async def test_extends_entity_proj(self):
        """Test AlterTraits operation on an extended entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'Child'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(5, len(resolved_entity.attributes))
        self.validate_trait(resolved_entity.attributes[0], 'name', True)
        self.validate_trait(resolved_entity.attributes[1], 'age')
        self.validate_trait(resolved_entity.attributes[2], 'address')
        self.validate_trait(resolved_entity.attributes[3], 'phoneNumber')
        self.validate_trait(resolved_entity.attributes[4], 'email')

    @async_test
    async def test_multiple_op_proj(self):
        """Multiple AlterTraits operations on the same projection"""
        test_name = 'test_multiple_op_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(5, len(resolved_entity.attributes))
        self.validate_trait(resolved_entity.attributes[0], 'name')
        self.validate_trait(resolved_entity.attributes[1], 'age')
        self.validate_trait(resolved_entity.attributes[2], 'address')
        self.validate_trait(resolved_entity.attributes[3], 'phoneNumber')
        self.validate_trait(resolved_entity.attributes[4], 'email')

    @async_test
    async def test_wildcard_args(self):
        """Test argumentsContainWildcards field in AlterTraits with ArrayExpansion and RenameAttributes operations"""
        test_name = 'test_wildcard_args'
        entity_name = 'ThreeMusketeers'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Add attribute: ["newName" (InsertAtTop:false), "newName_1" (InsertAtTop:true)]
        self.assertEqual(9, len(resolved_entity.attributes))
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[0], 'name1', 1, 'ThreePeople', 'name')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[1], 'age1', 1, 'ThreePeople', 'age')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[2], 'address1', 1, 'ThreePeople', 'address')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[3], 'name2', 2, 'ThreePeople', 'name')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[4], 'age2', 2, 'ThreePeople', 'age')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[5], 'address2', 2, 'ThreePeople', 'address')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[6], 'name3', 3, 'ThreePeople', 'name')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[7], 'age3', 3, 'ThreePeople', 'age')
        ProjectionTestUtils.validate_expansion_info_trait(self, resolved_entity.attributes[8], 'address3', 3, 'ThreePeople', 'address')

    @async_test
    async def test_alter_arguments(self):
        """Test alter arguments"""
        test_name = 'test_alter_arguments'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('traitGroup', LocalAdapter(self.trait_group_file_path))

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Create resolution options with the 'referenceOnly' directive.
        resolved_entity_reference_only = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'referenceOnly' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition not met, no trait is changed
        self.assertEqual('address', resolved_entity_reference_only.attributes[2].name)
        trait_g4 = resolved_entity_reference_only.attributes[2].applied_traits.item('means.TraitG4')
        self.assertIsNotNone(trait_g4)
        self.assertIsNone(trait_g4.arguments.fetch_value('precision'))
        self.assertEqual('15', trait_g4.arguments.fetch_value('scale'))

        # Create resolution options with the 'referenceOnly' directive.
        resolved_entity_with_structured = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["6", {"name": "scale","value": "20"}"] }]
        self.assertEqual('address', resolved_entity_with_structured.attributes[2].name)
        trait_g4_1 = resolved_entity_with_structured.attributes[2].applied_traits.item('means.TraitG4')
        self.assertIsNotNone(trait_g4_1)
        self.assertEqual('6', trait_g4_1.arguments.fetch_value('precision'))
        self.assertEqual('20', trait_g4_1.arguments.fetch_value('scale'))

        # Create resolution options with the 'normalized' directive.
        resolved_entity_with_normalized = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'normalized' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["8", null] }]
        self.assertEqual('address', resolved_entity_with_normalized.attributes[2].name)
        trait_g4_2 = resolved_entity_with_normalized.attributes[2].applied_traits.item('means.TraitG4')
        self.assertIsNotNone(trait_g4_2)
        self.assertEqual('8', trait_g4_2.arguments.fetch_value('precision'))
        self.assertIsNone(trait_g4_2.arguments.fetch_value('scale'))

    def validate_trait(self, attribute: 'CdmTypeAttributeDefinition', expected_attr_name: str, have_trait_g4: bool = False, does_not_exist: bool = False) -> 'CdmAttributeGroupDefinition':
        """Validates trait for this test class
            @param attribute = The type attribute
            @param expected_attr_name = The expected attribute name.
            @param have_trait_g4 = Whether this attribute has "means.TraitG4"
            @param does_not_exist = Whether this attribute has traits from <c traitGroupFilePath/>."""

        self.assertEqual(expected_attr_name, attribute.name)

        if not does_not_exist:
            self.assertIsNotNone(attribute.applied_traits.item('means.TraitG100'))
            self.assertIsNotNone(attribute.applied_traits.item("means.TraitG200"))
            self.assertIsNone(attribute.applied_traits.item("means.TraitG300"))
            self.assertIsNotNone(attribute.applied_traits.item("means.TraitG400"))
            if have_trait_g4:
                trait_g4 = attribute.applied_traits.item('means.TraitG4')
                self.assertIsNotNone(trait_g4)
                self.assertEqual(trait_g4.arguments.fetch_value('precision'), '5')
                self.assertEqual(trait_g4.arguments.fetch_value('scale'), '15')

        else:
            self.assertIsNone(attribute.applied_traits.item('means.TraitG100'))
            self.assertIsNone(attribute.applied_traits.item("means.TraitG200"))
            self.assertIsNone(attribute.applied_traits.item("means.TraitG300"))
            self.assertIsNone(attribute.applied_traits.item("means.TraitG400"))
            self.assertIsNone(attribute.applied_traits.item("means.TraitG4"))