# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from cdm.objectmodel import CdmCorpusDefinition, CdmFolderDefinition


class TestFolderDefinition(unittest.TestCase):
    def test_fetch_child_folder_from_path(self):
        """Tests the behavior of the fetch_child_folder_from_path function."""

        corpus = CdmCorpusDefinition()
        root_folder = CdmFolderDefinition(corpus.ctx, '')

        folder_path = '/'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, False)
        self.assertEqual(folder_path, child_folder.folder_path)

        folder_path = '/'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, True)
        self.assertEqual(folder_path, child_folder.folder_path)

        folder_path = '/core'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, False)
        self.assertEqual('/', child_folder.folder_path)

        folder_path = '/core'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, True)
        self.assertEqual(folder_path + '/', child_folder.folder_path)

        folder_path = '/core/'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, False)
        self.assertEqual(folder_path, child_folder.folder_path)

        folder_path = '/core/'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, True)
        self.assertEqual(folder_path, child_folder.folder_path)

        folder_path = '/core/applicationCommon'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, False)
        self.assertEqual('/core/', child_folder.folder_path)

        folder_path = '/core/applicationCommon'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, True)
        self.assertEqual(folder_path + '/', child_folder.folder_path)

        folder_path = '/core/applicationCommon/'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, False)
        self.assertEqual(folder_path, child_folder.folder_path)

        folder_path = '/core/applicationCommon/'
        child_folder = root_folder._fetch_child_folder_from_path(folder_path, True)
        self.assertEqual(folder_path, child_folder.folder_path)