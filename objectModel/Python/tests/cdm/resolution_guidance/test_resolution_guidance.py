
import json
import os
import unittest

from cdm.enums import CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition, CdmFolderDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions

from tests.common import async_test, TestHelper


class ResolutionGuidanceTest(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'ResolutionGuidance')

    @async_test
    async def test_by_entity_name(self):
        """Resolution Guidance Test - Resolve entity by name"""
        test_name = 'test_by_entity_name'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_by_primary_key(self):
        """Resolution Guidance Test - Resolve entity by primarykey"""
        test_name = 'test_by_primary_key'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_empty_resolution_guidance(self):
        """Resolution Guidance Test - Empty ResolutionGuidance"""
        test_name = 'test_empty_resolution_guidance'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_rename_format(self):
        """Resolution Guidance Test - With RenameFormat property"""
        test_name = 'test_rename_format'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_empty_entity_reference(self):
        """Resolution Guidance Test - Empty EntityReference property"""
        test_name = 'test_empty_entity_reference'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_allow_references_true(self):
        """Resolution Guidance Test - With AllowReferences = true"""
        test_name = 'test_allow_references_true'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_always_include_foreign_key_true(self):
        """Resolution Guidance Test - With AlwaysIncludeForeignKey = true"""
        test_name = 'test_always_include_foreign_key_true'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_foreign_key_attribute(self):
        """Resolution Guidance Test - With ForeignKeyAttribute property"""
        test_name = 'test_foreign_key_attribute'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_cardinality_one(self):
        """Resolution Guidance Test - With Cardinality = "one"""
        test_name = 'test_cardinality_one'
        await self.run_test(test_name, 'Sales')

    @async_test
    async def test_selects_subattribute(self):
        """Resolution Guidance Test - With SelectsSubAttribute property"""
        test_name = "test_selects_subattribute"
        await self.run_test(test_name, 'Sales')

    async def run_test(self, test_name: str, source_entity_name: str) -> None:
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, test_name)
        test_expected_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
        test_actual_output_path = TestHelper.get_actual_output_folder_path(self.tests_subpath, test_name)

        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('localInput', LocalAdapter(test_input_path))
        corpus.storage.mount('localExpectedOutput', LocalAdapter(test_expected_output_path))
        corpus.storage.mount('localActualOutput', LocalAdapter(test_actual_output_path))
        corpus.storage.default_namespace = 'localInput'

        src_entity_def = await corpus.fetch_object_async('localInput:/{0}.cdm.json/{0}'.format(source_entity_name))  # type: CdmEntityDefinition
        self.assertIsNotNone(src_entity_def)

        res_opt = ResolveOptions(src_entity_def.in_document, directives=AttributeResolutionDirectiveSet(set()))

        actual_output_folder = await corpus.fetch_object_async('localActualOutput:/')  # type: CdmFolderDefinition
        resolved_entity_def = None
        output_entity_file_name = ''
        entity_file_name = ''

        entity_file_name = 'default'
        res_opt.directives = AttributeResolutionDirectiveSet(set())
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

        entity_file_name = 'referenceOnly'
        res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly'})
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

        entity_file_name = 'normalized'
        res_opt.directives = AttributeResolutionDirectiveSet({'normalized'})
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

        entity_file_name = 'structured'
        res_opt.directives = AttributeResolutionDirectiveSet({'structured'})
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

        entity_file_name = 'referenceOnly_normalized'
        res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly', 'normalized'})
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

        entity_file_name = 'referenceOnly_structured'
        res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly', 'structured'})
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

        entity_file_name = 'normalized_structured'
        res_opt.directives = AttributeResolutionDirectiveSet({'normalized', 'structured'})
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

        entity_file_name = 'referenceOnly_normalized_structured'
        res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly', 'normalized', 'structured'})
        output_entity_file_name = '{}_Resolved_{}.cdm.json'.format(source_entity_name, entity_file_name)
        resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_file_name, res_opt, actual_output_folder)
        if await resolved_entity_def.in_document.save_as_async(output_entity_file_name, True):
            self.validate_output(output_entity_file_name, test_expected_output_path, test_actual_output_path)

    def validate_output(self, output_entity_file_name: str, test_expected_output_path: str, test_actual_output_path: str) -> None:
        expected_data = json.loads(open(os.path.join(test_expected_output_path, output_entity_file_name)).read())
        output_data = json.loads(open(os.path.join(test_actual_output_path, output_entity_file_name)).read())
        self.maxDiff = None
        self.assertDictEqual(expected_data, output_data)
