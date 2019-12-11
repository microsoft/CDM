import unittest

from cdm.enums import CdmDataFormat
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmTypeAttributeDefinition
from cdm.utilities import TraitToPropertyMap


class TraitToPropertyMapTests(unittest.TestCase):
    def test_trait_to_unknown_data_format(self):
        """Test trait to data format when unknown data format trait is in an attribute."""
        cdm_attribute = CdmTypeAttributeDefinition(CdmCorpusContext(CdmCorpusDefinition()), 'SomeAttribute')
        cdm_attribute.applied_traits.append('is.data_format.someRandomDataFormat')
        trait_to_property_map = TraitToPropertyMap(cdm_attribute)

        data_format = trait_to_property_map._traits_to_data_format(False)

        self.assertEqual(CdmDataFormat.UNKNOWN, data_format)

    def test_trait_to_json_data_format(self):
        """Test trait to data format when calculated data format should be JSON."""
        cdm_attribute = CdmTypeAttributeDefinition(CdmCorpusContext(CdmCorpusDefinition()), 'SomeAttribute')
        cdm_attribute.applied_traits.append('is.dataFormat.array')
        cdm_attribute.applied_traits.append('means.content.text.JSON')
        trait_to_property_map = TraitToPropertyMap(cdm_attribute)

        data_format = trait_to_property_map._traits_to_data_format(False)

        self.assertEqual(CdmDataFormat.JSON, data_format)
