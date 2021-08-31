// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Test for creating a projection with an RenameAttributes operation on an
 * entity attribute using the object model
 */
public class ProjectionRenameTest {
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
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "ProjectionRenameTest").toString();

    @Test
    public void testEntityAttributeProjUsingObjectModel() throws InterruptedException, ExecutionException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "TestEntityAttributeProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(
                TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "TestEntityAttributeProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{a}-{o}-{m}");
        projection.getOperations().add(renameAttrsOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the
        // entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef,
                "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Resolve the entity.
        CdmEntityDefinition resolvedEntity = entity
                .createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).get();

        // Verify correctness of the resolved attributes after running the
        // RenameAttributes operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Rename all attributes with format "{a}-{o}-{m}"
        Assert.assertEquals(4, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("TestEntityAttribute--id",
                ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("TestEntityAttribute--name",
                ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("TestEntityAttribute--value",
                ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("TestEntityAttribute--date",
                ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
    }

    /**
     * Test for creating a projection with an RenameAttributes operation on an entity definition using the object model
     */
    @Test
    public void testEntityProjUsingObjectModel() throws InterruptedException, ExecutionException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "TestEntityProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "TestEntityProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{A}.{o}.{M}");
        projection.getOperations().add(renameAttrsOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Set the entity's ExtendEntity to be the projection
        entity.setExtendsEntity(projectionEntityRef);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Rename all attributes with format {A}.{o}.{M}
        Assert.assertEquals(4, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("..Id", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("..Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("..Value", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("..Date", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
    }

    /**
     * Test for creating nested projections with RenameAttributes operations using the object model
     */
    @Test
    public void testNestedProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "TestNestedProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "TestNestedProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{A}.{o}.{M}");
        projection.getOperations().add(renameAttrsOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create another projection that uses the previous projection as its source
        CdmProjection projection2 = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection2.setSource(projectionEntityRef);

        // Create an RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp2 = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp2.setRenameFormat("{a}-{o}-{m}");
        renameAttrsOp2.setApplyTo(new ArrayList<String>());
        renameAttrsOp2.getApplyTo().add("name");

        projection2.getOperations().add(renameAttrsOp2);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef2 = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef2.setExplicitReference(projection2);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef2);
        entity.getAttributes().add(entityAttribute);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the RenameAttributes operations
        // Original set of attributes: ["id", "name", "value", "date"]
        // Rename all attributes attributes with format {A}.{o}.{M}, then rename "name" with format "{a}-{o}-{m}"
        Assert.assertEquals(4, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("TestEntityAttribute..Id", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("TestEntityAttribute--TestEntityAttribute..Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("TestEntityAttribute..Value", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("TestEntityAttribute..Date", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
    }

    /**
     * Test correctness when renameFormat has repeated pattern
     */
    @Test
    public void testRepeatedPatternProj() throws InterruptedException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "TestEntityAttributeProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "TestEntityAttributeProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{a}-{M}-{o}-{A}-{m}-{O}");
        projection.getOperations().add(renameAttrsOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef);
        entity.getAttributes().add(entityAttribute);

        // Resolve the entity.
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Rename all attributes with format "{a}-{M}-{o}-{A}-{m}-{O}"
        Assert.assertEquals(4, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("TestEntityAttribute-Id--TestEntityAttribute-id-", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("TestEntityAttribute-Name--TestEntityAttribute-name-", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("TestEntityAttribute-Value--TestEntityAttribute-value-", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("TestEntityAttribute-Date--TestEntityAttribute-date-", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
    }

    /**
     * Test for creating a projection with an RenameAttributes operation and a
     * condition using the object model
     */
    @Test
    public void testConditionalProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, "TestConditionalProjUsingObjectModel");
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "TestConditionalProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity.
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'.
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);
        projection.setCondition("referenceOnly==true");

        // Create an RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{A}.{o}.{M}");
        projection.getOperations().add(renameAttrsOp);

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

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Rename all attributes with format "{A}.{o}.{M}"
        Assert.assertEquals(4, resolvedEntityWithReferenceOnly.getAttributes().getCount());
        Assert.assertEquals("TestEntityAttribute..Id", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(0)).getName());
        Assert.assertEquals("TestEntityAttribute..Name", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(1)).getName());
        Assert.assertEquals("TestEntityAttribute..Value", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName());
        Assert.assertEquals("TestEntityAttribute..Date", ((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(3)).getName());

        // Now resolve the entity with the 'structured' directive
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("structured"))));
        CdmEntityDefinition resolvedEntityWithStructured = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Renamed attributes: none, condition was false
        Assert.assertEquals(4, resolvedEntityWithStructured.getAttributes().getCount());
        Assert.assertEquals("id", ((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(0)).getName());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(1)).getName());
        Assert.assertEquals("value", ((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(2)).getName());
        Assert.assertEquals("date", ((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(3)).getName());
    }

    /**
     * RenameAttributes with a plain string as rename format.
     */
    @Test
    public void testRenameFormatAsStringProj() throws InterruptedException {
        String testName = "TestRenameFormatAsStringProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // Renamed attribute "address" with format "whereYouLive".
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("whereYouLive", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    
    /**
     * RenameFormat on an entity attribute.
     */
    @Test
    public void testRenameFormat() throws InterruptedException {
        String testName = "TestRenameFormat";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"].
        // Renamed all attributes with format {a}.{o}.{M}
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("PersonInfo..Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo..Age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("PersonInfo..Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("PersonInfo..PhoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("PersonInfo..Email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    
    /**
     * RenameFormat on an entity attribute.
     */
    @Test
    public void testRenameFormatProj() throws InterruptedException {
        String testName = "TestRenameFormatProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"].
        // Renamed all attributes with format {a}.{o}.{M}
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("PersonInfo..Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo..Age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("PersonInfo..Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("PersonInfo..PhoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("PersonInfo..Email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    
    /**
     * A nested RenameAttributes operation in a single projection.
     */
    @Test
    public void testSingleNestedProj() throws InterruptedException {
        String testName = "TestSingleNestedProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // Renamed all attributes with format "New{M}".
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("NewName", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("NewAge", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("NewAddress", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("NewPhoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("NewEmail", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    
    /**
     * Nested projections with RenameAttributes
     */
    @Test
    public void testNestedProj() throws InterruptedException {
        String testName = "TestNestedProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Rename all attributes attributes with format {A}.{o}.{M}, then rename "age" with format "{a}-{o}-{m}"
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("PersonInfo..Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo--PersonInfo..Age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("PersonInfo..Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("PersonInfo..PhoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("PersonInfo..Email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    
    /**
     * Multiple RenameAttributes in a single projection.
     */
    @Test
    public void testMultipleRename() throws InterruptedException {
        String testName = "TestMultipleRename";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Rename attributes "age" to "yearsOld" then "address" to "homePlace"
        Assert.assertEquals(7, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("yearsOld", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("homePlace", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
    }

    
    /**
     * RenameFormat on an entity definition.
     */
    @Test
    public void testExtendsEntityProj() throws InterruptedException {
        String testName = "TestExtendsEntityProj";
        String entityName = "Child";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // All attributes renamed with format "{a}.{o}.{M}".
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("..name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("..age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("..address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("..phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("..email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    
    /**
     * RenameFormat on an entity definition.
     * NOTE: this is not supported with resolution guidance.
     */
    @Test
    public void testExtendsEntity() throws InterruptedException {
        String testName = "TestExtendsEntity";
        String entityName = "Child";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // Renamed attributes: [] with format "{a}.{o}.{M}".
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    
    /**
     * RenameAttributes on a polymorphic source
     */
    @Test
    public void testPolymorphicProj() throws InterruptedException {
        String testName = "TestPolymorphicProj";
        String entityName = "BusinessPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            if (resOpt.contains("structured")) {
                // Rename attributes is not supported on an attribute group yet.
                continue;
            }
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Renamed all attributes with format {A}.{o}.{M}
        Assert.assertEquals(7, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("ContactAt..EmailId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("ContactAt..Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("ContactAt..IsPrimary", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("ContactAt..PhoneId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("ContactAt..Number", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("ContactAt..SocialId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("ContactAt..Account", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
    }

    
    /**
     * RenameAttributes on a polymorphic source
     */
    @Test
    public void testPolymorphicApplyToProj() throws InterruptedException {
        String testName = "TestPolymorphicApplyToProj";
        String entityName = "BusinessPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Renamed attributes: [address, number] with format {A}.{o}.{M}
        Assert.assertEquals(7, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("emailId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("ContactAt..Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("isPrimary", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("ContactAt..Number", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("socialId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("account", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
    }

    
    /**
     * SelectsSomeAvoidNames on a polymorphic source
     */
    @Test
    public void testPolymorphic() throws InterruptedException {
        String testName = "TestPolymorphic";
        String entityName = "BusinessPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Renamed all attributes with format "{A}.{o}.{M}"
        Assert.assertEquals(7, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("ContactAt..EmailId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("ContactAt..Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("ContactAt..IsPrimary", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("ContactAt..PhoneId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("ContactAt..Number", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("ContactAt..SocialId", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("ContactAt..Account", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
    }

    
    /**
     * RenameAttributes on an array source
     */
    @Test
    public void testArraySourceProj() throws InterruptedException {
        String testName = "TestArraySourceProj";
        String entityName = "FriendGroup";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["personCount", "name1", "age1", "address1", "phoneNumber1", "email1", ..., "email3"] (16 total)
        // Attributes renamed from format {a}{M} to {a}.{o}.{M}
        // NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
        Assert.assertEquals(16, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("GroupOfPeople..PersonCount", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("GroupOfPeople..Name1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("GroupOfPeople..Age1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("GroupOfPeople..Address1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("GroupOfPeople..PhoneNumber1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("GroupOfPeople..Email1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("GroupOfPeople..Name2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
        Assert.assertEquals("GroupOfPeople..Age2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName());
        Assert.assertEquals("GroupOfPeople..Address2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName());
        Assert.assertEquals("GroupOfPeople..PhoneNumber2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName());
        Assert.assertEquals("GroupOfPeople..Email2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(10)).getName());
        Assert.assertEquals("GroupOfPeople..Name3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(11)).getName());
        Assert.assertEquals("GroupOfPeople..Age3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(12)).getName());
        Assert.assertEquals("GroupOfPeople..Address3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(13)).getName());
        Assert.assertEquals("GroupOfPeople..PhoneNumber3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(14)).getName());
        Assert.assertEquals("GroupOfPeople..Email3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(15)).getName());
    }

    /**
     * RenameFormat on an array source
     */
    @Test
    public void testArraySource() throws InterruptedException {
        String testName = "TestArraySource";
        String entityName = "FriendGroup";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["GroupOfPeoplePersonCount", "GroupOfPeopleName1", "GroupOfPeopleAge1", "GroupOfPeopleAddress1",
        //                              "GroupOfPeoplePhoneNumber1", "GroupOfPeopleEmail1", ..., "GroupOfPeopleEmail3"] (16 total)
        // Attributes renamed from format {a}{M} to {a}.{o}.{M}
        // NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
        Assert.assertEquals(16, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("GroupOfPeople..PersonCount", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("GroupOfPeople.1.Name1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("GroupOfPeople.1.Age1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("GroupOfPeople.1.Address1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("GroupOfPeople.1.PhoneNumber1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("GroupOfPeople.1.Email1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("GroupOfPeople.2.Name2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
        Assert.assertEquals("GroupOfPeople.2.Age2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName());
        Assert.assertEquals("GroupOfPeople.2.Address2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName());
        Assert.assertEquals("GroupOfPeople.2.PhoneNumber2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName());
        Assert.assertEquals("GroupOfPeople.2.Email2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(10)).getName());
        Assert.assertEquals("GroupOfPeople.3.Name3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(11)).getName());
        Assert.assertEquals("GroupOfPeople.3.Age3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(12)).getName());
        Assert.assertEquals("GroupOfPeople.3.Address3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(13)).getName());
        Assert.assertEquals("GroupOfPeople.3.PhoneNumber3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(14)).getName());
        Assert.assertEquals("GroupOfPeople.3.Email3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(15)).getName());
    }

    /**
     * RenameFormat on an array source using apply to.
     */
    @Test
    public void testArraySourceRenameApplyToProj() throws InterruptedException {
        String testName = "TestArraySourceRenameApplyToProj";
        String entityName = "FriendGroup";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["personCount", "name1", "age1", "address1", "phoneNumber1", "email1", ..., "email3"] (16 total).
        // Renamed attributes: ["age1", "age2", "age3"] with the format "{a}.{o}.{M}".
        Assert.assertEquals(16, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("personCount", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("name1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("GroupOfPeople..Age1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("address1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("phoneNumber1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("email1", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
        Assert.assertEquals("name2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName());
        Assert.assertEquals("GroupOfPeople..Age2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName());
        Assert.assertEquals("address2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName());
        Assert.assertEquals("phoneNumber2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName());
        Assert.assertEquals("email2", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(10)).getName());
        Assert.assertEquals("name3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(11)).getName());
        Assert.assertEquals("GroupOfPeople..Age3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(12)).getName());
        Assert.assertEquals("address3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(13)).getName());
        Assert.assertEquals("phoneNumber3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(14)).getName());
        Assert.assertEquals("email3", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(15)).getName());
    }

    /**
     * RenameAttributes with a condition.
     */
    @Test
    public void testConditionalProj() throws InterruptedException {
        String testName = "TestConditionalProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // Renamed attributes with format "{M}.{o}.{a}"
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("Name..personInfo", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("Age..personInfo", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("Address..personInfo", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("PhoneNumber..personInfo", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("Email..personInfo", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());

        CdmEntityDefinition resolvedEntity2 = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // Renamed attributes: none, condition was false.
        Assert.assertEquals(5, resolvedEntity2.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity2.getAttributes().get(4)).getName());
    }

    /**
     * RenameAttributes with an empty apply to list.
     */
    @Test
    public void testEmptyApplyTo() throws InterruptedException {
        String testName = "TestEmptyApplyTo";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // Renamed attributes: [].
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    /**
     * RenameFormat on an entity with an attribute group.
     */
    @Test
    public void testGroupProj() throws InterruptedException {
        String testName = "TestGroupProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
        // Rename all attributes with format {a}-{o}-{M}
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("PersonInfo--Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo--Age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("PersonInfo--Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("PersonInfo--PhoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("PersonInfo--Email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    /**
     * RenameFormat on an entity with an attribute group.
     */
    @Test
    public void testGroupRename() throws InterruptedException {
        String testName = "TestGroupRename";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"].
        // Rename all attributes with format {a}-{o}-{M}
        Assert.assertEquals(5, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("PersonInfo--Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo--Age", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("PersonInfo--Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("PersonInfo--PhoneNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("PersonInfo--Email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
    }

    /**
     * Test RenameFormat applying a rename nested in a exclude operation
     */
    @Test
    public void testRenameAndExcludeProj()  throws InterruptedException {
        String testName = "TestRenameAndExcludeProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Rename all attributes with format {a}-{o}-{M} and remove ["age", "PersonInfo--PhoneNumber"]
        Assert.assertEquals(3, resolvedEntity.getAttributes().getCount());
        Assert.assertEquals("PersonInfo--Name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("PersonInfo--Address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("PersonInfo--Email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
    }

    /**
     * RenameAttributes with an entity attribute name on an inline entity reference that contains entity attributes.
     * This is testing that, for the case of the structured directive, we can filter using the name of an entity attribute.
     * in the inline entity reference to rename the entire entity attribute group.
     */
    // @Test
    public void testEANameProj() throws InterruptedException {
        String testName = "TestEANameProj";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
           ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("structured"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email", "title", "company", "tenure"].
        // Rename with format "{a}-{o}-{M}" attributes ["PersonInfoAge", "OccupationInfo"]
        // "OccupationInfo" is an entity attribute
        Assert.assertEquals(2, resolvedEntity.getAttributes().getCount()); // attribute group created because of structured directive.
        CdmAttributeGroupDefinition attGroup = (CdmAttributeGroupDefinition) ((CdmAttributeGroupReference) resolvedEntity.getAttributes().get(0)).getExplicitReference();
        Assert.assertEquals("PersonInfo", attGroup.getName());
        Assert.assertEquals(5, attGroup.getMembers().getCount());
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) attGroup.getMembers().get(0)).getName());
        Assert.assertEquals("age", ((CdmTypeAttributeDefinition) attGroup.getMembers().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) attGroup.getMembers().get(2)).getName());
        Assert.assertEquals("phoneNumber", ((CdmTypeAttributeDefinition) attGroup.getMembers().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) attGroup.getMembers().get(4)).getName());

        CdmAttributeGroupDefinition attGroup2 = (CdmAttributeGroupDefinition) ((CdmAttributeGroupReference) resolvedEntity.getAttributes().get(1)).getExplicitReference();
        Assert.assertEquals("PersonInfo--OccupationInfo", attGroup.getName());
        Assert.assertEquals(3, attGroup2.getMembers().getCount());
        Assert.assertEquals("title", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(0)).getName());
        Assert.assertEquals("company", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(1)).getName());
        Assert.assertEquals("tenure", ((CdmTypeAttributeDefinition) attGroup2.getMembers().get(2)).getName());
    }

    /**
     * Test resolving a type attribute with a rename attributes operation
     */
    @Test
    public void testTypeAttributeProj() throws InterruptedException {
        String testName = "testTypeAttributeProj";
        String entityName = "Person";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Rename with format "n{a}e{o}w{M}" attributes ["address"]
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "newAddress");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
    }
}
