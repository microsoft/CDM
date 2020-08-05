# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmOperationCollection, CdmOperationReplaceAsForeignKey, CdmOperationAddCountAttribute, \
    CdmOperationArrayExpansion, CdmOperationAddSupportingAttribute, CdmFolderDefinition, CdmCorpusDefinition
from cdm.resolvedmodel.projections.condition_expression import ConditionExpression
from cdm.storage import LocalAdapter
from tests.common import TestHelper


class ConditionExpressionUnitTest(unittest.TestCase):
    """Unit test for ConditionExpression functions"""

    foundation_json_path = 'cdm:/foundations.cdm.json'

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestConditionExpression')

    def test_get_default_condition_expression(self):
        """Unit test for ConditionExpression._get_default_condition_expression"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_get_default_condition_expression')
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_actual_output_folder_path(self.tests_subpath, 'test_get_default_condition_expression')))
        local_root = corpus.storage.fetch_root_folder('local')
        manifest_default = self._create_default_manifest(corpus, local_root)

        entity_test_source = self._create_entity_test_source(corpus, manifest_default, local_root)

        # projection for a non entity attribute
        op_coll = CdmOperationCollection(corpus.ctx, entity_test_source)

        # add 1st FK
        op_coll.append(CdmOperationReplaceAsForeignKey(corpus.ctx))
        self.assertEqual(' (referenceOnly || noMaxDepth || (depth > maxDepth)) ', ConditionExpression._get_default_condition_expression(op_coll, entity_test_source))

        # add 2nd FK
        op_coll.append(CdmOperationReplaceAsForeignKey(corpus.ctx))
        self.assertEqual(' (referenceOnly || noMaxDepth || (depth > maxDepth)) ', ConditionExpression._get_default_condition_expression(op_coll, entity_test_source))

        op_coll.clear()

        # add AddCount
        op_coll.append(CdmOperationAddCountAttribute(corpus.ctx))
        self.assertEqual(' (!structured) ', ConditionExpression._get_default_condition_expression(op_coll, entity_test_source))

        # add ArrayExpansion
        op_coll.append(CdmOperationArrayExpansion(corpus.ctx))
        self.assertEqual(' (!structured) ', ConditionExpression._get_default_condition_expression(op_coll, entity_test_source))

        op_coll.clear()

        # add AddSupporting
        op_coll.append(CdmOperationAddSupportingAttribute(corpus.ctx))
        self.assertEqual(' (true) ', ConditionExpression._get_default_condition_expression(op_coll, entity_test_source))

        entity_test_entity_attribute = corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, 'TestEntityAttribute', False)

        # projection for a non entity attribute
        op_coll_EA = CdmOperationCollection(corpus.ctx, entity_test_entity_attribute)

        # add 1st FK
        op_coll_EA.append(CdmOperationReplaceAsForeignKey(corpus.ctx))
        self.assertEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ', ConditionExpression._get_default_condition_expression(op_coll_EA, entity_test_entity_attribute))

        # add 2nd FK
        op_coll_EA.append(CdmOperationReplaceAsForeignKey(corpus.ctx))
        self.assertEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ', ConditionExpression._get_default_condition_expression(op_coll_EA, entity_test_entity_attribute))

        op_coll_EA.clear()

        # add AddCount
        op_coll_EA.append(CdmOperationAddCountAttribute(corpus.ctx))
        self.assertEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ', ConditionExpression._get_default_condition_expression(op_coll_EA, entity_test_entity_attribute))

        # add ArrayExpansion
        op_coll_EA.append(CdmOperationArrayExpansion(corpus.ctx))
        self.assertEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ', ConditionExpression._get_default_condition_expression(op_coll_EA, entity_test_entity_attribute))

        op_coll_EA.clear()

        # add AddSupporting
        op_coll_EA.append(CdmOperationAddSupportingAttribute(corpus.ctx))
        self.assertEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (true) ', ConditionExpression._get_default_condition_expression(op_coll_EA, entity_test_entity_attribute))

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
        entity_test_attribute.DisplayName = attribute_name

        entity_test_source.attributes.append(entity_test_attribute)

        entity_test_source_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        entity_test_source_doc.imports.append(self.foundation_json_path)
        entity_test_source_doc.definitions.append(entity_test_source)

        local_root.documents.append(entity_test_source_doc, entity_test_source_doc.name)
        manifest_default.entities.append(entity_test_source)

        return entity_test_source
