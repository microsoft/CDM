// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmOperationAddCountAttribute,
    CdmOperationAddSupportingAttribute,
    CdmOperationArrayExpansion,
    CdmOperationCollection,
    CdmOperationReplaceAsForeignKey,
    CdmPurposeReference,
    CdmTypeAttributeDefinition,
    ConditionExpression
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';

/**
 * Unit test for ConditionExpression functions
 */
describe('Cdm/Projection/ConditionExpressionUnitTest', () => {
    const foundationJsonPath: string = 'cdm:/foundations.cdm.json';

    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestConditionExpression';

    /**
     * Unit test for ConditionExpression.getDefaultConditionExpression
     */
    it('TestGetDefaultConditionExpression', () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestGetDefaultConditionExpression');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestGetDefaultConditionExpression')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');
        const manifestDefault: CdmManifestDefinition = createDefaultManifest(corpus, localRoot);

        const entityTestSource: CdmEntityDefinition = createEntityTestSource(corpus, manifestDefault, localRoot);

        // projection for a non entity attribute
        const opColl: CdmOperationCollection = new CdmOperationCollection(corpus.ctx, entityTestSource);

        // add 1st FK
        opColl.push(new CdmOperationReplaceAsForeignKey(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource))
            .toEqual(' (referenceOnly || noMaxDepth || (depth > maxDepth)) ');

        // add 2nd FK
        opColl.push(new CdmOperationReplaceAsForeignKey(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource))
            .toEqual(' (referenceOnly || noMaxDepth || (depth > maxDepth)) ');

        opColl.clear();

        // add AddCount
        opColl.push(new CdmOperationAddCountAttribute(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource))
            .toEqual(' (!structured) ');

        // add ArrayExpansion
        opColl.push(new CdmOperationArrayExpansion(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource))
            .toEqual(' (!structured) ');

        opColl.clear();

        // add AddSupporting
        opColl.push(new CdmOperationAddSupportingAttribute(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opColl, entityTestSource))
            .toEqual(' (true) ');

        const entityTestEntityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute', false);

        // projection for a non entity attribute
        const opCollEA: CdmOperationCollection = new CdmOperationCollection(corpus.ctx, entityTestEntityAttribute);

        // add 1st FK
        opCollEA.push(new CdmOperationReplaceAsForeignKey(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute))
            .toEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ');

        // add 2nd FK
        opCollEA.push(new CdmOperationReplaceAsForeignKey(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute))
            .toEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ');

        opCollEA.clear();

        // add AddCount
        opCollEA.push(new CdmOperationAddCountAttribute(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute))
            .toEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ');

        // add ArrayExpansion
        opCollEA.push(new CdmOperationArrayExpansion(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute))
            .toEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ');

        opCollEA.clear();

        // add AddSupporting
        opCollEA.push(new CdmOperationAddSupportingAttribute(corpus.ctx));
        expect(ConditionExpression.getDefaultConditionExpression(opCollEA, entityTestEntityAttribute))
            .toEqual(' ( (!normalized) || (cardinality.maximum <= 1) )  &&  (true) ');
    });

    /**
     * Create a default manifest
     */
    function createDefaultManifest(corpus: CdmCorpusDefinition, localRoot: CdmFolderDefinition): CdmManifestDefinition {
        const manifestName: string = 'default';
        const manifestDocName: string = `${manifestName}.manifest.cdm.json`;

        const manifestDefault: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, manifestName);

        localRoot.documents.push(manifestDefault, manifestDocName);

        return manifestDefault;
    }

    /**
     * Create a simple entity called 'TestSource' with a single attribute
     */
    function createEntityTestSource(corpus: CdmCorpusDefinition, manifestDefault: CdmManifestDefinition, localRoot: CdmFolderDefinition): CdmEntityDefinition {
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
});
