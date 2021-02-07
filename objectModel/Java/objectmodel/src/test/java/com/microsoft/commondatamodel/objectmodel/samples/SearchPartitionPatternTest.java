// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;

import com.microsoft.commondatamodel.objectmodel.FileReadWriteUtil;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Arrays;

public class SearchPartitionPatternTest extends SampleTestBase{
    private static final String TEST_NAME = "TestSearchPartitionPattern";

    @Test
    public void testSearchPartitionPattern() throws InterruptedException, IOException {
        this.checkSampleRunTestsFlag();

        TestHelper.deleteFilesFromActualOutput(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
        TestHelper.copyFilesFromInputToActualOutput(TESTS_SUBPATH, TEST_NAME);

        searchPartitionPattern(setupCdmCorpus());

        // Replace all the "lastFileStatusCheckTime" value in the manifest to "2020-08-01T00:00:00.000Z".
        String manifestPath = Paths.get(
                TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME),
                "default.manifest.cdm.json").toString();
        String content = FileReadWriteUtil.readFileToString(manifestPath);
        content = content.replaceAll("\"lastFileStatusCheckTime\" : \".*\"", "\"lastFileStatusCheckTime\" : \"2020-08-01T00:00:00.000Z\"");
        content = content.replaceAll("\"lastFileModifiedTime\" : \".*\"", "\"lastFileModifiedTime\" : \"2020-08-02T00:00:00.000Z\"");
        content = content.replaceAll("\"lastChildFileModifiedTime\" : \".*\"", "\"lastChildFileModifiedTime\" : \"2020-08-02T00:00:00.000Z\"");
        FileReadWriteUtil.writeStringToFile(manifestPath, content);

        TestHelper.assertFolderFilesEquality(
                TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, TEST_NAME),
                TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
    }

    private CdmCorpusDefinition setupCdmCorpus() throws InterruptedException {
        final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
        cdmCorpus.getStorage().mount(
                "local",
                new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME)));
        cdmCorpus.getStorage().setDefaultNamespace("local");
        cdmCorpus.getStorage().mount(
                "cdm",
                new LocalAdapter(TestHelper.SAMPLE_SCHEMA_FOLDER_PATH));
        return cdmCorpus;
    }

    private void searchPartitionPattern(CdmCorpusDefinition cdmCorpus) {
        String sampleEntityName = "Account";

        System.out.println("Make placeholder manifest.");
        // Make the temp manifest and add it to the root of the local documents in the corpus.
        final CdmManifestDefinition manifestAbstract =
                cdmCorpus.makeObject(CdmObjectType.ManifestDef, "tempAbstract");

        // Add the temp manifest to the root of the local documents in the corpus.
        final CdmFolderDefinition localRoot = cdmCorpus.getStorage().fetchRootFolder("local");
        localRoot.getDocuments().add(manifestAbstract, "tempAbstract.manifest.cdm.json");

        // Add an entity named Account from some public standards.
        System.out.println("Add an entity named Account from some public standards.");
        final CdmEntityDeclarationDefinition personDeclarationDefinition =
                manifestAbstract.getEntities()
                        .add(
                                sampleEntityName,
                                "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");

        // Create a data partition pattern.
        final CdmDataPartitionPatternDefinition dataPartitionPattern =
                cdmCorpus.makeObject(
                        CdmObjectType.DataPartitionPatternDef,
                        "sampleDataPartitionPattern",
                        false);
        dataPartitionPattern.setRootLocation("dataFiles");
        dataPartitionPattern.setRegularExpression("/(\\d{4})/(\\w+)/cohort(\\d+)\\.csv$");
        // the line below demonstrates using "GlobPattern" which can be used instead of "RegularExpression"
        // dataPartitionPattern.setGlobPattern("/*/cohort*.csv");
        System.out.println("    Assign regular expression of the data partition pattern to: "
                + dataPartitionPattern.getRegularExpression());
        System.out.println("    Assign root location of the data partition pattern to: "
                + dataPartitionPattern.getRootLocation());
        dataPartitionPattern.setExplanation(
                "/ capture 4 digits / capture a word / capture one or more digits "
                        + "after the word cohort but before .csv"
        );
        dataPartitionPattern.setParameters(Arrays.asList("year", "month", "cohortNumber"));

        // Add the data partition pattern we just created to the entity data partition pattern collection.
        personDeclarationDefinition.getDataPartitionPatterns().add(dataPartitionPattern);

        // Calling FileStatusCheckAsync to pick up the all data partition files
        // which names match the data partition pattern, and add them to the entity in the manifest.
        manifestAbstract.fileStatusCheckAsync().join();

        // List all data partition locations.
        System.out.println("\nList of all data partition locations for the entity Account matches the data partition pattern: ");

        for (CdmDataPartitionDefinition dataPartition :
                personDeclarationDefinition.getDataPartitions()) {
            System.out.println("    " + dataPartition.getLocation());
        }

        System.out.println("Resolve the manifest");
        final CdmManifestDefinition manifestResolved =
                manifestAbstract.createResolvedManifestAsync(
                        "default",
                        null).join();
        manifestResolved.saveAsAsync(
                manifestResolved.getManifestName() + ".manifest.cdm.json",
                true).join();

        // You can save the doc as a model.json format as an option.
        // manifestResolved.saveAsAsync("model.json", true).join();
    }
}
