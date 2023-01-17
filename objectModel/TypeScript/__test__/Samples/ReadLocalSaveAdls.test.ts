// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    cdmDataFormat,
    CdmDataPartitionDefinition,
    CdmDocumentDefinition,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmTypeAttributeDefinition
} from '../../internal';
import {
    LocalAdapter
} from '../../Storage';
import { adlsModelJsonTestHelper } from '../adlsModelJsonTestHelper';
import { adlsTestHelper } from '../adlsTestHelper';
import { testHelper } from '../testHelper';

describe('Samples.ReadLocalSaveAdlsTests', () => {
    const testsSubpath: string = 'Samples';
    const testName: string = 'TestReadLocalSaveAdls';
    let rootRelativePath: string;

    const sampleIt: jest.It = (process.env['SAMPLE_RUNTESTS'] === '1' && process.env['ADLS_RUNTESTS'] === '1') ? it : it.skip;

    sampleIt('TestReadLocalSaveAdls', async () => {
        testHelper.deleteFilesFromActualOutput(testHelper.getActualOutputFolderPath(testsSubpath, testName));
        rootRelativePath = `Samples/TestReadLocalSaveAdls/${process.env['USERNAME']}_${process.env['COMPUTERNAME']}_Typescript`;

        // Modify partition.location in model.json and save it into actual output
        adlsModelJsonTestHelper.updateInputAndExpectedAndSaveToActualSubFolder(
            testsSubpath,
            testName,
            rootRelativePath,
            'model.json',
            'OrdersProductsCustomersLinked',
            new Date().toString()
        );

        const cdmCorpus: CdmCorpusDefinition = setupCdmCorpus();
        await readLocalSaveAdls(cdmCorpus);

        // Check the model.json file in ADLS and delete it.
        const actualContent: string = await cdmCorpus.storage.fetchAdapter('adls')
            .readAsync('model.json');
        adlsModelJsonTestHelper.saveModelJsonToActualOutput(testsSubpath, testName, 'model.json', actualContent);

        const expectedContent: string = adlsModelJsonTestHelper.getExpectedFileContent(testsSubpath, testName, 'model.json');
        testHelper.assertSameObjectWasSerialized(expectedContent, actualContent);
    }, 100000);

    function setupCdmCorpus(): CdmCorpusDefinition {
        // ------------------------------------------------------------------------------------------------------------
        // Instantiate corpus and set up the default namespace to be ADLS
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.defaultNamespace = 'local';

        // ------------------------------------------------------------------------------------------------------------
        // Set up adapters for managing access to local FS, remote and ADLS locations

        // Fake cdm, normaly use the CDM Standards adapter
        // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
        cdmCorpus.storage.mount('cdm', new LocalAdapter(testHelper.sampleSchemaFolderPath));

        cdmCorpus.storage.mount('local', new LocalAdapter(
            adlsModelJsonTestHelper.getActualSubFolderPath(
                testsSubpath,
                testName,
                adlsModelJsonTestHelper.inputFolderName)));

        // Example how to mount to the ADLS - make sure the hostname and root entered here are also changed
        // in the model.json file we load in the next section
        cdmCorpus.storage.mount('adls', adlsTestHelper.createAdapterWithClientId(rootRelativePath));

        return cdmCorpus;
    }

    async function readLocalSaveAdls(cdmCorpus: CdmCorpusDefinition): Promise<void> {
        // ------------------------------------------------------------------------------------------------------------
        // Load a model.json file from local FS

        const manifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/model.json');

        // ------------------------------------------------------------------------------------------------------------
        // Explore entities and partitions defined in the model

        console.log('Listing entity declarations:');
        for (const decl of manifest.entities.allItems) {
            console.log(' ' + decl.entityName);
            if (decl.objectType === cdmObjectType.localEntityDeclarationDef) {
                for (const dataPart of decl.dataPartitions.allItems) {
                    console.log(' ' + dataPart.location);
                }
            }
        }

        // ------------------------------------------------------------------------------------------------------------
        // Make changes to the model

        // Create a new document where the new entity's definition will be stored
        const newEntityDoc: CdmDocumentDefinition = cdmCorpus.MakeObject(cdmObjectType.documentDef, 'NewEntity.cdm.json', false);
        newEntityDoc.imports.push('cdm:/foundations.cdm.json');
        cdmCorpus.storage.fetchRootFolder('local').documents.push(newEntityDoc);

        const newEntity: CdmEntityDefinition = newEntityDoc.definitions.push(cdmObjectType.entityDef, 'NewEntity') as CdmEntityDefinition;

        // Define new string attribute and add it to the entity definition
        const newAttribute: CdmTypeAttributeDefinition = cdmCorpus.MakeObject(cdmObjectType.typeAttributeDef, 'NewAttribute', false);
        newAttribute.dataFormat = cdmDataFormat.string;
        newEntity.attributes.push(newAttribute);

        // Create a local declaration of the entity and point it to the new entity document
        const newEntityDecl: CdmEntityDeclarationDefinition = manifest.entities.push(newEntity);

        // Define a partition and add it to the local declaration
        const newPartition: CdmDataPartitionDefinition = cdmCorpus.MakeObject(cdmObjectType.dataPartitionDef, 'NewPartition', false);
        newPartition.location = 'adls:/NewPartition.csv';
        newEntityDecl.dataPartitions.push(newPartition);

        // ------------------------------------------------------------------------------------------------------------
        // Save the file to ADLSg2 - we instruct that by changing the folio's namespace to 'adls'

        const adlsFolder: CdmFolderDefinition = cdmCorpus.storage.fetchRootFolder('adls');
        adlsFolder.documents.push(manifest);
        await manifest.saveAsAsync('model.json', true);
    }
});
