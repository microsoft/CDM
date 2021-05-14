# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from unittest import TestCase

from typing import Optional

from cdm.enums import CdmStatusLevel, ImportsLoadStrategy
from cdm.objectmodel import CdmCorpusDefinition, CdmReferencedEntityDeclarationDefinition, CdmManifestDefinition
from cdm.resolvedmodel import ResolvedEntity
from cdm.storage import LocalAdapter
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions

from tests.common import TestHelper

"""
Common utilities used by resolution tests.
"""


class StringSpewCatcher:
    def __init__(self):
        self.content_lines = []

    def spew_line(self, spew: str):
        self.content_lines.append(spew + '\n')

    def get_content(self):
        return ''.join(self.content_lines)


async def resolve_environment(tests_sub_path: str, test_name: str, manifest_name: str) -> str:
    """
    Resolve the entities in the given manifest.
    :param tests_sub_path: Tests sub-folder name
    :param test_name: The name of the test. It is used to decide the path of input / output files.
    :param manifest_name: The name of the manifest to be used.
    :return:
    """
    test_input_path = TestHelper.get_input_folder_path(tests_sub_path, test_name)

    corpus = CdmCorpusDefinition()
    corpus.ctx.report_at_level = CdmStatusLevel.WARNING
    corpus.storage.mount('local', LocalAdapter(test_input_path))
    corpus.storage.default_namespace = 'local'

    manifest = await corpus.fetch_object_async('local:/{}.manifest.cdm.json'.format(manifest_name))
    directives = AttributeResolutionDirectiveSet({'normalized', 'referenceOnly'})
    return await list_all_resolved(corpus, directives, manifest, StringSpewCatcher())


async def resolve_save_debugging_file_and_assert(test_obj: any, tests_sub_path: str, test_name: str, manifest_name: str,
                                                 does_write_debugging_files: Optional[bool] = False):
    """
    Function used to test resolving an environment.
    Writes a helper function used for debugging.
    Asserts the result matches the expected result stored in a file.
    :param test_obj: Test object from which the function is being invoked
    :param tests_sub_path: Tests sub-folder name
    :param test_name: The name of the test. It is used to decide the path of input / output files.
    :param manifest_name: The name of the manifest to be used.
    :param does_write_debugging_files: Whether debugging files should be written or not.
    :return:
    """
    TestCase.assertIsNotNone(test_obj, test_name)
    result = (await resolve_environment(tests_sub_path, test_name, manifest_name))

    if does_write_debugging_files:
        TestHelper.write_actual_output_file_content(tests_sub_path, test_name, '{}.txt'.format(manifest_name), result)

    original = TestHelper.get_output_file_content(tests_sub_path, test_name, '{}.txt'.format(manifest_name))

    TestCase.assertTrue(test_obj, TestHelper.is_file_content_equality(result, original))


async def list_all_resolved(corpus, directives, manifest, spew):
    """
    Get the text version of all the resolved entities.
    :param corpus: The CDM corpus.
    :param directives: The directives to use while getting the resolved entities.
    :param manifest: The manifest to be resolved.
    :param spew: The object used to store the text to be returned.
    :return: The text version of the resolved entities. (it's in a form that facilitates debugging)
    """
    # make sure the corpus has a set of default artifact attributes
    await corpus._prepare_artifact_attributes_async()

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
                res_opt = ResolveOptions()
                res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD
                new_ent = await corpus.fetch_object_async(corpus_path, res_opt=res_opt)
                res_opt.wrt_doc = new_ent.in_document
                res_opt.directives = directives
                res_ent = ResolvedEntity(res_opt, new_ent)

                res_ent.spew(res_opt, spew, ' ', True)

        if f.sub_manifests:
            for sub_manifest in f.sub_manifests:
                corpus_path = corpus.storage.create_absolute_corpus_path(sub_manifest.definition, f)
                await seek_entities(await corpus.fetch_object_async(corpus_path))

    await seek_entities(manifest)

    return spew.get_content()
