# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.objectmodel import CdmManifestDefinition
from cdm.utilities import CopyOptions, ResolveOptions
from cdm.persistence.modeljson import ManifestPersistence
from cdm.persistence.modeljson.types import Model
from cdm.utilities.string_utils import StringUtils

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
        test_name_in_pascal_case = StringUtils.snake_case_to_pascal_case(test_name)
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest_read = await cdm_corpus.fetch_object_async('default.manifest.cdm.json', cdm_corpus.storage.fetch_root_folder('local'))
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_read.entities[0].data_partitions[0].location)

        converted_to_model_json = await ManifestPersistence.to_data(manifest_read, None, None)
        location = converted_to_model_json.entities[0]['partitions'][0]['location']  # type: str
        location_path = os.path.join('TestData', 'Persistence', 'ModelJson', 'DataPartition', test_name_in_pascal_case, 'Input', 'EpisodeOfCare', 'partition-data.csv')
        # Model Json uses absolute adapter path.
        self.assertTrue(location.find(location_path) != -1)

        cdm_corpus2 = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest_after_convertion = await ManifestPersistence.from_object(cdm_corpus2.ctx, converted_to_model_json, cdm_corpus2.storage.fetch_root_folder('local'))
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_after_convertion.entities[0].data_partitions[0].location)

        # TODO: Need to change path in C#
        cdm_corpus3 = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        read_file = TestHelper.get_input_file_content(self.tests_subpath, test_name, 'model.json')
        namespace_folder = cdm_corpus3.storage.fetch_root_folder('local')
        location_path3 = 'C:\\\\cdm\\\\testData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv'
        model_json_as_string = read_file.replace('\uFEFF', '').replace(location_path3, location.replace('\\', '\\\\'))

        manifest_read_from_model_json = await ManifestPersistence.from_object(cdm_corpus3.ctx, Model().decode(model_json_as_string), namespace_folder)
        self.assertEqual('EpisodeOfCare/partition-data.csv', manifest_read_from_model_json.entities[0].data_partitions[0].location)

    @async_test
    async def test_loading_csv_partition_traits(self):
        """Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load."""
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loading_csv_partition_traits')
        manifest = await cdm_corpus.fetch_object_async('model.json')  # type: CdmManifestDefinition

        dataPartition = manifest.entities[0].data_partitions[0]

        # Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
        self.assertEqual(len(dataPartition.exhibits_traits), 1)

        csv_trait = dataPartition.exhibits_traits[0]

        self.assertEqual(csv_trait.arguments[0].value, 'true')
        self.assertEqual(csv_trait.arguments[1].value, 'CsvStyle.QuoteAlways')
        self.assertEqual(csv_trait.arguments[2].value, ',')
        self.assertEqual(csv_trait.arguments[3].value, 'QuoteStyle.Csv')
        self.assertEqual(csv_trait.arguments[4].value, 'UTF-8')
        self.assertEqual(csv_trait.arguments[5].value, '\n')

    @async_test
    async def test_loading_csv_partition_traits_from_file_format_settings(self):
        """Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load. Given that the trait is does not have arguments present on fileFormatSettings."""
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loading_csv_partition_traits_from_file_format_settings')
        manifest = await cdm_corpus.fetch_object_async('model.json')  # type: CdmManifestDefinition

        dataPartition = manifest.entities[0].data_partitions[0]

        # Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
        self.assertEqual(len(dataPartition.exhibits_traits), 1)

        csv_trait = dataPartition.exhibits_traits[0]

        self.assertEqual(csv_trait.arguments[0].value, '\n')
        self.assertEqual(csv_trait.arguments[1].value, 'false')
        self.assertEqual(csv_trait.arguments[2].value, 'CsvStyle.QuoteAfterDelimiter')
        self.assertEqual(csv_trait.arguments[3].value, ';')
        self.assertEqual(csv_trait.arguments[4].value, 'QuoteStyle.None')
        self.assertEqual(csv_trait.arguments[5].value, 'ASCII')

    @async_test
    async def test_loading_and_saving_csv_partition_traits(self):
        """Tests that the trait is.partition.format.CSV is saved when contains arguments not supported by fileFormatSettings."""
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loading_and_saving_csv_partition_traits')
        manifest = await cdm_corpus.fetch_object_async('model.json')  # type: CdmManifestDefinition

        # If the data partition trait is.partition.format.CSV being saved has arguments that are not supported by fileFormatSettings
        # the trait should also be persisted.
        manifestData = await ManifestPersistence.to_data(manifest, ResolveOptions(manifest.in_document), CopyOptions())
        localEntity = manifestData.entities[0]
        self.assertEqual(len(localEntity.partitions[0].traits), 1)

        # Remove the argument that is not supported by fileFormatSettings and check if the trait is removed after that.
        csv_trait = manifest.entities[0].data_partitions[0].exhibits_traits[0]
        csv_trait.arguments.remove(csv_trait.arguments.item('newline'))

        manifestData = await ManifestPersistence.to_data(manifest, ResolveOptions(manifest.in_document), CopyOptions())
        localEntity = manifestData.entities[0]
        self.assertIsNone(localEntity.partitions[0].traits)
