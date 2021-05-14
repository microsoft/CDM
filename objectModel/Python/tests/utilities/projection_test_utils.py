# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
from typing import List, Optional

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import TestHelper


class ProjectionTestUtils:
    """
    Common utility methods for projection tests
    If you want to update the expected output txt files for all the tests that are ran,
    please set the parameter update_expected_output true in the method validate_attribute_context()
    """

    # Path to foundations
    foundation_json_path = 'cdm:/foundations.cdm.json'

    @staticmethod
    async def get_resolved_entity(corpus: 'CdmCorpusDefinition', input_entity: 'CdmEntityDefinition', directives: List[str]) -> 'CdmEntityDefinition':
        """Resolves an entity"""
        ro_hash_set = set(directives)

        resolved_entity_name = 'Resolved_{}'.format(input_entity.entity_name)

        res_opt = ResolveOptions(input_entity.in_document, directives=AttributeResolutionDirectiveSet(ro_hash_set))

        resolved_folder = corpus.storage.fetch_root_folder('output')
        resolved_entity = await input_entity.create_resolved_entity_async(resolved_entity_name, res_opt, resolved_folder)  # type: CdmEntityDefinition

        return resolved_entity

    @staticmethod
    def get_resolution_option_name_suffix(directives: List[str], expected_output_path = None, entity_name = None) -> str:
        """Returns a suffix that contains the file name and resolution option used"""
        file_name_prefix = ''

        for i in range(len(directives)):
            file_name_prefix = '{}_{}'.format(file_name_prefix, directives[i])

        file_exists = os.path.exists(os.path.join(expected_output_path, 'AttrCtx_{}{}.txt'.format(entity_name, file_name_prefix))) \
            if expected_output_path and entity_name else True

        if not file_name_prefix or not file_exists:
            file_name_prefix = '_default'

        return file_name_prefix

    @staticmethod
    async def load_entity_for_resolution_option_and_save(test: 'TestCase', corpus: 'CdmCorpusDefinition', test_name: str, tests_subpath: str, entity_name: str, directives: List[str]) -> 'CdmEntityDefinition':
        """Loads an entity, resolves it, and then validates the generated attribute contexts"""
        expected_output_path = TestHelper.get_expected_output_folder_path(tests_subpath, test_name)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))
        test.assertIsNotNone(entity)
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, directives)
        test.assertIsNotNone(resolved_entity)

        await ProjectionTestUtils.validate_attribute_context(test, directives, expected_output_path, entity_name, resolved_entity)

        return resolved_entity

    @staticmethod
    def get_local_corpus(tests_subpath: str, test_name: str) -> 'CdmCorpusDefinition':
        """Creates a corpus"""
        corpus = TestHelper.get_local_corpus(tests_subpath, test_name)

        def callback(level: CdmStatusLevel, message: str):
            raise Exception(message)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        return corpus

    @staticmethod
    def create_entity(corpus: 'CdmCorpusDefinition', local_root: 'CdmFolderDefinition') -> 'CdmEntityDefinition':
        """Creates an entity"""
        entity_name = 'TestEntity'
        entity = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)

        entity_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_doc.imports.append(ProjectionTestUtils.foundation_json_path)
        entity_doc.definitions.append(entity)
        local_root.documents.append(entity_doc, entity_doc.name)

        return entity

    @staticmethod
    def create_source_entity(corpus: 'CdmCorpusDefinition', local_root: 'CdmFolderDefinition') -> 'CdmEntityDefinition':
        """Creates a source entity for a projection"""
        entity_name = 'SourceEntity'
        entity = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)

        attribute_name1 = 'id'
        attribute1 = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attribute_name1)
        attribute1.date_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'string', True)
        entity.attributes.append(attribute1)

        attributeName2 = 'name'
        attribute2 = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attributeName2)
        attribute2.date_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'string', True)
        entity.attributes.append(attribute2)

        attributeName3 = 'value'
        attribute3 = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attributeName3)
        attribute3.date_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'integer', True)
        entity.attributes.append(attribute3)

        attributeName4 = 'date'
        attribute4 = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attributeName4)
        attribute4.date_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'date', True)
        entity.attributes.append(attribute4)

        entity_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_doc.imports.append(ProjectionTestUtils.foundation_json_path)
        entity_doc.definitions.append(entity)
        local_root.documents.append(entity_doc, entity_doc.name)

        return entity

    @staticmethod
    def create_projection(corpus: 'CdmCorpusDefinition', local_root: 'CdmFolderDefinition') -> 'CdmProjection':
        """Creates a projection"""
        # Create an entity reference to use as the source of the projection
        projection_source = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        projection_source.explicit_reference = ProjectionTestUtils.create_source_entity(corpus, local_root)

        # Create the projection
        projection = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection.source = projection_source

        return projection

    @staticmethod
    async def validate_attribute_context(test: 'TestCase', directives: List[str], expected_output_path: str, entity_name: str, resolved_entity: 'CdmEntityDefinition', update_expected_output: Optional[bool] = False):
        """
        Validates if the attribute context of the resolved entity matches the expected output.
        If update_expected_output is true, will update the expected output txt files for all the tests that are ran.
        """
        if not resolved_entity.attribute_context:
            raise Exception('ValidateAttributeContext called with not resolved entity.')

        file_name_prefix = 'AttrCtx_' + entity_name
        file_name_suffix = ProjectionTestUtils.get_resolution_option_name_suffix(directives)

        # Get actual text
        attr_ctx_util = AttributeContextUtil()
        actual_text = attr_ctx_util.get_attribute_context_strings(resolved_entity)

        if update_expected_output:
            expected_string_file_path = os.path.join(expected_output_path, file_name_prefix + file_name_suffix + '.txt')

            if len(directives) > 0:
                default_file_name_suffix = ProjectionTestUtils.get_resolution_option_name_suffix([])
                default_string_file_path = os.path.join(expected_output_path, file_name_prefix + default_file_name_suffix + '.txt')
                with open(default_string_file_path) as default_file:
                    default_text = default_file.read().replace('\r\n', '\n')

                if actual_text == default_text:
                    if os.path.exists(expected_string_file_path):
                        os.remove(expected_string_file_path)
                else:
                    with open(expected_string_file_path, 'w') as expected_file:
                        expected_file.write(actual_text)
            else:
                with open(expected_string_file_path, 'w') as expected_file:
                    expected_file.write(actual_text)
        else:
            # Actual
            actual_string_file_path = os.path.join(expected_output_path, '..', 'ActualOutput', file_name_prefix + file_name_suffix + '.txt')

            # Save Actual AttrCtx_*.txt and Resolved_*.cdm.json
            with open(actual_string_file_path, 'w') as expected_file:
                expected_file.write(actual_text)
            await resolved_entity.in_document.save_as_async(resolved_entity.entity_name + file_name_suffix + '.cdm.json', save_referenced=False)

            # Expected
            expected_file_name_suffix = ProjectionTestUtils.get_resolution_option_name_suffix(directives, expected_output_path, entity_name)
            expected_string_file_path = os.path.join(expected_output_path, file_name_prefix + expected_file_name_suffix + '.txt')
            with open(expected_string_file_path) as expected_file:
                expected_text = expected_file.read()

            # Test if Actual is Equal to Expected
            test.assertEqual(expected_text.replace('\r\n', '\n'), actual_text.replace('\r\n', '\n'))
