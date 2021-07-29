
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAlterTraits;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Ignore;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class ProjectionAlterTraitsTest {
    /**
     * All possible combinations of the different resolution directives
     */
    private static List<List<String>> resOptsCombinations = new ArrayList<>(
            Arrays.asList(new ArrayList<>(Arrays.asList()), new ArrayList<>(Arrays.asList("referenceOnly")),
                    new ArrayList<>(Arrays.asList("normalized")), new ArrayList<>(Arrays.asList("structured")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "normalized")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "structured")),
                    new ArrayList<>(Arrays.asList("normalized", "structured")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "normalized", "structured"))));

    /**
     * The path between TestDataPath and TestName
     */
    private static final String TESTS_SUBPATH = new File(new File(new File("cdm"), "projection"),
            "testProjectionAlterTraits").toString();

    private static final String TRAIT_GROUP_FILE_PATH = new File(new File(new File(new File(TestHelper.TEST_DATA_PATH), "cdm"), "projection"), "testProjectionAlterTraits").toString();

    /**
     * Test AlterTraits on an type attribute.
     */
    @Test
    public void testAlterTraitsOnTypeAttrProj() throws InterruptedException {
        String testName = "testAlterTraitsOnTypeAttrProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 1);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(0), "FavoriteTerm", true);
    }

    /**
     * Test AlterTraits on an entity attribute.
     */
    @Test
    public void testAlterTraitsOnEntiAttrProj() throws InterruptedException {
        String testName = "testAlterTraitsOnEntiAttrProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 5);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(0), "name", true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(1), "age");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(2), "address");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(3), "phoneNumber");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(4), "email");
    }

    /**
     * Test AlterTraits on an attribute group.
     */
    @Test
    public void testAlterTraitsOnAttrGrpProj() throws InterruptedException {
        String testName = "testAlterTraitsOnAttrGrpProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();
        CdmAttributeGroupReference attGroupReference = (CdmAttributeGroupReference)resolvedEntity.getAttributes().get(0);
        CdmAttributeGroupDefinition attGroupDefinition = (CdmAttributeGroupDefinition)attGroupReference.getExplicitReference();
        Assert.assertEquals( attGroupDefinition.getMembers().getCount(), 5);
        Assert.assertNotNull(attGroupDefinition.getExhibitsTraits().item("means.TraitG100"));
        Assert.assertNotNull(attGroupDefinition.getExhibitsTraits().item("means.TraitG200"));
        Assert.assertNull(attGroupDefinition.getExhibitsTraits().item("means.TraitG300"));
        Assert.assertNotNull(attGroupDefinition.getExhibitsTraits().item("means.TraitG400"));
        CdmTraitReference traitG4 = (CdmTraitReference)attGroupDefinition.getExhibitsTraits().item("means.TraitG4");
        Assert.assertNotNull(traitG4);
        Assert.assertEquals(traitG4.getArguments().fetchValue("precision"), "5");
        Assert.assertEquals(traitG4.getArguments().fetchValue("scale"), "15");
    }

    /**
     * Test AlterTraits operation nested with IncludeAttributes and RenameAttribute.
     */
    @Test
    public void testCombineOpsNestedProj() throws InterruptedException {
        String testName = "testCombineOpsNestedProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Include attributes: ["age", "phoneNumber", "name"]
        // Add attribute: ["newName"]
        // alter traits on ["newName", "name", + { "means.TraitG100" , "JobTitleBase" } - { "means.TraitG300" } ]
        // Rename attribute ["newName" -> "renaming-{m}" ]
        // alter traits on ["renaming-newName", + { "means.TraitG4(precision:5, scale:15)" } ]
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 4);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(0), "name");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(1), "age", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(2), "phoneNumber", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(3), "renaming-newName", true);
    }

    /**
     * Test AddArtifactAttribute operation with a "structured" condition.
     */
    @Test
    public void testConditionalProj() throws InterruptedException {
        String testName = "testConditionalProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition not met, no traits are added
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 5);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(0), "name", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(1), "age", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(2), "address", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(3), "phoneNumber", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(4), "email", false, true);

        CdmEntityDefinition resolvedEntity2 = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("structured"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition met, new traits are added
        Assert.assertEquals(5, resolvedEntity2.getAttributes().getCount());
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity2.getAttributes().get(0), "name", true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity2.getAttributes().get(1), "age");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity2.getAttributes().get(2), "address");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity2.getAttributes().get(3), "phoneNumber");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity2.getAttributes().get(4), "email");
    }

    /**
     * Test for creating a projection with an AddAttributeGroup operation and a condition using the object model.
     */
    @Test
    public void testConditionalProjUsingObjectModel() throws InterruptedException {
        String testName =  "testConditionalProjUsingObjectModel";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        // Create an entity.
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);
        entity.getInDocument().getImports().add("traitGroup:/TraitGroup.cdm.json");

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);
        projection.setCondition("structured==true");
        projection.setRunSequentially(Boolean.TRUE);

        // Create an AlterTraits operation
        CdmOperationAlterTraits alterTraitsOp_1 = corpus.makeObject(CdmObjectType.OperationAlterTraitsDef);
        alterTraitsOp_1.setTraitsToAdd(new ArrayList<CdmTraitReferenceBase>());
        alterTraitsOp_1.getTraitsToAdd().add(corpus.makeRef(CdmObjectType.TraitRef, "means.TraitG100", true));
        alterTraitsOp_1.getTraitsToAdd().add(corpus.makeRef(CdmObjectType.TraitGroupRef, "JobTitleBase", true));
        alterTraitsOp_1.setTraitsToRemove(new ArrayList<CdmTraitReferenceBase>());
        alterTraitsOp_1.getTraitsToRemove().add(corpus.makeRef(CdmObjectType.TraitRef, "means.TraitG300", true));
        projection.getOperations().add(alterTraitsOp_1);

        CdmOperationAlterTraits alterTraitsOp_2 = corpus.makeObject(CdmObjectType.OperationAlterTraitsDef);
        alterTraitsOp_2.setTraitsToAdd(new ArrayList<CdmTraitReferenceBase>());
        CdmTraitReference traitG4 = corpus.makeRef(CdmObjectType.TraitRef, "means.TraitG4", true);
        traitG4.getArguments().add("precision", "5");
        traitG4.getArguments().add("scale", "15");
        alterTraitsOp_2.getTraitsToAdd().add(traitG4);
        alterTraitsOp_2.setApplyTo(new ArrayList<String>(Collections.singletonList("name")));
        projection.getOperations().add(alterTraitsOp_2);

        // Create an entity reference to hold this projection.
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the entity.
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive.
        ResolveOptions resOpt = new ResolveOptions(entity.getInDocument());
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Collections.singletonList("referenceOnly"))));

        // Resolve the entity with 'referenceOnly'
        CdmEntityDefinition resolvedEntityWithReferenceOnly = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition not met, no traits are added
        Assert.assertEquals(resolvedEntityWithReferenceOnly.getAttributes().getCount(), 4);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.getAttributes().get(0), "id", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.getAttributes().get(1), "name", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.getAttributes().get(2), "value", false, true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.getAttributes().get(3), "date", false, true);

        // Now resolve the entity with the 'structured' directive
        CdmEntityDefinition resolvedEntityWithStructured = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("structured"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition met, new traits are added
        Assert.assertEquals(resolvedEntityWithStructured.getAttributes().getCount(), 4);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.getAttributes().get(0), "id");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.getAttributes().get(1), "name", true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.getAttributes().get(2), "value");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.getAttributes().get(3), "date");
    }

    /**
     * Test AlterTraits operation on an extended entity definition.
     */
    @Test
    public void testExtendsEntityProj() throws InterruptedException {
        String testName = "testExtendsEntityProj";
        String entityName = "Child";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 5);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(0), "name", true);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(1), "age");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(2), "address");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(3), "phoneNumber");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(4), "email");
    }

    /**
     * Multiple AlterTraits operations on the same projection.
     */
    @Test
    public void testMultipleOpProj() throws InterruptedException {
        String testName = "testMultipleOpProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 5);
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(0), "name");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(1), "age");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(2), "address");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(3), "phoneNumber");
        validateTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(4), "email");
    }

    /**
     * Test argumentsContainWildcards field in AlterTraits with ArrayExpansion and RenameAttributes operations.
     */
    @Test
    public void testWildcardArgs() throws InterruptedException {
        String testName = "testWildcardArgs";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        // Add traits with wildcard characters
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 9);
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0), "name1", 1, "ThreePeople", "name");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(1), "age1", 1, "ThreePeople", "age");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(2), "address1", 1, "ThreePeople", "address");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(3), "name2", 2, "ThreePeople", "name");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(4), "age2", 2, "ThreePeople", "age");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(5), "address2", 2, "ThreePeople", "address");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(6), "name3", 3, "ThreePeople", "name");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(7), "age3", 3, "ThreePeople", "age");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)resolvedEntity.getAttributes().get(8), "address3", 3, "ThreePeople", "address");
    }

    /**
     * Test alter arguments.
     */
    @Test
    public void testAlterArguments() throws InterruptedException {
        String testName = "testAlterArguments";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.getStorage().mount("traitGroup", new LocalAdapter(TRAIT_GROUP_FILE_PATH));

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        // Create resolution options with the 'referenceOnly' directive.
        CdmEntityDefinition resolvedEntityWithReferenceOnly = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
        // Condition not met, no trait is changed
        Assert.assertEquals(((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName(), "address");
        CdmTraitReference traitG4 = (CdmTraitReference) resolvedEntityWithReferenceOnly.getAttributes().get(2).getAppliedTraits().item("means.TraitG4");
        Assert.assertNotNull(traitG4);
        Assert.assertNull(traitG4.getArguments().fetchValue("precision"));
        Assert.assertEquals(traitG4.getArguments().fetchValue("scale"), "15");

        // Create resolution options with the 'structured' directive.
        CdmEntityDefinition resolvedEntityWithStructured = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("structured"))).join();

        // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
        // Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["6", {"name": "scale","value": "20"}"] }]
        Assert.assertEquals(((CdmTypeAttributeDefinition)resolvedEntityWithStructured.getAttributes().get(2)).getName(), "address");
        CdmTraitReference traitG4_1 = (CdmTraitReference) resolvedEntityWithStructured.getAttributes().get(2).getAppliedTraits().item("means.TraitG4");
        Assert.assertNotNull(traitG4_1);
        Assert.assertEquals(traitG4_1.getArguments().fetchValue("precision"), "6");
        Assert.assertEquals(traitG4_1.getArguments().fetchValue("scale"), "20");

        // Create resolution options with the 'normalized' directive.
        CdmEntityDefinition resolvedEntityWithNormalized = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("normalized"))).join();

        // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
        // Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["8", null] }]
        Assert.assertEquals(((CdmTypeAttributeDefinition)resolvedEntityWithNormalized.getAttributes().get(2)).getName(), "address");
        CdmTraitReference traitG4_2 = (CdmTraitReference) resolvedEntityWithNormalized.getAttributes().get(2).getAppliedTraits().item("means.TraitG4");
        Assert.assertNotNull(traitG4_2);
        Assert.assertEquals(traitG4_2.getArguments().fetchValue("precision"), "8");
        Assert.assertNull(traitG4_2.getArguments().fetchValue("scale"));
    }

    private static void validateTrait(CdmTypeAttributeDefinition attribute, String expectedAttrName){
        validateTrait(attribute, expectedAttrName, false, false);
    }

    private static void validateTrait(CdmTypeAttributeDefinition attribute, String expectedAttrName, boolean haveTraitG4) {
        validateTrait(attribute, expectedAttrName, haveTraitG4, false);
    }

    /**
     * Validates trait for this test class.
     * @param attribute The type attribute.
     * @param expectedAttrName The expected attribute name.
     * @param haveTraitG4 Whether this attribute has "means.TraitG4".
     * @param doesNotExist Whether this attribute has traits from <c traitGroupFilePath/>.
     */
    private static void validateTrait(CdmTypeAttributeDefinition attribute, String expectedAttrName, boolean haveTraitG4, Boolean doesNotExist) {
        Assert.assertEquals(expectedAttrName, attribute.getName());
        if (!doesNotExist) {
            Assert.assertNotNull(attribute.getAppliedTraits().item("means.TraitG100"));
            Assert.assertNotNull(attribute.getAppliedTraits().item("means.TraitG200"));
            Assert.assertNull(attribute.getAppliedTraits().item("means.TraitG300"));
            Assert.assertNotNull(attribute.getAppliedTraits().item("means.TraitG400"));
            if (haveTraitG4) {
                CdmTraitReference traitG4 = (CdmTraitReference) attribute.getAppliedTraits().item("means.TraitG4");
                Assert.assertNotNull(traitG4);
                Assert.assertEquals(traitG4.getArguments().fetchValue("precision"), "5");
                Assert.assertEquals(traitG4.getArguments().fetchValue("scale"), "15");
            }
        } else {
            Assert.assertNull(attribute.getAppliedTraits().item("means.TraitG100"));
            Assert.assertNull(attribute.getAppliedTraits().item("means.TraitG200"));
            Assert.assertNull(attribute.getAppliedTraits().item("means.TraitG300"));
            Assert.assertNull(attribute.getAppliedTraits().item("means.TraitG400"));
            Assert.assertNull(attribute.getAppliedTraits().item("means.TraitG4"));
        }
    }
}
