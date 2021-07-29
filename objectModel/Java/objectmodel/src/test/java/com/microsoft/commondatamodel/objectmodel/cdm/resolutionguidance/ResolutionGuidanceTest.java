// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.EntityByReference;
import com.microsoft.commondatamodel.objectmodel.cdm.Expansion;
import com.microsoft.commondatamodel.objectmodel.cdm.SelectsSubAttribute;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.storage.GithubAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.concurrent.CompletableFuture;

import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ResolutionGuidanceTest {
    /**
     * The path of the SchemaDocs project.
     */
    private static final String SCHEMA_DOCS_PATH = "../../../schemaDocuments";

    private static final String CDM_EXTENSION = CdmConstants.CDM_EXTENSION;

    /**
     * The test's data path.
     */
    private static final String TESTS_SUBPATH =
            new File("cdm", "resolutionguidance").toString();

    private static CompletableFuture<Void> runTest(final String testName, final String sourceEntityName) {
        return CompletableFuture.runAsync(() -> {
            try {
                final String testInputPath =
                        TestHelper.getInputFolderPath(TESTS_SUBPATH, testName);
                final String testExpectedOutputPath =
                        TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);
                final String testActualOutputPath =
                        TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, testName);

                final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
                corpus.getStorage().mount(
                        "localInput",
                        new LocalAdapter(testInputPath));
                corpus.getStorage().mount(
                        "localExpectedOutput",
                        new LocalAdapter(testExpectedOutputPath));
                corpus.getStorage().mount(
                        "localActualOutput",
                        new LocalAdapter(testActualOutputPath));

                final GithubAdapter githubAdapter = new GithubAdapter();
                githubAdapter.setTimeout(Duration.ofSeconds(3));
                githubAdapter.setTimeout(Duration.ofSeconds(3));
                githubAdapter.setNumberOfRetries(1);

                corpus.getStorage().mount("cdm", new LocalAdapter(SCHEMA_DOCS_PATH));

                corpus.getStorage().setDefaultNamespace("localInput");

                final CdmEntityDefinition srcEntityDef =
                        corpus.<CdmEntityDefinition>fetchObjectAsync(
                                "localInput:/" + sourceEntityName + ".cdm.json/" + sourceEntityName
                        ).join();
                Assert.assertTrue(srcEntityDef != null);

                final ResolveOptions resOpt = new ResolveOptions(srcEntityDef);
                resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>()));

                final CdmFolderDefinition actualOutputFolder =
                        corpus.<CdmFolderDefinition>fetchObjectAsync("localActualOutput:/").join();
                CdmEntityDefinition resolvedEntityDef;
                String outputEntityFileName;
                String entityFileName;

                entityFileName = "default";
                resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>()));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Collections.singletonList("referenceOnly"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "normalized";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Collections.singletonList("normalized"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "structured";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Collections.singletonList("structured"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly_normalized";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly_normalized";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly_structured";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Arrays.asList("referenceOnly", "structured"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "normalized_structured";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Arrays.asList("normalized", "structured"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly_normalized_structured";
                resOpt.setDirectives(
                        new AttributeResolutionDirectiveSet(
                                new HashSet<>(Arrays.asList("referenceOnly", "normalized", "structured"))));
                outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + CDM_EXTENSION;
                resolvedEntityDef =
                        srcEntityDef.createResolvedEntityAsync(
                                outputEntityFileName,
                                resOpt,
                                actualOutputFolder).join();
                if (resolvedEntityDef
                        .getInDocument()
                        .saveAsAsync(
                                outputEntityFileName,
                                true,
                                new CopyOptions()).join()) {
                    validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }
            } catch (final Exception e) {
                // Assert.fail(e.getMessage());
                throw new RuntimeException(e);
            }
        });
    }

    private static void validateOutput(
            final String outputEntityFileName,
            final String testExpectedOutputPath,
            final String testActualOutputPath) {

        try {
            final String expectedOutput = new String(Files.readAllBytes(
                    new File(testExpectedOutputPath, outputEntityFileName).toPath()),
                    StandardCharsets.UTF_8);
            final String actualOutput = new String(Files.readAllBytes(
                    new File(testActualOutputPath, outputEntityFileName).toPath()),
                    StandardCharsets.UTF_8);
            JSONAssert.assertEquals(expectedOutput, actualOutput, true);
        } catch (final Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    /**
     * Tests if a warning is logged if resolution guidance is used
     */
    @Test
    public void testResolutionGuidanceDeprecation() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolutionGuidanceDeprecation", null);

        // Tests warning log when resolution guidance is used on a data typed attribute.
        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TypeAttribute.cdm.json/Entity").join();
        entity.createResolvedEntityAsync("res-entity").join();
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.WarnDeprecatedResolutionGuidance, true);

        // Tests warning log when resolution guidance is used on a entity typed attribute.
        entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/EntityAttribute.cdm.json/Entity").join();
        entity.createResolvedEntityAsync("res-entity").join();
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.WarnDeprecatedResolutionGuidance, true);

        // Tests warning log when resolution guidance is used when extending an entity.
        entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/ExtendsEntity.cdm.json/Entity").join();
        entity.createResolvedEntityAsync("res-entity").join();
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.WarnDeprecatedResolutionGuidance, true);
    }

    @Test
    public void testResolutionGuidanceCopy() {
        final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
        final CdmAttributeResolutionGuidance resolutionGuidance = new CdmAttributeResolutionGuidance(corpus.getCtx());

        resolutionGuidance.setExpansion(new Expansion());
        resolutionGuidance.setEntityByReference(new EntityByReference());
        resolutionGuidance.setSelectsSubAttribute(new SelectsSubAttribute());
        resolutionGuidance.setImposedDirectives(new ArrayList<>());
        resolutionGuidance.setRemovedDirectives(new ArrayList<>());

        final CdmAttributeResolutionGuidance resolutionGuidanceCopy =
                (CdmAttributeResolutionGuidance) resolutionGuidance.copy();

        Assert.assertNotSame(
                resolutionGuidance.getExpansion(),
                resolutionGuidanceCopy.getExpansion());
        Assert.assertNotSame(
                resolutionGuidance.getEntityByReference(),
                resolutionGuidanceCopy.getEntityByReference());
        Assert.assertNotSame(
                resolutionGuidance.getSelectsSubAttribute(),
                resolutionGuidanceCopy.getSelectsSubAttribute());
        Assert.assertNotSame(
                resolutionGuidance.getImposedDirectives(),
                resolutionGuidanceCopy.getImposedDirectives());
        Assert.assertNotSame(
                resolutionGuidance.getRemovedDirectives(),
                resolutionGuidanceCopy.getRemovedDirectives());
    }

    /**
     * Resolution Guidance Test - Resolve entity by name.
     */
    @Test
    public void testByEntityName() {
        final String testName = "testByEntityName";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - Resolve entity by primary key.
     */
    @Test
    public void testByPrimaryKey() {
        final String testName = "testByPrimaryKey";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - Empty ResolutionGuidance.
     */
    @Test
    public void testEmptyResolutionGuidance() {
        final String testName = "testEmptyResolutionGuidance";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test- With RenameFormat property.
     */
    @Test
    public void testRenameFormat() {
        final String testName = "testRenameFormat";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - Empty EntityReference property.
     */
    @Test
    public void testEmptyEntityReference() {
        final String testName = "testEmptyEntityReference";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - With AllowReferences = true.
     */
    @Test
    public void testAllowReferencesTrue() {
        final String testName = "testAllowReferencesTrue";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - With AlwaysIncludeForeignKey = true.
     */
    @Test
    public void testAlwaysIncludeForeignKeyTrue() {
        final String testName = "testAlwaysIncludeForeignKeyTrue";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - With ForeignKeyAttribute property.
     */
    @Test
    public void testForeignKeyAttribute() {
        final String testName = "testForeignKeyAttribute";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - With Cardinality = "one".
     */
    @Test
    public void testCardinalityOne() {
        final String testName = "testCardinalityOne";
        runTest(testName, "Sales").join();
    }

    /**
     * Resolution Guidance Test - With SelectsSubAttribute - Take Names.
     */
    @Test
    public void testSelectsSubAttributeTakeNames() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testSelectsSubAttributeTakeNames", null);
        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Sales.cdm.json/Sales").join();
        ResolveOptions resOpt = new ResolveOptions(entity.getInDocument(), null);
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("resolved", resOpt).join();

        CdmTypeAttributeDefinition att1 = (CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3);
        CdmTypeAttributeDefinition att2 = (CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4);

        // Check that the attributes in selectsSomeTakeNames were added.
        Assert.assertEquals(att1.getName(), "SalesProductProductId");
        Assert.assertEquals(att2.getName(), "SalesProductProductColor");
    }

    /**
     * Resolution Guidance Test - With SelectsSubAttribute - Avoid Names.
     */
    @Test
    public void testSelectsSubAttributeAvoidNames() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testSelectsSubAttributeAvoidNames", null);
        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Sales.cdm.json/Sales").join();
        ResolveOptions resOpt = new ResolveOptions(entity.getInDocument(), null);
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("resolved", resOpt).join();

        // Check that the attributes in selectsSomeAvoidNames were not added.
        for (int i = 0; i < resolvedEntity.getAttributes().size(); i++) {
            CdmTypeAttributeDefinition att = (CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(i);
            Assert.assertNotEquals(att.getName(), "SalesProductProductId");
            Assert.assertNotEquals(att.getName(), "SalesProductProductColor");
        }
    }

    /**
     * Resolution Guidance Test - With structured/normal imposed directives.
     * This test directly read imposed directives from json file instead of setting resOpt in code as runTest().
     */
    @Test
    public void testImposedDirectives() throws InterruptedException {
        final String testName = "testImposedDirectives";
        final String testExpectedOutputPath =
                TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);
        final String testActualOutputPath =
                TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, testName);

        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        corpus.getStorage().mount("localActualOutput", new LocalAdapter(testActualOutputPath));
        final CdmFolderDefinition actualOutputFolder =
                corpus.<CdmFolderDefinition>fetchObjectAsync("localActualOutput:/").join();

        // Test "structured" imposed directive
        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync(
                "local:/Person_Structured.cdm.json/Person"
        ).join();
        CdmEntityDefinition resolvedEntityDef = entity.<CdmEntityDefinition>createResolvedEntityAsync(
                "Person_Resolved",
                null,
                actualOutputFolder).join();
        resolvedEntityDef
                .getInDocument()
                .saveAsAsync(
                        "Person_Structured_Resolved.cdm.json",
                        true,
                        new CopyOptions()).join();
        validateOutput("Person_Structured_Resolved.cdm.json", testExpectedOutputPath, testActualOutputPath);

        // Test default imposed directive
        entity = corpus.<CdmEntityDefinition>fetchObjectAsync(
                "local:/Person_Default.cdm.json/Person"
        ).join();
        resolvedEntityDef = entity.<CdmEntityDefinition>createResolvedEntityAsync(
                "Person_Resolved",
                null,
                actualOutputFolder).join();
        resolvedEntityDef
                .getInDocument()
                .saveAsAsync(
                        "Person_Default_Resolved.cdm.json",
                        true,
                        new CopyOptions()).join();
        validateOutput("Person_Default_Resolved.cdm.json", testExpectedOutputPath, testActualOutputPath);
    }
}
