# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import cast

from cdm.enums import CdmStatusLevel, CdmLogCode, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition, CdmReferencedEntityDeclarationDefinition
from cdm.persistence import PersistenceLayer
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper


class ManifestResolution(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Resolution', 'ManifestResolutionTest')
    @async_test
    async def test_referenced_entity_declaration_resolution(self):
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.mount('cdm', LocalAdapter(root=TestHelper.schema_documents_path))
        corpus.storage.default_namespace = 'cdm'

        manifest = CdmManifestDefinition(corpus.ctx, 'manifest')

        manifest.entities.append(
            'Account', 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account')

        referenced_entity_path = \
            'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/electronicMedicalRecords.manifest.cdm.json/Address'
        referenced_entity = CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'Address')
        referenced_entity.entity_path = referenced_entity_path
        manifest.entities.append(referenced_entity)

        corpus.storage.fetch_root_folder('cdm').documents.append(manifest)

        resolved_manifest = await manifest.create_resolved_manifest_async('resolved_manifest', None)

        self.assertEqual(2, len(resolved_manifest.entities))
        self.assertEqual('core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/resolved/Account.cdm.json/Account',
                         resolved_manifest.entities[0].entity_path)
        self.assertEqual(referenced_entity_path, resolved_manifest.entities[1].entity_path)

    @async_test
    async def test_resolving_manifest_not_in_folder(self):
        """Test that resolving a manifest that hasn't been added to a folder doesn't throw any exceptions."""

        try:
            corpus = CdmCorpusDefinition()
            corpus.storage.mount('local', LocalAdapter('C:\\path'))
            corpus.storage.default_namespace = 'local'

            manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'test')
            entity = corpus.make_object(CdmObjectType.ENTITY_DEF, 'entity')
            document = corpus.make_object(CdmObjectType.DOCUMENT_DEF, 'entity{}'.format(PersistenceLayer.CDM_EXTENSION))
            document.definitions.append(entity)

            # Don't add the document containing the entity to a folder either.
            manifest.entities.append(entity)
            await manifest.create_resolved_manifest_async('resolved', None)

            TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_RESOLVE_MANIFEST_FAILED, True, self)
        except Exception:
            self.fail('Exception should not be thrown when resolving a manifest that is not in a folder.')

    @async_test
    async def test_linked_resolved_doc_saving_not_dirtying_logical_entities(self):
        """
        Test that saving a resolved manifest will not cause original logical entity doc to be marked dirty.
        """
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_linked_resolved_doc_saving_not_dirtying_logical_entities')

        manifest_abstract = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'default')  # type: CdmManifestDefinition

        manifest_abstract.imports.append('cdm:/foundations.cdm.json')
        manifest_abstract.entities.append('B', 'local:/B.cdm.json/B')
        corpus.storage.fetch_root_folder('output').documents.append(manifest_abstract)

        manifest_resolved = await manifest_abstract.create_resolved_manifest_async('default-resolved', '{n}/{n}.cdm.json')
        self.assertTrue(not corpus.storage._namespace_folders['local'].documents[0]._is_dirty
                        and not corpus.storage._namespace_folders['local'].documents[1]._is_dirty,
                        'Referenced logical document should not become dirty when manifest is resolved')

    @async_test
    async def test_resolving_manifest_with_same_name(self):
        """
        Test that correct error is shown when trying to create a resolved manifest with a name that already exists
        """
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_resolving_manifest_with_same_name')

        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'test')  # type: CdmManifestDefinition
        corpus.storage._namespace_folders['local'].documents.append(manifest)
        res_manifest = await manifest.create_resolved_manifest_async(manifest.name, '{n}/{n}.cdm.json')

        self.assertIsNone(res_manifest)
        TestHelper.assert_cdm_log_code_equality(corpus, CdmLogCode.ERR_RESOLVE_MANIFEST_EXISTS, True, self)
