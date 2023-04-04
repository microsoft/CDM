# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import json
import os
import unittest
from typing import cast

from cdm.enums import CdmStatusLevel, CdmLogCode, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition, CdmReferencedEntityDeclarationDefinition
from cdm.objectmodel.cdm_entity_def import CdmEntityDefinition
from cdm.objectmodel.cdm_local_entity_declaration_def import CdmLocalEntityDeclarationDefinition
from cdm.objectmodel.cdm_type_attribute_def import CdmTypeAttributeDefinition
from cdm.persistence import PersistenceLayer
from cdm.resolvedmodel.trait_profile import TraitProfile, TraitProfileCache
from cdm.storage import LocalAdapter
from cdm.utilities.resolve_options import ResolveOptions

from tests.common import async_test, TestHelper


class TraitProfileTest(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Resolution', 'TraitProfileTest')

    # get profiles for entities and attributes of entities in manifest.
    # leave profiles in 'deep' form
    # no shared cache
    @async_test
    async def test_original_profile_no_cache(self):
        await self.dump_and_validate_profiles(False, False)

    # get profiles for entities and attributes of entities in manifest.
    # leave profiles in 'deep' form
    # use a shared cache of profile objects for all
    @async_test
    async def test_consolidate_profile_no_cache(self):
        await self.dump_and_validate_profiles(True, False)

    # get profiles for entities and attributes of entities in manifest.
    # consolidate the profiles
    # no shared cache
    @async_test
    async def test_original_profile_shared_cache(self):
        await self.dump_and_validate_profiles(False, True)

    # get profiles for entities and attributes of entities in manifest.
    # consolidate the profiles
    # use a shared cache of profile objects for all
    @async_test
    async def test_consolidate_profile_shared_cache(self):
        await self.dump_and_validate_profiles(True, True)

    async def dump_and_validate_profiles(self, consolidate: bool, shared_cache: bool):

        cdm_corpus = TestHelper.get_local_corpus(TraitProfileTest.tests_subpath, "ConsCache")

        src_manifest = await cdm_corpus.fetch_object_async("local:/miniContact.manifest.cdm.json") # type: CdmManifestDefinition
        res_manifest = await src_manifest.create_resolved_manifest_async("_miniContact", "_{n}.cdm.json")

        profile_cache = None # type: TraitProfileCache
        if shared_cache:
            profil_cache = TraitProfileCache()

        all_profiles = "{"
        for ent_dec in res_manifest.entities:
            loc_ent_dec = ent_dec # type: CdmLocalEntityDeclarationDefinition
            ent_def = await cdm_corpus.fetch_object_async(loc_ent_dec.entity_path, res_manifest) # type: CdmEntityDefinition
            res_opt = ResolveOptions(ent_def)

            ent_trait_infos = ent_def.fetch_trait_profiles(res_opt, profile_cache)
            if consolidate:
                ent_trait_infos = TraitProfile.consolidate_list(ent_trait_infos, profile_cache)
            ent_profile_dump = "[{}]".format(",".join([inf.encode() for inf in ent_trait_infos]))

            att_profiles = ""

            for att in ent_def.attributes:
                if isinstance(att, CdmTypeAttributeDefinition):
                    att_def = att # type: CdmTypeAttributeDefinition
                    att_trait_infos = att_def.fetch_trait_profiles(res_opt, profile_cache)
                    if consolidate:
                        att_trait_infos = TraitProfile.consolidate_list(att_trait_infos)
                    att_profile_dump = "[{}]".format(",".join([inf.encode() for inf in att_trait_infos]))
                att_profiles += '{}"{}":{}'.format(("" if att_profiles == "" else ","), att_def.name, att_profile_dump)
            all_profiles += '{}"{}":{{"entityProfile":{}, "attProfiles":{{ {} }} }}'.format(("" if all_profiles == "{" else ","), ent_def.entity_name, ent_profile_dump, att_profiles)
        all_profiles += "}"

        out_name = "ProfileDump{}{}.json".format("Cons" if consolidate else "", "Cache" if shared_cache else "")
        TestHelper.write_actual_output_file_content(TraitProfileTest.tests_subpath, "ConsCache", out_name, all_profiles)

        ref_profiles = TestHelper.get_expected_output_data(TraitProfileTest.tests_subpath, "ConsCache", out_name)

        TestHelper.compare_same_object(all_profiles, ref_profiles)
                

