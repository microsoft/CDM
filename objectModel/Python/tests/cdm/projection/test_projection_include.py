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

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_extends_proj(self) -> None:
        """Test for entity extends with projection with an includeAttributes operation"""
        test_name = 'test_extends_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_ea(self) -> None:
        """Test for entity attribute with resolution guidance with a SelectsSomeTakeNames"""
        test_name = 'test_ea'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_ea_proj(self) -> None:
        """Test for entity attribute with projection with an includeAttributes operation"""
        test_name = 'test_ea_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

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
            resolvedEntity_Color = util.get_and_validate_resolved_entity(entity_Color, res_opts)
            self.assertIsNotNone(resolvedEntity_Color)

        await util._default_manifest.save_as_async(util._manifest_doc_name, False)

    @async_test
    async def test_nested_1_of_3_proj(self) -> None:
        """Test for leaf level projection"""
        test_name = 'test_nested_1_of_3_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_nested_2_of_3_proj(self) -> None:
        """Test for mid level projection"""
        test_name = 'test_nested_2_of_3_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_nested_3_of_3_proj(self) -> None:
        """Test for top level projection"""
        test_name = 'test_nested_3_of_3_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_condition_proj(self) -> None:
        """Test for Condition = false"""
        test_name = 'test_condition_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_group_name(self) -> None:
        """Test for SelectsSomeTakeNames by Group Name"""
        test_name = 'test_group_name'
        entity_name = 'Product'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_group_name_proj(self) -> None:
        """Test for include attributes operation by Group Name"""
        test_name = 'test_group_name_proj'
        entity_name = 'Product'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_array(self) -> None:
        """Test for  SelectsSomeTakeNames from an Array"""
        test_name = 'test_array'
        entity_name = 'Sales'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_array_rename(self) -> None:
        """Test for  SelectsSomeTakeNames from a renamed Array"""
        test_name = 'test_array_rename'
        entity_name = 'Sales'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_array_proj(self) -> None:
        """Test for  Include Attributes from an Array"""
        test_name = 'test_array_proj'
        entity_name = 'Sales'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_polymorphic(self) -> None:
        """Test for  SelectsSomeTakeNames from a Polymorphic Source"""
        test_name = 'test_polymorphic'
        entity_name = 'Person'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_polymorphic_proj(self) -> None:
        """Test for  Include Attributes from a Polymorphic Source"""
        test_name = 'test_polymorphic_proj'
        entity_name = 'Person'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_nested_include_exclude_proj(self) -> None:
        """Test for  Nested Projections that include then exclude some attributes"""
        test_name = 'test_nested_include_exclude_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_include_exclude_proj(self) -> None:
        """Test for  Projections with include and exclude"""
        test_name = 'test_include_exclude_proj'
        entity_name = 'Color'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    async def _load_entity_for_resolution_option_and_save(self, test_name: str, entity_name: str, res_opts: List[str]) -> None:
        """Loads an entity, resolves it, and then validates the generated attribute contexts"""
        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_sub_path, test_name)  # type: str
        file_name_suffix = ProjectionTestUtils.get_resolution_option_name_suffix(res_opts)  # type: str

        corpus = TestHelper.get_local_corpus(self.tests_sub_path, test_name)  # type: CdmCorpusDefinition
        corpus.storage.mount('expected', LocalAdapter(expected_output_path))

        # entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name))
        # resolved_entity = await TestUtils._get_resolved_entity(corpus, entity, res_opts, True)
        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, res_opts, True)

        await self._validate_resolved_attributes(corpus, resolved_entity, entity_name, file_name_suffix)

        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, '{}{}'.format(entity_name, file_name_suffix), resolved_entity)

    async def _validate_resolved_attributes(self, corpus: 'CdmCorpusDefinition', actual_resolved_entity: 'CdmEntityDefinition', entity_name: str, file_name_suffix: str) -> None:
        """Validate the list of resolved attributes against an expected list"""
        expected_resolved_entity = await corpus.fetch_object_async('expected:/Resolved_{0}{1}.cdm.json/Resolved_{0}{1}'.format(entity_name, file_name_suffix))  # type: CdmEntityDefinition
        self.assertIsNotNone(expected_resolved_entity)

        self.assertEqual(expected_resolved_entity.attributes.__len__(), actual_resolved_entity.attributes.__len__())
        for i in range(0, expected_resolved_entity.attributes.__len__()):
            self.assertEqual(expected_resolved_entity.attributes[i].fetch_object_definition_name(), actual_resolved_entity.attributes[i].fetch_object_definition_name())
