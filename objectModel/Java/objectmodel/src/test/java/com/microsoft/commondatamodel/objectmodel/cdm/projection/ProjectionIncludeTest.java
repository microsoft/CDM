// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationIncludeAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * A test class for testing the IncludeAttributes operation in a projection as well as SelectsSomeTakeNames in a resolution guidance
 */
public class ProjectionIncludeTest {
    /**
     * All possible combinations of the different resolution directives
     */
    private static List<List<String>> resOptsCombinations = new ArrayList<>(
            Arrays.asList(
                    new ArrayList<>(Arrays.asList()),
                    new ArrayList<>(Arrays.asList("referenceOnly")),
                    new ArrayList<>(Arrays.asList("normalized")),
                    new ArrayList<>(Arrays.asList("structured")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "normalized")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "structured")),
                    new ArrayList<>(Arrays.asList("normalized", "structured")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "normalized", "structured"))
            )
    );

    /**
     * Path to foundations
     */
    private static final String foundationJsonPath = "cdm:/foundations.cdm.json";

    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
            new File(new File(new File(
                    "cdm"),
                    "projection"),
                    "testProjectionInclude")
                    .toString();

    /**
     * Test for entity extends with resolution guidance with a SelectsSomeTakeNames
     */
    @Test
    public void testExtends() throws InterruptedException {
        String testName = "testExtends";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for entity extends with projection with an includeAttributes operation
     */
    @Test
    public void testExtendsProj() throws InterruptedException {
        String testName = "testExtendsProj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for entity attribute with resolution guidance with a SelectsSomeTakeNames
     */
    @Test
    public void testEA() throws InterruptedException {
        String testName = "testEA";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for entity attribute with projection with an includeAttributes operation
     */
    @Test
    public void testEAProj() throws InterruptedException {
        String testName = "testEAProj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for object model
     */
    @Test
    public void testEAProjOM() throws InterruptedException {
        String className = "testProjectionInclude";
        String testName = "testEAProjOM";
        String entityName_RGB = "RGB";

        List<TypeAttributeParam> attributeParams_RGB = new ArrayList<TypeAttributeParam>();
        attributeParams_RGB.add(new TypeAttributeParam("Red", "string", "hasA"));
        attributeParams_RGB.add(new TypeAttributeParam("Green", "string", "hasA"));
        attributeParams_RGB.add(new TypeAttributeParam("Blue", "string", "hasA"));
        attributeParams_RGB.add(new TypeAttributeParam("IsGrayscale", "boolean", "hasA"));

        String entityName_Color = "Color";
        List<TypeAttributeParam> attributeParams_Color = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Color.add(new TypeAttributeParam("ColorName", "string", "identifiedBy"));
        }

        List<String> includeAttributeNames = new ArrayList<String>();
        includeAttributeNames.add("Red");
        includeAttributeNames.add("Green");
        includeAttributeNames.add("Blue");

        ProjectionOMTestUtil util = new ProjectionOMTestUtil(className, testName);
        CdmEntityDefinition entity_RGB = util.createBasicEntity(entityName_RGB, attributeParams_RGB);
        util.validateBasicEntity(entity_RGB, entityName_RGB, attributeParams_RGB);

        CdmEntityDefinition entity_Color = util.createBasicEntity(entityName_Color, attributeParams_Color);
        util.validateBasicEntity(entity_Color, entityName_Color, attributeParams_Color);

        CdmProjection projection_RGBColor = util.createProjection(entity_RGB.getEntityName());
        CdmOperationIncludeAttributes operation_IncludeAttributes = util.createOperationInputAttributes(projection_RGBColor, includeAttributeNames);
        CdmEntityReference projectionEntityRef_RGBColor = util.createProjectionInlineEntityReference(projection_RGBColor);

        CdmEntityAttributeDefinition entityAttribute_RGBColor = util.createEntityAttribute("RGBColor", projectionEntityRef_RGBColor);
        entity_Color.getAttributes().add(entityAttribute_RGBColor);

        for (List<String> resOpts : resOptsCombinations) {
            CdmEntityDefinition resolvedEntity_Color = util.getAndValidateResolvedEntity(entity_Color, resOpts);
        }

        util.getDefaultManifest().saveAsAsync(util.getManifestDocName(), true).join();

        util.dispose();
    }

    /**
     * Test for leaf level projection
     */
    @Test
    public void testNested1of3Proj() throws InterruptedException {
        String testName = "testNested1of3Proj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for mid level projection
     */
    @Test
    public void testNested2of3Proj() throws InterruptedException {
        String testName = "testNested2of3Proj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for top level projection
     */
    @Test
    public void testNested3of3Proj() throws InterruptedException {
        String testName = "testNested3of3Proj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for Condition = "false"
     */
    @Test
    public void testConditionProj() throws InterruptedException {
        String testName = "testConditionProj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for SelectsSomeTakeNames by Group Name
     */
    @Test
    public void testGroupName() throws InterruptedException {
        String testName = "testGroupName";
        String entityName = "Product";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for include attributes operation by Group Name
     */
    @Test
    public void testGroupNameProj() throws InterruptedException {
        String testName = "testGroupNameProj";
        String entityName = "Product";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for SelectsSomeTakeNames from an Array
     */
    @Test
    public void testArray() throws InterruptedException {
        String testName = "testArray";
        String entityName = "Sales";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for SelectsSomeTakeNames from a renamed Array
     */
    @Test
    public void testArrayRename() throws InterruptedException {
        String testName = "testArrayRename";
        String entityName = "Sales";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for Include Attributes from an Array
     */
    @Test
    public void testArrayProj() throws InterruptedException {
        String testName = "testArrayProj";
        String entityName = "Sales";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for SelectsSomeTakeNames from a Polymorphic Source
     */
    @Test
    public void testPolymorphic() throws InterruptedException {
        String testName = "testPolymorphic";
        String entityName = "Person";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for Include Attributes from a Polymorphic Source
     */
    @Test
    public void testPolymorphicProj() throws InterruptedException {
        String testName = "testPolymorphicProj";
        String entityName = "Person";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for entity attribute with resolution guidance with an empty SelectsSomeTakeNames list
     */
    @Test
    public void testEmpty() throws InterruptedException {
        String testName = "testEmpty";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for entity attribute with projection with an empty includeAttributes operation list
     */
    @Test
    public void testEmptyProj() throws InterruptedException {
        String testName = "testEmptyProj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for Nested Projections that include then exclude some attributes
     */
    @Test
    public void testNestedIncludeExcludeProj() throws InterruptedException {
        String testName = "testNestedIncludeExcludeProj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for Projections with include and exclude
     */
    @Test
    public void testIncludeExcludeProj() throws InterruptedException {
        String testName = "testIncludeExcludeProj";
        String entityName = "Color";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }
}
