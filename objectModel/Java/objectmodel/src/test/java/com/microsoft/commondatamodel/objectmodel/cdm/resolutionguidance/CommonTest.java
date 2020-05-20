// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import org.testng.Assert;

import java.io.File;
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
    protected static final String TESTS_SUBPATH = new File("cdm", "resolutionguidance").toString();

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
        return CompletableFuture.runAsync(() -> {
            try {
                String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, testName);

                CdmCorpusDefinition corpus = new CdmCorpusDefinition();
                corpus.setEventCallback((CdmStatusLevel level, String message) -> { }, CdmStatusLevel.Warning);
                corpus.getStorage().mount("localInput", new LocalAdapter(testInputPath));
                corpus.getStorage().mount("cdm", new LocalAdapter(SCHEMA_DOCS_PATH));
                corpus.getStorage().setDefaultNamespace("localInput");

                CdmEntityDefinition srcEntityDef = corpus.<CdmEntityDefinition>fetchObjectAsync("localInput:/" + sourceEntityName + ".cdm.json/" + sourceEntityName).join();
                Assert.assertTrue(srcEntityDef != null);

                ResolveOptions resOpt = new ResolveOptions(srcEntityDef.getInDocument());

                CdmEntityDefinition resolvedEntityDef = null;
                String outputEntityName = "";
                String outputEntityFileName = "";
                String entityFileName = "";

                if (expectedContext_default != null && expected_default != null) {
                    entityFileName = "default";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>()));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_default, expected_default, resolvedEntityDef);
                }

                if (expectedContext_normalized != null && expected_normalized != null) {
                    entityFileName = "normalized";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("normalized"))));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_normalized, expected_normalized, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly != null && expected_referenceOnly != null) {
                    entityFileName = "referenceOnly";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly"))));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_referenceOnly, expected_referenceOnly, resolvedEntityDef);
                }

                if (expectedContext_structured != null && expected_structured != null) {
                    entityFileName = "structured";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("structured"))));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_structured, expected_structured, resolvedEntityDef);
                }

                if (expectedContext_normalized_structured != null && expected_normalized_structured != null) {
                    entityFileName = "normalized_structured";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("normalized", "structured"))));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_normalized_structured, expected_normalized_structured, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_normalized != null && expected_referenceOnly_normalized != null) {
                    entityFileName = "referenceOnly_normalized";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_referenceOnly_normalized, expected_referenceOnly_normalized, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_structured != null && expected_referenceOnly_structured != null) {
                    entityFileName = "referenceOnly_structured";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "structured"))));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_referenceOnly_structured, expected_referenceOnly_structured, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_normalized_structured != null && expected_referenceOnly_normalized_structured != null) {
                    entityFileName = "referenceOnly_normalized_structured";
                    resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized", "structured"))));
                    outputEntityName = sourceEntityName + "_Resolved_" + entityFileName;
                    outputEntityFileName = outputEntityName + ".cdm.json";
                    resolvedEntityDef = srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt).join();
                    validateOutputWithValues(expectedContext_referenceOnly_normalized_structured, expected_referenceOnly_normalized_structured, resolvedEntityDef);
                }

            } catch (Exception e) {
                Assert.fail();
            }
        });
    }

    /**
     * Runs validation to test actual output vs expected output for attributes collection vs attribute context.
     */
    protected static void validateOutputWithValues(
        final AttributeContextExpectedValue expectedContext,
        final List<AttributeExpectedValue> expectedAttributes,
        final CdmEntityDefinition actualResolvedEntityDef
    ) {
        ObjectValidator.validateAttributesCollection(expectedAttributes, actualResolvedEntityDef.getAttributes());
        ObjectValidator.validateAttributeContext(expectedContext, actualResolvedEntityDef.getAttributeContext());
    }
}
