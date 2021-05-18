// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import org.testng.Assert;
import org.testng.annotations.Ignore;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * A test class for testing the CombineAttributes operation in a projection as well as Select 'one' in a resolution guidance
 */
public class ProjectionCombineTest {
    /**
     * All possible combinations of the different resolution directives
     */
    private static final List<List<String>> resOptsCombinations = new ArrayList<>(
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
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
            new File(new File(new File(
                    "cdm"),
                    "projection"),
                    "testProjectionCombine")
                    .toString();

    /**
     * Test Entity Extends with a Resolution Guidance that selects 'one'
     */
    @Test
    public void TestExtends() throws InterruptedException {
        String testName = "TestExtends";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Entity Extends with a Combine Attributes operation
     */
    @Test
    public void TestExtendsProj() throws InterruptedException {
        String testName = "TestExtendsProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Entity Attribute with a Resolution Guidance that selects 'one'
     */
    @Test
    public void TestEA() throws InterruptedException {
        String testName = "TestEA";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Entity Attribute with a Combine Attributes operation
     */
    @Test
    public void TestEAProj() throws InterruptedException {
        String testName = "TestEAProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Entity Attribute with a Combine Attributes operation but IsPolymorphicSource flag set to false
     */
    @Test
    public void TestNonPolymorphicProj() throws InterruptedException {
        String testName = "TestNonPolymorphicProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Combined attributes ["phoneNumber", "email"] into "contactAt"
        Assert.assertEquals(4, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("contactAt", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
    }

    /**
     * Test a Combine Attributes operation with an empty select list
     */
    @Test
    public void TestEmptyProj() throws InterruptedException {
        String testName = "TestEmptyProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test a collection of Combine Attributes operation
     */
    @Test
    public void TestCollProj() throws InterruptedException {
        String testName = "TestCollProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Nested Combine Attributes operations
     */
    @Test
    public void TestNestedProj() throws InterruptedException {
        String testName = "TestNestedProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Multiple Nested Operations with Combine including ArrayExpansion and Rename
     */
    @Test
    public void TestMultiProj() throws InterruptedException {
        String testName = "TestMultiProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            if (resOpt.contains("structured")) {
                // Array expansion is not supported on an attribute group yet.
                continue;
            }
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test a Combine Attributes operation with condition set to false
     */
    @Test
    public void TestCondProj() throws InterruptedException {
        String testName = "TestCondProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Nested Combine with Rename Operation
     */
    @Test
    public void TestRenProj() throws InterruptedException {
        String testName = "TestRenProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            if (resOpt.contains("structured")) {
                // Rename attributes is not supported on an attribute group yet.
                continue;
            }
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test Entity Attribute with a Combine Attributes operation that selects a common already 'merged' attribute (e.g. IsPrimary)
     */
    @Test
    public void TestCommProj() throws InterruptedException {
        String testName = "TestCommProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test a Combine Attributes operation by selecting missing attributes
     */
    @Test
    public void TestMissProj() throws InterruptedException {
        String testName = "TestMissProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test a Combine Attributes operation with a different sequence of selection attributes
     */
    @Test
    public void TestSeqProj() throws InterruptedException {
        String testName = "TestSeqProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test for object model
     */
    @Test
    public void TestEAProjOM() throws InterruptedException {
        String className = "TestProjectionCombine";
        String testName = "TestEAProjOM";

        String entityName_Email = "Email";
        List<TypeAttributeParam> attributeParams_Email = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Email.add(new TypeAttributeParam("EmailID", "string", "identifiedBy"));
            attributeParams_Email.add(new TypeAttributeParam("Address", "string", "hasA"));
            attributeParams_Email.add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
        }

        String entityName_Phone = "Phone";
        List<TypeAttributeParam> attributeParams_Phone = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Phone.add(new TypeAttributeParam("PhoneID", "string", "identifiedBy"));
            attributeParams_Phone.add(new TypeAttributeParam("Number", "string", "hasA"));
            attributeParams_Phone.add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
        }

        String entityName_Social = "Social";
        List<TypeAttributeParam> attributeParams_Social = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Social.add(new TypeAttributeParam("SocialID", "string", "identifiedBy"));
            attributeParams_Social.add(new TypeAttributeParam("Account", "string", "hasA"));
            attributeParams_Social.add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
        }

        String entityName_Customer = "Customer";
        List<TypeAttributeParam> attributeParams_Customer = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Customer.add(new TypeAttributeParam("CustomerName", "string", "hasA"));
        }

        List<String> selectedAttributes = new ArrayList<String>();
        selectedAttributes.add("EmailID");
        selectedAttributes.add("PhoneID");
        selectedAttributes.add("SocialID");

        ProjectionOMTestUtil util = new ProjectionOMTestUtil(className, testName);
        CdmEntityDefinition entity_Email = util.createBasicEntity(entityName_Email, attributeParams_Email);
        util.validateBasicEntity(entity_Email, entityName_Email, attributeParams_Email);

        CdmEntityDefinition entity_Phone = util.createBasicEntity(entityName_Phone, attributeParams_Phone);
        util.validateBasicEntity(entity_Phone, entityName_Phone, attributeParams_Phone);

        CdmEntityDefinition entity_Social = util.createBasicEntity(entityName_Social, attributeParams_Social);
        util.validateBasicEntity(entity_Social, entityName_Social, attributeParams_Social);

        CdmEntityDefinition entity_Customer = util.createBasicEntity(entityName_Customer, attributeParams_Customer);
        util.validateBasicEntity(entity_Customer, entityName_Customer, attributeParams_Customer);

        CdmProjection projection_Customer = util.createProjection(entity_Customer.getEntityName());
        CdmTypeAttributeDefinition typeAttribute_MergeInto = util.createTypeAttribute("MergeInto", "string", "hasA");
        CdmOperationCombineAttributes operation_CombineAttributes = util.createOperationCombineAttributes(projection_Customer, selectedAttributes, typeAttribute_MergeInto);
        CdmEntityReference projectionEntityRef_Customer = util.createProjectionInlineEntityReference(projection_Customer);

        CdmEntityAttributeDefinition entityAttribute_ContactAt = util.createEntityAttribute("ContactAt", projectionEntityRef_Customer);
        entity_Customer.getAttributes().add(entityAttribute_ContactAt);

        for (List<String> resOpts : resOptsCombinations) {
            CdmEntityDefinition resolvedEntity_Customer = util.getAndValidateResolvedEntity(entity_Customer, resOpts);
        }

        util.getDefaultManifest().saveAsAsync(util.getManifestDocName(), true);
    }
}
