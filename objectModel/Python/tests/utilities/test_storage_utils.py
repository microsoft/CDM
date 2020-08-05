# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from cdm.utilities import StorageUtils


class StorageUtilsTest(unittest.TestCase):
    """Test to validate StorageUtils functions"""

    def test_split_namespace_path(self):
        """Test split_namespace_path function on different paths"""
        self.assertIsNone(StorageUtils.split_namespace_path(None))

        path_tuple_1 = StorageUtils.split_namespace_path('local:/some/path')
        self.assertIsNotNone(path_tuple_1)
        self.assertEqual('local', path_tuple_1[0])
        self.assertEqual('/some/path', path_tuple_1[1])

        path_tuple_2 = StorageUtils.split_namespace_path('/some/path')
        self.assertIsNotNone(path_tuple_2)
        self.assertEqual('', path_tuple_2[0])
        self.assertEqual('/some/path', path_tuple_2[1])

        path_tuple_3 = StorageUtils.split_namespace_path('adls:/some/path:with:colons')
        self.assertIsNotNone(path_tuple_3)
        self.assertEqual('adls', path_tuple_3[0])
        self.assertEqual('/some/path:with:colons', path_tuple_3[1])
