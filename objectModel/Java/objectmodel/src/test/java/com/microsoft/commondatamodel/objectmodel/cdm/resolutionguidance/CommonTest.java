// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import org.testng.Assert;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * Base class for all the new resolution guidance tests.
 */
public class CommonTest {
    /**
     * The path of the SchemaDocs project.
     */
    protected static final String SCHEMA_DOCS_PATH = "../../../schemaDocuments";

    /**
     * The test's data path.
     */
    protected static final String TESTS_SUBPATH = new File("Cdm", "ResolutionGuidance").toString();

    /**
     * This method runs the tests with a set expected attributes & attribute context values and validated the actual result.
     */
    protected static CompletableFuture<Void> runTestWithValues(
            final String testName,
            final String sourceEntityName,

            final AttributeContextExpectedValue expectedContext_default,
            final AttributeContextExpectedValue expectedContext_normalized,
            final AttributeContextExpectedValue expectedContext_referenceOnly,
            final AttributeContextExpectedValue expectedContext_structured,
            final AttributeContextExpectedValue expectedContext_normalized_structured,
            final AttributeContextExpectedValue expectedContext_referenceOnly_normalized,
            final AttributeContextExpectedValue expectedContext_referenceOnly_structured,
            final AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured,

            final List<AttributeExpectedValue> expected_default,
            final List<AttributeExpectedValue> expected_normalized,
            final List<AttributeExpectedValue> expected_referenceOnly,
            final List<AttributeExpectedValue> expected_structured,
            final List<AttributeExpectedValue> expected_normalized_structured,
            final List<AttributeExpectedValue> expected_referenceOnly_normalized,
            final List<AttributeExpectedValue> expected_referenceOnly_structured,
            final List<AttributeExpectedValue> expected_referenceOnly_normalized_structured
    ) {
        return runTestWithValues(
            testName,
            sourceEntityName,

            expectedContext_default,
            expectedContext_normalized,
            expectedContext_referenceOnly,
            expectedContext_structured,
            expectedContext_normalized_structured,
            expectedContext_referenceOnly_normalized,
            expectedContext_referenceOnly_structured,
            expectedContext_referenceOnly_normalized_structured,

            expected_default,
            expected_normalized,
            expected_referenceOnly,
            expected_structured,
            expected_normalized_structured,
            expected_referenceOnly_normalized,
            expected_referenceOnly_structured,
            expected_referenceOnly_normalized_structured,
            false
        );
    }

    /**
     * This method runs the tests with a set expected attributes & attribute context values and validated the actual result.
     */
    protected static CompletableFuture<Void> runTestWithValues(
        final String testName,
        final String sourceEntityName,

        final AttributeContextExpectedValue expectedContext_default,
        final AttributeContextExpectedValue expectedContext_normalized,
        final AttributeContextExpectedValue expectedContext_referenceOnly,
        final AttributeContextExpectedValue expectedContext_structured,
        final AttributeContextExpectedValue expectedContext_normalized_structured,
        final AttributeContextExpectedValue expectedContext_referenceOnly_normalized,
        final AttributeContextExpectedValue expectedContext_referenceOnly_structured,
        final AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured,

        final List<AttributeExpectedValue> expected_default,
        final List<AttributeExpectedValue> expected_normalized,
        final List<AttributeExpectedValue> expected_referenceOnly,
        final List<AttributeExpectedValue> expected_structured,
        final List<AttributeExpectedValue> expected_normalized_structured,
        final List<AttributeExpectedValue> expected_referenceOnly_normalized,
        final List<AttributeExpectedValue> expected_referenceOnly_structured,
        final List<AttributeExpectedValue> expected_referenceOnly_normalized_structured,
        final boolean updateExpectedOutput
    ) {
        return CompletableFuture.runAsync(() -> {
            try {
                String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, testName);
                String testActualPath = TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, testName);
                String testExpectedPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);
                String corpusPath = testInputPath.substring(0, testInputPath.length() - "/Input".length());
                testActualPath = Paths.get(testActualPath).toString();

                CdmCorpusDefinition corpus = new CdmCorpusDefinition();
                corpus.setEventCallback((CdmStatusLevel level, String message) -> { }, CdmStatusLevel.Warning);
                corpus.getStorage().mount("local", new LocalAdapter(corpusPath));
                corpus.getStorage().mount("cdm", new LocalAdapter(SCHEMA_DOCS_PATH));
                corpus.getStorage().setDefaultNamespace("local");

                String outFolderPath = corpus.getStorage().adapterPathToCorpusPath(testActualPath) + "/"; // interesting 'bug'
                CdmFolderDefinition outFolder = (CdmFolderDefinition) corpus.fetchObjectAsync(outFolderPath).join();

                CdmEntityDefinition srcEntityDef = (CdmEntityDefinition)corpus.fetchObjectAsync("local:/Input/"+ sourceEntityName + ".cdm.json/" + sourceEntityName).join();
                Assert.assertNotNull(srcEntityDef);

                ResolveOptions resOpt = new ResolveOptions(srcEntityDef.getInDocument());

                CdmEntityDefinition resolvedEntityDef = null;
                String outputEntityName = "";
                String outputEntityFileName = "";
                String entityFileName = "";

                if (expectedContext_default != null && expected_default != null) {
                    entityFileName = "d";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>()));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

                if (expectedContext_normalized != null && expected_normalized != null) {
                    entityFileName = "n";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("normalized"))));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

                if (expectedContext_referenceOnly != null && expected_referenceOnly != null) {
                    entityFileName = "ro";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly"))));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt,outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

                if (expectedContext_structured != null && expected_structured != null) {
                    entityFileName = "s";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("structured"))));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

                if (expectedContext_normalized_structured != null && expected_normalized_structured != null) {
                    entityFileName = "n_s";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("normalized", "structured"))));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_normalized != null && expected_referenceOnly_normalized != null) {
                    entityFileName = "ro_n";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_structured != null && expected_referenceOnly_structured != null) {
                    entityFileName = "ro_s";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "structured"))));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_normalized_structured != null && expected_referenceOnly_normalized_structured != null) {
                    entityFileName = "ro_n_s";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized", "structured"))));
                    outputEntityName = sourceEntityName + "_R_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder).join();
                    validateOutputWithValuesSaveActualEntityAndValidateWithExpected(Paths.get(testExpectedPath, outputEntityFileName).toString(), resolvedEntityDef);
                }

            } catch (Exception e) {
                Assert.fail();
            }
        });
    }

    /**
     * Runs validation to test actual output vs expected output for attributes collection vs attribute context.
     */
    protected static CompletableFuture<Void> validateOutputWithValuesSaveActualEntityAndValidateWithExpected(
            final String expectedPath, final CdmEntityDefinition actualResolvedEntityDef) throws IOException {
        return CompletableFuture.runAsync(() -> {
            try {
                final CopyOptions options = new CopyOptions();
                options.setSaveConfigFile(false);
                actualResolvedEntityDef.getInDocument().saveAsAsync(actualResolvedEntityDef.getInDocument().getName(), false, options);
                final String actualPath = actualResolvedEntityDef.getCtx().getCorpus().getStorage().corpusPathToAdapterPath(actualResolvedEntityDef.getInDocument().getAtCorpusPath());
                Assert.assertEquals(new String(Files.readAllBytes(new File(expectedPath).toPath()), StandardCharsets.UTF_8),
                        new String(Files.readAllBytes(new File(actualPath).toPath()), StandardCharsets.UTF_8));
            } catch (Exception e) {
                Assert.fail(e.getMessage());
            }
        });
    }
}
