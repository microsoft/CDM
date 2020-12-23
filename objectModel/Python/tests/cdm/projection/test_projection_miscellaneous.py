# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from cdm.utilities import ResolveOptions, AttributeResolutionDirectiveSet
from tests.common import async_test, TestHelper


class ProjectionMiscellaneousTest(unittest.TestCase):
    """Various projections scenarios, partner scenarios, bug fixes"""

    foundation_json_path = 'cdm:/foundations.cdm.json'

    res_opts_combinations = [
        set([]),
        set(['referenceOnly']),
        set(['normalized']),
        set(['structured']),
        set(['referenceOnly', 'normalized']),
        set(['referenceOnly', 'structured']),
        set(['normalized', 'structured']),
        set(['referenceOnly', 'normalized', 'structured'])
    ]

    # The path between TestDataPath and Test_name.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionMiscellaneous')

    @async_test
    async def test_invalid_operation_type(self):
        """
        Test case scenario for Bug #24 from the projections internal bug bash
        Reference Link: https:#commondatamodel.visualstudio.com/CDM/_workitems/edit/24
        """
        test_name = 'test_invalid_operation_type'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        def callback(level, message):
            if 'ProjectionPersistence | Invalid operation type \'replaceAsForeignKey11111\'. | from_data' not in message:
                self.fail(message)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('default.manifest.cdm.json')

        # Raise error: 'ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'.| from_data',
        # when attempting to load a projection with an invalid operation
        entity_name = 'SalesNestedFK'
        entity = await corpus.fetch_object_async('local:/{}.cdm.json/{}'.format(entity_name, entity_name), manifest)
        self.assertIsNotNone(entity)

    @async_test
    async def test_zero_minimum_cardinality(self):
        """
        Test case scenario for Bug #23 from the projections internal bug bash
        Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/23
        """
        test_name = "test_zero_minimum_cardinality"

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        def callback(level, message):
            self.fail(message)

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # Create Local Root Folder
        local_root = corpus.storage.fetch_root_folder('local')

        # Create Manifest
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'default')
        local_root.documents.append(manifest, 'default.manifest.cdm.json')

        entity_name = 'TestEntity'

        # Create Entity
        entity = corpus.make_object(CdmObjectType.ENTITY_DEF, entity_name)
        entity.extends_entity = corpus.make_ref(CdmObjectType.ENTITY_REF, 'CdmEntity', True)

        # Create Entity Document
        document = corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity_name), False)
        document.definitions.append(entity)
        local_root.documents.append(document, document.name)
        manifest.entities.append(entity)

        attribute_name = 'testAttribute'
        attribute_data_type = 'string'
        attribute_purpose = 'hasA'

        # Create Type Attribute
        attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, attribute_name, False)
        foo = attribute.is_nullable
        attribute.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, attribute_data_type, True)
        attribute.purpose = corpus.make_ref(CdmObjectType.PURPOSE_REF, attribute_purpose, True)
        attribute.display_name = attribute_name

        if entity:
            entity.attributes.append(attribute)

        attribute.cardinality = CardinalitySettings(attribute)
        attribute.cardinality.minimum = '0'
        attribute.cardinality.maximum = '*'

        self.assertTrue(attribute.is_nullable)
