# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Optional
import os
import json
import asyncio

from cdm.objectmodel import CdmCorpusDefinition
from cdm.storage import LocalAdapter, RemoteAdapter


def async_test(f):
    def wrapper(*args, **kwargs):
        coro = asyncio.coroutine(f)
        future = coro(*args, **kwargs)
        loop = asyncio.get_event_loop()
        loop.run_until_complete(future)
    return wrapper


class TestHelper:
    @staticmethod
    def get_input_folder_path(test_subpath: str, test_name: str):
        return TestHelper.get_test_folder_path(test_subpath, test_name, 'input')

    @staticmethod
    def get_expected_output_folder_path(test_subpath: str, test_name: str):
        return TestHelper.get_test_folder_path(test_subpath, test_name, 'expected_output')

    @staticmethod
    def get_data(test_subpath: str, test_name: str, folder_name: str, file_name: str):
        folder_path = TestHelper.get_test_folder_path(test_subpath, test_name, folder_name)
        file_path = os.path.join(folder_path, file_name)
        with open(file_path, 'r') as expected_file:
            data = json.loads(expected_file.read())
        return data

    @staticmethod
    def get_expected_output_data(test_subpath: str, test_name: str, file_name: str):
        return TestHelper.get_data(test_subpath, test_name, 'expected_output', file_name)

    @staticmethod
    def get_input_data(test_subpath: str, test_name: str, file_name: str):
        return TestHelper.get_data(test_subpath, test_name, 'input', file_name)

    @staticmethod
    def get_actual_output_folder_path(test_subpath: str, test_name: str):
        return TestHelper.get_test_folder_path(test_subpath, test_name, 'test_output')

    @staticmethod
    def get_local_corpus(test_subpath: str, test_name: str, test_input_dir: Optional[str] = None):
        schema_docs_root_dir = '../CDM.SchemaDocuments'
        test_input_dir = test_input_dir or TestHelper.get_input_folder_path(test_subpath, test_name)
        test_output_dir = TestHelper.get_actual_output_folder_path(test_subpath, test_name)

        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'

        cdm_corpus.storage.mount('local', LocalAdapter(root=test_input_dir))
        cdm_corpus.storage.mount('output', LocalAdapter(root=test_output_dir))
        cdm_corpus.storage.mount('cdm', LocalAdapter(root=schema_docs_root_dir))
        cdm_corpus.storage.mount('remote', RemoteAdapter(hosts={'contoso': 'http://contoso.com'}))

        return cdm_corpus

    @staticmethod
    def get_test_folder_path(test_subpath: str, test_name: str, folder_name: str):
        test_folder_path = os.path.join('tests', 'testdata', test_subpath, test_name, folder_name)

        if folder_name == 'test_output' and not os.path.isdir(test_folder_path):
            os.makedirs(test_folder_path, exist_ok=True)

        return test_folder_path
