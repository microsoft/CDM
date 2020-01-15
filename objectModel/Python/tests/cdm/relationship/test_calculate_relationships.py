
import unittest
import os

from cdm.enums import CdmObjectType, CdmRelationshipDiscoveryStyle

from tests.common import async_test, TestHelper


def match_relationship(rel1, rel2):
    return rel1.get('fromEntity') == rel2.from_entity and rel1.get('fromEntityAttribute') == rel2.from_entity_attribute \
        and rel1.get('toEntity') == rel2.to_entity and rel1.get('toEntityAttribute') == rel2.to_entity_attribute


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

        self.assertEqual(len(root_manifest.relationships), 5)
        self.assertEqual(len(sub_manifest.relationships), 7)

        expected_all_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedAllManifestRels.json')
        expected_all_sub_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedAllSubManifestRels.json')

        for expected_rel in expected_all_manifest_rels:
            found = list(filter(lambda x: match_relationship(expected_rel, x), root_manifest.relationships))
            self.assertEqual(len(found), 1)

        for expected_rel in expected_all_sub_manifest_rels:
            found = list(filter(lambda x: match_relationship(expected_rel, x), sub_manifest.relationships))
            self.assertEqual(len(found), 1)

    @async_test
    async def test_calculate_relationships_and_populate_manifest_with_exclusive_flag(self):
        test_name = 'test_calculate_relationships_and_populate_manifests'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        root_manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')
        sub_manifest = await corpus.fetch_object_async(root_manifest.sub_manifests[0].definition)

        await corpus.calculate_entity_graph_async(root_manifest)
        # make sure only relationships where to and from entities are in the manifest are found with the 'exclusive' option is passed in
        await root_manifest.populate_manifest_relationships_async(CdmRelationshipDiscoveryStyle.EXCLUSIVE)

        self.assertEqual(len(root_manifest.relationships), 3)
        self.assertEqual(len(sub_manifest.relationships), 3)

        expected_exclusive_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedExclusiveManifestRels.json')
        expected_exclusive_sub_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedExclusiveSubManifestRels.json')

        for expected_rel in expected_exclusive_manifest_rels:
            found = list(filter(lambda x: match_relationship(expected_rel, x), root_manifest.relationships))
            self.assertEqual(len(found), 1)

        for expected_rel in expected_exclusive_sub_manifest_rels:
            found = list(filter(lambda x: match_relationship(expected_rel, x), sub_manifest.relationships))
            self.assertEqual(len(found), 1)

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
        expected_resolved_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedResolvedManifestRels.json')
        expected_resolved_sub_manifest_rels = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'expectedResolvedSubManifestRels.json')

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        root_manifest = await corpus.fetch_object_async('local:/default.manifest.cdm.json')

        resolved_manifest = await RelationshipTest.load_and_resolve_manifest(corpus, root_manifest, '-resolved')
        sub_manifest_path = corpus.storage.create_absolute_corpus_path(resolved_manifest.sub_manifests[0].definition)
        sub_manifest = await corpus.fetch_object_async(sub_manifest_path)

        # using createResolvedManifest will only populate exclusive relationships
        self.assertEqual(len(resolved_manifest.relationships), len(expected_resolved_manifest_rels))
        self.assertEqual(len(sub_manifest.relationships), len(expected_resolved_sub_manifest_rels))

        # check that each relationship has been created correctly
        for expected_rel in expected_resolved_manifest_rels:
            found = list(filter(lambda x: match_relationship(expected_rel, x), resolved_manifest.relationships))
            self.assertEqual(len(found), 1)

        for expected_sub_rel in expected_resolved_sub_manifest_rels:
            found = list(filter(lambda x: match_relationship(expected_sub_rel, x), sub_manifest.relationships))
            self.assertEqual(len(found), 1)

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
        self.assertEqual(len(b_in_rels), 1)
        self.assertEqual(b_in_rels[0].from_entity, 'local:/A-resolved.cdm.json/A')
        self.assertEqual(b_in_rels[0].to_entity, 'local:/B-resolved.cdm.json/B')
        self.assertEqual(len(b_out_rels), 0)

        # C
        c_ent = await corpus.fetch_object_async(sub_manifest.entities[0].entity_path, sub_manifest)
        c_in_rels = corpus.fetch_incoming_relationships(c_ent)
        c_out_rels = corpus.fetch_outgoing_relationships(c_ent)
        self.assertEqual(len(c_in_rels), 0)
        self.assertEqual(len(c_out_rels), 2)
        self.assertEqual(c_out_rels[0].from_entity, 'local:/sub/C-resolved.cdm.json/C')
        # TODO: this should point to the resolved entity, currently an open bug
        self.assertEqual(c_out_rels[0].to_entity, 'local:/B.cdm.json/B')
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
