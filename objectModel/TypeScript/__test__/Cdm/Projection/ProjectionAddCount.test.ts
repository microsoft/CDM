// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    cdmObjectType,
    CdmOperationAddCountAttribute,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * A test class for testing the AddCountAttribute operation in a projection as well as CountAttribute in a resolution guidance
 */
describe('Cdm/Projection/ProjectionAddCountTest', () => {
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
    const testsSubpath: string = 'Cdm/Projection/TestProjectionAddCount';

    /**
     * Test for creating a projection with an AddCountAttribute operation on an entity attribute using the object model
     */
    it('TestEntityAttributeProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEntityAttributeProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityAttributeProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddCountAttribute operation
        const addCountAttrOp: CdmOperationAddCountAttribute = corpus.MakeObject<CdmOperationAddCountAttribute>(cdmObjectType.operationAddCountAttributeDef);
        addCountAttrOp.countAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'testCount');
        addCountAttrOp.countAttribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'integer', true);
        projection.operations.push(addCountAttrOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Count attribute: "testCount"
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('testCount');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * Test for creating a projection with an AddCountAttribute operation on an entity definition using the object model
     */
    it('TestEntityProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEntityProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddCountAttribute operation
        const addCountAttrOp: CdmOperationAddCountAttribute = corpus.MakeObject<CdmOperationAddCountAttribute>(cdmObjectType.operationAddCountAttributeDef);
        addCountAttrOp.countAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'testCount');
        addCountAttrOp.countAttribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'integer', true);
        projection.operations.push(addCountAttrOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Set the entity's ExtendEntity to be the projection
        entity.extendsEntity = projectionEntityRef;

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Count attribute: "testCount"
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('testCount');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * Test for creating a projection with an AddCountAttribute operation and a condition using the object model
     */
    it('TestConditionalProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestConditionalProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestConditionalProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);
        projection.condition = 'referenceOnly==true';

        // Create an AddCountAttribute operation
        const addCountAttrOp: CdmOperationAddCountAttribute = corpus.MakeObject<CdmOperationAddCountAttribute>(cdmObjectType.operationAddCountAttributeDef);
        addCountAttrOp.countAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'testCount');
        addCountAttrOp.countAttribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'integer', true);
        projection.operations.push(addCountAttrOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive
        const resOpt: resolveOptions = new resolveOptions(entity.inDocument);
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly']));

        // Resolve the entity with 'referenceOnly'
        const resolvedEntityWithReferenceOnly: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Count attribute: "testCount"
        expect(resolvedEntityWithReferenceOnly.attributes.length)
            .toEqual(5);
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('testCount');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[4] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');

        // Now resolve the entity with the 'structured' directive
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['structured']));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the AddCountAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // No Count attribute added, condition was false
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
     * AddCountAttribute on an entity attribute
     */
    it('TestAddCountAttribute', async () => {
        const testName: string = 'TestAddCountAttribute';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * AddCountAttribute on an entity attribute
     */
    it('TestAddCountAttribute', async () => {
        const testName: string = 'TestAddCountAttribute';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * CountAttribute on an entity attribute
     */
    it('TestCountAttribute', async () => {
        const testName: string = 'TestCountAttribute';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('email1');
    });

    /**
     * AddCountAttribute on an entity definition
     */
    it('TestExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * CountAttribute on an entity definition
     */
    it('TestExtendsEntity', async () => {
        const testName: string = 'TestExtendsEntity';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        // ExtendsEntityResolutionGuidance doesn't support doing expansions, so we only get the Count attribute
        expect(resolvedEntity.attributes.length)
            .toEqual(1);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * Nested projections with ArrayExpansion, then AddCountAttribute, and then RenameAttributes
     */
    it('TestWithNestedArrayExpansion', async () => {
        const testName: string = 'TestWithNestedArrayExpansion';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "personCount", expand 1...2, renameFormat = {m}{o}
        expect(resolvedEntity.attributes.length)
            .toEqual(11);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('email2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * AddCountAttribute with ArrayExpansion in the same projection (and then RenameAttributes)
     */
    it('TestWithArrayExpansion', async () => {
        const testName: string = 'TestWithArrayExpansion';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Expand 1...2, count attribute: "personCount" (first projection)
        // The first projection will give us the expanded attributes as well as the pass-through input attributes
        // Then do renameFormat = {m}{o} in the second projection
        expect(resolvedEntity.attributes.length)
            .toEqual(16);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('age2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('email2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[13] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[14] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[15] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount');
        expect((resolvedEntity.attributes.allItems[15] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * AddCountAttribute with other operations in the same projection
     */
    it('TestCombineOps', async () => {
        const testName: string = 'TestCombineOps';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount", count attribute: "anotherCount", rename "name" to "firstName"
        expect(resolvedEntity.attributes.length)
            .toEqual(8);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('anotherCount');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('firstName');
    });

    /**
     * Nested projections with AddCountAttribute and other operations
     */
    it('TestCombineOpsNestedProj', async () => {
        const testName: string = 'TestCombineOpsNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount", renameFormat = new_{m}, include ["new_name", "age", "new_someCount"]
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('new_name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('new_age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('new_someCount');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * AddCountAttribute with a condition
     */
    it('TestConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // Condition is false, so no Count attribute added
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * AddCountAttribute on an entity with an attribute group
     */
    it('TestGroupProj', async () => {
        const testName: string = 'TestGroupProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });

    /**
     * CountAttribute on an entity with an attribute group
     */
    it('TestGroup', async () => {
        const testName: string = 'TestGroup';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount"
        // For resolution guidance, CountAttribute has to be used with Expansion so we do an Expansion of 1...1 here
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('age1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('email1');
    });

    /**
     * Two AddCountAttribute operations in a single projection using the same Count attribute
     */
    it('TestDuplicate', async () => {
        const testName: string = 'TestDuplicate';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Count attribute: "someCount", count attribute: "someCount"
        // "someCount" should get merged into one
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('someCount');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).appliedTraits.allItems[1].namedReference)
            .toEqual('is.linkedEntity.array.count');
    });
});
