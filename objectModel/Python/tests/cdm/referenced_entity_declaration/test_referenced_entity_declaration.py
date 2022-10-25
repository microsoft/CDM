# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
import os

from cdm.utilities import ResolveOptions, CopyOptions
from cdm.persistence.modeljson.manifest_persistence import ManifestPersistence

from tests.common import async_test, TestHelper
from tests.model_json_unit_test_local_adapter import ModelJsonUnitTestLocalAdapter


class ReferencedEntityTest(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'ReferencedEntityDeclaration')

    @async_test
    async def test_ref_entity_with_slash_path(self):
        test_name = 'test_ref_entity_with_slash_path'

        slash_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        slash_local_path = slash_corpus.storage.namespace_adapters.get('local').root
        slash_adapter = ModelJsonUnitTestLocalAdapter(slash_local_path)
        slash_corpus.storage.mount('slash', slash_adapter)
        slash_corpus.storage.defaultNamespace = 'slash'

        # load model.json files with paths generated using both '/' and '\'
        slash_manifest = await slash_corpus.fetch_object_async('slash:/model.json')

        # manually add the reference model location, path will vary on each machine
        ref_model_trait = slash_manifest.exhibits_traits.item('is.modelConversion.referenceModelMap')
        entity_path = slash_manifest.entities[0].entity_path
        ref_model_trait.arguments[0].value[0].location = slash_adapter.create_adapter_path(
            entity_path[0:entity_path.rindex('/')])

        slash_model = await ManifestPersistence.to_data(slash_manifest, ResolveOptions(), CopyOptions())

        self.assertIsNotNone(slash_model)
        self.assertEqual(1, len(slash_model.entities))

        back_slash_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        back_slash_local_path = back_slash_corpus.storage.namespace_adapters.get('local').root
        back_slash_adapter = ModelJsonUnitTestLocalAdapter(back_slash_local_path)
        back_slash_corpus.storage.mount('backslash', back_slash_adapter)
        back_slash_corpus.storage.default_namespace = 'backslash'

        back_slash_manifest = await back_slash_corpus.fetch_object_async('backslash:/model.json')

        # manually add the reference model location, path will vary on each machine
        back_slash_ref_model_trait = back_slash_manifest.exhibits_traits.item('is.modelConversion.referenceModelMap')
        back_slash_entity_path = back_slash_manifest.entities[0].entity_path
        back_slash_ref_model_trait.arguments[0].value[0].location = back_slash_adapter.create_adapter_path(
            back_slash_entity_path[0:back_slash_entity_path.rindex('/')]).replace('/', '\\\\')

        back_slash_model = await ManifestPersistence.to_data(back_slash_manifest, ResolveOptions(), CopyOptions())

        self.assertIsNotNone(back_slash_model)
        self.assertEqual(1, len(back_slash_model.entities))

