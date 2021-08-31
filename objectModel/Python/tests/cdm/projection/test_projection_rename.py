# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmFolderDefinition, CdmEntityDefinition
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionRenameTest(unittest.TestCase):
    """A test class for testing the RenameAttributes operation in a projection as well as SelectsSomeAvoidNames in a resolution guidance"""

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
    tests_subpath = os.path.join('Cdm', 'Projection', 'ProjectionRenameTest')

    @async_test
    async def test_entity_attribute_proj_using_object_model(self):
        """Test for creating a projection with an RenameAttributes operation on an entity attribute using the object model  """
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'TestEntityAttributeProjUsingObjectModel')  # type: CdmCorpusDefinition
        local_root = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)  # type: CdmEntityDefinition

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection

        # Create an RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)  # type: CdmOperationRenameAttributes
        rename_attrs_op.rename_format = '{a}-{o}-{m}'
        projection.operations.append(rename_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')  # type: CdmEntityAttributeDefinition
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Resolve the entity.
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)  # type: CdmEntityDefinition

        # Verify correctness of the resolved attributes after running the RenameAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Rename all attributes with format '{a}-{o}-{m}'
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('TestEntityAttribute--id', resolved_entity.attributes[0].name)
        self.assertEqual('TestEntityAttribute--name', resolved_entity.attributes[1].name)
        self.assertEqual('TestEntityAttribute--value', resolved_entity.attributes[2].name)
        self.assertEqual('TestEntityAttribute--date', resolved_entity.attributes[3].name)

    @async_test
    async def test_entity_proj_using_object_model(self):
        """Test for creating a projection with an RenameAttributes operation on an entity definition using the object model.  """
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'TestEntityProjUsingObjectModel')  # type: CdmCorpusDefinition
        local_root = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)  # type: CdmEntityDefinition

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection

        # Create an RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)  # type: CdmOperationRenameAttributes
        rename_attrs_op.rename_format = '{A}.{o}.{M}'
        projection.operations.append(rename_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projection_entity_ref.explicit_reference = projection

        # Set the entity's extends_entity to be the projection
        entity.extends_entity = projection_entity_ref

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)  # type: CdmEntityDefinition

        # Verify correctness of the resolved attributes after running the RenameAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Rename all attributes with format {A}.{o}.{M}
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('..Id', resolved_entity.attributes[0].name)
        self.assertEqual('..Name', resolved_entity.attributes[1].name)
        self.assertEqual('..Value', resolved_entity.attributes[2].name)
        self.assertEqual('..Date', resolved_entity.attributes[3].name)

    @async_test
    async def test_nested_proj_using_object_model(self):
        """Test for creating nested projections with RenameAttributes operations using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'TestNestedProjUsingObjectModel')  # type: CdmCorpusDefinition
        local_root = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)  # type: CdmEntityDefinition

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection

        # Create an RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)  # type: CdmOperationRenameAttributes
        rename_attrs_op.rename_format = '{A}.{o}.{M}'
        projection.operations.append(rename_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projection_entity_ref.explicit_reference = projection

        # Create another projection that uses the previous projection as its source
        projection2 = corpus.make_object(CdmObjectType.PROJECTION_DEF)  # type: CdmProjection
        projection2.source = projection_entity_ref

        # Create an RenameAttributes operation
        rename_attrs_op2 = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)  # type: CdmOperationRenameAttributes
        rename_attrs_op2.rename_format = '{a}-{o}-{m}'
        rename_attrs_op2.apply_to = [ 'name' ]
        projection2.operations.append(rename_attrs_op2)

        # Create an entity reference to hold this projection
        projectionEntityRef2 = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projectionEntityRef2.explicit_reference = projection2

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')  # type: CdmEntityAttributeDefinition
        entity_attribute.entity = projectionEntityRef2
        entity.attributes.append(entity_attribute)

        # Resolve the entity
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)  # type: CdmEntityDefinition

        # Verify correctness of the resolved attributes after running the RenameAttributes operations
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Rename all attributes attributes with format {A}.{o}.{M}, then rename 'name' with format '{a}-{o}-{m}'
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('TestEntityAttribute..Id', resolved_entity.attributes[0].name)
        self.assertEqual('TestEntityAttribute--TestEntityAttribute..Name', resolved_entity.attributes[1].name)
        self.assertEqual('TestEntityAttribute..Value', resolved_entity.attributes[2].name)
        self.assertEqual('TestEntityAttribute..Date', resolved_entity.attributes[3].name)

    @async_test
    async def test_repeated_pattern_proj(self):
        """Test correctness when renameFormat has repeated pattern"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'TestEntityAttributeProjUsingObjectModel')  # type: CdmCorpusDefinition
        local_root = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        # Create an entity
        entity = ProjectionTestUtils.create_entity(corpus, local_root)  # type: CdmEntityDefinition

        # Create a projection
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection

        # Create an RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)  # type: CdmOperationRenameAttributes
        rename_attrs_op.rename_format = '{a}-{M}-{o}-{A}-{m}-{O}'
        projection.operations.append(rename_attrs_op)

        # Create an entity reference to hold this projection
        projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)  # type: CdmEntityReference
        projection_entity_ref.explicit_reference = projection

        # Create an entity attribute that contains this projection and add this to the entity
        entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute')  # type: CdmEntityAttributeDefinition
        entity_attribute.entity = projection_entity_ref
        entity.attributes.append(entity_attribute)

        # Resolve the entity.
        resolved_entity = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), None, local_root)  # type: CdmEntityDefinition

        # Verify correctness of the resolved attributes after running the RenameAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Rename all attributes with format '{a}-{M}-{o}-{A}-{m}-{O}'
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('TestEntityAttribute-Id--TestEntityAttribute-id-', resolved_entity.attributes[0].name)
        self.assertEqual('TestEntityAttribute-Name--TestEntityAttribute-name-', resolved_entity.attributes[1].name)
        self.assertEqual('TestEntityAttribute-Value--TestEntityAttribute-value-', resolved_entity.attributes[2].name)
        self.assertEqual('TestEntityAttribute-Date--TestEntityAttribute-date-', resolved_entity.attributes[3].name)

    @async_test
    async def test_conditional_proj_using_object_model(self):
        """Test for creating a projection with an RenameAttributes operation and a condition using the object model"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'TestConditionalProjUsingObjectModel')  # type: CdmCorpusDefinition
        local_root = corpus.storage.fetch_root_folder('local')  # type: CdmFolderDefinition

        # Create an entity.
        entity = ProjectionTestUtils.create_entity(corpus, local_root)  # type: CdmEntityDefinition

        # Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'.
        projection = ProjectionTestUtils.create_projection(corpus, local_root)  # type: CdmProjection
        projection.condition = 'referenceOnly==true'

        # Create an RenameAttributes operation
        rename_attrs_op = corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)  # type: CdmOperationRenameAttributes
        rename_attrs_op.rename_format = '{A}.{o}.{M}'
        projection.operations.append(rename_attrs_op)

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
        resolved_entity_with_reference_only = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)  # type: CdmEntityDefinition

        # Verify correctness of the resolved attributes after running the RenameAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Rename all attributes with format '{A}.{o}.{M}'
        self.assertEqual(4, len(resolved_entity_with_reference_only.attributes))
        self.assertEqual('TestEntityAttribute..Id', resolved_entity_with_reference_only.attributes[0].name)
        self.assertEqual('TestEntityAttribute..Name', resolved_entity_with_reference_only.attributes[1].name)
        self.assertEqual('TestEntityAttribute..Value', resolved_entity_with_reference_only.attributes[2].name)
        self.assertEqual('TestEntityAttribute..Date', resolved_entity_with_reference_only.attributes[3].name)

        # Now resolve the entity with the 'structured' directive
        res_opt.directives = AttributeResolutionDirectiveSet({'structured'})
        resolved_entity_with_structured = await entity.create_resolved_entity_async('Resolved_{}.cdm.json'.format(entity.entity_name), res_opt, local_root)  # type: CdmEntityDefinition

        # Verify correctness of the resolved attributes after running the RenameAttributes operation
        # Original set of attributes: ['id', 'name', 'value', 'date']
        # Renamed attributes: none, condition was false
        self.assertEqual(4, len(resolved_entity_with_structured.attributes))
        self.assertEqual('id', resolved_entity_with_structured.attributes[0].name)
        self.assertEqual('name', resolved_entity_with_structured.attributes[1].name)
        self.assertEqual('value', resolved_entity_with_structured.attributes[2].name)
        self.assertEqual('date', resolved_entity_with_structured.attributes[3].name)

    @async_test
    async def test_rename_format_as_string_proj(self):
        """RenameAttributes with a plain string as rename format."""
        test_name = 'test_rename_format_as_string_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # Renamed attribute 'address' with format 'whereYouLive'.
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('whereYouLive', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

    @async_test
    async def test_rename_format(self):
        """RenameFormat on an entity attribute."""
        test_name = 'test_rename_format'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail'].
        # Renamed all attributes with format {a}.{o}.{M}
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo..Name', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo..Age', resolved_entity.attributes[1].name)
        self.assertEqual('PersonInfo..Address', resolved_entity.attributes[2].name)
        self.assertEqual('PersonInfo..PhoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('PersonInfo..Email', resolved_entity.attributes[4].name)

    @async_test
    async def test_rename_format_proj(self):
        """RenameFormat on an entity attribute."""
        test_name = 'test_rename_format_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail'].
        # Renamed all attributes with format {a}.{o}.{M}
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo..Name', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo..Age', resolved_entity.attributes[1].name)
        self.assertEqual('PersonInfo..Address', resolved_entity.attributes[2].name)
        self.assertEqual('PersonInfo..PhoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('PersonInfo..Email', resolved_entity.attributes[4].name)

    @async_test
    async def test_single_nested_proj(self):
        """A nested RenameAttributes operation in a single projection."""
        test_name = 'test_single_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # Renamed all attributes with format 'New{M}'.
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('NewName', resolved_entity.attributes[0].name)
        self.assertEqual('NewAge', resolved_entity.attributes[1].name)
        self.assertEqual('NewAddress', resolved_entity.attributes[2].name)
        self.assertEqual('NewPhoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('NewEmail', resolved_entity.attributes[4].name)

    @async_test
    async def test_nested_proj(self):
        """Nested projections with RenameAttributes"""
        test_name = 'test_nested_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Rename all attributes attributes with format {A}.{o}.{M}, then rename 'age' with format '{a}-{o}-{m}'
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo..Name', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo--PersonInfo..Age', resolved_entity.attributes[1].name)
        self.assertEqual('PersonInfo..Address', resolved_entity.attributes[2].name)
        self.assertEqual('PersonInfo..PhoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('PersonInfo..Email', resolved_entity.attributes[4].name)

    @async_test
    async def test_multiple_rename(self):
        """Multiple RenameAttributes in a single projection."""
        test_name = 'test_multiple_rename'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Rename attributes 'age' to 'yearsOld' then 'address' to 'homePlace'
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('yearsOld', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
        self.assertEqual('age', resolved_entity.attributes[5].name)
        self.assertEqual('homePlace', resolved_entity.attributes[6].name)

    @async_test
    async def test_extends_entity_proj(self):
        """RenameFormat on an entity definition."""
        test_name = 'test_extends_entity_proj'
        entity_name = 'Child'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # All attributes renamed with format '{a}.{o}.{M}'.
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('..name', resolved_entity.attributes[0].name)
        self.assertEqual('..age', resolved_entity.attributes[1].name)
        self.assertEqual('..address', resolved_entity.attributes[2].name)
        self.assertEqual('..phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('..email', resolved_entity.attributes[4].name)

    @async_test
    async def test_extends_entity(self):
        """RenameFormat on an entity definition.
        NOTE: this is not supported with resolution guidance."""
        test_name = 'test_extends_entity'
        entity_name = 'Child'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # Renamed attributes: [] with format '{a}.{o}.{M}'.
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

    @async_test
    async def test_polymorphic_proj(self):
        """RenameAttributes on a polymorphic source"""
        test_name = 'test_polymorphic_proj'
        entity_name = 'BusinessPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            if 'structured' in res_opt:
                # Rename attributes is not supported on an attribute group yet.
                continue
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Renamed all attributes with format {A}.{o}.{M}.
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('ContactAt..EmailId', resolved_entity.attributes[0].name)
        self.assertEqual('ContactAt..Address', resolved_entity.attributes[1].name)
        self.assertEqual('ContactAt..IsPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('ContactAt..PhoneId', resolved_entity.attributes[3].name)
        self.assertEqual('ContactAt..Number', resolved_entity.attributes[4].name)
        self.assertEqual('ContactAt..SocialId', resolved_entity.attributes[5].name)
        self.assertEqual('ContactAt..Account', resolved_entity.attributes[6].name)

    @async_test
    async def test_polymorphic_apply_to_proj(self):
        """RenameAttributes on a polymorphic source"""
        test_name = 'test_polymorphic_apply_to_proj'
        entity_name = 'BusinessPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Renamed attributes: [address, number] with format {A}.{o}.{M}
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('emailId', resolved_entity.attributes[0].name)
        self.assertEqual('ContactAt..Address', resolved_entity.attributes[1].name)
        self.assertEqual('isPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('phoneId', resolved_entity.attributes[3].name)
        self.assertEqual('ContactAt..Number', resolved_entity.attributes[4].name)
        self.assertEqual('socialId', resolved_entity.attributes[5].name)
        self.assertEqual('account', resolved_entity.attributes[6].name)

    @async_test
    async def test_polymorphic(self):
        """SelectsSomeAvoidNames on a polymorphic source"""
        test_name = 'test_polymorphic'
        entity_name = 'BusinessPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        # Renamed all attributes with format '{A}.{o}.{M}'
        self.assertEqual(7, len(resolved_entity.attributes))
        self.assertEqual('ContactAt..EmailId', resolved_entity.attributes[0].name)
        self.assertEqual('ContactAt..Address', resolved_entity.attributes[1].name)
        self.assertEqual('ContactAt..IsPrimary', resolved_entity.attributes[2].name)
        self.assertEqual('ContactAt..PhoneId', resolved_entity.attributes[3].name)
        self.assertEqual('ContactAt..Number', resolved_entity.attributes[4].name)
        self.assertEqual('ContactAt..SocialId', resolved_entity.attributes[5].name)
        self.assertEqual('ContactAt..Account', resolved_entity.attributes[6].name)

    @async_test
    async def test_array_source_proj(self):
        """RenameAttributes on an array source"""
        test_name = 'test_array_source_proj'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributeslen(: ['perso)', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total)
        # Attributes renamed from format {a}{M} to {a}.{o}.{M}
        # NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
        self.assertEqual(16, len(resolved_entity.attributes))
        self.assertEqual('GroupOfPeople..PersonCount', resolved_entity.attributes[0].name)
        self.assertEqual('GroupOfPeople..Name1', resolved_entity.attributes[1].name)
        self.assertEqual('GroupOfPeople..Age1', resolved_entity.attributes[2].name)
        self.assertEqual('GroupOfPeople..Address1', resolved_entity.attributes[3].name)
        self.assertEqual('GroupOfPeople..PhoneNumber1', resolved_entity.attributes[4].name)
        self.assertEqual('GroupOfPeople..Email1', resolved_entity.attributes[5].name)
        self.assertEqual('GroupOfPeople..Name2', resolved_entity.attributes[6].name)
        self.assertEqual('GroupOfPeople..Age2', resolved_entity.attributes[7].name)
        self.assertEqual('GroupOfPeople..Address2', resolved_entity.attributes[8].name)
        self.assertEqual('GroupOfPeople..PhoneNumber2', resolved_entity.attributes[9].name)
        self.assertEqual('GroupOfPeople..Email2', resolved_entity.attributes[10].name)
        self.assertEqual('GroupOfPeople..Name3', resolved_entity.attributes[11].name)
        self.assertEqual('GroupOfPeople..Age3', resolved_entity.attributes[12].name)
        self.assertEqual('GroupOfPeople..Address3', resolved_entity.attributes[13].name)
        self.assertEqual('GroupOfPeople..PhoneNumber3', resolved_entity.attributes[14].name)
        self.assertEqual('GroupOfPeople..Email3', resolved_entity.attributes[15].name)

    @async_test
    async def test_array_source(self):
        """RenameFormat on an array source"""
        test_name = 'test_array_source'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributeslen(: ['GroupOfPeoplePerso)', 'GroupOfPeopleName1', 'GroupOfPeopleAge1', 'GroupOfPeopleAddress1',
        #                              'GroupOfPeoplePhoneNumber1', 'GroupOfPeopleEmail1', ..., 'GroupOfPeopleEmail3'] (16 total)
        # Attributes renamed from format {a}{M} to {a}.{o}.{M}
        # NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
        self.assertEqual(16, len(resolved_entity.attributes))
        self.assertEqual('GroupOfPeople..PersonCount', resolved_entity.attributes[0].name)
        self.assertEqual('GroupOfPeople.1.Name1', resolved_entity.attributes[1].name)
        self.assertEqual('GroupOfPeople.1.Age1', resolved_entity.attributes[2].name)
        self.assertEqual('GroupOfPeople.1.Address1', resolved_entity.attributes[3].name)
        self.assertEqual('GroupOfPeople.1.PhoneNumber1', resolved_entity.attributes[4].name)
        self.assertEqual('GroupOfPeople.1.Email1', resolved_entity.attributes[5].name)
        self.assertEqual('GroupOfPeople.2.Name2', resolved_entity.attributes[6].name)
        self.assertEqual('GroupOfPeople.2.Age2', resolved_entity.attributes[7].name)
        self.assertEqual('GroupOfPeople.2.Address2', resolved_entity.attributes[8].name)
        self.assertEqual('GroupOfPeople.2.PhoneNumber2', resolved_entity.attributes[9].name)
        self.assertEqual('GroupOfPeople.2.Email2', resolved_entity.attributes[10].name)
        self.assertEqual('GroupOfPeople.3.Name3', resolved_entity.attributes[11].name)
        self.assertEqual('GroupOfPeople.3.Age3', resolved_entity.attributes[12].name)
        self.assertEqual('GroupOfPeople.3.Address3', resolved_entity.attributes[13].name)
        self.assertEqual('GroupOfPeople.3.PhoneNumber3', resolved_entity.attributes[14].name)
        self.assertEqual('GroupOfPeople.3.Email3', resolved_entity.attributes[15].name)

    @async_test
    async def test_array_source_rename_apply_to_proj(self):
        """RenameFormat on an array source using apply to."""
        test_name = 'test_array_source_rename_apply_to_proj'
        entity_name = 'FriendGroup'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributeslen(: ['perso)', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total).
        # Renamed attributes: ['age1', 'age2', 'age3'] with the format '{a}.{o}.{M}'.
        self.assertEqual(16, len(resolved_entity.attributes))
        self.assertEqual('personCount', resolved_entity.attributes[0].name)
        self.assertEqual('name1', resolved_entity.attributes[1].name)
        self.assertEqual('GroupOfPeople..Age1', resolved_entity.attributes[2].name)
        self.assertEqual('address1', resolved_entity.attributes[3].name)
        self.assertEqual('phoneNumber1', resolved_entity.attributes[4].name)
        self.assertEqual('email1', resolved_entity.attributes[5].name)
        self.assertEqual('name2', resolved_entity.attributes[6].name)
        self.assertEqual('GroupOfPeople..Age2', resolved_entity.attributes[7].name)
        self.assertEqual('address2', resolved_entity.attributes[8].name)
        self.assertEqual('phoneNumber2', resolved_entity.attributes[9].name)
        self.assertEqual('email2', resolved_entity.attributes[10].name)
        self.assertEqual('name3', resolved_entity.attributes[11].name)
        self.assertEqual('GroupOfPeople..Age3', resolved_entity.attributes[12].name)
        self.assertEqual('address3', resolved_entity.attributes[13].name)
        self.assertEqual('phoneNumber3', resolved_entity.attributes[14].name)
        self.assertEqual('email3', resolved_entity.attributes[15].name)

    @async_test
    async def test_conditional_proj(self):
        """RenameAttributes with a condition."""
        test_name = 'test_conditional_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'referenceOnly' ])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # Renamed attributes with format '{M}.{o}.{a}'
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('Name..personInfo', resolved_entity.attributes[0].name)
        self.assertEqual('Age..personInfo', resolved_entity.attributes[1].name)
        self.assertEqual('Address..personInfo', resolved_entity.attributes[2].name)
        self.assertEqual('PhoneNumber..personInfo', resolved_entity.attributes[3].name)
        self.assertEqual('Email..personInfo', resolved_entity.attributes[4].name)

        resolved_entity2 = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # Renamed attributes: none, condition was false.
        self.assertEqual(5, len(resolved_entity2.attributes))
        self.assertEqual('name', resolved_entity2.attributes[0].name)
        self.assertEqual('age', resolved_entity2.attributes[1].name)
        self.assertEqual('address', resolved_entity2.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity2.attributes[3].name)
        self.assertEqual('email', resolved_entity2.attributes[4].name)

    @async_test
    async def test_empty_apply_to(self):
        """RenameAttributes with an empty apply to list."""
        test_name = 'test_empty_apply_to'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # Renamed attributes: [].
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)

    @async_test
    async def test_group_proj(self):
        """RenameFormat on an entity with an attribute group."""
        test_name = 'test_group_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        # Rename all attributes with format {a}-{o}-{M}
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo--Name', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo--Age', resolved_entity.attributes[1].name)
        self.assertEqual('PersonInfo--Address', resolved_entity.attributes[2].name)
        self.assertEqual('PersonInfo--PhoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('PersonInfo--Email', resolved_entity.attributes[4].name)

    @async_test
    async def test_group_rename(self):
        """RenameFormat on an entity with an attribute group."""
        test_name = 'test_group_rename'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail'].
        # Rename all attributes with format {a}-{o}-{M}
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo--Name', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo--Age', resolved_entity.attributes[1].name)
        self.assertEqual('PersonInfo--Address', resolved_entity.attributes[2].name)
        self.assertEqual('PersonInfo--PhoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('PersonInfo--Email', resolved_entity.attributes[4].name)

    @async_test
    async def test_rename_and_exclude_proj(self):
        """Test RenameFormat applying a rename nested in a exclude operation"""

        test_name = 'test_rename_and_exclude_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Rename all attributes with format {a}-{o}-{M} and remove ['age', 'PersonInfo--PhoneNumber']
        self.assertEqual(3, len(resolved_entity.attributes))
        self.assertEqual('PersonInfo--Name', resolved_entity.attributes[0].name)
        self.assertEqual('PersonInfo--Address', resolved_entity.attributes[1].name)
        self.assertEqual('PersonInfo--Email', resolved_entity.attributes[2].name)

    @unittest.skip
    @async_test
    async def test_EA_name_proj(self):
        """RenameAttributes with an entity attribute name on an inline entity reference that contains entity attributes.
        This is testing that, for the case of the structured directive, we can filter using the name of an entity attribute.
         the inline entity reference to rename the entire entity attribute group"""

        test_name = 'test_EA_name_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)  # type: CdmCorpusDefinition

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'structured' ])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email', 'title', 'company', 'tenure'].
        # Rename with format '{a}-{o}-{M}' attributes ['PersonInfoAge', 'OccupationInfo']
        # 'OccupationInfo' is an entity attribute
        self.assertEqual(2, len(resolved_entity.attributes)) # attribute group created because of structured directive.
        att_group = resolved_entity.attributes[0].explicit_reference  # type: CdmAttributeGroupDefinition
        self.assertEqual('PersonInfo', att_group.get_name())
        self.assertEqual(5, len(att_group.members))
        self.assertEqual('name', att_group.members[0].name)
        self.assertEqual('age', att_group.members[1].name)
        self.assertEqual('address', att_group.members[2].name)
        self.assertEqual('phoneNumber', att_group.members[3].name)
        self.assertEqual('email', att_group.members[4].name)

        att_group2 = resolved_entity.attributes[1].explicit_reference
        self.assertEqual('PersonInfo--OccupationInfo', att_group.get_name())
        self.assertEqual(3, len(att_group2.members))
        self.assertEqual('title', att_group2.members[0].name)
        self.assertEqual('company', att_group2.members[1].name)
        self.assertEqual('tenure', att_group2.members[2].name)

    @async_test
    async def test_type_attribute_proj(self):
        """Test resolving a type attribute with a rename attributes operation"""
        test_name = 'test_type_attribute_proj'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, res_opt)

        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [ 'referenceOnly' ])

        # Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        # Rename with format "n{a}e{o}w{M}" attributes ["address"]
        self.assertEqual(5, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('newAddress', resolved_entity.attributes[2].name)
        self.assertEqual('phoneNumber', resolved_entity.attributes[3].name)
        self.assertEqual('email', resolved_entity.attributes[4].name)
