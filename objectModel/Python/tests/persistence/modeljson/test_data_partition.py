import os
import unittest

from cdm.persistence.modeljson import ManifestPersistence
from cdm.persistence.modeljson.types import Model

from tests.common import async_test, TestHelper


class DataPartitionTest(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'ModelJson', 'DataPartition')

    @async_test
    async def test_model_json_data_partition_location_consistency(self):
        '''
            Testing whether DataPartition Location is consistently populated when:
             1. Manifest is read directly.
             2. Manifest is obtained by converting a model.json.
        '''
        test_name = 'test_model_json_data_partition_location_consistency'
        test_name_in_pascal_case = TestHelper.to_pascal_case(test_name)
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest_read = await cdm_corpus.fetch_object_async('default.manifest.cdm.json', cdm_corpus.storage.fetch_root_folder('local'))
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_read.entities[0].data_partitions[0].location)

        converted_to_model_json = await ManifestPersistence.to_data(manifest_read, None, None)
        location = converted_to_model_json.entities[0]['partitions'][0]['location']  # type: str
        location_path = 'testdata\\Persistence\\ModelJson\\DataPartition\\{}\\Input\\EpisodeOfCare\\partition-data.csv'.format(test_name_in_pascal_case)
        # Model Json uses absolute adapter path.
        self.assertTrue(location.find(location_path) != -1)

        cdm_corpus2 = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest_after_convertion = await ManifestPersistence.from_object(cdm_corpus2.ctx, converted_to_model_json, cdm_corpus2.storage.fetch_root_folder('local'))
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_after_convertion.entities[0].data_partitions[0].location)

        # TODO: Need to change path in C#
        # cdm_corpus3 = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        # read_file = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'model.json')
        # namespace_folder = cdm_corpus3.storage.fetch_root_folder('local')
        # location_path3 = 'C:\\\\cdm\\\\CDM.ObjectModel.CSharp\\\\Microsoft.CommonDataModel\\\\Microsoft.CommonDataModel.ObjectModel.Tests\\\\TestData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv'
        # model_json_as_string = read_file.replace(location_path3,
        #                                          location.replace('\\', '\\\\'))

        # manifest_read_from_model_json = await ManifestPersistence.from_object(cdm_corpus3.ctx, Model().decode(model_json_as_string), namespace_folder)
        # self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_read_from_model_json.entities[0].data_partitions[0].location)
