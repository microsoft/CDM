import os
import unittest

from cdm.persistence.modeljson import ManifestPersistence
from cdm.persistence.modeljson.types import Model

from tests.common import async_test, TestHelper


class DataPartitionTest(unittest.TestCase):
    tests_subpath = os.path.join('persistence', 'modeljson', 'data_partition')

    @async_test
    async def test_model_json_data_partition_location_consistency(self):
        test_name = 'TestModelJsonDataPartitionLocationConsistency'
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest_read = await cdm_corpus.fetch_object_async('default.manifest.cdm.json', cdm_corpus.storage.fetch_root_folder('local'))
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_read.entities[0].data_partitions[0].location)

        converted_to_model_json = await ManifestPersistence.to_data(manifest_read, None, None)
        location = converted_to_model_json.entities[0]['partitions'][0]['location']  # type: str

        # Model Json uses absolute adapter path.
        self.assertTrue(location.find(
            'testdata\\persistence\\modeljson\\data_partition\\TestModelJsonDataPartitionLocationConsistency\\input\\EpisodeOfCare\\partition-data.csv') != -1)

        cdm_corpus2 = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest_after_convertion = await ManifestPersistence.from_data(cdm_corpus2.ctx, converted_to_model_json, cdm_corpus2.storage.fetch_root_folder('local'))
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_after_convertion.entities[0].data_partitions[0].location)

        cdm_corpus3 = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        read_file = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'model.json')
        namespace_folder = cdm_corpus3.storage.fetch_root_folder('local')
        model_json_as_string = read_file.replace('C:\\\\cdm\\\\CDM.ObjectModel.CSharp\\\\Microsoft.CommonDataModel\\\\Microsoft.CommonDataModel.ObjectModel.Tests\\\\TestData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv',
                                                 location.replace('\\', '\\\\'))

        manifest_read_from_model_json = await ManifestPersistence.from_data(cdm_corpus3.ctx, Model().decode(model_json_as_string), namespace_folder)
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_read_from_model_json.entities[0].data_partitions[0].location)
