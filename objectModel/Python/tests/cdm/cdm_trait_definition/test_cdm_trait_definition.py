# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
from tests.common import async_test
from cdm.objectmodel import CdmTraitReference, CdmTraitDefinition, CdmCorpusDefinition

class CdmTraitDefinitionTests(unittest.TestCase):
    @async_test
    def test_extends_trait_property_optional(self):
        corpus = CdmCorpusDefinition()
        extend_trait_ref1 = CdmTraitReference(corpus.ctx, 'testExtendTraitName1', True)
        extend_trait_ref2 = CdmTraitReference(corpus.ctx, 'testExtendTraitName2', True)
        trait_definition = CdmTraitDefinition(corpus.ctx, 'testTraitName', extend_trait_ref1)

        self.assertEqual(extend_trait_ref1, trait_definition.extends_trait)
        trait_definition.extends_trait = None
        self.assertIsNone(trait_definition.extends_trait)

        trait_definition.extends_trait = extend_trait_ref2
        self.assertEqual(extend_trait_ref2, trait_definition.extends_trait)
        trait_definition.extends_trait = None
        self.assertIsNone(trait_definition.extends_trait)
