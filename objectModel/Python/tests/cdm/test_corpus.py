# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel, ImportsLoadStrategy
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions

from tests.common import async_test, TestHelper
   
class CorpusTests(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Corpus')

    @async_test
    async def test_resolve_symbol_reference(self):
        """Tests if a symbol imported with a moniker can be found as the last resource.
        When resolving symbolEntity with respect to wrtEntity, the symbol fromEntity should be found correctly."""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_resolve_symbol_reference')

        def callback(status_level: CdmStatusLevel, message: str):
            self.fail(message)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        wrt_entity = await corpus.fetch_object_async('local:/wrtEntity.cdm.json/wrtEntity') # type: CdmEntityDefinition
        res_opt = ResolveOptions(wrt_entity, AttributeResolutionDirectiveSet())
        await wrt_entity.create_resolved_entity_async('NewEntity', res_opt)

    @async_test
    async def test_compute_last_modified_time_async(self):
        """Tests if ComputeLastModifiedTimeAsync doesn't log errors related to reference validation."""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_compute_last_modified_time_async') # type: CdmCorpusDefinition

        def callback(status_level: CdmStatusLevel, message: str):
            self.fail(message)
        corpus.set_event_callback(callback, CdmStatusLevel.ERROR)
        await corpus._compute_last_modified_time_async('local:/default.manifest.cdm.json')

    @async_test
    async def test_lazy_load_imports(self):
        """Tests the fetch_object_async function with the lazy imports load."""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_imports_load_strategy')  # type: CdmCorpusDefinition
        def callback(status_level: CdmStatusLevel, message: str):
            # when the imports are not loaded, there should be no reference validation.
            # no error should be logged.
            self.fail(message)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # load with deferred imports.
        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LAZY_LOAD
        await corpus.fetch_object_async('local:/doc.cdm.json', res_opt=res_opt)

    @async_test
    async def test_lazy_load_create_resolved_entity(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestLazyLoadCreateResolvedEntity')
        def callback(status_level: CdmStatusLevel, message: str):
            # no error should be logged.
            self.fail(message)
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        # load with deferred imports.
        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LAZY_LOAD

        # load entB which is imported by entA document.
        doc_b = await corpus.fetch_object_async('local:/entB.cdm.json', None, res_opt)  # type: CdmDocumentDefinition
        ent_a = await corpus.fetch_object_async('local:/entA.cdm.json/entA', None, res_opt)  # type: CdmEntityDefinition

        self.assertIsNone(ent_a.in_document._import_priorities)
        self.assertIsNone(doc_b._import_priorities)

        # create_resolved_entity_async will force the entA document to be indexed.
        res_ent_a = await ent_a.create_resolved_entity_async('resolved-EntA')

        # in create_resolved_entity_async the documents should be indexed.
        self.assertIsNotNone(ent_a.in_document._import_priorities)
        self.assertIsNotNone(doc_b._import_priorities)
        self.assertIsNotNone(res_ent_a.in_document._import_priorities)

    @async_test
    async def test_load_imports(self):
        """Tests the fetch_object_async function with the imports load strategy set to load."""
        error_count = 0
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_imports_load_strategy')
        def callback(status_level: CdmStatusLevel, message: str):
            nonlocal error_count
            if message.index('Unable to resolve the reference') != -1:
                error_count += 1
            else:
                self.fail(message)
        corpus.set_event_callback(callback, CdmStatusLevel.ERROR)

        # load with strict validation.
        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD
        await corpus.fetch_object_async('local:/doc.cdm.json', res_opt=res_opt)
        self.assertEqual(1, error_count)

        error_count = 0
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_imports_load_strategy')
        def callback1(status_level: CdmStatusLevel, message: str):
            nonlocal error_count
            if status_level == CdmStatusLevel.WARNING and message.index('Unable to resolve the reference') != -1:
                error_count += 1
            else:
                self.fail(message)
        corpus.set_event_callback(callback1, CdmStatusLevel.WARNING)

        # load with strict validation and shallow validation.
        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD
        res_opt.shallow_validation = True
        await corpus.fetch_object_async('local:/doc.cdm.json', res_opt=res_opt)
        self.assertEqual(1, error_count)
