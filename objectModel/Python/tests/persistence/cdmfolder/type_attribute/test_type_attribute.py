# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType, CdmStatusLevel, CdmDataFormat
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmTypeAttributeDefinition
from cdm.persistence import PersistenceLayer
from cdm.persistence.cdmfolder.entity_persistence import EntityPersistence
from cdm.persistence.cdmfolder.types import TypeAttribute
from cdm.storage import LocalAdapter
from cdm.utilities import JObject

from tests.common import async_test, TestHelper

class TypeAttributeTest(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'CdmFolder', 'TypeAttribute')

    def test_non_null_default_value_attribute(self):
        the_list = [{
            'languageTag': 'en',
            'displayText': 'Preferred Customer',
            'attributeValue': '1',
            'displayOrder': '0'
        },
        {
            'languageTag': 'en',
            'displayText': 'Standard',
            'attributeValue': '2',
            'displayOrder': '1'
        }]

        input = {'defaultValue': the_list}

        cdmTypeAttributeDefinition = PersistenceLayer.from_data(CdmCorpusContext(CdmCorpusDefinition(), None), JObject(input), CdmObjectType.TYPE_ATTRIBUTE_DEF, PersistenceLayer.CDM_FOLDER)

        result = PersistenceLayer.to_data(cdmTypeAttributeDefinition, None, None, PersistenceLayer.CDM_FOLDER)

        self.assertTrue(result)
        self.assertEqual(result.get('defaultValue'), input.get('defaultValue'))

    @async_test
    async def test_reading_is_primary_key(self):
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_reading_is_primary_key')
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        # read from an unresolved entity schema
        entity = await corpus.fetch_object_async('local:/TeamMembership.cdm.json/TeamMembership')
        attribute_group_ref = entity.attributes[0]  # type: CdmAttributeGroupReference
        attribute_group = attribute_group_ref.explicit_reference # type: CdmAttributeGroupDefinition
        type_attribute = attribute_group.members[0]  # type: CdmTypeAttributeDefinition

        self.assertTrue(type_attribute.is_primary_key)

        # check that the trait "is.identifiedBy" is created with the correct argument.
        is_identified_by1 = type_attribute.applied_traits[1]  # type: CdmTraitReference
        self.assertEqual('is.identifiedBy', is_identified_by1.named_reference)
        self.assertEqual('TeamMembership/(resolvedAttributes)/teamMembershipId', is_identified_by1.arguments[0].value)

        # read from a resolved entity schema
        resolved_entity = await corpus.fetch_object_async('local:/TeamMembership_Resolved.cdm.json/TeamMembership')
        resolved_type_attribute = resolved_entity.attributes[0]  # type: CdmTypeAttributeDefinition

        self.assertTrue(resolved_type_attribute.is_primary_key)

        # check that the trait "is.identifiedBy" is created with the correct argument.
        is_identified_by2 = resolved_type_attribute.applied_traits[6]  # type: CdmTraitReference
        self.assertEqual('is.identifiedBy', is_identified_by2.named_reference)

        argument_value = is_identified_by2.arguments[0].value  # type: CdmAttributeReference
        self.assertEqual('TeamMembership/(resolvedAttributes)/teamMembershipId', argument_value.named_reference)

    async def test_reading_is_primary_key_constructed_from_purpose(self):
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_reading_is_primary_key_constructed_from_purpose')
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        entity = await corpus.fetch_object_async('local:/TeamMembership.cdm.json/TeamMembership')
        attribute_group_ref = entity.attributes[0]  # type: CdmAttributeGroupReference
        attribute_group = attribute_group_ref.explicit_reference # type: CdmAttributeGroupDefinition
        type_attribute = attribute_group.members[0]  # type: CdmTypeAttributeDefinition

        self.assertEqual('identifiedBy', type_attribute.purpose.named_reference)
        self.assertTrue(type_attribute.is_primary_key)

    @async_test
    async def test_property_persistence(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestPropertyPersistence')
        entity = await corpus.fetch_object_async('local:/PropertyEntity.cdm.json/PropertyEntity')  # type: CdmEntityDefinition

        # test loading properties
        attribute = entity.attributes[0]  # type: CdmTypeAttributeDefinition
        self.assertTrue(attribute.is_read_only)
        self.assertTrue(attribute.is_nullable)
        self.assertEqual(attribute.source_name, 'propertyAttribute')
        self.assertEqual(attribute.description, 'Attribute that has all properties set.')
        self.assertEqual(attribute.display_name, 'Property Attribute')
        self.assertEqual(attribute.source_ordering, 1)
        self.assertTrue(attribute.value_constrained_to_list)
        self.assertEqual(attribute.maximum_length, 10)
        self.assertEqual(attribute.maximum_value, '20')
        self.assertEqual(attribute.minimum_value, '1')
        self.assertEqual(attribute.data_format, CdmDataFormat.STRING)
        self.assertEqual(attribute.default_value[0]['displayText'], 'Default')

        # test loading negative value properties
        negativeAttribute = entity.attributes[1]  # type: CdmTypeAttributeDefinition
        self.assertFalse(negativeAttribute.is_read_only)
        self.assertFalse(negativeAttribute.is_nullable)
        self.assertIsNone(negativeAttribute.source_name)
        self.assertIsNone(negativeAttribute.description)
        self.assertIsNone(negativeAttribute.display_name)
        self.assertEqual(negativeAttribute.source_ordering, 0)
        self.assertFalse(negativeAttribute.value_constrained_to_list)
        self.assertEqual(negativeAttribute.maximum_length, 0)
        self.assertEqual(negativeAttribute.maximum_value, '0')
        self.assertEqual(negativeAttribute.minimum_value, '0')
        self.assertEqual(negativeAttribute.data_format, CdmDataFormat.UNKNOWN)
        self.assertEqual(negativeAttribute.default_value[0]['displayText'], '')

        # test loading values with wrongs types in file
        wrong_types_attribute = entity.attributes[2]  # type: CdmTypeAttributeDefinition
        self.assertTrue(wrong_types_attribute.is_read_only)
        self.assertTrue(wrong_types_attribute.is_nullable)
        self.assertEqual(wrong_types_attribute.source_ordering, 1)
        self.assertFalse(wrong_types_attribute.value_constrained_to_list)
        self.assertEqual(wrong_types_attribute.maximum_length, 0)
        self.assertEqual(wrong_types_attribute.maximum_value, '20')
        self.assertEqual(wrong_types_attribute.minimum_value, '0')

        # test loading values with wrong types that cannot be properly converted
        invalidValuesAttribute = entity.attributes[3]  # type: CdmTypeAttributeDefinition
        self.assertFalse(invalidValuesAttribute.is_read_only)
        self.assertIsNone(invalidValuesAttribute.maximum_length)

        entityData = EntityPersistence.to_data(entity, None, None)

        # test toData for properties
        attributeData = entityData.hasAttributes[0]  # type: TypeAttribute
        self.assertTrue(attributeData.isReadOnly)
        self.assertTrue(attributeData.isNullable)
        self.assertEqual(attributeData.sourceName, 'propertyAttribute')
        self.assertEqual(attributeData.description, 'Attribute that has all properties set.')
        self.assertEqual(attributeData.displayName, 'Property Attribute')
        self.assertEqual(attributeData.sourceOrdering, 1)
        self.assertTrue(attributeData.valueConstrainedToList)
        self.assertEqual(attributeData.maximumLength, 10)
        self.assertEqual(attributeData.maximumValue, '20')
        self.assertEqual(attributeData.minimumValue, '1')
        self.assertEqual(attributeData.dataFormat, 'String')
        self.assertEqual(attributeData.defaultValue[0]['displayText'], 'Default')

        # test toData for negative value properties
        negativeAttributeData = entityData.hasAttributes[1]  # type: TypeAttribute
        self.assertFalse(negativeAttributeData.isReadOnly)
        self.assertFalse(negativeAttributeData.isNullable)
        self.assertIsNone(negativeAttributeData.sourceName)
        self.assertIsNone(negativeAttributeData.description)
        self.assertIsNone(negativeAttributeData.displayName)
        self.assertIsNone(negativeAttributeData.sourceOrdering)
        self.assertIsNone(negativeAttributeData.valueConstrainedToList)
        self.assertEqual(negativeAttributeData.maximumLength, 0)
        self.assertEqual(negativeAttributeData.maximumValue, '0')
        self.assertEqual(negativeAttributeData.minimumValue, '0')
        self.assertIsNone(negativeAttributeData.dataFormat)
        self.assertEqual(negativeAttributeData.defaultValue[0]['displayText'], '')

        # test toData for values with wrong types in file
        wrong_types_attribute_data = entityData.hasAttributes[2]  #type: TypeAttribute
        self.assertTrue(wrong_types_attribute_data.isReadOnly)
        self.assertTrue(wrong_types_attribute_data.isNullable)
        self.assertEqual(wrong_types_attribute_data.sourceOrdering, 1)
        self.assertIsNone(wrong_types_attribute_data.valueConstrainedToList)
        self.assertEqual(wrong_types_attribute_data.maximumLength, 0)
        self.assertEqual(wrong_types_attribute_data.maximumValue, '20')
        self.assertEqual(wrong_types_attribute_data.minimumValue, '0')

        # test toData with wrong types that cannot be properly converted
        invalidValuesAttributeData = entityData.hasAttributes[3]  # type: TypeAttribute
        self.assertIsNone(invalidValuesAttributeData.is_read_only)
        self.assertIsNone(invalidValuesAttributeData.maximum_length)


    @async_test
    async def test_cdm_folder_to_data_type_attribute(self):
        """
        Testing that "is.localized.describedAs" trait with a table of three entries (en, rs and cn) is fully preserved when running CdmFolder TypeAttributePersistence ToData.
        """
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('local', LocalAdapter('C:\\Root\\Path'))
        corpus.storage.default_namespace = 'local'

        cdm_type_attribute_definition = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'TestSavingTraitAttribute', False)
        english_constants_list = ['en', 'Some description in English language']
        serbian_constants_list = ['sr', 'Opis na srpskom jeziku']
        chinese_constants_list = ['cn', '一些中文描述']
        list_of_const_lists = [english_constants_list, serbian_constants_list, chinese_constants_list]

        const_ent_def = corpus.make_object(CdmObjectType.CONSTANT_ENTITY_DEF, 'localizedDescriptions', False)
        const_ent_def.constant_values = list_of_const_lists
        const_ent_def.entity_shape = corpus.make_ref(CdmObjectType.ENTITY_REF, 'localizedTable', True)
        trait_reference2 = corpus.make_object(CdmObjectType.TRAIT_REF, 'is.localized.describedAs', False)
        trait_reference2.arguments.append('localizedDisplayText', corpus.make_ref(CdmObjectType.ENTITY_REF, const_ent_def, True))
        cdm_type_attribute_definition.applied_traits.append(trait_reference2)

        result = TypeAttribute().decode(PersistenceLayer.to_data(cdm_type_attribute_definition, None, None, PersistenceLayer.CDM_FOLDER))
        self.assertIsNotNone(result.appliedTraits)

        argument = result.appliedTraits[0].arguments[0]
        constant_values = argument.value.entityReference.constantValues

        self.assertEqual('en', constant_values[0][0])
        self.assertEqual('Some description in English language', constant_values[0][1])
        self.assertEqual('sr', constant_values[1][0])
        self.assertEqual('Opis na srpskom jeziku', constant_values[1][1])
        self.assertEqual('cn', constant_values[2][0])
        self.assertEqual('一些中文描述', constant_values[2][1])
