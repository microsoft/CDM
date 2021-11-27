﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional
import os
import json
import asyncio
import filecmp

from cdm.enums import CdmStatusLevel, CdmLogCode
from cdm.objectmodel import CdmCorpusDefinition
from cdm.storage import LocalAdapter, RemoteAdapter
from cdm.utilities.string_utils import StringUtils


def async_test(f):
    def wrapper(*args, **kwargs):
        coro = asyncio.coroutine(f)
        future = coro(*args, **kwargs)
        loop = asyncio.get_event_loop()
        loop.run_until_complete(future)

    return wrapper


INPUT_FOLDER_NAME = 'Input'
EXPECTED_OUTPUT_FOLDER_NAME = 'ExpectedOutput'
ACTUAL_OUTPUT_FOLDER_NAME = 'ActualOutput-Python'


class TestHelper:
    # The adapter path to the top-level manifest in the CDM Schema Documents folder. Used by tests where we resolve the corpus.
    # This path is temporarily pointing to the applicationCommon manifest instead of standards due to performance issues when resolving
    # the entire set of CDM standard schemas, after 8000+ F&O entities were added.
    cdm_standards_schema_path = 'local:/core/applicationCommon/applicationCommon.manifest.cdm.json'

    schema_documents_path = '../../schemaDocuments'

    # The path of the sample schema documents folder.
    sample_schema_folder_path = '../../samples/example-public-standards'

    # The log codes that are allowed to be logged without failing the test
    ignored_log_codes = set([
        CdmLogCode.WARN_DEPRECATED_RESOLUTION_GUIDANCE.name
    ])

    @staticmethod
    def compare_folder_files_equality(expected_folder_path: str, actual_folder_path: str,
                                      different_config: Optional[bool] = False) -> str:
        expected_names = os.listdir(expected_folder_path)
        actual_names = os.listdir(actual_folder_path)

        if not different_config:
            if len(expected_names) != len(actual_names):
                return 'Lists length do not match. '

        error_log = ''
        for expected_name in expected_names:
            expected_path = os.path.join(expected_folder_path, expected_name)
            is_special_config = expected_name == 'config-Python.json'
            if expected_name.endswith('-CSharp.json') or expected_name.endswith('-Java.json') or expected_name.endswith(
                    '-TypeScript.json'):
                continue

            actual_path = os.path.join(actual_folder_path,
                                       'config.json' if is_special_config and different_config else expected_name)

            if os.path.isfile(expected_path):
                if expected_path.endswith('json'):
                    with open(expected_path, 'r') as expected_file:
                        with open(actual_path, 'r') as actual_file:
                            file_error_log = TestHelper.compare_same_object(json.loads(expected_file.read()),
                                                                            json.loads(actual_file.read()))
                            if file_error_log != '':
                                error_log += 'The file object {} is not the same as expected, details: '.format(
                                    actual_path)
                                error_log += file_error_log
                elif not filecmp.cmp(expected_path, actual_path):
                    error_log += 'The file {} is not the same as expected.'.format(actual_path)
            elif os.path.isdir(expected_path):
                error_log += TestHelper.compare_folder_files_equality(expected_path, actual_path)
            else:
                return 'The path {} is not file or directory.'.format(expected_path)

            if error_log != '':
                return error_log

        return error_log

    @staticmethod
    def delete_files_from_actual_output(actual_output_folder_path: str):
        name_list = os.listdir(actual_output_folder_path)
        for item_name in name_list:
            item_path = os.path.join(actual_output_folder_path, item_name)

            if os.path.isfile(item_path):
                os.remove(item_path)
            elif os.path.isdir(item_path):
                TestHelper.delete_files_from_actual_output(item_path)
                os.rmdir(item_path)
            else:
                return 'The path {} is not file or directory.'.format(item_path)

    @staticmethod
    def get_schema_docs_root():
        return TestHelper.schema_documents_path

    @staticmethod
    def get_input_folder_path(test_subpath: str, test_name: str, is_language_specific: Optional[bool] = False):
        return TestHelper.get_test_folder_path(test_subpath, test_name, INPUT_FOLDER_NAME, is_language_specific)

    @staticmethod
    def get_expected_output_folder_path(test_subpath: str, test_name: str):
        return TestHelper.get_test_folder_path(test_subpath, test_name, EXPECTED_OUTPUT_FOLDER_NAME)

    @staticmethod
    def get_data(test_subpath: str, test_name: str, folder_name: str, file_name: str,
                 is_language_specific: Optional[bool] = False):
        return json.loads(
            TestHelper.get_file_content(test_subpath, test_name, folder_name, file_name, is_language_specific))

    @staticmethod
    def get_expected_output_data(test_subpath: str, test_name: str, file_name: str,
                                 is_language_specific: Optional[bool] = False):
        return TestHelper.get_data(test_subpath, test_name, EXPECTED_OUTPUT_FOLDER_NAME, file_name,
                                   is_language_specific)

    @staticmethod
    def get_input_data(test_subpath: str, test_name: str, file_name: str):
        return TestHelper.get_data(test_subpath, test_name, INPUT_FOLDER_NAME, file_name)

    @staticmethod
    def get_input_file_content(test_subpath: str, test_name: str, file_name: str):
        return TestHelper.get_file_content(test_subpath, test_name, INPUT_FOLDER_NAME, file_name)

    @staticmethod
    def get_output_file_content(test_subpath: str, test_name: str, file_name: str,
                                is_language_specific: Optional[bool] = False):
        return TestHelper.get_file_content(test_subpath, test_name, EXPECTED_OUTPUT_FOLDER_NAME, file_name, is_language_specific)

    @staticmethod
    def get_file_content(test_subpath: str, test_name: str, folder_name: str, file_name: str,
                         is_language_specific: Optional[bool] = False):
        folder_path = TestHelper.get_test_folder_path(test_subpath, test_name, folder_name)
        file_path = os.path.join(folder_path, 'Python', file_name) if is_language_specific else os.path.join(
            folder_path, file_name)
        with open(file_path, 'r', encoding='utf-8-sig') as input_file:
            return input_file.read()

    @staticmethod
    def write_actual_output_file_content(test_subpath: str, test_name: str, file_name: str, file_content: str):
        folder_path = TestHelper.get_actual_output_folder_path(test_subpath, test_name)
        file_path = os.path.join(folder_path, file_name)
        with open(file_path, 'w') as result_file:
            result_file.write(file_content)

    @staticmethod
    def is_file_content_equality(expected: str, actual: str) -> bool:
        expected = expected.replace('\r\n', '\n')
        actual = actual.replace('\r\n', '\n')
        return expected == actual

    @staticmethod
    def get_actual_output_folder_path(test_subpath: str, test_name: str):
        return TestHelper.get_test_folder_path(test_subpath, test_name, ACTUAL_OUTPUT_FOLDER_NAME)

    @staticmethod
    def get_actual_output_data(test_subpath: str, test_name: str, file_name: str,
                                 is_language_specific: Optional[bool] = False):
        return TestHelper.get_data(test_subpath, test_name, ACTUAL_OUTPUT_FOLDER_NAME, file_name,
                                   is_language_specific)

    @staticmethod
    def get_local_corpus(test_subpath: str, test_name: str, test_input_dir: Optional[str] = None,
                         is_language_specific: Optional[bool] = False, expected_codes: Optional[set] = None,
                         no_input_and_output_folder: Optional[bool] = False):
        """
            Creates a corpus to be used by the tests, which mounts inputFolder, outputFolder, cdm, and remoteAdapter. Will fail on any unexpected warning/error.
            @param testSubpath               The root of the corpus files.
            @param testName                  The test name.
            @param testInputDir              The test input directory.
            @param isLanguageSpecific        Indicate whether there is subfolder called Java, it's used when input is different compared with other languages
            @param expectedCodes             The error codes that are expected, and they should not block the test.
            @param noInputAndOutputFolder    No input and output folder needed.
        """
        if no_input_and_output_folder:
            test_input_dir = 'C:\\dummpyPath'
        test_input_dir = test_input_dir or TestHelper.get_input_folder_path(test_subpath, test_name,
                                                                            is_language_specific)
        test_output_dir = test_input_dir if no_input_and_output_folder else TestHelper.get_actual_output_folder_path(test_subpath, test_name)

        cdm_corpus = CdmCorpusDefinition()

        def callback(level: CdmStatusLevel, message: str):
            TestHelper._fail_on_unexpected_failure(cdm_corpus, message, expected_codes)
        cdm_corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        cdm_corpus.storage.default_namespace = 'local'
        cdm_corpus.storage.mount('local', LocalAdapter(root=test_input_dir))
        cdm_corpus.storage.mount('output', LocalAdapter(root=test_output_dir))
        cdm_corpus.storage.mount('cdm', LocalAdapter(TestHelper.schema_documents_path))
        cdm_corpus.storage.mount('remote', RemoteAdapter(hosts={'contoso': 'http://contoso.com'}))

        return cdm_corpus

    @staticmethod
    def _fail_on_unexpected_failure(corpus: 'CdmCorpusDefinition', message: str, expected_codes: Optional[set] = None):
        """Fail on an unexpected message."""
        if len(corpus.ctx.events) > 0:
            last_event = corpus.ctx.events[-1]
            if not last_event.get('code') or last_event['code'] not in TestHelper.ignored_log_codes:
                if expected_codes is not None and CdmLogCode[last_event['code']] in expected_codes:
                    return
                code = last_event['code'] if last_event.get('code') is not None else 'no code associated'
                raise Exception('Encountered unexpected log event: {} - {}!'.format(code, message))

    @staticmethod
    def get_test_folder_path(test_subpath: str, test_name: str, folder_name: str,
                             is_language_specific: Optional[bool] = False):
        test_name = StringUtils.snake_case_to_pascal_case(test_name)
        test_folder_path = os.path.join('..', 'TestData', test_subpath, test_name, folder_name, 'Python') \
            if is_language_specific else os.path.join('..', 'TestData', test_subpath, test_name,
                                                      folder_name)

        if folder_name == ACTUAL_OUTPUT_FOLDER_NAME and not os.path.isdir(test_folder_path):
            os.makedirs(test_folder_path, exist_ok=True)

        return test_folder_path

    @staticmethod
    def get_test_actual_output_folder_name():
        return ACTUAL_OUTPUT_FOLDER_NAME

    @staticmethod
    def del_dict_none_values(dict_obj):
        if not isinstance(dict_obj, dict):
            return dict_obj
        for key, value in list(dict_obj.items()):
            if not value:
                del dict_obj[key]
            elif isinstance(value, list):
                dict_obj[key] = list(TestHelper.del_dict_none_values(i) for i in dict_obj[key])
            elif isinstance(value, dict):
                TestHelper.del_dict_none_values(value)
        return dict_obj

    @staticmethod
    def compare_same_object(expected_data, actual_data) -> str:
        expected_data = TestHelper.del_dict_none_values(expected_data)
        actual_data = TestHelper.del_dict_none_values(actual_data)
        return TestHelper.compare_same_object_without_none_values(expected_data, actual_data)

    @staticmethod
    def compare_same_object_without_none_values(expected_data, actual_data) -> str:
        if expected_data is None and actual_data is None:
            return ''

        if expected_data is None or actual_data is None:
            return 'Objects do not match. Expected = {}, actual = {}.'.format(expected_data, actual_data)

        if isinstance(expected_data, list) and isinstance(actual_data, list):
            expected_list = expected_data.copy()
            actual_list = actual_data.copy()

            while expected_list and actual_list:
                index_in_expected = len(expected_list) - 1
                found = False
                for index_in_actual, actual_item in reversed(list(enumerate(actual_list))):
                    if TestHelper.compare_same_object_without_none_values(expected_list[index_in_expected],
                                                                          actual_item) == '':
                        expected_list.pop(index_in_expected)
                        actual_list.pop(index_in_actual)
                        found = True
                        break

                if not found:
                    return 'Lists do not match. Found list member in expected but not in actual : {}.'.format(
                        expected_list[index_in_expected])

            if expected_list:
                return 'Lists do not match. Found list member in expected but not in actual : {}.'.format(
                    expected_list[0])

            if actual_list:
                return 'Lists do not match. Found list member in actual but not in expected : {}.'.format(
                    actual_list[0])

            return ''

        elif isinstance(expected_data, dict) and isinstance(actual_data, dict):
            expected_dict = expected_data.copy()
            actual_dict = actual_data.copy()

            for key in expected_dict.keys():
                if key not in actual_dict.keys():
                    return 'Dictionaries do not match. Found key in expected but not in actual: {}.'.format(key)

                found_property = TestHelper.compare_same_object_without_none_values(expected_dict[key],
                                                                                    actual_dict[key])

                if found_property != '':
                    return 'Value does not match for property {}.'.format(key)

            for key in actual_dict.keys():
                if key not in expected_dict.keys():
                    return 'Value does not match for property {}.'.format(key)

            return ''

        elif expected_data != actual_data:
            return 'Objects do not match. Expected = {}, actual = {}.'.format(expected_data, actual_data)

        return ''

    @staticmethod
    def assert_cdm_log_code_unexpected_code(corpus: 'CdmCorpusDefinition', unexpected_code: 'CdmLogCode', self) -> None:
        to_assert = False
        for log_entry in corpus.ctx.events:
            if ((unexpected_code.name.startswith('WARN') and log_entry['level'] == CdmStatusLevel.WARNING.name)
                or (unexpected_code.name.startswith('ERR') and log_entry['level'] == CdmStatusLevel.ERROR.name)) \
                    and log_entry['code'] == unexpected_code.name:
                to_assert = True

        self.assertTrue(not to_assert, 'The recorded log events should have not contained message with log code ' +
                        unexpected_code.name + ' of appropriate level as this message should be filtered out.')

    @staticmethod
    def assert_cdm_log_code_equality(corpus: 'CdmCorpusDefinition', expected_code: 'CdmLogCode', is_present: bool,
                                     self) -> None:
        to_assert = False
        for log_entry in corpus.ctx.events:
            if ((expected_code.name.startswith('WARN') and log_entry['level'] == CdmStatusLevel.WARNING.name)
                or (expected_code.name.startswith('ERR') and log_entry['level'] == CdmStatusLevel.ERROR.name)) \
                    and log_entry['code'] == expected_code.name:
                to_assert = True

        if is_present == True:
            self.assertTrue(to_assert, 'The recorded log events should have contained message with log code ' +
                            expected_code.name + ' of appropriate level')
        else:
            self.assertTrue(not to_assert, 'The recorded log events should have not contained message with log code ' +
                            expected_code.name + ' of appropriate level as this message should be filtered out.')
