import os
import unittest

from cdm.objectmodel import CdmCorpusDefinition, CdmReferencedEntityDeclarationDefinition
from cdm.resolvedmodel import ResolvedEntity
from cdm.storage import LocalAdapter
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions

from tests.common import async_test

ROOT_PATH = os.path.join('tests', 'testdata', 'cdm', 'resolution')
OUTPUT_DIR = 'test_output'
INPUT_DIR = os.path.join(ROOT_PATH, 'resolvedentities')

TEST_ADAPTER_ROOT = os.path.join(ROOT_PATH, 'corpus')
SCHEMA_ADAPTER_ROOT = os.path.join('..', 'CDM.SchemaDocuments')


class StringSpewCatcher:
    def __init__(self):
        self.content_lines = []

    def spew_line(self, spew: str):
        self.content_lines.append(spew + '\n')

    def get_content(self):
        return ''.join(self.content_lines)


def get_and_save_test_data(file_name, data, should_save=False):
    if should_save:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        output_path = os.path.join(OUTPUT_DIR, file_name)
        with open(output_path, 'w') as result_file:
            result_file.write(data)

    input_path = os.path.join(INPUT_DIR, file_name)
    with open(input_path, 'r') as input_file:
        return input_file.read()


class EntityResolution(unittest.TestCase):
    @async_test
    @unittest.skip('Requires update of standards.txt file')
    async def test_resolve_test_corpus(self):
        test_name = 'standards'
        result = (await self.resolve_environment(test_name, SCHEMA_ADAPTER_ROOT)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    @async_test
    async def test_compare_resolved_composites(self):
        test_name = 'composites'
        result = (await self.resolve_environment(test_name)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    @async_test
    async def test_compare_resolved_e2e(self):
        test_name = 'E2EResolution'
        result = (await self.resolve_environment(test_name)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    @async_test
    async def test_compare_resolved_knowldge_graph(self):
        test_name = 'KnowledgeGraph'
        result = (await self.resolve_environment(test_name)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    @async_test
    async def test_compare_resolved_mini_dyn(self):
        test_name = 'MiniDyn'
        result = (await self.resolve_environment(test_name)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    @async_test
    async def test_compare_resolved_overrides(self):
        test_name = 'overrides'
        result = (await self.resolve_environment(test_name)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    @async_test
    async def test_compare_pov_resolution(self):
        test_name = 'POVResolution'
        result = (await self.resolve_environment(test_name)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    @async_test
    async def test_compare_web_clicks(self):
        test_name = 'webClicks'
        result = (await self.resolve_environment(test_name)).replace('\r\n', '\n')
        expected = get_and_save_test_data(test_name + '.txt', result, True)

        self.assertEqual(expected, result)

    async def resolve_environment(self, environment: str, storage_adapter_root=TEST_ADAPTER_ROOT):
        corpus = CdmCorpusDefinition()
        adapter = LocalAdapter(root=storage_adapter_root)
        corpus.storage.mount('local', adapter)

        print('reading source files')

        manifest = await corpus.fetch_object_async('local:/{}.manifest.cdm.json'.format(environment))
        directives = AttributeResolutionDirectiveSet(set(['normalized', 'referenceOnly']))
        return await self.list_all_resolved(corpus, directives, manifest, StringSpewCatcher())

    async def list_all_resolved(self, corpus, directives, manifest, spew):
        async def seek_entities(f: 'CdmManifestDefinition'):
            if f.entities is not None:
                spew.spew_line(f.folder_path)

                for entity in f.entities:
                    ent = entity
                    current_file = f
                    while isinstance(ent, CdmReferencedEntityDeclarationDefinition):
                        ent = await corpus.fetch_object_async(ent.entity_path, current_file)
                        current_file = ent

                    new_ent = await corpus.fetch_object_async(ent.entity_path, current_file)
                    res_opt = ResolveOptions(wrt_doc=new_ent.in_document, directives=directives)
                    res_ent = ResolvedEntity(res_opt, new_ent)

                    res_ent.spew(res_opt, spew, ' ', True)

            if f.sub_manifests:
                for sub_manifest in f.sub_manifests:
                    await seek_entities(await corpus.fetch_object_async(sub_manifest.definition, f))

        await seek_entities(manifest)

        return spew.get_content()
