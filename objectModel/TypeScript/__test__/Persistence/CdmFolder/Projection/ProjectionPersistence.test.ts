// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmOperationCollection,
    cdmOperationType,
    CdmProjection,
    CdmTypeAttributeDefinition
} from '../../../../internal';
import { PersistenceLayer } from '../../../../Persistence';
import { Entity } from '../../../../Persistence/CdmFolder/types';
import { testHelper } from '../../../testHelper';

describe('Persistence/CdmFolder/Projection', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Persistence/CdmFolder/Projection';

    /**
     * Basic test to load persisted Projection based entities
     */
    it('TestLoadProjection', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadProjection');

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const expected: string = 'TestSource';
        let actual: string;
        let actualType: cdmObjectType = cdmObjectType.error;

        // TestEntityStringReference.cdm.json
        const entTestEntityStringReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityStringReference.cdm.json/TestEntityStringReference', manifest);
        expect(entTestEntityStringReference)
            .toBeTruthy();
        actual = (entTestEntityStringReference.extendsEntity as CdmEntityReference).namedReference;
        actualType = entTestEntityStringReference.extendsEntity.objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.entityRef);

        // TestEntityEntityReference.cdm.json
        const entTestEntityEntityReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityEntityReference.cdm.json/TestEntityEntityReference', manifest);
        expect(entTestEntityEntityReference)
            .toBeTruthy();
        actual = (entTestEntityEntityReference.extendsEntity as CdmEntityReference).namedReference;
        actualType = entTestEntityEntityReference.extendsEntity.objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.entityRef);

        // TestEntityProjection.cdm.json
        const entTestEntityProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityProjection.cdm.json/TestEntityProjection', manifest);
        expect(entTestEntityProjection)
            .toBeTruthy();
        actual = ((entTestEntityProjection.extendsEntity.explicitReference as CdmProjection).source as CdmEntityReference).namedReference;
        actualType = (entTestEntityProjection.extendsEntity.explicitReference as CdmProjection).objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.projectionDef);

        // TestEntityNestedProjection.cdm.json
        const entTestEntityNestedProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityNestedProjection.cdm.json/TestEntityNestedProjection', manifest);
        expect(entTestEntityNestedProjection)
            .toBeTruthy();
        actual = (((entTestEntityNestedProjection.extendsEntity.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.namedReference;
        actualType = (((entTestEntityNestedProjection.extendsEntity.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.explicitReference).objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.projectionDef);

        // TestEntityAttributeStringReference.cdm.json
        const entTestEntityAttributeStringReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityAttributeStringReference.cdm.json/TestEntityAttributeStringReference', manifest);
        expect(entTestEntityAttributeStringReference)
            .toBeTruthy();
        actual = ((entTestEntityAttributeStringReference.attributes.allItems[0] as CdmEntityAttributeDefinition).entity as CdmEntityReference).namedReference;
        actualType = (entTestEntityAttributeStringReference.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.entityRef);

        // TestEntityAttributeEntityReference.cdm.json
        const entTestEntityAttributeEntityReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityAttributeEntityReference.cdm.json/TestEntityAttributeEntityReference', manifest);
        expect(entTestEntityAttributeEntityReference)
            .toBeTruthy();
        actual = ((entTestEntityAttributeEntityReference.attributes.allItems[0] as CdmEntityAttributeDefinition).entity as CdmEntityReference).namedReference;
        actualType = (entTestEntityAttributeEntityReference.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.entityRef);

        // TestEntityAttributeProjection.cdm.json
        const entTestEntityAttributeProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityAttributeProjection.cdm.json/TestEntityAttributeProjection', manifest);
        expect(entTestEntityAttributeProjection)
            .toBeTruthy();
        actual = (((entTestEntityAttributeProjection.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.explicitReference as CdmProjection).source as CdmEntityReference).namedReference;
        actualType = ((entTestEntityAttributeProjection.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.explicitReference as CdmProjection).objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.projectionDef);

        // TestEntityAttributeNestedProjection.cdm.json
        const entTestEntityAttributeNestedProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityAttributeNestedProjection.cdm.json/TestEntityAttributeNestedProjection', manifest);
        expect(entTestEntityAttributeNestedProjection)
            .toBeTruthy();
        actual = ((((entTestEntityAttributeNestedProjection.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.namedReference;
        actualType = (((entTestEntityAttributeNestedProjection.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.explicitReference as CdmProjection).source.explicitReference as CdmProjection).source.explicitReference.objectType;
        expect(actual)
            .toEqual(expected);
        expect(actualType)
            .toEqual(cdmObjectType.projectionDef);

        // TestOperationCollection.cdm.json
        const entTestOperationCollection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestOperationCollection.cdm.json/TestOperationCollection', manifest);
        expect(entTestOperationCollection)
            .toBeTruthy();
        const actualOperationCount: number = (entTestOperationCollection.extendsEntity.explicitReference as CdmProjection).operations.length;
        expect(actualOperationCount)
            .toEqual(9);
        const operations: CdmOperationCollection = (entTestOperationCollection.extendsEntity.explicitReference as CdmProjection).operations;
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

        // TestEntityTrait.cdm.json
        const entTestEntityTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityTrait.cdm.json/TestEntityTrait', manifest);
        expect(entTestEntityTrait)
            .toBeTruthy();
        expect((entTestEntityTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestAttribute');
        expect((entTestEntityTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).dataType.namedReference)
            .toEqual('testDataType');

        // TestEntityExtendsTrait.cdm.json
        const entTestEntityExtendsTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestEntityExtendsTrait.cdm.json/TestEntityExtendsTrait', manifest);
        expect(entTestEntityExtendsTrait)
            .toBeTruthy();
        expect((entTestEntityExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestExtendsTraitAttribute');
        expect((entTestEntityExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).dataType.namedReference)
            .toEqual('testDerivedDataType');

        // TestProjectionTrait.cdm.json
        const entTestProjectionTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestProjectionTrait.cdm.json/TestProjectionTrait', manifest);
        expect(entTestProjectionTrait)
            .toBeTruthy();
        expect((entTestProjectionTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttribute');
        expect((entTestProjectionTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).dataType.namedReference)
            .toEqual('testDataType');

        // TestProjectionExtendsTrait.cdm.json
        const entTestProjectionExtendsTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TestProjectionExtendsTrait.cdm.json/TestProjectionExtendsTrait', manifest);
        expect(entTestProjectionExtendsTrait)
            .toBeTruthy();
        expect((entTestProjectionExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttributeB');
        expect((entTestProjectionExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).dataType.namedReference)
            .toEqual('testExtendsDataTypeB');
    });

    /**
     * Basic test to save persisted Projections based entities
     */
    it('TestSaveProjection', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestSaveProjection');

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entitySales: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Sales.cdm.json/Sales', manifest);
        expect(entitySales)
            .toBeTruthy();

        const actualRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder("output");
        expect(actualRoot)
            .toBeTruthy();

        actualRoot.documents.push(entitySales.inDocument, 'Persisted_Sales.cdm.json');
        await actualRoot.documents.allItems[0].saveAsAsync('output:/Persisted_Sales.cdm.json');

        const entityActual: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('output:/Persisted_Sales.cdm.json/Sales', manifest);
        expect(entityActual)
            .toBeTruthy();

        const entityContentActual: Entity = PersistenceLayer.toData<CdmEntityDefinition, Entity>(entityActual, undefined, undefined, "CdmFolder");
        expect(entityContentActual)
            .toBeTruthy();
        expect(entityContentActual.hasAttributes)
            .toBeTruthy();
        expect(entityContentActual.hasAttributes.length === 1)
            .toBeTruthy();

        expect(JSON.stringify(entityContentActual.hasAttributes[0]).indexOf('"entityReference"'))
            .toBe(-1);
    });
});
