# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition


class ManifestDefinitionTests(unittest.TestCase):
    def test_manifest_copy(self):
        """Tests if the copy function creates copies of the sub objects"""

        corpus = CdmCorpusDefinition()
        manifest = CdmManifestDefinition(corpus.ctx, 'name')

        entity_name = 'entity'
        sub_manifest_name = 'sub_manifest'
        relationship_name = 'relName'
        trait_name = 'traitName'

        entity_dec = manifest.entities.append(entity_name)
        sub_manifest = manifest.sub_manifests.append(sub_manifest_name)
        relationship = manifest.relationships.append(relationship_name)
        trait = manifest.exhibits_traits.append(trait_name)

        copy = manifest.copy()  # type: CdmManifestDefinition
        copy.entities[0].entity_name = 'newEntity'
        copy.sub_manifests[0].manifest_name = 'newSubManifest'
        copy.relationships[0].name = 'newRelName'
        copy.exhibits_traits[0].named_reference = 'newTraitName'


        self.assertEquals(entity_name, entity_dec.entity_name)
        self.assertEquals(sub_manifest_name, sub_manifest.manifest_name)
        self.assertEquals(relationship_name, relationship.name)
        self.assertEquals(trait_name, trait.named_reference)
