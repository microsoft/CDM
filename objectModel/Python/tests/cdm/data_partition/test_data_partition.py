# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from tests.common import async_test, TestHelper


class DataPartitionTest(unittest.TestCase):
    test_subpath = os.path.join('Cdm', 'DataPartition')

    @async_test
    async def test_refreshes_data_partition(self):
        """Tests refreshing files that match the regular expression"""
        test_name = 'test_refreshes_data_partition'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        cdmManifest = await cdm_corpus.fetch_object_async('local:/partitions.manifest.cdm.json')
        file_status_check_options = {'include_data_partition_size': True}

        partition_entity = cdmManifest.entities[0]
        self.assertEqual(len(partition_entity.data_partitions), 1)
        partition = partition_entity.data_partitions[0]

        await cdmManifest.file_status_check_async(file_status_check_options=file_status_check_options)

        local_trait_index = partition.exhibits_traits.index('is.partition.size')
        self.assertNotEqual(local_trait_index, -1)
        localTrait = partition.exhibits_traits[local_trait_index]
        self.assertEqual(localTrait.named_reference, 'is.partition.size')
        self.assertEqual(localTrait.arguments[0].value, 2)