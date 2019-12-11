import * as cdm from "cdm.objectmodel";

/**
 * --------------------------------------------------------------------------------------------------------------------
 * This sample demonstrates CDM Object Model use case in which a model.json file is loaded from a local file-system,
 * its content explored and then changed, and finally saved to an ADLSg2 destination.
 *
 * IMPORTANT: Before running this sample, make sure following is satisfied:
 *  1. The OM library is installed through NPM
 *  2. The modelJsonRoot constant points to the location of the example.model.json file
 *  3. ADLSg2 adapter configuration is updated according to your env setup
 *  -------------------------------------------------------------------------------------------------------------------
 */
async function runSample() {
    const modelJsonRoot: string = '../';
    const statusRpt: cdm.types.RptCallback = (level, msg) => console.log(level + ' | ' + msg + ' | ');
    
    // ------------------------------------------------------------------------------------------------------------
    // Instantiate corpus and set up the default namespace to be ADLS
    
    const cdmCorpus: cdm.types.ICdmCorpusDef = cdm.types.NewCorpus();
    cdmCorpus.defaultNamespace = 'adls';
    cdmCorpus.setEventCallback(statusRpt, cdm.types.cdmStatusLevel.warning);
    
    // ------------------------------------------------------------------------------------------------------------
    // Set up adapters for managing access to local FS, remote and ADLS locations
    
    const localConfig: object = {
        adapter: 'LocalAdapter',
        root: modelJsonRoot
    };
    
    const localAdapter: cdm.types.IStorageAdapter = cdmCorpus.createStorageAdapter(localConfig);
    cdmCorpus.registerStorageAdapter('local', localAdapter);
    
    const remoteConfig: object = {
        adapter: 'RemoteAdapter',
        hosts: {
            contoso: 'http://contoso.com'
        }
    };
    
    const remoteAdapter: cdm.types.IStorageAdapter = cdmCorpus.createStorageAdapter(remoteConfig);
    cdmCorpus.registerStorageAdapter('remote', remoteAdapter);
    
    const adlsConfig: object = {
        adapter: 'AdlsAdapter', 
        root: '/<FILESYSTEM_NAME>',                         // Container name
        hostname: '<ACCOUNT_NAME>.dfs.core.windows.net',    // ADLSg2 endpoint
        tenant: '72f988bf-86f1-41af-91ab-2d7cd011db47',     // Tenant ID (Microsoft)
        resource: 'https://storage.azure.com',              // Resource type
        clientId: '<CLIENT_ID>',                            // Test account client ID
        secret: '<CLIENT_SECRET>'                           // Test account secret
    }
    
    const adlsAdapter: cdm.types.IStorageAdapter = cdmCorpus.createStorageAdapter(adlsConfig);
    cdmCorpus.registerStorageAdapter('adls', adlsAdapter); 
    
    // ------------------------------------------------------------------------------------------------------------
    // Load a model.json file from local FS
    
    const folioPath: string = cdmCorpus.makeAbsoluteCorpusPath('model.json', cdmCorpus.getRootFolder('local'));
    const cdmFolio: cdm.types.ICdmFolioDef = await cdmCorpus.createRootFolio(folioPath);  

    // ------------------------------------------------------------------------------------------------------------
    // Explore entities and partitions defined in the model
    
    console.log('Listing entity declarations:');
    for (const decl of cdmFolio.entities) {
        console.log(' ' + decl.entityName);    
        if (decl.objectType === cdm.types.cdmObjectType.localEntityDeclarationDef) {
            for (const dataPart of (decl as cdm.types.ICdmLocalEntityDeclarationDef).dataPartitions) {
                console.log(' ' + dataPart.location);
            }
        }
    }
    // ------------------------------------------------------------------------------------------------------------
    // Make changes to the model

    // Create a new document where the new entity's definition will be stored
    const newEntityDoc: cdm.types.ICdmDocumentDef = cdmCorpus.MakeObject(cdm.types.cdmObjectType.documentDef, 'NewEntity.cdm.json');
    cdmCorpus.getRootFolder('local').addDocument(newEntityDoc.getName(), newEntityDoc);
    const newEntity: cdm.types.ICdmEntityDef = newEntityDoc.addDefinition(cdm.types.cdmObjectType.entityDef, 'NewEntity');

    // Define new string attribute and add it to the entity definition
    const newAttribute: cdm.types.ICdmTypeAttributeDef = cdmCorpus.MakeObject(cdm.types.cdmObjectType.typeAttributeDef, "NewAttribute");
    newAttribute.dataFormat = 'String';
    newEntity.hasAttributes.add(newAttribute);

    // Create a local declaration of the entity and point it to the new entity document
    const newEntityDecl: cdm.types.ICdmLocalEntityDeclarationDef = cdmCorpus.MakeObject(cdm.types.cdmObjectType.localEntityDeclarationDef);
    newEntityDecl.entitySchema = newEntityDoc.atCorpusPath + '/' + newEntity.getName();

    // Define a partition and add it to the local declaration
    const newPartition: cdm.types.ICdmDataPartitionDef = cdmCorpus.MakeObject(cdm.types.cdmObjectType.dataPartitionDef, 'NewPartition');
    newPartition.location = 'adls:/NewPartition.csv';
    newEntityDecl.dataPartitions.add(newPartition);

    // Add the local declaration to the folio
    cdmFolio.entities.add(newEntityDecl);

    // ------------------------------------------------------------------------------------------------------------
    // Save the file to ADLSg2 - we instruct that by changing the folio's namespace to 'adls'

    cdmFolio.namespace = 'adls';
    await cdmFolio.saveAs('model.json', {}, true);
}

runSample();