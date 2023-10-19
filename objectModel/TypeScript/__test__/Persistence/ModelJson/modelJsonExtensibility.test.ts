// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmConstants, CdmCorpusDefinition, CdmDocumentDefinition, CdmFolderDefinition, CdmManifestDefinition } from '../../../internal';
import { CdmFolder, ModelJson } from '../../../Persistence';
import { DocumentPersistence as cdmDocument } from '../../../Persistence/CdmFolder/DocumentPersistence';
import { DocumentContent } from '../../../Persistence/CdmFolder/types';
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
        // Workflow of this test:
        // Model.json (file) => Model (class) => Manifest => Model -- check result

        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonExtensibility');

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
    it('TestModelJsonExtensibilityManifestDocs', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonExtensibilityManifestDocs');
        const manifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>(
            'model.json',
            cdmCorpus.storage.fetchRootFolder('local')
        );
        const folderObject: CdmFolderDefinition = cdmCorpus.storage.fetchRootFolder('default');
        const serializedManifest: string = JSON.stringify(CdmFolder.ManifestPersistence.toData(manifest, undefined, undefined));

        if (doesWriteTestDebuggingFiles) {
            folderObject.documents.allItems.forEach((doc: CdmDocumentDefinition) => {
                const docContent: DocumentContent = cdmDocument.toData(doc, undefined, undefined);
                const serializedDocument: string = JSON.stringify(docContent);
                testHelper.writeActualOutputFileContent(
                    testsSubpath,
                    'TestModelJsonExtensibilityManifestDocs',
                    doc.name,
                    serializedDocument
                );
            });

            testHelper.writeActualOutputFileContent(
                testsSubpath,
                'TestModelJsonExtensibilityManifestDocs',
                manifest.name,
                serializedManifest
            );
        }

        for (const doc of folderObject.documents.allItems) {
            // manifest shows up twice. once as a manifest and again as the model.json conversion cached
            if (doc.name === manifest.name) {
                continue;
            }
            const serializedDocument: string = JSON.stringify(cdmDocument.toData(doc, undefined, undefined));

            const expectedOutputDocument: string =
                testHelper.getExpectedOutputFileContent(testsSubpath, 'TestModelJsonExtensibilityManifestDocs', doc.name);

            testHelper.assertSameObjectWasSerialized(expectedOutputDocument, serializedDocument);
        }

        const expectedOutput: string =
            testHelper.getExpectedOutputFileContent(testsSubpath, 'TestModelJsonExtensibilityManifestDocs', `${manifest.manifestName}${CdmConstants.manifestExtension}`);

        testHelper.assertSameObjectWasSerialized(expectedOutput, serializedManifest);
    });
});
