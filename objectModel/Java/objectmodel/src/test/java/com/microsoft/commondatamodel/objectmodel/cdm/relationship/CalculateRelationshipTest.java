// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.relationship;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.AttributeContext;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Attribute;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projection.AttributeContextUtil;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.text.MessageFormat;
import java.util.*;

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

        testRun(testName, entityName, false);
    }

    /**
     * Projection scenario with the referenced entity not having any primary key
     */
    @Test
    public void testWithoutIdProj() throws IOException, InterruptedException {
        String testName = "testWithoutIdProj";
        String entityName = "Sales";

        testRun(testName, entityName, true);
    }

    /**
     * Projection scenario with the referenced entity in a different folder
     */
    @Test
    public void testDiffRefLocation() throws IOException, InterruptedException {
        String testName = "testDiffRefLocation";
        String entityName = "Sales";

        testRun(testName, entityName, true);
    }
    /**
     * Projection with composite keys
     */
    @Test
    public void testCompositeProj() throws IOException, InterruptedException {
        String testName = "testCompositeProj";
        String entityName = "Sales";

        testRun(testName, entityName, true);
    }

    /**
     * Projection with nested composite keys
     */
    @Test
    public void testNestedCompositeProj() throws IOException, InterruptedException {
        String testName = "testNestedCompositeProj";
        String entityName = "Sales";

        testRun(testName, entityName, true);
    }

    /**
     * Non projection scenario with selectsSubAttribute set to one
     */
    @Test
    public void testPolymorphicWithoutProj() throws IOException, InterruptedException {
        String testName = "testPolymorphicWithoutProj";
        String entityName = "CustomPerson";

        testRun(testName, entityName, false);
    }

    /**
     * Projection with IsPolymorphicSource property set to true
     */
    @Test
    public void testPolymorphicProj() throws IOException, InterruptedException {
        String testName = "testPolymorphicProj";
        String entityName = "Person";

        testRun(testName, entityName, true);
    }

    /**
     * Test a composite key relationship with a polymorphic entity
     */
    @Test
    public void testCompositeKeyPolymorphicRelationship() throws IOException, InterruptedException {
        String testName = "testCompositeKeyPolymorphicRelationship";
        String entityName = "Person";

        testRun(testName, entityName, true);
    }

    /**
     * Test a composite key relationship with multiple entity attribute but not polymorphic
     */
    @Test
    public void testCompositeKeyNonPolymorphicRelationship() throws IOException, InterruptedException {
        String testName = "testCompositeKeyNonPolymorphicRelationship";
        String entityName = "Person";

        testRun(testName, entityName, true);
    }

    /**
     * Common test code for these test cases
     */
    private void testRun(String testName, String entityName, boolean isEntitySet) throws IOException, InterruptedException {
        testRun(testName, entityName, isEntitySet, false);
    }

    /**
     * Common test code for these test cases
     */
    private void testRun(String testName, String entityName, boolean isEntitySet, boolean updateExpectedOutput) throws InterruptedException, IOException {
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
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("referenceOnly"))).join();
        assertEntityShapeInResolvedEntity(resolvedEntity, isEntitySet);

        AttributeContextUtil.validateAttributeContext(expectedOutputFolder, entityName, resolvedEntity, updateExpectedOutput);

        corpus.calculateEntityGraphAsync(manifest).join();
        manifest.populateManifestRelationshipsAsync().join();
        String actualRelationshipsString = listRelationships(corpus, entity, actualOutputFolder, entityName);
        String relationshipsFilename = "REL_" + entityName + ".txt";

        try (final BufferedWriter actualFileWriter = Files.newBufferedWriter(new File(
            actualOutputFolder, relationshipsFilename).toPath(), StandardCharsets.UTF_8, StandardOpenOption.CREATE);) {
            actualFileWriter.write(actualRelationshipsString);
            actualFileWriter.flush();
        }

        try {
            final String expectedRelationshipsString = new String(Files.readAllBytes(
                new File(expectedOutputFolder, relationshipsFilename).toPath()),
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
            String manifestRelationshipsFilename = "MANIFEST_REL_" + entityName + ".txt";

            try (final BufferedWriter actualFileWriter = Files.newBufferedWriter(new File(
                actualOutputFolder, manifestRelationshipsFilename).toPath(), StandardCharsets.UTF_8, StandardOpenOption.CREATE);) {
                actualFileWriter.write(actualRelationshipsString);
                actualFileWriter.flush();
            }

            String expectedSavedManifestRel = new String(Files.readAllBytes(
                new File(expectedOutputFolder, manifestRelationshipsFilename).toPath()),
                StandardCharsets.UTF_8);
            Assert.assertEquals(actualSavedManifestRel, expectedSavedManifestRel);
        }
    }

    private static void assertEntityShapeInResolvedEntity(CdmEntityDefinition resolvedEntity, boolean isEntitySet) {
        for (final CdmAttributeItem att : resolvedEntity.getAttributes()) {
            CdmTraitReferenceBase traitRef = att.getAppliedTraits().getAllItems()
                    .stream()
                    .filter((x) -> "is.linkedEntity.identifier".equals(x.getNamedReference()) && ((CdmTraitReference) x).getArguments().size() > 0)
                    .findFirst().orElse(null);
            CdmEntityReference entRef = traitRef != null ? (CdmEntityReference) ((CdmTraitReference) traitRef).getArguments().get(0).getValue() : null;

            if (entRef != null) {
                final String entityShape = ((CdmConstantEntityDefinition) entRef.fetchObjectDefinition()).getEntityShape().getNamedReference();
                if (isEntitySet) {
                    Assert.assertEquals("entitySet", entityShape);
                } else {
                    Assert.assertEquals("entityGroupSet", entityShape);
                }
                return;
            }
        }

        Assert.fail("Unable to find entity shape from resolved model.");
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
     * Get a string version of one relationship
     */
    private static String getRelationshipString(CdmE2ERelationship rel) {
        String nameAndPipe = "";
        if (!StringUtils.isNullOrTrimEmpty(rel.getName())) {
            nameAndPipe = rel.getName() + "|";
        }

        return MessageFormat.format("{0}{1}|{2}|{3}|{4}", nameAndPipe, rel.getToEntity(), rel.getToEntityAttribute(), rel.getFromEntity(), rel.getFromEntityAttribute());
    }

    /**
     * List the incoming and outgoing relationships
     */
    private static String listRelationships(CdmCorpusDefinition corpus, CdmEntityDefinition entity, String actualOutputFolder, String entityName) {
        StringBuilder bldr = new StringBuilder();
        HashSet<String> relCache = new LinkedHashSet<>();

        bldr.append("Incoming Relationships For: " + entity.getEntityName() + ":" + endOfLine);
        // Loop through all the relationships where other entities point to this entity.
        for (CdmE2ERelationship relationship : corpus.fetchIncomingRelationships(entity)) {
            String cacheKey = getRelationshipString(relationship);
            if (!relCache.contains(cacheKey))
            {
                bldr.append(printRelationship(relationship) + endOfLine);
                relCache.add(cacheKey);
            }
        }

        System.out.println("Outgoing Relationships For: " + entity.getEntityName() + ":");
        // Now loop through all the relationships where this entity points to other entities.
        for (CdmE2ERelationship relationship : corpus.fetchOutgoingRelationships(entity)) {
            String cacheKey = getRelationshipString(relationship);
            if (!relCache.contains(cacheKey))
            {
                bldr.append(printRelationship(relationship) + endOfLine);
                relCache.add(cacheKey);
            }
        }

        return bldr.toString();
    }


    /**
     * Print the relationship
     */
    private static String printRelationship(CdmE2ERelationship relationship) {
        StringBuilder bldr = new StringBuilder();

        if (!StringUtils.isNullOrTrimEmpty(relationship.getName())) {
            bldr.append("  Name: " + relationship.getName() + endOfLine);
        }

        bldr.append("  FromEntity: " + relationship.getFromEntity() + endOfLine);
        bldr.append("  FromEntityAttribute: " + relationship.getFromEntityAttribute() + endOfLine);
        bldr.append("  ToEntity: " + relationship.getToEntity() + endOfLine);
        bldr.append("  ToEntityAttribute: " + relationship.getToEntityAttribute() + endOfLine);

        if (relationship.getExhibitsTraits() != null && relationship.getExhibitsTraits().size() != 0) {
            bldr.append("  ExhibitsTraits:" + endOfLine);
            CdmTraitCollection orderedAppliedTraits = relationship.getExhibitsTraits();
            orderedAppliedTraits.sort(Comparator.comparing(CdmObjectReferenceBase::getNamedReference));
            for (CdmTraitReferenceBase trait : orderedAppliedTraits) {
                bldr.append("      " + trait.getNamedReference() + endOfLine);

                if (trait instanceof CdmTraitReference) {
                    for (CdmArgumentDefinition args : ((CdmTraitReference) trait).getArguments()) {
                        AttributeContextUtil attrCtxUtil = new AttributeContextUtil();
                        bldr.append("          " + attrCtxUtil.getArgumentValuesAsString(args) + endOfLine);
                    }
                }
            }
        }

        bldr.append(endOfLine);
        System.out.println(bldr.toString());

        return bldr.toString();
    }

    /**
     * Check the attribute context for these test scenarios
     */
    private static String getAttributeContextString(CdmEntityDefinition resolvedEntity, String entityName, String actualOutputFolder) {
        return (new AttributeContextUtil()).getAttributeContextStrings(resolvedEntity);
    }
}
