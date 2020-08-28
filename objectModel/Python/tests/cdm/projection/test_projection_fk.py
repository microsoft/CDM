# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import List

from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition, CdmEntityDefinition
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test, TestHelper, TestUtils


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
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionFK')

    @async_test
    async def test_entity_attribute(self):
        test_name = 'test_entity_attribute'
        entity_name = 'SalesEntityAttribute'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)


    @async_test
    async def test_entity_attribute_proj(self):
        test_name = 'test_entity_attribute_proj'
        entity_name = 'SalesEntityAttribute'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_source_with_EA(self):
        test_name = 'test_source_with_EA'
        entity_name = 'SalesSourceWithEA'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_source_with_EA_proj(self):
        test_name = 'test_source_with_EA_proj'
        entity_name = 'SalesSourceWithEA'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_group_FK(self):
        test_name = 'test_group_FK'
        entity_name = 'SalesGroupFK'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_group_FK_proj(self):
        test_name = 'test_group_FK_proj'
        entity_name = 'SalesGroupFK'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_nested_FK_proj(self):
        test_name = 'test_nested_FK_proj'
        entity_name = 'SalesNestedFK'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_polymorphic(self):
        test_name = 'test_polymorphic'
        entity_name = 'PersonPolymorphicSource'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_polymorphic_proj(self):
        test_name = 'test_polymorphic_proj'
        entity_name = 'PersonPolymorphicSource'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_polymorphic_FK_proj(self):
        test_name = 'test_polymorphic_FK_proj'
        entity_name = 'PersonPolymorphicSourceFK'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_array_source(self):
        test_name = 'test_array_source'
        entity_name = 'SalesArraySource'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_array_source_proj(self):
        test_name = 'test_array_source_proj'
        entity_name = 'SalesArraySource'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_foreign_key(self):
        test_name = 'test_foreign_key'
        entity_name = 'SalesForeignKey'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_foreign_key_proj(self):
        test_name = 'test_foreign_key_proj'
        entity_name = 'SalesForeignKey'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_foreign_key_always(self):
        test_name = 'test_foreign_key_always'
        entity_name = 'SalesForeignKeyAlways'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    @async_test
    async def test_composite_key_proj(self):
        self.maxDiff = None
        test_name = 'test_composite_key_proj'
        entity_name = 'SalesCompositeKey'

        for res_opt in self.res_opts_combinations:
            await self._load_entity_for_resolution_option_and_save(test_name, entity_name, res_opt)

    async def _load_entity_for_resolution_option_and_save(self, test_name: str, entity_name: str, res_opts: List[str]):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        file_name_suffix = TestUtils.get_resolution_option_name_suffix(res_opts)

        ent_sales_foreign_key_projection = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(ent_sales_foreign_key_projection)
        resolved_sales_foreign_key_projection = await self._save_resolved(corpus, manifest, test_name, ent_sales_foreign_key_projection, res_opts)
        self.assertIsNotNone(resolved_sales_foreign_key_projection)
        AttributeContextUtil.validate_attribute_context(self, corpus, expected_output_path, '{}{}'.format(entity_name, file_name_suffix), resolved_sales_foreign_key_projection)

    async def _save_resolved(
        self,
        corpus: 'CdmCorpusDefinition',
        manifest: 'CdmManifestDefinition',
        test_name: str,
        input_entity: 'CdmEntityDefinition',
        resolution_options: List[str]
    ) -> 'CdmEntityDefinition':
        ro_hash_set = set()
        for i in range(len(resolution_options)):
            ro_hash_set.add(resolution_options[i])

        file_name_suffix = TestUtils.get_resolution_option_name_suffix(resolution_options)

        resolved_entity_name = 'Resolved_{}{}.cdm.json'.format(input_entity.entity_name, file_name_suffix)

        ro = ResolveOptions(input_entity.in_document, directives=AttributeResolutionDirectiveSet(ro_hash_set))

        resolved_folder = corpus.storage.fetch_root_folder('output')
        resolved_entity = await input_entity.create_resolved_entity_async(resolved_entity_name, ro, resolved_folder)

        return resolved_entity
