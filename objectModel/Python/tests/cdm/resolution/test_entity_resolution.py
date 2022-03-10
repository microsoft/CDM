# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
from typing import TYPE_CHECKING
import unittest
from cdm.objectmodel.cdm_document_def import CdmDocumentDefinition
from cdm.objectmodel.cdm_entity_attribute_def import CdmEntityAttributeDefinition
from cdm.objectmodel.cdm_entity_ref import CdmEntityReference

from tests.cdm.projection.attribute_context_util import AttributeContextUtil

from tests.utilities.projection_test_utils import ProjectionTestUtils

from cdm.enums import CdmStatusLevel, CdmLogCode
from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition, CdmEntityDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions
from .resolution_test_utils import StringSpewCatcher, list_all_resolved, resolve_save_debugging_file_and_assert

from tests.common import async_test, TestHelper

if TYPE_CHECKING:
    from cdm.objectmodel import CdmFolderDefinition


class EntityResolution(unittest.TestCase):
    tests_sub_path = os.path.join('Cdm', 'Resolution', 'EntityResolutionTest')

    @async_test
    async def test_owner_not_changed(self):
        """Tests if the owner of the entity is not changed when calling created_resolved_entity_async"""

        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'TestOwnerNotChanged')

        entity = await corpus.fetch_object_async('local:/Entity.cdm.json/Entity')  # type: CdmEntityDefinition
        document = await corpus.fetch_object_async('local:/Entity.cdm.json')

        self.assertEqual(document, entity.owner)

        await entity.create_resolved_entity_async('res-Entity')

        self.assertEqual(document, entity.owner)
        self.assertEqual(entity, entity.attributes[0].owner,
                         'Entity\'s attribute\'s owner should have remained unchanged (same as the owning entity)')

    @async_test
    async def test_ent_ref_nonexistent(self):
        """Test that entity references that do not point to valid entities are reported as an error instead of triggering an exception"""

        expected_log_codes = {CdmLogCode.WARN_RESOLVE_OBJECT_FAILED, CdmLogCode.ERR_RESOLVE_REFERENCE_FAILURE}
        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'TestEntRefNonexistent', expected_codes=expected_log_codes)
        folder = corpus.storage._namespace_folders['local']  # type: CdmFolderDefinition
        doc = CdmDocumentDefinition(corpus.ctx, 'someDoc.cdm.json')
        folder.documents.append(doc)
        entity = CdmEntityDefinition(corpus.ctx, 'someEntity')
        ent_att = CdmEntityAttributeDefinition(corpus.ctx, 'entityAtt')
        ent_att.entity = CdmEntityReference(corpus.ctx, 'nonExistingEntity', True)
        entity.attributes.append(ent_att)
        doc.definitions.append(entity)

        resolvedEnt = await entity.create_resolved_entity_async('resolvedSomeEntity')
        self.assertIsNotNone(resolvedEnt)

    @async_test
    async def test_resolving_resolved_entity(self):
        """Tests that resolution runs correctly when resolving a resolved entity"""

        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'TestResolvingResolvedEntity')
        entity = await corpus.fetch_object_async('local:/Entity.cdm.json/Entity')  # type: CdmEntityDefinition
        res_entity = await entity.create_resolved_entity_async('resEntity')
        res_res_entity = await res_entity.create_resolved_entity_async('resResEntity')
        self.assertIsNotNone(res_res_entity)  # type: CdmEntityDefinition
        self.assertEqual(1, len(res_res_entity.exhibits_traits))
        self.assertEqual("has.entitySchemaAbstractionLevel", res_res_entity.exhibits_traits[0].named_reference)
        self.assertEqual(1, len(res_res_entity.exhibits_traits[0].arguments))
        self.assertEqual("resolved", res_res_entity.exhibits_traits[0].arguments[0].value)

    @async_test
    async def test_resolve_test_corpus(self):
        self.assertTrue(os.path.exists(TestHelper.get_schema_docs_root()))

        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('local', LocalAdapter(TestHelper.get_schema_docs_root()))
        manifest = await corpus.fetch_object_async(TestHelper.cdm_standards_schema_path)  # type: CdmManifestDefinition
        directives = AttributeResolutionDirectiveSet({'referenceOnly', 'normalized'})
        all_resolved = await list_all_resolved(corpus, directives, manifest, StringSpewCatcher())
        self.assertNotEqual(all_resolved, '')

    @async_test
    async def test_resolved_composites(self):
        await resolve_save_debugging_file_and_assert(self, self.tests_sub_path,
                                                     'test_resolved_composites', 'composites')

    @async_test
    async def test_resolved_e2e(self):
        await resolve_save_debugging_file_and_assert(self, self.tests_sub_path, 'test_resolved_e2e', 'E2EResolution')

    @async_test
    async def test_resolved_knowledge_graph(self):
        await resolve_save_debugging_file_and_assert(self, self.tests_sub_path,
                                                     'test_resolved_knowledge_graph', 'KnowledgeGraph')

    # @async_test
    # async def test_resolved_mini_dyn(self):
    #     await self.resolve_save_debugging_file_and_assert('test_resolved_mini_dyn', 'MiniDyn')

    @async_test
    async def test_resolved_overrides(self):
        await resolve_save_debugging_file_and_assert(self, self.tests_sub_path, 'test_resolved_overrides', 'overrides')

    @async_test
    async def test_resolved_pov_resolution(self):
        await resolve_save_debugging_file_and_assert(self, self.tests_sub_path,
                                                     'test_resolved_pov_resolution', 'POVResolution')

    @async_test
    async def test_resolved_web_clicks(self):
        await resolve_save_debugging_file_and_assert(self, self.tests_sub_path, 'test_resolved_web_clicks', 'webClicks')

    @async_test
    async def test_resolve_with_extended(self):
        cdmCorpus = TestHelper.get_local_corpus(self.tests_sub_path, 'test_resolve_with_extended')

        def callback(status_level: 'CdmStatusLevel', message: str):
            self.assertTrue('unable to resolve the reference' not in message)
        cdmCorpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        ent = await cdmCorpus.fetch_object_async('local:/sub/Account.cdm.json/Account')  # type: CdmEntityDefinition
        res_opt = ResolveOptions(ent.in_document)
        await ent.create_resolved_entity_async('Account_', res_opt)

    @async_test
    async def test_attributes_that_are_replaced(self):
        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'test_attributes_that_are_replaced')

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
        expected_log_codes = { CdmLogCode.ERR_REL_MAX_RESOLVED_ATTR_REACHED }
        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'test_resolved_attribute_limit', expected_codes=expected_log_codes)  # type: CdmCorpusDefinition

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
        """
        Test that "is.linkedEntity.name" and "is.linkedEntity.identifier" traits are set when "selectedTypeAttribute" and "foreignKeyAttribute"
        are present in the entity's resolution guidance.
        """
        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'test_setting_traits_for_resolution_guidance_attributes')  # type: CdmCorpusDefinition
        entity = await corpus.fetch_object_async('local:/Customer.cdm.json/Customer')  # type: CdmEntityDefinition

        # Resolve with default directives to get "is.linkedEntity.name" trait.
        res_opt = ResolveOptions(wrt_doc=entity.in_document)
        resolved_entity = await entity.create_resolved_entity_async('resolved', res_opt)

        self.assertIsNotNone(resolved_entity.attributes[1].applied_traits.item('is.linkedEntity.name'))

        # Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
        res_opt = ResolveOptions(wrt_doc=entity.in_document)
        res_opt.directives = AttributeResolutionDirectiveSet({'referenceOnly'})
        resolved_entity = await entity.create_resolved_entity_async('resolved2', res_opt)

        self.assertIsNotNone(resolved_entity.attributes[0].applied_traits.item('is.linkedEntity.identifier'))

    @async_test
    async def test_applied_traits_in_attributes(self):
        """
        Test that traits(including the ones inside of dataTypeRefence and PurposeReference) are applied to an entity attribute and type attribute.
        """
        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'test_applied_traits_in_attributes')  # type: CdmCorpusDefinition
        expected_output_folder = TestHelper.get_expected_output_folder_path(self.tests_sub_path, 'test_applied_traits_in_attributes')
        entity = await corpus.fetch_object_async('local:/Sales.cdm.json/Sales')  # type: CdmEntityDefinition
        resolved_entity = await ProjectionTestUtils.get_resolved_entity(corpus, entity, ['referenceOnly'])

        await AttributeContextUtil.validate_attribute_context(self, expected_output_folder, 'Sales', resolved_entity)

    @async_test
    async def test_foundations_in_res_doc(self):
        """
        Test that foundations import is added to resolved doc if it exists in the unresolved doc
        """
        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'test_foundations_in_res_doc')
        entity = await corpus.fetch_object_async('Entity.cdm.json/Entity')  # type: CdmEntityDefinition
        resEntity = await entity.create_resolved_entity_async('resolvedEntity')
        self.assertTrue(resEntity.in_document.imports.item('cdm:/foundations.cdm.json') is not None)
