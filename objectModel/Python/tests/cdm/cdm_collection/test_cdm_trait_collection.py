# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import cast
import unittest

from cdm.utilities import Constants
from tests.common import async_test
from cdm.objectmodel import CdmTraitDefinition, CdmTraitReference
from .cdm_collection_helper_functions import generate_manifest


class CdmTraitCollectionTests(unittest.TestCase):
    @async_test
    def test_cdm_trait_collection_add(self):
        manifest = generate_manifest()

        trait = CdmTraitDefinition(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitDefinition(manifest.ctx, 'Name of other Trait', None)
        manifest._trait_cache = dict()

        added_trait = manifest.exhibits_traits.append(trait)
        added_other_trait = manifest.exhibits_traits.append(other_trait)
        list_of_args = [[Constants._INCREMENTAL_PATTERN_PARAMETER_NAME, 'test'], ['fullDataPartitionPatternName', 'name']]
        added_incremental_trait = manifest.exhibits_traits.append(Constants._INCREMENTAL_TRAIT_NAME, list_of_args)

        self.assertEqual(None, manifest._trait_cache)
        self.assertEqual(3, len(manifest.exhibits_traits))
        self.assertEqual(trait, manifest.exhibits_traits[0].explicit_reference)
        self.assertEqual(other_trait, manifest.exhibits_traits[1].explicit_reference)
        self.assertEqual(added_trait, manifest.exhibits_traits[0])
        self.assertEqual(added_other_trait, manifest.exhibits_traits[1])
        self.assertEqual(added_incremental_trait, manifest.exhibits_traits[2])
        self.assertEqual(2, len(manifest.exhibits_traits[2].arguments))
        self.assertEqual('test', manifest.exhibits_traits[2].arguments.fetch_value(Constants._INCREMENTAL_PATTERN_PARAMETER_NAME))
        self.assertEqual('name', manifest.exhibits_traits[2].arguments.fetch_value('fullDataPartitionPatternName'))

        self.assertEqual(manifest, manifest.exhibits_traits[0].owner)

    @async_test
    def test_cdm_trait_collection_insert(self):
        manifest = generate_manifest()

        trait = CdmTraitReference(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitReference(manifest.ctx, 'Name of other Trait', None)
        manifest._trait_cache = dict()

        manifest.exhibits_traits.insert(0, trait)
        manifest.exhibits_traits.insert(0, other_trait)

        self.assertEqual(None, manifest._trait_cache)
        self.assertEqual(2, len(manifest.exhibits_traits))
        self.assertEqual(other_trait, manifest.exhibits_traits[0])
        self.assertEqual(trait, manifest.exhibits_traits[1])
        self.assertEqual(manifest, manifest.exhibits_traits[0].owner)

    @async_test
    def test_cdm_trait_collection_add_range(self):
        manifest = generate_manifest()

        trait = CdmTraitDefinition(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitDefinition(manifest.ctx, 'Name of other Trait', None)
        trait_list = [trait, other_trait]

        manifest.exhibits_traits.extend(trait_list)
        self.assertEqual(2, len(manifest.exhibits_traits))
        self.assertEqual(trait, manifest.exhibits_traits[0].explicit_reference)
        self.assertEqual(other_trait, manifest.exhibits_traits[1].explicit_reference)
        self.assertEqual(manifest, manifest.exhibits_traits[0].owner)

    @async_test
    def test_cdm_trait_collection_remove(self):
        manifest = generate_manifest()

        trait = CdmTraitDefinition(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitDefinition(manifest.ctx, 'Name of other Trait', None)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)

        self.assertEqual(2, len(manifest.exhibits_traits))
        manifest._trait_cache = dict()

        manifest.exhibits_traits.remove(trait)
        self.assertEqual(1, len(manifest.exhibits_traits))
        self.assertEqual(None, manifest._trait_cache)

        manifest.exhibits_traits.remove(trait)
        self.assertEqual(1, len(manifest.exhibits_traits))
        self.assertEqual(other_trait, manifest.exhibits_traits[0].explicit_reference)

        manifest.exhibits_traits.remove('Name of other Trait')
        self.assertEqual(0, len(manifest.exhibits_traits))

        manifest.exhibits_traits.append(trait)
        self.assertEqual(1, len(manifest.exhibits_traits))

        manifest.exhibits_traits.remove(manifest.exhibits_traits[0])
        self.assertEqual(0, len(manifest.exhibits_traits))

    @async_test
    def test_cdm_trait_collection_remove_at(self):
        manifest = generate_manifest()

        trait = CdmTraitDefinition(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitDefinition(manifest.ctx, 'Name of other Trait', None)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)

        manifest.exhibits_traits.remove(trait)
        self.assertTrue(trait not in manifest.exhibits_traits)
        self.assertEqual(None, manifest._trait_cache)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.pop(1)
        self.assertEqual(None, manifest._trait_cache)

        self.assertEqual(1, len(manifest.exhibits_traits))
        self.assertEqual(other_trait, manifest.exhibits_traits[0].explicit_reference)

    @async_test
    def test_cdm_trait_collection_index_of(self):
        manifest = generate_manifest()

        trait = CdmTraitDefinition(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitDefinition(manifest.ctx, 'Name of other Trait', None)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)

        index = manifest.exhibits_traits.index(trait)
        self.assertEqual(0, index)
        index = manifest.exhibits_traits.index(other_trait)
        self.assertEqual(1, index)

        index = manifest.exhibits_traits.index(manifest.exhibits_traits[0])
        self.assertEqual(0, index)
        index = manifest.exhibits_traits.index(manifest.exhibits_traits[1])
        self.assertEqual(1, index)

        index = manifest.exhibits_traits.index('TraitName')
        self.assertEqual(0, index)
        index = manifest.exhibits_traits.index('Name of other Trait')
        self.assertEqual(1, index)

    @async_test
    def test_cdm_trait_collection_remove_only_from_property(self):
        manifest = generate_manifest()

        trait = CdmTraitReference(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitReference(manifest.ctx, 'Name of other Trait', None)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)

        self.assertFalse(trait.is_from_property)
        self.assertFalse(other_trait.is_from_property)

        self.assertEqual(2, len(manifest.exhibits_traits))
        manifest.exhibits_traits.remove(trait, True)
        self.assertTrue(trait in manifest.exhibits_traits)
        self.assertEqual(2, len(manifest.exhibits_traits))

        other_trait.is_from_property = True

        manifest.exhibits_traits.remove(other_trait, True)
        self.assertTrue(other_trait not in manifest.exhibits_traits)

        self.assertEqual(1, len(manifest.exhibits_traits))
        self.assertEqual(trait, manifest.exhibits_traits[0])

    @async_test
    def test_cdm_trait_collection_remove_prioritize_from_property(self):
        manifest = generate_manifest()

        trait = CdmTraitReference(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitReference(manifest.ctx, 'Name of other Trait', None)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)

        trait_copy_from_property = CdmTraitReference(manifest.ctx, 'TraitName', None)
        trait_copy_from_property.is_from_property = True
        manifest.exhibits_traits.append(trait_copy_from_property)

        self.assertEqual(3, len(manifest.exhibits_traits))
        manifest.exhibits_traits.remove('TraitName')
        self.assertTrue(trait_copy_from_property not in manifest.exhibits_traits)
        self.assertEqual(2, len(manifest.exhibits_traits))
        self.assertEqual(trait, manifest.exhibits_traits[0])
        self.assertEqual(other_trait, manifest.exhibits_traits[1])

    @async_test
    def test_cdm_trait_collection_remove_trait_definition_prioritize_from_property(self):
        manifest = generate_manifest()

        trait = CdmTraitDefinition(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitDefinition(manifest.ctx, 'Name of other Trait', None)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)
        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits[2].is_from_property = True
        manifest.exhibits_traits.append(other_trait)
        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits[4].is_from_property = True
        manifest.exhibits_traits.append(other_trait)
        self.assertEqual(6, len(manifest.exhibits_traits))

        self.assertTrue(manifest.exhibits_traits[2].is_from_property)

        manifest.exhibits_traits.remove(trait)
        self.assertEqual('TraitName', cast('CdmTraitDefinition', manifest.exhibits_traits[0].explicit_reference).trait_name)
        self.assertEqual('Name of other Trait', manifest.exhibits_traits[2].explicit_reference.trait_name)
        self.assertEqual('TraitName', manifest.exhibits_traits[3].explicit_reference.trait_name)

    @async_test
    def test_cdm_trait_collection_index_of_only_from_property(self):
        manifest = generate_manifest()

        trait = CdmTraitDefinition(manifest.ctx, 'TraitName', None)
        other_trait = CdmTraitDefinition(manifest.ctx, 'Name of other Trait', None)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)

        self.assertFalse(manifest.exhibits_traits[0].is_from_property)
        self.assertFalse(manifest.exhibits_traits[1].is_from_property)

        index = manifest.exhibits_traits.index(trait.trait_name, True)
        self.assertEqual(-1, index)

        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)
        manifest.exhibits_traits.append(trait)
        manifest.exhibits_traits.append(other_trait)

        self.assertEqual(6, len(manifest.exhibits_traits))
        manifest.exhibits_traits[2].is_from_property = True
        index = manifest.exhibits_traits.index(trait.trait_name, True)
        self.assertEqual(2, index)
        index = manifest.exhibits_traits.index(trait.trait_name)
        self.assertEqual(2, index)

    @async_test
    def test_cdm_trait_collection_clear(self):
        manifest = generate_manifest()

        manifest.exhibits_traits.append('trait1')
        manifest.exhibits_traits.append('trait2')
        manifest._trait_cache = dict()

        manifest.exhibits_traits.clear()
        self.assertEqual(0, len(manifest.exhibits_traits))
        self.assertEqual(None, manifest._trait_cache)
