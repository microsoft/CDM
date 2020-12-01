# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition
from cdm.persistence.cdmfolder import ManifestPersistence
from cdm.persistence.cdmfolder.types import ManifestContent

from tests.common import async_test, TestHelper

class DataPartitionPatternTest(unittest.TestCase):
    test_subpath = os.path.join('Persistence', 'CdmFolder', 'DataPartitionPattern')

    def test_load_local_entity_with_data_partition_pattern(self):
        content = TestHelper.get_input_file_content(self.test_subpath, 'test_load_local_entity_with_data_partition_pattern', 'entities.manifest.cdm.json')
        manifest_content = ManifestContent()
        manifest_content.decode(content)

        cdm_manifest = ManifestPersistence.from_object(CdmCorpusContext(CdmCorpusDefinition(), None), 'entities', 'testNamespace', '/', manifest_content)
        self.assertEqual(len(cdm_manifest.entities), 2)
        entity1 = cdm_manifest.entities[0]
        self.assertEqual(entity1.object_type, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF)
        self.assertEqual(len(entity1.data_partition_patterns), 1)
        pattern1 = entity1.data_partition_patterns[0]
        self.assertEqual(pattern1.name, 'testPattern')
        self.assertEqual(pattern1.explanation, 'test explanation')
        self.assertEqual(pattern1.root_location, 'test location')
        self.assertEqual(pattern1.regular_expression, '\\s*')
        self.assertEqual(len(pattern1.parameters), 2)
        self.assertEqual(pattern1.parameters[0], 'testParam1')
        self.assertEqual(pattern1.parameters[1], 'testParam2')
        self.assertEqual(pattern1.specialized_schema, 'test special schema')
        self.assertEqual(len(pattern1.exhibits_traits), 1)

        entity2 = cdm_manifest.entities[1]
        self.assertEqual(entity2.object_type, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF)
        self.assertEqual(len(entity2.data_partition_patterns), 1)
        pattern2 = entity2.data_partition_patterns[0]
        self.assertEqual(pattern2.name, 'testPattern2')
        self.assertEqual(pattern2.root_location, 'test location2')
        self.assertEqual(pattern2.glob_pattern, '/*.csv')

        manifest_data = ManifestPersistence.to_data(cdm_manifest, None, None)
        self.assertEqual(len(manifest_data.entities), 2)
        entity_data1 = manifest_data.entities[0]
        self.assertEqual(len(entity_data1.dataPartitionPatterns), 1)
        pattern_data1 = entity_data1.dataPartitionPatterns[0]
        self.assertEqual(pattern_data1.name, 'testPattern')
        self.assertEqual(pattern_data1.explanation, 'test explanation')
        self.assertEqual(pattern_data1.rootLocation, 'test location')
        self.assertEqual(pattern_data1.regularExpression, '\\s*')
        self.assertEqual(len(pattern_data1.parameters), 2)
        self.assertEqual(pattern_data1.parameters[0], 'testParam1')
        self.assertEqual(pattern_data1.parameters[1], 'testParam2')
        self.assertEqual(pattern_data1.specializedSchema, 'test special schema')
        self.assertEqual(len(pattern_data1.exhibitsTraits), 1)

        pattern_data2 = manifest_data.entities[1].dataPartitionPatterns[0]
        self.assertEqual(pattern_data2.name, 'testPattern2')
        self.assertEqual(pattern_data2.rootLocation, 'test location2')
        self.assertEqual(pattern_data2.globPattern, '/*.csv')

    