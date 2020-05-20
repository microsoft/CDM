# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import json
import os
import unittest

from cdm.enums import CdmObjectType, CdmStatusLevel
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition
from cdm.persistence.cdmfolder import ManifestPersistence
from cdm.persistence.cdmfolder.types import ManifestContent
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper


class DataPartitionTest(unittest.TestCase):
    test_subpath = os.path.join('Persistence', 'CdmFolder', 'DataPartition')

    @async_test
    async def test_load_local_entitiy_with_data_partition(self):
        content = TestHelper.get_input_file_content(self.test_subpath, 'test_load_local_entity_with_data_partition', 'entities.manifest.cdm.json')
        manifest_content = ManifestContent()
        manifest_content.decode(content)

        cdm_manifest = ManifestPersistence.from_object(CdmCorpusContext(CdmCorpusDefinition(), None), 'entities', 'testNamespace', '/', manifest_content)
        self.assertEqual(len(cdm_manifest.entities), 1)
        self.assertEqual(cdm_manifest.entities[0].object_type, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF)
        entity = cdm_manifest.entities[0]
        self.assertEqual(len(entity.data_partitions), 2)
        relative_partition = entity.data_partitions[0]
        self.assertEqual(relative_partition.name, 'Sample data partition')
        self.assertEqual(relative_partition.location, 'test/location')
        # self.assertEqual(TimeUtils.GetFormattedDateString(relative_partition.LastFileModifiedTime), '2008-09-15T23:53:23.000Z')
        self.assertEqual(len(relative_partition.exhibits_traits), 1)
        self.assertEqual(relative_partition.specialized_schema, 'teststring')

        test_list = relative_partition.arguments['test']
        self.assertEqual(len(test_list), 3)
        self.assertEqual(test_list[0], 'something')
        self.assertEqual(test_list[1], 'somethingelse')
        self.assertEqual(test_list[2], 'anotherthing')

        key_list = relative_partition.arguments['KEY']
        self.assertEqual(len(key_list), 1)
        self.assertEqual(key_list[0], 'VALUE')

        self.assertFalse('wrong' in relative_partition.arguments)

        absolute_partition = entity.data_partitions[1]
        self.assertEqual(absolute_partition.location, "local:/some/test/location")

    @async_test
    async def test_programmatically_create_partitions(self):
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'manifest')
        entity = manifest.entities.append('entity')

        relative_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'relative partition')
        relative_partition.location = 'relative/path'
        relative_partition.arguments['test1'] = ['argument1']
        relative_partition.arguments['test2'] = ['argument2', 'argument3']

        absolute_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'absolute partition')
        absolute_partition.location = 'local:/absolute/path'
        # add an empty arguments list to test empty list should not be displayed in ToData json.
        absolute_partition.arguments['test'] = []

        entity.data_partitions.append(relative_partition)
        entity.data_partitions.append(absolute_partition)

        manifest_data = ManifestPersistence.to_data(manifest, None, None)
        self.assertEqual(len(manifest_data.entities), 1)
        entityData = manifest_data.entities[0]
        partitions_list = entityData.dataPartitions
        self.assertEqual(len(partitions_list), 2)
        relative_partition_data = partitions_list[0]
        absolute_partition_data = partitions_list[-1]

        self.assertEqual(relative_partition_data.location, relative_partition.location)
        arguments_list = relative_partition_data.arguments
        self.assertEqual(3, len(arguments_list))
        checked_arguments = []
        for argument in arguments_list:
            self.assertEqual(3, len(argument))
            checked_arguments.append(argument.value)
            if argument.value == 'argument1':
                self.assertEqual('test1', argument.name)
            elif argument.value == 'argument2':
                self.assertEqual('test2', argument.name)
            elif argument.value == 'argument3':
                self.assertEqual('test2', argument.name)
            else:
                raise Exception('unexpected argument in data partitions')
        self.assertTrue('argument1' in checked_arguments)
        self.assertTrue('argument2' in checked_arguments)
        self.assertTrue('argument3' in checked_arguments)

        self.assertEqual(absolute_partition_data.location, absolute_partition.location)
        # test if empty argument list is set to null
        self.assertEqual(absolute_partition_data.arguments, None)
