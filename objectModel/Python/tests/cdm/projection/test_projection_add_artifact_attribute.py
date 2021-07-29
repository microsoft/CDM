# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeItem, CdmCollection


class ProjectionAddArtifactAttributeTest(unittest.TestCase):
    """A test class for testing the AddArtifactAttribute operation in a projection"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionAddArtifactAttribute')

    @async_test
    async def test_add_ent_attr_on_ent_attr_proj(self):
        """Test AddArtifactAttribute to add an entity attribute on an entity attribute"""
        test_name = 'test_add_ent_attr_on_ent_attr_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        def callback(level, message):
            if 'CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an entity attribute yet.' not in message:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

    @async_test
    async def test_add_attr_grp_on_ent_attr_proj(self):
        """Test AddArtifactAttribute to add an attribute group on an entity attribute"""
        test_name = 'test_add_attr_grp_on_ent_attr_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        def callback(level, message):
            if 'CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an attribute group yet.' not in message:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])

    @async_test
    async def test_add_type_attr_on_type_attr_proj(self):
        """Test AddArtifactAttribute to add a type attribute on a type attribute"""
        test_name = 'test_add_type_attr_on_type_attr_proj'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(2, len(resolved_entity.attributes))
        self.assertEqual('newTerm', resolved_entity.attributes[0].name)
        self.assertEqual('FavoriteTerm', resolved_entity.attributes[1].name)

    @async_test
    async def test_combine_ops_nested_proj(self):
        """Test AddArtifactAttribute operation nested with ExcludeAttributes/RenameAttributes"""
        test_name = 'test_combine_ops_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: [ { "name", "age", "address", "phoneNumber", "email" }, "FavoriteTerm" ]
        # Entity Attribuite:
        # Exclude attributes: ["age", "phoneNumber", "name"]
        # Add attribute: ["newName"]
        # Rename attribute ["newName" -> "renaming-{m}" ]
        # Rename attribute ["renaming-newName" -> "renamingAgain-{m}" ]
        # Add attribute: ["newName_1"]
        # Type Attribute:
        # Add attribute: ["newName"]
        # Rename attribute ["newName" -> "renamed-{m}" ]
        # Add attribute: ["newTerm" (InsertAtTop:true)]
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('address', resolved_entity.attributes[0].name)
        self.assertEqual('email', resolved_entity.attributes[1].name)
        self.assertEqual('renamingAgain-renaming-newName', resolved_entity.attributes[2].name)
        self.assertEqual('newName_1', resolved_entity.attributes[3].name)
        self.assertEqual('newTerm', resolved_entity.attributes[4].name)
        self.assertEqual('FavoriteTerm', resolved_entity.attributes[5].name)
        self.assertEqual('renamed-newName', resolved_entity.attributes[6].name)

    @async_test
    async def test_conditional_proj(self):
        """Test AddArtifactAttribute operation with a 'structured' condition"""
        test_name = 'test_conditional_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'referenceOnly' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition not met, keep attributes in flat list
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

        resolved_entity2 = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Condition met, keep attributes in flat list and add the new attribute "newName" all attributes at the end
        self.assertEqual(6, len(resolved_entity2.attributes))
        self.assertEqual('name', resolved_entity2.attributes[0].name)
        self.assertEqual('age', resolved_entity2.attributes[1].name)
        self.assertEqual('address', resolved_entity2.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity2.attributes[3].name)
        self.assertEqual('email', resolved_entity2.attributes[4].name)
        self.assertEqual('newName', resolved_entity2.attributes[5].name)

    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an AddArtifactAttribute operation and a condition using the object model"""
        test_name = 'test_conditional_proj_using_object_model'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)
        local_root = corpus.storage.fetch_root_folder('local')

        # Create an entity.
        entity = ProjectionTestUtils.create_entity(corpus, local_root)

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        projection = ProjectionTestUtils.create_projection(corpus, local_root)
        projection.condition = 'structured==true'

        # Create an AddArtifactAttribute operation
        add_artifact_attribute_op = corpus.make_object(CdmObjectType.OPERATION_ADD_ARTIFACT_ATTRIBUTE_DEF)
        add_artifact_attribute_op.new_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, "newName")
        add_artifact_attribute_op.new_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, "string", True)
        projection.operations.append(add_artifact_attribute_op)

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
        # Condition not met, keep attributes in flat list
        self.assertEqual(4, len(resolved_entity_with_reference_only.attributes))
        self.assertEqual('id', resolved_entity_with_reference_only.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_reference_only.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_reference_only.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_reference_only.attributes[3].name)

        # Now resolve the entity with the 'structured' directive
        res_opt.directives = AttributeResolutionDirectiveSet({'structured'})
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)

        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Condition met, keep attributes in flat list and add the new attribute "newName" all attributes at the end
        self.assertEqual(5, len(resolved_entity_with_structured.attributes))
        self.assertEqual('id', resolved_entity_with_structured.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_structured.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_structured.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_structured.attributes[3].name)
        self.assertEqual('newName', resolved_entity_with_structured.attributes[4].name)

    @async_test
    async def test_extends_entity_proj(self):
        """Test AddArtifactAttribute operation on an entity definition"""
        test_name = 'test_extends_entity_proj'
        entity_name = 'Child'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(6, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('newName', resolved_entity.attributes[5].name)


    @async_test
    async def test_multiple_op_proj(self):
        """Multiple AddArtifactAttribute operations on the same projection """
        test_name = 'test_multiple_op_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Add attribute: ["newName", "newName_1", "newName"]
        # 2 "newName" will be merged
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('newName', resolved_entity.attributes[5].name)
        self.assertEqual('newName_1', resolved_entity.attributes[6].name)

    @async_test
    async def test_insert_at_top(self):
        """Test insertAtTop field in AddArtifactAttribute operation"""
        test_name = 'test_insert_at_top'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Add attribute: ["newName" (InsertAtTop:false), "newName_1" (InsertAtTop:true)]
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('newName_1', resolved_entity.attributes[0].name)
        self.assertEqual('name', resolved_entity.attributes[1].name)
        self.assertEqual('age', resolved_entity.attributes[2].name)
        self.assertEqual('address', resolved_entity.attributes[3].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[4].name)
        self.assertEqual('email', resolved_entity.attributes[5].name)
        self.assertEqual('newName', resolved_entity.attributes[6].name)

    @async_test
    async def test_nested_proj(self):
        """Nested projections with AddArtifactAttribute"""
        test_name = 'test_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ ])

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('newName_inner', resolved_entity.attributes[5].name)
        self.assertEqual('newName_outer', resolved_entity.attributes[6].name)

