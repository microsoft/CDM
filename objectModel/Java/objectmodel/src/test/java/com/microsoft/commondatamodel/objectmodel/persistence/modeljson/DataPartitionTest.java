// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import org.apache.commons.lang3.StringUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DataPartitionTest extends ModelJsonTestBase {
    /**
     * The path between TestDataPath and TestName.
     */
    private final String TESTS_SUBPATH =
        new File(
            new File("persistence", "modeljson"), "datapartition")
            .toString();

    /**
     * Testing whether DataPartition Location is consistently populated when:
     * 1. Manifest is read directly.
     * 2. Manifest is obtained by converting a model.json.
     */
    @Test
    public void testModelJsonDataPartitionLocationConsistency() throws ExecutionException, InterruptedException, IOException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testModelJsonDataPartitionLocationConsistency");
    final CdmManifestDefinition manifestRead =
        cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            "default.manifest.cdm.json",
            cdmCorpus.getStorage().fetchRootFolder("local")).get();
    Assert.assertEquals(
        "EpisodeOfCare/partition-data.csv",
        manifestRead.getEntities().get(0).getDataPartitions().get(0).getLocation());

    final Model convertedToModelJson = ManifestPersistence.toData(manifestRead, null, null).get();
    final String location =
        ((LocalEntity) convertedToModelJson.getEntities().get(0))
            .getPartitions()
            .get(0)
            .getLocation();
    // Model Json uses absolute adapter path.
    Assert.assertTrue(
        StringUtils.containsIgnoreCase(
            location,
            "\\testData\\Persistence\\ModelJson\\DataPartition\\TestModelJsonDataPartitionLocationConsistency\\Input\\EpisodeOfCare\\partition-data.csv"));

    final CdmCorpusDefinition cdmCorpus2 = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testModelJsonDataPartitionLocationConsistency");
    final CdmManifestDefinition manifestAfterConversion =
        ManifestPersistence.fromObject
            (cdmCorpus2.getCtx(),
                convertedToModelJson,
                cdmCorpus2.getStorage().fetchRootFolder("local"))
            .get();
    Assert.assertEquals(
        "EpisodeOfCare/partition-data.csv",
        manifestAfterConversion.getEntities().get(0).getDataPartitions().get(0).getLocation());

    final CdmCorpusDefinition cdmCorpus3 = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testModelJsonDataPartitionLocationConsistency");
    final String readFile =
        TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testModelJsonDataPartitionLocationConsistency",
            "model.json");
    final CdmFolderDefinition namespaceFolder = cdmCorpus3.getStorage().fetchRootFolder("local");
    final String modelJsonAsString =
        readFile.replace("C:\\\\cdm\\\\testData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv",
            location.replace("\\", "\\\\")).replace("\uFEFF", "");

    final CdmManifestDefinition manifestReadFromModelJson =
        ManifestPersistence.fromObject(
            cdmCorpus3.getCtx(),
            JMapper.MAP.readValue(modelJsonAsString, Model.class),
            namespaceFolder)
            .get();
    Assert.assertEquals(
        "EpisodeOfCare/partition-data.csv",
        manifestReadFromModelJson.getEntities().get(0).getDataPartitions().get(0).getLocation());
    }

    /**
     * Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load.
     */
    @Test
    public void testLoadingCsvPartitionTraits() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingCsvPartitionTraits");
        CdmManifestDefinition manifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("model.json").join();

        CdmDataPartitionDefinition dataPartition = manifest.getEntities().get(0).getDataPartitions().get(0);

        // Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
        Assert.assertEquals(dataPartition.getExhibitsTraits().getCount(), 1);

        CdmTraitReference csvTrait = (CdmTraitReference) dataPartition.getExhibitsTraits().get(0);

        Assert.assertEquals(csvTrait.getArguments().get(0).getValue(), "true");
        Assert.assertEquals(csvTrait.getArguments().get(1).getValue(), "CsvStyle.QuoteAlways");
        Assert.assertEquals(csvTrait.getArguments().get(2).getValue(), ",");
        Assert.assertEquals(csvTrait.getArguments().get(3).getValue(), "QuoteStyle.Csv");
        Assert.assertEquals(csvTrait.getArguments().get(4).getValue(), "UTF-8");
        Assert.assertEquals(csvTrait.getArguments().get(5).getValue(), "\n");
    }

    /**
     * Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load.
     * Given that the trait is does not have arguments present on fileFormatSettings.
     */
    @Test
    public void testLoadingCsvPartitionTraitsFromFileFormatSettings() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingCsvPartitionTraitsFromFileFormatSettings");
        CdmManifestDefinition manifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("model.json").join();

        CdmDataPartitionDefinition dataPartition = manifest.getEntities().get(0).getDataPartitions().get(0);

        // Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
        Assert.assertEquals(dataPartition.getExhibitsTraits().getCount(), 1);

        CdmTraitReference csvTrait = (CdmTraitReference) dataPartition.getExhibitsTraits().get(0);

        Assert.assertEquals(csvTrait.getArguments().get(0).getValue(), "\n");
        Assert.assertEquals(csvTrait.getArguments().get(1).getValue(), "false");
        Assert.assertEquals(csvTrait.getArguments().get(2).getValue(), "CsvStyle.QuoteAfterDelimiter");
        Assert.assertEquals(csvTrait.getArguments().get(3).getValue(), ";");
        Assert.assertEquals(csvTrait.getArguments().get(4).getValue(), "QuoteStyle.None");
        Assert.assertEquals(csvTrait.getArguments().get(5).getValue(), "ASCII");
    }

    /**
     * Tests that the trait is.partition.format.CSV is saved when contains arguments not supported by fileFormatSettings.
     */
    @Test
    public void testLoadingAndSavingCsvPartitionTraits() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingCsvPartitionTraitsFromFileFormatSettings");
        CdmManifestDefinition manifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("model.json").join();

        // If the data partition trait is.partition.format.CSV being saved has arguments that are not supported by fileFormatSettings
        // the trait should also be persisted.
        Model manifestData = ManifestPersistence.toData(manifest, new ResolveOptions(manifest.getInDocument()), new CopyOptions()).join();
        LocalEntity localEntity = (LocalEntity) manifestData.getEntities().get(0);
        Assert.assertEquals(localEntity.getPartitions().get(0).getTraits().size(), 1);

        // Remove the argument that is not supported by fileFormatSettings and check if the trait is removed after that.
        CdmTraitReference csvTrait = (CdmTraitReference) manifest.getEntities().get(0).getDataPartitions().get(0).getExhibitsTraits().get(0);
        csvTrait.getArguments().remove(csvTrait.getArguments().item("newline"));

        manifestData = ManifestPersistence.toData(manifest, new ResolveOptions(manifest.getInDocument()), new CopyOptions()).join();
        localEntity = (LocalEntity) manifestData.getEntities().get(0);
        Assert.assertNull(localEntity.getPartitions().get(0).getTraits());
    }
}
