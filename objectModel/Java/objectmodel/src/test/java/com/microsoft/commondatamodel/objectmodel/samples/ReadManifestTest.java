// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;


import com.microsoft.commondatamodel.objectmodel.FileReadWriteUtil;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.EventCallback;
import org.apache.commons.lang3.StringUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.List;
import java.util.Scanner;

public class ReadManifestTest extends SampleTestBase {
    private static final String TEST_NAME = "TestReadManifest";
    private static Scanner SCANNER = null;

    @Test
    public void testReadManifest() {
        this.checkSampleRunTestsFlag();

        try {
            TestHelper.deleteFilesFromActualOutput(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
            String testInputPath = new File(TestHelper.getInputFolderPath(TESTS_SUBPATH, TEST_NAME), "input.txt").toString();
            String testActualOutputPath = new File(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME), "output.txt").toString();

            FileInputStream fileInputStream = new FileInputStream(new File(testInputPath));
            PrintStream printStream = new PrintStream(new File(testActualOutputPath));

            SCANNER = new Scanner(fileInputStream);
            System.setOut(printStream);

            exploreManifest(setupCdmCorpus(), "default.manifest.cdm.json");

            // Set system.out back to avoid recording tests information in the output.txt
            fileInputStream.close();
            printStream.close();
            System.setOut(System.out);

            String actualOutputContent = FileReadWriteUtil.readFileToString(testActualOutputPath);
            // Remove the partition absolute location in the output.txt
            actualOutputContent = actualOutputContent.replaceAll("partition-data.csv[^\n]*\n[^\n]*partition-data.csv", "partition-data.csv");
            // Remove the id from is.identifiedBy trait e.g. com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference@2427e004
            actualOutputContent = actualOutputContent.replaceAll("com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference@[^\n]*\n", "com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference\n");
            FileReadWriteUtil.writeStringToFile(testActualOutputPath, actualOutputContent);

            TestHelper.assertFileContentEquality(
                    FileReadWriteUtil.readFileToString(new File(TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, TEST_NAME), "output-Java.txt").toString()),
                    actualOutputContent
            );
        } catch (InterruptedException | IOException e) {
            Assert.fail(e.getMessage());
        }
    }

    private CdmCorpusDefinition setupCdmCorpus() throws InterruptedException {
        final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
        cdmCorpus.setEventCallback((level, message) -> {
            Assert.fail(message);
        }, CdmStatusLevel.Warning);
        
        cdmCorpus.getStorage().mount(
                "local",
                new LocalAdapter(TestHelper.getInputFolderPath(TESTS_SUBPATH, TEST_NAME)));
        cdmCorpus.getStorage().setDefaultNamespace("local");
        cdmCorpus.getStorage().mount(
                "cdm",
                new LocalAdapter(TestHelper.SAMPLE_SCHEMA_FOLDER_PATH));
        return cdmCorpus;
    }

    static void exploreManifest(CdmCorpusDefinition cdmCorpus, String manifestPath) {
        // ---------------------------------------------------------------------------------------------
        // List all the entities found in the manifest
        // and allow the user to choose which entity to explore.

        System.out.println("\nLoading manifest " + manifestPath + " ...");

        CdmManifestDefinition manifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(manifestPath).join();

        if (manifest == null) {
            System.err.println("Unable to load manifest " + manifestPath + ". Please inspect error log for additional details.");
            return;
        }

        while (true) {
            int index = 1;

            if (manifest.getEntities().size() > 0) {
                System.out.println("List of all entities:");

                for (final CdmEntityDeclarationDefinition entityDeclaration : manifest.getEntities()) {
                    // Print entity declarations.
                    // Assume there are only local entities in this manifest for simplicity.
                    System.out.print("  " + StringUtils.rightPad(Integer.toString(index), 3));
                    System.out.print("  " + StringUtils.rightPad(entityDeclaration.getEntityName(), 35));
                    System.out.println("  " + entityDeclaration.getEntityPath());
                    index++;
                }
            }

            if (manifest.getSubManifests().size() > 0) {
                System.out.println("List of all sub-manifests:");

                for (final CdmManifestDeclarationDefinition manifestDeclaration : manifest.getSubManifests()) {
                    // Print sub-manifest declarations.
                    System.out.print("  " + StringUtils.rightPad(Integer.toString(index), 3));
                    System.out.print("  " + StringUtils.rightPad(manifestDeclaration.getManifestName(), 35));
                    System.out.println(manifestDeclaration.getDefinition());
                    index++;
                }
            }

            if (index == 1) {
                System.out.println("No Entities or Sub-manifest found. Press [enter] to exit.");
                SCANNER.nextLine();
                break;
            }

            System.out.println("Enter a number to show details for that Entity or Sub-manifest (press [enter] to exit): ");
            // Get the user's choice.
            String input = SCANNER.nextLine();
            if (com.microsoft.commondatamodel.objectmodel.utilities.StringUtils.isNullOrEmpty(input)) {
                break;
            }

            // Make sure the user's input is a number.
            final int num;

            try {
                num = Integer.parseInt(input);
            } catch (final NumberFormatException ne) {
                System.out.println("\nEnter a number.");
                System.out.println();
                continue;
            }

            if (num > manifest.getEntities().size()) {
                int subNum = num - manifest.getEntities().size() - 1;
                exploreManifest(cdmCorpus, cdmCorpus.getStorage().createAbsoluteCorpusPath(manifest.getSubManifests().get(subNum).getDefinition(), manifest));
                continue;
            }

            index = 1;
            for (final CdmEntityDeclarationDefinition entityDeclaration : manifest.getEntities()) {
                if (index == num) {
                    System.out.println(
                            "Reading the entity schema and resolving with the standard docs, "
                                    + "first one may take a second ...");

                    // From the path to the entity, get the actual schema description.
                    // Take the local relative path in this doc and make sure it works.
                    final CdmEntityDefinition entSelected =
                            cdmCorpus.<CdmEntityDefinition>fetchObjectAsync(
                                    entityDeclaration.getEntityPath(),
                                    manifest)
                                    .join(); // Gets the entity object from the doc.

                    while (true) {
                        System.out.println("\nMetadata properties for the entity "
                                + entityDeclaration.getEntityName() + ":");
                        System.out.println("  1: Attributes");
                        System.out.println("  2: Traits");
                        System.out.println("  3: Properties");
                        System.out.println("  4: Data partition locations");
                        System.out.println("  5: Relationships");

                        System.out.println("Enter a number to show details for that metadata "
                                + "property (press [enter] to explore other entities):");

                        // Get the user's choice.
                        input = SCANNER.nextLine();
                        if (com.microsoft.commondatamodel.objectmodel.utilities.StringUtils.isNullOrEmpty(input)) {
                            break;
                        }

                        // Make sure the user's input is a number.
                        final int choice;
                        try {
                            choice = Integer.parseInt(input);
                            switch (choice) {
                                // List the entity's attributes.
                                case 1:
                                    listAttributes(entSelected);
                                    break;
                                // List the entity's traits.
                                case 2:
                                    listTraits(entSelected);
                                    break;
                                // List the entity's properties.
                                case 3:
                                    listProperties(entSelected, entityDeclaration);
                                    break;
                                // List the entity's data partition locations.
                                case 4:
                                    listDataPartitionLocations(cdmCorpus, entityDeclaration);
                                    break;
                                // List the entity's relationships.
                                case 5:
                                    if (manifest.getRelationships() != null
                                            && manifest.getRelationships().getCount() > 0) {
                                        // The manifest file contains pre-calculated entity relationships,
                                        // so we can read them directly.
                                        listRelationshipsFromManifest(manifest, entSelected);
                                    } else {
                                        // The manifest file doesn't contain relationships,
                                        // so we have to compute the relationships first.
                                        cdmCorpus.calculateEntityGraphAsync(manifest).join();
                                        listRelationships(cdmCorpus, entSelected);
                                    }
                                    break;
                                default:
                                    System.out.println("\nEnter a number between 1-5.");
                                    break;
                            }
                        } catch (final NumberFormatException ne) {
                            System.out.println("\nEnter a number.");
                        }
                    }
                }
                index++;
            }
        }
    }

    static void listAttributes(final CdmEntityDefinition entity) {
        System.out.println("\nList of all attributes for the entity " + entity.getEntityName() + ":");

        // This way of getting the attributes only works well for 'resolved' entities
        // that have been flattened out.
        // An abstract entity can be resolved by calling createResolvedEntity on it.
        for (final CdmAttributeItem attribute : entity.getAttributes()) {
            if (attribute instanceof CdmTypeAttributeDefinition) {
                final CdmTypeAttributeDefinition typeAttributeDefinition =
                        (CdmTypeAttributeDefinition) attribute;
                // Attribute's name.
                printProperty("Name", typeAttributeDefinition.getName());
                // Attribute's data format.
                printProperty("DataFormat", typeAttributeDefinition.fetchDataFormat().name());
                // And all the traits of this attribute.
                System.out.println("AppliedTraits:");
                typeAttributeDefinition.getAppliedTraits().forEach(ReadManifestTest::printTrait);
                System.out.println();
            }
        }
    }

    static void listTraits(final CdmEntityDefinition entity) {
        System.out.println("\nList of all traits for the entity " + entity.getEntityName() + ":");
        entity.getExhibitsTraits().forEach(ReadManifestTest::printTrait);
    }

    static void listProperties(
            final CdmEntityDefinition entity,
            final CdmEntityDeclarationDefinition entityDec) {
        System.out.println("\nList of all properties for the entity " + entity.getEntityName() + ":");
        // Entity's name.
        printProperty("EntityName", entityDec.getEntityName());
        // Entity that this entity extends from.
        if (entity.getExtendsEntity() != null) {
            printProperty(
                    "ExtendsEntity",
                    entity.getExtendsEntity().fetchObjectDefinitionName());
        }
        // Entity's display name.
        printProperty("DisplayName", entity.getDisplayName());
        // Entity's description.
        printProperty("Description", entity.getDescription());
        // Version.
        printProperty("Version", entity.getVersion());
        if (entity.getCdmSchemas() != null) {
            // Cdm schemas.
            System.out.println("  CdmSchemas:");
            entity.getCdmSchemas().forEach(schema -> System.out.println("      " + schema));
        }
        // Entity's source name.
        printProperty("SourceName", entity.getSourceName());
        // Last file modified time.
        if (entityDec.getLastFileModifiedTime() != null) {
            printProperty(
                    "LastFileModifiedTime",
                    entityDec.getLastFileModifiedTime().toString());
        }
        if (entityDec.getLastFileStatusCheckTime() != null) {
            // Last file status check time.
            printProperty(
                    "LastFileStatusCheckTime",
                    entityDec.getLastFileStatusCheckTime().toString());
        }
    }

    static void listDataPartitionLocations(final CdmCorpusDefinition cdmCorpus, final CdmEntityDeclarationDefinition entityDeclaration) {
        System.out.println("\nList of all data partition locations for the entity " +
                entityDeclaration.getEntityName() + ":");
        for (final CdmDataPartitionDefinition dataPartition : entityDeclaration.getDataPartitions()) {
            // The data partition location.
            System.out.println("  " + dataPartition.getLocation());

            if (!com.microsoft.commondatamodel.objectmodel.utilities.StringUtils.isNullOrEmpty(dataPartition.getLocation())) {
                System.out.println("  " + cdmCorpus.getStorage().corpusPathToAdapterPath(dataPartition.getLocation()));
            }
        }
    }

    static void listRelationships(
            final CdmCorpusDefinition cdmCorpus,
            final CdmEntityDefinition entity) {
        System.out.println(
                "\nList of all relationships for the entity " + entity.getEntityName() + ":"
        );
        // Loop through all the relationships where other entities point to this entity.
        cdmCorpus.fetchIncomingRelationships(entity).forEach(ReadManifestTest::printRelationship);
        // Now loop through all the relationships where this entity points to other entities.
        cdmCorpus.fetchOutgoingRelationships(entity).forEach(ReadManifestTest::printRelationship);
    }

    static void listRelationshipsFromManifest(
            final CdmManifestDefinition manifest,
            final CdmEntityDefinition entity) {
        System.out.println(
                "\nList of all relationships for the entity " + entity.getEntityName() + ":"
        );
        for (final CdmE2ERelationship relationship : manifest.getRelationships()) {
            // Currently, the easiest way to get a specific entity's relationships
            // (given a resolved manifest) is to just look at all the entity relationships
            // in the resolved manifest, and then filtering.
            if (relationship.getFromEntity().contains(entity.getEntityName())
                    || relationship.getToEntity().contains(entity.getEntityName())) {
                printRelationship(relationship);
            }
        }
    }

    static void printTrait(CdmTraitReferenceBase trait) {
        if (!com.microsoft.commondatamodel.objectmodel.utilities.StringUtils.isNullOrEmpty(trait.fetchObjectDefinitionName())) {
            System.out.println("      " + trait.fetchObjectDefinitionName());

            if (trait instanceof CdmTraitReference) {
                for (CdmArgumentDefinition argDef : ((CdmTraitReference) trait).getArguments()) {
                    if (argDef.getValue() instanceof CdmEntityReference) {
                        System.out.println("         Constant: [");

                        CdmConstantEntityDefinition contEntDef =
                                ((CdmEntityReference) argDef.getValue()).fetchObjectDefinition();

                        for (List<String> constantValueList : contEntDef.getConstantValues()) {
                            System.out.println("             " + constantValueList);
                        }
                        System.out.println("         ]");
                    } else {
                        // Default output, nothing fancy for now
                        System.out.println("         " + argDef.getValue());
                    }
                }
            }
        }
    }

    static void printProperty(final String propertyName, final String propertyValue) {
        if (!com.microsoft.commondatamodel.objectmodel.utilities.StringUtils.isNullOrEmpty(propertyValue)) {
            System.out.println("  " + propertyName + ":" + " " + propertyValue);
        }
    }

    static void printRelationship(final CdmE2ERelationship relationship) {
        System.out.println("  FromEntity: " + relationship.getFromEntity());
        System.out.println("  FromEntityAttribute: " + relationship.getFromEntityAttribute());
        System.out.println("  ToEntity: " + relationship.getToEntity());
        System.out.println("  ToEntityAttribute: " + relationship.getToEntityAttribute());
        System.out.println();
    }
}
