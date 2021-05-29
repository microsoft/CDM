// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projection.AttributeContextUtil;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.EventList;

import org.testng.Assert;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Common utility methods for projection tests
 * If you want to update the expected output txt files for all the tests that are ran,
 * please set the parameter updateExpectedOutput true in the method
 * @see ProjectionTestUtils#validateAttributeContext(List, String, String, CdmEntityDefinition, boolean)
 */
public class ProjectionTestUtils {
    /**
     * Path to foundations
     */
    private static final String foundationJsonPath = "cdm:/foundations.cdm.json";

    /**
     * The log codes that are allowed to be logged without failing the test
     */
    private static HashSet<String> allowedLogs = new HashSet<>(
        Arrays.asList(CdmLogCode.WarnDeprecatedResolutionGuidance.name())
    );

    /**
     * Resolves an entity
     * @param corpus The corpus
     * @param inputEntity The entity to resolve
     * @param directives The set of directives used for resolution
     */
    public static CompletableFuture<CdmEntityDefinition> getResolvedEntity(
        CdmCorpusDefinition corpus,
        CdmEntityDefinition inputEntity,
        List<String> directives
    ) {
        return CompletableFuture.supplyAsync(() -> {
            HashSet<String> roHashSet = new HashSet<>(directives);

            String resolvedEntityName = "Resolved_" + inputEntity.getEntityName();

            ResolveOptions resOpt = new ResolveOptions(inputEntity.getInDocument());
            resOpt.setDirectives(new AttributeResolutionDirectiveSet(roHashSet));

            CdmFolderDefinition resolvedFolder = corpus.getStorage().fetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = inputEntity.createResolvedEntityAsync(resolvedEntityName, resOpt, resolvedFolder).join();

            return resolvedEntity;
        });
    }

    /**
     * Returns a suffix that contains the file name and resolution option used
     * @param directives The set of directives used for resolution
     */
    public static String getResolutionOptionNameSuffix(List<String> directives) {
        String fileNamePrefix = "";

        for (int i = 0; i < directives.size(); i++) {
            fileNamePrefix = fileNamePrefix + "_" + directives.get(i);
        }

        if (StringUtils.isNullOrTrimEmpty(fileNamePrefix)) {
            fileNamePrefix = "_default";
        }

        return fileNamePrefix;
    }

    /**
     * Loads an entity, resolves it, and then validates the generated attribute contexts
     */
    public static CompletableFuture<CdmEntityDefinition> loadEntityForResolutionOptionAndSave(final CdmCorpusDefinition corpus, final String testName, final String testsSubpath, final String entityName, List<String> directives) {
        String expectedOutputPath = null;
        try {
            expectedOutputPath = TestHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        Assert.assertNotNull(entity);
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, directives).join();
        Assert.assertNotNull(resolvedEntity);

        validateAttributeContext(directives, expectedOutputPath, entityName, resolvedEntity);

        return CompletableFuture.completedFuture(resolvedEntity);
    }

    /**
     * Validates if the attribute context of the resolved entity matches the expected output.
     * @see ProjectionTestUtils#validateAttributeContext(List, String, String, CdmEntityDefinition, boolean)
     */
    private static void validateAttributeContext(List<String> directives, String expectedOutputPath, String entityName, CdmEntityDefinition resolvedEntity) {
        validateAttributeContext(directives, expectedOutputPath, entityName, resolvedEntity, false);
    }

    /**
     * Validates if the attribute context of the resolved entity matches the expected output.
     * @param updateExpectedOutput If true, will update the expected output txt files for all the tests that are ran.
     */
    private static void validateAttributeContext(List<String> directives, String expectedOutputPath, String entityName, CdmEntityDefinition resolvedEntity, boolean updateExpectedOutput) {
        if (resolvedEntity.getAttributeContext() == null) {
            Assert.fail("ValidateAttributeContext called with not resolved entity.");
        }

        String fileNamePrefix = "AttrCtx_" + entityName;
        Path expectedStringFilePath;
        String fileNameSuffix = getResolutionOptionNameSuffix(directives);
        String defaultFileNameSuffix = getResolutionOptionNameSuffix(new ArrayList<>());

        // Get actual text
        AttributeContextUtil attrCtxUtil = new AttributeContextUtil();
        String actualText = attrCtxUtil.getAttributeContextStrings(resolvedEntity);

        try {
            if (updateExpectedOutput) {
                expectedStringFilePath = new File(expectedOutputPath, fileNamePrefix + fileNameSuffix + ".txt").toPath();

                if (directives.size() > 0) {
                    Path defaultStringFilePath = new File(expectedOutputPath, fileNamePrefix + defaultFileNameSuffix + ".txt").toPath();
                    String defaultText = new String(Files.readAllBytes(defaultStringFilePath), StandardCharsets.UTF_8);

                    if (actualText.equals(defaultText)) {
                        final File actualFile = new File(expectedStringFilePath.toString());
                        actualFile.delete();
                    } else {
                        try (final BufferedWriter actualFileWriter = new BufferedWriter(new FileWriter(expectedStringFilePath.toFile()))) {
                            actualFileWriter.write(actualText);
                        }
                    }
                } else {
                    try (final BufferedWriter actualFileWriter = new BufferedWriter(new FileWriter(expectedStringFilePath.toFile()))) {
                        actualFileWriter.write(actualText);
                    }
                }
            } else {
                // Actual
                Path actualStringFilePath = new File(expectedOutputPath.replace("ExpectedOutput", "ActualOutput"), fileNamePrefix + fileNameSuffix + ".txt").toPath();

                // Save Actual AttrCtx_*.txt and Resolved_*.cdm.json
                try (final BufferedWriter actualFileWriter = Files.newBufferedWriter(actualStringFilePath, StandardCharsets.UTF_8, StandardOpenOption.CREATE);) {
                    actualFileWriter.write(actualText);
                    actualFileWriter.flush();
                }
                resolvedEntity.getInDocument().saveAsAsync("Resolved_" + entityName + ".cdm.json", false).join();

                // Expected
                String expectedFileNameSuffix = getResolutionOptionNameSuffix(directives);
                File expectedFile = new File(expectedOutputPath, fileNamePrefix + expectedFileNameSuffix + ".txt");

                // If a test file doesn't exist for this set of directives, fall back to the default file.
                if (!expectedFile.exists()) {
                    expectedFile = new File(expectedOutputPath, fileNamePrefix + defaultFileNameSuffix + ".txt");
                }

                final String expectedText = new String(Files.readAllBytes(expectedFile.toPath()), StandardCharsets.UTF_8);

                // Test if Actual is Equal to Expected
                Assert.assertEquals(actualText.replace("\r\n", "\n"), expectedText.replace("\r\n","\n"));
            }
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    /**
     * Creates a corpus
     */
    public static CdmCorpusDefinition getLocalCorpus(final String testsSubpath, final String testName) throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(testsSubpath, testName, null);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            EventList events = corpus.getCtx().getEvents();
            Map<String, String> lastEvent = events.get(events.size() - 1);
            if (!lastEvent.containsKey("code") || !allowedLogs.contains(lastEvent.get("code"))) {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Warning);

        return corpus;
    }

    /**
     * Creates an entity
     */
    public static CdmEntityDefinition createEntity(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        String entityName = "TestEntity";
        CdmEntityDefinition entity = corpus.makeObject(CdmObjectType.EntityDef, entityName);

        CdmDocumentDefinition entityDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityDoc.getImports().add(foundationJsonPath);
        entityDoc.getDefinitions().add(entity);
        localRoot.getDocuments().add(entityDoc, entityDoc.getName());

        return entity;
    }

    /**
     * Creates a source entity for a projection
     */
    public static CdmEntityDefinition createSourceEntity(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        String entityName = "SourceEntity";
        CdmEntityDefinition entity = corpus.makeObject(CdmObjectType.EntityDef, entityName);

        String attributeName1 = "id";
        CdmTypeAttributeDefinition attribute1 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName1);
        attribute1.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "string", true));
        entity.getAttributes().add(attribute1);

        String attributeName2 = "name";
        CdmTypeAttributeDefinition attribute2 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName2);
        attribute2.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "string", true));
        entity.getAttributes().add(attribute2);

        String attributeName3 = "value";
        CdmTypeAttributeDefinition attribute3 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName3);
        attribute3.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "integer", true));
        entity.getAttributes().add(attribute3);

        String attributeName4 = "date";
        CdmTypeAttributeDefinition attribute4 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName4);
        attribute4.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "date", true));
        entity.getAttributes().add(attribute4);

        CdmDocumentDefinition entityDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityDoc.getImports().add(foundationJsonPath);
        entityDoc.getDefinitions().add(entity);
        localRoot.getDocuments().add(entityDoc, entityDoc.getName());

        return entity;
    }

    /**
     * Creates a projection
     */
    public static CdmProjection createProjection(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        // Create an entity reference to use as the source of the projection
        CdmEntityReference projectionSource = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionSource.setExplicitReference(createSourceEntity(corpus, localRoot));

        // Create the projection
        CdmProjection projection = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection.setSource(projectionSource);

        return projection;
    }
}
