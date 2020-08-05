// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package example;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.net.MalformedURLException;
import java.util.concurrent.ExecutionException;

/*
 * -------------------------------------------------------------------------------------------------
 * This sample demonstrates CDM Object Model use case in which a model.json file is loaded from a
 * local file-system, its content explored and then changed, and finally saved to an ADLSg2
 * destination.
 *
 * IMPORTANT: Before running this sample, make sure following is satisfied:
 *  1. The OM library is added to the assembly lookup path
 *  2. The MODEL_JSON_ROOT constant points to the location of the example.model.json file
 *  3. ADLSg2 adapter configuration is updated according to your env setup
 *  4. The partition location in model.json file is specifying the same ADLSg2 account and
 *     file-system settings
 *  5. Ensure the Azure user object is assigned "Storage Blob Data Contributor" role in the ADLSg2
 *     access management page
 *  ------------------------------------------------------------------------------------------------
 */
public class Program {
  private static final String MODEL_JSON_ROOT = "../sample-data";
  private static final String PATH_FROM_EXE_TO_EXAMPLE_ROOT = "../";

  public static void main(final String[] args) throws ExecutionException, InterruptedException {

    // ---------------------------------------------------------------------------------------------
    // Instantiate corpus and set up the default namespace to be local.

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");

    // ---------------------------------------------------------------------------------------------
    // Set up adapters for managing access to local FS, remote and ADLS locations.

    // Fake cdm, normally use the CDM Standards adapter.
    // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there.
    cdmCorpus.getStorage().mount(
        "cdm",
        new LocalAdapter(PATH_FROM_EXE_TO_EXAMPLE_ROOT + "../example-public-standards"));
    cdmCorpus.getStorage().mount("local", new LocalAdapter(MODEL_JSON_ROOT));

    // Example how to mount to the ADLS - make sure the hostname and root entered here are also changed.
    // In the example.model.json file we load in the next section.
    final AdlsAdapter adlsAdapter = new AdlsAdapter(
        "<ACCOUNT-NAME>.dfs.core.windows.net", // Hostname.
        "/<FILESYSTEM-NAME>", // Root.
        "72f988bf-86f1-41af-91ab-2d7cd011db47",  // Tenant ID.
        "<CLIENT-ID>",  // Client ID.
        "<CLIENT-SECRET>" // Client secret.
    );
    cdmCorpus.getStorage().mount("adls", adlsAdapter);

    // ---------------------------------------------------------------------------------------------
    // Load a model.json file from local FS.
    final CdmManifestDefinition manifest =
        cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/model.json").get();

    // ---------------------------------------------------------------------------------------------
    // Explore entities and partitions defined in the model
    System.out.println("Listing entity declarations:");
    manifest.getEntities().forEach(decl -> {
      System.out.println("  " + decl.getEntityName());
      if (decl.getObjectType() == CdmObjectType.LocalEntityDeclarationDef) {
        decl.getDataPartitions().forEach((dataPart) ->
            System.out.println("    " + dataPart.getLocation()));
      }
    });

    // ---------------------------------------------------------------------------------------------
    // Make changes to the model.

    // Create a new document where the new entity's definition will be stored.
    final CdmDocumentDefinition newEntityDoc = cdmCorpus.makeObject(
        CdmObjectType.DocumentDef,
        "NewEntity.cdm.json",
        false);
    newEntityDoc.getImports().add("cdm:/foundations.cdm.json");
    cdmCorpus.getStorage().fetchRootFolder("local").getDocuments().add(newEntityDoc);

    final CdmEntityDefinition newEntity =
        (CdmEntityDefinition) newEntityDoc
            .getDefinitions()
            .add(CdmObjectType.EntityDef, "NewEntity");

    // Define new string attribute and add it to the entity definition.
    final CdmTypeAttributeDefinition newAttribute = cdmCorpus.makeObject(
        CdmObjectType.TypeAttributeDef,
        "NewAttribute",
        false);
    newAttribute.updateDataFormat(CdmDataFormat.String);
    newEntity.getAttributes().add(newAttribute);

    // Call will create EntityDeclarationDefinition
    // based on entity definition and add it to manifest.getEntities().
    final CdmEntityDeclarationDefinition newEntityDecl = manifest.getEntities().add(newEntity);

    // Define a partition and add it to the local declaration
    final CdmDataPartitionDefinition newPartition = cdmCorpus.makeObject(
        CdmObjectType.DataPartitionDef,
        "NewPartition",
        false);
    newPartition.setLocation("adls:/NewPartition.csv");
    newEntityDecl.getDataPartitions().add(newPartition);

    // ---------------------------------------------------------------------------------------------
    // Save the file to ADLSg2 - we achieve that by adding the manifest to the root folder of
    // the ADLS file-system and performing a save on the manifest.

    final CdmFolderDefinition adlsFolder = cdmCorpus.getStorage().fetchRootFolder("adls");
    adlsFolder.getDocuments().add(manifest);
    manifest.saveAsAsync("model.json", true).get();
  }
}