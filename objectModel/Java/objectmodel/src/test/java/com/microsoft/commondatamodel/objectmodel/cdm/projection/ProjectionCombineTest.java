// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
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
                    "testProjectionCombine")
                    .toString();

    /**
     * Test Entity Extends with a Resolution Guidance that selects 'one'
     */
    @Ignore("Please refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/446164")
    @Test
    public void TestExtends() throws InterruptedException {
        String testName = "TestExtends";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Entity Extends with a Combine Attributes operation
     */
    @Test
    public void TestExtendsProj() throws InterruptedException {
        String testName = "TestExtendsProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Entity Attribute with a Resolution Guidance that selects 'one'
     */
    @Test
    public void TestEA() throws InterruptedException {
        String testName = "TestEA";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Entity Attribute with a Combine Attributes operation
     */
    @Test
    public void TestEAProj() throws InterruptedException {
        String testName = "TestEAProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Entity Attribute with a Combine Attributes operation but IsPolymorphicSource flag set to false
     */
    @Test
    public void TestFalseProj() throws InterruptedException {
        String testName = "TestFalseProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test a Combine Attributes operation with an empty select list
     */
    @Test
    public void TestEmptyProj() throws InterruptedException {
        String testName = "TestEmptyProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test a collection of Combine Attributes operation
     */
    @Test
    public void TestCollProj() throws InterruptedException {
        String testName = "TestCollProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Nested Combine Attributes operations
     */
    @Test
    public void TestNestedProj() throws InterruptedException {
        String testName = "TestNestedProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Multiple Nested Operations with Combine including ArrayExpansion and Rename
     */
    @Test
    public void TestMultiProj() throws InterruptedException {
        String testName = "TestMultiProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test a Combine Attributes operation with condition set to false
     */
    @Test
    public void TestCondProj() throws InterruptedException {
        String testName = "TestCondProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Nested Combine with Rename Operation
     */
    @Test
    public void TestRenProj() throws InterruptedException {
        String testName = "TestRenProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test Entity Attribute with a Combine Attributes operation that selects a common already 'merged' attribute (e.g. IsPrimary)
     */
    @Test
    public void TestCommProj() throws InterruptedException {
        String testName = "TestCommProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test a Combine Attributes operation by selecting missing attributes
     */
    @Test
    public void TestMissProj() throws InterruptedException {
        String testName = "TestMissProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    }

    /**
     * Test a Combine Attributes operation with a different sequence of selection attributes
     */
    @Test
    public void TestSeqProj() throws InterruptedException {
        String testName = "TestSeqProj";
        String entityName = "Customer";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
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
            attributeParams_Email.add(new TypeAttributeParam("EmailID", "String", "identifiedBy"));
            attributeParams_Email.add(new TypeAttributeParam("Address", "String", "hasA"));
            attributeParams_Email.add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
        }

        String entityName_Phone = "Phone";
        List<TypeAttributeParam> attributeParams_Phone = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Phone.add(new TypeAttributeParam("PhoneID", "String", "identifiedBy"));
            attributeParams_Phone.add(new TypeAttributeParam("Number", "String", "hasA"));
            attributeParams_Phone.add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
        }

        String entityName_Social = "Social";
        List<TypeAttributeParam> attributeParams_Social = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Social.add(new TypeAttributeParam("SocialID", "String", "identifiedBy"));
            attributeParams_Social.add(new TypeAttributeParam("Account", "String", "hasA"));
            attributeParams_Social.add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
        }

        String entityName_Customer = "Customer";
        List<TypeAttributeParam> attributeParams_Customer = new ArrayList<TypeAttributeParam>();
        {
            attributeParams_Customer.add(new TypeAttributeParam("CustomerName", "String", "hasA"));
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
        CdmTypeAttributeDefinition typeAttribute_MergeInto = util.createTypeAttribute("MergeInto", "String", "hasA");
        CdmOperationCombineAttributes operation_CombineAttributes = util.createOperationCombineAttributes(projection_Customer, selectedAttributes, typeAttribute_MergeInto);
        CdmEntityReference projectionEntityRef_Customer = util.createProjectionInlineEntityReference(projection_Customer);

        CdmEntityAttributeDefinition entityAttribute_ContactAt = util.createEntityAttribute("ContactAt", projectionEntityRef_Customer);
        entity_Customer.getAttributes().add(entityAttribute_ContactAt);

        for (List<String> resOpts : resOptsCombinations) {
            CdmEntityDefinition resolvedEntity_Customer = util.getAndValidateResolvedEntity(entity_Customer, resOpts);
        }

        util.getDefaultManifest().saveAsAsync(util.getManifestDocName(), true);
    }

    /**
     * Loads an entity, resolves it, and then validates the generated attribute contexts
     */
    private void loadEntityForResolutionOptionAndSave(String testName, String entityName, List<String> resOpts) throws InterruptedException {
        String expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);
        String fileNameSuffix = ProjectionTestUtils.getResolutionOptionNameSuffix(resOpts);

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        corpus.getStorage().mount("expected", new LocalAdapter(expectedOutputPath));
        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        Assert.assertNotNull(entity);
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, resOpts, true).join();
        Assert.assertNotNull(resolvedEntity);

        ValidateResolvedAttributes(corpus, resolvedEntity, entityName, fileNameSuffix);

        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, "" + entityName + fileNameSuffix, resolvedEntity);
    }

    /**
     * Validate the list of resolved attributes against an expected list
     */
    private void ValidateResolvedAttributes(CdmCorpusDefinition corpus, CdmEntityDefinition actualResolvedEntity, String entityName, String fileNameSuffix) {
        CdmEntityDefinition expectedResolvedEntity = (CdmEntityDefinition) corpus.fetchObjectAsync(
                "expected:/Resolved_" + entityName + fileNameSuffix + ".cdm.json/Resolved_" + entityName + fileNameSuffix).join();

        Assert.assertEquals(expectedResolvedEntity.getAttributes().size(), actualResolvedEntity.getAttributes().size());
        for (int i = 0; i < expectedResolvedEntity.getAttributes().size(); i++) {
            Assert.assertEquals(expectedResolvedEntity.getAttributes().get(i).fetchObjectDefinitionName(), actualResolvedEntity.getAttributes().get(i).fetchObjectDefinitionName());
        }
    }
}
