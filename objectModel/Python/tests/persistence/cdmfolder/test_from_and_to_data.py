# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import json
import unittest
import os

from cdm.objectmodel import CdmCorpusDefinition
from cdm.persistence.cdmfolder.manifest_persistence import ManifestPersistence
from cdm.persistence.cdmfolder.types import ManifestContent
from cdm.storage import LocalAdapter, RemoteAdapter

from tests.common import async_test

from . import ROOT_PATH


class CdmFolderTest(unittest.TestCase):
    @async_test
    async def test_from_and_to_data(self):
        with open(os.path.join(ROOT_PATH, 'default.manifest.cdm.json')) as manifestFile:
            manifestContent = ManifestContent()
            manifestContent.decode(manifestFile.read())

        corpus = CdmCorpusDefinition()
        corpus.storage.default_namespace = 'local'
        corpus.ctx.update_logging_options(level='WARNING')

        corpus.storage.mount('cdm', LocalAdapter(root="../CDM.SchemaDocuments"))
        corpus.storage.mount('local', LocalAdapter(root=ROOT_PATH))
        corpus.storage.mount('remote', RemoteAdapter(hosts={"contoso": "http://contoso.com"}))
        folder = corpus.storage.fetch_root_folder('local')

        manifest = await corpus.fetch_object_async('default.manifest.cdm.json', folder)
        data = await ManifestPersistence.to_data(manifest, None, None)

        for entity in manifest.entities:
            entity_def = await corpus.fetch_object_async(entity.entity_path, manifest)

        await manifest.save_as_async('test_output/new.manifest.cdm.json', save_referenced=True)

        self.assertDictEqual(json.loads(manifestContent.encode()), json.loads(data.encode()))


if __name__ == '__main__':
    unittest.main()
