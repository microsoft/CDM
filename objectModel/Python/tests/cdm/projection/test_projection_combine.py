# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import List

from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition, CdmProjection, \
    CdmOperationCombineAttributes, CdmEntityReference, CdmEntityAttributeDefinition
from cdm.storage import LocalAdapter
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.cdm.projection.projection_om_test_util import ProjectionOMTestUtil
from tests.cdm.projection.type_attribute_param import TypeAttributeParam
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionCombineTest(unittest.TestCase):
    """A test class for testing the CombineAttributes operation in a projection as well as Select 'one' in a resolution guidance"""

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
    tests_sub_path = os.path.join('Cdm', 'Projection', 'ProjectionCombineTest')

    @async_test
    async def test_extends(self) -> None:
        """Test Entity Extends with a Resolution Guidance that selects 'one'"""
        self.maxDiff = None
        test_name = 'test_extends'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_extends_proj(self) -> None:
        """Test Entity Extends with a Combine Attributes operation"""
        self.maxDiff = None
        test_name = 'test_extends_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_ea(self) -> None:
        """Test Entity Attribute with a Resolution Guidance that selects 'one'"""
        self.maxDiff = None
        test_name = 'test_ea'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_ea_proj(self) -> None:
        """Test Entity Attribute with a Combine Attributes operation"""
        self.maxDiff = None
        test_name = 'test_ea_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_non_polymorphic_proj(self) -> None:
        """Test Entity Attribute with a Combine Attributes operation but IsPolymorphicSource flag set to false"""
        self.maxDiff = None
        test_name = 'test_non_polymorphic_proj'
        entity_name = 'NewPerson'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)  # type: CdmCorpusDefinition

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, [])  # type: CdmEntityDefinition

        # Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        # Combined attributes ['phoneNumber', 'email'] into 'contactAt'
        self.assertEqual(4, len(resolved_entity.attributes))
        self.assertEqual('name', resolved_entity.attributes[0].name)
        self.assertEqual('age', resolved_entity.attributes[1].name)
        self.assertEqual('address', resolved_entity.attributes[2].name)
        self.assertEqual('contactAt', resolved_entity.attributes[3].name)

    @async_test
    async def test_empty_proj(self) -> None:
        """Test a Combine Attributes operation with an empty select list"""
        self.maxDiff = None
        test_name = 'test_empty_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_coll_proj(self) -> None:
        """Test a collection of Combine Attributes operation"""
        self.maxDiff = None
        test_name = 'test_coll_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_nested_proj(self) -> None:
        """Test Nested Combine Attributes operations"""
        self.maxDiff = None
        test_name = 'test_nested_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_multi_proj(self) -> None:
        """Test Multiple Nested Operations with Combine including ArrayExpansion and Rename"""
        self.maxDiff = None
        test_name = 'test_multi_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            if 'structured' in res_opt:
                # Array expansion is not supported on an attribute group yet.
                continue

            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_cond_proj(self) -> None:
        """Test a Combine Attributes operation with condition set to false"""
        self.maxDiff = None
        test_name = 'test_cond_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_ren_proj(self) -> None:
        """Test Nested Combine with Rename Operation"""
        self.maxDiff = None
        test_name = 'test_ren_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            if 'structured' in res_opt:
                # Rename attributes is not supported on an attribute group yet.
                continue

            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_comm_proj(self) -> None:
        """Test Entity Attribute with a Combine Attributes operation that selects a common already 'merged' attribute (e.g. IsPrimary)"""
        self.maxDiff = None
        test_name = 'test_comm_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_miss_proj(self) -> None:
        """Test a Combine Attributes operation by selecting missing attributes"""
        self.maxDiff = None
        test_name = 'test_miss_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_seq_proj(self) -> None:
        """Test a Combine Attributes operation with a different sequence of selection attributes"""
        self.maxDiff = None
        test_name = 'test_seq_proj'
        entity_name = 'Customer'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_sub_path, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_ea_proj_om(self) -> None:
        """Test for object model"""
        className = 'ProjectionCombineTest'
        test_name = 'test_ea_proj_om'

        entity_name_email = 'Email'
        attribute_params_email = [TypeAttributeParam('EmailID', 'string', 'identifiedBy'),
                                  TypeAttributeParam('Address', 'string', 'hasA'),
                                  TypeAttributeParam('IsPrimary', 'boolean', 'hasA')]  # type: List[TypeAttributeParam]

        entity_name_phone = 'Phone'
        attribute_params_phone = [TypeAttributeParam('PhoneID', 'string', 'identifiedBy'),
                                  TypeAttributeParam('Number', 'string', 'hasA'),
                                  TypeAttributeParam('IsPrimary', 'boolean', 'hasA')]  # type: List[TypeAttributeParam]

        entity_name_social = 'Social'
        attribute_params_social = [TypeAttributeParam('SocialID', 'string', 'identifiedBy'),
                                   TypeAttributeParam('Account', 'string', 'hasA'),
                                   TypeAttributeParam('IsPrimary', 'boolean', 'hasA')]  # type: List[TypeAttributeParam]

        entity_name_customer = 'Customer'
        attribute_params_customer = [
            TypeAttributeParam('CustomerName', 'string', 'hasA')]  # type: List[TypeAttributeParam]

        selectedAttributes = ['EmailID', 'PhoneID', 'SocialID']  # type: List[str]

        util = ProjectionOMTestUtil(className, test_name)
        entity_email = util.create_basic_entity(entity_name_email,
                                                attribute_params_email)  # type: 'CdmEntityDefinition'
        self._validate_basic_entity(entity_email, entity_name_email, attribute_params_email)

        entity_phone = util.create_basic_entity(entity_name_phone,
                                                attribute_params_phone)  # type: 'CdmEntityDefinition'
        self._validate_basic_entity(entity_phone, entity_name_phone, attribute_params_phone)

        entity_social = util.create_basic_entity(entity_name_social,
                                                 attribute_params_social)  # type: 'CdmEntityDefinition'
        self._validate_basic_entity(entity_social, entity_name_social, attribute_params_social)

        entity_customer = util.create_basic_entity(entity_name_customer,
                                                   attribute_params_customer)  # type: 'CdmEntityDefinition'
        self._validate_basic_entity(entity_customer, entity_name_customer, attribute_params_customer)

        projection_customer = util.create_projection(entity_customer.entity_name)  # type: 'CdmProjection'
        type_attribute_merge_into = util.create_type_attribute('MergeInto', 'string', 'hasA')  # type: 'CdmTypeAttributeDefinition'
        operation_combine_attributes = util.create_operation_combine_attributes(projection_customer, selectedAttributes, type_attribute_merge_into)  # type: 'CdmOperationCombineAttributes'
        projectionEntityRef_customer = util.create_projection_inline_entity_reference(
            projection_customer)  # type: 'CdmEntityReference'

        entityAttribute_ContactAt = util.create_entity_attribute('ContactAt', projectionEntityRef_customer)  # type: 'CdmEntityAttributeDefinition'
        entity_customer.attributes.append(entityAttribute_ContactAt)

        for res_opts in self.res_opts_combinations:
            await util.get_and_validate_resolved_entity(self, entity_customer, res_opts)

        await util._default_manifest.save_as_async(util._manifest_doc_name, False)

    def _validate_basic_entity(self, entity: 'CdmEntityDefinition', entity_name: str,
                               attributes_params: List[TypeAttributeParam]):
        """Function to valid the entity"""
        self.assertIsNotNone(entity, 'ValidateBasicEntity: {} failed!'.format(entity_name))
        self.assertEqual(len(entity.attributes), len(attributes_params),
                         'ValidateBasicEntity: Attribute count for {} failed!'.format(entity_name))

