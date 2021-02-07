# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
import os
from tests.common import async_test, TestHelper
from cdm.utilities import ResolveOptions
from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmAttributeGroupDefinition, CdmAttributeGroupReference, CdmTraitDefinition, CdmTraitReference, CdmTypeAttributeDefinition

class SymbolResolutionTest(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'SymbolResolution')

    @async_test
    async def test_symbol_resolution(self):
        test_name = 'test_symbol_resolution'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        # load the file
        ent = await corpus.fetch_object_async('local:/symbolEntity.cdm.json/symbolEnt')  # type: CdmEntityDefinition
        res_opt = ResolveOptions(ent.in_document)  # type: ResolveOptions

        # resolve a reference to the trait object
        trait_def = corpus._resolve_symbol_reference(
            res_opt,
            ent.in_document,
            'symbolEnt/exhibitsTraits/someTraitOnEnt',
            CdmObjectType.TRAIT_DEF,
            False
        )  # type: CdmObjectBase

        self.assertTrue(isinstance(trait_def, CdmTraitDefinition))

        # resolve a path to the reference object that contains the trait
        trait_ref = corpus._resolve_symbol_reference(
            res_opt,
            ent.in_document,
            'symbolEnt/exhibitsTraits/someTraitOnEnt/(ref)',
            CdmObjectType.TRAIT_DEF,
            False
        )  # type: CdmObjectBase

        self.assertTrue(isinstance(trait_ref, CdmTraitReference))

        # fetchObjectDefinition on a path to a reference should fetch the actual object
        trait_ref_definition = trait_ref.fetch_object_definition(res_opt)  # type: CdmTraitDefinition
        trait_def_definition = trait_def.fetch_object_definition(res_opt)  # type: CdmTraitDefinition 
        self.assertTrue(trait_ref_definition, trait_def)
        self.assertTrue(trait_def_definition, trait_def)

        group_ref = corpus._resolve_symbol_reference(
            res_opt,
            ent.in_document,
            'symbolEnt/hasAttributes/someGroupRef/(ref)',
            CdmObjectType.ATTRIBUTE_GROUP_DEF,
            False
        )  # type: CdmObjectBase 

        self.assertTrue(isinstance(group_ref, CdmAttributeGroupReference))

        group_def = corpus._resolve_symbol_reference(
            res_opt,
            ent.in_document,
            'symbolEnt/hasAttributes/someGroupRef',
            CdmObjectType.ATTRIBUTE_GROUP_DEF,
            False
        )  # type: CdmObjectBase

        self.assertTrue(isinstance(group_def, CdmAttributeGroupDefinition))

        # calling fetchObjectDefinition on a symbol to a ref or def should both give the definition
        group_ref_definition = group_ref.fetch_object_definition(res_opt)  # type: CdmAttributeGroupDefinition 
        group_def_definition = group_def.fetch_object_definition(res_opt)  # type: CdmAttributeGroupDefinition 
        self.assertEqual(group_ref_definition, group_def)
        self.assertEqual(group_def_definition, group_def)

        type_att = corpus._resolve_symbol_reference(
            res_opt,
            ent.in_document,
            'symbolEnt/hasAttributes/someGroupRef/members/someAttribute',
            CdmObjectType.ATTRIBUTE_GROUP_DEF,
            False
        )  # type: CdmObjectBase

        self.assertTrue(isinstance(type_att, CdmTypeAttributeDefinition))
