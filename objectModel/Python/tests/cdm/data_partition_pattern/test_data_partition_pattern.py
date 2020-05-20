# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime, timezone
import os
import unittest

from cdm.objectmodel import CdmManifestDefinition, CdmLocalEntityDeclarationDefinition

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
    async def test_pattern_with_non_existing_folder(self):
        corpus = TestHelper.get_local_corpus(self.test_subpath, "test_pattern_with_non_existing_folder")
        content = TestHelper.get_input_file_content(self.test_subpath, "test_pattern_with_non_existing_folder", "entities.manifest.cdm.json")
        manifest_content = ManifestContent()
        manifest_content.decode(content)

        cdmManifest = ManifestPersistence.from_object(CdmCorpusContext(corpus, None), "entities", "local", "/", manifest_content)
        await cdmManifest.file_status_check_async()
        self.assertEqual(len(cdmManifest.entities[0].data_partitions), 0)
        # make sure the last check time is still being set
        self.assertIsNotNone(cdmManifest.entities[0].data_partition_patterns[0].last_file_status_check_time)

    @async_test
    async def test_partition_pattern_with_glob(self):
        corpus = TestHelper.get_local_corpus(self.test_subpath, 'TestPartitionPatternWithGlob')

        patterns_with_glob_and_regex = 0

        def callback(level, message):
            nonlocal patterns_with_glob_and_regex
            if message.endswith('CdmDataPartitionPatternDefinition | The Data Partition Pattern contains both a glob pattern (/testfile.csv) and a regular expression (/subFolder/testSubFile.csv) set, the glob pattern will be used. | file_status_check_async'):
                patterns_with_glob_and_regex = patterns_with_glob_and_regex + 1
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        manifest = await corpus.fetch_object_async('pattern.manifest.cdm.json')  # type: CdmManifestDefinition
        await manifest.file_status_check_async()

        # one pattern object contains both glob and regex
        self.assertEqual(patterns_with_glob_and_regex, 1)

        # make sure '.' in glob is not converted to '.' in regex
        dot_is_escaped = manifest.entities[0]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(dot_is_escaped.data_partition_patterns[0].glob_pattern, 'test.ile.csv')
        self.assertEqual(len(dot_is_escaped.data_partitions), 0)

        # star pattern should not match anything
        only_star = manifest.entities[1]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(only_star.data_partition_patterns[0].glob_pattern, '*')
        self.assertEqual(len(only_star.data_partitions), 0)

        # star can match nothing
        star_no_match = manifest.entities[2]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(star_no_match.data_partition_patterns[0].glob_pattern, '/testfile*.csv')
        self.assertEqual(len(star_no_match.data_partitions), 1)
        self.assertEqual(star_no_match.data_partitions[0].location, '/partitions/testfile.csv')

        # star at root level
        # this should match any files at root level, none in subfolders
        star_at_root = manifest.entities[3]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(star_at_root.data_partition_patterns[0].glob_pattern, '/*.csv')
        self.assertEqual(len(star_at_root.data_partitions), 1)
        self.assertEqual(star_at_root.data_partitions[0].location, '/partitions/testfile.csv')

        # star at deeper level
        star_at_deeper_level = manifest.entities[4]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(star_at_deeper_level.data_partition_patterns[0].glob_pattern, '/*/*.csv')
        self.assertEqual(len(star_at_deeper_level.data_partitions), 1)
        self.assertEqual(star_at_deeper_level.data_partitions[0].location, '/partitions/subFolder/testSubFile.csv')

        # pattern that ends with star
        ends_with_star = manifest.entities[5]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(ends_with_star.data_partition_patterns[0].glob_pattern, '/testfile*')
        self.assertEqual(len(ends_with_star.data_partitions), 1)
        self.assertEqual(ends_with_star.data_partitions[0].location, '/partitions/testfile.csv')

        # globstar (**) on its own matches
        glob_star = manifest.entities[6]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(glob_star.data_partition_patterns[0].glob_pattern, '**')
        self.assertEqual(len(glob_star.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', glob_star.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', glob_star.data_partitions))), 1)

        # globstar at the beginning of the pattern
        begins_with_globstar = manifest.entities[7]  # type: CdmLocalEntity_declaration_definition
        self.assertEqual(begins_with_globstar.data_partition_patterns[0].glob_pattern, '/**.csv')
        self.assertEqual(len(begins_with_globstar.data_partitions), 1)
        self.assertEqual(begins_with_globstar.data_partitions[0].location, '/partitions/testfile.csv')

        # globstar at the end of the pattern
        ends_with_globstar = manifest.entities[8]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(ends_with_globstar.data_partition_patterns[0].glob_pattern, '/**')
        self.assertEqual(len(ends_with_globstar.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', ends_with_globstar.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', ends_with_globstar.data_partitions))), 1)

        # globstar matches zero or more folders
        zero_or_more_folders = manifest.entities[9]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(zero_or_more_folders.data_partition_patterns[0].glob_pattern, '/**/*.csv')
        self.assertEqual(len(zero_or_more_folders.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', zero_or_more_folders.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', zero_or_more_folders.data_partitions))), 1)

        # globstar matches zero or more folders without starting slash
        zero_or_more_no_starting_slash = manifest.entities[10]  # type: CdmLocalEntity_declaration_definition
        self.assertEqual(zero_or_more_no_starting_slash.data_partition_patterns[0].glob_pattern, '/**/*.csv')
        self.assertEqual(len(zero_or_more_no_starting_slash.data_partitions), 2)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/testfile.csv', zero_or_more_no_starting_slash.data_partitions))), 1)
        self.assertEqual(len(list(filter(lambda x: x.location == '/partitions/subFolder/testSubFile.csv', zero_or_more_no_starting_slash.data_partitions))), 1)

        # question mark in the middle of a pattern
        question_mark = manifest.entities[11]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(question_mark.data_partition_patterns[0].glob_pattern, '/test?ile.csv')
        self.assertEqual(len(question_mark.data_partitions), 1)
        self.assertEqual(question_mark.data_partitions[0].location, '/partitions/testfile.csv')

        # question mark at the beginning of a pattern
        begins_with_question_mark = manifest.entities[12]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(begins_with_question_mark.data_partition_patterns[0].glob_pattern, '/?estfile.csv')
        self.assertEqual(len(begins_with_question_mark.data_partitions), 1)
        self.assertEqual(begins_with_question_mark.data_partitions[0].location, '/partitions/testfile.csv')

        # question mark at the end of a pattern
        ends_with_question_mark = manifest.entities[13]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(ends_with_question_mark.data_partition_patterns[0].glob_pattern, '/testfile.cs?')
        self.assertEqual(len(ends_with_question_mark.data_partitions), 1)
        self.assertEqual(ends_with_question_mark.data_partitions[0].location, '/partitions/testfile.csv')

        # backslash in glob can match slash
        backslash_in_pattern = manifest.entities[14]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(backslash_in_pattern.data_partition_patterns[0].glob_pattern, '\\testfile.csv')
        self.assertEqual(len(backslash_in_pattern.data_partitions), 1)
        self.assertEqual(backslash_in_pattern.data_partitions[0].location, '/partitions/testfile.csv')

        # pattern object includes glob pattern and regular expression
        glob_and_regex = manifest.entities[15]  # type: CdmLocalEntityDeclarationDefinition
        self.assertEqual(glob_and_regex.data_partition_patterns[0].glob_pattern, '/testfile.csv')
        self.assertEqual(glob_and_regex.data_partition_patterns[0].regular_expression, '/subFolder/testSubFile.csv')
        self.assertEqual(len(glob_and_regex.data_partitions), 1)
        # matching this file means the glob pattern was (correctly) used
        self.assertEqual(glob_and_regex.data_partitions[0].location, '/partitions/testfile.csv')
