// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as cdm from "../../../objectModel/TypeScript";

/**
 * --------------------------------------------------------------------------------------------------------------------
 * This sample demonstrates CDM Object Model use case in which a model.json file is loaded from a local file-system,
 * its content explored and then changed, and finally saved to an ADLSg2 destination.
 *
 * IMPORTANT: Before running this sample, make sure following is satisfied:
 *  1. The modelJsonRoot constant points to the location of the model.json file
 *  2. ADLSg2 adapter configuration is updated according to your env setup
 *  3. The partition locations in model.json is updated according to your env setup
 *  -------------------------------------------------------------------------------------------------------------------
 */
async function runSample() {
    const modelJsonRoot: string = '../sample-data';
    const pathFromExeToExampleRoot: string = '../../'

    // ------------------------------------------------------------------------------------------------------------
    // Instantiate corpus and set up the default namespace to be ADLS

    const cdmCorpus: cdm.types.CdmCorpusDefinition = new cdm.types.CdmCorpusDefinition();
    cdmCorpus.storage.defaultNamespace = 'local';

    // ------------------------------------------------------------------------------------------------------------
    // Set up adapters for managing access to local FS, remote and ADLS locations

    // Fake cdm, normaly use the CDM Standards adapter
    // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
    cdmCorpus.storage.mount('cdm', new cdm.types.LocalAdapter(`${pathFromExeToExampleRoot}example-public-standards`));

    cdmCorpus.storage.mount('local', new cdm.types.LocalAdapter(modelJsonRoot));

    // Example how to mount to the ADLS - make sure the hostname and root entered here are also changed
    // in the model.json file we load in the next section
    cdmCorpus.storage.mount('adls', new cdm.types.ADLSAdapter(
        '<ACCOUNT_NAME>.dfs.core.windows.net',    // ADLSg2 endpoint
        '/<FILESYSTEM_NAME>',                     // Container name
        '72f988bf-86f1-41af-91ab-2d7cd011db47',   // Tenant ID (Microsoft)
        '<CLIENT_ID>',                            // Test account client ID
        '<CLIENT_SECRET>'                         // Test account secret
    ));


    // ------------------------------------------------------------------------------------------------------------
    // Load a model.json file from local FS

    const manifest: cdm.types.CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<cdm.types.CdmManifestDefinition>('local:/model.json');

    // ------------------------------------------------------------------------------------------------------------
    // Explore entities and partitions defined in the model

    console.log('Listing entity declarations:');
    for (const decl of manifest.entities.allItems) {
        console.log(' ' + decl.entityName);
        if (decl.objectType === cdm.types.cdmObjectType.localEntityDeclarationDef) {
            for (const dataPart of decl.dataPartitions.allItems) {
                console.log(' ' + dataPart.location);
            }
        }
    }

    // ------------------------------------------------------------------------------------------------------------
    // Make changes to the model

    // Create a new document where the new entity's definition will be stored
    const newEntityDoc: cdm.types.CdmDocumentDefinition = cdmCorpus.MakeObject(cdm.types.cdmObjectType.documentDef, 'NewEntity.cdm.json', false);
    newEntityDoc.imports.push('cdm:/foundations.cdm.json');
    cdmCorpus.storage.fetchRootFolder('local').documents.push(newEntityDoc);

    const newEntity: cdm.types.CdmEntityDefinition = newEntityDoc.definitions.push(cdm.types.cdmObjectType.entityDef, 'NewEntity') as cdm.types.CdmEntityDefinition;

    // Define new string attribute and add it to the entity definition
    const newAttribute: cdm.types.CdmTypeAttributeDefinition = cdmCorpus.MakeObject(cdm.types.cdmObjectType.typeAttributeDef, 'NewAttribute', false);
    newAttribute.dataFormat = cdm.types.cdmDataFormat.string;
    newEntity.attributes.push(newAttribute);

    // Create a local declaration of the entity and point it to the new entity document
    const newEntityDecl: cdm.types.CdmEntityDeclarationDefinition = manifest.entities.push(newEntity);

    // Define a partition and add it to the local declaration
    const newPartition: cdm.types.CdmDataPartitionDefinition = cdmCorpus.MakeObject(cdm.types.cdmObjectType.dataPartitionDef, 'NewPartition', false);
    newPartition.location = 'adls:/NewPartition.csv';
    newEntityDecl.dataPartitions.push(newPartition);

    // ------------------------------------------------------------------------------------------------------------
    // Save the file to ADLSg2 - we instruct that by changing the folio's namespace to 'adls'

    const adlsFolder: cdm.types.CdmFolderDefinition = cdmCorpus.storage.fetchRootFolder('adls');
    adlsFolder.documents.push(manifest);
    await manifest.saveAsAsync('model.json', true);
}

runSample();