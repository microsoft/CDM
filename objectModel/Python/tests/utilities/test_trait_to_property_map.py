# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from cdm.enums import CdmDataFormat
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmTypeAttributeDefinition
from cdm.utilities import TraitToPropertyMap


class TraitToPropertyMapTests(unittest.TestCase):
    def test_trait_to_unknown_data_format(self):
        """Test trait to data format when unknown data format trait is in an attribute."""
        cdm_attribute = CdmTypeAttributeDefinition(CdmCorpusContext(CdmCorpusDefinition(), None), 'SomeAttribute')
        cdm_attribute.applied_traits.append('is.data_format.someRandomDataFormat')
        trait_to_property_map = TraitToPropertyMap(cdm_attribute)

        data_format = trait_to_property_map._traits_to_data_format(False)

        self.assertEqual(CdmDataFormat.UNKNOWN, data_format)

    def test_trait_to_json_data_format(self):
        """Test trait to data format when calculated data format should be JSON."""
        cdm_attribute = CdmTypeAttributeDefinition(CdmCorpusContext(CdmCorpusDefinition(), None), 'SomeAttribute')
        cdm_attribute.applied_traits.append('is.dataFormat.array')
        cdm_attribute.applied_traits.append('means.content.text.JSON')
        trait_to_property_map = TraitToPropertyMap(cdm_attribute)

        data_format = trait_to_property_map._traits_to_data_format(False)

        self.assertEqual(CdmDataFormat.JSON, data_format)

    def test_update_and_fetch_list_lookup(self):
        """Test update and fetch list lookup default value without attributeValue and displayOrder."""
        corpus = CdmCorpusDefinition()
        cdm_attribute = CdmTypeAttributeDefinition(corpus.ctx, 'SomeAttribute')
        trait_to_property_map = TraitToPropertyMap(cdm_attribute)

        constant_values = [
            {
                'languageTag': 'en',
                'displayText': 'Fax'
            }
        ]

        trait_to_property_map._update_property_value('defaultValue', constant_values)
        result = trait_to_property_map._fetch_property_value('defaultValue')

        self.assertEqual(1, len(result))
        self.assertEqual('en', result[0].get('languageTag'))
        self.assertEqual('Fax', result[0].get('displayText'))
        self.assertIsNone(result[0].get('attributeValue'))
        self.assertIsNone(result[0].get('displayOrder'))
