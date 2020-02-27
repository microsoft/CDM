// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusDefinition, CdmDocumentDefinition, CdmFolderDefinition, CdmManifestDefinition } from '../../../internal';
import { CdmFolder, ModelJson } from '../../../Persistence';
import { DocumentPersistence as cdmDocument } from '../../../Persistence/CdmFolder/DocumentPersistence';
import { DocumentContent, ManifestContent } from '../../../Persistence/CdmFolder/types';
import { Model } from '../../../Persistence/ModelJson/types';
import { testHelper } from '../../testHelper';

describe('Persistence.ModelJson.ModelJsonExtensibility', () => {
    /* tslint:disable:no-backbone-get-set-outside-model */

    /**
     * Test path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Persistence/ModelJson/ModelJsonExtensibility';

    const doesWriteTestDebuggingFiles: boolean = false;

    /**
     * Reads a Model.Json, converting to CdmManifestDef and then converting back to Model.Json format.
     * Checks all the results of the operations against snapshots.
     */
    it('TestModelJsonExtensibility', async () => {
        const inputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestModelJsonExtensibility');

        // Workflow of this test:
        // Model.json (file) => Model (class) => Manifest => Model -- check result

        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(inputPath);

        const cdmManifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>(
            'model.json',
            cdmCorpus.storage.fetchRootFolder('local')
        );
        const obtainedModel: Model = await ModelJson.ManifestPersistence.toData(cdmManifest, undefined, undefined);

        // The imports were generated during processing and are not present in the original file.
        obtainedModel['cdm:imports'] = undefined;

        if (doesWriteTestDebuggingFiles) {
            testHelper.writeActualOutputFileContent(
                testsSubpath,
                'TestModelJsonExtensibility',
                'SerializerTesting-model.json',
                JSON.stringify(obtainedModel));
        }

        const originalModelJsonSerialized: string = testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestModelJsonExtensibility',
            'SerializerTesting-model.json');
        const originalModelJson: Model = JSON.parse(originalModelJsonSerialized) as Model;
        testHelper.assertObjectContentEquality(originalModelJson, obtainedModel);
    });

    /**
     * Reads Model.Json, converts to manifest and compares files from obtained manifest to stored files.
     */
    it('ModelJsonExtensibilityManifestDocuments', async () => {
        const inputPath: string = testHelper.getInputFolderPath(testsSubpath, 'ModelJsonExtensibilityManifestDocuments');

        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(inputPath);
        const manifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>(
            'model.json',
            cdmCorpus.storage.fetchRootFolder('local')
        );
        const folderObject: CdmFolderDefinition = cdmCorpus.storage.fetchRootFolder('default');

        if (doesWriteTestDebuggingFiles) {
            folderObject.documents.allItems.forEach((doc: CdmDocumentDefinition) => {
                const docContent: DocumentContent = cdmDocument.toData(doc, undefined, undefined);
                const serializedDocument: string = JSON.stringify(docContent);
                testHelper.writeActualOutputFileContent(
                    testsSubpath,
                    'ModelJsonExtensibilityManifestDocuments',
                    doc.name,
                    serializedDocument
                );
            });

            const serializedManifest: string = JSON.stringify(CdmFolder.ManifestPersistence.toData(manifest, undefined, undefined));
            testHelper.writeActualOutputFileContent(
                testsSubpath,
                'ModelJsonExtensibilityManifestDocuments',
                manifest.name,
                serializedManifest
            );
        }

        for (const doc of folderObject.documents.allItems) {
            // manifest shows up twice. once as a manifest and again as the model.json conversion cached
            if (doc.name === manifest.name) {
                continue;
            }
            const docContent: DocumentContent = cdmDocument.toData(doc, undefined, undefined);

            const expectedOutputDocument: string =
                testHelper.getExpectedOutputFileContent(testsSubpath, 'ModelJsonExtensibilityManifestDocuments', doc.name);

            const expectedDocContent: object = JSON.parse(expectedOutputDocument) as object;

            testHelper.assertObjectContentEquality(expectedDocContent, docContent);
        }

        const expectedOutput: string =
            testHelper.getExpectedOutputFileContent(testsSubpath, 'ModelJsonExtensibilityManifestDocuments', manifest.name);
        const expectedManifestContent: object = JSON.parse(expectedOutput) as object;

        const actualManifestContent: ManifestContent = CdmFolder.ManifestPersistence.toData(manifest, undefined, undefined);
        testHelper.assertObjectContentEquality(expectedManifestContent, actualManifestContent);
    });
});
