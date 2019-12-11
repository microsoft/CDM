
from datetime import datetime, timezone
import os
import unittest

from cdm.objectmodel import CdmCorpusDefinition
from cdm.storage import LocalAdapter


from tests.common import async_test, TestHelper


class ManifestImplTest(unittest.TestCase):
    tests_subpath = os.path.join('persistence', 'cdmfolder', 'manifest')

    @async_test
    async def test_refreshes_data_partition_patterns(self):
        input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'TestRefreshDataPartitionPatterns')

        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.mount('local', LocalAdapter(input_path))
        cdm_corpus.storage.default_namespace = 'local'
        cdm_manifest = await cdm_corpus.fetch_object_async('local:/patternManifest.manifest.cdm.json')

        partition_entity = cdm_manifest.entities[0]
        self.assertEqual(1, len(partition_entity.data_partitions))

        time_before_load = datetime.now(timezone.utc)

        await cdm_manifest.file_status_check_async()

        # file status check should check patterns and add two more partitions that match the pattern
        # should not re-add already existing partitions

        # Mac and Windows behave differently when listing file content, so we don't want to be strict about partition file order
        total_expected_partitions_found = 0
        for partition in partition_entity.data_partitions:
            if partition.location == 'partitions/existingPartition.csv':
                total_expected_partitions_found += 1
            elif partition.location == 'partitions/someSubFolder/someSubPartition.csv':
                total_expected_partitions_found += 1
                self.assertEqual(partition.specialized_schema, 'test special schema')
                self.assertTrue(partition.last_file_status_check_time > time_before_load)

                # inherits the exhibited traits from pattern
                self.assertEqual(len(partition.exhibits_traits), 1)
                self.assertEqual(partition.exhibits_traits[0].named_reference, 'is')

                self.assertEqual(len(partition.arguments), 1)
                self.assertTrue('testParam1' in partition.arguments)
                arg_array = partition.arguments['testParam1']
                self.assertEqual(len(arg_array), 1)
                self.assertEqual(arg_array[0], '/someSubFolder/someSub')
            elif partition.location == 'partitions/newPartition.csv':
                total_expected_partitions_found += 1
                self.assertEqual(len(partition.arguments), 1)
            elif partition.location == 'partitions/2018/folderCapture.csv':
                total_expected_partitions_found += 1
                self.assertEqual(len(partition.arguments), 1)
                self.assertTrue('year' in partition.arguments)
                self.assertEqual(partition.arguments['year'][0], '2018')
            elif partition.location == 'partitions/2018/8/15/folderCapture.csv':
                total_expected_partitions_found += 1
                self.assertEqual(len(partition.arguments), 3)
                self.assertTrue('year' in partition.arguments)
                self.assertEqual(partition.arguments['year'][0], '2018')
                self.assertTrue('month' in partition.arguments)
                self.assertEqual(partition.arguments['month'][0], '8')
                self.assertTrue('day' in partition.arguments)
                self.assertEqual(partition.arguments['day'][0], '15')
            elif partition.location == 'partitions/2018/8/15/folderCaptureRepeatedGroup.csv':
                total_expected_partitions_found += 1
                self.assertEqual(len(partition.arguments), 1)
                self.assertTrue('day' in partition.arguments)
                self.assertEqual(partition.arguments['day'][0], '15')
            elif partition.location == 'partitions/testTooFew.csv':
                total_expected_partitions_found += 1
                self.assertEqual(len(partition.arguments), 0)
            elif partition.location == 'partitions/testTooMany.csv':
                total_expected_partitions_found += 1
                self.assertEqual(len(partition.arguments), 0)

        self.assertEqual(8, total_expected_partitions_found)
