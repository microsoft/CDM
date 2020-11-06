// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;

import com.microsoft.commondatamodel.objectmodel.AdlsModelJsonTestHelper;
import com.microsoft.commondatamodel.objectmodel.AdlsTestHelper;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
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
import org.testng.annotations.Test;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.concurrent.ExecutionException;

public class ReadLocalSaveAdlsTest extends SampleTestBase{
    private static final String TEST_NAME = "TestReadLocalSaveAdls";

    private String rootRelativePath;

    @Test
    public void testReadLocalSaveAdls() throws IOException, InterruptedException, ExecutionException {
        this.checkSampleRunTestsFlag();
        AdlsTestHelper.checkADLSEnvironment();

        TestHelper.deleteFilesFromActualOutput(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));

        // Modify partition.location in model.json and save it into actual output
        rootRelativePath = "Samples/TestReadLocalSaveAdls/" + System.getenv("USERNAME") + "_" + System.getenv("COMPUTERNAME") + "_Java";
        AdlsModelJsonTestHelper.UpdateInputAndExpectedAndSaveToActualSubFolder(
                TESTS_SUBPATH,
                TEST_NAME,
                rootRelativePath,
                "model.json",
                "OrdersProductsCustomersLinked",
                OffsetDateTime.now().toString()
        );

        CdmCorpusDefinition cdmCorpus = setupCdmCorpus();
        readLocalSaveAdls(cdmCorpus);

        // Check the model.json file in ADLS and delete it.
        String actualContent = cdmCorpus.getStorage().fetchAdapter("adls").readAsync("model.json").join();
        AdlsModelJsonTestHelper.saveModelJsonToActualOutput(TESTS_SUBPATH, TEST_NAME, "model.json", actualContent);

        String expectedContent = AdlsModelJsonTestHelper.getExpectedFileContent(TESTS_SUBPATH, TEST_NAME, "model.json");
        TestHelper.assertSameObjectWasSerialized(expectedContent, actualContent);
    }

    private CdmCorpusDefinition setupCdmCorpus() throws InterruptedException {
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
                new LocalAdapter(TestHelper.SAMPLE_SCHEMA_FOLDER_PATH));
        cdmCorpus.getStorage().mount(
                "local",
                new LocalAdapter(
                        AdlsModelJsonTestHelper.getActualSubFolderPath(TESTS_SUBPATH, TEST_NAME, AdlsModelJsonTestHelper.INPUT_FOLDER_NAME)));

        // Example how to mount to the ADLS - make sure the hostname and root entered here are also changed.
        // In the example.model.json file we load in the next section.
        final AdlsAdapter adlsAdapter = AdlsTestHelper.createAdapterWithClientId(rootRelativePath);
        cdmCorpus.getStorage().mount("adls", adlsAdapter);
        return cdmCorpus;
    }

    private void readLocalSaveAdls(CdmCorpusDefinition cdmCorpus) throws ExecutionException, InterruptedException {
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
