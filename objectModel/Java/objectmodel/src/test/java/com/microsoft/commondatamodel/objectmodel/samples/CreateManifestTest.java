// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.ExecutionException;

public class CreateManifestTest extends SampleTestBase {
    private static final String TEST_NAME = "TestCreateManifest";

    @Test
    public void testCreateManifest() {
        this.checkSampleRunTestsFlag();

        try {
            TestHelper.deleteFilesFromActualOutput(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
            createManifest(setupCdmCorpus());
            TestHelper.assertFolderFilesEquality(
                    TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, TEST_NAME),
                    TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME), true);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    private static CdmCorpusDefinition setupCdmCorpus() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
        cdmCorpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME)));
        cdmCorpus.getStorage().setDefaultNamespace("local");
        cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SAMPLE_SCHEMA_FOLDER_PATH));
        return cdmCorpus;
    }

    private static void createManifest(CdmCorpusDefinition cdmCorpus) throws ExecutionException, InterruptedException, IOException {
        System.out.println("Make placeholder manifest.");
        // Make the temp manifest and add it to the root of the local documents in the corpus.
        CdmManifestDefinition manifestAbstract =
                cdmCorpus.makeObject(CdmObjectType.ManifestDef, "tempAbstract");

        // Add each declaration, this example is about medical appointments and care plans.
        manifestAbstract.getEntities().add("Account", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");
        manifestAbstract.getEntities().add("Address", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Address.cdm.json/Address");
        manifestAbstract.getEntities().add("CarePlan", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CarePlan.cdm.json/CarePlan");
        manifestAbstract.getEntities().add("CodeableConcept", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CodeableConcept.cdm.json/CodeableConcept");
        manifestAbstract.getEntities().add("Contact", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Contact.cdm.json/Contact");
        manifestAbstract.getEntities().add("Device", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Device.cdm.json/Device");
        manifestAbstract.getEntities().add("EmrAppointment", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EmrAppointment.cdm.json/EmrAppointment");
        manifestAbstract.getEntities().add("Encounter", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Encounter.cdm.json/Encounter");
        manifestAbstract.getEntities().add("EpisodeOfCare", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EpisodeOfCare.cdm.json/EpisodeOfCare");
        manifestAbstract.getEntities().add("Location", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Location.cdm.json/Location");

        // Add the temp manifest to the root of the local documents in the corpus.
        CdmFolderDefinition localRoot = cdmCorpus.getStorage().fetchRootFolder("local");
        localRoot.getDocuments().add(manifestAbstract);

        // Create the resolved version of everything in the root folder too.
        System.out.println("Resolve the placeholder.");
        CdmManifestDefinition manifestResolved =
                manifestAbstract.createResolvedManifestAsync("default", "").get();

        // Add an import to the foundations doc so the traits about partitions will resolve nicely.
        manifestResolved.getImports().add("cdm:/foundations.cdm.json", "");

        System.out.println("Save the documents.");
        for (CdmEntityDeclarationDefinition eDef : manifestResolved.getEntities()) {
            // Get the entity being pointed at.
            CdmEntityDeclarationDefinition localEDef = eDef;
            CdmEntityDefinition entDef = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync(localEDef.getEntityPath(),
                    manifestResolved).get();
            // Make a fake partition, just to demo that.
            CdmDataPartitionDefinition part = cdmCorpus
                    .makeObject(CdmObjectType.DataPartitionDef, entDef.getEntityName() + "-data-description");
            localEDef.getDataPartitions().add(part);
            part.setExplanation("not real data, just for demo");

            // Define the location of the partition, relative to the manifest
            String location = "local:/" + entDef.getEntityName() + "/partition-data.csv";
            part.setLocation(cdmCorpus.getStorage().createRelativeCorpusPath(location, manifestResolved));

            // Add trait to partition for csv params.
            CdmTraitReference csvTrait = (CdmTraitReference) part.getExhibitsTraits().add("is.partition.format.CSV");
            csvTrait.getArguments().add("columnHeaders", "true");
            csvTrait.getArguments().add("delimiter", ",");

            // Get the actual location of the partition file from the corpus.
            String partPath = cdmCorpus.getStorage().corpusPathToAdapterPath(location);

            // Make a fake file with nothing but header for columns.
            String header = "";
            for (CdmAttributeItem att : entDef.getAttributes()) {
                if (att instanceof CdmTypeAttributeDefinition) {
                    CdmTypeAttributeDefinition attributeDef = (CdmTypeAttributeDefinition) att;
                    if (!"".equals(header)) {
                        header += ",";
                    }
                    header += attributeDef.getName();
                }
            }

            String folderPath = cdmCorpus.getStorage().corpusPathToAdapterPath("local:/" + entDef.getEntityName());
            File newFolder = new File(folderPath);
            if (!newFolder.exists() && !newFolder.mkdir()) {
                throw new RuntimeException("Cannot create new folder at: " + folderPath);
            }
            writeStringToFile(partPath, header);
        }
        manifestResolved.saveAsAsync(manifestResolved.getManifestName() + ".manifest.cdm.json", true).get();
    }

    /**
     * Write the result to the given path.
     *
     * @param pathName Path to the file.
     * @param str      The result.
     * @throws IOException
     */
    private static void writeStringToFile(String pathName, String str) throws IOException {
        Path path = new File(pathName).toPath();
        byte[] strToBytes = str.getBytes();
        Files.write(path, strToBytes);
    }
}
