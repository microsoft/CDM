namespace read_manifest
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;

    /**
     * --------------------------------------------------------------------------------------------------------------------
     * This sample reads the content of a manifest document and lists all the entities that it knows about.
     * For a given entity, the sample will get the corresponding schema defintion document for that entity
     * and allow the user to list its attributes, traits, properties, data partition file locations, and relationships.
     * --------------------------------------------------------------------------------------------------------------------
     */
    class Program
    {
        static async Task Main(string[] args)
        {
            // ------------------------------------------------------------------------------------------------------------
            // Instantiate a corpus. The corpus is the collection of all documents and folders created or discovered 
            // while navigating objects and paths.

            var cdmCorpus = new CdmCorpusDefinition();

            // ------------------------------------------------------------------------------------------------------------
            // Configure storage adapters and mount them to the corpus. 

            // We want our storage adapters to point at the local manifest location and at the example public standards.
            string pathFromExeToExampleRoot = "../../../../../../";

            // Storage adapter pointing to the target local manifest location. 
            cdmCorpus.Storage.Mount("local", new LocalAdapter(pathFromExeToExampleRoot + "1-read-manifest"));

            // 'local' is our default namespace. 
            // Any paths that start navigating without a device tag (ex. 'cdm') will just default to the 'local' namepace.
            cdmCorpus.Storage.DefaultNamespace = "local";

            // Storage adapter pointing to the example public standards.
            // This is a fake 'cdm'; normally the Github adapter would be used to point at the real public standards.
            // Mount it as the 'cdm' device, not the default, so that we must use "cdm:<folder-path>" to get there.
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

            // Example how to mount to the ADLS:
            // cdmCorpus.Storage.Mount("adls",
            //    new ADLSAdapter(
            //      "<ACCOUNT-NAME>.dfs.core.windows.net", // Hostname.
            //      "/<FILESYSTEM-NAME>", // Root.
            //      "72f988bf-86f1-41af-91ab-2d7cd011db47",  // Tenant ID.
            //      "<CLIENT-ID>",  // Client ID.
            //      "<CLIENT-SECRET>" // Client secret.
            //    )
            // );

            // ------------------------------------------------------------------------------------------------------------
            // Open the default manifest file at the root.

            var manifestFile = "default.manifest.cdm.json";
            // This method turns relative corpus paths into absolute paths in case we are in some sub-folders 
            // and don't know it.
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(manifestFile);

            // ------------------------------------------------------------------------------------------------------------
            // List all the entities found in the manifest and allow the user to choose which entity to explore.

            while (true)
            {
                Console.WriteLine($"List of all entities found in {manifestFile}:");

                // Loop over any entity declarations.
                int iEnt = 1;
                foreach (var entDec in manifest.Entities)
                {
                    // Print it out.
                    // Assume there are only local entities in this manifest for simplicity.
                    Console.Write("  " + iEnt.ToString().PadRight(3));
                    Console.Write("  " + entDec.EntityName.PadRight(35));
                    Console.WriteLine("  " + entDec.EntityPath);
                    iEnt++;
                }

                Console.Write("Enter a number to show details for that Entity (press [enter] to exit): ");
                // Get the user's choice.
                string input = Console.ReadLine();
                if (string.IsNullOrEmpty(input))
                    break;

                // Make sure the user's input is a number.
                int num = 0;
                if (int.TryParse(input, out num))
                {
                    iEnt = 1;
                    foreach (var entityDec in manifest.Entities)
                    {
                        if (iEnt == num)
                        {
                            Console.WriteLine("Reading the entity schema and resolving with the standard docs, first one may take a second ...");

                            // From the path to the entity, get the actual schema description.
                            // Take the local relative path in this doc and make sure it works.
                            var entSelected = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(entityDec.EntityPath, manifest); // gets the entity object from the doc

                            while (true)
                            {
                                // List all the metadata properties of this entity that can be explored.
                                Console.WriteLine($"\nMetadata properties for the entity {entityDec.EntityName}:");
                                Console.WriteLine("  1: Attributes");
                                Console.WriteLine("  2: Traits");
                                Console.WriteLine("  3: Properties");
                                Console.WriteLine("  4: Data partition locations");
                                Console.WriteLine("  5: Relationships");

                                Console.Write("Enter a number to show details for that metadata property (press [enter] to explore other entities): ");

                                // Get the user's choice. 
                                input = Console.ReadLine();
                                if (string.IsNullOrEmpty(input))
                                {
                                    Console.WriteLine();
                                    break;
                                }

                                // Make sure the user's input is a number.
                                int choice = 0;
                                if (int.TryParse(input, out choice))
                                {
                                    switch (choice)
                                    {
                                        // List the entity's attributes.
                                        case 1:
                                            ListAttributes(entSelected);
                                            break;
                                        // List the entity's traits.
                                        case 2:
                                            ListTraits(entSelected);
                                            break;
                                        // List the entity's properties.
                                        case 3:
                                            ListProperties(entSelected, entityDec);
                                            break;
                                        // List the entity's data partition locations.
                                        case 4:
                                            ListDataPartitionLocations(entityDec);
                                            break;
                                        // List the entity's relationships.
                                        case 5:
                                            if (manifest.Relationships != null && manifest.Relationships.Count > 0)
                                            {
                                                // The manifest file contains pre-calculated entity relationships, so we can read them directly.
                                                ListRelationshipsFromManifest(manifest, entSelected);
                                            }
                                            else
                                            {
                                                // The manifest file doesn't contain relationships, so we have to compute the relationships first.
                                                await cdmCorpus.CalculateEntityGraphAsync(manifest);
                                                ListRelationships(cdmCorpus, entSelected);
                                            }
                                            break;
                                        default:
                                            Console.WriteLine("\nEnter a number between 1-5.");
                                            break;
                                    }
                                }
                                else
                                {
                                    Console.WriteLine("\nEnter a number.");
                                }
                            }
                        }
                        iEnt++;
                    }
                }
                else
                {
                    Console.WriteLine("\nEnter a number.");
                    Console.WriteLine();
                }
            }
        }

        static void ListAttributes(CdmEntityDefinition entity)
        {
            Console.WriteLine($"\nList of all attributes for the entity {entity.EntityName}:");

            // This way of getting the attributes only works well for 'resolved' entities that have been flattened out.
            // An abstract entity can be resolved by calling createResolvedEntity on it.
            foreach (CdmTypeAttributeDefinition attribute in entity.Attributes)
            {
                // Attribute's name.
                PrintProperty("Name", attribute.Name);
                // Attribute's data format.
                PrintProperty("DataFormat", attribute.DataFormat.ToString());
                // And all the traits of this attribute.
                Console.WriteLine("  AppliedTraits:");
                foreach (var trait in attribute.AppliedTraits)
                {
                    if (!string.IsNullOrEmpty(trait.FetchObjectDefinitionName()))
                    {
                        // Not getting too fancy with traits, just listing the trait name.
                        Console.WriteLine("      " + trait.FetchObjectDefinitionName());
                    }
                }
                Console.WriteLine();
            }
        }

        static void ListTraits(CdmEntityDefinition entity)
        {
            Console.WriteLine($"\nList of all traits for the entity {entity.EntityName}:");
            foreach (CdmTraitReference traitRef in entity.ExhibitsTraits)
            {
                if (!string.IsNullOrEmpty(traitRef.FetchObjectDefinitionName()))
                {
                    // Not getting too fancy with traits, just listing the trait name.
                    Console.WriteLine("  " + traitRef.FetchObjectDefinitionName());
                }
            }
        }

        static void ListProperties(CdmEntityDefinition entity, CdmEntityDeclarationDefinition entityDec)
        {
            Console.WriteLine($"\nList of all properties for the entity {entity.EntityName}:");
            // Entity's name.
            PrintProperty("EntityName", entityDec.EntityName);
            // Entity that this entity extends from.
            if (entity.ExtendsEntity != null)
            {
                PrintProperty("ExtendsEntity", entity.ExtendsEntity.FetchObjectDefinitionName());
            }
            // Entity's display name.
            PrintProperty("DisplayName", entity.DisplayName);
            // Entity's description.
            PrintProperty("Description", entity.Description);
            // Version.
            PrintProperty("Version", entity.Version);
            if (entity.CdmSchemas != null)
            {
                // Cdm schemas.
                Console.WriteLine("  CdmSchemas:");
                foreach (var schema in entity.CdmSchemas)
                {
                    Console.WriteLine("      " + schema);
                }
            }
            // Entity's source name.
            PrintProperty("SourceName", entity.SourceName);
            // Last file modified time.
            PrintProperty("LastFileModifiedTime", entityDec.LastFileModifiedTime.ToString());
            // Last file status check time.
            PrintProperty("LastFileStatusCheckTime", entityDec.LastFileStatusCheckTime.ToString());
        }

        static void ListDataPartitionLocations(CdmEntityDeclarationDefinition entityDec)
        {
            Console.WriteLine($"\nList of all data partition locations for the entity {entityDec.EntityName}:");
            foreach (CdmDataPartitionDefinition dataPartition in entityDec.DataPartitions)
            {
                // The data partition location.
                Console.WriteLine("  " + dataPartition.Location);
            }
        }

        static void ListRelationships(CdmCorpusDefinition cdmCorpus, CdmEntityDefinition entity)
        {
            Console.WriteLine($"\nList of all relationships for the entity {entity.EntityName}:");
            // Loop through all the relationships where other entities point to this entity.
            foreach (CdmE2ERelationship relationship in cdmCorpus.FetchIncomingRelationships(entity))
            {
                PrintRelationship(relationship);
            }
            // Now loop through all the relationships where this entity points to other entities.
            foreach (CdmE2ERelationship relationship in cdmCorpus.FetchOutgoingRelationships(entity))
            {
                PrintRelationship(relationship);
            }
        }

        static void ListRelationshipsFromManifest(CdmManifestDefinition manifest, CdmEntityDefinition entity)
        {
            Console.WriteLine($"\nList of all relationships for the entity {entity.EntityName}:");
            foreach (CdmE2ERelationship relationship in manifest.Relationships)
            {
                // Currently, the easiest way to get a specific entity's relationships (given a resolved manifest) is
                // to just look at all the entity relationships in the resolved manifest, and then filtering.
                if (relationship.FromEntity.Contains(entity.EntityName) || relationship.ToEntity.Contains(entity.EntityName))
                {
                    PrintRelationship(relationship);
                }
            }
        }

        static void PrintProperty(string propertyName, string propertyValue)
        {
            if (!String.IsNullOrEmpty(propertyValue))
            {
                Console.WriteLine($"  {propertyName}: {propertyValue}");
            }
        }

        static void PrintRelationship(CdmE2ERelationship relationship)
        {
            Console.WriteLine($"  FromEntity: {relationship.FromEntity}");
            Console.WriteLine($"  FromEntityAttribute: {relationship.FromEntityAttribute}");
            Console.WriteLine($"  ToEntity: {relationship.ToEntity}");
            Console.WriteLine($"  ToEntityAttribute: {relationship.ToEntityAttribute}");
            Console.WriteLine();
        }
    }
}
