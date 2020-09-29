# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional

from cdm.enums import CdmObjectType
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions
from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import TestHelper


class ProjectionTestUtils:
    """Common utility methods for projection tests"""

    # Path to foundations
    foundation_json_path = 'cdm:/foundations.cdm.json'

    @staticmethod
    async def get_resolved_entity(corpus: 'CdmCorpusDefinition', input_entity: 'CdmEntityDefinition', resolution_options: List[str], add_res_opt_to_name: Optional[bool] = False) -> 'CdmEntityDefinition':
        """Resolves an entity"""
        ro_hash_set = set()
        for i in range(len(resolution_options)):
            ro_hash_set.add(resolution_options[i])

        resolved_entity_name = ''

        if add_res_opt_to_name:
            file_name_suffix = ProjectionTestUtils.get_resolution_option_name_suffix(resolution_options)
            resolved_entity_name = 'Resolved_{}{}'.format(input_entity.entity_name, file_name_suffix)
        else:
            resolved_entity_name = 'Resolved_{}'.format(input_entity.entity_name)

        ro = ResolveOptions(input_entity.in_document, directives=AttributeResolutionDirectiveSet(ro_hash_set))

        resolved_folder = corpus.storage.fetch_root_folder('output')
        resolved_entity = await input_entity.create_resolved_entity_async(resolved_entity_name, ro, resolved_folder)

        return resolved_entity

    @staticmethod
    def get_resolution_option_name_suffix(resolution_options: List[str]) -> str:
        """Returns a suffix that contains the file name and resolution option used"""
        file_name_prefix = ''

        for i in range(len(resolution_options)):
            file_name_prefix = '{}_{}'.format(file_name_prefix, resolution_options[i])

        if not file_name_prefix:
            file_name_prefix = '_default'

        return file_name_prefix

    @staticmethod
    async def load_entity_for_resolution_option_and_save(test: 'TestCase', corpus: 'CdmCorpusDefinition', test_name: str, tests_subpath: str, entity_name: str, res_opts: List[str]) -> None:
        """Loads an entity, resolves it, and then validates the generated attribute contexts"""
        expected_output_path = TestHelper.get_expected_output_folder_path(tests_subpath, test_name)
        file_name_suffix = ProjectionTestUtils.get_resolution_option_name_suffix(res_opts)

        entity = await corpus.fetch_object_async('local:/{0}.cdm.json/{0}'.format(entity_name))
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, res_opts, True)
        AttributeContextUtil.validate_attribute_context(test, corpus, expected_output_path, '{}{}'.format(entity_name, file_name_suffix), resolved_entity)

    @staticmethod
    def get_corpus(test_name: str, tests_subpath: str) -> 'CdmCorpusDefinition':
        """Creates a corpus"""
        corpus = TestHelper.get_local_corpus(tests_subpath, test_name)
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
