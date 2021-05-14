// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    cdmObjectType,
    CdmOperationArrayExpansion,
    CdmOperationRenameAttributes,
    CdmProjection,
    cdmStatusLevel,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * A test class for testing the ArrayExpansion operation in a projection as well as Expansion in a resolution guidance
 */
describe('Cdm/Projection/ProjectionExpansionTest', () => {
    /**
     * All possible combinations of the different resolution directives
     */
    const resOptsCombinations: string[][] = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured']
    ];

    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestProjectionExpansion';

    /**
     * Test for creating a projection with an ArrayExpansion operation on an entity attribute using the object model
     */
    it('TestEntityAttributeProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestEntityAttributeProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityAttributeProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an ArrayExpansion operation
        const arrayExpansionOp: CdmOperationArrayExpansion = corpus.MakeObject<CdmOperationArrayExpansion>(cdmObjectType.operationArrayExpansionDef);
        arrayExpansionOp.startOrdinal = 1;
        arrayExpansionOp.endOrdinal = 2;
        projection.operations.push(arrayExpansionOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        const projection2: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection2.source = projectionEntityRef;

        // Create a RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{m}{o}';
        projection2.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef2: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef2.explicitReference = projection2;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef2;
        entity.attributes.push(entityAttribute);

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(8);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('id2');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('value2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('date2');
    });

    /**
     * Test for creating a projection with an ArrayExpansion operation on an entity definition using the object model
     */
    it('TestEntityProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestEntityProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an ArrayExpansion operation
        const arrayExpansionOp: CdmOperationArrayExpansion = corpus.MakeObject<CdmOperationArrayExpansion>(cdmObjectType.operationArrayExpansionDef);
        arrayExpansionOp.startOrdinal = 1;
        arrayExpansionOp.endOrdinal = 2;
        projection.operations.push(arrayExpansionOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        const projection2: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection2.source = projectionEntityRef;

        // Create a RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{m}{o}';
        projection2.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef2: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef2.explicitReference = projection2;

        // Set the entity's ExtendEntity to be the projection
        entity.extendsEntity = projectionEntityRef2;

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(8);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('id2');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('value2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('date2');
    });

    /**
     * Test for creating a projection with an ArrayExpansion operation and a condition using the object model
     */
    it('TestConditionalProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestConditionalProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestConditionalProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);
        projection.condition = 'referenceOnly==true';

        // Create an ArrayExpansion operation
        const arrayExpansionOp: CdmOperationArrayExpansion = corpus.MakeObject<CdmOperationArrayExpansion>(cdmObjectType.operationArrayExpansionDef);
        arrayExpansionOp.startOrdinal = 1;
        arrayExpansionOp.endOrdinal = 2;
        projection.operations.push(arrayExpansionOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
        const projection2: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection2.source = projectionEntityRef;

        // Create a RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{m}{o}';
        projection2.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef2: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef2.explicitReference = projection2;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef2;
        entity.attributes.push(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive
        const resOpt: resolveOptions = new resolveOptions(entity.inDocument);
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly']));

        // Resolve the entity with 'referenceOnly'
        const resolvedEntityWithReferenceOnly: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        expect(resolvedEntityWithReferenceOnly.attributes.length)
            .toEqual(8);
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id1');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value1');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date1');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('id2');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('value2');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('date2');

        // Now resolve the entity with the default directives
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([]));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the projections
        // Original set of attributes: ["id", "name", "value", "date"]
        // Expand 1...2, renameFormat = {m}{o}
        expect(resolvedEntityWithStructured.attributes.length)
            .toEqual(4);
        expect((resolvedEntityWithStructured.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((resolvedEntityWithStructured.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntityWithStructured.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((resolvedEntityWithStructured.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
    });

    /**
     * Expansion on an entity attribute
     */
    it('TestExpansion', async () => {
        const testName: string = 'TestExpansion';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(10);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('count');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('age3');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
    });

    /**
     * ArrayExpansion on an entity attribute
     */
    it('TestEntityAttribute', async () => {
        const testName: string = 'TestEntityAttribute';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(9);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('age3');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
    });

    /**
     * ArrayExpansion on an entity attribute without a RenameAttributes
     */
    it('TestProjNoRename', async () => {
        const testName: string = 'TestProjNoRename';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3
        // Since there's no rename, the expanded attributes just get merged together
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
    });

    /**
     * Expansion on an entity definition
     * NOTE: This is not supported in resolution guidance
     */
    it('TestExtendsEntity', async () => {
        const testName: string = 'TestExtendsEntity';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        // ExtendsEntityResolutionGuidance doesn't support doing expansions, so we only get "count" here
        expect(resolvedEntity.attributes.length)
            .toEqual(1);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('count');
    });

    /**
     * ArrayExpansion on an entity definition
     */
    it('TestExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(9);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('age3');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
    });

    /**
     * Nested projections with ArrayExpansion
     */
    it('TestNestedProj', async () => {
        const testName: string = 'TestNestedProj';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3 and then 1...2, renameFormat = {m}_{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(18);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name_1_1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age_1_1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address_1_1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('name_2_1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('age_2_1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('address_2_1');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('name_3_1');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('age_3_1');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('address_3_1');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('name_1_2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('age_1_2');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('address_1_2');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('name_2_2');
        expect((resolvedEntity.attributes.allItems[13] as CdmTypeAttributeDefinition).name)
            .toEqual('age_2_2');
        expect((resolvedEntity.attributes.allItems[14] as CdmTypeAttributeDefinition).name)
            .toEqual('address_2_2');
        expect((resolvedEntity.attributes.allItems[15] as CdmTypeAttributeDefinition).name)
            .toEqual('name_3_2');
        expect((resolvedEntity.attributes.allItems[16] as CdmTypeAttributeDefinition).name)
            .toEqual('age_3_2');
        expect((resolvedEntity.attributes.allItems[17] as CdmTypeAttributeDefinition).name)
            .toEqual('address_3_2');
    });

    /**
     * Start and end ordinals of -2...2
     */
    it('TestNegativeStartOrdinal', async () => {
        const testName: string = 'TestNegativeStartOrdinal';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand -2...2, renameFormat = {m}{o}
        // Since we don't allow negative ordinals, output should be 0...2
        expect(resolvedEntity.attributes.length)
            .toEqual(9);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name0');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age0');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address0');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
    });

    /**
     * Start ordinal greater than end ordinal
     */
    it('TestStartGTEndOrdinal', async () => {
        const testName: string = 'TestStartGTEndOrdinal';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        // A warning should be logged when startOrdinal > endOrdinal
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('startOrdinal 2 should not be greater than endOrdinal 0') === -1) {
                fail(`Some unexpected failure - ${message}!`);
            }
        }, cdmStatusLevel.warning);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 2...0, renameFormat = {m}{o}
        // No array expansion happens here so the input just passes through
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
    });

    /**
     * Same start and end ordinals
     */
    it('TestSameStartEndOrdinals', async () => {
        const testName: string = 'TestSameStartEndOrdinals';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...1, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
    });

    /**
     * Combine ArrayExpansion, RenameAttributes, and IncludeAttributes in a single projection
     */
    it('TestCombineOps', async () => {
        const testName: string = 'TestCombineOps';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}, include [name, age1]
        expect(resolvedEntity.attributes.length)
            .toEqual(4);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
    });

    /**
     * Expansion on a polymorphic source
     */
    it('TestPolymorphic', async () => {
        const testName: string = 'TestPolymorphic';
        const entityName: string = 'BusinessPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
        // Expand 1...2, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(11);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('count');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('emailId1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneId1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('number1');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('emailId2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneId2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('number2');
    });

    /**
     * ArrayExpansion on a polymorphic source
     */
    it('TestPolymorphicProj', async () => {
        const testName: string = 'TestPolymorphicProj';
        const entityName: string = 'BusinessPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            if (resOpt.includes('structured')) {
                // Array expansion is not supported on an attribute group yet.
                continue;
            }
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
        // Expand 1...2, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(10);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('emailId1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneId1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('number1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('emailId2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneId2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('number2');
    });

    /**
     * Expansion on an array source
     * NOTE: This is not supported in resolution guidance due to ordinals from a previous resolution guidance
     * not being removed for the next resolution guidance, resulting in ordinals being skipped over in the new
     * resolution guidance as it thinks it has already done that round
     */
    it('TestArraySource', async () => {
        const testName: string = 'TestArraySource';
        const entityName: string = 'FriendGroup';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
        // Expand 1...2, renameFormat = {m}_{o}
        // Since resolution guidance doesn't support doing an expansion on an array source, we end up with the
        // following result where it skips expanding attributes with the same ordinal (ex. name1_1, name2_2)
        expect(resolvedEntity.attributes.length)
            .toEqual(9);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('count_');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount_1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('name2_1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('age2_1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('address2_1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount_2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('name1_2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('age1_2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('address1_2');
    });

    /**
     * ArrayExpansion on an array source
     */
    it('TestArraySourceProj', async () => {
        const testName: string = 'TestArraySourceProj';
        const entityName: string = 'FriendGroup';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
        // Expand 1...2, renameFormat = {m}_{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(14);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount_1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1_1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('age1_1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('address1_1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('name2_1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('age2_1');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('address2_1');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount_2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('name1_2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('age1_2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('address1_2');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('name2_2');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('age2_2');
        expect((resolvedEntity.attributes.allItems[13] as CdmTypeAttributeDefinition).name)
            .toEqual('address2_2');
    });

    /**
     * Expansion on an entity with an attribute group
     */
    it('TestGroup', async () => {
        const testName: string = 'TestGroup';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(10);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('count');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('age3');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
    });

    /**
     * ArrayExpansion on an entity with an attribute group
     */
    it('TestGroupProj', async () => {
        const testName: string = 'TestGroupProj';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(9);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('age3');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
    });

    /**
     * ArrayExpansion with a condition
     */
    it('TestConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        // No array expansion, condition was false
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
    });
});
