// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package example;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;

import java.util.List;
import java.util.Scanner;
import org.apache.commons.lang3.StringUtils;

/**
 * -------------------------------------------------------------------------------------------------
 * This sample reads the content of a manifest document and lists all the entities that it knows
 * about. For a given entity, the sample will get the corresponding schema definition document for
 * that entity and allow the user to list its attributes, traits, properties, data partition file
 * locations, and relationships.
 * -------------------------------------------------------------------------------------------------
 */
public class Program {
  private final static Scanner SCANNER = new Scanner(System.in);

  public static void main(final String[] args) {

    // ---------------------------------------------------------------------------------------------
    // Instantiate a corpus. The corpus is the collection of all documents and folders created
    // or discovered while navigating objects and paths.

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    // ---------------------------------------------------------------------------------------------
    // Configure storage adapters and mount them to the corpus.

    // We want our storage adapters to point at the local manifest location
    // and at the example public standards.
    final String pathFromExeToExampleRoot = "../../";

    cdmCorpus.getStorage().mount(
        "local",
        new LocalAdapter(pathFromExeToExampleRoot + "1-read-manifest"));

    // 'local' is our default namespace.
    // Any paths that start navigating without a device tag (ex. 'cdm')
    // will just default to the 'local' namespace.
    cdmCorpus.getStorage().setDefaultNamespace("local");

    // Storage adapter pointing to the example public standards.
    // This is a fake 'cdm'; normally the Github adapter would be
    // used to point at the real public standards.
    // Mount it as the 'cdm' device, not the default,
    // so that we must use "cdm:<folder-path>" to get there.
    cdmCorpus.getStorage().mount(
        "cdm",
        new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

    // Example how to mount to the ADLS.
    // final AdlsAdapter adlsAdapter = new AdlsAdapter(
    //     "<ACCOUNT_NAME>.dfs.core.windows.net", // Hostname.
    //     "/<FILESYSTEM-NAME>", // Root.
    //     "72f988bf-86f1-41af-91ab-2d7cd011db47", // Tenant ID.
    //     "<CLIENT_ID>", // Client ID.
    //     "<CLIENT_SECRET>" // Client secret.
    // );
    // cdmCorpus.getStorage().mount("adls", adlsAdapter);

    // ---------------------------------------------------------------------------------------------
    // Open the default manifest file at the root.
    
    exploreManifest(cdmCorpus, "default.manifest.cdm.json");
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
          System.out.println(entityDeclaration.getEntityPath());
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

      System.out.print("Show details for Entity or Sub-manifest number (press [enter] to exit): ");
      // Get the user's choice.
      String input = SCANNER.nextLine();
      if (Strings.isNullOrEmpty(input)) {
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
          System.out.print(
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
            System.out.println("\nMetadata properties for the entity: "
              + entityDeclaration.getEntityName());
            System.out.println("  1: Attributes");
            System.out.println("  2: Traits");
            System.out.println("  3: Properties");
            System.out.println("  4: Data partition locations");
            System.out.println("  5: Relationships");

            System.out.println("Enter a number to show details for that metadata "
              +"property (press [enter] to explore other entities):");

            // Get the user's choice.
            input = SCANNER.nextLine();
            if (Strings.isNullOrEmpty(input)) {
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
        System.out.println("  AppliedTraits:");
        typeAttributeDefinition.getAppliedTraits().forEach(Program::printTrait);
        System.out.println();
      }
    }
  }

  static void listTraits(final CdmEntityDefinition entity) {
    System.out.println("\nList of all traits for the entity " + entity.getEntityName() + ":");
    entity.getExhibitsTraits().forEach(Program::printTrait);
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

      if (!Strings.isNullOrEmpty(dataPartition.getLocation())) {
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
    cdmCorpus.fetchIncomingRelationships(entity).forEach(Program::printRelationship);
    // Now loop through all the relationships where this entity points to other entities.
    cdmCorpus.fetchOutgoingRelationships(entity).forEach(Program::printRelationship);
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

  static void printTrait(CdmTraitReference trait) {
    if (!Strings.isNullOrEmpty(trait.fetchObjectDefinitionName())) {
      System.out.println("      " + trait.fetchObjectDefinitionName());

      for (CdmArgumentDefinition argDef : trait.getArguments()) {
        if (argDef.getValue() instanceof CdmEntityReference) {
          System.out.println("         Constant: [");

          CdmConstantEntityDefinition contEntDef = 
            ((CdmEntityReference)argDef.getValue()).fetchObjectDefinition();

          for (List<String> constantValueList : contEntDef.getConstantValues()) {
              System.out.println("             " + constantValueList);
          }
          System.out.println("         ]");
        }
        else
        {
          // Default output, nothing fancy for now
          System.out.println("         " + argDef.getValue());
        }
      }
    }
  }

  static void printProperty(final String propertyName, final String propertyValue) {
    if (!Strings.isNullOrEmpty(propertyValue)) {
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
