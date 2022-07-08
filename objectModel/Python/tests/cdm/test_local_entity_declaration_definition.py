# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from cdm.objectmodel import CdmLocalEntityDeclarationDefinition
from tests.common import TestHelper


class TestLocalEntityDeclarationDefinitionTests(unittest.TestCase):
    def test_manifest_copy(self):
        """Tests if the copy function creates copies of the sub objects"""

        corpus = TestHelper.get_local_corpus('', 'test_manifest_copy', no_input_and_output_folder=True)
        entity = CdmLocalEntityDeclarationDefinition(corpus.ctx, 'name')

        data_partition_name = 'dataPartitionName'
        data_partition_pattern_name = 'dataPartitionPatternName'
        incremental_partition_name = 'incrementalPartitionName'
        incremental_partition_pattern_name = 'incrementalPartitionPatternName'

        data_partition = entity.data_partitions.append(data_partition_name)
        data_partition_pattern = entity.data_partition_patterns.append(data_partition_pattern_name)
        incremental_partition = entity.incremental_partitions.append(incremental_partition_name)
        incremental_partition_pattern = entity.incremental_partition_patterns.append(incremental_partition_pattern_name)

        copy = entity.copy()  # type: CdmLocalEntityDeclarationDefinition
        copy.data_partitions[0].name = 'newDataPartitionName'
        copy.data_partition_patterns[0].name = 'newDataPartitionPatternName'
        copy.incremental_partitions[0].name = 'newIncrementalPartition'
        copy.incremental_partition_patterns[0].name = 'newIncrementalPartitionPatterns'

        self.assertEqual(data_partition_name, data_partition.name)
        self.assertEqual(data_partition_pattern_name, data_partition_pattern.name)
        self.assertEqual(incremental_partition_name, incremental_partition.name)
        self.assertEqual(incremental_partition_pattern_name, incremental_partition_pattern.name)
