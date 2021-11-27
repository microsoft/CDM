// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Entity;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;

public class ProjectionPersistenceTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
            new File(new File(
                    "persistence",
                    "cdmfolder"),
                    "projection")
                    .toString();

    /**
     * Basic test to load persisted Projection based entities
     */
    @Test
    public void testLoadProjection() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadProjection");

        CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();

        String expected = "TestSource";
        String actual = null;
        CdmObjectType actualType = CdmObjectType.Error;

        // TestEntityStringReference.cdm.json
        CdmEntityDefinition entTestEntityStringReference = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityStringReference.cdm.json/TestEntityStringReference", manifest).join();
        Assert.assertNotNull(entTestEntityStringReference);
        actual = entTestEntityStringReference.getExtendsEntity().getNamedReference();
        actualType = entTestEntityStringReference.getExtendsEntity().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.EntityRef);

        // TestEntityEntityReference.cdm.json
        CdmEntityDefinition entTestEntityEntityReference = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityEntityReference.cdm.json/TestEntityEntityReference", manifest).join();
        Assert.assertNotNull(entTestEntityEntityReference);
        actual = entTestEntityEntityReference.getExtendsEntity().getNamedReference();
        actualType = entTestEntityEntityReference.getExtendsEntity().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.EntityRef);

        // TestEntityProjection.cdm.json
        CdmEntityDefinition entTestEntityProjection = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityProjection.cdm.json/TestEntityProjection", manifest).join();
        Assert.assertNotNull(entTestEntityProjection);
        actual = ((CdmEntityReference) ((CdmProjection) entTestEntityProjection.getExtendsEntity().getExplicitReference()).getSource()).getNamedReference();
        actualType = entTestEntityProjection.getExtendsEntity().getExplicitReference().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.ProjectionDef);

        // TestEntityNestedProjection.cdm.json
        CdmEntityDefinition entTestEntityNestedProjection = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityNestedProjection.cdm.json/TestEntityNestedProjection", manifest).join();
        Assert.assertNotNull(entTestEntityNestedProjection);
        actual = ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) entTestEntityNestedProjection.getExtendsEntity()).getExplicitReference()).getSource()).getExplicitReference()).getSource()).getExplicitReference()).getSource().getNamedReference();
        actualType = ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) entTestEntityNestedProjection.getExtendsEntity()).getExplicitReference()).getSource()).getExplicitReference()).getSource()).getExplicitReference()).getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.ProjectionDef);

        // TestEntityAttributeStringReference.cdm.json
        CdmEntityDefinition entTestEntityAttributeStringReference = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityAttributeStringReference.cdm.json/TestEntityAttributeStringReference", manifest).join();
        Assert.assertNotNull(entTestEntityAttributeStringReference);
        actual = ((CdmEntityAttributeDefinition) entTestEntityAttributeStringReference.getAttributes().get(0)).getEntity().getNamedReference();
        actualType = ((CdmEntityAttributeDefinition) entTestEntityAttributeStringReference.getAttributes().get(0)).getEntity().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.EntityRef);

        // TestEntityAttributeEntityReference.cdm.json
        CdmEntityDefinition entTestEntityAttributeEntityReference = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityAttributeEntityReference.cdm.json/TestEntityAttributeEntityReference", manifest).join();
        Assert.assertNotNull(entTestEntityAttributeEntityReference);
        actual = ((CdmEntityAttributeDefinition) entTestEntityAttributeEntityReference.getAttributes().get(0)).getEntity().getNamedReference();
        actualType = ((CdmEntityAttributeDefinition) entTestEntityAttributeEntityReference.getAttributes().get(0)).getEntity().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.EntityRef);

        // TestEntityAttributeProjection.cdm.json
        CdmEntityDefinition entTestEntityAttributeProjection = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityAttributeProjection.cdm.json/TestEntityAttributeProjection", manifest).join();
        Assert.assertNotNull(entTestEntityAttributeProjection);
        actual = ((CdmEntityReference) ((CdmProjection) ((CdmEntityAttributeDefinition) entTestEntityAttributeProjection.getAttributes().get(0)).getEntity().getExplicitReference()).getSource()).getNamedReference();
        actualType = ((CdmEntityAttributeDefinition) entTestEntityAttributeProjection.getAttributes().get(0)).getEntity().getExplicitReference().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.ProjectionDef);

        // TestEntityAttributeNestedProjection.cdm.json
        CdmEntityDefinition entTestEntityAttributeNestedProjection = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestEntityAttributeNestedProjection.cdm.json/TestEntityAttributeNestedProjection", manifest).join();
        Assert.assertNotNull(entTestEntityAttributeNestedProjection);
        actual = ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) ((CdmEntityAttributeDefinition) entTestEntityAttributeNestedProjection.getAttributes().get(0)).getEntity()).getExplicitReference()).getSource()).getExplicitReference()).getSource()).getExplicitReference()).getSource().getNamedReference();
        actualType = ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) ((CdmProjection) ((CdmEntityReference) ((CdmEntityAttributeDefinition) entTestEntityAttributeNestedProjection.getAttributes().get(0)).getEntity()).getExplicitReference()).getSource()).getExplicitReference()).getSource()).getExplicitReference()).getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, CdmObjectType.ProjectionDef);

        // TestOperationCollection.cdm.json
        CdmEntityDefinition entTestOperationCollection = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TestOperationCollection.cdm.json/TestOperationCollection", manifest).join();
        Assert.assertNotNull(entTestOperationCollection);
        int actualOperationCount = ((CdmProjection) entTestOperationCollection.getExtendsEntity().getExplicitReference()).getOperations().size();
        Assert.assertEquals(actualOperationCount, 9);
        CdmOperationCollection operations = ((CdmProjection) entTestOperationCollection.getExtendsEntity().getExplicitReference()).getOperations();
        Assert.assertEquals(operations.get(0).getType(), CdmOperationType.AddCountAttribute);
        Assert.assertEquals(operations.get(1).getType(), CdmOperationType.AddSupportingAttribute);
        Assert.assertEquals(operations.get(2).getType(), CdmOperationType.AddTypeAttribute);
        Assert.assertEquals(operations.get(3).getType(), CdmOperationType.ExcludeAttributes);
        Assert.assertEquals(operations.get(4).getType(), CdmOperationType.ArrayExpansion);
        Assert.assertEquals(operations.get(5).getType(), CdmOperationType.CombineAttributes);
        Assert.assertEquals(operations.get(6).getType(), CdmOperationType.RenameAttributes);
        Assert.assertEquals(operations.get(7).getType(), CdmOperationType.ReplaceAsForeignKey);
        Assert.assertEquals(operations.get(8).getType(), CdmOperationType.IncludeAttributes);

        // TestEntityTrait.cdm.json
        CdmEntityDefinition entTestEntityTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/TestEntityTrait.cdm.json/TestEntityTrait", manifest).join();
        Assert.assertNotNull(entTestEntityTrait);
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestEntityTrait.getAttributes().get(0)).getName(), "TestAttribute");
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestEntityTrait.getAttributes().get(0)).getDataType().getNamedReference(), "testDataType");

        // TestEntityExtendsTrait.cdm.json
        CdmEntityDefinition entTestEntityExtendsTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/TestEntityExtendsTrait.cdm.json/TestEntityExtendsTrait", manifest).join();
        Assert.assertNotNull(entTestEntityExtendsTrait);
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestEntityExtendsTrait.getAttributes().get(0)).getName(), "TestExtendsTraitAttribute");
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestEntityExtendsTrait.getAttributes().get(0)).getDataType().getNamedReference(), "testDerivedDataType");

        // TestProjectionTrait.cdm.json
        CdmEntityDefinition entTestProjectionTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/TestProjectionTrait.cdm.json/TestProjectionTrait", manifest).join();
        Assert.assertNotNull(entTestProjectionTrait);
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestProjectionTrait.getAttributes().get(0)).getName(), "TestProjectionAttribute");
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestProjectionTrait.getAttributes().get(0)).getDataType().getNamedReference(), "testDataType");

        // TestProjectionExtendsTrait.cdm.json
        CdmEntityDefinition entTestProjectionExtendsTrait = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/TestProjectionExtendsTrait.cdm.json/TestProjectionExtendsTrait", manifest).join();
        Assert.assertNotNull(entTestProjectionExtendsTrait);
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestProjectionExtendsTrait.getAttributes().get(0)).getName(), "TestProjectionAttributeB");
        Assert.assertEquals(((CdmTypeAttributeDefinition) entTestProjectionExtendsTrait.getAttributes().get(0)).getDataType().getNamedReference(), "testExtendsDataTypeB");
    }

    /**
     * Basic test to save persisted Projections based entities
     */
    @Test
    public void testSaveProjection() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testSaveProjection");

        CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();

        CdmEntityDefinition entitySales = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Sales.cdm.json/Sales", manifest).join();
        Assert.assertNotNull(entitySales);

        CdmFolderDefinition actualRoot = corpus.getStorage().fetchRootFolder("output");
        Assert.assertNotNull(actualRoot);

        actualRoot.getDocuments().add(entitySales.getInDocument(), "Persisted_Sales.cdm.json");
        actualRoot.getDocuments().get(0).saveAsAsync("output:/Persisted_Sales.cdm.json").join();

        CdmEntityDefinition entityActual = corpus.<CdmEntityDefinition>fetchObjectAsync("output:/Persisted_Sales.cdm.json/Sales", manifest).join();
        Assert.assertNotNull(entityActual);

        Entity entityContentActual = (Entity) PersistenceLayer.toData(entityActual, null, null, "CdmFolder", CdmEntityDefinition.class);
        Assert.assertNotNull(entityContentActual);
        Assert.assertNotNull(entityContentActual.getAttributes());
        Assert.assertTrue(entityContentActual.getAttributes().size() == 1);
        Assert.assertFalse(entityContentActual.getAttributes().get(0).toString().contains("entityReference"));
    }
}
