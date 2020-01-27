import {
    CdmCorpusDefinition,
    CdmManifestDefinition,
    cdmStatusLevel
} from '../../internal';
import { LocalAdapter, RemoteAdapter } from '../../Storage';
import { testHelper } from '../testHelper';
import { TestStorageAdapter } from '../testStorageAdapter';

describe('Persistence.PersistenceLayerTest', () => {
    const testsSubpath: string = 'Persistence/PersistenceLayer';

    /**
     * Errors are not thrown when invalid json is loaded into the corpus
     */
    it('TestInvalidJson', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestInvalidJson');

        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback((level, msg) => { }, cdmStatusLevel.error);
        corpus.storage.mount('local', new LocalAdapter(testInputPath));
        corpus.storage.defaultNamespace = 'local';

        let failed: boolean = false;
        let invalidManifest: CdmManifestDefinition;
        try {
            invalidManifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/invalidManifest.manifest.cdm.json');
        } catch (e) {
            failed = true;
        }
        expect(failed)
            .toBeFalsy();
        expect(invalidManifest)
            .toBeUndefined();
        done();
    });

    /**
     * Test that a document is fetched and saved using the correct persistence class,
     * regardless of the case sensitivity of the file name/extension.
     */
    it('TestFetchingAndSavingDocumentsWithCaseInsensitiveCheck', async (done) => {
        const testName: string = 'TestFetchingAndSavingDocumentsWithCaseInsensitiveCheck';
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, testName);

        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback(() => { }, cdmStatusLevel.error);
        const localAdapter: LocalAdapter = new LocalAdapter(testInputPath);
        const remoteAdapter: RemoteAdapter = new RemoteAdapter(new Map([['contoso', 'http://contoso.com']]));
        corpus.storage.mount('local', localAdapter);
        corpus.storage.mount('remote', remoteAdapter);
        corpus.storage.unMount('cdm');
        corpus.storage.defaultNamespace = 'local';

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('empty.Manifest.cdm.json');
        const manifestFromModelJson: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('Model.json');

        // Swap out the adapter for a fake one so that we aren't actually saving files.
        const allDocs: Map<string, string> = new Map<string, string>();
        const testAdapter = new TestStorageAdapter(allDocs);
        corpus.storage.setAdapter('local', testAdapter);

        const newManifestName: string = 'empty.MANIFEST.CDM.json';
        await manifest.saveAsAsync(newManifestName, true);
        // Verify that manifest persistence was called by comparing the saved document to the original manifest.
        let serializedManifest: string = allDocs.get(`/${newManifestName}`);
        let expectedOutputManifest: string = testHelper.getExpectedOutputFileContent(testsSubpath, testName, manifest.name);
        testHelper.assertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);

        const newManifestFromModelJsonName: string = 'MODEL.json';
        await manifestFromModelJson.saveAsAsync(newManifestFromModelJsonName, true);
        // Verify that model.json persistence was called by comparing the saved document to the original model.json.
        serializedManifest = allDocs.get(`/${newManifestFromModelJsonName}`);
        expectedOutputManifest = testHelper.getExpectedOutputFileContent(testsSubpath, testName, manifestFromModelJson.name);
        testHelper.assertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);

        done();
    });

    /**
     * Test that saving a model.json that isn't named exactly as such fails to save.
     */
    it('TestSavingInvalidModelJsonName', async (done) => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback(() => { }, cdmStatusLevel.error);
        corpus.storage.unMount('cdm');
        corpus.storage.defaultNamespace = 'local';
        const manifest: CdmManifestDefinition = new CdmManifestDefinition(corpus.ctx, 'manifest');
        corpus.storage.fetchRootFolder('local').documents
            .push(manifest);

        const allDocs: Map<string, string> = new Map<string, string>();
        const testAdapter: TestStorageAdapter = new TestStorageAdapter(allDocs);
        corpus.storage.setAdapter('local', testAdapter);

        const newManifestFromModelJsonName: string = 'my.model.json';
        await manifest.saveAsAsync(newManifestFromModelJsonName, true);
        // TODO: because we can load documents properly now, SaveAsAsync returns false.
        // Will check the value returned from SaveAsAsync() when the problem is solved
        expect(allDocs.has(`/${newManifestFromModelJsonName}`))
            .toBeFalsy();

        done();
    });

    /**
     * Test that loading a model.json or odi.json that isn't named exactly as such fails to load.
     */
    it('TestLoadingInvalidModelJsonName', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadingInvalidModelJsonName');

        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback(() => { }, cdmStatusLevel.error);
        corpus.storage.mount('local', new LocalAdapter(testInputPath));
        corpus.storage.defaultNamespace = 'local';

        // We are trying to load a file with an invalid name, so fetchObjectAsync should just return null.
        const invalidModelJson: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('test.model.json');
        expect(invalidModelJson)
            .toBeUndefined();
        done();

        // TODO: Do the same check for ODI.json files here once ODI is ported.
    });
});
