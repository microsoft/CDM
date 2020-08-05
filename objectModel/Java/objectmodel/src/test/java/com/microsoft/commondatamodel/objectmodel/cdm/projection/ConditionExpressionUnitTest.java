// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ConditionExpression;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;

/**
 * Unit test for ConditionExpression functions
 */
public class ConditionExpressionUnitTest {
    private static final String foundationJsonPath = "cdm:/foundations.cdm.json";

    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testConditionExpression")
            .toString();

    /**
     * Unit test for ConditionExpression.getDefaultConditionExpression
     */
    @Test
    public void testGetDefaultConditionExpression() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testGetDefaultConditionExpression", null);
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testGetDefaultConditionExpression")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");
        CdmManifestDefinition manifestDefault = createDefaultManifest(corpus, localRoot);

        CdmEntityDefinition entityTestSource = createEntityTestSource(corpus, manifestDefault, localRoot);

        // projection for a non entity attribute
        CdmOperationCollection opColl = new CdmOperationCollection(corpus.getCtx(), entityTestSource);

        // add 1st FK
        opColl.add(new CdmOperationReplaceAsForeignKey(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource), " (referenceOnly || noMaxDepth || (depth > maxDepth)) ");

        // add 2nd FK
        opColl.add(new CdmOperationReplaceAsForeignKey(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource), " (referenceOnly || noMaxDepth || (depth > maxDepth)) ");

        opColl.clear();

        // add AddCount
        opColl.add(new CdmOperationAddCountAttribute(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource), " (!structured) ");

        // add ArrayExpansion
        opColl.add(new CdmOperationArrayExpansion(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource), " (!structured) ");

        opColl.clear();

        // add AddSupporting
        opColl.add(new CdmOperationAddSupportingAttribute(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource), " (true) ");

        CdmEntityAttributeDefinition entityTestEntityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, "TestEntityAttribute", false);

        // projection for a non entity attribute
        CdmOperationCollection opCollEA = new CdmOperationCollection(corpus.getCtx(), entityTestEntityAttribute);

        // add 1st FK
        opCollEA.add(new CdmOperationReplaceAsForeignKey(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute), " ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ");

        // add 2nd FK
        opCollEA.add(new CdmOperationReplaceAsForeignKey(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute), " ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ");

        opCollEA.clear();

        // add AddCount
        opCollEA.add(new CdmOperationAddCountAttribute(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute), " ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ");

        // add ArrayExpansion
        opCollEA.add(new CdmOperationArrayExpansion(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute), " ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ");

        opCollEA.clear();

        // add AddSupporting
        opCollEA.add(new CdmOperationAddSupportingAttribute(corpus.getCtx()));
        Assert.assertEquals(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute), " ( (!normalized) || (cardinality.maximum <= 1) )  &&  (true) ");
    }

    /**
     * Create a default manifest
     */
    private CdmManifestDefinition createDefaultManifest(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        String manifestName = "default";
        String manifestDocName = manifestName +  ".manifest.cdm.json";

        CdmManifestDefinition manifestDefault = corpus.makeObject(CdmObjectType.ManifestDef, manifestName);

        localRoot.getDocuments().add(manifestDefault, manifestDocName);

        return manifestDefault;
    }

    /**
     * Create a simple entity called 'TestSource' with a single attribute
     */
    private CdmEntityDefinition createEntityTestSource(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot) {
        String entityName = "TestSource";

        CdmEntityDefinition entityTestSource = corpus.makeObject(CdmObjectType.EntityDef, entityName);
        String attributeName = "TestAttribute";

        CdmTypeAttributeDefinition entityTestAttribute = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName, false);
        entityTestAttribute.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "string", true));
        entityTestAttribute.setPurpose(corpus.makeRef(CdmObjectType.PurposeRef, "hasA", true));
        entityTestAttribute.setDisplayName(attributeName);

        entityTestSource.getAttributes().add(entityTestAttribute);

        CdmDocumentDefinition entityTestSourceDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityTestSourceDoc.getImports().add(foundationJsonPath);
        entityTestSourceDoc.getDefinitions().add(entityTestSource);

        localRoot.getDocuments().add(entityTestSourceDoc, entityTestSourceDoc.getName());
        manifestDefault.getEntities().add(entityTestSource);

        return entityTestSource;
    }

}
