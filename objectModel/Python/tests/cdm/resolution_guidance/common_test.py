# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import TYPE_CHECKING

from cdm.enums import CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import TestHelper
from tests.utilities.object_validator import ObjectValidator

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

            corpus = CdmCorpusDefinition()
            corpus.ctx.report_at_level = CdmStatusLevel.WARNING
            corpus.storage.mount('localInput', LocalAdapter(test_input_path))
            corpus.storage.mount('cdm', LocalAdapter(self.schema_docs_path))
            corpus.storage.default_namespace = 'localInput'

            src_entity_def = await corpus.fetch_object_async('localInput:/{}.cdm.json/{}'.format(source_entity_name, source_entity_name))
            self.assertTrue(src_entity_def is not None)

            res_opt = ResolveOptions(wrt_doc=src_entity_def.in_document)

            resolved_entity_def = None  # type: CdmEntityDefinition
            output_entity_name = ''
            output_entity_file_name = ''
            entity_file_name = ''

            if expected_context_default and expected_default:
                entity_file_name = 'default'
                res_opt.directives = AttributeResolutionDirectiveSet(set())
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_default, expected_default, resolved_entity_def)

            if expected_context_normalized and expected_normalized:
                entity_file_name = 'normalized'
                res_opt.directives = AttributeResolutionDirectiveSet(set({'normalized'}))
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_normalized, expected_normalized, resolved_entity_def)

            if expected_context_reference_only and expected_reference_only:
                entity_file_name = 'referenceOnly'
                res_opt.directives = AttributeResolutionDirectiveSet(set({'referenceOnly'}))
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_reference_only, expected_reference_only, resolved_entity_def)

            if expected_context_structured and expected_structured:
                entity_file_name = 'structured'
                res_opt.directives = AttributeResolutionDirectiveSet(set({'structured'}))
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_structured, expected_structured, resolved_entity_def)

            if expected_context_normalized_structured and expected_normalized_structured:
                entity_file_name = 'normalized_structured'
                res_opt.directives = AttributeResolutionDirectiveSet(set({'normalized', 'structured'}))
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_normalized_structured, expected_normalized_structured, resolved_entity_def)

            if expected_context_reference_only_normalized and expected_reference_only_normalized:
                entity_file_name = 'referenceOnly_normalized'
                res_opt.directives = AttributeResolutionDirectiveSet(set({'referenceOnly', 'normalized'}))
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_reference_only_normalized, expected_reference_only_normalized, resolved_entity_def)

            if expected_context_reference_only_structured and expected_reference_only_structured:
                entity_file_name = 'referenceOnly_structured'
                res_opt.directives = AttributeResolutionDirectiveSet(set({'referenceOnly', 'structured'}))
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_reference_only_structured, expected_reference_only_structured, resolved_entity_def)

            if expected_context_reference_only_normalized_structured and expected_reference_only_normalized_structured:
                entity_file_name = 'referenceOnly_normalized_structured'
                res_opt.directives = AttributeResolutionDirectiveSet(set({'referenceOnly', 'normalized', 'structured'}))
                output_entity_name = '{}_Resolved_{}'.format(source_entity_name, entity_file_name)
                output_entity_file_name = '{}.cdm.json'.format(output_entity_name)
                resolved_entity_def = await src_entity_def.create_resolved_entity_async(output_entity_name, res_opt)
                self.validate_output_with_values(expected_context_reference_only_normalized_structured, expected_reference_only_normalized_structured, resolved_entity_def)
        except Exception as e:
            self.fail(e)

    def validate_output_with_values(self, expected_context: 'AttributeContextExpectedValue', expected_attributes: 'List[AttributeExpectedValue]', actual_resolved_entity_def: 'CdmEntityDefinition') -> None:
        """Runs validation to test actual output vs expected output for attributes collection vs attribute context."""
        ObjectValidator.validate_attributes_collection(self, expected_attributes, actual_resolved_entity_def.attributes)
        ObjectValidator.validate_attribute_context(self, expected_context, actual_resolved_entity_def.attribute_context)