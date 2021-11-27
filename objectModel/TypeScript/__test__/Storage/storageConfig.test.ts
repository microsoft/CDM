// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusDefinition, CdmManifestDefinition, cdmStatusLevel } from '../../internal';
import { LocalAdapter } from '../../Storage';
import { testHelper } from '../testHelper';

describe('Cdm.Storage.StorageConfig', () => {
    /**
     * Test path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Storage';

    it('TestLoadingAndSavingConfig', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadingAndSavingConfig');

        const testOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, 'TestLoadingAndSavingConfig');

        // Create a corpus to load the config.
        const cdmCorpus: CdmCorpusDefinition = getLocalCorpus(testInputPath, testOutputPath);
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        // tslint:disable-next-line: no-backbone-get-set-outside-model
        const config: string = await cdmCorpus.storage.fetchAdapter('local')
            .readAsync('/config.json');

        const differentCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        differentCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        differentCorpus.storage.mountFromConfig(config);

        const resultConfig: string = differentCorpus.storage.fetchConfig();

        // tslint:disable-next-line: no-backbone-get-set-outside-model
        const outputConfig: string = await cdmCorpus.storage.fetchAdapter('target')
            .readAsync('/config.json');

        testHelper.assertObjectContentEquality(JSON.parse(outputConfig), JSON.parse(resultConfig));
        done();
    });

    it('TestLoadingConfigAndTryingToFetchManifest', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadingConfigAndTryingToFetchManifest');

        // Create a corpus to load the config.
        const cdmCorpus: CdmCorpusDefinition = getLocalCorpus(testInputPath);
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        // tslint:disable-next-line: no-backbone-get-set-outside-model
        const config: string = await cdmCorpus.storage.fetchAdapter('local')
            .readAsync('/config-TypeScript.json');

        const differentCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        differentCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        const unrecognizedAdapters: string[] = differentCorpus.storage.mountFromConfig(config, true);

        const cdmManifest: CdmManifestDefinition =
            await differentCorpus.fetchObjectAsync<CdmManifestDefinition>('model.json', cdmCorpus.storage.fetchRootFolder('local'));

        expect(cdmManifest)
            .toBeDefined();
        expect(unrecognizedAdapters.length)
            .toBe(1);
        done();
    });

    it('TestSystemAndResourceAdapters', async (done) => {
        // Create a corpus to load the config.
        const outputFolder: string = testHelper.getExpectedOutputFolderPath(testsSubpath, 'TestSystemAndResourceAdapters');
        const cdmCorpus: CdmCorpusDefinition = getLocalCorpus(outputFolder);
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        const differentCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        differentCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        differentCorpus.storage.unMount('cdm');

        differentCorpus.storage.defaultNamespace = 'local';

        const resultConfig: string = differentCorpus.storage.fetchConfig();

        // tslint:disable-next-line: no-backbone-get-set-outside-model
        const outputConfig: string = await cdmCorpus.storage.namespaceAdapters.get('local')
            .readAsync('/config.json');

        testHelper.assertObjectContentEquality(JSON.parse(outputConfig), JSON.parse(resultConfig));
        done();
    });
});

function getLocalCorpus(testFilesInputRoot: string, testFilesOutputRoot?: string): CdmCorpusDefinition {
    const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();

    corpus.storage.defaultNamespace = 'local';

    corpus.storage.mount('local', new LocalAdapter(testFilesInputRoot));

    if (testFilesOutputRoot !== undefined) {
        corpus.storage.mount('target', new LocalAdapter(testFilesOutputRoot));
    }

    return corpus;
}