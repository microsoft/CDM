# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmObjectType, CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition
from cdm.persistence import PersistenceLayer
from cdm.persistence.modeljson.types import Attribute
from cdm.storage import LocalAdapter

from tests.common import async_test

class TypeAttributeTest(unittest.TestCase):

    @async_test
    async def test_model_json_to_data_type_attribute(self):
        """
        Testing that "is.localized.describedAs" trait with a table of three entries (en, rs and cn) is fully preserved when running ModelJson TypeAttributePersistence ToData.
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

        result = Attribute().decode(await PersistenceLayer.to_data(cdm_type_attribute_definition, None, None, PersistenceLayer.MODEL_JSON))
        self.assertIsNotNone(result.traits)

        argument = result.traits[0].arguments[0]
        constant_values = argument.value.entityReference.constantValues

        self.assertEqual('en', constant_values[0][0])
        self.assertEqual('Some description in English language', constant_values[0][1])
        self.assertEqual('sr', constant_values[1][0])
        self.assertEqual('Opis na srpskom jeziku', constant_values[1][1])
        self.assertEqual('cn', constant_values[2][0])
        self.assertEqual('一些中文描述', constant_values[2][1])
