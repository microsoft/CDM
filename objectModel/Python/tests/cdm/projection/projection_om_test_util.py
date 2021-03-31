# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
from typing import List

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmEntityDefinition, CdmCorpusDefinition, \
    CdmManifestDefinition, CdmDocumentDefinition, \
    CdmTypeAttributeDefinition, CdmProjection, CdmEntityReference, \
    CdmOperationIncludeAttributes, CdmEntityAttributeDefinition, CdmOperationCombineAttributes, CdmDataTypeReference, \
    CdmPurposeReference
from cdm.storage import LocalAdapter
from tests.cdm.projection.type_attribute_param import TypeAttributeParam
from tests.common import TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionOMTestUtil:
    """Utility class to help create object model based tests"""

    def __init__(self, class_name: str, test_name: str):
        self._foundation_json_path = 'cdm:/foundations.cdm.json'  # type: str
        self._local_output_storage_ns = 'output'  # type: str
        self._manifest_name = 'default'  # type: str
        self._manifest_doc_name = '{}.manifest.cdm.json'.format(self._manifest_name)  # type: str
        self._all_imports_name = '_allImports'  # type: str
        self._all_imports_doc_name = '{}.cdm.json'.format(self._all_imports_name)  # type: str

        self._class_name = class_name  # type: str
        self._test_name = test_name  # type: str

        self._tests_sub_path = os.path.join('Cdm', 'Projection', class_name)  # type: str

        self._input_path = TestHelper.get_input_folder_path(self._tests_sub_path, test_name)  # type: str
        self._expected_output_path = TestHelper.get_expected_output_folder_path(self._tests_sub_path, test_name)  # type: str
        self._actual_output_path = TestHelper.get_actual_output_folder_path(self._tests_sub_path, test_name)  # type: str

        self._corpus = TestHelper.get_local_corpus(self._tests_sub_path, test_name)  # type: CdmCorpusDefinition
        self._corpus.storage.mount(self._local_output_storage_ns, LocalAdapter(self._actual_output_path))
        self._corpus.storage.defaultNamespace = self._local_output_storage_ns

        self._local_storage_root = self._corpus.storage.fetch_root_folder(self._local_output_storage_ns)  # type CdmFolderDefinition
        self._default_manifest = self.create_default_manifest()  # type: CdmManifestDefinition
        self._all_imports = self.create_and_initialize_all_imports_file()  # type: CdmDocumentDefinition


    def dispose(self):
        self._corpus = None


    # class_name property
    def get_class_name(self):
        return self._class_name

    def set_class_name(self, class_name):
        self._class_name = class_name


    # test_name property
    def get_test_name(self):
        return self._test_name

    def set_test_name(self, test_name):
        self._test_name = test_name


    # Corpus property
    def get_corpus(self):
        return self._corpus

    def set_corpus(self, corpus):
        self._corpus = corpus


    # InputPath property
    def get_input_path(self):
        return self._input_path

    def set_input_path(self, input_path):
        self._input_path = input_path


    # expected_output_path property
    def get_expected_output_path(self):
        return self._expected_output_path

    def set_expected_output_path(self, expected_output_path):
        self._expected_output_path = expected_output_path


    # actual_output_path property
    def get_actual_output_path(self):
        return self._actual_output_path

    def set_actual_output_path(self, actual_output_path):
        self._actual_output_path = actual_output_path


    # local_storage_root property
    def get_local_storage_root(self):
        return self._local_storage_root

    def set_local_storage_root(self, local_storage_root):
        self._local_storage_root = local_storage_root


    # default_manifest property
    def get_default_manifest(self):
        return self._default_manifest

    def set_default_manifest(self, default_manifest):
        self._default_manifest = default_manifest


    # all_imports property
    def get_all_imports(self):
        return self._all_imports

    def set_all_imports(self, all_imports):
        self._all_imports = all_imports


    # Create a default manifest
    def create_default_manifest(self) -> 'CdmManifestDefinition':
        manifestDefault = self._corpus.make_object(CdmObjectType.MANIFEST_DEF, self._manifest_name)  # type: CdmManifestDefinition
        self._local_storage_root.documents.append(manifestDefault, self._manifest_doc_name)

        return manifestDefault

    # Create and initialize _all_imports file
    def create_and_initialize_all_imports_file(self) -> 'CdmDocumentDefinition':
        all_importsDoc = CdmDocumentDefinition(self._corpus.ctx, self._all_imports_name)  # type: CdmDocumentDefinition

        all_imports_doc_def = self._local_storage_root.documents.append(all_importsDoc, self._all_imports_doc_name)  # type: CdmDocumentDefinition
        all_imports_doc_def.imports.append(self._foundation_json_path)

        return all_imports_doc_def

    # Create a simple entity called 'TestSource' with a single attribute
    def create_basic_entity(self, entity_name: str, attributesParams: ['TypeAttributeParam']) -> 'CdmEntityDefinition':
        entity = self._corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)  # type: CdmEntityDefinition

        for attributesParam in attributesParams:
            attribute = self._corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attributesParam.get_attribute_name(), False)  # type: CdmTypeAttributeDefinition
            attribute.data_type = self._corpus.make_ref(CdmObjectType.DATA_TYPE_REF, attributesParam.get_attribute_data_type(), True)
            attribute.purpose = self._corpus.make_ref(CdmObjectType.PURPOSE_REF, attributesParam.get_attribute_purpose(), True)
            attribute.display_name = attributesParam.get_attribute_name()

            entity.attributes.append(attribute)

        entity_doc = self._corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)  # type: CdmDocumentDefinition
        entity_doc.imports.append(self._all_imports_doc_name)
        entity_doc.definitions.append(entity)

        self._local_storage_root.documents.append(entity_doc, entity_doc.name)
        self._default_manifest.entities.append(entity)
        self._all_imports.imports.append(entity.in_document.name)

        return entity

    # Create a simple projection object
    def create_projection(self, projectionSourceName: str) -> 'CdmProjection':
        projection = self._corpus.make_object(CdmObjectType.PROJECTION_DEF)  # type: CdmProjection
        projection.source = self._corpus.make_object(CdmObjectType.ENTITY_REF, projectionSourceName, True)

        return projection

    # Create an inline entity reference for a projection
    def create_projection_inline_entity_reference(self, projection: 'CdmProjection') -> 'CdmEntityReference':
        projection_inline_entity_ref = self._corpus.make_object(CdmObjectType.ENTITY_REF, None)  #type: CdmEntityReference
        projection_inline_entity_ref.explicit_reference = projection

        return projection_inline_entity_ref

    # Create an Input Attribute Operation
    def create_operation_input_attribute(self, projection: 'CdmProjection', includeAttributes: [str]) -> 'CdmOperationIncludeAttributes':
        # IncludeAttributes Operation
        include_attributes_op = CdmOperationIncludeAttributes(self._corpus.ctx)  # type: CdmOperationIncludeAttributes
        include_attributes_op.include_attributes = []

        for includeAttribute in includeAttributes:
            include_attributes_op.include_attributes.append(includeAttribute)

        projection.operations.append(include_attributes_op)

        return include_attributes_op

    # Create a Combine Attribute Operation
    def create_operation_combine_attributes(self, projection: 'CdmProjection', selected_attributes: List[str], merge_into_attribute: 'CdmTypeAttributeDefinition') -> 'CdmOperationCombineAttributes':
        # CombineAttributes Operation
        combine_attributes_op = CdmOperationCombineAttributes(self._corpus.ctx)  # type: CdmOperationCombineAttributes
        combine_attributes_op.select = selected_attributes
        combine_attributes_op.merge_into = merge_into_attribute

        projection.operations.append(combine_attributes_op)

        return combine_attributes_op

    # Create a Type Attribute
    def create_type_attribute(self, attribute_name: str, dataType: str, purpose: str) -> 'CdmTypeAttributeDefinition':
        data_type_ref = self._corpus.make_ref(CdmObjectType.DATA_TYPE_REF, dataType, False)  # type: CdmDataTypeReference

        purpose_ref = self._corpus.make_ref(CdmObjectType.PURPOSE_REF, purpose, False)  # type: CdmPurposeReference

        attribute = self._corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attribute_name, False)  # type: CdmTypeAttributeDefinition
        attribute.data_type = data_type_ref
        attribute.purpose = purpose_ref

        return attribute

    # Create an entity attribute
    def create_entity_attribute(self, entityAttributeName: str, projectionSourceEntityRef: 'CdmEntityReference') -> 'CdmEntityAttributeDefinition':
        entityAttribute = self._corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, entityAttributeName, False)  # type: CdmEntityAttributeDefinition
        entityAttribute.entity = projectionSourceEntityRef

        return entityAttribute

    #  Get & validate resolved entity
    async def get_and_validate_resolved_entity(self, test, entity: 'CdmEntityDefinition', res_opts: [str]) -> 'CdmEntityDefinition':
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(self._corpus, entity, res_opts)  # type: CdmEntityDefinition
        separator = ', '  # type: str
        test.assertIsNotNone(resolved_entity, 'get_and_validate_resolved_entity: entity.entity_name resolution with options {} failed!'.format(separator.join(res_opts)))

        return resolved_entity
