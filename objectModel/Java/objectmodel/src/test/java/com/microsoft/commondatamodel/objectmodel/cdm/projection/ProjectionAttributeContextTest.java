// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
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
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "ProjectionAttributeContextTest").toString();

    /**
     * Extends entity with a string reference
     */
    @Test
    public void testEntityStringReference() throws InterruptedException {
        String testName = "testEntityStringReference";
        String entityName = "TestEntStrRef";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Extends entity with an entity reference
     */
    @Test
    public void testEntityEntityReference() throws InterruptedException {
        String testName = "testEntityEntityReference";
        String entityName = "TestEntEntRef";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Extends entity with a projection
     */
    @Test
    public void testEntityProjection() throws InterruptedException {
        String testName = "testEntityProjection";
        String entityName = "TestEntityProjection";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Extends entity with a nested projection
     */
    @Test
    public void testEntityNestedProjection() throws InterruptedException {
        String testName = "testEntityNestedProjection";
        String entityName = "NestedProjection";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Entity attribute referenced with a string
     */
    @Test
    public void testEntityAttributeStringReference() throws InterruptedException {
        String testName = "testEntityAttributeStringReference";
        String entityName = "TestEntAttrStrRef";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Entity attribute referenced with an entity reference
     */
    @Test
    public void testEntityAttributeEntityReference() throws InterruptedException {
        String testName = "testEntityAttributeEntityReference";
        String entityName = "TestEntAttrEntRef";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Entity attribute referenced with a projection
     */
    @Test
    public void testEntityAttributeProjection() throws InterruptedException {
        String testName = "testEntityAttributeProjection";
        String entityName = "TestEntAttrProj";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Entity attribute referenced with a nested projection
     */
    @Test
    public void testEntityAttributeNestedProjection() throws InterruptedException {
        String testName = "testEntityAttributeNestedProjection";
        String entityName = "NestedProjection";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();
    }

    /**
     * Entity that exhibits custom traits
     */
    @Test
    public void testEntityTrait() throws InterruptedException {
        String testName = "testEntityTrait";
        String entityName = "TestEntityTrait";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "TestAttribute");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getValue(), "TestTrait Param 1 DefaultValue");
    }

    /**
     * Entity that extends and exhibits custom traits
     */
    @Test
    public void testEntityExtendsTrait() throws InterruptedException {
        String testName = "testEntityExtendsTrait";
        String entityName = "ExtendsTrait";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "TestExtendsTraitAttribute");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4).getNamedReference(), "testTraitDerived");
        // Trait Param Name
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getValue(), "TestTrait Param 1 DefaultValue");
    }

    /**
     * Entity with projection that exhibits custom traits
     */
    @Test
    public void testProjectionTrait() throws InterruptedException {
        String testName = "testProjectionTrait";
        String entityName = "TestProjectionTrait";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "TestProjectionAttribute");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getValue(), "TestTrait Param 1 DefaultValue");
    }

    /**
     * Entity with projection that extends and exhibits custom traits
     */
    @Test
    public void testProjectionExtendsTrait() throws InterruptedException {
        String testName = "testProjectionExtendsTrait";
        String entityName = "ExtendsTrait";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, new ArrayList<String>()).join();

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "TestProjectionAttribute");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(0).getAppliedTraits().get(4)).getArguments().get(0).getValue(), "TestTrait Param 1 DefaultValue");

        // Attribute Name
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "TestProjectionAttributeB");
        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(1).getAppliedTraits().get(3).getNamedReference(), "does.haveDefault");
        // Trait Name
        Assert.assertEquals( resolvedEntity.getAttributes().get(1).getAppliedTraits().get(4).getNamedReference(), "testTrait");
        // Trait Param Name
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(1).getAppliedTraits().get(4)).getArguments().get(0).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(1).getAppliedTraits().get(4)).getArguments().get(0).getValue(), "TestTrait Param 1 DefaultValue");

        // Trait Name
        Assert.assertEquals(resolvedEntity.getAttributes().get(1).getAppliedTraits().get(5).getNamedReference(), "testExtendsTraitB");
        // Trait Param Name
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(1).getAppliedTraits().get(5)).getArguments().get(0).getResolvedParameter().getName(), "testTraitParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(1).getAppliedTraits().get(5)).getArguments().get(0).getValue(), "TestTrait Param 1 DefaultValue");
        // Trait Param Name
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(1).getAppliedTraits().get(5)).getArguments().get(1).getResolvedParameter().getName(), "testExtendsTraitBParam1");
        // Trait Param Default Value
        Assert.assertEquals(((CdmTraitReference) resolvedEntity.getAttributes().get(1).getAppliedTraits().get(5)).getArguments().get(1).getValue(), "TestExtendsTraitB Param 1 DefaultValue");
    }
}