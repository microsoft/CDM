// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * A test class for testing the AddSupportingAttribute operation in a projection and in a resolution guidance
 */
public class ProjectionAddSupportingAttributeTest {
  /**
   * All possible combinations of the different resolution directives
   */
  private static List<List<String>> resOptsCombinations = new ArrayList<>(
      Arrays.asList(
          new ArrayList<>(Arrays.asList()),
          new ArrayList<>(Arrays.asList("referenceOnly")),
          new ArrayList<>(Arrays.asList("normalized")), new ArrayList<>(Arrays.asList("structured")),
          new ArrayList<>(Arrays.asList("referenceOnly", "normalized")),
          new ArrayList<>(Arrays.asList("referenceOnly", "virtual")),
          new ArrayList<>(Arrays.asList("referenceOnly", "structured")),
          new ArrayList<>(Arrays.asList("normalized", "structured")),
          new ArrayList<>(Arrays.asList("normalized", "structured", "virtual")),
          new ArrayList<>(Arrays.asList("referenceOnly", "normalized", "structured"))));
          // TODO: re-add this option, need to figure out a way to avoid long path.
          // new ArrayList<>(Arrays.asList("referenceOnly", "normalized", "structured", "virtual"))));

  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File(new File(new File("cdm"), "projection"),
      "testProjectionAddSupportingAttr").toString();

  /**
   * AddSupportingAttribute with replaceAsForeignKey operation in the same
   * projection
   * 
   * @throws ExecutionException
   */
  @Test
  public void testCombineOpsProj() throws InterruptedException, ExecutionException {
        String testName = "testCombineOpsProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).get();

        //// Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Supporting attribute: "PersonInfo_display", rename "address" to "homeAddress"
        Assert.assertEquals(7, resolvedEntity.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("homeAddress", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
        validateInSupportOfAttribute(resolvedEntity.getAttributes().get(6), "email");
    }

    /**
     * Test AddAttributeGroup operation with a "referenceOnly" and "virtual" condition
     */
    @Test
    public void testConditionalProj() throws InterruptedException, ExecutionException {
        String testName = "testConditionalProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).get();

        //// Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        //// Condition not met, don't include supporting attribute
        Assert.assertEquals(5, resolvedEntity.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());

        CdmEntityDefinition resolvedEntity2 = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly", "virtual"))).get();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition met, include the supporting attribute
        Assert.assertEquals(6, resolvedEntity2.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(4)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(5)).getName());
        validateInSupportOfAttribute(resolvedEntity2.getAttributes().get(5), "email");
    }

    /**
     * Test resolving an entity attribute using resolution guidance
     */
    @Test
    public void testEntityAttribute() throws InterruptedException, ExecutionException {
        String testName = "testEntityAttribute";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();

        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).get();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(2, resolvedEntity.getAttributes().size());
        Assert.assertEquals("id", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        validateInSupportOfAttribute(resolvedEntity.getAttributes().get(1), "id", false);

        // Resolve without directives
        resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).get();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(6, resolvedEntity.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        validateInSupportOfAttribute(resolvedEntity.getAttributes().get(5), "email", false);
    }

    /**
     * Test resolving an entity attribute with add supporint attribute operation
     */
    @Test
    public void testEntityAttributeProj() throws InterruptedException, ExecutionException {
        String testName = "testEntityAttributeProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).get();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(6, resolvedEntity.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        validateInSupportOfAttribute(resolvedEntity.getAttributes().get(5), "email");
    }

    /**
     * addSupportingAttribute on an entity definition using resolution guidance
     */
    @Test
    public void testExtendsEntity() throws InterruptedException, ExecutionException {
        String testName = "testExtendsEntity";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).get();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Supporting attribute: "PersonInfo_display" (using extendsEntityResolutionGuidance)
        Assert.assertEquals(6, resolvedEntity.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        validateInSupportOfAttribute(resolvedEntity.getAttributes().get(5), "email", false);
    }

    /**
     * addSupportingAttribute on an entity definition
     */
    @Test
    public void testExtendsEntityProj() throws InterruptedException, ExecutionException {
        String testName = "testExtendsEntityProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).get();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Supporting attribute: "PersonInfo_display" (using extendsEntityResolutionGuidance)
        Assert.assertEquals(6, resolvedEntity.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        validateInSupportOfAttribute(resolvedEntity.getAttributes().get(5), "email");
    }

    /**
     * Nested replaceAsForeignKey with addSupporingAttribute
     */
    @Test
    public void testNestedProj() throws InterruptedException, ExecutionException {
        String testName = "testNestedProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).get();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(2, resolvedEntity.getAttributes().size());
        Assert.assertEquals("personId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo_display", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        validateInSupportOfAttribute(resolvedEntity.getAttributes().get(1), "personId");
    }

    /**
     * Test resolving a type attribute with an add supporting attribute operation
     */
    @Test
    public void testNestedTypeAttributeProj() throws InterruptedException, ExecutionException {
        String testName = "testNestedTAProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).get();

        // Original set of attributes: ["PersonInfo"]
        Assert.assertEquals(2, resolvedEntity.getAttributes().size());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        CdmTypeAttributeDefinition supportingAttribute = (CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1);
        Assert.assertEquals("name_display", supportingAttribute.getName());
        validateInSupportOfAttribute(supportingAttribute, "name", false);
    }

    /**
     * Test resolving a type attribute using resolution guidance
     */
    @Test
    public void testTypeAttribute() throws InterruptedException, ExecutionException {
        String testName = "testTypeAttribute";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
          ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("structured"))).get();

        // Original set of attributes: ["PersonInfo"]
        Assert.assertEquals(2, resolvedEntity.getAttributes().size());
        Assert.assertEquals("PersonInfo", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        CdmTypeAttributeDefinition supportingAttribute = (CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1);
        Assert.assertEquals("PersonInfo_display", supportingAttribute.getName());
        validateInSupportOfAttribute(supportingAttribute, "PersonInfo", false);
    }

    /**
     * Test resolving a type attribute with an add supporting attribute operation
     */
    @Test
    public void testTypeAttributeProj() throws InterruptedException, ExecutionException {
        String testName = "testTypeAttributeProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).get();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).get();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).get();

        // Original set of attributes: ["PersonInfo"]
        Assert.assertEquals(2, resolvedEntity.getAttributes().size());
        Assert.assertEquals("PersonInfo", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        CdmTypeAttributeDefinition supportingAttribute = (CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1);
        Assert.assertEquals("PersonInfo_display", supportingAttribute.getName());
        validateInSupportOfAttribute(supportingAttribute, "PersonInfo", false);
    }

    private void validateInSupportOfAttribute(CdmAttributeItem supportingAttribute, String fromAttribute) {
      validateInSupportOfAttribute(supportingAttribute, fromAttribute, true);
    }

    /**
     * Validates that the supporting attribute has the "is.addedInSupportOf" and "is.virtual.attribute" traits
     * @param supportingAttribute
     * @param fromAttribute
     */
    private void validateInSupportOfAttribute(CdmAttributeItem supportingAttribute, String fromAttribute, Boolean checkVirtualTrait) {
        CdmTraitReference inSupportOfTrait = supportingAttribute.getAppliedTraits().item("is.addedInSupportOf");
        Assert.assertNotNull(inSupportOfTrait);
        Assert.assertEquals(1, inSupportOfTrait.getArguments().size());
        Assert.assertEquals(fromAttribute, inSupportOfTrait.getArguments().get(0).getValue());

        if (checkVirtualTrait) {
            Assert.assertNotNull(supportingAttribute.getAppliedTraits().item("is.virtual.attribute"), "Missing is.virtual.attribute traits");
        }
    }
}
