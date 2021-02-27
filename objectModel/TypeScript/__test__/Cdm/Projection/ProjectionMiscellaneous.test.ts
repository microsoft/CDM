// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CardinalitySettings,
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmProjection,
    CdmPurposeReference,
    cdmStatusLevel,
    CdmTypeAttributeDefinition,
    StringUtils
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * Various projections scenarios, partner scenarios, bug fixes
 */
describe('Cdm/Projection/ProjectionMiscellaneousTest', () => {
    const resOptsCombinations: Set<string>[] = [
        new Set([]),
        new Set(['referenceOnly']),
        new Set(['normalized']),
        new Set(['structured']),
        new Set(['referenceOnly', 'normalized']),
        new Set(['referenceOnly', 'structured']),
        new Set(['normalized', 'structured']),
        new Set(['referenceOnly', 'normalized', 'structured'])
    ];

    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestProjectionMiscellaneous';

    /**
     * Test case scenario for Bug #24 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/24
     */
    it('TestInvalidOperationType', async () => {
        const testName: string = 'TestInvalidOperationType';

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (!StringUtils.equalsWithIgnoreCase('ProjectionPersistence | Invalid operation type \'replaceAsForeignKey11111\'. | FromData', message)) {
                fail(message);
            }
        }, cdmStatusLevel.warning);

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('default.manifest.cdm.json');

        // Raise error: 'ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | FromData',
        // when attempting to load a projection with an invalid operation
        const entityName: string = 'SalesNestedFK';
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entity)
            .toBeTruthy();
    });

    /**
     * Test case scenario for Bug #23 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/23
     */
    it('TestZeroMinimumCardinality', async () => {
        const testName: string = 'TestZeroMinimumCardinality';

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            fail(message);
        }, cdmStatusLevel.warning);

        // Create Local Root Folder
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create Manifest
        const manifest: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'default');
        localRoot.documents.push(manifest, 'default.manifest.cdm.json');

        const entityName: string = 'TestEntity';

        // Create Entity
        const entity: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);
        entity.extendsEntity = corpus.MakeRef<CdmEntityReference>(cdmObjectType.entityRef, 'CdmEntity', true);

        // Create Entity Document
        const document: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        document.definitions.push(entity);
        localRoot.documents.push(document, document.getName());
        manifest.entities.push(entity);

        const attributeName: string = 'testAttribute';
        const attributeDataType: string = 'string';
        const attributePurpose: string = 'hasA';

        // Create Type Attribute
        const attribute: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName, false);
        attribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, attributeDataType, true);
        attribute.purpose = corpus.MakeRef<CdmPurposeReference>(cdmObjectType.purposeRef, attributePurpose, true);
        attribute.displayName = attributeName;

        if (entity) {
            entity.attributes.push(attribute);
        }

        attribute.cardinality = new CardinalitySettings(attribute);
        attribute.cardinality.minimum = '0';
        attribute.cardinality.maximum = '*';

        expect(attribute.isNullable)
            .toBeTruthy();
    });

    /**
     * Tests if it resolves correct when there are two entity attributes in circular denpendency using projection
     */
    it('TestCircularEntityAttributes', async (done) => {
        const testName: string = 'TestCircularEntityAttributes';
        const entityName: string = 'A';

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`${entityName}.cdm.json/${entityName}`);

        const resEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`resolved-${entityName}`);

        expect(resEntity)
            .toBeDefined();
        expect(resEntity.attributes.length)
            .toEqual(2);
        done();
    });

    /**
     * Tests if not setting the projection 'source' on an entity attribute triggers an error log
     */
    it('TestEntityAttributeSource', () =>  {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        let errorCount: number = 0;
        corpus.setEventCallback((level, message) => {
            errorCount++;
        }, cdmStatusLevel.error);
        const projection: CdmProjection = new CdmProjection(corpus.ctx);
        const entityAttribute: CdmEntityAttributeDefinition = new CdmEntityAttributeDefinition(corpus.ctx, 'attribute');
        entityAttribute.entity = new CdmEntityReference(corpus.ctx, projection, false)

        // First case, a projection without source.
        projection.validate();
        expect(errorCount)
            .toEqual(1);
        errorCount = 0;

        // Second case, a projection with a nested projection.
        const innerProjection: CdmProjection = new CdmProjection(corpus.ctx);
        projection.source = new CdmEntityReference(corpus.ctx, innerProjection, false);
        projection.validate();
        innerProjection.validate();
        expect(errorCount)
            .toEqual(1);
        errorCount = 0;

        // Third case, a projection with an explicit entity definition.
        innerProjection.source = new CdmEntityReference(corpus.ctx, new CdmEntityDefinition(corpus.ctx, 'Entity'), false);
        projection.validate();
        innerProjection.validate();
        expect(errorCount)
            .toEqual(0);

        // Third case, a projection with a named reference.
        innerProjection.source = new CdmEntityReference(corpus.ctx, 'Entity', false);
        projection.validate();
        innerProjection.validate();
        expect(errorCount)
            .toEqual(0);
    });

    /**
     * Tests if setting the projection 'source' on a type attribute triggers an error log
     */
    it('TestTypeAttributeSource', () =>  {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        let errorCount: number = 0;
        corpus.setEventCallback((level, message) => {
            errorCount++;
        }, cdmStatusLevel.error);
        const projection: CdmProjection = new CdmProjection(corpus.ctx);
        const typeAttribute: CdmTypeAttributeDefinition = new CdmTypeAttributeDefinition(corpus.ctx, 'attribute');
        typeAttribute.projection = projection;

        // First case, a projection without source.
        projection.validate();
        expect(errorCount)
            .toEqual(0);

        // Second case, a projection with a nested projection.
        const innerProjection: CdmProjection = new CdmProjection(corpus.ctx);
        projection.source = new CdmEntityReference(corpus.ctx, innerProjection, false);
        projection.validate();
        innerProjection.validate();
        expect(errorCount)
            .toEqual(0);

        // Third case, a projection with an explicit entity definition.
        innerProjection.source = new CdmEntityReference(corpus.ctx, new CdmEntityDefinition(corpus.ctx, 'Entity'), false);
        projection.validate();
        innerProjection.validate();
        expect(errorCount)
            .toEqual(1);
        errorCount = 0;

        // Third case, a projection with a named reference.
        innerProjection.source = new CdmEntityReference(corpus.ctx, 'Entity', false);
        projection.validate();
        innerProjection.validate();
        expect(errorCount)
            .toEqual(1);
    });

    /**
     * Tests setting the 'runSequentially' flag to true
     */
    it('testRunSequentially', async () => {
        const testName: string = 'TestRunSequentially';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Rename attributes 'age' to 'yearsOld' then 'phoneNumber' to 'contactNumber' followed by a add count attribute.
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('yearsOld');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('contactNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('countAttribute');
    });

    /**
     * Tests setting the 'runSequentially' flag to true mixed with 'sourceInput' set to true
     */
    it('testRunSequentiallyAndSourceInput', async () => {
        const testName: string = 'TestRunSequentiallyAndSourceInput';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Replace 'age' with 'ageFK' and 'address' with 'addressFK' as foreign keys, followed by a add count attribute.
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('ageFK');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('addressFK');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('countAttribute');
    });
});
