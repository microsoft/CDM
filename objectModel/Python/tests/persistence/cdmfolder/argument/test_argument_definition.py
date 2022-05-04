# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from cdm.objectmodel import CdmCorpusDefinition
from cdm.persistence.cdmfolder import ArgumentPersistence
from cdm.utilities import JObject


class TestArgument(unittest.TestCase):
    '''Class for testing the ArgumentPersistence.'''

    def test_loading_zero_value(self):
        '''Test loading an argument with value 0 (number).'''

        corpus = CdmCorpusDefinition()
        argument_data = JObject({
            'value': 0
        })

        argument = ArgumentPersistence.from_data(corpus.ctx, argument_data)
        self.assertEqual(0, argument.value)

        argument_to_data = ArgumentPersistence.to_data(argument, None, None)
        self.assertEqual(0, argument_to_data)

    def test_loading_blank_name(self):
        '''Test loading an argument with blank name & value 0 (number).'''

        corpus = CdmCorpusDefinition()
        argument_data = JObject({
            'name': " ",
            'value': 0
        })

        argument = ArgumentPersistence.from_data(corpus.ctx, argument_data)
        self.assertEqual(0, argument.value)

        argument_to_data = ArgumentPersistence.to_data(argument, None, None)
        self.assertEqual(0, argument_to_data)
