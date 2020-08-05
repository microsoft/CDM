# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import Optional

from cdm.enums import CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition, CdmReferencedEntityDeclarationDefinition, CdmManifestDefinition
from cdm.resolvedmodel import ResolvedEntity
from cdm.storage import LocalAdapter
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
    async def test_resolve_test_corpus(self):
        self.assertTrue(os.path.exists(TestHelper.get_schema_docs_root()))

        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_schema_docs_root()))
        manifest = await corpus.fetch_object_async(TestHelper.cdm_standards_schema_path)  # type: CdmManifestDefinition
        directives = AttributeResolutionDirectiveSet({'referenceOnly', 'normalized'})
        all_resolved = await self.list_all_resolved(corpus, directives, manifest, StringSpewCatcher())
        self.assertNotEqual(all_resolved, '')

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
    async def test_resolved_pov_resolution(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_pov_resolution', 'POVResolution')

    @async_test
    async def test_resolved_web_clicks(self):
        await self.resolve_save_debugging_file_and_assert('test_resolved_web_clicks', 'webClicks')

    @async_test
    async def test_resolve_with_extended(self):
        cdmCorpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_resolve_with_extended')

        def callback(status_level: 'CdmStatusLevel', message: str):
            self.assertTrue('unable to resolve the reference' not in message)
        cdmCorpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        ent = await cdmCorpus.fetch_object_async('local:/sub/Account.cdm.json/Account')  # type: CdmEntityDefinition
        res_opt = ResolveOptions(ent.in_document)
        await ent.create_resolved_entity_async('Account_', res_opt)

    @async_test
    async def test_attributes_that_are_replaced(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_attributes_that_are_replaced')
        corpus.storage.mount('cdm', LocalAdapter(TestHelper.get_schema_docs_root()))

        extended_entity = await corpus.fetch_object_async('local:/extended.cdm.json/extended')  # type: CdmEntityDefinition
        res_extended_ent = await extended_entity.create_resolved_entity_async('resExtended')

        # the attribute from the base class should be merged with the attribute
        # from the extended class into a single attribute
        self.assertEqual(1, len(res_extended_ent.attributes))

        # check that traits from the base class merged with the traits from the extended class
        attribute = res_extended_ent.attributes[0]
        # base trait
        self.assertNotEqual(-1, attribute.applied_traits.index('means.identity.brand'))
        # extended trait
        self.assertNotEqual(-1, attribute.applied_traits.index('means.identity.company.name'))

        # make sure the attribute context and entity foreign key were maintained correctly
        foreign_key_for_base_attribute = res_extended_ent.attribute_context.contents[1].contents[1]
        self.assertEqual('_generatedAttributeSet', foreign_key_for_base_attribute.name)

        fk_reference = foreign_key_for_base_attribute.contents[0].contents[0].contents[0]  # type: CdmAttributeReference
        self.assertEqual('resExtended/hasAttributes/regardingObjectId', fk_reference.named_reference)

    @async_test
    async def test_resolved_attribute_limit(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_resolved_attribute_limit')  # type: CdmCorpusDefinition

        main_entity = await corpus.fetch_object_async('local:/mainEntity.cdm.json/mainEntity')  # type: CdmEntityDefinition
        res_opt = ResolveOptions(wrt_doc=main_entity.in_document)

        # if attribute limit is reached, entity should be None
        res_opt._resolved_attribute_limit = 4
        resEnt = await main_entity.create_resolved_entity_async('{}_zeroAtts'.format(main_entity.entity_name), res_opt)  # type: CdmEntityDefinition
        self.assertIsNone(resEnt)

        # when the attribute limit is set to null, there should not be a limit on the possible number of attributes
        res_opt._resolved_attribute_limit = None
        ras = main_entity._fetch_resolved_attributes(res_opt)  # type: ResolvedAttributeSet
        resEnt = await main_entity.create_resolved_entity_async('{}_normalized_referenceOnly'.format(main_entity.entity_name), res_opt)

        # there are 5 total attributes
        self.assertEqual(5, ras._resolved_attribute_count)
        self.assertEqual(5, len(ras._set))
        self.assertEqual(3, len(main_entity.attributes))
        # there are 2 attributes grouped in an entity attribute
        # and 2 attributes grouped in an attribute group
        self.assertEqual(2, len(main_entity.attributes[2].explicit_reference.members))

        # using the default limit number
        res_opt = ResolveOptions(wrt_doc=main_entity.in_document)
        ras = main_entity._fetch_resolved_attributes(res_opt)
        resEnt = await main_entity.create_resolved_entity_async('{}_normalized_referenceOnly'.format(main_entity.entity_name), res_opt)

        # there are 5 total attributes
        self.assertEqual(5, ras._resolved_attribute_count)
        self.assertEqual(5, len(ras._set))
        self.assertEqual(3, len(main_entity.attributes))
        # there are 2 attributes grouped in an entity attribute
        # and 2 attributes grouped in an attribute group
        self.assertEqual(2, len(main_entity.attributes[2].explicit_reference.members))

        res_opt.directives = AttributeResolutionDirectiveSet({'normalized', 'structured'})
        ras = main_entity._fetch_resolved_attributes(res_opt)
        resEnt = await main_entity.create_resolved_entity_async('{}_normalized_structured'.format(main_entity.entity_name), res_opt)

        # there are 5 total attributes
        self.assertEqual(5, ras._resolved_attribute_count)
        # the attribute count is different because one attribute is a group that contains two different attributes
        self.assertEqual(4, len(ras._set))
        self.assertEqual(3, len(main_entity.attributes))
        # again there are 2 attributes grouped in an entity attribute
        # and 2 attributes grouped in an attribute group
        self.assertEqual(2, len(main_entity.attributes[2].explicit_reference.members))

    @async_test
    async def test_setting_traits_for_resolution_guidance_attributes(self):
        '''
        Test that "is.linkedEntity.name" and "is.linkedEntity.identifier" traits are set when "selectedTypeAttribute" and "foreignKeyAttribute"
        are present in the entity's resolution guidance.
        '''
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_setting_traits_for_resolution_guidance_attributes')  # type: CdmCorpusDefinition
        entity = await corpus.fetch_object_async('local:/Customer.cdm.json/Customer')  # type: CdmEntityDefinition

        # Resolve with default directives to get "is.linkedEntity.name" trait.
        res_opt = ResolveOptions(wrt_doc=entity.in_document)
        resolved_entity = await entity.create_resolved_entity_async('resolved', res_opt)

        self.assertEqual('is.linkedEntity.name', resolved_entity.attributes[1].applied_traits[7].named_reference)

        # Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
        res_opt = ResolveOptions(wrt_doc=entity.in_document)
        res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly'})
        resolved_entity = await entity.create_resolved_entity_async('resolved2', res_opt)

        self.assertEqual('is.linkedEntity.identifier', resolved_entity.attributes[0].applied_traits[7].named_reference)

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
