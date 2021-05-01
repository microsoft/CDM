// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmManifestDefinition,
    CdmObject,
    cdmObjectType,
    CdmOperationAddCountAttribute,
    CdmOperationAddSupportingAttribute,
    CdmOperationAddTypeAttribute,
    CdmOperationExcludeAttributes,
    CdmOperationCollection,
    CdmOperationArrayExpansion,
    CdmOperationCombineAttributes,
    CdmOperationRenameAttributes,
    CdmOperationReplaceAsForeignKey,
    CdmOperationIncludeAttributes,
    cdmOperationType,
    CdmProjection,
    CdmPurposeReference,
    CdmTypeAttributeDefinition
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

describe('Cdm/Projection/ProjectionObjectModel', () => {
    const foundationJsonPath: string = 'cdm:/foundations.cdm.json';
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection';

    /**
     * Basic test to save projection based entities and then try to reload them and validate that the projections were persisted correctly
     */
    it('TestProjectionUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestProjectionUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestProjectionUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');
        const manifestDefault: CdmManifestDefinition = createDefaultManifest(corpus, localRoot);

        const entityTestSource: CdmEntityDefinition = createEntityTestSource(corpus, manifestDefault, localRoot);
        const entityTestEntityProjection: CdmEntityDefinition = createEntityTestEntityProjection(corpus, manifestDefault, localRoot);
        const entityTestEntityNestedProjection: CdmEntityDefinition = createEntityTestEntityNestedProjection(corpus, manifestDefault, localRoot);
        const entityTestEntityAttributeProjection: CdmEntityDefinition = createEntityTestEntityAttributeProjection(corpus, manifestDefault, localRoot);
        const entityTestOperationCollection: CdmEntityDefinition = createEntityTestOperationCollection(corpus, manifestDefault, localRoot);

        // Save manifest and entities.
        await manifestDefault.saveAsAsync(`${manifestDefault.manifestName}.manifest.cdm.json`, true);

        const expected: string = 'TestSource';
        const expectedType: cdmObjectType = cdmObjectType.projectionDef;
        let actual: string;
        let actualType: cdmObjectType = cdmObjectType.error;

        // Try to read back the newly persisted manifest and projection based entities
        const manifestReadBack: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(`local:/${manifestDefault.manifestName}.manifest.cdm.json`);
        expect(manifestReadBack.entities.length)
            .toEqual(5);
        expect(manifestReadBack.entities.allItems[0].entityName)
            .toEqual(entityTestSource.entityName);
        expect(manifestReadBack.entities.allItems[1].entityName)
            .toEqual(entityTestEntityProjection.entityName);
        expect(manifestReadBack.entities.allItems[2].entityName)
            .toEqual(entityTestEntityNestedProjection.entityName);
        expect(manifestReadBack.entities.allItems[3].entityName)
            .toEqual(entityTestEntityAttributeProjection.entityName);

        // Read back the newly persisted manifest and projection based entity TestEntityProjection and validate
        const entityTestEntityProjectionReadBack: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityTestEntityProjection.entityName}.cdm.json/${entityTestEntityProjection.entityName}`, manifestReadBack);
        expect(entityTestEntityProjectionReadBack)
            .toBeTruthy();
        actual = ((entityTestEntityProjectionReadBack.extendsEntity.explicitReference as CdmProjection).source as CdmEntityReference).namedReference;
        actualType = (entityTestEntityProjectionReadBack.extendsEntity.explicitReference as CdmProjection).getObjectType();
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(expectedType);

        // Read back the newly persisted manifest and projection based entity TestEntityNestedProjection and validate
        const entityTestEntityNestedProjectionReadBack: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityTestEntityNestedProjection.entityName}.cdm.json/${entityTestEntityNestedProjection.entityName}`, manifestReadBack);
        expect(entityTestEntityNestedProjectionReadBack)
            .toBeTruthy();
        actual = (((entityTestEntityNestedProjectionReadBack.extendsEntity.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.namedReference;
        actualType = ((entityTestEntityNestedProjectionReadBack.extendsEntity.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.explicitReference.objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(expectedType);

        // Read back the newly persisted manifest and projection based entity TestEntityAttributeProjection and validate
        const entityTestEntityAttributeProjectionReadBack: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityTestEntityAttributeProjection.entityName}.cdm.json/${entityTestEntityAttributeProjection.entityName}`, manifestReadBack);
        expect(entityTestEntityAttributeProjectionReadBack)
            .toBeTruthy();
        actual = (((entityTestEntityAttributeProjectionReadBack.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.explicitReference as CdmProjection).source as CdmEntityReference).namedReference;
        actualType = ((entityTestEntityAttributeProjectionReadBack.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.explicitReference as CdmProjection).getObjectType();
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(expectedType);

        // Read back operations collections and validate
        const entityTestOperationCollectionReadBack: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityTestOperationCollection.entityName}.cdm.json/${entityTestOperationCollection.entityName}`, manifestReadBack);
        expect(entityTestOperationCollectionReadBack)
            .toBeTruthy();
        const actualOperationCount: number = (entityTestOperationCollectionReadBack.extendsEntity.explicitReference as CdmProjection).operations.length;
        expect(actualOperationCount)
            .toEqual(9);
        const operations: CdmOperationCollection = (entityTestOperationCollectionReadBack.extendsEntity.explicitReference as CdmProjection).operations;
        expect(operations.allItems[0].type)
            .toEqual(cdmOperationType.addCountAttribute);
        expect(operations.allItems[1].type)
            .toEqual(cdmOperationType.addSupportingAttribute);
        expect(operations.allItems[2].type)
            .toEqual(cdmOperationType.addTypeAttribute);
        expect(operations.allItems[3].type)
            .toEqual(cdmOperationType.excludeAttributes);
        expect(operations.allItems[4].type)
            .toEqual(cdmOperationType.arrayExpansion);
        expect(operations.allItems[5].type)
            .toEqual(cdmOperationType.combineAttributes);
        expect(operations.allItems[6].type)
            .toEqual(cdmOperationType.renameAttributes);
        expect(operations.allItems[7].type)
            .toEqual(cdmOperationType.replaceAsForeignKey);
        expect(operations.allItems[8].type)
            .toEqual(cdmOperationType.includeAttributes);
    });

    /**
     * Create a default manifest
     */
    function createDefaultManifest(corpus: CdmCorpusDefinition, localRoot: CdmFolderDefinition) : CdmManifestDefinition {
        const manifestName: string = 'default';
        const manifestDocName: string = `${manifestName}.manifest.cdm.json`;

        const manifestDefault: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, manifestName);

        localRoot.documents.push(manifestDefault, manifestDocName);

        return manifestDefault;
    }

    /**
     * Create a simple entity called 'TestSource' with a single attribute
     */
    function createEntityTestSource(corpus: CdmCorpusDefinition, manifestDefault: CdmManifestDefinition, localRoot: CdmFolderDefinition) : CdmEntityDefinition {
        const entityName: string = 'TestSource';

        const entityTestSource: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);

        const attributeName: string = 'TestAttribute';
        const entityTestAttribute: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName, false);
        entityTestAttribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'string', true);
        entityTestAttribute.purpose = corpus.MakeRef<CdmPurposeReference>(cdmObjectType.purposeRef, 'hasA', true);
        entityTestAttribute.displayName = attributeName;
        entityTestSource.attributes.push(entityTestAttribute);

        const entityTestSourceDoc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityTestSourceDoc.imports.push(foundationJsonPath);
        entityTestSourceDoc.definitions.push(entityTestSource);

        localRoot.documents.push(entityTestSourceDoc, entityTestSourceDoc.name);
        manifestDefault.entities.push(entityTestSource);

        return entityTestSource;
    }

    /**
     * Create a simple projection object
     */
    function createProjection(corpus: CdmCorpusDefinition) : CdmProjection {
        const projection: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection.source = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, 'TestSource', true);

        return projection;
    }

    /**
     * Create a 3-level nested projection object
     */
    function createNestedProjection(corpus: CdmCorpusDefinition): CdmProjection {
        const projection3: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection3.source = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, 'TestSource', true);
        const inlineProjectionEntityRef3: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        inlineProjectionEntityRef3.explicitReference = projection3;

        const projection2: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection2.source = inlineProjectionEntityRef3;
        const inlineProjectionEntityRef2: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        inlineProjectionEntityRef2.explicitReference = projection2;

        const projection1: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection1.source = inlineProjectionEntityRef2;

        return projection1;
    }

    /**
     * Create an entity 'TestEntityProjection' that extends from a projection
     */
    function createEntityTestEntityProjection(corpus: CdmCorpusDefinition, manifestDefault: CdmManifestDefinition, localRoot: CdmFolderDefinition) : CdmEntityDefinition {
        const entityName: string = 'TestEntityProjection';

        const inlineProjectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        inlineProjectionEntityRef.explicitReference = createProjection(corpus);

        const entityTestEntityProjection: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);
        entityTestEntityProjection.extendsEntity = inlineProjectionEntityRef;

        const entityTestEntityProjectionDoc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityTestEntityProjectionDoc.imports.push(foundationJsonPath);
        entityTestEntityProjectionDoc.imports.push('TestSource.cdm.json');
        entityTestEntityProjectionDoc.definitions.push(entityTestEntityProjection);

        localRoot.documents.push(entityTestEntityProjectionDoc, entityTestEntityProjectionDoc.name);
        manifestDefault.entities.push(entityTestEntityProjection);

        return entityTestEntityProjection;
    }

    /**
     * Create an entity 'TestEntityNestedProjection' that extends from a projection
     */
    function createEntityTestEntityNestedProjection(corpus: CdmCorpusDefinition, manifestDefault: CdmManifestDefinition, localRoot: CdmFolderDefinition) : CdmEntityDefinition {
        const entityName: string = 'TestEntityNestedProjection';

        const inlineProjectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        inlineProjectionEntityRef.explicitReference = createNestedProjection(corpus);

        const entityTestEntityNestedProjection: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);
        entityTestEntityNestedProjection.extendsEntity = inlineProjectionEntityRef;

        const entityTestEntityNestedProjectionDoc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityTestEntityNestedProjectionDoc.imports.push(foundationJsonPath);
        entityTestEntityNestedProjectionDoc.imports.push('TestSource.cdm.json');
        entityTestEntityNestedProjectionDoc.definitions.push(entityTestEntityNestedProjection);

        localRoot.documents.push(entityTestEntityNestedProjectionDoc, entityTestEntityNestedProjectionDoc.name);
        manifestDefault.entities.push(entityTestEntityNestedProjection);

        return entityTestEntityNestedProjection;
    }

    /**
     * Create an entity 'TestEntityAttributeProjection' that contains an entity attribute with a projection as a source entity
     */
    function createEntityTestEntityAttributeProjection(corpus: CdmCorpusDefinition, manifestDefault: CdmManifestDefinition, localRoot: CdmFolderDefinition) : CdmEntityDefinition {
        const entityName: string = 'TestEntityAttributeProjection';

        const inlineProjectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        inlineProjectionEntityRef.explicitReference = createProjection(corpus);

        const entityTestEntityAttributeProjection: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);

        const attributeName: string = 'TestAttribute';
        const entityTestEntityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, attributeName, false);
        entityTestEntityAttribute.entity = inlineProjectionEntityRef;
        entityTestEntityAttributeProjection.attributes.push(entityTestEntityAttribute);

        const entityTestEntityAttributeProjectionDoc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityTestEntityAttributeProjectionDoc.imports.push(foundationJsonPath);
        entityTestEntityAttributeProjectionDoc.imports.push('TestSource.cdm.json');
        entityTestEntityAttributeProjectionDoc.definitions.push(entityTestEntityAttributeProjection);

        localRoot.documents.push(entityTestEntityAttributeProjectionDoc, entityTestEntityAttributeProjectionDoc.name);
        manifestDefault.entities.push(entityTestEntityAttributeProjection);

        return entityTestEntityAttributeProjection;
    }

    /**
     * Create a projection object with operations
     */
    function createProjectionWithOperationCollection(corpus: CdmCorpusDefinition, owner: CdmObject) : CdmProjection {
        const projection: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection.source = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, 'TestSource', true);

        // AddCountAttribute Operation
        const addCountAttributeOp: CdmOperationAddCountAttribute = new CdmOperationAddCountAttribute(corpus.ctx);
        addCountAttributeOp.countAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef);
        projection.operations.push(addCountAttributeOp);

        // AddSupportingAttribute Operation
        const addSupportingAttributeOp: CdmOperationAddSupportingAttribute = new CdmOperationAddSupportingAttribute(corpus.ctx);
        addSupportingAttributeOp.supportingAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef);
        projection.operations.push(addSupportingAttributeOp);

        // AddTypeAttribute Operation
        const addTypeAttributeOp: CdmOperationAddTypeAttribute = new CdmOperationAddTypeAttribute(corpus.ctx);
        addTypeAttributeOp.typeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef);
        projection.operations.push(addTypeAttributeOp);

        // ExcludeAttributes Operation
        const excludeAttributesOp: CdmOperationExcludeAttributes = new CdmOperationExcludeAttributes(corpus.ctx);
        excludeAttributesOp.excludeAttributes = [];
        excludeAttributesOp.excludeAttributes.push('testAttribute1');
        projection.operations.push(excludeAttributesOp);

        // ArrayExpansion Operation
        const arrayExpansionOp: CdmOperationArrayExpansion = new CdmOperationArrayExpansion(corpus.ctx);
        arrayExpansionOp.startOrdinal = 0;
        arrayExpansionOp.endOrdinal = 1;
        projection.operations.push(arrayExpansionOp);

        // CombineAttributes Operation
        const combineAttributesOp: CdmOperationCombineAttributes = new CdmOperationCombineAttributes(corpus.ctx);
        combineAttributesOp.select = [];
        combineAttributesOp.mergeInto = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef);
        combineAttributesOp.select.push('testAttribute1');
        projection.operations.push(combineAttributesOp);

        // RenameAttributes Operation
        const renameAttributesOp: CdmOperationRenameAttributes = new CdmOperationRenameAttributes(corpus.ctx);
        renameAttributesOp.renameFormat = '{m}';
        projection.operations.push(renameAttributesOp);

        // ReplaceAsForeignKey Operation
        const replaceAsForeignKeyOp: CdmOperationReplaceAsForeignKey = new CdmOperationReplaceAsForeignKey(corpus.ctx);
        replaceAsForeignKeyOp.reference = 'testAttribute1';
        replaceAsForeignKeyOp.replaceWith = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'testForeignKey', false);
        projection.operations.push(replaceAsForeignKeyOp);

        // IncludeAttributes Operation
        const includeAttributesOp: CdmOperationIncludeAttributes = new CdmOperationIncludeAttributes(corpus.ctx);
        includeAttributesOp.includeAttributes = [];
        includeAttributesOp.includeAttributes.push('testAttribute1');
        projection.operations.push(includeAttributesOp);

        return projection;
    }

    /**
     * Create an entity 'TestOperationCollection' that extends from a projection with a collection of operations
     */
    function createEntityTestOperationCollection(corpus: CdmCorpusDefinition, manifestDefault: CdmManifestDefinition, localRoot: CdmFolderDefinition) : CdmEntityDefinition {
        const entityName: string = 'TestOperationCollection';

        const inlineProjectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        const entityTestOperationCollection: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);
        inlineProjectionEntityRef.explicitReference = createProjectionWithOperationCollection(corpus, entityTestOperationCollection);
        entityTestOperationCollection.extendsEntity = inlineProjectionEntityRef;

        const entityTestOperationCollectionDoc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityTestOperationCollectionDoc.imports.push(foundationJsonPath);
        entityTestOperationCollectionDoc.imports.push('TestSource.cdm.json');
        entityTestOperationCollectionDoc.definitions.push(entityTestOperationCollection);

        localRoot.documents.push(entityTestOperationCollectionDoc, entityTestOperationCollectionDoc.name);
        manifestDefault.entities.push(entityTestOperationCollection);

        return entityTestOperationCollection;
    }
});
