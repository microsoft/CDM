# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import List

from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition, CdmProjection, \
    CdmOperationIncludeAttributes, CdmEntityReference, CdmEntityAttributeDefinition
from cdm.storage import LocalAdapter
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.cdm.projection.projection_om_test_util import ProjectionOMTestUtil
from tests.cdm.projection.type_attribute_param import TypeAttributeParam
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionIncludeTest(unittest.TestCase):
    """A test class for testing the IncludeAttributes operation in a projection as well as SelectsSomeTakeNames in a resolution guidance"""

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

    # Path to foundations
    foundation_json_path = 'cdm:/foundations.cdm.json'

    # The path between TestDataPath and test_name.
    tests_sub_path = os.path.join('Cdm', 'Projection', 'TestProjectionInclude')

    @async_test
    async def test_extends(self) -> None:
        """Test for entity extends with resolution guidance with a SelectsSomeTakeNames"""
        test_name = 'test_extends'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_extends_proj(self) -> None:
        """Test for entity extends with projection with an includeAttributes operation"""
        test_name = 'test_extends_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_ea(self) -> None:
        """Test for entity attribute with resolution guidance with a SelectsSomeTakeNames"""
        test_name = 'test_ea'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_ea_proj(self) -> None:
        """Test for entity attribute with projection with an includeAttributes operation"""
        test_name = 'test_ea_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_ea_proj_om(self) -> None:
        """Test for entity extends with resolution guidance with a SelectsSomeTakeNames"""
        class_name = 'TestProjectionInclude'  # type: str
        test_name = 'test_ea_proj_om'  # type: str
        entity_name_RGB = 'RGB'  # type: str

        attribute_params_RGB = []  # type: [TypeAttributeParam]
        t1 = TypeAttributeParam('Red', 'string', 'hasA')  # type: TypeAttributeParam
        t2 = TypeAttributeParam('Green', 'string', 'hasA')  # type: TypeAttributeParam
        t3 = TypeAttributeParam('Blue', 'string', 'hasA')  # type: TypeAttributeParam
        t4 = TypeAttributeParam('IsGrayscale', 'boolean', 'hasA')  # type: TypeAttributeParam
        attribute_params_RGB.append(t1)
        attribute_params_RGB.append(t2)
        attribute_params_RGB.append(t3)
        attribute_params_RGB.append(t4)

        entity_name_Color = 'Color'  # type: str
        attribute_params_Color = []  # type: [TypeAttributeParam]
        t5 = TypeAttributeParam('ColorName', 'string', 'identifiedBy')  # type: TypeAttributeParam
        attribute_params_Color.append(t5)

        include_attribute_names = []  # type: [str]
        include_attribute_names.append('Red')
        include_attribute_names.append('Green')
        include_attribute_names.append('Blue')

        util = ProjectionOMTestUtil(class_name, test_name)  # type: ProjectionOMTestUtil
        entity_RGB = util.create_basic_entity(entity_name_RGB, attribute_params_RGB)  # type: CdmEntityDefinition
        self.assertIsNotNone(entity_RGB, 'validate_basic_entity: {} failed!'.format(entity_name_RGB))
        self.assertEqual(entity_RGB.attributes.__len__(), attribute_params_RGB.__len__(), 'validate_basic_entity: Attribute count for {} failed!'.format(entity_name_RGB))

        entity_Color = util.create_basic_entity(entity_name_Color, attribute_params_Color)  # type: CdmEntityDefinition
        self.assertIsNotNone(entity_Color, 'validate_basic_entity: {} failed!'.format(entity_name_Color))
        self.assertEqual(entity_Color.attributes.__len__(), attribute_params_Color.__len__(), 'validate_basic_entity: Attribute count for {} failed!'.format(entity_name_Color))

        projection_RGBColor = util.create_projection(entity_RGB.entity_name)  # type: CdmProjection
        operation_include_attributes = util.create_operation_input_attribute(projection_RGBColor, include_attribute_names)  # type: CdmOperationIncludeAttributes
        projection_entity_ref_rgb_color = util.create_projection_inline_entity_reference(projection_RGBColor)  # type: CdmEntityReference

        entity_attribute_rgb_color = util.create_entity_attribute('RGBColor', projection_entity_ref_rgb_color)  # type: CdmEntityAttributeDefinition
        entity_Color.attributes.append(entity_attribute_rgb_color)

        for res_opts in self.res_opts_combinations:
            await util.get_and_validate_resolved_entity(self, entity_Color, res_opts)

        await util._default_manifest.save_as_async(util._manifest_doc_name, False)

    @async_test
    async def test_nested_1_of_3_proj(self) -> None:
        """Test for leaf level projection"""
        test_name = 'test_nested_1_of_3_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_nested_2_of_3_proj(self) -> None:
        """Test for mid level projection"""
        test_name = 'test_nested_2_of_3_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_nested_3_of_3_proj(self) -> None:
        """Test for top level projection"""
        test_name = 'test_nested_3_of_3_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_condition_proj(self) -> None:
        """Test for Condition = false"""
        test_name = 'test_condition_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_group_name(self) -> None:
        """Test for SelectsSomeTakeNames by Group Name"""
        test_name = 'test_group_name'
        entity_name = 'Product'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_group_name_proj(self) -> None:
        """Test for include attributes operation by Group Name"""
        test_name = 'test_group_name_proj'
        entity_name = 'Product'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_array(self) -> None:
        """Test for  SelectsSomeTakeNames from an Array"""
        test_name = 'test_array'
        entity_name = 'Sales'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_array_rename(self) -> None:
        """Test for  SelectsSomeTakeNames from a renamed Array"""
        test_name = 'test_array_rename'
        entity_name = 'Sales'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_array_proj(self) -> None:
        """Test for  Include Attributes from an Array"""
        test_name = 'test_array_proj'
        entity_name = 'Sales'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_polymorphic(self) -> None:
        """Test for  SelectsSomeTakeNames from a Polymorphic Source"""
        test_name = 'test_polymorphic'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_polymorphic_proj(self) -> None:
        """Test for  Include Attributes from a Polymorphic Source"""
        test_name = 'test_polymorphic_proj'
        entity_name = 'Person'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_nested_include_exclude_proj(self) -> None:
        """Test for  Nested Projections that include then exclude some attributes"""
        test_name = 'test_nested_include_exclude_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)

    @async_test
    async def test_include_exclude_proj(self) -> None:
        """Test for  Projections with include and exclude"""
        test_name = 'test_include_exclude_proj'
        entity_name = 'Color'
        corpus = ProjectionTestUtils.get_corpus(test_name, self.tests_sub_path)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_sub_path, entity_name, res_opt)
