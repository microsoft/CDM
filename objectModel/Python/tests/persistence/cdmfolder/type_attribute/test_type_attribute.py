# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import Set

from cdm.enums import CdmObjectType, CdmStatusLevel, CdmDataFormat, ImportsLoadStrategy
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmTypeAttributeDefinition, CdmEntityDefinition
from cdm.persistence import PersistenceLayer
from cdm.persistence.cdmfolder.entity_persistence import EntityPersistence
from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence
from cdm.persistence.cdmfolder.types import TypeAttribute
from cdm.storage import LocalAdapter
from cdm.utilities import JObject, ResolveOptions, CopyOptions

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
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_reading_is_primary_key')

        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD

        # read from an unresolved entity schema
        entity = await corpus.fetch_object_async('local:/TeamMembership.cdm.json/TeamMembership', res_opt=res_opt)
        attribute_group_ref = entity.attributes[0]  # type: CdmAttributeGroupReference
        attribute_group = attribute_group_ref.explicit_reference # type: CdmAttributeGroupDefinition
        type_attribute = attribute_group.members[0]  # type: CdmTypeAttributeDefinition

        self.assertTrue(type_attribute.is_primary_key)

        # check that the trait "is.identifiedBy" is created with the correct argument.
        is_identified_by1 = type_attribute.applied_traits[1]  # type: CdmTraitReference
        self.assertEqual('is.identifiedBy', is_identified_by1.named_reference)
        self.assertEqual('TeamMembership/(resolvedAttributes)/teamMembershipId', is_identified_by1.arguments[0].value)

        # read from a resolved entity schema
        resolved_entity = await corpus.fetch_object_async('local:/TeamMembership_Resolved.cdm.json/TeamMembership', res_opt=res_opt)
        resolved_type_attribute = resolved_entity.attributes[0]  # type: CdmTypeAttributeDefinition

        self.assertTrue(resolved_type_attribute.is_primary_key)

        # check that the trait "is.identifiedBy" is created with the correct argument.
        is_identified_by2 = resolved_type_attribute.applied_traits[6]  # type: CdmTraitReference
        self.assertEqual('is.identifiedBy', is_identified_by2.named_reference)

        argument_value = is_identified_by2.arguments[0].value  # type: CdmAttributeReference
        self.assertEqual('TeamMembership/(resolvedAttributes)/teamMembershipId', argument_value.named_reference)

    @async_test
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
        function_was_called = False
        function_parameter1 = CdmStatusLevel.INFO
        function_parameter2 = None

        def callback(status_level: CdmStatusLevel, message1: str):
            nonlocal function_was_called, function_parameter1, function_parameter2
            function_was_called = True
            if status_level == CdmStatusLevel.ERROR:
                function_parameter1 = status_level
                function_parameter2 = message1

        corpus.set_event_callback(callback)

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

        # test loading values with empty default value list that should log error
        emptyDefaultValueAttribute = entity.attributes[4]  # type: CdmTypeAttributeDefinition
        self.assertTrue(function_was_called)
        self.assertEqual(CdmStatusLevel.ERROR, function_parameter1)
        self.assertTrue(function_parameter2.find('A \'defaultValue\' property is empty or one of its entries is missing \'languageTag\' and \'displayText\' values.') != -1)
        self.assertIsNone(emptyDefaultValueAttribute.default_value)
        # set the default value to an empty list for testing that it should be removed from the generated json.
        emptyDefaultValueAttribute.default_value = []

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

        # test toData with empty default value list that should be written as null
        emptyDefaultValueAttributeData = entityData.hasAttributes[4]  # type: TypeAttribute
        self.assertIsNone(emptyDefaultValueAttributeData.default_value)

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

    @async_test
    async def test_data_format_to_trait_mappings(self):
        '''
        Testing that DataFormat to trait mappings are correct and that correct traits are added to the type attribute.
        '''
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_data_format_to_trait_mappings')
        entity = await corpus.fetch_object_async('local:/Entity.cdm.json/Entity')  # type: CdmEntityDefinition

        # Check that the traits we expect for each DataFormat are found in the type attribute's applied traits.

        # DataFormat = Int16
        attribute_a = entity.attributes[0]  # type: CdmTypeAttributeDefinition
        a_trait_named_references = self._fetch_trait_named_references(attribute_a.applied_traits)
        self.assertTrue('is.dataFormat.integer' in a_trait_named_references)
        self.assertTrue('is.dataFormat.small' in a_trait_named_references)

        # DataFormat = Int32
        attribute_b = entity.attributes[1]  # type: CdmTypeAttributeDefinition
        b_trait_named_references = self._fetch_trait_named_references(attribute_b.applied_traits)
        self.assertTrue('is.dataFormat.integer' in b_trait_named_references)

        # DataFormat = Int64
        attribute_c = entity.attributes[2]  # type: CdmTypeAttributeDefinition
        c_trait_named_references = self._fetch_trait_named_references(attribute_c.applied_traits)
        self.assertTrue('is.dataFormat.integer' in c_trait_named_references)
        self.assertTrue('is.dataFormat.big' in c_trait_named_references)

        # DataFormat = Float
        attribute_d = entity.attributes[3]  # type: CdmTypeAttributeDefinition
        d_trait_named_references = self._fetch_trait_named_references(attribute_d.applied_traits)
        self.assertTrue('is.dataFormat.floatingPoint' in d_trait_named_references)

        # DataFormat = Double
        attribute_e = entity.attributes[4]  # type: CdmTypeAttributeDefinition
        e_trait_named_references = self._fetch_trait_named_references(attribute_e.applied_traits)
        self.assertTrue('is.dataFormat.floatingPoint' in e_trait_named_references)
        self.assertTrue('is.dataFormat.big' in e_trait_named_references)

        # DataFormat = Guid
        attribute_f = entity.attributes[5]  # type: CdmTypeAttributeDefinition
        f_trait_named_references = self._fetch_trait_named_references(attribute_f.applied_traits)
        self.assertTrue('is.dataFormat.guid' in f_trait_named_references)
        self.assertTrue('is.dataFormat.character' in f_trait_named_references)
        self.assertTrue('is.dataFormat.array' in f_trait_named_references)

        # DataFormat = String
        attribute_g = entity.attributes[6]  # type: CdmTypeAttributeDefinition
        g_trait_named_references = self._fetch_trait_named_references(attribute_g.applied_traits)
        self.assertTrue('is.dataFormat.character' in g_trait_named_references)
        self.assertTrue('is.dataFormat.array' in g_trait_named_references)

        # DataFormat = Char
        attribute_h = entity.attributes[7]  # type: CdmTypeAttributeDefinition
        h_trait_named_references = self._fetch_trait_named_references(attribute_h.applied_traits)
        self.assertTrue('is.dataFormat.character' in h_trait_named_references)
        self.assertTrue('is.dataFormat.big' in h_trait_named_references)

        # DataFormat = Byte
        attribute_i = entity.attributes[8]  # type: CdmTypeAttributeDefinition
        i_trait_named_references = self._fetch_trait_named_references(attribute_i.applied_traits)
        self.assertTrue('is.dataFormat.byte' in i_trait_named_references)

        # DataFormat = Binary
        attribute_j = entity.attributes[9]  # type: CdmTypeAttributeDefinition
        j_trait_named_references = self._fetch_trait_named_references(attribute_j.applied_traits)
        self.assertTrue('is.dataFormat.byte' in j_trait_named_references)
        self.assertTrue('is.dataFormat.array' in j_trait_named_references)

        # DataFormat = Time
        attribute_k = entity.attributes[10]  # type: CdmTypeAttributeDefinition
        k_trait_named_references = self._fetch_trait_named_references(attribute_k.applied_traits)
        self.assertTrue('is.dataFormat.time' in k_trait_named_references)

        # DataFormat = Date
        attribute_l = entity.attributes[11]  # type: CdmTypeAttributeDefinition
        l_trait_named_references = self._fetch_trait_named_references(attribute_l.applied_traits)
        self.assertTrue('is.dataFormat.date' in l_trait_named_references)

        # DataFormat = DateTime
        attribute_m = entity.attributes[12]  # type: CdmTypeAttributeDefinition
        m_trait_named_references = self._fetch_trait_named_references(attribute_m.applied_traits)
        self.assertTrue('is.dataFormat.time' in m_trait_named_references)
        self.assertTrue('is.dataFormat.date' in m_trait_named_references)

        # DataFormat = DateTimeOffset
        attribute_n = entity.attributes[13]  # type: CdmTypeAttributeDefinition
        n_trait_named_references = self._fetch_trait_named_references(attribute_n.applied_traits)
        self.assertTrue('is.dataFormat.time' in n_trait_named_references)
        self.assertTrue('is.dataFormat.date' in n_trait_named_references)
        self.assertTrue('is.dataFormat.timeOffset' in n_trait_named_references)

        # DataFormat = Boolean
        attribute_o = entity.attributes[14]  # type: CdmTypeAttributeDefinition
        o_trait_named_references = self._fetch_trait_named_references(attribute_o.applied_traits)
        self.assertTrue('is.dataFormat.boolean' in o_trait_named_references)

        # DataFormat = Decimal
        attribute_p = entity.attributes[15]  # type: CdmTypeAttributeDefinition
        p_trait_named_references = self._fetch_trait_named_references(attribute_p.applied_traits)
        self.assertTrue('is.dataFormat.numeric.shaped' in p_trait_named_references)

        # DataFormat = Json
        attribute_q = entity.attributes[16]  # type: CdmTypeAttributeDefinition
        q_trait_named_references = self._fetch_trait_named_references(attribute_q.applied_traits)
        self.assertTrue('is.dataFormat.array' in q_trait_named_references)
        self.assertTrue('means.content.text.JSON' in q_trait_named_references)

    @async_test
    async def test_cardinality_persistence(self):
        '''
        Testing that cardinality settings are loaded and saved correctly
        '''
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_cardinality_persistence')

        # test from_data
        entity = await corpus.fetch_object_async('local:/someEntity.cdm.json/someEntity')  # type: CdmEntityDefinition
        attribute = entity.attributes[0]  # type: CdmTypeAttributeDefinition

        self.assertIsNotNone(attribute.cardinality)
        self.assertEqual(attribute.cardinality.minimum, '0')
        self.assertEqual(attribute.cardinality.maximum, '1')

        # test to_data
        attribute_data = TypeAttributePersistence.to_data(attribute, ResolveOptions(entity.in_document), CopyOptions())

        self.assertIsNotNone(attribute_data.cardinality)
        self.assertEqual(attribute_data.cardinality.minimum, '0')
        self.assertEqual(attribute_data.cardinality.maximum, '1')

    @staticmethod
    def _fetch_trait_named_references(traits: 'CdmTraitCollection') -> Set[str]:
        named_references = set()
        for trait in traits:
            named_references.add(trait.named_reference)
        return named_references
