// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    cdmLogCode,
    CdmManifestDefinition,
    cdmObjectType,
    cdmStatusLevel,
    CdmTypeAttributeDefinition,
    copyOptions
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
     * Test setting SaveConfigFile to false and checking if the file is not saved.
     */
    it('testNotSavingConfigFile', async () => {
        const testName = 'testNotSavingConfigFile';
        const corpus = testHelper.getLocalCorpus(testsSubpath, testName);

        // Load manifest from input folder.
        const manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json");

        // Move manifest to output folder.
        const outputFolder = corpus.storage.fetchRootFolder("output");
        for (const entityDec of manifest.entities)
        {
            var entity = await corpus.fetchObjectAsync<CdmEntityDefinition>(entityDec.entityPath, manifest);
            outputFolder.documents.push(entity.inDocument);
        }

        outputFolder.documents.push(manifest);

        // Make sure the output folder is empty.
        testHelper.deleteFilesFromActualOutput(testHelper.getActualOutputFolderPath(testsSubpath, testName));

        // Save manifest to output folder.
        var co = new copyOptions();
        co.saveConfigFile = false;

        await manifest.saveAsAsync("default.manifest.cdm.json", false, co);

        // Compare the result.
        testHelper.assertFolderFilesEquality(
            testHelper.getExpectedOutputFolderPath(testsSubpath, testName),
            testHelper.getActualOutputFolderPath(testsSubpath, testName));
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
        const testAdapter: TestStorageAdapter = new TestStorageAdapter(allDocs);
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
     * Test that loading a model.json that isn't named exactly as such fails to load.
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
    });

    /**
     * Testing that type attribute properties (ex. IsReadOnly, isPrimaryKey) are not persisted in model.json format.
     */
    it('TestModelJsonTypeAttributePersistence', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonTypeAttributePersistence');
        // we need to create a second adapter to the output folder to fool the OM into thinking it's different
        // this is because there is a bug currently that prevents us from saving and then loading a model.json
        corpus.storage.mount('alternateOutput', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestModelJsonTypeAttributePersistence')));

        // create manifest
        const entityName: string = 'TestTypeAttributePersistence';
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');
        const outputRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        const manifest: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'tempAbstract');
        manifest.imports.push('cdm:/foundations.cdm.json', undefined);
        localRoot.documents.push(manifest);

        // create entity
        const doc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`);
        doc.imports.push('cdm:/foundations.cdm.json', undefined);
        localRoot.documents.push(doc, doc.name);
        const entityDef: CdmEntityDefinition = doc.definitions.push(cdmObjectType.entityDef, entityName) as CdmEntityDefinition;

        // create type attribute
        const cdmTypeAttributeDefinition: CdmTypeAttributeDefinition =
            corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, entityName, false);
        cdmTypeAttributeDefinition.isReadOnly = true;
        entityDef.attributes.push(cdmTypeAttributeDefinition);

        manifest.entities.push(entityDef);

        const manifestResolved: CdmManifestDefinition = await manifest.createResolvedManifestAsync('default', undefined);
        outputRoot.documents.push(manifestResolved);
        manifestResolved.imports.push('cdm:/foundations.cdm.json');
        await manifestResolved.saveAsAsync('model.json', true);
        const newManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('alternateOutput:/model.json');

        const newEnt: CdmEntityDefinition =
            await corpus.fetchObjectAsync<CdmEntityDefinition>(newManifest.entities.allItems[0].entityPath, manifest);
        const typeAttribute: CdmTypeAttributeDefinition = newEnt.attributes.allItems[0] as CdmTypeAttributeDefinition;
        expect(typeAttribute.isReadOnly)
            .toBeTruthy();
        done();
    });

    /**
     * Test that the persistence layer handles the case when the persistence format cannot be found.
     */
    it('TestMissingPersistenceFormat', async (done) => {
        const expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrPersistClassMissing]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestMissingPersistenceFormat', undefined, false, expectedLogCodes);

        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder(corpus.storage.defaultNamespace);

        const manifest: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'someManifest');
        folder.documents.push(manifest);
        // trying to save to an unsupported format should return false and not fail
        const succeded: boolean = await manifest.saveAsAsync('manifest.unSupportedExtension');
        expect(succeded)
            .toBeFalsy();
        done();
    });
});
