# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import urllib

from tests.common import TestHelper
from tests.adls_test_helper import AdlsTestHelper

class AdlsModelJsonTestHelper:
    actual_folder_name = 'Actual'
    expected_folder_name = 'Expected'
    input_folder_name = 'Input'

    hostname_placeholder = '<HOSTNAME>'
    root_path_placeholder = '/<ROOTPATH>'

    @staticmethod
    def get_actual_sub_folder_path(test_sub_path: str, test_name: str, sub_folder_name: str):
        return os.path.join(TestHelper.get_actual_output_folder_path(test_sub_path, test_name), sub_folder_name)

    @staticmethod
    def get_expected_file_content(test_sub_path: str, test_name: str, file_name: str):
        actual_output_path = TestHelper.get_actual_output_folder_path(test_sub_path, test_name)
        file_path = os.path.join(actual_output_path, AdlsModelJsonTestHelper.expected_folder_name, file_name)
        with open(file_path, 'r') as input_file:
            return input_file.read()

    @staticmethod
    def save_model_json_to_actual_output(test_sub_path: str, test_name: str, file_name: str, content: str):
        actual_folder_path = AdlsModelJsonTestHelper.get_actual_sub_folder_path(test_sub_path, test_name, AdlsModelJsonTestHelper.actual_folder_name)
        if not os.path.exists(actual_folder_path):
            os.mkdir(actual_folder_path)
        file_path = os.path.join(actual_folder_path, file_name)
        with open(file_path, 'w') as result_file:
            result_file.write(content)

    @staticmethod
    def update_input_and_expected_and_save_to_actual_sub_folder(test_sub_path: str, test_name: str, root_relative_path:str, file_name: str, string_to_add_suffix: str, suffix: str):
        # Prepare the root path.
        root_path = os.environ.get('ADLS_ROOTPATH')
        root_path = AdlsTestHelper.get_full_root_path(root_path, root_relative_path)

        if not root_path.startswith('/'):
            root_path = '/' + root_path
        if root_path.endswith('/'):
            root_path = root_path[0:len(root_path) - 1]
        
        root_path = urllib.parse.quote(root_path).replace('%2F', '/')

        # Update input content and save to ActualOutput/Input
        input_content = TestHelper.get_input_file_content(test_sub_path, test_name, file_name)
        input_content = AdlsModelJsonTestHelper._replace_placeholder(input_content, test_sub_path, test_name, file_name, root_path, string_to_add_suffix, suffix)
        input_folder_path = AdlsModelJsonTestHelper.get_actual_sub_folder_path(test_sub_path, test_name, AdlsModelJsonTestHelper.input_folder_name)
        if not os.path.exists(input_folder_path):
            os.mkdir(input_folder_path)
        with open(os.path.join(input_folder_path, file_name), 'w') as actual_input_file:
            actual_input_file.write(input_content)
        
        # Update expected content and save to ActualOutput/Input
        expected_content = TestHelper.get_output_file_content(test_sub_path, test_name, file_name)
        expected_content = AdlsModelJsonTestHelper._replace_placeholder(expected_content, test_sub_path, test_name, file_name, root_path, string_to_add_suffix, suffix)
        expected_folder_path = AdlsModelJsonTestHelper.get_actual_sub_folder_path(test_sub_path, test_name, AdlsModelJsonTestHelper.expected_folder_name)
        if not os.path.exists(expected_folder_path):
            os.mkdir(expected_folder_path)
        with open(os.path.join(expected_folder_path, file_name), 'w') as actual_expected_file:
            actual_expected_file.write(expected_content)


    @staticmethod
    def _replace_placeholder(content: str, test_sub_path: str, test_name: str, file_name: str, root: str, string_to_add_suffix: str, suffix_to_add: str):
        content = content.replace(AdlsModelJsonTestHelper.hostname_placeholder, os.environ.get('ADLS_HOSTNAME'))
        content = content.replace(AdlsModelJsonTestHelper.root_path_placeholder, root)
        content = content.replace(string_to_add_suffix, string_to_add_suffix + '-' + suffix_to_add)
        return content
