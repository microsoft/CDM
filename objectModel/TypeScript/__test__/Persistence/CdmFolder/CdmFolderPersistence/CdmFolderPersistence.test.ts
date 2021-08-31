// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmConstants, CdmCorpusDefinition, CdmEntityDefinition, CdmManifestDefinition, CdmFolderDefinition} from '../../../../internal';
import { ManifestPersistence } from '../../../../Persistence/CdmFolder/ManifestPersistence';
import { testHelper } from '../../../testHelper';

describe('Persistence.CdmFolder.CdmFolderPersistence', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/CdmFolderPersistence';
    it('TestFromAndToData', async () => {
        const corpus: CdmCorpusDefinition =
            testHelper.getLocalCorpus(testsSubpath, 'TestFromAndToData', undefined, true);

        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder("local");
        const manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>(`default${CdmConstants.manifestExtension}`, folder);
        const actualData = ManifestPersistence.toData(manifest, null, null);

        manifest.entities.allItems.forEach(async entity => {
            await corpus.fetchObjectAsync<CdmEntityDefinition>(entity.entityPath, manifest);
        });

        corpus.storage.fetchRootFolder("output").documents.push(manifest);
        await manifest.saveAsAsync(`default${CdmConstants.manifestExtension}`, true);

        var expected_data = testHelper.getExpectedOutputFileContent(testsSubpath,'TestFromAndToData', `default${CdmConstants.manifestExtension}`);
        testHelper.assertSameObjectWasSerialized(expected_data, JSON.stringify(actualData));
    });
});
