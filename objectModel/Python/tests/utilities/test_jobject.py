# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from unittest import TestCase

from cdm.utilities import JObject


class TestJObject(TestCase):
    def test_non_existing_properties(self):
        """Tests if trying to access a non existing property does not throw an exception."""
        obj = JObject()
        obj.property1 = 'Name'

        self.assertEqual(obj.property1, 'Name')
        self.assertIsNone(obj.other_property)

