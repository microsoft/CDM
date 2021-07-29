
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddArtifactAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.EventList;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Map;
import java.util.Collections;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class ProjectionAddArtifactAttributeTest {
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
            "testProjectionAddArtifactAttribute").toString();

    /**
     * Test AddArtifactAttribute to add an entity attribute on an entity attribute.
     */
    @Test
    public void testAddEntAttrOnEntAttrProj() throws InterruptedException {
        String testName = "testAddEntAttrOnEntAttrProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            EventList events = corpus.getCtx().getEvents();
            Map<String, String> lastEvent = events.get(events.size() - 1);
            if (lastEvent.containsKey("CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an entity attribute yet.")) {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Warning);

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();
    }

    /**
     * Test AddArtifactAttribute to add an attribute group on an entity attribute.
     */
    @Test
    public void testAddAttrGrpOnEntAttrProj() throws InterruptedException {
        String testName = "testAddAttrGrpOnEntAttrProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            EventList events = corpus.getCtx().getEvents();
            Map<String, String> lastEvent = events.get(events.size() - 1);
            if (lastEvent.containsKey("CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an attribute group yet.")) {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Warning);

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();
    }

    /**
     * Test AddArtifactAttribute to add a type attribute on a type attribute.
     */
    @Test
    public void testAddTypeAttrOnTypeAttrProj() throws InterruptedException {
        String testName = "testAddTypeAttrOnTypeAttrProj";
        String entityName = "Person";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

        Assert.assertEquals(2, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("newTerm", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("FavoriteTerm", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
    }

    /**
     * Test AddArtifactAttribute operation nested with ExcludeAttributes/RenameAttributes.
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
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

        // Original set of attributes: [ { "name", "age", "address", "phoneNumber", "email" }, "FavoriteTerm" ]
        // Entity Attribuite:
        // Exclude attributes: ["age", "phoneNumber", "name"]
        // Add attribute: ["newName"]
        // Rename attribute ["newName" -> "renaming-{m}" ]
        // Rename attribute ["renaming-newName" -> "renamingAgain-{m}" ]
        // Add attribute: ["newName_1"]
        // Type Attribute:
        // Add attribute: ["newName"]
        // Rename attribute ["newName" -> "renamed-{m}" ]
        // Add attribute: ["newTerm" (InsertAtTop:true)]
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 7);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "email");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "renamingAgain-renaming-newName");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "newName_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "newTerm");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "FavoriteTerm");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "renamed-newName");
    }

    /**
     * Test AddArtifactAttribute operation with a "structured" condition.
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
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition not met, keep attributes in flat list
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");

        CdmEntityDefinition resolvedEntity2 = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("structured"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Condition met, keep attributes in flat list and add the new attribute "newName" all attributes at the end
        Assert.assertEquals(6, resolvedEntity2.getAttributes().getCount());
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(5)).getName(), "newName");
    }

    /**
     * Test for creating a projection with an AddArtifactAttribute operation and a condition using the object model.
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

        // Create an AddArtifactAttribute operation
        CdmOperationAddArtifactAttribute addArtifactAttributeOp = corpus.makeObject(CdmObjectType.OperationAddArtifactAttributeDef);
        addArtifactAttributeOp.setNewAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef, "newName"));
        ((CdmTypeAttributeDefinition) addArtifactAttributeOp.getNewAttribute()).setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "string", true));
        projection.getOperations().add(addArtifactAttributeOp);

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

        // Original set of attributes: ["id", "name", "value", "date"]
        // Condition not met, keep attributes in flat list
        Assert.assertEquals(resolvedEntityWithReferenceOnly.getAttributes().getCount(), 4);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals( ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(3)).getName(), "date");

        // Now resolve the entity with the 'structured' directive
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Collections.singletonList("structured"))));
        CdmEntityDefinition resolvedEntityWithStructured = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Original set of attributes: ["id", "name", "value", "date"]
        // Condition met, keep attributes in flat list and add the new attribute "newName" all attributes at the end
        Assert.assertEquals( resolvedEntityWithStructured.getAttributes().getCount(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals( ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(3)).getName(), "date");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(4)).getName(), "newName");
    }

    /**
     * Test AddArtifactAttribute operation on an entity definition.
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
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals( ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "newName");
    }

    /**
     * Multiple AddArtifactAttribute operations on the same projection
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
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Add attribute: ["newName", "newName_1", "newName"]
        // 2 "newName" will be merged
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 7);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals( ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "newName");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "newName_1");
    }

    /**
     * test insertAtTop field in AddArtifactAttribute operation.
     */
    @Test
    public void testInsertAtTop() throws InterruptedException {
        String testName = "testInsertAtTop";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Add attribute: ["newName" (InsertAtTop:false), "newName_1" (InsertAtTop:true)]
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 7);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "newName_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "email");
        Assert.assertEquals( ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "newName");

    }

    /**
     * Nested projections with AddArtifactAttribute.
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
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 7);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
        Assert.assertEquals( ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "newName_inner");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "newName_outer");
    }
}
