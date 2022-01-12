# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import TYPE_CHECKING

from cdm.enums import CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition, CdmFolderDefinition, CdmEntityDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet, CopyOptions
from tests.common import TestHelper

if TYPE_CHECKING:
    from cdm.objectmodel import CdmEntityDefinition
    from tests.utilities.object_validator import AttributeContextExpectedValue, AttributeExpectedValue


class CommonTest(unittest.TestCase):
    # The path of the SchemaDocs project.
    schema_docs_path = TestHelper.get_schema_docs_root()

    # The test's data path.
    tests_subpath = os.path.join('Cdm', 'ResolutionGuidance')

    async def run_test_with_values(
        self,
        test_name: str,
        source_entity_name: str,

        expected_context_default: 'AttributeContextExpectedValue',
        expected_context_normalized: 'AttributeContextExpectedValue',
        expected_context_reference_only: 'AttributeContextExpectedValue',
        expected_context_structured: 'AttributeContextExpectedValue',
        expected_context_normalized_structured: 'AttributeContextExpectedValue',
        expected_context_reference_only_normalized: 'AttributeContextExpectedValue',
        expected_context_reference_only_structured: 'AttributeContextExpectedValue',
        expected_context_reference_only_normalized_structured: 'AttributeContextExpectedValue',

        expected_default: 'List[AttributeExpectedValue]',
        expected_normalized: 'List[AttributeExpectedValue]',
        expected_reference_only: 'List[AttributeExpectedValue]',
        expected_structured: 'List[AttributeExpectedValue]',
        expected_normalized_structured: 'List[AttributeExpectedValue]',
        expected_reference_only_normalized: 'List[AttributeExpectedValue]',
        expected_reference_only_structured: 'List[AttributeExpectedValue]',
        expected_reference_only_normalized_structured: 'List[AttributeExpectedValue]'
    ) -> None:
        """This method runs the tests with a set expected attributes & attribute context values and validated the actual result."""
        try:
            test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, test_name)
            test_actual_path = TestHelper.get_actual_output_folder_path(self.tests_subpath, test_name)
            test_expected_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)
            corpus_path = test_input_path[0: (len(test_input_path) - len('/Input'))]
            test_actual_path = os.path.abspath(test_actual_path)

            corpus = CdmCorpusDefinition()
            corpus.ctx.report_at_level = CdmStatusLevel.WARNING
            corpus.storage.mount('local', LocalAdapter(corpus_path))
            corpus.storage.mount('cdm', LocalAdapter(self.schema_docs_path))
            corpus.storage.default_namespace = 'local'

            out_folder_path = corpus.storage.adapter_path_to_corpus_path(test_actual_path) + '/'  # interesting bug
            out_folder = await corpus.fetch_object_async(out_folder_path)  # type: CdmFolderDefinition

            src_entity_def = await corpus.fetch_object_async('local:/Input/{}.cdm.json/{}'.format(source_entity_name, source_entity_name))  # type: CdmEntityDefinition
            self.assertTrue(src_entity_def is not None)

            res_opt = ResolveOptions(wrt_doc=src_entity_def.in_document)

            resolved_entity_def = None  # type: CdmEntityDefinition
            output_entity_name = ''
            output_entity_file_name = ''
            entity_file_name = ''

            if expected_context_default and expected_default:
                entity_file_name = 'd'
                res_opt.directives = AttributeResolutionDirectiveSet(set())
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)

            if expected_context_normalized and expected_normalized:
                entity_file_name = 'n'
                res_opt.directives = AttributeResolutionDirectiveSet({'normalized'})
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)

            if expected_context_reference_only and expected_reference_only:
                entity_file_name = 'ro'
                res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly'})
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)

            if expected_context_structured and expected_structured:
                entity_file_name = 's'
                res_opt.directives = AttributeResolutionDirectiveSet({'structured'})
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)

            if expected_context_normalized_structured and expected_normalized_structured:
                entity_file_name = 'n_s'
                res_opt.directives = AttributeResolutionDirectiveSet({'normalized', 'structured'})
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)

            if expected_context_reference_only_normalized and expected_reference_only_normalized:
                entity_file_name = 'ro_n'
                res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly', 'normalized'})
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)

            if expected_context_reference_only_structured and expected_reference_only_structured:
                entity_file_name = 'ro_s'
                res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly', 'structured'})
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)

            if expected_context_reference_only_normalized_structured and expected_reference_only_normalized_structured:
                entity_file_name = 'ro_n_s'
                res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly', 'normalized', 'structured'})
                output_entity_name = '{}_R_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt, out_folder)
                await self.save_actual_entity_and_validate_with_expected(
                    os.path.join(test_expected_path, output_entity_file_name), resolved_entity_def)
        except Exception as e:
            self.fail(e)

    async def save_actual_entity_and_validate_with_expected(self, expected_path: str, actual_resolved_entity_def: CdmEntityDefinition, update_expected_output: bool = False) -> None:
        """Runs validation to test actual output vs expected output for attributes collection vs attribute context."""
        co = CopyOptions()
        co._is_top_level_document = False
        await actual_resolved_entity_def.in_document.save_as_async(actual_resolved_entity_def.in_document.name, options=co)
        actual_path = actual_resolved_entity_def.ctx.corpus.storage.corpus_path_to_adapter_path(actual_resolved_entity_def.in_document.at_corpus_path)

        with open(actual_path, 'r', encoding='utf-8') as actual_file:
            actual_ctx = actual_file.read()

        if update_expected_output:
            with open(expected_path, 'w', encoding='utf-8') as expected_file:
                expected_file.write(actual_ctx)

        with open(expected_path, 'r', encoding='utf-8') as expected_file:
            expected_ctx = expected_file.read()

        self.assertEqual(expected_ctx, actual_ctx)
