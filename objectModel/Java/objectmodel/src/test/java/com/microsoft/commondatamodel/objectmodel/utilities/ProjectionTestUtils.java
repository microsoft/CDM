// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projection.AttributeContextUtil;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;

import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Common utility methods for projection tests
 */
public class ProjectionTestUtils {
    /**
     * Path to foundations
     */
    private static final String foundationJsonPath = "cdm:/foundations.cdm.json";

    /**
     * Resolves an entity
     */
    public static CompletableFuture<CdmEntityDefinition> getResolvedEntity(CdmCorpusDefinition corpus, CdmEntityDefinition inputEntity, List<String> resolutionOptions) {
        return getResolvedEntity(corpus, inputEntity, resolutionOptions, false);
    }

    /**
     * Resolves an entity
     * @param corpus The corpus
     * @param inputEntity The entity to resolve
     * @param resolutionOptions The resolution options
     * @param addResOptToName Whether to add the resolution options as part of the resolved entity name
     */
    public static CompletableFuture<CdmEntityDefinition> getResolvedEntity(
        CdmCorpusDefinition corpus,
        CdmEntityDefinition inputEntity,
        List<String> resolutionOptions,
        boolean addResOptToName
    ) {
        return CompletableFuture.supplyAsync(() -> {
            HashSet<String> roHashSet = new HashSet<>(resolutionOptions);

            String resolvedEntityName = "";
            if (addResOptToName) {
                String fileNameSuffix = getResolutionOptionNameSuffix(resolutionOptions);
                resolvedEntityName = "Resolved_" + inputEntity.getEntityName() + fileNameSuffix;
            } else {
                resolvedEntityName = "Resolved_" + inputEntity.getEntityName();
            }

            ResolveOptions ro = new ResolveOptions(inputEntity.getInDocument());
            ro.setDirectives(new AttributeResolutionDirectiveSet(roHashSet));

            CdmFolderDefinition resolvedFolder = corpus.getStorage().fetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder).join();

            return resolvedEntity;
        });
    }

    /**
     * Returns a suffix that contains the file name and resolution option used
     * @param resolutionOptions The resolution options
     */
    public static String getResolutionOptionNameSuffix(List<String> resolutionOptions) {
        String fileNamePrefix = "";

        for (int i = 0; i < resolutionOptions.size(); i++) {
            fileNamePrefix = fileNamePrefix + "_" + resolutionOptions.get(i);
        }

        if (StringUtils.isNullOrTrimEmpty(fileNamePrefix)) {
            fileNamePrefix = "_default";
        }

        return fileNamePrefix;
    }

    /**
     * Loads an entity, resolves it, and then validates the generated attribute contexts
     */
    public static CompletableFuture<Void> loadEntityForResolutionOptionAndSave(CdmCorpusDefinition corpus, String testName, String testsSubpath, String entityName, List<String> resOpts) {
        return CompletableFuture.runAsync(() -> {
            String expectedOutputPath = null;
            try {
                expectedOutputPath = TestHelper.getExpectedOutputFolderPath(testsSubpath, testName);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            String fileNameSuffix = ProjectionTestUtils.getResolutionOptionNameSuffix(resOpts);

            CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
            CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, resOpts, true).join();
            AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName + fileNameSuffix, resolvedEntity);
        });
    }

    /**
     * Creates a corpus
     */
    public static CdmCorpusDefinition getCorpus(String testName, String testsSubpath) throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(testsSubpath, testName, null);
        return corpus;
    }

    /**
     * Creates an entity
     */
    public static CdmEntityDefinition createEntity(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        String entityName = "TestEntity";
        CdmEntityDefinition entity = corpus.makeObject(CdmObjectType.EntityDef, entityName);

        CdmDocumentDefinition entityDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityDoc.getImports().add(foundationJsonPath);
        entityDoc.getDefinitions().add(entity);
        localRoot.getDocuments().add(entityDoc, entityDoc.getName());

        return entity;
    }

    /**
     * Creates a source entity for a projection
     */
    public static CdmEntityDefinition createSourceEntity(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        String entityName = "SourceEntity";
        CdmEntityDefinition entity = corpus.makeObject(CdmObjectType.EntityDef, entityName);

        String attributeName1 = "id";
        CdmTypeAttributeDefinition attribute1 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName1);
        attribute1.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "String", true));
        entity.getAttributes().add(attribute1);

        String attributeName2 = "name";
        CdmTypeAttributeDefinition attribute2 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName2);
        attribute2.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "String", true));
        entity.getAttributes().add(attribute2);

        String attributeName3 = "value";
        CdmTypeAttributeDefinition attribute3 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName3);
        attribute3.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "integer", true));
        entity.getAttributes().add(attribute3);

        String attributeName4 = "date";
        CdmTypeAttributeDefinition attribute4 = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName4);
        attribute4.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "date", true));
        entity.getAttributes().add(attribute4);

        CdmDocumentDefinition entityDoc = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        entityDoc.getImports().add(foundationJsonPath);
        entityDoc.getDefinitions().add(entity);
        localRoot.getDocuments().add(entityDoc, entityDoc.getName());

        return entity;
    }

    /**
     * Creates a projection
     */
    public static CdmProjection createProjection(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot) {
        // Create an entity reference to use as the source of the projection
        CdmEntityReference projectionSource = corpus.makeObject(CdmObjectType.EntityRef, null);
        projectionSource.setExplicitReference(createSourceEntity(corpus, localRoot));

        // Create the projection
        CdmProjection projection = corpus.makeObject(CdmObjectType.ProjectionDef);
        projection.setSource(projectionSource);

        return projection;
    }
}
