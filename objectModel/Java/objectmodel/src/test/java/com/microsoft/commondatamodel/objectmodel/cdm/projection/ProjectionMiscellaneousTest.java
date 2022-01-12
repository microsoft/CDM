// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Various projections scenarios, partner scenarios, bug fixes
 */
public class ProjectionMiscellaneousTest {
    private static List<HashSet<String>> resOptsCombinations = new ArrayList<>(
        Arrays.asList(
            new HashSet<>(Arrays.asList()),
            new HashSet<>(Arrays.asList("referenceOnly")),
            new HashSet<>(Arrays.asList("normalized")),
            new HashSet<>(Arrays.asList("structured")),
            new HashSet<>(Arrays.asList("referenceOnly", "normalized")),
            new HashSet<>(Arrays.asList("referenceOnly", "structured")),
            new HashSet<>(Arrays.asList("normalized", "structured")),
            new HashSet<>(Arrays.asList("referenceOnly", "normalized", "structured"))
        )
    );

    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "ProjectionMiscellaneousTest").toString();

    /**
     * Test case scenario for Bug #24 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/24
     */
    @Test
    public void testInvalidOperationType() throws InterruptedException {
        String testName = "testInvalidOperationType";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (!message.contains("ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | fromData")) {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Warning);

        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("default.manifest.cdm.json").join();

        // Raise error: "ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | FromData",
        // when attempting to load a projection with an invalid operation
        String entityName = "SalesNestedFK";
        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entity);
    }

    /**
     * Test case scenario for Bug #23 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/23
     */
    @Test
    public void testZeroMinimumCardinality() throws InterruptedException {
        String testName = "testZeroMinimumCardinality";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (!message.contains("CardinalitySettings | Invalid minimum cardinality -1.")) {
                Assert.fail("Some unexpected failure - " + message + "!");
            }
        }, CdmStatusLevel.Warning);

        // Create Local Root Folder
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create Manifest
        CdmManifestDefinition manifest = corpus.makeObject(CdmObjectType.ManifestDef, "default");
        localRoot.getDocuments().add(manifest, "default.manifest.cdm.json");

        String entityName = "TestEntity";

        // Create Entity
        CdmEntityDefinition entity = corpus.makeObject(CdmObjectType.EntityDef, entityName);
        entity.setExtendsEntity(corpus.makeRef(CdmObjectType.EntityRef, "CdmEntity", true));

        // Create Entity Document
        CdmDocumentDefinition document = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        document.getDefinitions().add(entity);
        localRoot.getDocuments().add(document, document.getName());
        manifest.getEntities().add(entity);

        String attributeName = "testAttribute";
        String attributeDataType = "string";
        String attributePurpose = "hasA";

        // Create Type Attribute
        CdmTypeAttributeDefinition attribute = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName,false);
        attribute.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, attributeDataType, true));
        attribute.setPurpose(corpus.makeRef(CdmObjectType.PurposeRef, attributePurpose, true));
        attribute.setDisplayName(attributeName);

        if (entity != null) {
            entity.getAttributes().add(attribute);
        }

        attribute.setCardinality(new CardinalitySettings(attribute));
        attribute.getCardinality().setMinimum("0");
        attribute.getCardinality().setMaximum("*");

        Assert.assertTrue(attribute.fetchIsNullable() == true);
    }

    /**
     * Tests if it resolves correct when there are two entity attributes in circular
     * denpendency using projection
     */
    @Test
    public void testCircularEntityAttributes() throws InterruptedException
    {
        String testName = "testCircularEntityAttributes";
        String entityName = "A";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync(entityName + ".cdm.json/" + entityName).join();

        CdmEntityDefinition resEntity = entity.createResolvedEntityAsync("resolved-" + entityName).join();

        Assert.assertNotNull(resEntity);
        Assert.assertEquals(resEntity.getAttributes().getCount(), 2);
    }

    /**
     * Tests if not setting the projection "source" on an entity attribute triggers an error log
     */
    @Test
    public void testEntityAttributeSource() {
        CdmCorpusDefinition corpus = new CdmCorpusDefinition();
        final AtomicInteger errorCount = new AtomicInteger(0);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            errorCount.getAndIncrement();
        }, CdmStatusLevel.Error);
        CdmProjection projection = new CdmProjection(corpus.getCtx());
        CdmEntityAttributeDefinition entityAttribute = new CdmEntityAttributeDefinition(corpus.getCtx(), "attribute");
        entityAttribute.setEntity(new CdmEntityReference(corpus.getCtx(), projection, false));

        // First case, a projection without source.
        projection.validate();
        Assert.assertEquals(errorCount.get(), 1);
        errorCount.set(0);

        // Second case, a projection with a nested projection.
        CdmProjection innerProjection = new CdmProjection(corpus.getCtx());
        projection.setSource(new CdmEntityReference(corpus.getCtx(), innerProjection, false));
        projection.validate();
        innerProjection.validate();
        Assert.assertEquals(errorCount.get(), 1);
        errorCount.set(0);

        // Third case, a projection with an explicit entity definition.
        innerProjection.setSource(new CdmEntityReference(corpus.getCtx(), new CdmEntityDefinition(corpus.getCtx(), "Entity"), false));
        projection.validate();
        innerProjection.validate();
        Assert.assertEquals(errorCount.get(), 0);

        // Third case, a projection with a named reference.
        innerProjection.setSource(new CdmEntityReference(corpus.getCtx(), "Entity", false));
        projection.validate();
        innerProjection.validate();
        Assert.assertEquals(errorCount.get(), 0);
    }

    /**
     * Tests resolution of an entity when maximum depth is reached while resolving a polymorphic entity
     */
    @Test
    public void testMaxDepthOnPolymorphicEntity() throws InterruptedException {
        String testName = "testMaxDepthOnPolymorphicEntity";
        String entityName = "A";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync(entityName + ".cdm.json/" + entityName).join();

        ResolveOptions resOpt = new ResolveOptions(entity);
        resOpt.setMaxDepth(1);
        CdmEntityDefinition resEntity = entity.createResolvedEntityAsync("resolved-" + entityName, resOpt).join();

        Assert.assertNotNull(resEntity);
        Assert.assertEquals(resEntity.getAttributes().getCount(), 4);
    }

    /**
     * Tests if setting the projection "source" on a type attribute triggers an error log
     */
    @Test
    public void testTypeAttributeSource() {
        CdmCorpusDefinition corpus = new CdmCorpusDefinition();
        final AtomicInteger errorCount = new AtomicInteger(0);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            errorCount.getAndIncrement();
        }, CdmStatusLevel.Error);
        CdmProjection projection = new CdmProjection(corpus.getCtx());
        CdmTypeAttributeDefinition typeAttribute = new CdmTypeAttributeDefinition(corpus.getCtx(), "attribute");
        typeAttribute.setProjection(projection);

        // First case, a projection without source.
        projection.validate();
        Assert.assertEquals(errorCount.get(), 0);

        // Second case, a projection with a nested projection.
        CdmProjection innerProjection = new CdmProjection(corpus.getCtx());
        projection.setSource(new CdmEntityReference(corpus.getCtx(), innerProjection, false));
        projection.validate();
        innerProjection.validate();
        Assert.assertEquals(errorCount.get(), 0);

        // Third case, a projection with an explicit entity definition.
        innerProjection.setSource(new CdmEntityReference(corpus.getCtx(), new CdmEntityDefinition(corpus.getCtx(), "Entity"), false));
        projection.validate();
        innerProjection.validate();
        Assert.assertEquals(errorCount.get(), 1);
        errorCount.set(0);

        // Third case, a projection with a named reference.
        innerProjection.setSource(new CdmEntityReference(corpus.getCtx(), "Entity", false));
        projection.validate();
        innerProjection.validate();
        Assert.assertEquals(errorCount.get(), 1);
    }

    /**
     * Tests setting the "runSequentially" flag to true
     */
    @Test
    public void testRunSequentially() throws InterruptedException {
        String testName = "testRunSequentially";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Rename attributes "age" to "yearsOld" then "phoneNumber" to "contactNumber" followed by a add count attribute.
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 6);
        Assert.assertEquals("name", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("yearsOld", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("address", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
        Assert.assertEquals("contactNumber", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName());
        Assert.assertEquals("email", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName());
        Assert.assertEquals("countAttribute", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(5)).getName());
    }

    /**
     * Tests setting the "runSequentially" flag to true mixed with "sourceInput" set to true
     */
    @Test
    public void testRunSequentiallyAndSourceInput() throws InterruptedException {
        String testName = "testRunSequentiallyAndSourceInput";
        String entityName = "NewPerson";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList())).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Replace "age" with "ageFK" and "address" with "addressFK" as foreign keys, followed by a add count attribute.
        Assert.assertEquals(resolvedEntity.getAttributes().getCount(), 3);
        Assert.assertEquals("ageFK", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName());
        Assert.assertEquals("addressFK", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName());
        Assert.assertEquals("countAttribute", ((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName());
    }
}
