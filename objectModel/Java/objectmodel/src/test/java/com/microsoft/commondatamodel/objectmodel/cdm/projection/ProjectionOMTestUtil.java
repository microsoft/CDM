// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationIncludeAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Utility class to help create object model based tests
 */
public class ProjectionOMTestUtil {
    /** Constants */
    private static final String FOUNDATION_JSON_PATH = "cdm:/foundations.cdm.json";

    private static final String LOCAL_OUTPUT_STORAGE_NS = "output";

    /** private variables */
    private static final String manifestName = "default";

    private static String manifestDocName = manifestName + ".manifest.cdm.json";

    public String getManifestDocName() {
        return this.manifestDocName;
    }

    private static final String allImportsName = "_allImports";

    public static String AllImportsDocName = allImportsName + ".cdm.json";

    /**
     * The path between TestDataPath and TestName.
     */
    private static String testsSubPath;

    /**
     * ClassName property
     */
    private String className = "";

    public String getClassName() {
        return this.className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    /**
     * TestName property
     */
    private String testName;

    public String getTestName() {
        return this.testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    /**
     * Corpus property
     */
    private CdmCorpusDefinition corpus;

    public CdmCorpusDefinition getCorpus() {
        return this.corpus;
    }

    public void setCorpus(CdmCorpusDefinition corpus) {
        this.corpus = corpus;
    }

    /**
     * Test Folder Input Path
     */
    private String inputPath;

    public String getInputPath() {
        return this.inputPath;
    }

    public void setInputPath(String inputPath) {
        this.inputPath = inputPath;
    }

    /**
     * Test Folder Expected Output Path
     */
    private String expectedOutputPath;

    public String getExpectedOutputPath() {
        return this.expectedOutputPath;
    }

    public void setExpectedOutputPath(String expectedOutputPath) {
        this.expectedOutputPath = expectedOutputPath;
    }

    /**
     * Test Folder Actual Output Path
     */
    private String actualOutputPath;

    public String getActualOutputPath() {
        return this.actualOutputPath;
    }

    public void setActualOutputPath(String actualOutputPath) {
        this.actualOutputPath = actualOutputPath;
    }

    /**
     * Local storage root folder definition
     */
    private CdmFolderDefinition localStorageRoot;

    public CdmFolderDefinition getLocalStorageRoot() {
        return this.localStorageRoot;
    }

    public void setLocalStorageRoot(CdmFolderDefinition localStorageRoot) {
        this.localStorageRoot = localStorageRoot;
    }

    /**
     * Default manifest definition
     */
    private CdmManifestDefinition defaultManifest;

    public CdmManifestDefinition getDefaultManifest() {
        return this.defaultManifest;
    }

    public void setDefaultManifest(CdmManifestDefinition defaultManifest) {
        this.defaultManifest = defaultManifest;
    }

    /**
     * All imports files
     */
    private CdmDocumentDefinition allImports;

    public CdmDocumentDefinition getAllImports() {
        return this.allImports;
    }

    public void setAllImports(CdmDocumentDefinition allImports) {
        this.allImports = allImports;
    }

    /**
     * Utility class constructor
     */
    public ProjectionOMTestUtil(String className, String testName) throws InterruptedException {
        setClassName(className);
        setTestName(testName);

        testsSubPath = new File(new File(new File("cdm"), "projection"), getClassName()).toString();

        setInputPath(TestHelper.getInputFolderPath(testsSubPath, getTestName()));
        setExpectedOutputPath(TestHelper.getExpectedOutputFolderPath(testsSubPath, getTestName()));
        setActualOutputPath(TestHelper.getActualOutputFolderPath(testsSubPath, getTestName()));

        setCorpus(TestHelper.getLocalCorpus(testsSubPath, getTestName(), null));
        getCorpus().getStorage().mount(LOCAL_OUTPUT_STORAGE_NS, new LocalAdapter(getActualOutputPath()));
        getCorpus().getStorage().setDefaultNamespace(LOCAL_OUTPUT_STORAGE_NS);

        setLocalStorageRoot(getCorpus().getStorage().fetchRootFolder(LOCAL_OUTPUT_STORAGE_NS));

        setDefaultManifest(createDefaultManifest());

        setAllImports(createAndInitializeAllImportsFile());
    }

    public void dispose() {
        setCorpus(null);
    }

    /**
     * Create a default manifest
     */
    public CdmManifestDefinition createDefaultManifest() {
        CdmManifestDefinition manifestDefault = getCorpus().makeObject(CdmObjectType.ManifestDef, manifestName);
        getLocalStorageRoot().getDocuments().add(manifestDefault, manifestDocName);

        return manifestDefault;
    }

    /**
     * Create and initialize _allImports file
     */
    public CdmDocumentDefinition createAndInitializeAllImportsFile() {
        CdmDocumentDefinition allImportsDocDef = new CdmDocumentDefinition(getCorpus().getCtx(), allImportsName);

        getLocalStorageRoot().getDocuments().add(allImportsDocDef, AllImportsDocName);
        allImportsDocDef.getImports().add(FOUNDATION_JSON_PATH);

        return allImportsDocDef;
    }

    /**
     * Create a simple entity called 'TestSource' with a single attribute
     */
    public CdmEntityDefinition createBasicEntity(String entityName, List<TypeAttributeParam> attributesParams) {
        CdmEntityDefinition entity = getCorpus().makeObject(CdmObjectType.EntityDef, entityName);

        for (TypeAttributeParam attributesParam : attributesParams) {
            CdmTypeAttributeDefinition attribute = getCorpus().makeObject(CdmObjectType.TypeAttributeDef, attributesParam.getAttributeName(), false);
            attribute.setDataType(getCorpus().makeRef(CdmObjectType.DataTypeRef, attributesParam.getAttributeDataType(), true));
            attribute.setPurpose(getCorpus().makeRef(CdmObjectType.PurposeRef, attributesParam.getAttributePurpose(), true));
            attribute.setDisplayName(attributesParam.getAttributeName());

            entity.getAttributes().add(attribute);
        }

        CdmDocumentDefinition entityDoc = getCorpus().makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityDoc.getImports().add(AllImportsDocName);
        entityDoc.getDefinitions().add(entity);

        getLocalStorageRoot().getDocuments().add(entityDoc, entityDoc.getName());
        getDefaultManifest().getEntities().add(entity);
        getAllImports().getImports().add(entity.getInDocument().getName());

        return entity;
    }

    /**
     * Function to valid the entity
     */
    public void validateBasicEntity(CdmEntityDefinition entity, String entityName, List<TypeAttributeParam> attributesParams) {
        Assert.assertNotNull(entity, "ValidateBasicEntity: " + entityName + " failed!");
        Assert.assertEquals(entity.getAttributes().getCount(), attributesParams.stream().count(), "ValidateBasicEntity: Attribute count for " + entityName + " failed!");
    }

    /**
     * Create a simple projection object
     */
    public CdmProjection createProjection(String projectionSourceName) {
        CdmProjection projection = getCorpus().makeObject(CdmObjectType.ProjectionDef);
        projection.setSource(getCorpus().makeObject(CdmObjectType.EntityRef, projectionSourceName, true));

        return projection;
    }

    /**
     * Create an inline entity reference for a projection
     */
    public CdmEntityReference createProjectionInlineEntityReference(CdmProjection projection) {
        CdmEntityReference projectionInlineEntityRef = getCorpus().makeObject(CdmObjectType.EntityRef, null);
        projectionInlineEntityRef.setExplicitReference(projection);

        return projectionInlineEntityRef;
    }

    /**
     * Create an Input Attribute Operation
     */
    public CdmOperationIncludeAttributes createOperationInputAttributes(CdmProjection projection, List<String> includeAttributes) {
        // IncludeAttributes Operation
        CdmOperationIncludeAttributes includeAttributesOp = new CdmOperationIncludeAttributes(getCorpus().getCtx());
        includeAttributesOp.setIncludeAttributes(new ArrayList<String>());

        for (String includeAttribute : includeAttributes) {
            includeAttributesOp.getIncludeAttributes().add(includeAttribute);
        }

        projection.getOperations().add(includeAttributesOp);

        return includeAttributesOp;
    }

    /**
     * Create a Combine Attribute Operation
     */
    public CdmOperationCombineAttributes createOperationCombineAttributes(CdmProjection projection, List<String> selectedAttributes, CdmTypeAttributeDefinition mergeIntoAttribute) {
        // CombineAttributes Operation
        CdmOperationCombineAttributes combineAttributesOp = new CdmOperationCombineAttributes(getCorpus().getCtx());
        combineAttributesOp.setSelect(selectedAttributes);
        combineAttributesOp.setMergeInto(mergeIntoAttribute);

        projection.getOperations().add(combineAttributesOp);

        return combineAttributesOp;
    }

    /**
     * Create a Type Attribute
     */
    public CdmTypeAttributeDefinition createTypeAttribute(String attributeName, String dataType, String purpose) {
        CdmDataTypeReference dataTypeRef = (CdmDataTypeReference) getCorpus().makeRef(CdmObjectType.DataTypeRef, dataType, false);

        CdmPurposeReference purposeRef = (CdmPurposeReference) getCorpus().makeRef(CdmObjectType.PurposeRef, purpose, false);

        CdmTypeAttributeDefinition attribute = (CdmTypeAttributeDefinition) getCorpus().makeObject(CdmObjectType.TypeAttributeDef, attributeName, false);
        attribute.setDataType(dataTypeRef);
        attribute.setPurpose(purposeRef);

        return attribute;
    }

    /**
     * Create an entity attribute
     */
    public CdmEntityAttributeDefinition createEntityAttribute(String entityAttributeName, CdmEntityReference projectionSourceEntityRef) {
        CdmEntityAttributeDefinition entityAttribute = getCorpus().makeObject(CdmObjectType.EntityAttributeDef, entityAttributeName, false);
        entityAttribute.setEntity(projectionSourceEntityRef);

        return entityAttribute;
    }

    public CdmEntityDefinition getAndValidateResolvedEntity(CdmEntityDefinition entity, List<String> resOpts) {
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(getCorpus(), entity, resOpts).join();
        Assert.assertNotNull(resolvedEntity, "GetAndValidateResolvedEntity: " + entity.getEntityName() + " resolution with options '" + String.join(",", resOpts) + "' failed!");

        return resolvedEntity;
    }
}