// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;

/**
 * A test class to verify the attribute context tree and traits generated for various resolution scenarios
 * given a default resolution option/directive.
 */
public class ProjectionAttributeContextTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testProjectionAttributeContext")
            .toString();

    /**
     * Extends entity with a string reference
     */
    @Test
    public void testEntityStringReference() throws InterruptedException {
        String testName = "testEntityStringReference";
        String entityName = "TestEntityStringReference";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityStringReference = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityStringReference);
        CdmEntityDefinition resolvedTestEntityStringReference = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityStringReference, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityStringReference);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityStringReference);
    }

    /**
     * Extends entity with an entity reference
     */
    @Test
    public void testEntityEntityReference() throws InterruptedException {
        String testName = "testEntityEntityReference";
        String entityName = "TestEntityEntityReference";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityEntityReference = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityEntityReference);
        CdmEntityDefinition resolvedTestEntityEntityReference = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityEntityReference, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityEntityReference);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityEntityReference);
    }

    /**
     * Extends entity with a projection
     */
    @Test
    public void testEntityProjection() throws InterruptedException {
        String testName = "testEntityProjection";
        String entityName = "TestEntityProjection";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityProjection = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityProjection);
        CdmEntityDefinition resolvedTestEntityProjection = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityProjection, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityProjection);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityProjection);
    }

    /**
     * Extends entity with a nested projection
     */
    @Test
    public void testEntityNestedProjection() throws InterruptedException {
        String testName = "testEntityNestedProjection";
        String entityName = "TestEntityNestedProjection";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityNestedProjection = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityNestedProjection);
        CdmEntityDefinition resolvedTestEntityNestedProjection = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityNestedProjection, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityNestedProjection);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityNestedProjection);
    }

    /**
     * Entity attribute referenced with a string
     */
    @Test
    public void testEntityAttributeStringReference() throws InterruptedException {
        String testName = "testEntityAttributeStringReference";
        String entityName = "TestEntityAttributeStringReference";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityAttributeStringReference = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityAttributeStringReference);
        CdmEntityDefinition resolvedTestEntityAttributeStringReference = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeStringReference, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityAttributeStringReference);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeStringReference);
    }

    /**
     * Entity attribute referenced with an entity reference
     */
    @Test
    public void testEntityAttributeEntityReference() throws InterruptedException {
        String testName = "testEntityAttributeEntityReference";
        String entityName = "TestEntityAttributeEntityReference";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityAttributeEntityReference = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityAttributeEntityReference);
        CdmEntityDefinition resolvedTestEntityAttributeEntityReference = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeEntityReference, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityAttributeEntityReference);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeEntityReference);
    }

    /**
     * Entity attribute referenced with a projection
     */
    @Test
    public void testEntityAttributeProjection() throws InterruptedException {
        String testName = "testEntityAttributeProjection";
        String entityName = "TestEntityAttributeProjection";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityAttributeProjection = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityAttributeProjection);
        CdmEntityDefinition resolvedTestEntityAttributeProjection = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeProjection, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityAttributeProjection);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeProjection);
    }

    /**
     * Entity attribute referenced with a nested projection
     */
    @Test
    public void testEntityAttributeNestedProjection() throws InterruptedException {
        String testName = "testEntityAttributeNestedProjection";
        String entityName = "TestEntityAttributeNestedProjection";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityAttributeNestedProjection = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityAttributeNestedProjection);
        CdmEntityDefinition resolvedTestEntityAttributeNestedProjection = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeNestedProjection, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityAttributeNestedProjection);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeNestedProjection);
    }

    /**
     * Entity that exhibits custom traits
     */
    @Test
    public void testEntityTrait() throws InterruptedException {
        String testName = "testEntityTrait";
        String entityName = "TestEntityTrait";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityTrait);
        CdmEntityDefinition resolvedTestEntityTrait = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityTrait, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityTrait);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityTrait);

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestEntityTrait.getAttributes().get(0)).getName(), "TestAttribute");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestEntityTrait.getAttributes().get(0)).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestEntityTrait.getAttributes().get(0)).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestEntityTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestEntityTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getValue(), "TestTrait Param 1 DefaultValue");
    }

    /**
     * Entity that extends and exhibits custom traits
     */
    @Test
    public void testEntityExtendsTrait() throws InterruptedException {
        String testName = "testEntityExtendsTrait";
        String entityName = "TestEntityExtendsTrait";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestEntityExtendsTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestEntityExtendsTrait);
        CdmEntityDefinition resolvedTestEntityExtendsTrait = ProjectionTestUtils.getResolvedEntity(corpus, entTestEntityExtendsTrait, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestEntityExtendsTrait);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityExtendsTrait);

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestEntityExtendsTrait.getAttributes().get(0)).getName(), "TestExtendsTraitAttribute");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestEntityExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestEntityExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(4).getNamedReference(), "testTraitDerived");
        // Trait Param Name
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestEntityExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestEntityExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getValue(), "TestTrait Param 1 DefaultValue");
    }

    /**
     * Entity with projection that exhibits custom traits
     */
    @Test
    public void testProjectionTrait() throws InterruptedException {
        String testName = "testProjectionTrait";
        String entityName = "TestProjectionTrait";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestProjectionTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestProjectionTrait);
        CdmEntityDefinition resolvedTestProjectionTrait = ProjectionTestUtils.getResolvedEntity(corpus, entTestProjectionTrait, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestProjectionTrait);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestProjectionTrait);

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionTrait.getAttributes().get(0)).getName(), "TestProjectionAttribute");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionTrait.getAttributes().get(0)).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionTrait.getAttributes().get(0)).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getValue(), "TestTrait Param 1 DefaultValue");
    }

    /**
     * Entity with projection that extends and exhibits custom traits
     */
    @Test
    public void testProjectionExtendsTrait() throws InterruptedException {
        String testName = "testProjectionExtendsTrait";
        String entityName = "TestProjectionExtendsTrait";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);

        CdmEntityDefinition entTestProjectionExtendsTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entTestProjectionExtendsTrait);
        CdmEntityDefinition resolvedTestProjectionExtendsTrait = ProjectionTestUtils.getResolvedEntity(corpus, entTestProjectionExtendsTrait, new ArrayList<String>()).join();
        Assert.assertNotNull(resolvedTestProjectionExtendsTrait);
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestProjectionExtendsTrait);

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(0)).getName(), "TestProjectionAttribute");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(0)).getAppliedTraits().get(4).getArguments().get(0)).getValue(), "TestTrait Param 1 DefaultValue");

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getName(), "TestProjectionAttributeB");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(4).getArguments().get(0)).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(4).getArguments().get(0)).getValue(), "TestTrait Param 1 DefaultValue");

        // Trait Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(5).getNamedReference(), "testExtendsTraitB");
        // Trait Param Name
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(5).getArguments().get(0)).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(5).getArguments().get(0)).getValue(), "TestTrait Param 1 DefaultValue");
        // Trait Param Name
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(5).getArguments().get(1)).getResolvedParameter().getName(), "testExtendsTraitBParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmArgumentDefinition)((CdmTypeAttributeDefinition) resolvedTestProjectionExtendsTrait.getAttributes().get(1)).getAppliedTraits().get(5).getArguments().get(1)).getValue(), "TestExtendsTraitB Param 1 DefaultValue");
    }
}