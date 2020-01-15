import os
import unittest
from typing import Optional

from cdm.enums import CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition, CdmReferencedEntityDeclarationDefinition
from cdm.resolvedmodel import ResolvedEntity
from cdm.storage import LocalAdapter
from cdm.enums import CdmStatusLevel
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions

from tests.common import async_test, TestHelper


class StringSpewCatcher:
    def __init__(self):
        self.content_lines = []

    def spew_line(self, spew: str):
        self.content_lines.append(spew + '\n')

    def get_content(self):
        return ''.join(self.content_lines)


class EntityResolution(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Resolution', 'EntityResolution')

    @async_test
    async def test_resolved_composites(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_composites', 'composites')

    @async_test
    async def test_resolved_e2e(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_e2e', 'E2EResolution')

    @async_test
    async def test_resolved_knowledge_graph(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_knowledge_graph', 'KnowledgeGraph')

    @async_test
    async def test_resolved_mini_dyn(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_mini_dyn', 'MiniDyn')

    @async_test
    async def test_resolved_overrides(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_overrides', 'overrides')

    @async_test
    async def test_resolved_pov(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_pov', 'POVResolution')

    @async_test
    async def test_resolved_web_clicks(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_web_clicks', 'webClicks')

    async def resolve_environment(self, test_name: str, environment: str) -> str:
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, test_name)

        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        print('reading source files')

        manifest = await corpus.fetch_object_async('local:/{}.manifest.cdm.json'.format(environment))
        directives = AttributeResolutionDirectiveSet(set(['normalized', 'referenceOnly']))
        return await self.list_all_resolved(corpus, directives, manifest, StringSpewCatcher())

    async def resolve_save_debugging_file_and_assert(self, test_name: str, manifest_name: str, should_save: Optional[bool] = False):
        self.assertIsNotNone(test_name)
        result = (await self.resolve_environment(test_name, manifest_name))

        if should_save:
            TestHelper.write_actual_output_file_content(self.tests_subpath, test_name, '{}.txt'.format(manifest_name), result)

        original = TestHelper.get_output_file_content(self.tests_subpath, test_name, '{}.txt'.format(manifest_name))

        self.assertTrue(TestHelper.is_file_content_equality(result, original))

    async def list_all_resolved(self, corpus, directives, manifest, spew):
        async def seek_entities(f: 'CdmManifestDefinition'):
            if f.entities is not None:
                spew.spew_line(f.folder_path)

                for entity in f.entities:
                    ent = entity
                    current_file = f
                    while isinstance(ent, CdmReferencedEntityDeclarationDefinition):
                        corpus_path = corpus.storage.create_absolute_corpus_path(ent.entity_path, current_file)
                        ent = await corpus.fetch_object_async(corpus_path)
                        current_file = ent

                    corpus_path = corpus.storage.create_absolute_corpus_path(ent.entity_path, current_file)
                    new_ent = await corpus.fetch_object_async(corpus_path)
                    res_opt = ResolveOptions(wrt_doc=new_ent.in_document, directives=directives)
                    res_ent = ResolvedEntity(res_opt, new_ent)

                    res_ent.spew(res_opt, spew, ' ', True)

            if f.sub_manifests:
                for sub_manifest in f.sub_manifests:
                    corpus_path = corpus.storage.create_absolute_corpus_path(sub_manifest.definition, f)
                    await seek_entities(await corpus.fetch_object_async(corpus_path))

        await seek_entities(manifest)

        return spew.get_content()
