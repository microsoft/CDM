# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import json
import unittest
import os

from cdm.enums import CdmStatusLevel
from cdm.persistence.cdmfolder.manifest_persistence import ManifestPersistence

from tests.common import async_test, TestHelper


class CdmFolderPersistenceTest(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'CdmFolder', 'CdmFolderPersistence')

    @async_test
    async def test_from_and_to_data(self):
        test_name = 'test_from_and_to_data'
        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING

        folder = corpus.storage.fetch_root_folder('local')

        manifest = await corpus.fetch_object_async('default.manifest.cdm.json', folder)
        actual_data = ManifestPersistence.to_data(manifest, None, None)

        for entity in manifest.entities:
            await corpus.fetch_object_async(entity.entity_path, manifest)
        corpus.storage.fetch_root_folder('output').documents.append(manifest)
        await manifest.save_as_async('default.manifest.cdm.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'default.manifest.cdm.json')
        self.assertDictEqual(expected_data, json.loads(actual_data.encode()))


if __name__ == '__main__':
    unittest.main()
