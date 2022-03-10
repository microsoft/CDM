// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddCountAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAlterTraits;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

/**
 * A test class for testing the AddCountAttribute operation in a projection as well as CountAttribute in a resolution guidance
 */
public class ProjectionAddCountTest {
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
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "ProjectionAddCountTest").toString();

    /**
     * Test for creating a projection with an AddCountAttribute operation on an entity attribute using the object model
     */
    @Test
    public void testEntityAttributeProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntityAttributeProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testEntityAttributeProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddCountAttribute operation
        CdmOperationAddCountAttribute addCountAttrOp = corpus.makeObject(CdmObjectType.OperationAddCountAttributeDef);
        addCountAttrOp.setCountAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef, "testCount"));
        addCountAttrOp.getCountAttribute().setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "integer", true));
        projection.getOperations().add(addCountAttrOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Count attribute: "testCount"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "date");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "testCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(4)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }

    /**
     * Test for creating a projection with an AddCountAttribute operation on an entity definition using the object model
     */
    @Test
    public void testEntityProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntityProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testEntityProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddCountAttribute operation
        CdmOperationAddCountAttribute addCountAttrOp = corpus.makeObject(CdmObjectType.OperationAddCountAttributeDef);
        addCountAttrOp.setCountAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef, "testCount"));
        addCountAttrOp.getCountAttribute().setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "integer", true));
        projection.getOperations().add(addCountAttrOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Set the entity's ExtendEntity to be the projection
        entity.setExtendsEntity(projectionEntityRef);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Count attribute: "testCount"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "date");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "testCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(4)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }

    /**
     * Test for creating a projection with an AddCountAttribute operation and a condition using the object model
     */
    @Test
    public void testConditionalProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testConditionalProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testConditionalProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);
        projection.setCondition("referenceOnly==true");

        // Create an AddCountAttribute operation
        CdmOperationAddCountAttribute addCountAttrOp = corpus.makeObject(CdmObjectType.OperationAddCountAttributeDef);
        addCountAttrOp.setCountAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef, "testCount"));
        addCountAttrOp.getCountAttribute().setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "integer", true));
        projection.getOperations().add(addCountAttrOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive
        ResolveOptions resOpt = new ResolveOptions(entity.getInDocument());
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("referenceOnly"))));

        // Resolve the entity with 'referenceOnly'
        CdmEntityDefinition resolvedEntityWithReferenceOnly = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Count attribute: "testCount"
        Assert.assertEquals(resolvedEntityWithReferenceOnly.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(3)).getName(), "date");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(4)).getName(), "testCount");
        Assert.assertNotNull((resolvedEntityWithReferenceOnly.getAttributes().get(4)).getAppliedTraits().item("is.linkedEntity.array.count"));

        // Now resolve the entity with the 'structured' directive
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("structured"))));
        CdmEntityDefinition resolvedEntityWithStructured = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // No Count attribute added, condition was false
        Assert.assertEquals(resolvedEntityWithStructured.getAttributes().size(), 4);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(3)).getName(), "date");
    }

    /**
     * AddCountAttribute on an entity attribute
     */
    @Test
    public void testAddCountAttribute() throws InterruptedException {
        String testName = "testAddCountAttribute";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(5)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }

    /**
     * CountAttribute on an entity attribute  using resolution guidance
     */
    @Test
    public void testCountAttribute() throws InterruptedException {
        String testName = "testCountAttribute";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(0)).getAppliedTraits().item("is.linkedEntity.array.count"));
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "phoneNumber1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "email1");
    }

    /**
     * AddCountAttribute on an entity definition
     */
    @Test
    public void testExtendsEntityProj() throws InterruptedException {
        String testName = "testExtendsEntityProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(5)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }

    /**
     * CountAttribute on an entity definition using resolution guidance
     */
    @Test
    public void testExtendsEntity() throws InterruptedException {
        String testName = "testExtendsEntity";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        // ExtendsEntityResolutionGuidance doesn't support doing expansions, so we only get the Count attribute
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 1);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(0)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }

    /**
     * Nested projections with ArrayExpansion, then AddCountAttribute, and then RenameAttributes
     */
    @Test
    public void testWithNestedArrayExpansion() throws InterruptedException {
        String testName = "testWithNestedArrayExpansion";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "personCount", expand 1...2, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 11);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "phoneNumber2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName(), "email2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(10)).getName(), "personCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(10)).getAppliedTraits().item("is.linkedEntity.array.count"));
        Assert.assertNotNull((resolvedEntity.getAttributes().get(10)).getAppliedTraits().item("indicates.expansionInfo.count"));
    }

    /**
     * AddCountAttribute with other operations in the same projection
     */
    @Test
    public void testCombineOps() throws InterruptedException {
        String testName = "testCombineOps";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount", count attribute: "anotherCount", rename "name" to "firstName"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(5)).getAppliedTraits().item("is.linkedEntity.array.count"));
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "anotherCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(6)).getAppliedTraits().item("is.linkedEntity.array.count"));
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "firstName");
    }

    /**
     * Nested projections with AddCountAttribute and other operations
     */
    @Test
    public void testCombineOpsNestedProj() throws InterruptedException {
        String testName = "testCombineOpsNestedProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount", renameFormat = new_{m}, include ["new_name", "age", "new_someCount"]
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 3);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "new_name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "new_age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "new_someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(2)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }

    /**
     * AddCountAttribute with a condition
     */
    @Test
    public void testConditionalProj() throws InterruptedException {
        String testName = "testConditionalProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // Condition is false, so no Count attribute added
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
    }

    /**
     * AddCountAttribute on an entity with an attribute group
     */
    @Test
    public void testGroupProj() throws InterruptedException {
        String testName = "testGroupProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(5)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }

    /**
     * CountAttribute on an entity with an attribute group using resolution guidance
     */
    @Test
    public void testGroup() throws InterruptedException {
        String testName = "testGroup";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(0)).getAppliedTraits().item("is.linkedEntity.array.count"));
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "phoneNumber1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "email1");
    }

    /**
     * Two AddCountAttribute operations in a single projection using the same Count attribute
     */
    @Test
    public void testDuplicate() throws InterruptedException {
        String testName = "testDuplicate";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount", count attribute: "someCount"
        // "someCount" should get merged into one
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "someCount");
        Assert.assertNotNull((resolvedEntity.getAttributes().get(5)).getAppliedTraits().item("is.linkedEntity.array.count"));
    }
}
