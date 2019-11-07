namespace read_local_save_adls
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    /**
     * --------------------------------------------------------------------------------------------------------------------
     * This sample demonstrates CDM Object Model use case in which a model.json file is loaded from a local file-system,
     * its content explored and then changed, and finally saved to an ADLSg2 destination.
     *
     * IMPORTANT: Before running this sample, make sure following is satisfied:
     *  1. The OM library is added to the assembly lookup path
     *  2. The modelJsonRoot constant points to the location of the example.model.json file
     *  3. ADLSg2 adapter configuration is updated according to your env setup
     *  -------------------------------------------------------------------------------------------------------------------
     */
    class Program
    {
        const string modelJsonRoot = @"../../../../../";

        static async Task Main(string[] args)
        {
            var pathFromExeToExampleRoot = "../../../../../../";

            // ------------------------------------------------------------------------------------------------------------
            // Instantiate corpus and set up the default namespace to be local

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";

            // ------------------------------------------------------------------------------------------------------------
            // Set up adapters for managing access to different files-system locations

            // Fake cdm, normaly use the github adapter
            // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

            cdmCorpus.Storage.Mount("local", new LocalAdapter(modelJsonRoot));

            // Example how to mount to the ADLS - make sure the hostname and root entered here are also changed
            // in the example.model.json file we load in the next section
            cdmCorpus.Storage.Mount("adls",
                new ADLSAdapter(
                    "<ACCOUNT-NAME>.dfs.core.windows.net", // Hostname.
                    "/<FILESYSTEM-NAME>", // Root.
                    "72f988bf-86f1-41af-91ab-2d7cd011db47",  // Tenant ID.
                    "<CLIENT-ID>",  // Client ID.
                    "<CLIENT-SECRET>" // Client secret.
                ));

            // ------------------------------------------------------------------------------------------------------------
            // Load a model.json file from local FS

            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/example.model.json");

            // ------------------------------------------------------------------------------------------------------------
            // Explore entities and partitions defined in the model

            Console.WriteLine("Listing entity declarations:");
            foreach (CdmEntityDeclarationDefinition decl in manifest.Entities)
                {
                    Console.WriteLine("  " + decl.EntityName);

                    // TODO: This can be rewritten in a different way since data partition gives null for referenced entities, suggestions are welcome.
                    if (decl.ObjectType == CdmObjectType.LocalEntityDeclarationDef)
                    {
                        foreach (CdmDataPartitionDefinition dataPart in decl.DataPartitions) {
                            Console.WriteLine("    " + dataPart.Location);
                        }
                    }
                }

            // ------------------------------------------------------------------------------------------------------------
            // Make changes to the model

            // Create a new document where the new entity's definition will be stored
            var newEntityDoc = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, "NewEntity.cdm.json", false);
            newEntityDoc.Imports.Add("cdm:/foundations.cdm.json");
            cdmCorpus.Storage.FetchRootFolder("local").Documents.Add(newEntityDoc);

            var newEntity = newEntityDoc.Definitions.Add(CdmObjectType.EntityDef, "NewEntity") as CdmEntityDefinition;

            // Define new string attribute and add it to the entity definition
            var newAttribute = cdmCorpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "NewAttribute", false);
            newAttribute.DataFormat = CdmDataFormat.String;
            newEntity.Attributes.Add(newAttribute);

            // Call will create EntityDeclarationDefinition based on entity definition and add it to manifest.Entities
            var newEntityDecl = manifest.Entities.Add(newEntity);

            // Define a partition and add it to the local declaration
            var newPartition = cdmCorpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef, "NewPartition", false);
            newPartition.Location = "adls:/NewPartition.csv";
            newEntityDecl.DataPartitions.Add(newPartition);

            // ------------------------------------------------------------------------------------------------------------
            // Save the file to ADLSg2 - we achieve that by adding the manifest to the root folder of
            // the ADLS file-system and performing a save on the manifest

            CdmFolderDefinition adlsFolder = cdmCorpus.Storage.FetchRootFolder("adls");
            adlsFolder.Documents.Add(manifest);
            await manifest.SaveAsAsync("example.model.json", true);
        }
    }
}
