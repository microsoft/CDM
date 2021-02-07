# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from cdm.objectmodel import CdmCorpusDefinition


class StorageManagerTests(unittest.TestCase):
    """Tests if the StorageManager functions correctly."""

    def test_create_absolute_corpus_pathWithColon(self):
        """Tests if create_absolute_corpus_path works correctly when provided with a path that contains a colon character."""
        corpus = CdmCorpusDefinition()
        folder = corpus.storage.fetch_root_folder('local')

        absolute_namespace = 'namespace:/'
        file_name = 'dataPartition.csv@snapshot=2020-05-10T02:47:46.0039374Z'
        sub_folder_path = 'some/sub/folder:with::colon/'

        # Cases where the path provided is relative.
        self.assertEqual('local:/' + file_name, corpus.storage.create_absolute_corpus_path(file_name, folder))
        self.assertEqual('local:/' + sub_folder_path + file_name, corpus.storage.create_absolute_corpus_path(sub_folder_path + file_name, folder))

        # Cases where the path provided is absolute.
        self.assertEqual(absolute_namespace + file_name, corpus.storage.create_absolute_corpus_path(absolute_namespace + file_name, folder))
        self.assertEqual(absolute_namespace + sub_folder_path + file_name, corpus.storage.create_absolute_corpus_path(absolute_namespace + sub_folder_path + file_name, folder))