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
import com.microsoft.commondatamodel.objectmodel.enums.CdmIncrementalPartitionType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.PartitionFileStatusCheckType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.exceptions.CdmReadPartitionFromPatternException;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SearchPartitionPatternTest extends SampleTestBase {
    private static final String TEST_NAME = "TestSearchPartitionPattern";

    @Test
    public void testSearchPartitionPattern() throws CdmReadPartitionFromPatternException, InterruptedException, IOException {
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
                TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME), true);
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

    private void searchPartitionPattern(CdmCorpusDefinition cdmCorpus) throws CdmReadPartitionFromPatternException {
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
        final CdmEntityDeclarationDefinition accountDeclarationDefinition =
                manifestAbstract.getEntities()
                        .add(sampleEntityName,
                                "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");

        // Create a data partition pattern.
        final CdmDataPartitionPatternDefinition dataPartitionPattern = createPartitionPatternDefinition(cdmCorpus,"sampleDataPartitionPattern");
        dataPartitionPattern.setExplanation(
                "/ capture 4 digits / capture a word / capture one or more digits "
                        + "after the word cohort but before .csv"
        );
        System.out.println("    Assign regular expression of the data partition pattern to: "
                + dataPartitionPattern.getRegularExpression());
        System.out.println("    Assign root location of the data partition pattern to: "
                + dataPartitionPattern.getRootLocation());

        // Add the data partition pattern we just created to the entity data partition pattern collection.
        accountDeclarationDefinition.getDataPartitionPatterns().add(dataPartitionPattern);

        // Create incremental partition patterns
        final CdmDataPartitionPatternDefinition upsertIncrementalPartitionPattern = createPartitionPatternDefinition(cdmCorpus,"UpsertPattern",true, true);
        addIncrementalPartitionTrait(upsertIncrementalPartitionPattern, CdmIncrementalPartitionType.Upsert);
        System.out.println("    Assign regular expression of first incremental partition pattern to: "
                + upsertIncrementalPartitionPattern.getRegularExpression());
        System.out.println("    Assign root location of the first incremental partition pattern to: "
                + upsertIncrementalPartitionPattern.getRootLocation());

        final CdmDataPartitionPatternDefinition deleteIncrementalPartitionPattern = createPartitionPatternDefinition(cdmCorpus,"DeletePattern", true);
        addIncrementalPartitionTrait(deleteIncrementalPartitionPattern, CdmIncrementalPartitionType.Delete, "FullDataPattern");
        System.out.println("    Assign regular expression of second incremental partition pattern to: "
                + deleteIncrementalPartitionPattern.getRegularExpression());
        System.out.println("    Assign root location of the second incremental partition pattern to: "
                + deleteIncrementalPartitionPattern.getRootLocation());

        // Add the incremental partition patterns we just created to the entity increment partition pattern collection
        accountDeclarationDefinition.getIncrementalPartitionPatterns().add(upsertIncrementalPartitionPattern);
        accountDeclarationDefinition.getIncrementalPartitionPatterns().add(deleteIncrementalPartitionPattern);

        // Add an import to the foundations doc so the traits about partitions will resolve nicely
        manifestAbstract.getImports().add("cdm:/foundations.cdm.json");

        // Calling FileStatusCheckAsync to pick up the all data partition files
        // which names match the data partition pattern, and add them to the entity in the manifest.
        manifestAbstract.fileStatusCheckAsync(PartitionFileStatusCheckType.FullAndIncremental).join();

        // List all data partition locations.
        System.out.println("\nList of all data partition locations for the entity Account matches the data partition pattern: ");

        for (CdmDataPartitionDefinition dataPartition :
                accountDeclarationDefinition.getDataPartitions()) {
            System.out.println("    " + dataPartition.getLocation());
        }

        // List all incremental partition locations.
        System.out.println("\nList of all incremental partition locations for the entity Account matches the incremental partition pattern: ");

        for (CdmDataPartitionDefinition incrementalPartition :
                accountDeclarationDefinition.getIncrementalPartitions()) {
            System.out.println("    " + incrementalPartition.getLocation());
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

    /**
     * Add incremental partition trait "is.partition.incremental" and supplied arguments to the given data partition pattern.
     *
     * @param patternDef    The data partition pattern.
     * @param type          The CdmIncrementalPartitionType, this is a required argument for the incremental trait.
     */
    private static void addIncrementalPartitionTrait(final CdmDataPartitionPatternDefinition patternDef, final CdmIncrementalPartitionType type) {
        addIncrementalPartitionTrait(patternDef, type, null);
    }

    /**
     * Add incremental partition trait "is.partition.incremental" and supplied arguments to the given data partition pattern.
     *
     * @param patternDef                            The data partition pattern.
     * @param type                                  The CdmIncrementalPartitionType, this is a required argument for the incremental trait.
     * @param fullDataPartitionPatternName          The name of the full data partition pattern name, this is optional.
     */
    private static void addIncrementalPartitionTrait(final CdmDataPartitionPatternDefinition patternDef, final CdmIncrementalPartitionType type, final String fullDataPartitionPatternName) {
        final ImmutablePair<String, Object> typeTuple = new ImmutablePair<>("type", type.toString());
        List<Pair<String, Object>> arguments = new ArrayList<>(Collections.singletonList(typeTuple));
        if (fullDataPartitionPatternName != null) {
            arguments.add(new ImmutablePair<>("fullDataPartitionPatternName", fullDataPartitionPatternName));
        }
        patternDef.getExhibitsTraits().add("is.partition.incremental", arguments);
    }

    /**
     * Create a CdmDataPartitionPatternDefinition object with the given name and set up the required properties of the object.
     *
     * @param corpus                                The corpus.
     * @param name                                  The name of the data partition pattern object.
     */
    private static CdmDataPartitionPatternDefinition createPartitionPatternDefinition(final CdmCorpusDefinition corpus, final String name) {
        return createPartitionPatternDefinition(corpus, name, false, false);
    }

    /**
     * Create a CdmDataPartitionPatternDefinition object with the given name and set up the required properties of the object.
     *
     * @param corpus                                The corpus.
     * @param name                                  The name of the data partition pattern object.
     * @param isIncrementalPartitionPattern         Whether this is an incrmental partition pattern object.
     */
    private static CdmDataPartitionPatternDefinition createPartitionPatternDefinition(final CdmCorpusDefinition corpus, final String name, final boolean isIncrementalPartitionPattern) {
        return createPartitionPatternDefinition(corpus, name, isIncrementalPartitionPattern, false);
    }

    /**
     * Create a CdmDataPartitionPatternDefinition object with the given name and set up the required properties of the object.
     *
     * @param corpus                                The corpus.
     * @param name                                  The name of the data partition pattern object.
     * @param isIncrementalPartitionPattern         Whether this is an incrmental partition pattern object.
     * @param isUpsert                              Whether this is an upsert incrmental partition pattern object.
     */
    private static CdmDataPartitionPatternDefinition createPartitionPatternDefinition(final CdmCorpusDefinition corpus, final String name, final boolean isIncrementalPartitionPattern, final boolean isUpsert) {
        final CdmDataPartitionPatternDefinition partitionPattern = corpus.makeObject(CdmObjectType.DataPartitionPatternDef, name, false);
        partitionPattern.setRootLocation(isIncrementalPartitionPattern ? "/IncrementalData" : "FullData");
        if (!isIncrementalPartitionPattern) {
            // the line below demonstrates using "GlobPattern" which can be used instead of "RegularExpression"
            // dataPartitionPattern.setGlobPattern("/*/cohort*.csv");
            partitionPattern.setRegularExpression("/(\\d{4})/(\\w+)/cohort(\\d+)\\.csv$");
            partitionPattern.setParameters(Arrays.asList("year", "month", "cohortNumber"));
        } else {
            final String folderName = isUpsert ? "Upserts" : "Deletes";
            final String partitionNumberString = isUpsert ? "upsertPartitionNumber" : "deletePartitionNumber";
            partitionPattern.setRegularExpression("/(.*)/(.*)/(.*)/" + folderName + "/(\\d+)\\.csv$");
            partitionPattern.setParameters(Arrays.asList("year", "month", "day", partitionNumberString));
        }

        return partitionPattern;
    }
}
