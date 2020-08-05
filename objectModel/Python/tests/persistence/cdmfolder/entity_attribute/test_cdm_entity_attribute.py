import unittest

from cdm.objectmodel import CdmCorpusDefinition
from cdm.persistence.cdmfolder.entity_attribute_persistence import EntityAttributePersistence
from cdm.utilities import JObject

class CdmEntityAttributeTest(unittest.TestCase):
    def test_description_and_display_name(self):
        """Tests if calling from and to data maintain the properties description and displayName."""
        corpus = CdmCorpusDefinition()
        entity_name = 'TheEntity'
        description = 'entityAttributeDescription'
        display_name = 'whatABeutifulDisplayName'
        input_data = JObject({
            'name': entity_name,
            'displayName': display_name,
            'description': description
        })

        instance = EntityAttributePersistence.from_data(corpus.ctx, input_data)

        self.assertEqual(description, instance.description)
        self.assertEqual(display_name, instance.display_name)

        data = EntityAttributePersistence.to_data(instance, None, None)

        self.assertEqual(description, data.description)
        self.assertEqual(display_name, data.displayName)

        # Checks if there is no residue of the transformation of the properties into traits.
        self.assertIsNone(data.AppliedTraits)
