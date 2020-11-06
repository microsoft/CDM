// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;

public class ProjectionObjectModelTest {
    private static final String foundationJsonPath = "cdm:/foundations.cdm.json";

    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
            new File(new File(
                    "cdm"),
                    "projection")
                    .toString();

    /**
     * Basic test to save projection based entities and then try to reload them and validate that the projections were persisted correctly
     */
    @Test
    public void testProjectionUsingObjectModel() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testProjectionUsingObjectModel", null);
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testProjectionUsingObjectModel")));
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");
        CdmManifestDefinition manifestDefault = createDefaultManifest(corpus, localRoot);

        CdmEntityDefinition entityTestSource = createEntityTestSource(corpus, manifestDefault, localRoot);
        CdmEntityDefinition entityTestEntityProjection = createEntityTestEntityProjection(corpus, manifestDefault, localRoot);
        CdmEntityDefinition entityTestEntityNestedProjection = createEntityTestEntityNestedProjection(corpus, manifestDefault, localRoot);
        CdmEntityDefinition entityTestEntityAttributeProjection = createEntityTestEntityAttributeProjection(corpus, manifestDefault, localRoot);
        CdmEntityDefinition entityTestOperationCollection = createEntityTestOperationCollection(corpus, manifestDefault, localRoot);

        // Save manifest and entities.
        manifestDefault.saveAsAsync(manifestDefault.getManifestName() + ".manifest.cdm.json", true).join();

        String expected = "TestSource";
        CdmObjectType expectedType = CdmObjectType.ProjectionDef;
        String actual = null;
        CdmObjectType actualType = CdmObjectType.Error;

        // Try to read back the newly persisted manifest and projection based entities.
        CdmManifestDefinition manifestReadBack = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/" + manifestDefault.getManifestName() + ".manifest.cdm.json").join();
        Assert.assertEquals(manifestReadBack.getEntities().getCount(), 5);
        Assert.assertEquals(manifestReadBack.getEntities().get(0).getEntityName(), entityTestSource.getEntityName());
        Assert.assertEquals(manifestReadBack.getEntities().get(1).getEntityName(), entityTestEntityProjection.getEntityName());
        Assert.assertEquals(manifestReadBack.getEntities().get(2).getEntityName(), entityTestEntityNestedProjection.getEntityName());
        Assert.assertEquals(manifestReadBack.getEntities().get(3).getEntityName(), entityTestEntityAttributeProjection.getEntityName());

        // Read back the newly persisted manifest and projection based entity TestEntityProjection and validate.
        CdmEntityDefinition entityTestEntityProjectionReadBack = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityTestEntityProjection.getEntityName() + ".cdm.json/" + entityTestEntityProjection.getEntityName(), manifestReadBack).join();
        Assert.assertNotNull(entityTestEntityProjectionReadBack);
        actual = ((CdmEntityReference) ((CdmProjection) entityTestEntityProjectionReadBack.getExtendsEntity().getExplicitReference()).getSource()).getNamedReference();
        actualType = entityTestEntityProjectionReadBack.getExtendsEntity().getExplicitReference().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, expectedType);

        // Read back the newly persisted manifest and projection based entity TestEntityNestedProjection and validate.
        CdmEntityDefinition entityTestEntityNestedProjectionReadBack = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityTestEntityNestedProjection.getEntityName() + ".cdm.json/" + entityTestEntityNestedProjection.getEntityName(), manifestReadBack).join();
        Assert.assertNotNull(entityTestEntityNestedProjectionReadBack);
        actual = ((CdmProjection) (((CdmProjection) (((CdmProjection) (entityTestEntityNestedProjectionReadBack.getExtendsEntity()).getExplicitReference()).getSource()).getExplicitReference()).getSource()).getExplicitReference()).getSource().getNamedReference();
        actualType = ((((CdmProjection) (((CdmProjection) (entityTestEntityNestedProjectionReadBack.getExtendsEntity()).getExplicitReference()).getSource()).getExplicitReference()).getSource()).getExplicitReference()).getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, expectedType);

        // Read back the newly persisted manifest and projection based entity TestEntityAttributeProjection and validate.
        CdmEntityDefinition entityTestEntityAttributeProjectionReadBack = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityTestEntityAttributeProjection.getEntityName() + ".cdm.json/" + entityTestEntityAttributeProjection.getEntityName(), manifestReadBack).join();
        Assert.assertNotNull(entityTestEntityAttributeProjectionReadBack);
        actual = ((CdmEntityReference) ((CdmProjection) ((CdmEntityAttributeDefinition) entityTestEntityAttributeProjectionReadBack.getAttributes().get(0)).getEntity().getExplicitReference()).getSource()).getNamedReference();
        actualType = ((CdmEntityAttributeDefinition) entityTestEntityAttributeProjectionReadBack.getAttributes().get(0)).getEntity().getExplicitReference().getObjectType();
        Assert.assertEquals(actual, expected);
        Assert.assertEquals(actualType, expectedType);

        // Read back operations collections and validate.
        CdmEntityDefinition entityTestOperationCollectionReadBack = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityTestOperationCollection.getEntityName() + ".cdm.json/" + entityTestOperationCollection.getEntityName(), manifestReadBack).join();
        Assert.assertNotNull(entityTestOperationCollectionReadBack);
        int actualOperationCount = ((CdmProjection) entityTestOperationCollectionReadBack.getExtendsEntity().getExplicitReference()).getOperations().size();
        Assert.assertEquals(actualOperationCount, 9);
        CdmOperationCollection operations = ((CdmProjection) entityTestOperationCollectionReadBack.getExtendsEntity().getExplicitReference()).getOperations();
        Assert.assertEquals(operations.get(0).getType(), CdmOperationType.AddCountAttribute);
        Assert.assertEquals(operations.get(1).getType(), CdmOperationType.AddSupportingAttribute);
        Assert.assertEquals(operations.get(2).getType(), CdmOperationType.AddTypeAttribute);
        Assert.assertEquals(operations.get(3).getType(), CdmOperationType.ExcludeAttributes);
        Assert.assertEquals(operations.get(4).getType(), CdmOperationType.ArrayExpansion);
        Assert.assertEquals(operations.get(5).getType(), CdmOperationType.CombineAttributes);
        Assert.assertEquals(operations.get(6).getType(), CdmOperationType.RenameAttributes);
        Assert.assertEquals(operations.get(7).getType(), CdmOperationType.ReplaceAsForeignKey);
        Assert.assertEquals(operations.get(8).getType(), CdmOperationType.IncludeAttributes);
    }

    /**
     * Create a default manifest
     */
    private CdmManifestDefinition createDefaultManifest(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        String manifestName = "default";
        String manifestDocName = manifestName + ".manifest.cdm.json";

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

    /**
     * Create a simple projection object
     */
    private CdmProjection createProjection(CdmCorpusDefinition corpus) {
        CdmProjection projection = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection.setSource(corpus.makeObject(CdmObjectType.EntityRef, "TestSource", true));
        return projection;
    }

    /**
     * Create a 3-level nested projection object
     */
    private CdmProjection createNestedProjection(CdmCorpusDefinition corpus) {
        CdmProjection projection3 = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection3.setSource(corpus.makeObject(CdmObjectType.EntityRef, "TestSource", true));

        CdmEntityReference inlineProjectionEntityRef3 = corpus.makeObject(CdmObjectType.EntityRef, null);
        inlineProjectionEntityRef3.setExplicitReference(projection3);

        CdmProjection projection2 = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection2.setSource(inlineProjectionEntityRef3);

        CdmEntityReference inlineProjectionEntityRef2 = corpus.makeObject(CdmObjectType.EntityRef, null);
        inlineProjectionEntityRef2.setExplicitReference(projection2);

        CdmProjection projection1 = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection1.setSource(inlineProjectionEntityRef2);

        return projection1;
    }

    /**
     * Create an entity 'TestEntityProjection' that extends from a projection
     */
    private CdmEntityDefinition createEntityTestEntityProjection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot) {
        String entityName = "TestEntityProjection";

        CdmEntityReference inlineProjectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        inlineProjectionEntityRef.setExplicitReference(createProjection(corpus));

        CdmEntityDefinition entityTestEntityProjection = corpus.makeObject(CdmObjectType.EntityDef, entityName);
        entityTestEntityProjection.setExtendsEntity(inlineProjectionEntityRef);

        CdmDocumentDefinition entityTestEntityProjectionDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityTestEntityProjectionDoc.getImports().add(foundationJsonPath);
        entityTestEntityProjectionDoc.getImports().add("TestSource.cdm.json");
        entityTestEntityProjectionDoc.getDefinitions().add(entityTestEntityProjection);

        localRoot.getDocuments().add(entityTestEntityProjectionDoc, entityTestEntityProjectionDoc.getName());
        manifestDefault.getEntities().add(entityTestEntityProjection);

        return entityTestEntityProjection;
    }

    /**
     * Create an entity 'TestEntityNestedProjection' that extends from a projection
     */
    private CdmEntityDefinition createEntityTestEntityNestedProjection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot) {
        String entityName = "TestEntityNestedProjection";

        CdmEntityReference inlineProjectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        inlineProjectionEntityRef.setExplicitReference(createNestedProjection(corpus));

        CdmEntityDefinition entityTestEntityNestedProjection = corpus.makeObject(CdmObjectType.EntityDef, entityName);
        entityTestEntityNestedProjection.setExtendsEntity(inlineProjectionEntityRef);

        CdmDocumentDefinition entityTestEntityNestedProjectionDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityTestEntityNestedProjectionDoc.getImports().add(foundationJsonPath);
        entityTestEntityNestedProjectionDoc.getImports().add("TestSource.cdm.json");
        entityTestEntityNestedProjectionDoc.getDefinitions().add(entityTestEntityNestedProjection);

        localRoot.getDocuments().add(entityTestEntityNestedProjectionDoc, entityTestEntityNestedProjectionDoc.getName());
        manifestDefault.getEntities().add(entityTestEntityNestedProjection);

        return entityTestEntityNestedProjection;
    }

    /**
     * Create an entity 'TestEntityAttributeProjection' that contains an entity attribute with a projection as a source entity
     */
    private CdmEntityDefinition createEntityTestEntityAttributeProjection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot) {
        String entityName = "TestEntityAttributeProjection";

        CdmEntityReference inlineProjectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        inlineProjectionEntityRef.setExplicitReference(createProjection(corpus));

        CdmEntityDefinition entityTestEntityAttributeProjection = corpus.makeObject(CdmObjectType.EntityDef, entityName);

        String attributeName = "TestAttribute";
        CdmEntityAttributeDefinition entityTestEntityAttribute = corpus.makeObject(CdmObjectType.EntityAttributeDef, attributeName, false);
        entityTestEntityAttribute.setEntity(inlineProjectionEntityRef);
        entityTestEntityAttributeProjection.getAttributes().add(entityTestEntityAttribute);

        CdmDocumentDefinition entityTestEntityAttributeProjectionDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityTestEntityAttributeProjectionDoc.getImports().add(foundationJsonPath);
        entityTestEntityAttributeProjectionDoc.getImports().add("TestSource.cdm.json");
        entityTestEntityAttributeProjectionDoc.getDefinitions().add(entityTestEntityAttributeProjection);

        localRoot.getDocuments().add(entityTestEntityAttributeProjectionDoc, entityTestEntityAttributeProjectionDoc.getName());
        manifestDefault.getEntities().add(entityTestEntityAttributeProjection);

        return entityTestEntityAttributeProjection;
    }

    /**
     * Create a projection object with operations
     */
    private CdmProjection createProjectionWithOperationCollection(CdmCorpusDefinition corpus, CdmObject owner) {
        CdmProjection projection = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection.setSource(corpus.makeObject(CdmObjectType.EntityRef, "TestSource", true));

        // AddCountAttribute Operation
        CdmOperationAddCountAttribute addCountAttributeOp = new CdmOperationAddCountAttribute(corpus.getCtx());
        addCountAttributeOp.setCountAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef));
        projection.getOperations().add(addCountAttributeOp);

        // AddSupportingAttribute Operation
        CdmOperationAddSupportingAttribute addSupportingAttributeOp = new CdmOperationAddSupportingAttribute(corpus.getCtx());
        addSupportingAttributeOp.setSupportingAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef));
        projection.getOperations().add(addSupportingAttributeOp);

        // AddTypeAttribute Operation
        CdmOperationAddTypeAttribute addTypeAttributeOp = new CdmOperationAddTypeAttribute(corpus.getCtx());
        addTypeAttributeOp.setTypeAttribute(corpus.makeObject(CdmObjectType.TypeAttributeDef));
        projection.getOperations().add(addTypeAttributeOp);

        // ExcludeAttributes Operation
        CdmOperationExcludeAttributes excludeAttributesOp = new CdmOperationExcludeAttributes(corpus.getCtx());
        excludeAttributesOp.setExcludeAttributes(new ArrayList<String>());
        excludeAttributesOp.getExcludeAttributes().add("testAttribute1");
        projection.getOperations().add(excludeAttributesOp);

        // ArrayExpansion Operation
        CdmOperationArrayExpansion arrayExpansionOp = new CdmOperationArrayExpansion(corpus.getCtx());
        arrayExpansionOp.setStartOrdinal(0);
        arrayExpansionOp.setEndOrdinal(1);
        projection.getOperations().add(arrayExpansionOp);

        // CombineAttributes Operation
        CdmOperationCombineAttributes combineAttributesOp = new CdmOperationCombineAttributes(corpus.getCtx());
        combineAttributesOp.setSelect(new ArrayList<String>());
        combineAttributesOp.setMergeInto(corpus.makeObject(CdmObjectType.TypeAttributeDef));
        combineAttributesOp.getSelect().add("testAttribute1");
        projection.getOperations().add(combineAttributesOp);

        // RenameAttributes Operation
        CdmOperationRenameAttributes renameAttributesOp = new CdmOperationRenameAttributes(corpus.getCtx());
        renameAttributesOp.setRenameFormat("{m}");
        projection.getOperations().add(renameAttributesOp);

        // ReplaceAsForeignKey Operation
        CdmOperationReplaceAsForeignKey replaceAsForeignKeyOp = new CdmOperationReplaceAsForeignKey(corpus.getCtx());
        replaceAsForeignKeyOp.setReference("testAttribute1");
        replaceAsForeignKeyOp.setReplaceWith(corpus.makeObject(CdmObjectType.TypeAttributeDef, "testForeignKey", false));
        projection.getOperations().add(replaceAsForeignKeyOp);

        // IncludeAttributes Operation
        CdmOperationIncludeAttributes includeAttributesOp = new CdmOperationIncludeAttributes(corpus.getCtx());
        includeAttributesOp.setIncludeAttributes(new ArrayList<String>());
        includeAttributesOp.getIncludeAttributes().add("testAttribute1");
        projection.getOperations().add(includeAttributesOp);

        return projection;
    }

    /**
     * Create an entity 'TestOperationCollection' that extends from a projection with a collection of operations
     */
    private CdmEntityDefinition createEntityTestOperationCollection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot) {
        String entityName = "TestOperationCollection";

        CdmEntityReference inlineProjectionEntityRef = corpus.makeObject(CdmObjectType.EntityRef, null);
        CdmEntityDefinition entityTestOperationCollection = corpus.makeObject(CdmObjectType.EntityDef, entityName);
        inlineProjectionEntityRef.setExplicitReference(createProjectionWithOperationCollection(corpus, entityTestOperationCollection));
        entityTestOperationCollection.setExtendsEntity(inlineProjectionEntityRef);

        CdmDocumentDefinition entityTestOperationCollectionDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityTestOperationCollectionDoc.getImports().add(foundationJsonPath);
        entityTestOperationCollectionDoc.getImports().add("TestSource.cdm.json");
        entityTestOperationCollectionDoc.getDefinitions().add(entityTestOperationCollection);

        localRoot.getDocuments().add(entityTestOperationCollectionDoc, entityTestOperationCollectionDoc.getName());
        manifestDefault.getEntities().add(entityTestOperationCollection);

        return entityTestOperationCollection;
    }
}