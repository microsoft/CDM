# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.utilities.logging import logger

from cdm.enums import CdmObjectType, CdmStatusLevel, CdmIncrementalPartitionType
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmManifestDefinition, CdmEntityDefinition
from cdm.persistence.cdmfolder import ManifestPersistence
from cdm.persistence.cdmfolder.types import ManifestContent
from cdm.utilities import Constants
from tests.cdm.cdm_collection.cdm_collection_helper_functions import create_document_for_entity

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
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_programmatically_create_partitions', no_input_and_output_folder=True)
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

    @async_test
    async def test_from_incremental_partition_without_trait(self):
        """
        Testing loading manifest with local entity declaration having an incremental partition without incremental trait.
        """
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_from_incremental_partition_without_trait')
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
        def callback(level, message):
            if 'Failed to persist object \'DeletePartition\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incremental_partitions\'. | from_data' in message:
                nonlocal error_message_verified
                error_message_verified = True
            else:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('local:/entities.manifest.cdm.json')
        self.assertEqual(1, len(manifest.entities))
        self.assertEqual(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, manifest.entities[0].object_type)
        entity = manifest.entities[0]
        self.assertEqual(1, len(entity.incremental_partitions))
        incremental_partition = entity.incremental_partitions[0]
        self.assertEqual('UpsertPartition', incremental_partition.name)
        self.assertEqual(1, len(incremental_partition.exhibits_traits))
        self.assertEqual(Constants._INCREMENTAL_TRAIT_NAME, incremental_partition.exhibits_traits[0].fetch_object_definition_name())
        self.assertTrue(error_message_verified)

    @async_test
    async def test_from_data_partition_with_incremental_trait(self):
        """
        Testing loading manifest with local entity declaration having a data partition with incremental trait.
        """
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_from_data_partition_with_incremental_trait')
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
        def callback(level, message):
            if 'Failed to persist object \'UpsertPartition\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'data_partitions\'. | from_data' in message:
                nonlocal error_message_verified
                error_message_verified = True
            else:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('local:/entities.manifest.cdm.json')
        self.assertEqual(1, len(manifest.entities))
        self.assertEqual(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, manifest.entities[0].object_type)
        entity = manifest.entities[0]
        self.assertEqual(1, len(entity.data_partitions))
        self.assertEqual('TestingPartition', entity.data_partitions[0].name)
        self.assertTrue(error_message_verified)

    @async_test
    async def test_to_incremental_partition_without_trait(self):
        """
        Testing saving manifest with local entity declaration having an incremental partition without incremental trait.
        """
        test_name = 'test_to_incremental_partition_without_trait'
        corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
        def callback(level, message):
            if 'Failed to persist object \'DeletePartition\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incremental_partitions\'. | to_data' in message:
                nonlocal error_message_verified
                error_message_verified = True
            else:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = CdmManifestDefinition(corpus.ctx, 'manifest')
        corpus.storage.fetch_root_folder('local').documents.append(manifest)
        entity = CdmEntityDefinition(corpus.ctx, 'entityName', None)
        create_document_for_entity(corpus, entity)
        localized_entity_declaration = manifest.entities.append(entity)

        upsert_incremental_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'UpsertPartition', False)
        upsert_incremental_partition.location = '/IncrementalData'
        upsert_incremental_partition.specialized_schema = 'csv'
        upsert_incremental_partition.exhibits_traits.append(Constants._INCREMENTAL_TRAIT_NAME, [['type', CdmIncrementalPartitionType.UPSERT.value]])

        delete_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'DeletePartition', False)
        delete_partition.location = '/IncrementalData'
        delete_partition.specialized_schema = 'csv'
        localized_entity_declaration.incremental_partitions.append(upsert_incremental_partition)
        localized_entity_declaration.incremental_partitions.append(delete_partition)

        with logger._enter_scope(DataPartitionTest.__name__, corpus.ctx, test_name):
            manifest_data = ManifestPersistence.to_data(manifest, None, None)

            self.assertEqual(1, len(manifest_data.entities))
            entity_data = manifest_data.entities[0]
            self.assertEqual(1, len(entity_data.incrementalPartitions))
            partition_data = entity_data.incrementalPartitions[0]
            self.assertEqual('UpsertPartition', partition_data.name)
            self.assertEqual(1, len(partition_data.exhibitsTraits))
            self.assertEqual(Constants._INCREMENTAL_TRAIT_NAME, partition_data.exhibitsTraits[0].traitReference)

        self.assertTrue(error_message_verified)

    @async_test
    async def test_to_data_partition_with_incremental_trait(self):
        """
        Testing saving manifest with local entity declaration having a data partition with incremental trait.
        """
        test_name = 'test_to_data_partition_with_incremental_trait'
        corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
        def callback(level, message):
            if 'Failed to persist object \'UpsertPartition\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'data_partitions\'. | to_data' in message:
                nonlocal error_message_verified
                error_message_verified = True
            else:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = CdmManifestDefinition(corpus.ctx, 'manifest')
        corpus.storage.fetch_root_folder('local').documents.append(manifest)
        entity = CdmEntityDefinition(corpus.ctx, 'entityName', None)
        create_document_for_entity(corpus, entity)
        localized_entity_declaration = manifest.entities.append(entity)

        upsert_incremental_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'UpsertPartition',
                                                          False)
        upsert_incremental_partition.location = '/IncrementalData'
        upsert_incremental_partition.specialized_schema = 'csv'
        upsert_incremental_partition.exhibits_traits.append(Constants._INCREMENTAL_TRAIT_NAME,
                                                            [['type', CdmIncrementalPartitionType.UPSERT.value]])

        delete_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'TestingPartition', False)
        delete_partition.location = '/testingData'
        delete_partition.specialized_schema = 'csv'
        localized_entity_declaration.data_partitions.append(upsert_incremental_partition)
        localized_entity_declaration.data_partitions.append(delete_partition)

        with logger._enter_scope(DataPartitionTest.__name__, corpus.ctx, test_name):
            manifest_data = ManifestPersistence.to_data(manifest, None, None)

            self.assertEqual(1, len(manifest_data.entities))
            entity_data = manifest_data.entities[0]
            self.assertEqual(1, len(entity_data.dataPartitions))
            partition_data = entity_data.dataPartitions[0]
            self.assertEqual('TestingPartition', partition_data.name)

        self.assertTrue(error_message_verified)


