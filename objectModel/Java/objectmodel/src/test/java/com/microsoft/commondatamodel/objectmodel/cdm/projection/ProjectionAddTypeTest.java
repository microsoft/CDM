// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddTypeAttribute;
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
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

/**
 * A test class for testing the AddTypeAttribute operation in a projection as well as SelectedTypeAttribute in a resolution guidance
 */
public class ProjectionAddTypeTest {
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
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testProjectionAddType")
            .toString();

    /**
     * Test for creating a projection with an AddTypeAttribute operation on an entity attribute using the object model
     */
    @Test
    public void testEntityAttributeProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "testEntityAttributeProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testEntityAttributeProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddTypeAttribute operation
        CdmOperationAddTypeAttribute addTypeAttrOp = corpus.makeObject(CdmObjectType.OperationAddTypeAttributeDef);
        addTypeAttrOp.setTypeAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef, "testType"));
        addTypeAttrOp.getTypeAttribute().setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "entityName", true));
        projection.getOperations().add(addTypeAttrOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Type attribute: "testType"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "date");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "testType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * Test for creating a projection with an AddTypeAttribute operation on an entity definition using the object model
     */
    @Test
    public void testEntityProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "testEntityProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testEntityProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddTypeAttribute operation
        CdmOperationAddTypeAttribute addTypeAttrOp = corpus.makeObject(CdmObjectType.OperationAddTypeAttributeDef);
        addTypeAttrOp.setTypeAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef, "testType"));
        addTypeAttrOp.getTypeAttribute().setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "entityName", true));
        projection.getOperations().add(addTypeAttrOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Set the entity's ExtendEntity to be the projection
        entity.setExtendsEntity(projectionEntityRef);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Type attribute: "testType"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "date");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "testType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * Test for creating a projection with an AddTypeAttribute operation and a condition using the object model
     */
    @Test
    public void testConditionalProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "testConditionalProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testConditionalProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);
        projection.setCondition("referenceOnly==true");

        // Create an AddTypeAttribute operation
        CdmOperationAddTypeAttribute addTypeAttrOp = corpus.makeObject(CdmObjectType.OperationAddTypeAttributeDef);
        addTypeAttrOp.setTypeAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef, "testType"));
        addTypeAttrOp.getTypeAttribute().setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "entityName", true));
        projection.getOperations().add(addTypeAttrOp);

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

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Type attribute: "testType"
        Assert.assertEquals(resolvedEntityWithReferenceOnly.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(3)).getName(), "date");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(4)).getName(), "testType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(4)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");

        // Now resolve the entity with the 'structured' directive
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("structured"))));
        CdmEntityDefinition resolvedEntityWithStructured = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // No Type attribute added, condition was false
        Assert.assertEquals(resolvedEntityWithStructured.getAttributes().size(), 4);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(3)).getName(), "date");
    }

    /**
     * AddTypeAttribute on an entity attribute
     */
    @Test
    public void testAddTypeAttributeProj() throws InterruptedException {
        String testName = "testAddTypeAttributeProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "emailId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "number");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "socialId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "account");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "someType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * SelectedTypeAttribute on an entity attribute
     */
    @Test
    public void testSelectedTypeAttr() throws InterruptedException {
        String testName = "testSelectedTypeAttr";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "emailId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "number");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "socialId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "account");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "someType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * AddTypeAttribute on an entity definition
     */
    @Test
    public void testExtendsEntityProj() throws InterruptedException {
        String testName = "testExtendsEntityProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "emailId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "number");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "socialId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "account");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "someType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * SelectedTypeAttribute on an entity definition
     */
    @Test
    public void testExtendsEntity() throws InterruptedException {
        String testName = "testExtendsEntity";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType" (using extendsEntityResolutionGuidance)
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "emailId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "number");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "socialId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "account");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "someType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * AddTypeAttribute on an entity definition
     */
    @Test
    public void testAddTypeWithCombineProj() throws InterruptedException {
        String testName = "testAddTypeWithCombineProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 6);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "number");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "account");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "contactId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "contactType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * AddTypeAttribute with other operations in the same projection
     */
    @Test
    public void testCombineOpsProj() throws InterruptedException {
        String testName = "testCombineOpsProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType", rename "address" to "homeAddress"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 9);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "emailId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "number");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "socialId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "account");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "someType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "homeAddress");
    }

    /**
     * Nested projections with AddTypeAttribute and other operations
     */
    @Test
    public void testCombineOpsNestedProj() throws InterruptedException {
        String testName = "testCombineOpsNestedProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType",
        // rename ["contactId", "isPrimary"] as "new_{m}", include ["contactId", "new_isPrimary", "contactType"]
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 3);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "new_isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "new_contactId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "contactType");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getAppliedTraits().get(4).getNamedReference(), "is.linkedEntity.name");
    }

    /**
     * AddTypeAttribute with a condition
     */
    @Test
    public void testConditionalProj() throws InterruptedException {
        String testName = "testConditionalProj";
        String entityName = "Customer";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
        // Condition for projection containing AddTypeAttribute is false, so no Type attribute is created
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "isPrimary");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "number");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "account");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "contactId");
    }
}
