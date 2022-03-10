# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
from typing import cast

from cdm.storage.local import LocalAdapter
from datetime import datetime, timezone
import os
import unittest

from cdm.objectmodel import CdmManifestDefinition, CdmLocalEntityDeclarationDefinition, CdmTraitDefinition, CdmParameterDefinition, CdmTraitReference

from tests.common import async_test, TestHelper
from cdm.persistence.cdmfolder import ManifestPersistence
from cdm.persistence.cdmfolder.types import ManifestContent
from cdm.objectmodel.cdm_corpus_context import CdmCorpusContext
from cdm.enums import CdmStatusLevel


class _data_partition_patternTest(unittest.TestCase):
    test_subpath = os.path.join('Cdm', 'DataPartitionPattern')

    @async_test
    async def test_refreshes_data_partition_patterns(self):
        """Tests refreshing files that match the regular expression"""
        test_name = 'test_refresh_data_partition_patterns'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        cdm_manifest = await cdm_corpus.fetch_object_async('local:/patternManifest.manifest.cdm.json')
        partition_entity = cdm_manifest.entities[1]
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
                self.assertGreaterEqual(partition.last_file_status_check_time, time_before_load)
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

    @async_test
    async def test_refreshes_data_partition_patterns_with_trait(self):
        """Tests data partition objects created by a partition pattern do not share the same trait with the partition pattern"""
        test_name = 'test_refreshes_data_partition_patterns_with_trait'
        corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        manifest = await corpus.fetch_object_async('local:/patternManifest.manifest.cdm.json')

        partition_entity = manifest.entities[0]
        self.assertEqual(1, len(partition_entity.data_partition_patterns))
        self.assertEqual(0, len(partition_entity.data_partitions))

        trait_def = CdmTraitDefinition(corpus.ctx, 'testTrait')
        trait_def.parameters.append(CdmParameterDefinition(corpus.ctx, 'argument value'))
        pattern_trait_ref = partition_entity.data_partition_patterns[0].exhibits_traits.append('testTrait')
        pattern_trait_ref.arguments.append('int', 1)
        pattern_trait_ref.arguments.append('bool', True)
        pattern_trait_ref.arguments.append('string', 'a')

        await manifest.file_status_check_async()

        self.assertEqual(2, len(partition_entity.data_partitions))
        pattern_trait_ref = partition_entity.data_partition_patterns[0].exhibits_traits.item('testTrait')
        self.assertEqual(1, pattern_trait_ref.arguments[0].value)
        self.assertTrue(pattern_trait_ref.arguments[1].value)
        pattern_trait_ref.arguments[0].value = 3
        pattern_trait_ref.arguments[1].value = False

        partition_trait_ref = partition_entity.data_partitions[0].exhibits_traits.item('testTrait')
        self.assertNotEqual(partition_trait_ref, pattern_trait_ref)
        self.assertEqual(1, partition_trait_ref.arguments[0].value)
        self.assertTrue(partition_trait_ref.arguments[1].value)
        partition_trait_ref.arguments[0].value = 2

        self.assertEqual(1, partition_entity.data_partitions[1].exhibits_traits.item('testTrait').arguments[0].value)

    @async_test
    async def test_pattern_with_non_existing_folder(self):
        corpus = TestHelper.get_local_corpus(self.test_subpath, "test_pattern_with_non_existing_folder")
        content = TestHelper.get_input_file_content(self.test_subpath, "test_pattern_with_non_existing_folder", "entities.manifest.cdm.json")
        manifest_content = ManifestContent()
        manifest_content.decode(content)
        cdmManifest = ManifestPersistence.from_object(CdmCorpusContext(corpus, None), "entities", "local", "/", manifest_content)

        error_logged = 0
        def callback(level: CdmStatusLevel, message: str):
            if 'Failed to fetch all files in the folder location \'local:/testLocation\' described by a partition pattern. Exception:' in message:
                nonlocal error_logged
                error_logged += 1
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        await cdmManifest.file_status_check_async()
        self.assertEqual(1, error_logged)
        self.assertEqual(len(cdmManifest.entities[0].data_partitions), 0)
        # make sure the last check time is still being set
        self.assertIsNotNone(cdmManifest.entities[0].data_partition_patterns[0].last_file_status_check_time)

    @async_test
    async def test_pattern_with_different_namespace(self):
        test_name = 'test_pattern_with_different_namespace'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        local_adapter = cdm_corpus.storage.fetch_adapter('local')
        local_path = local_adapter._full_root
        cdm_corpus.storage.mount('other', LocalAdapter(os.path.join(local_path, 'other')))
        cdm_manifest = await cdm_corpus.fetch_object_async('local:/patternManifest.manifest.cdm.json')

        await cdm_manifest.file_status_check_async()
        
        self.assertEqual(1, len(cdm_manifest.entities[0].data_partitions))

    @async_test
    async def test_variations_in_root_location(self):
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'TestVariationsInRootLocation')
        manifest = await corpus.fetch_object_async('pattern.manifest.cdm.json')  # type: CdmManifestDefinition
        await manifest.file_status_check_async()

        starts_with_slash = manifest.entities[0]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(starts_with_slash.data_partition_patterns[0].regular_expression, '.*testfile.csv')
        self.assertEqual(len(starts_with_slash.data_partitions), 1)
        self.assertEqual(starts_with_slash.data_partitions[0].location, '/partitions/testfile.csv')

        ends_with_slash = manifest.entities[1]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(ends_with_slash.data_partition_patterns[0].regular_expression, '.*testfile.csv')
        self.assertEqual(len(ends_with_slash.data_partitions), 1)
        self.assertEqual(ends_with_slash.data_partitions[0].location, 'partitions/testfile.csv')

        no_slash = manifest.entities[2]  # types: CdmLocalEntityDeclarationDefinition
        self.assertEqual(no_slash.data_partition_patterns[0].regular_expression, '.*testfile.csv')
        self.assertEqual(len(no_slash.data_partitions), 1)
        self.assertEqual(no_slash.data_partitions[0].location, 'partitions/testfile.csv')

    @async_test
    async def test_partition_pattern_with_glob(self):
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'TestPartitionPatternWithGlob')

        patterns_with_glob_and_regex = 0

        def callback(level, message):
            nonlocal patterns_with_glob_and_regex
            if message.find('CdmDataPartitionPatternDefinition | The Data Partition Pattern contains both a glob pattern (/testfile.csv) and a regular expression (/subFolder/testSubFile.csv) set, the glob pattern will be used. | file_status_check_async') != -1:
                patterns_with_glob_and_regex = patterns_with_glob_and_regex + 1
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('pattern.manifest.cdm.json')  # type: CdmManifestDefinition
        await manifest.file_status_check_async()

        # one pattern object contains both glob and regex
        self.assertEqual(patterns_with_glob_and_regex, 1)

        index = 0
        # make sure '.' in glob is not converted to '.' in regex
        dot_is_escaped = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(dot_is_escaped.data_partition_patterns[0].glob_pattern, 'test.ile.csv')
        self.assertEqual(len(dot_is_escaped.data_partitions), 0)
        index += 1

        # star pattern should match anything in the root folder
        only_star = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(only_star.data_partition_patterns[0].glob_pattern, '*')
        self.assertEqual(len(only_star.data_partitions), 1)
        self.assertEqual(only_star.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # star can match nothing
        star_no_match = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(star_no_match.data_partition_patterns[0].glob_pattern, '/testfile*.csv')
        self.assertEqual(len(star_no_match.data_partitions), 1)
        self.assertEqual(star_no_match.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # star at root level
        # this should match any files at root level, none in subfolders
        star_at_root = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(star_at_root.data_partition_patterns[0].glob_pattern, '/*.csv')
        self.assertEqual(len(star_at_root.data_partitions), 1)
        self.assertEqual(star_at_root.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # star at deeper level
        star_at_deeper_level = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(star_at_deeper_level.data_partition_patterns[0].glob_pattern, '/*/*.csv')
        self.assertEqual(len(star_at_deeper_level.data_partitions), 1)
        self.assertEqual(star_at_deeper_level.data_partitions[0].location, '/partitions/subFolder/testSubFile.csv')
        index += 1

        # pattern that ends with star
        ends_with_star = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(ends_with_star.data_partition_patterns[0].glob_pattern, '/testfile*')
        self.assertEqual(len(ends_with_star.data_partitions), 1)
        self.assertEqual(ends_with_star.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # globstar (**) on its own matches
        glob_star = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(glob_star.data_partition_patterns[0].glob_pattern, '**')
        self.assertEqual(len(glob_star.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', glob_star.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', glob_star.data_partitions))), 1)
        index += 1

        # globstar at the beginning of the pattern
        begins_with_globstar = manifest.entities[index]  # type: CdmLocalEntity_declaration_definition
        self.assertEqual(begins_with_globstar.data_partition_patterns[0].glob_pattern, '/**.csv')
        self.assertEqual(len(begins_with_globstar.data_partitions), 1)
        self.assertEqual(begins_with_globstar.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # globstar at the end of the pattern
        ends_with_globstar = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(ends_with_globstar.data_partition_patterns[0].glob_pattern, '/**')
        self.assertEqual(len(ends_with_globstar.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', ends_with_globstar.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', ends_with_globstar.data_partitions))), 1)
        index += 1

        # globstar matches zero or more folders
        zero_or_more_folders = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(zero_or_more_folders.data_partition_patterns[0].glob_pattern, '/**/*.csv')
        self.assertEqual(len(zero_or_more_folders.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', zero_or_more_folders.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', zero_or_more_folders.data_partitions))), 1)
        index += 1

        # globstar matches zero or more folders without starting slash
        zero_or_more_no_starting_slash = manifest.entities[index]  # type: CdmLocalEntity_declaration_definition
        self.assertEqual(zero_or_more_no_starting_slash.data_partition_patterns[0].glob_pattern, '/**/*.csv')
        self.assertEqual(len(zero_or_more_no_starting_slash.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', zero_or_more_no_starting_slash.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', zero_or_more_no_starting_slash.data_partitions))), 1)
        index += 1

        # question mark in the middle of a pattern
        question_mark = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(question_mark.data_partition_patterns[0].glob_pattern, '/test?ile.csv')
        self.assertEqual(len(question_mark.data_partitions), 1)
        self.assertEqual(question_mark.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # question mark at the beginning of a pattern
        begins_with_question_mark = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(begins_with_question_mark.data_partition_patterns[0].glob_pattern, '/?estfile.csv')
        self.assertEqual(len(begins_with_question_mark.data_partitions), 1)
        self.assertEqual(begins_with_question_mark.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # question mark at the end of a pattern
        ends_with_question_mark = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(ends_with_question_mark.data_partition_patterns[0].glob_pattern, '/testfile.cs?')
        self.assertEqual(len(ends_with_question_mark.data_partitions), 1)
        self.assertEqual(ends_with_question_mark.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # backslash in glob can match slash
        backslash_in_pattern = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(backslash_in_pattern.data_partition_patterns[0].glob_pattern, '\\testfile.csv')
        self.assertEqual(len(backslash_in_pattern.data_partitions), 1)
        self.assertEqual(backslash_in_pattern.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        # pattern object includes glob pattern and regular expression
        glob_and_regex = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(glob_and_regex.data_partition_patterns[0].glob_pattern, '/testfile.csv')
        self.assertEqual(glob_and_regex.data_partition_patterns[0].regular_expression, '/subFolder/testSubFile.csv')
        self.assertEqual(len(glob_and_regex.data_partitions), 1)
        # matching this file means the glob pattern was (correctly) used
        self.assertEqual(glob_and_regex.data_partitions[0].location, '/partitions/testfile.csv')

    @async_test
    async def test_glob_path_variation(self):
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'TestGlobPathVariation')

        manifest = await corpus.fetch_object_async('pattern.manifest.cdm.json')  # type: CdmManifestDefinition
        await manifest.file_status_check_async()

        index = 0
        no_slash = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(no_slash.data_partition_patterns[0].root_location, '/partitions')
        self.assertEqual(no_slash.data_partition_patterns[0].glob_pattern, '*.csv')
        self.assertEqual(len(no_slash.data_partitions), 1)
        self.assertEqual(no_slash.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        root_location_slash = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(root_location_slash.data_partition_patterns[0].root_location, '/partitions/')
        self.assertEqual(root_location_slash.data_partition_patterns[0].glob_pattern, '*.csv')
        self.assertEqual(len(root_location_slash.data_partitions), 1)
        self.assertEqual(root_location_slash.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        glob_pattern_slash = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(glob_pattern_slash.data_partition_patterns[0].root_location, '/partitions')
        self.assertEqual(glob_pattern_slash.data_partition_patterns[0].glob_pattern, '/*.csv')
        self.assertEqual(len(glob_pattern_slash.data_partitions), 1)
        self.assertEqual(glob_pattern_slash.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        both_slash = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(both_slash.data_partition_patterns[0].root_location, '/partitions/')
        self.assertEqual(both_slash.data_partition_patterns[0].glob_pattern, '/*.csv')
        self.assertEqual(len(both_slash.data_partitions), 1)
        self.assertEqual(both_slash.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        no_slash_or_star_at_start = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(no_slash_or_star_at_start.data_partition_patterns[0].root_location, '/partitions/')
        self.assertEqual(no_slash_or_star_at_start.data_partition_patterns[0].glob_pattern, 't*.csv')
        self.assertEqual(len(no_slash_or_star_at_start.data_partitions), 1)
        self.assertEqual(no_slash_or_star_at_start.data_partitions[0].location, '/partitions/testfile.csv')
        index += 1

        no_slash_or_star_and_root_location = manifest.entities[index]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(no_slash_or_star_and_root_location.data_partition_patterns[0].root_location, '/partitions')
        self.assertEqual(no_slash_or_star_and_root_location.data_partition_patterns[0].glob_pattern, 't*.csv')
        self.assertEqual(len(no_slash_or_star_and_root_location.data_partitions), 1)
        self.assertEqual(no_slash_or_star_and_root_location.data_partitions[0].location, '/partitions/testfile.csv')
