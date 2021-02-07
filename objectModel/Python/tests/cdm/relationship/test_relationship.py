# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
import os

from cdm.enums import CdmObjectType, CdmRelationshipDiscoveryStyle
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper


def match_relationship(rel1, rel2):
    return rel1.get('fromEntity') == rel2.from_entity and rel1.get('fromEntityAttribute') == rel2.from_entity_attribute \
        and rel1.get('toEntity') == rel2.to_entity and rel1.get('toEntityAttribute') == rel2.to_entity_attribute \
        and ('name' in rel1 and (rel1.get('name') == rel2.relationship_name) or (not rel1.get('name') and not rel2.relationship_name))


class RelationshipTest(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Relationship')

    @async_test
    async def test_calculate_relationships_and_populate_manifests(self):
        test_name = 'test_calculate_relationships_and_populate_manifests'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        root_manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')
        sub_manifest = await corpus.fetch_object_async(root_manifest.sub_manifests[0].definition)

        await corpus.calculate_entity_graph_async(root_manifest)
        await root_manifest.populate_manifest_relationships_async()

        expected_all_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedAllManifestRels.json')
        expected_all_sub_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedAllSubManifestRels.json')

        self.verify_relationships(root_manifest, expected_all_manifest_rels)
        self.verify_relationships(sub_manifest, expected_all_sub_manifest_rels)

    @async_test
    async def test_calculate_relationships_and_populate_manifest_with_exclusive_flag(self):
        test_name = 'test_calculate_relationships_and_populate_manifests'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        root_manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')
        sub_manifest = await corpus.fetch_object_async(root_manifest.sub_manifests[0].definition)

        await corpus.calculate_entity_graph_async(root_manifest)
        # make sure only relationships where to and from entities are in the manifest are found with the 'exclusive' option is passed in
        await root_manifest.populate_manifest_relationships_async(CdmRelationshipDiscoveryStyle.EXCLUSIVE)

        expected_exclusive_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedExclusiveManifestRels.json')
        expected_exclusive_sub_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedExclusiveSubManifestRels.json')

        self.verify_relationships(root_manifest, expected_exclusive_manifest_rels)
        self.verify_relationships(sub_manifest, expected_exclusive_sub_manifest_rels)

    @async_test
    async def test_calculate_relationships_and_populate_manifest_with_none_flag(self):
        test_name = 'test_calculate_relationships_and_populate_manifests'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        root_manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')
        sub_manifest = await corpus.fetch_object_async(root_manifest.sub_manifests[0].definition)

        await corpus.calculate_entity_graph_async(root_manifest)
        # make sure no relationships are added when 'none' relationship option is passed in
        await root_manifest.populate_manifest_relationships_async(CdmRelationshipDiscoveryStyle.NONE)

        self.assertEqual(len(root_manifest.relationships), 0)
        self.assertEqual(len(sub_manifest.relationships), 0)

    @async_test
    async def test_calculate_relationships_on_resolved_entities(self):
        test_name = 'test_calculate_relationships_on_resolved_entities'
        expected_resolved_exc_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedResolvedExcManifestRels.json')
        expected_resolved_exc_sub_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedResolvedExcSubManifestRels.json')
        expected_resolved_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedResolvedManifestRels.json')
        expected_resolved_sub_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedResolvedSubManifestRels.json')

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        root_manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        resolved_manifest = await RelationshipTest.load_and_resolve_manifest(corpus, root_manifest, '-resolved')
        sub_manifest_path = corpus.storage.create_absolute_corpus_path(resolved_manifest.sub_manifests[0].definition)
        sub_manifest = await corpus.fetch_object_async(sub_manifest_path)

        # using createResolvedManifest will only populate exclusive relationships
        self.verify_relationships(resolved_manifest, expected_resolved_exc_manifest_rels)
        self.verify_relationships(sub_manifest, expected_resolved_exc_sub_manifest_rels)

        # check that each relationship has been created correctly with the all flag
        await resolved_manifest.populate_manifest_relationships_async()
        await sub_manifest.populate_manifest_relationships_async()
        self.verify_relationships(resolved_manifest, expected_resolved_manifest_rels)
        self.verify_relationships(sub_manifest, expected_resolved_sub_manifest_rels)

        # it is not enough to check if the relationships are correct.
        # We need to check if the incoming and outgoing relationships are
        # correct as well. One being correct can cover up the other being wrong

        # A
        a_ent = await corpus.fetch_object_async(resolved_manifest.entities[0].entity_path, resolved_manifest)
        a_in_rels = corpus.fetch_incoming_relationships(a_ent)
        a_out_rels = corpus.fetch_outgoing_relationships(a_ent)
        self.assertEqual(len(a_in_rels), 0)
        self.assertEqual(len(a_out_rels), 1)
        self.assertEqual(a_out_rels[0].from_entity, 'local:/A-resolved.cdm.json/A')
        self.assertEqual(a_out_rels[0].to_entity, 'local:/B-resolved.cdm.json/B')

        # B
        b_ent = await corpus.fetch_object_async(resolved_manifest.entities[1].entity_path, resolved_manifest)
        b_in_rels = corpus.fetch_incoming_relationships(b_ent)
        b_out_rels = corpus.fetch_outgoing_relationships(b_ent)
        self.assertEqual(len(b_in_rels), 2)
        self.assertEqual(b_in_rels[0].from_entity, 'local:/A-resolved.cdm.json/A')
        self.assertEqual(b_in_rels[0].to_entity, 'local:/B-resolved.cdm.json/B')
        self.assertEqual(b_in_rels[1].from_entity, 'local:/sub/C-resolved.cdm.json/C')
        self.assertEqual(b_in_rels[1].to_entity, 'local:/B-resolved.cdm.json/B')
        self.assertEqual(len(b_out_rels), 0)

        # C
        c_ent = await corpus.fetch_object_async(sub_manifest.entities[0].entity_path, sub_manifest)
        c_in_rels = corpus.fetch_incoming_relationships(c_ent)
        c_out_rels = corpus.fetch_outgoing_relationships(c_ent)
        self.assertEqual(len(c_in_rels), 0)
        self.assertEqual(len(c_out_rels), 2)
        self.assertEqual(c_out_rels[0].from_entity, 'local:/sub/C-resolved.cdm.json/C')
        self.assertEqual(c_out_rels[0].to_entity, 'local:/B-resolved.cdm.json/B')
        self.assertEqual(c_out_rels[1].from_entity, 'local:/sub/C-resolved.cdm.json/C')
        self.assertEqual(c_out_rels[1].to_entity, 'local:/sub/D-resolved.cdm.json/D')

        # D
        d_ent = await corpus.fetch_object_async(sub_manifest.entities[1].entity_path, sub_manifest)
        d_in_rels = corpus.fetch_incoming_relationships(d_ent)
        d_out_rels = corpus.fetch_outgoing_relationships(d_ent)
        self.assertEqual(len(d_in_rels), 1)
        self.assertEqual(d_in_rels[0].from_entity, 'local:/sub/C-resolved.cdm.json/C')
        self.assertEqual(d_in_rels[0].to_entity, 'local:/sub/D-resolved.cdm.json/D')
        self.assertEqual(len(d_out_rels), 0)

        # E
        e_ent = await corpus.fetch_object_async(resolved_manifest.entities[2].entity_path, resolved_manifest)
        e_in_rels = corpus.fetch_incoming_relationships(e_ent)
        e_out_rels = corpus.fetch_outgoing_relationships(e_ent)
        self.assertEqual(len(e_in_rels), 1)
        self.assertEqual(e_in_rels[0].from_entity, 'local:/sub/F-resolved.cdm.json/F')
        self.assertEqual(e_in_rels[0].to_entity, 'local:/E-resolved.cdm.json/E')
        self.assertEqual(len(e_out_rels), 0)

        # F
        f_ent = await corpus.fetch_object_async(sub_manifest.entities[2].entity_path, sub_manifest)
        f_in_rels = corpus.fetch_incoming_relationships(f_ent)
        f_out_rels = corpus.fetch_outgoing_relationships(f_ent)
        self.assertEqual(len(f_in_rels), 0)
        self.assertEqual(len(f_out_rels), 1)
        self.assertEqual(f_out_rels[0].from_entity, 'local:/sub/F-resolved.cdm.json/F')
        self.assertEqual(f_out_rels[0].to_entity, 'local:/E-resolved.cdm.json/E')

    @async_test
    async def test_calculate_relationships_for_selects_one_attribute(self):
        test_name = 'test_calculate_relationships_for_selects_one_attribute'
        expected_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedRels.json')

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        corpus.storage.mount('cdm', LocalAdapter(TestHelper.get_schema_docs_root()))

        manifest = await corpus.fetch_object_async('local:/selectsOne.manifest.cdm.json')  # type: CdmManifestDefinition

        await corpus.calculate_entity_graph_async(manifest)
        await manifest.populate_manifest_relationships_async()

        # check that each relationship has been created correctly
        self.verify_relationships(manifest, expected_rels)

    @async_test
    async def test_relationships_entity_and_document_name_different(self):
        test_name = 'test_relationships_entity_and_document_name_different'
        expected_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedRels.json')

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        manifest = await corpus.fetch_object_async('local:/main.manifest.cdm.json')  # type: CdmManifestDefinition

        await corpus.calculate_entity_graph_async(manifest)
        await manifest.populate_manifest_relationships_async()

        # check that each relationship has been created correctly
        self.verify_relationships(manifest, expected_rels)

    @async_test
    async def test_relationship_to_multiple_entities(self):
        test_name = 'test_relationship_to_multiple_entities'
        expected_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedRels.json')

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        manifest = await corpus.fetch_object_async('local:/main.manifest.cdm.json')  # type: CdmManifestDefinition

        await corpus.calculate_entity_graph_async(manifest)
        await manifest.populate_manifest_relationships_async()

        # check that each relationship has been created correctly
        self.verify_relationships(manifest, expected_rels)

    def verify_relationships(self, manifest: 'CdmManifestDefinition', expected_relationships):
        self.assertEqual(len(manifest.relationships), len(expected_relationships))

        for expected_rel in expected_relationships:
            found = list(filter(lambda x: match_relationship(expected_rel, x), manifest.relationships))
            self.assertEqual(len(found), 1)

    @staticmethod
    async def load_and_resolve_manifest(corpus: 'CdmCorpusDefinition', manifest: 'CdmManifestDefinition', rename_suffix: str) -> 'CdmManifestDefinition':
        print('Resolving manifest ' + manifest.manifest_name + ' ...')
        resolved_manifest = await manifest.create_resolved_manifest_async(manifest.manifest_name + rename_suffix, '{n}-resolved.cdm.json')

        for sub_manifest_decl in manifest.sub_manifests:
            sub_manifest = await corpus.fetch_object_async(sub_manifest_decl.definition, manifest)
            resolved_sub_manifest = await RelationshipTest.load_and_resolve_manifest(corpus, sub_manifest, rename_suffix)

            resolved_decl = corpus.make_object(CdmObjectType.MANIFEST_DECLARATION_DEF, resolved_sub_manifest.manifest_name)
            resolved_decl.definition = corpus.storage.create_relative_corpus_path(resolved_sub_manifest.at_corpus_path, resolved_manifest)

            resolved_manifest.sub_manifests.append(resolved_decl)

        return resolved_manifest
