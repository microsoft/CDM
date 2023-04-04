# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import json
import unittest

from tests.common import async_test, TestHelper
from tests.syms_test_helper import SymsTestHelper


class TestHelperTestCase(unittest.TestCase):
    test_subpath = 'Utilities'

    @async_test
    def test_object_equality_with_syms_property_additions(self):
        test_name = 'TestObjectEqualityWithSymsPropertyAdditions'
        # not exactly testing Syms, checking that our object comparison method correctly allows the Syms actual object
        # to contain new properties that are not found in the expected Syms object. This is to avoid issues when
        # Syms adds new properties. This only occurs for Syms comparisons
        expected = TestHelper.get_input_file_content(self.test_subpath, test_name, 'expected.json')
        actual = TestHelper.get_input_file_content(self.test_subpath, test_name, 'actual.json')
        actual_object = json.loads(actual)
        expected_object = json.loads(expected)

        actualCanHaveExtraProps = SymsTestHelper.json_object_should_be_equal_as_expected(expected_object, actual_object)
        self.assertTrue(actualCanHaveExtraProps)
        expectedCannotHaveExtraProps = SymsTestHelper.json_object_should_be_equal_as_expected(actual_object, expected_object)
        self.assertFalse(expectedCannotHaveExtraProps)

        # the above should only be valid for Syms, not in the general compare_same_object method
        # here, ignoreExtraValuesInActual is false
        actual_has_extra_props = TestHelper.compare_same_object(expected_object, actual_object)
        self.assertNotEqual(actual_has_extra_props, '')
        expected_has_extra_props = TestHelper.compare_same_object(actual_object, expected_object)
        self.assertNotEqual(expected_has_extra_props, '')
