// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Samples
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;

    [TestClass]
    public class ReadManifestTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = "Samples";

        [TestInitialize]
        public void CheckSampleRunTestsFlag()
        {
            if (Environment.GetEnvironmentVariable("SAMPLE_RUNTESTS") != "1")
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("SAMPLE_RUNTESTS environment variable not set.");
            }
        }

        [TestMethod]
        public async Task TestReadManifest()
        {
            TestHelper.DeleteFilesFromActualOutput(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestReadManifest)));

            var testInputPath = Path.Combine(TestHelper.GetInputFolderPath(testsSubpath, nameof(TestReadManifest)), "input.txt");
            var testActualOutputPath = Path.Combine(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestReadManifest)), "output.txt");

            using (var reader = new StreamReader(testInputPath, Encoding.UTF8))
            {
                using (var writer = new StreamWriter(testActualOutputPath, false, Encoding.UTF8))
                {
                    Console.SetIn(reader);
                    Console.SetOut(writer);

                    await ExploreManifest(SetupCdmCorpus(), "default.manifest.cdm.json");
                }
            }

            // Remove the partition absolute location in the output.txt
            string actualOutputContent = File.ReadAllText(testActualOutputPath);
            actualOutputContent = Regex.Replace(actualOutputContent, "partition-data.csv[^\n]*\n[^\n]*partition-data.csv", "partition-data.csv");
            File.WriteAllText(testActualOutputPath, actualOutputContent);

            TestHelper.AssertFileContentEquality(
                File.ReadAllText(Path.Combine(TestHelper.GetExpectedOutputFolderPath(testsSubpath, nameof(TestReadManifest)), "output-CSharp.txt")),
                actualOutputContent
            );
        }

        private CdmCorpusDefinition SetupCdmCorpus()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    Assert.Fail(message);
                }
            }, CdmStatusLevel.Warning);

            cdmCorpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetInputFolderPath(testsSubpath, nameof(TestReadManifest))));
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SampleSchemaFolderPath));

            return cdmCorpus;
        }

        static async Task ExploreManifest(CdmCorpusDefinition cdmCorpus, string manifestPath)
        {
            Console.WriteLine($"\nLoading manifest {manifestPath} ...");

            CdmManifestDefinition manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(manifestPath);

            if (manifest == null)
            {
                Console.WriteLine($"Unable to load manifest {manifestPath}. Please inspect error log for additional details.");
                return;
            }

            // ------------------------------------------------------------------------------------------------------------
            // List all the entities found in the manifest and allow the user to choose which entity to explore.

            while (true)
            {
                int index = 1;

                if (manifest.Entities.Count > 0)
                {
                    Console.WriteLine("List of all entities:");

                    foreach (var entDec in manifest.Entities)
                    {
                        // Print entity declarations.
                        // Assume there are only local entities in this manifest for simplicity.
                        Console.Write("  " + index.ToString().PadRight(3));
                        Console.Write("  " + entDec.EntityName.PadRight(35));
                        Console.WriteLine("  " + entDec.EntityPath);
                        index++;
                    }
                }

                if (manifest.SubManifests.Count > 0)
                {
                    Console.WriteLine("List of all sub-manifests:");

                    foreach (var manifestDecl in manifest.SubManifests)
                    {
                        // Print sub-manifest declarations.
                        Console.Write("  " + index.ToString().PadRight(3));
                        Console.Write("  " + manifestDecl.ManifestName.PadRight(35));
                        Console.WriteLine("  " + manifestDecl.Definition);
                        index++;
                    }
                }

                if (index == 1)
                {
                    Console.Write("No Entities or Sub-manifest found. Press [enter] to exit.");
                    Console.ReadLine();
                    break;
                }

                Console.WriteLine("Enter a number to show details for that Entity or Sub-manifest (press [enter] to exit): ");

                // Get the user's choice.
                string input = Console.ReadLine();
                if (string.IsNullOrEmpty(input))
                    break;

                // Make sure the user's input is a number.
                int num = 0;
                if (!int.TryParse(input, out num))
                {
                    Console.WriteLine("\nEnter a number.");
                    Console.WriteLine();
                    continue;
                }

                // User can select an entry that is a sub-manifest
                if (num > manifest.Entities.Count)
                {
                    int subNum = num - manifest.Entities.Count - 1;
                    // Re-enter this method supplying the absolute path of the submanifest definition (relative to the current manifest)
                    await ExploreManifest(cdmCorpus, cdmCorpus.Storage.CreateAbsoluteCorpusPath(manifest.SubManifests[subNum].Definition, manifest));
                    continue;
                }

                index = 1;
                foreach (var entityDec in manifest.Entities)
                {
                    if (index == num)
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

                            Console.WriteLine("Enter a number to show details for that metadata property (press [enter] to explore other entities):");

                            // Get the user's choice. 
                            input = Console.ReadLine();
                            if (string.IsNullOrEmpty(input))
                            {
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
                                        ListDataPartitionLocations(cdmCorpus, entityDec);
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
                    index++;
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
                Console.WriteLine("AppliedTraits:");
                foreach (var trait in attribute.AppliedTraits)
                {
                    PrintTrait(trait);
                }
                Console.WriteLine();
            }
        }

        static void ListTraits(CdmEntityDefinition entity)
        {
            Console.WriteLine($"\nList of all traits for the entity {entity.EntityName}:");
            foreach (CdmTraitReference trait in entity.ExhibitsTraits)
            {
                PrintTrait(trait);
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

        static void ListDataPartitionLocations(CdmCorpusDefinition cdmCorpus, CdmEntityDeclarationDefinition entityDec)
        {
            Console.WriteLine($"\nList of all data partition locations for the entity {entityDec.EntityName}:");
            foreach (CdmDataPartitionDefinition dataPartition in entityDec.DataPartitions)
            {
                // The data partition location.
                Console.WriteLine("  " + dataPartition.Location);

                if (!string.IsNullOrEmpty(dataPartition.Location))
                {
                    Console.WriteLine("  " + cdmCorpus.Storage.CorpusPathToAdapterPath(dataPartition.Location));
                }
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

        static void PrintTrait(CdmTraitReferenceBase trait)
        {
            if (!string.IsNullOrEmpty(trait.FetchObjectDefinitionName()))
            {
                Console.WriteLine("      " + trait.FetchObjectDefinitionName());

                if (trait is CdmTraitReference)
                {
                    foreach (var argDef in (trait as CdmTraitReference).Arguments)
                    {
                        if (argDef.Value is CdmEntityReference)
                        {
                            Console.WriteLine("         Constant: [");
                            var contEntDef = argDef.Value.FetchObjectDefinition<CdmConstantEntityDefinition>();
                            foreach (List<string> constantValueList in contEntDef.ConstantValues)
                            {
                                Console.WriteLine($"             [{string.Join(", ", constantValueList.ToArray())}]");
                            }
                            Console.WriteLine("         ]");
                        }
                        else
                        {
                            // Default output, nothing fancy for now
                            Console.WriteLine("         " + argDef.Value);
                        }
                    }
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
