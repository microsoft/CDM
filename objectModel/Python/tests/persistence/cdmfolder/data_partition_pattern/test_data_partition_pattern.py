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

    @async_test
    async def test_file_status_check_on_null_location(self):
        """
        Verifies that performing file status check on manifest with a partition with
        null location is gracefully handled.
        """
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_file_status_check_on_null_location')

        def callback(status_level: 'CdmStatusLevel', message: str):
            self.assertEqual(status_level, CdmStatusLevel.ERROR, 'Error level message should have been reported')
            self.assertTrue(
                (message == 'StorageManager | The object path cannot be null or empty. | create_absolute_corpus_path') or \
                (message == 'CdmCorpusDefinition | The object path cannot be null or empty. | _get_last_modified_time_from_partition_path_async'),
                "Unexpected error message received"
            )

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # Create manifest
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'TestModel')
        corpus.storage.fetch_root_folder('local').documents.append(manifest)

        # Create entity
        ent_doc = corpus.storage.fetch_root_folder('local').documents.append('MyEntityDoc.cdm.json')

        ent_def = corpus.make_object(CdmObjectType.ENTITY_DEF, 'MyEntity')
        ent_doc.definitions.append(ent_def)

        ent_decl = manifest.entities.append(ent_def)

        # Create partition
        part = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'MyPartition')
        ent_decl.data_partitions.append(part)

        # This should not throw exception
        await manifest.file_status_check_async()

    @async_test
    async def test_from_incremental_partition_pattern_without_trait(self):
        """
        Testing loading manifest with local entity declaration having an incremental partition pattern without incremental trait.
        """
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_from_incremental_partition_pattern_without_trait')
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
        def callback(level, message):
            if 'Failed to persist object \'DeletePattern\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incremental_partition_patterns\'. | from_data' in message:
                nonlocal error_message_verified
                error_message_verified = True
            else:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('local:/entities.manifest.cdm.json')
        self.assertEqual(1, len(manifest.entities))
        self.assertEqual(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, manifest.entities[0].object_type)
        entity = manifest.entities[0]
        self.assertEqual(1, len(entity.incremental_partition_patterns))
        incremental_partition = entity.incremental_partition_patterns[0]
        self.assertEqual('UpsertPattern', incremental_partition.name)
        self.assertEqual(1, len(incremental_partition.exhibits_traits))
        self.assertEqual(Constants._INCREMENTAL_TRAIT_NAME, incremental_partition.exhibits_traits[0].fetch_object_definition_name())
        self.assertTrue(error_message_verified)

    @async_test
    async def test_from_data_partition_pattern_with_incremental_trait(self):
        """
        Testing loading manifest with local entity declaration having a data partition pattern with incremental trait.
        """
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'test_from_data_partition_pattern_with_incremental_trait')
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
        def callback(level, message):
            if 'Failed to persist object \'UpsertPattern\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'data_partition_patterns\'. | from_data' in message:
                nonlocal error_message_verified
                error_message_verified = True
            else:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('local:/entities.manifest.cdm.json')
        self.assertEqual(1, len(manifest.entities))
        self.assertEqual(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, manifest.entities[0].object_type)
        entity = manifest.entities[0]
        self.assertEqual(1, len(entity.data_partition_patterns))
        self.assertEqual('TestingPattern', entity.data_partition_patterns[0].name)
        self.assertTrue(error_message_verified)

    @async_test
    async def test_to_incremental_partition_without_trait(self):
        """
        Testing saving manifest with local entity declaration having an incremental partition pattern without incremental trait.
        """
        test_name = 'test_to_incremental_partition_without_trait'
        corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with part
        def callback(level, message):
            if 'Failed to persist object \'DeletePartitionPattern\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incremental_partition_patterns\'. | to_data' in message:
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

        upsert_incremental_partition_pattern = corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, 'UpsertPattern', False)
        upsert_incremental_partition_pattern.root_location = '/IncrementalData'
        upsert_incremental_partition_pattern.regular_expression = '/(.*)/(.*)/(.*)/Upserts/upsert(\\d+)\\.csv$'
        upsert_incremental_partition_pattern.parameters = ['year', 'month', 'day', 'upsertPartitionNumber']
        upsert_incremental_partition_pattern.exhibits_traits.append(Constants._INCREMENTAL_TRAIT_NAME, [['type', CdmIncrementalPartitionType.UPSERT.value]])

        delete_partition_pattern = corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, 'DeletePartitionPattern', False)
        delete_partition_pattern.root_location = '/IncrementalData'
        delete_partition_pattern.regular_expression = '/(.*)/(.*)/(.*)/Delete/detele(\\d+)\\.csv$'
        delete_partition_pattern.parameters = ['year', 'month', 'day', 'deletePartitionNumber']
        localized_entity_declaration.incremental_partition_patterns.append(upsert_incremental_partition_pattern)
        localized_entity_declaration.incremental_partition_patterns.append(delete_partition_pattern)

        with logger._enter_scope(DataPartitionPatternTest.__name__, corpus.ctx, test_name):
            manifest_data = ManifestPersistence.to_data(manifest, None, None)

            self.assertEqual(1, len(manifest_data.entities))
            entity_data = manifest_data.entities[0]
            self.assertEqual(1, len(entity_data.incrementalPartitionPatterns))
            pattern_data = entity_data.incrementalPartitionPatterns[0]
            self.assertEqual('UpsertPattern', pattern_data.name)
            self.assertEqual(1, len(pattern_data.exhibitsTraits))
            self.assertEqual(Constants._INCREMENTAL_TRAIT_NAME, pattern_data.exhibitsTraits[0].traitReference)

        self.assertTrue(error_message_verified)

    @async_test
    async def test_to_data_partition_with_incremental_trait(self):
        """
        Testing saving manifest with local entity declaration having a data partition pattern with incremental trait.
        """
        test_name = 'test_to_data_partition_with_incremental_trait'
        corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        error_message_verified = False
        # not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
        def callback(level, message):
            if 'Failed to persist object \'UpsertPartitionPattern\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'data_partition_patterns\'. | to_data' in message:
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

        upsert_incremental_partition_pattern = corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, 'UpsertPartitionPattern',
                                                          False)
        upsert_incremental_partition_pattern.root_location = '/IncrementalData'
        upsert_incremental_partition_pattern.exhibits_traits.append(Constants._INCREMENTAL_TRAIT_NAME,
                                                                    [['type', CdmIncrementalPartitionType.UPSERT.value]])

        delete_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, 'TestingPartitionPattern', False)
        delete_partition.root_location = '/testingData'
        localized_entity_declaration.data_partition_patterns.append(upsert_incremental_partition_pattern)
        localized_entity_declaration.data_partition_patterns.append(delete_partition)

        with logger._enter_scope(DataPartitionPatternTest.__name__, corpus.ctx, test_name):
            manifest_data = ManifestPersistence.to_data(manifest, None, None)

            self.assertEqual(1, len(manifest_data.entities))
            entity_data = manifest_data.entities[0]
            self.assertEqual(1, len(entity_data.dataPartitionPatterns))
            pattern_data = entity_data.dataPartitionPatterns[0]
            self.assertEqual('TestingPartitionPattern', pattern_data.name)

        self.assertTrue(error_message_verified)



