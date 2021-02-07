# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from tests.common import TestHelper


class CardinalitySettingUnitTest(unittest.TestCase):
    """Unit test for CardinalitySetting functions"""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestCardinalitySetting')

    def test_minimum(self):
        """Unit test for CardinalitySetting.IsMinimumValid"""
        test_name = 'TestMinimum'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        def callback(level, message):
            if 'CardinalitySettings | Invalid minimum cardinality -1.' not in message:
                self.fail('Some unexpected failure - {}!'.format(message))
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # Create Dummy Type Attribute
        attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, "dummyAttribute", False)
        attribute.cardinality = CardinalitySettings(attribute)
        attribute.cardinality.minimum = '-1'

    def test_maximum(self):
        """Unit test for CardinalitySetting.IsMaximumValid"""
        test_name = 'TestMaximum'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        def callback(level, message):
            if 'CardinalitySettings | Invalid maximum cardinality Abc.' not in message:
                self.fail('Some unexpected failure - {}!'.format(message))

        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # Create Dummy Type Attribute
        attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, "dummyAttribute", False)
        attribute.cardinality = CardinalitySettings(attribute)
        attribute.cardinality.maximum = 'Abc'
