# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import CdmOperationType
from cdm.objectmodel import CdmCorpusDefinition, CdmFolderDefinition, CdmProjection, CdmOperationAddCountAttribute, \
    CdmOperationAddSupportingAttribute, CdmOperationAddTypeAttribute, CdmOperationExcludeAttributes, CdmOperationArrayExpansion, \
    CdmOperationCombineAttributes, CdmOperationRenameAttributes, CdmOperationReplaceAsForeignKey, CdmOperationIncludeAttributes, CdmObject
from cdm.storage import LocalAdapter
from tests.common import async_test, TestHelper
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ProjectionObjectModelTest(unittest.TestCase):
    foundation_json_path = 'cdm:/foundations.cdm.json'

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection')

    @async_test
    async def test_projection_using_object_model(self):
        """Basic test to save projection based entities and then try to reload them and validate that the projections were persisted correctly"""
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, 'test_projection_using_object_model')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_projection_using_object_model')))
        local_root = corpus.storage.fetch_root_folder('local')
        manifest_default = self._create_default_manifest(corpus, local_root)

        entity_test_source = self._create_entity_test_source(corpus, manifest_default, local_root)
        entity_test_entity_projection = self._create_entity_test_entity_projection(corpus, manifest_default, local_root)
        entity_test_entity_nested_projection = self._create_entity_test_entity_nested_projection(corpus, manifest_default, local_root)
        entity_test_entity_attribute_projection = self._create_entity_test_entity_attribute_projection(corpus, manifest_default, local_root)
        entity_test_operation_collection = self._create_entity_test_operation_collection(corpus, manifest_default, local_root)

        # Save manifest and entities
        await manifest_default.save_as_async('{}.manifest.cdm.json'.format(manifest_default.manifest_name), True)

        expected = 'TestSource'
        expected_type = CdmObjectType.PROJECTION_DEF
        actual = None
        actual_type = CdmObjectType.ERROR

        # Try to read back the newly persisted manifest and projection based entities
        manifest_read_back = await corpus.fetch_object_async('local:/{}.manifest.cdm.json'.format(manifest_default.manifest_name))
        self.assertEqual(5, len(manifest_read_back.entities))
        self.assertEqual(entity_test_source.entity_name, manifest_read_back.entities[0].entity_name)
        self.assertEqual(entity_test_entity_projection.entity_name, manifest_read_back.entities[1].entity_name)
        self.assertEqual(entity_test_entity_nested_projection.entity_name, manifest_read_back.entities[2].entity_name)
        self.assertEqual(entity_test_entity_attribute_projection.entity_name, manifest_read_back.entities[3].entity_name)

        # Read back the newly persisted manifest and projection based entity TestEntityProjection and validate
        entity_test_entity_projection_read_back = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_test_entity_projection.entity_name, entity_test_entity_projection.entity_name), manifest_read_back)
        self.assertIsNotNone(entity_test_entity_projection_read_back)
        actual = entity_test_entity_projection_read_back.extends_entity.explicit_reference.source.named_reference
        actual_type = entity_test_entity_projection_read_back.extends_entity.explicit_reference.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(expected_type, actual_type)

        # Read back the newly persisted manifest and projection based entity TestEntityNestedProjection and validate
        entity_test_entity_nested_projection_read_back = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_test_entity_nested_projection.entity_name, entity_test_entity_nested_projection.entity_name), manifest_read_back)
        self.assertIsNotNone(entity_test_entity_nested_projection_read_back)
        actual = entity_test_entity_nested_projection_read_back.extends_entity.explicit_reference.source.explicit_reference.source.explicit_reference.source.named_reference
        actual_type = entity_test_entity_nested_projection_read_back.extends_entity.explicit_reference.source.explicit_reference.source.explicit_reference.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(expected_type, actual_type)

        # Read back the newly persisted manifest and projection based entity TestEntityAttributeProjection and validate
        entity_test_entity_attribute_projection_read_back = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_test_entity_attribute_projection.entity_name, entity_test_entity_attribute_projection.entity_name), manifest_read_back)
        self.assertIsNotNone(entity_test_entity_attribute_projection_read_back)
        actual = entity_test_entity_attribute_projection_read_back.attributes[0].entity.explicit_reference.source.named_reference
        actual_type = entity_test_entity_attribute_projection_read_back.attributes[0].entity.explicit_reference.object_type
        self.assertEqual(expected, actual)
        self.assertEqual(expected_type, actual_type)

        # Read back operations collections and validate
        entity_test_operation_collection_read_back = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_test_operation_collection.entity_name, entity_test_operation_collection.entity_name), manifest_read_back)
        self.assertIsNotNone(entity_test_operation_collection_read_back)
        actual_operation_count = len(entity_test_operation_collection_read_back.extends_entity.explicit_reference.operations)
        self.assertEqual(9, actual_operation_count)
        operations = entity_test_operation_collection_read_back.extends_entity.explicit_reference.operations
        self.assertEqual(CdmOperationType.ADD_COUNT_ATTRIBUTE, operations[0].type)
        self.assertEqual(CdmOperationType.ADD_SUPPORTING_ATTRIBUTE, operations[1].type)
        self.assertEqual(CdmOperationType.ADD_TYPE_ATTRIBUTE, operations[2].type)
        self.assertEqual(CdmOperationType.EXCLUDE_ATTRIBUTES, operations[3].type)
        self.assertEqual(CdmOperationType.ARRAY_EXPANSION, operations[4].type)
        self.assertEqual(CdmOperationType.COMBINE_ATTRIBUTES, operations[5].type)
        self.assertEqual(CdmOperationType.RENAME_ATTRIBUTES, operations[6].type)
        self.assertEqual(CdmOperationType.REPLACE_AS_FOREIGN_KEY, operations[7].type)
        self.assertEqual(CdmOperationType.INCLUDE_ATTRIBUTES, operations[8].type)

    def _create_default_manifest(self, corpus: 'CdmCorpusDefinition', local_root: 'CdmFolderDefinition') -> 'CdmManifestDefinition':
        """Create a default manifest"""
        manifest_name = 'default'
        manifest_doc_name = '{}.manifest.cdm.json'.format(manifest_name)

        manifest_default = corpus.make_object(CdmObjectType.MANIFEST_DEF, manifest_name)

        local_root.documents.append(manifest_default, manifest_doc_name)

        return manifest_default

    def _create_entity_test_source(self, corpus: 'CdmCorpusDefinition', manifest_default: 'CdmManifestDefinition', local_root: 'CdmFolderDefinition') -> 'CdmEntityDefinition':
        """Create a simple entity called 'TestSource' with a single attribute"""
        entity_name = 'TestSource'

        entity_test_source = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)

        attribute_name = 'TestAttribute'
        entity_test_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attribute_name, False)
        entity_test_attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'string', True)
        entity_test_attribute.purpose = corpus.make_ref(CdmObjectType.PURPOSE_REF, 'hasA', True)
        entity_test_attribute.display_name = attribute_name
        entity_test_source.attributes.append(entity_test_attribute)

        entity_test_source_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_test_source_doc.imports.append(self.foundation_json_path)
        entity_test_source_doc.definitions.append(entity_test_source)

        local_root.documents.append(entity_test_source_doc, entity_test_source_doc.name)
        manifest_default.entities.append(entity_test_source)

        return entity_test_source

    def _create_projection(self, corpus: 'CdmCorpusDefinition') -> 'CdmProjection':
        """Create a simple projection object"""
        projection = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection.source = corpus.make_object(CdmObjectType.ENTITY_REF, 'TestSource', True)

        return projection

    def _create_nested_projection(self, corpus: 'CdmCorpusDefinition') -> 'CdmProjection':
        """Create a 3-level nested projection object"""
        projection3 = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection3.source = corpus.make_object(CdmObjectType.ENTITY_REF, 'TestSource', True)

        inline_projection_entity_ref3 = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        inline_projection_entity_ref3.explicit_reference = projection3

        projection2 = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection2.source = inline_projection_entity_ref3

        inline_projection_entity_ref2 = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        inline_projection_entity_ref2.explicit_reference = projection2

        projection1 = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection1.source = inline_projection_entity_ref2

        return projection1

    def _create_entity_test_entity_projection(self, corpus: 'CdmCorpusDefinition', manifest_default: 'CdmManifestDefinition', local_root: 'CdmFolderDefinition') -> 'CdmEntityDefinition':
        """Create an entity 'TestEntityProjection' that extends from a projection"""
        entity_name = 'TestEntityProjection'

        inline_projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        inline_projection_entity_ref.explicit_reference = self._create_projection(corpus)

        entity_test_entity_projection = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)
        entity_test_entity_projection.extends_entity = inline_projection_entity_ref

        entity_test_entity_projection_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_test_entity_projection_doc.imports.append(self.foundation_json_path)
        entity_test_entity_projection_doc.imports.append('TestSource.cdm.json')
        entity_test_entity_projection_doc.definitions.append(entity_test_entity_projection)

        local_root.documents.append(entity_test_entity_projection_doc, entity_test_entity_projection_doc.name)
        manifest_default.entities.append(entity_test_entity_projection)

        return entity_test_entity_projection

    def _create_entity_test_entity_nested_projection(self, corpus: 'CdmCorpusDefinition', manifest_default: 'CdmManifestDefinition', local_root: 'CdmFolderDefinition') -> 'CdmEntityDefinition':
        """Create an entity 'TestEntityNestedProjection' that extends from a projection"""
        entity_name = 'TestEntityNestedProjection'

        inline_projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        inline_projection_entity_ref.explicit_reference = self._create_nested_projection(corpus)

        entity_test_entity_nested_projection = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)
        entity_test_entity_nested_projection.extends_entity = inline_projection_entity_ref

        entity_test_entity_nested_projection_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_test_entity_nested_projection_doc.imports.append(self.foundation_json_path)
        entity_test_entity_nested_projection_doc.imports.append('TestSource.cdm.json')
        entity_test_entity_nested_projection_doc.definitions.append(entity_test_entity_nested_projection)

        local_root.documents.append(entity_test_entity_nested_projection_doc, entity_test_entity_nested_projection_doc.name)
        manifest_default.entities.append(entity_test_entity_nested_projection)

        return entity_test_entity_nested_projection

    def _create_entity_test_entity_attribute_projection(self, corpus: 'CdmCorpusDefinition', manifest_default: 'CdmManifestDefinition', local_root: 'CdmFolderDefinition') -> 'CdmEntityDefinition':
        """Create an entity 'TestEntityAttributeProjection' that contains an entity attribute with a projection as a source entity"""
        entity_name = 'TestEntityAttributeProjection'

        inline_projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        inline_projection_entity_ref.explicit_reference = self._create_projection(corpus)

        entity_test_entity_attribute_projection = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)

        attribute_name = 'TestAttribute'
        entity_test_entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, attribute_name, False)
        entity_test_entity_attribute.entity = inline_projection_entity_ref
        entity_test_entity_attribute_projection.attributes.append(entity_test_entity_attribute)

        entity_test_entity_attribute_projection_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_test_entity_attribute_projection_doc.imports.append(self.foundation_json_path)
        entity_test_entity_attribute_projection_doc.imports.append('TestSource.cdm.json')
        entity_test_entity_attribute_projection_doc.definitions.append(entity_test_entity_attribute_projection)

        local_root.documents.append(entity_test_entity_attribute_projection_doc, entity_test_entity_attribute_projection_doc.name)
        manifest_default.entities.append(entity_test_entity_attribute_projection)

        return entity_test_entity_attribute_projection

    def _create_projection_with_operation_collection(self, corpus: 'CdmCorpusDefinition', owner: 'CdmObject') -> 'CdmProjection':
        """Create a projection object with operations"""
        projection = corpus.make_object(CdmObjectType.PROJECTION_DEF)
        projection.source = corpus.make_object(CdmObjectType.ENTITY_REF, 'TestSource', True)

        # AddCountAttribute Operation
        add_count_attribute_op = CdmOperationAddCountAttribute(corpus.ctx)
        add_count_attribute_op.count_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'countAtt')
        projection.operations.append(add_count_attribute_op)

        # AddSupportingAttribute Operation
        add_supporting_attribute_op = CdmOperationAddSupportingAttribute(corpus.ctx)
        add_supporting_attribute_op.supporting_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'supportingAtt')
        projection.operations.append(add_supporting_attribute_op)

        # AddTypeAttribute Operation
        add_type_attribute_op = CdmOperationAddTypeAttribute(corpus.ctx)
        add_type_attribute_op.type_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'typeAtt')
        projection.operations.append(add_type_attribute_op)

        # ExcludeAttributes Operation
        exclude_attributes_op = CdmOperationExcludeAttributes(corpus.ctx)
        exclude_attributes_op.exclude_attributes = []
        exclude_attributes_op.exclude_attributes.append('testAttribute1')
        projection.operations.append(exclude_attributes_op)

        # ArrayExpansion Operation
        array_expansion_op = CdmOperationArrayExpansion(corpus.ctx)
        array_expansion_op.start_ordinal = 0
        array_expansion_op.end_ordinal = 1
        projection.operations.append(array_expansion_op)

        # CombineAttributes Operation
        combine_attributes_op = CdmOperationCombineAttributes(corpus.ctx)
        combine_attributes_op.select = []
        combine_attributes_op.merge_into = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'combineAtt')
        combine_attributes_op.select.append('testAttribute1')
        projection.operations.append(combine_attributes_op)

        # RenameAttributes Operation
        rename_attributes_op = CdmOperationRenameAttributes(corpus.ctx)
        rename_attributes_op.rename_format = '{m}'
        projection.operations.append(rename_attributes_op)

        # ReplaceAsForeignKey Operation
        replace_as_foreign_key_op = CdmOperationReplaceAsForeignKey(corpus.ctx)
        replace_as_foreign_key_op.reference = 'testAttribute1'
        replace_as_foreign_key_op.replace_with = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'testForeignKey', False)
        projection.operations.append(replace_as_foreign_key_op)

        # IncludeAttributes Operation
        include_attributes_op = CdmOperationIncludeAttributes(corpus.ctx)
        include_attributes_op.include_attributes = []
        include_attributes_op.include_attributes.append('testAttribute1')
        projection.operations.append(include_attributes_op)

        return projection

    def _create_entity_test_operation_collection(self, corpus: 'CdmCorpusDefinition', manifest_default: 'CdmManifestDefinition', local_root: 'CdmFolderDefinition'):
        """Create an entity 'TestOperationCollection' that extends from a projection with a collection of operations"""
        entity_name = 'TestOperationCollection'

        inline_projection_entity_ref = corpus.make_object(CdmObjectType.ENTITY_REF, None)
        entity_test_operation_collection = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)
        inline_projection_entity_ref.explicit_reference = self._create_projection_with_operation_collection(corpus, entity_test_operation_collection)
        entity_test_operation_collection.extends_entity = inline_projection_entity_ref

        entity_test_operation_collection_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_test_operation_collection_doc.imports.append(self.foundation_json_path)
        entity_test_operation_collection_doc.imports.append('TestSource.cdm.json')
        entity_test_operation_collection_doc.definitions.append(entity_test_operation_collection)

        local_root.documents.append(entity_test_operation_collection_doc, entity_test_operation_collection_doc.name)
        manifest_default.entities.append(entity_test_operation_collection)

        return entity_test_operation_collection
