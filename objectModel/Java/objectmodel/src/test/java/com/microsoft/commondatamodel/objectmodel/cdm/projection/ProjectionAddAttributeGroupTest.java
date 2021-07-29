
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddAttributeGroup;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class ProjectionAddAttributeGroupTest {
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
            "testProjectionAddAttributeGroup").toString();

    /**
     * Test AddAttributeGroup operation nested with ExcludeAttributes
     */
    @Test
    public void testCombineOpsNestedProj() throws InterruptedException {
        String testName = "testCombineOpsNestedProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Exclude attributes: ["age", "phoneNumber"]
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "PersonAttributeGroup");
        Assert.assertEquals(3, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
    }

    /**
     * Test AddAttributeGroup and IncludeAttributes operations in the same projection
     */
    @Test
    public void testCombineOpsProj() throws InterruptedException {
        String testName = "testCombineOpsProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Included attributes: ["age", "phoneNumber"]
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "PersonAttributeGroup", 3);
        Assert.assertEquals(5, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(4)).getName());

        // Check the attributes coming from the IncludeAttribute operation
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
    }

    /**
     * Test AddAttributeGroup operation with a "structured" condition
     */
    @Test
    public void testConditionalProj() throws InterruptedException {
        String testName = "testConditionalProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition not met, keep attributes in flat list
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());

        CdmEntityDefinition resolvedEntity2 = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("structured"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition met, put all attributes in an attribute group
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity2.getAttributes(), "PersonAttributeGroup");
        Assert.assertEquals(5, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(4)).getName());
    }

    /**
     * Test for creating a projection with an AddAttributeGroup operation and a condition using the object model
     */
    @Test
    public void testConditionalProjUsingObjectModel() throws InterruptedException {
        String testName =  "testConditionalProjUsingObjectModel";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity.
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);
        projection.setCondition("structured==true");

        // Create an AddAttributeGroup operation
        CdmOperationAddAttributeGroup addAttGroupOp = corpus.makeObject(CdmObjectType.OperationAddAttributeGroupDef);
        addAttGroupOp.setAttributeGroupName("PersonAttributeGroup");
        projection.getOperations().add(addAttGroupOp);

        // Create an entity reference to hold this projection.
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the entity.
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive.
        ResolveOptions resOpt = new ResolveOptions(entity.getInDocument());
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("referenceOnly"))));

        // Resolve the entity with 'referenceOnly'
        CdmEntityDefinition resolvedEntityWithReferenceOnly = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Condition not met, keep attributes in flat list
        Assert.assertEquals(4, resolvedEntityWithReferenceOnly.getAttributes().getCount());
        Assert.assertEquals("id", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(0)).getName());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(1)).getName());
        Assert.assertEquals("value", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName());
        Assert.assertEquals("date", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(3)).getName());

        // Now resolve the entity with the 'structured' directive
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("structured"))));
        CdmEntityDefinition resolvedEntityWithStructured = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Condition met, put all attributes in an attribute group
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntityWithStructured.getAttributes(), "PersonAttributeGroup");
        Assert.assertEquals(4, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("id", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("value", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
        Assert.assertEquals("date", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(3)).getName());
    }

    /**
     * Test resolving an entity attribute using resolution guidance
     */
    @Test
    public void testEntityAttribute() throws InterruptedException {
        String testName = "testEntityAttribute";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("structured"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "PersonInfo");
        Assert.assertEquals(5, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(4)).getName());
    }

    /**
     * Test for creating a projection with an AddAttributeGroup operation on an entity attribute using the object model  
     */
    @Test
    public void testEntityAttributeProjUsingObjectModel() throws InterruptedException {
        String testName = "testEntityAttributeProjUsingObjectModel";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddAttributeGroup operation
        CdmOperationAddAttributeGroup addAttGroupOp = corpus.makeObject(CdmObjectType.OperationAddAttributeGroupDef);
        addAttGroupOp.setAttributeGroupName("PersonAttributeGroup");
        projection.getOperations().add(addAttGroupOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Resolve the entity.
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ["id", "name", "value", "date"]
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "PersonAttributeGroup");
        Assert.assertEquals(4, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("id", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("value", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
        Assert.assertEquals("date", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(3)).getName());
    }

    /**
     * Test for creating a projection with an AddAttributeGroup operation on an entity definition using the object model
     */
    @Test
    public void testEntityProjUsingObjectModel() throws InterruptedException {
        String testName = "testEntityProjUsingObjectModel";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddAttributeGroup operation
        CdmOperationAddAttributeGroup addAttGroupOp = corpus.makeObject(CdmObjectType.OperationAddAttributeGroupDef);
        addAttGroupOp.setAttributeGroupName("PersonAttributeGroup");
        projection.getOperations().add(addAttGroupOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Set the entity's ExtendEntity to be the projection
        entity.setExtendsEntity(projectionEntityRef);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ["id", "name", "value", "date"]
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "PersonAttributeGroup");
        Assert.assertEquals(4, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("id", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("value", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
        Assert.assertEquals("date", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(3)).getName());
    }

    /**
     * Test AddAttributeGroup operation on an entity definition
     */
    @Test
    public void testExtendsEntityProj() throws InterruptedException {
        String testName = "testExtendsEntityProj";
        String entityName = "Child";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "ChildAttributeGroup");
        Assert.assertEquals(5, attGroupDefinition.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(4)).getName());
    }

    /**
     * Multiple AddAttributeGroup operations on the same projection 
     */
    @Test
    public void testMultipleOpProj() throws InterruptedException {
        String testName = "testMultipleOpProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // This will result in two attribute groups with the same set of attributes being generated
        CdmAttributeGroupDefinition attGroup1 = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "PersonAttributeGroup", 2);
        Assert.assertEquals(5, attGroup1.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroup1.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) attGroup1.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroup1.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) attGroup1.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroup1.getMembers().get(4)).getName());

        CdmAttributeGroupDefinition attGroup2 = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "SecondAttributeGroup", 2, 1);
        Assert.assertEquals(5, attGroup2.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(4)).getName());
    }

    /**
     * Nested projections with AddAttributeGroup
     */
    @Test
    public void testNestedProj() throws InterruptedException {
        String testName = "testNestedProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        CdmAttributeGroupDefinition outerAttGroup = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "OuterAttributeGroup");
        CdmAttributeGroupDefinition innerAttGroup = ProjectionTestUtils.validateAttributeGroup(outerAttGroup.getMembers(), "InnerAttributeGroup");

        Assert.assertEquals(5, innerAttGroup.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) innerAttGroup.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) innerAttGroup.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) innerAttGroup.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) innerAttGroup.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) innerAttGroup.getMembers().get(4)).getName());
    }

    /**
     * Test resolving a type attribute with an add attribute group operation
     */
    @Test
    public void testTypeAttributeProj() throws InterruptedException {
        String testName = "testTypeAttributeProj";
        String entityName = "Person";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
         // Add attribute group applied to "address"
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(resolvedEntity.getAttributes(), "AddressAttributeGroup", 5, 2);
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroupDefinition.getMembers().get(0)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }
}
