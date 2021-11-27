# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import List

from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition, CdmEntityDefinition
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionFKTest(unittest.TestCase):
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
    tests_subpath = os.path.join('Cdm', 'Projection', 'ProjectionFKTest')

    @async_test
    async def test_entity_attribute(self):
        test_name = 'test_entity_attribute'
        entity_name = 'SalesEntityAttribute'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)


    @async_test
    async def test_entity_attribute_proj(self):
        test_name = 'test_entity_attribute_proj'
        entity_name = 'SalesEntityAttribute'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_source_with_EA(self):
        test_name = 'test_source_with_EA'
        entity_name = 'SalesSourceWithEA'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_source_with_EA_proj(self):
        test_name = 'test_source_with_EA_proj'
        entity_name = 'SalesSourceWithEA'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_group_FK(self):
        test_name = 'test_group_FK'
        entity_name = 'SalesGroupFK'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_group_FK_proj(self):
        test_name = 'test_group_FK_proj'
        entity_name = 'SalesGroupFK'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_nested_FK_proj(self):
        test_name = 'test_nested_FK_proj'
        entity_name = 'SalesNestedFK'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_polymorphic(self):
        test_name = 'test_polymorphic'
        entity_name = 'PersonPolymorphicSource'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_polymorphic_proj(self):
        test_name = 'test_polymorphic_proj'
        entity_name = 'PersonPolymorphicSource'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_polymorphic_FK_proj(self):
        test_name = 'test_polymorphic_FK_proj'
        entity_name = 'PersonPolymorphicSourceFK'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_array_source(self):
        test_name = 'test_array_source'
        entity_name = 'SalesArraySource'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_array_source_proj(self):
        test_name = 'test_array_source_proj'
        entity_name = 'SalesArraySource'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_foreign_key(self):
        test_name = 'test_foreign_key'
        entity_name = 'SalesForeignKey'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_foreign_key_proj(self):
        test_name = 'test_foreign_key_proj'
        entity_name = 'SalesForeignKey'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_foreign_key_always(self):
        test_name = 'test_foreign_key_always'
        entity_name = 'SalesForeignKeyAlways'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)

    @async_test
    async def test_composite_key_proj(self):
        self.maxDiff = None
        test_name = 'test_composite_key_proj'
        entity_name = 'SalesCompositeKey'
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        for res_opt in self.res_opts_combinations:
            await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, \
                self.tests_subpath, entity_name, res_opt)
