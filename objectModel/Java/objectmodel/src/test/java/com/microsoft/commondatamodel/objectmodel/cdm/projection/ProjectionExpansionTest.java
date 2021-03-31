// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationArrayExpansion;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationExcludeAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
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
 * A test class for testing the ArrayExpansion operation in a projection as well as Expansion in a resolution guidance
 */
public class ProjectionExpansionTest {
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
            "testProjectionExpansion")
            .toString();

    /**
     * Test for creating a projection with an ArrayExpansion operation on an entity attribute using the object model
     */
    @Test
    public void testEntityAttributeProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntityAttributeProjUsingObjectModel", null);
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testEntityAttributeProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an ArrayExpansion operation
        CdmOperationArrayExpansion arrayExpansionOp = corpus.makeObject(CdmObjectType.OperationArrayExpansionDef);
        arrayExpansionOp.setStartOrdinal(1);
        arrayExpansionOp.setEndOrdinal(2);
        projection.getOperations().add(arrayExpansionOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        CdmProjection projection2 = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection2.setSource(projectionEntityRef);

        // Create a RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{m}{o}");
        projection2.getOperations().add(renameAttrsOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef2 = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef2.setExplicitReference(projection2);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef2);
        entity.getAttributes().add(entityAttribute);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "id1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "value1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "date1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "id2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "value2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "date2");
    }

    /**
     * Test for creating a projection with an ArrayExpansion operation on an entity definition using the object model
     */
    @Test
    public void testEntityProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntityProjUsingObjectModel", null);
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testEntityProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);

        // Create an ArrayExpansion operation
        CdmOperationArrayExpansion arrayExpansionOp = corpus.makeObject(CdmObjectType.OperationArrayExpansionDef);
        arrayExpansionOp.setStartOrdinal(1);
        arrayExpansionOp.setEndOrdinal(2);
        projection.getOperations().add(arrayExpansionOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        CdmProjection projection2 = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection2.setSource(projectionEntityRef);

        // Create a RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{m}{o}");
        projection2.getOperations().add(renameAttrsOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef2 = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef2.setExplicitReference(projection2);

        // Set the entity's ExtendEntity to be the projection
        entity.setExtendsEntity(projectionEntityRef2);

        // Resolve the entity
        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", null, localRoot).join();

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "id1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "value1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "date1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "id2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "value2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "date2");
    }

    /**
     * Test for creating a projection with an ArrayExpansion operation and a condition using the object model
     */
    @Test
    public void testConditionalProjUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testConditionalProjUsingObjectModel", null);
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testConditionalProjUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create an entity
        CdmEntityDefinition entity = ProjectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        CdmProjection projection = ProjectionTestUtils.createProjection(corpus, localRoot);
        projection.setCondition("referenceOnly==true");

        // Create an ArrayExpansion operation
        CdmOperationArrayExpansion arrayExpansionOp = corpus.makeObject(CdmObjectType.OperationArrayExpansionDef);
        arrayExpansionOp.setStartOrdinal(1);
        arrayExpansionOp.setEndOrdinal(2);
        projection.getOperations().add(arrayExpansionOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef.setExplicitReference(projection);

        // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        CdmProjection projection2 = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection2.setSource(projectionEntityRef);

        // Create a RenameAttributes operation
        CdmOperationRenameAttributes renameAttrsOp = corpus.makeObject(CdmObjectType.OperationRenameAttributesDef);
        renameAttrsOp.setRenameFormat("{m}{o}");
        projection2.getOperations().add(renameAttrsOp);

        // Create an entity reference to hold this projection
        CdmEntityReference projectionEntityRef2 = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionEntityRef2.setExplicitReference(projection2);

        // Create an entity attribute that contains this projection and add this to the entity
        CdmEntityAttributeDefinition entityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
        entityAttribute.setEntity(projectionEntityRef2);
        entity.getAttributes().add(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive
        ResolveOptions resOpt = new ResolveOptions(entity.getInDocument());
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("referenceOnly"))));

        // Resolve the entity with 'referenceOnly'
        CdmEntityDefinition resolvedEntityWithReferenceOnly = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntityWithReferenceOnly.getAttributes().size(), 8);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(0)).getName(), "id1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(1)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(2)).getName(), "value1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(3)).getName(), "date1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(4)).getName(), "id2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(5)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(6)).getName(), "value2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithReferenceOnly.getAttributes().get(7)).getName(), "date2");

        // Now resolve the entity with the default directive
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>()));
        CdmEntityDefinition resolvedEntityWithStructured = entity.createResolvedEntityAsync("Resolved_" + entity.getEntityName() + ".cdm.json", resOpt, localRoot).join();

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntityWithStructured.getAttributes().size(), 4);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(0)).getName(), "id");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(1)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(2)).getName(), "value");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntityWithStructured.getAttributes().get(3)).getName(), "date");
    }

    /**
     * Expansion on an entity attribute
     */
    @Test
    public void testExpansion() throws InterruptedException {
        String testName = "testExpansion";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 10);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "count");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "name3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "age3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName(), "address3");
    }

    /**
     * ArrayExpansion on an entity attribute
     */
    @Test
    public void testEntityAttribute() throws InterruptedException {
        String testName = "testEntityAttribute";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 9);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "name3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "age3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "address3");
    }

    /**
     * ArrayExpansion on an entity attribute without a RenameAttributes
     */
    @Test
    public void testProjNoRename() throws InterruptedException {
        String testName = "testProjNoRename";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3
        // Since there's no rename, the expanded attributes just get merged together
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 3);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
    }

    /**
     * Expansion on an entity definition
     * NOTE: This is not supported in resolution guidance
     */
    @Test
    public void testExtendsEntity() throws InterruptedException {
        String testName = "testExtendsEntity";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        // ExtendsEntityResolutionGuidance doesn't support doing expansions, so we only get "count" here
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 1);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "count");
    }

    /**
     * ArrayExpansion on an entity definition
     */
    @Test
    public void testExtendsEntityProj() throws InterruptedException {
        String testName = "testExtendsEntityProj";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 9);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "name3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "age3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "address3");
    }

    /**
     * Nested projections with ArrayExpansion
     */
    @Test
    public void testNestedProj() throws InterruptedException {
        String testName = "testNestedProj";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3 and then 1...2, renameFormat = {m}_{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 18);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name_1_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age_1_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address_1_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "name_2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "age_2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "address_2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "name_3_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "age_3_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "address_3_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName(), "name_1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(10)).getName(), "age_1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(11)).getName(), "address_1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(12)).getName(), "name_2_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(13)).getName(), "age_2_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(14)).getName(), "address_2_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(15)).getName(), "name_3_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(16)).getName(), "age_3_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(17)).getName(), "address_3_2");
    }

    /**
     * Multiple ArrayExpansion operations in a single projection
     */
    @Test
    public void testMultipleOps() throws InterruptedException {
        String testName = "testMultipleOps";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...2 and 1...3, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 9);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "name3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "age3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "address3");
    }

    /**
     * Start and end ordinals of -2...2
     */
    @Test
    public void testNegativeStartOrdinal() throws InterruptedException {
        String testName = "testNegativeStartOrdinal";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand -2...2, renameFormat = {m}{o}
        // Since we don't allow negative ordinals, output should be 0...2
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 9);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name0");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age0");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address0");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "address2");
    }

    /**
     * Start ordinal greater than end ordinal
     */
    @Test
    public void testStartGTEndOrdinal() throws InterruptedException {
        String testName = "testStartGTEndOrdinal";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        // A warning should be logged when startOrdinal > endOrdinal
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (!message.contains("startOrdinal 2 should not be greater than endOrdinal 0"))
                Assert.fail("Some unexpected failure - " + message + "!");
        }, CdmStatusLevel.Warning);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 2...0, renameFormat = {m}{o}
        // No array expansion happens here so the input just passes through
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 3);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
    }

    /**
     * Same start and end ordinals
     */
    @Test
    public void testSameStartEndOrdinals() throws InterruptedException {
        String testName = "testSameStartEndOrdinals";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...1, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 3);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address1");
    }

    /**
     * Combine ArrayExpansion, RenameAttributes, and IncludeAttributes in a single projection
     */
    @Test
    public void testCombineOps() throws InterruptedException {
        String testName = "testCombineOps";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}, include [name, age1]
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 4);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "name3");
    }

    /**
     * Expansion on a polymorphic source
     */
    @Test
    public void testPolymorphic() throws InterruptedException {
        String testName = "testPolymorphic";
        String entityName = "BusinessPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
        // Expand 1...2, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 11);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "count");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "emailId1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "isPrimary1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "phoneId1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "number1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "emailId2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "isPrimary2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName(), "phoneId2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(10)).getName(), "number2");
    }

    /**
     * ArrayExpansion on a polymorphic source
     */
    @Test
    public void testPolymorphicProj() throws InterruptedException {
        String testName = "testPolymorphicProj";
        String entityName = "BusinessPerson";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
        // Expand 1...2, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 10);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "emailId1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "isPrimary1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneId1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "number1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "emailId2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "isPrimary2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "phoneId2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName(), "number2");
    }

    /**
     * Expansion on an array source
     * NOTE: This is not supported in resolution guidance due to ordinals from a previous resolution guidance
     * not being removed for the next resolution guidance, resulting in ordinals being skipped over in the new
     * resolution guidance as it thinks it has already done that round
     */
    @Test
    public void testArraySource() throws InterruptedException {
        String testName = "testArraySource";
        String entityName = "FriendGroup";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
        // Expand 1...2, renameFormat = {m}_{o}
        // Since resolution guidance doesn't support doing an expansion on an array source, we end up with the
        // following result where it skips expanding attributes with the same ordinal (ex. name1_1, name2_2)
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 9);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "count_");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "personCount_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "name2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "age2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "address2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "personCount_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "name1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "age1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "address1_2");
    }

    /**
     * ArrayExpansion on an array source
     */
    @Test
    public void testArraySourceProj() throws InterruptedException {
        String testName = "testArraySourceProj";
        String entityName = "FriendGroup";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
        // Expand 1...2, renameFormat = {m}_{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 14);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "personCount_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name1_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "age1_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "address1_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "name2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "age2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "address2_1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "personCount_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "name1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName(), "age1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(10)).getName(), "address1_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(11)).getName(), "name2_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(12)).getName(), "age2_2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(13)).getName(), "address2_2");
    }

    /**
     * Expansion on an entity with an attribute group
     */
    @Test
    public void testGroup() throws InterruptedException {
        String testName = "testGroup";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 10);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "count");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "name3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "age3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(9)).getName(), "address3");
    }

    /**
     * ArrayExpansion on an entity with an attribute group
     */
    @Test
    public void testGroupProj() throws InterruptedException {
        String testName = "testGroupProj";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 9);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address1");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "name2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "age2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName(), "address2");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(6)).getName(), "name3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(7)).getName(), "age3");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(8)).getName(), "address3");
    }

    /**
     * ArrayExpansion with a condition
     */
    @Test
    public void testConditionalProj() throws InterruptedException {
        String testName = "testConditionalProj";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        // No array expansion, condition was false
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 3);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "address");
    }
}
