// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.relationship;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.TestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projection.AttributeContextUtil;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Test to validate calculateEntityGraphAsync function
 */
public class CalculateRelationshipTest {
    /**
     * Platform-specific line separator
     */
    private static String endOfLine = System.getProperty("line.separator");

    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File("cdm"),
            "relationship"),
            "testCalculateRelationship")
            .toString();

    /**
     * Non projection scenario with the referenced entity having a primary key
     */
    @Test
    public void testSimpleWithId() throws IOException, InterruptedException {
        String testName = "testSimpleWithId";
        String entityName = "Sales";

        testRun(testName, entityName);
    }

    /**
     * Non projection scenario with the referenced entity not having any primary key
     */
    @Test
    public void testSimpleWithoutId() throws IOException, InterruptedException {
        String testName = "testSimpleWithoutId";
        String entityName = "Sales";

        testRun(testName, entityName);
    }

    /**
     * Projection scenario with the referenced entity not having any primary key
     */
    @Test
    public void testWithoutIdProj() throws IOException, InterruptedException {
        String testName = "testWithoutIdProj";
        String entityName = "Sales";

        testRun(testName, entityName);
    }

    /**
     * Projection with composite keys
     */
    @Test
    public void testCompositeProj() throws IOException, InterruptedException {
        String testName = "testCompositeProj";
        String entityName = "Sales";

        testRun(testName, entityName);
    }

    /**
     * Projection with nested composite keys
     */
    @Test
    public void testNestedCompositeProj() throws IOException, InterruptedException {
        String testName = "testNestedCompositeProj";
        String entityName = "Sales";

        testRun(testName, entityName);
    }

    /**
     * Projection with IsPolymorphicSource property set to true
     */
    @Test
    public void testPolymorphicProj() throws IOException, InterruptedException {
        String testName = "testPolymorphicProj";
        String entityName = "Person";

        testRun(testName, entityName);
    }

    /**
     * Common test code for these test cases
     */
    private void testRun(String testName, String entityName) throws InterruptedException, IOException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        String inputFolder = TestHelper.getInputFolderPath(TESTS_SUBPATH, testName);
        String expectedOutputFolder = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);
        String actualOutputFolder = TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, testName);

        File folder = new File(actualOutputFolder);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        Assert.assertNotNull(manifest);
        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entity);
        CdmEntityDefinition resolvedEntity = TestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("referenceOnly"))).join();
        String actualAttrCtx = getAttributeContextString(resolvedEntity, entityName, actualOutputFolder);

        try {
            final String expectedAttrCtx = new String(Files.readAllBytes(
                new File(expectedOutputFolder, "AttrCtx_" + entityName + ".txt").toPath()),
                StandardCharsets.UTF_8);
            Assert.assertEquals(actualAttrCtx, expectedAttrCtx);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }

        corpus.calculateEntityGraphAsync(manifest).join();
        manifest.populateManifestRelationshipsAsync().join();
        String actualRelationshipsString = listRelationships(corpus, entity, actualOutputFolder, entityName);

        try {
            final String expectedRelationshipsString = new String(Files.readAllBytes(
                new File(expectedOutputFolder, "REL_" + entityName + ".txt").toPath()),
                StandardCharsets.UTF_8);
            Assert.assertEquals(actualRelationshipsString, expectedRelationshipsString);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }

        CdmFolderDefinition outputFolder = corpus.getStorage().fetchRootFolder("output");
        outputFolder.getDocuments().add(manifest);

        String manifestFileName = "saved.manifest.cdm.json";
        manifest.saveAsAsync(manifestFileName, true).join();
        File actualManifestPath = new File(new File(actualOutputFolder), manifestFileName);
        if (!actualManifestPath.exists()) {
            Assert.fail("Unable to save manifest with relationship");
        } else {
            CdmManifestDefinition savedManifest = (CdmManifestDefinition) corpus.fetchObjectAsync("output:/" + manifestFileName).join();
            String actualSavedManifestRel = getRelationshipStrings(savedManifest.getRelationships());
            String expectedSavedManifestRel = new String(Files.readAllBytes(
                new File(expectedOutputFolder, "MANIFEST_REL_" + entityName + ".txt").toPath()),
                StandardCharsets.UTF_8);
            Assert.assertEquals(actualSavedManifestRel, expectedSavedManifestRel);
        }
    }

    /**
     * Get a string version of the relationship collection
     */
    private static String getRelationshipStrings(CdmCollection<CdmE2ERelationship> relationships) {
        StringBuilder bldr = new StringBuilder();
        for (CdmE2ERelationship rel : relationships) {
            bldr.append(MessageFormat.format("{0}|{1}|{2}|{3}|{4}", !StringUtils.isNullOrTrimEmpty(rel.getName()) ? rel.getName() : "", rel.getToEntity(), rel.getToEntityAttribute(), rel.getFromEntity(), rel.getFromEntityAttribute()));
            bldr.append(endOfLine);
        }
        return bldr.toString();
    }

    /**
     * List the incoming and outgoing relationships
     */
    private static String listRelationships(CdmCorpusDefinition corpus, CdmEntityDefinition entity, String actualOutputFolder, String entityName) {
        StringBuilder bldr = new StringBuilder();

        bldr.append("Incoming Relationships For: " + entity.getEntityName() + ":");
        bldr.append(endOfLine);
        // Loop through all the relationships where other entities point to this entity.
        for (CdmE2ERelationship relationship : corpus.fetchIncomingRelationships(entity)) {
            bldr.append(printRelationship(relationship));
            bldr.append(endOfLine);
        }

        System.out.println("Outgoing Relationships For: " + entity.getEntityName() + ":");
        // Now loop through all the relationships where this entity points to other entities.
        for (CdmE2ERelationship relationship : corpus.fetchOutgoingRelationships(entity)) {
            bldr.append(printRelationship(relationship));
            bldr.append(endOfLine);
        }

        return bldr.toString();
    }

    /**
     * Print the relationship
     */
    private static String printRelationship(CdmE2ERelationship relationship) {
        StringBuilder bldr = new StringBuilder();

        if (!StringUtils.isNullOrTrimEmpty(relationship.getName())) {
            bldr.append("  Name: " + relationship.getName());
            bldr.append(endOfLine);
        }

        bldr.append("  FromEntity: " + relationship.getFromEntity());
        bldr.append(endOfLine);
        bldr.append("  FromEntityAttribute: " + relationship.getFromEntityAttribute());
        bldr.append(endOfLine);
        bldr.append("  ToEntity: " + relationship.getToEntity());
        bldr.append(endOfLine);
        bldr.append("  ToEntityAttribute: " + relationship.getToEntityAttribute());
        bldr.append(endOfLine);
        bldr.append(endOfLine);
        System.out.println(bldr.toString());

        return bldr.toString();
    }

    /**
     * Check the attribute context for these test scenarios
     */
    private static String getAttributeContextString(CdmEntityDefinition resolvedEntity, String entityName, String actualOutputFolder) {
        return (new AttributeContextUtil()).getAttributeContextStrings(resolvedEntity, resolvedEntity.getAttributeContext());
    }
}
