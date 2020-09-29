// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmCorpusDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    cdmObjectType,
    CdmOperationExcludeAttributes,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * A test class for testing the ExcludeAttributes operation in a projection as well as SelectsSomeAvoidNames in a resolution guidance
 */
describe('Cdm/Projection/ProjectionExcludeTest', () => {
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
    const testsSubpath: string = 'Cdm/Projection/TestProjectionExclude';

    /**
     * Test for creating a projection with an ExcludeAttributes operation on an entity attribute using the object model
     */
    it('TestEntityAttributeProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEntityAttributeProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityAttributeProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an ExcludeAttributes operation
        const excludeAttrsOp: CdmOperationExcludeAttributes = corpus.MakeObject<CdmOperationExcludeAttributes>(cdmObjectType.operationExcludeAttributesDef);
        excludeAttrsOp.excludeAttributes.push('id');
        excludeAttrsOp.excludeAttributes.push('date');
        projection.operations.push(excludeAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Excluded attributes: ['id', 'date']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
    });

    /**
     * Test for creating a projection with an ExcludeAttributes operation on an entity definition using the object model
     */
    it('TestEntityProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEntityProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an ExcludeAttributes operation
        const excludeAttrsOp: CdmOperationExcludeAttributes = corpus.MakeObject<CdmOperationExcludeAttributes>(cdmObjectType.operationExcludeAttributesDef);
        excludeAttrsOp.excludeAttributes.push('name');
        excludeAttrsOp.excludeAttributes.push('value');
        projection.operations.push(excludeAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Set the entity's ExtendEntity to be the projection
        entity.extendsEntity = projectionEntityRef;

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Excluded attributes: ['name', 'value']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
    });

    /**
     * Test for creating nested projections with ExcludeAttributes operations using the object model
     */
    it ('TestNestedProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestNestedProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestNestedProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an ExcludeAttributes operation
        const excludeAttrsOp: CdmOperationExcludeAttributes = corpus.MakeObject<CdmOperationExcludeAttributes>(cdmObjectType.operationExcludeAttributesDef);
        excludeAttrsOp.excludeAttributes.push('id');
        excludeAttrsOp.excludeAttributes.push('date');
        projection.operations.push(excludeAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create another projection that uses the previous projection as its source
        const projection2: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection2.source = projectionEntityRef;

        // Create an ExcludeAttributes operation
        const excludeAttrsOp2: CdmOperationExcludeAttributes = corpus.MakeObject<CdmOperationExcludeAttributes>(cdmObjectType.operationExcludeAttributesDef);
        excludeAttrsOp2.excludeAttributes.push('value');
        projection2.operations.push(excludeAttrsOp2);

        // Create an entity reference to hold this projection
        const projectionEntityRef2: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef2.explicitReference = projection2;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef2;
        entity.attributes.push(entityAttribute);

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the ExcludeAttributes operations
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Excluded attributes: ['id', 'date'], ['value']
        expect(resolvedEntity.attributes.length)
            .toEqual(1);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
    });

    /**
     * Test for creating a projection with an ExcludeAttributes operation and a condition using the object model
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

        // Create an ExcludeAttributes operation
        const excludeAttrsOp: CdmOperationExcludeAttributes = corpus.MakeObject<CdmOperationExcludeAttributes>(cdmObjectType.operationExcludeAttributesDef);
        excludeAttrsOp.excludeAttributes.push('id');
        excludeAttrsOp.excludeAttributes.push('date');
        projection.operations.push(excludeAttrsOp);

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

        // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Excluded attributes: ['id', 'date']
        expect(resolvedEntityWithReferenceOnly.attributes.length)
            .toEqual(2);
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('value');

        // Now resolve the entity with the 'structured' directive
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['structured']));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Excluded attributes: none, condition was false
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
     * ExcludeAttributes on an entity attribute
     */
    it('TestExcludeAttributes', async () => {
        const testName: string = 'TestExcludeAttributes';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
    });

    /**
     * SelectsSomeAvoidNames on an entity attribute
     */
    it('TestSSAN', async () => {
        const testName: string = 'TestSSAN';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        // Excluded attributes: ['PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfoName');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfoAge');
    });

    /**
     * SelectsSomeAvoidNames on an entity attribute that has renameFormat = "{m}"
     */
    it('TestSSANRename', async () => {
        const testName: string = 'TestSSANRename';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
    });

    /**
     * A nested ExcludeAttributes operation in a single projection
     */
    it('TestSingleNestedProj', async () => {
        const testName: string = 'TestSingleNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
    });

    /**
     * Nested projections with ExcludeAttributes
     */
    it('TestNestedProj', async () => {
        const testName: string = 'TestNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['address', 'phoneNumber', 'email'], ['age']
        expect(resolvedEntity.attributes.length)
            .toEqual(1);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
    });

    /**
     * Multiple ExcludeAttributes in a single projection
     */
    it('TestMultipleExclude', async () => {
        const testName: string = 'TestMultipleExclude';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['name', 'age', 'address'], ['address', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(4);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * ExcludeAttributes on an entity definition
     */
    it('TestExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'Child';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['phoneNumber', 'email']
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
     * SelectsSomeAvoidNames on an entity definition
     */
    it('TestExtendsEntity', async () => {
        const testName: string = 'TestExtendsEntity';
        const entityName: string = 'Child';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['phoneNumber', 'email']
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
     * ExcludeAttributes on a polymorphic source
     */
    it('TestPolymorphicProj', async () => {
        const testName: string = 'TestPolymorphicProj';
        const entityName: string = 'BusinessPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['emailId', 'address', 'isPrimary', 'phoneId', 'number', 'socialId', 'account']
        // Excluded attributes: ['socialId', 'account']
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('emailId');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneId');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('number');
    });

    /**
     * SelectsSomeAvoidNames on a polymorphic source
     */
    it('TestPolymorphic', async () => {
        const testName: string = 'TestPolymorphic';
        const entityName: string = 'BusinessPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['emailId', 'address', 'isPrimary', 'phoneId', 'number', 'socialId', 'account']
        // Excluded attributes: ['socialId', 'account']
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('emailId');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneId');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('number');
    });

    /**
     * ExcludeAttributes on an array source
     */
    it('TestArraySourceProj', async () => {
        const testName: string = 'TestArraySourceProj';
        const entityName: string = 'FriendGroup';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['personCount', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total)
        // Excluded attributes: ['age1', 'age2', 'age3']
        expect(resolvedEntity.attributes.length)
            .toEqual(13);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('email2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber3');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('email3');
    });

    /**
     * SelectsSomeAvoidNames on an array source
     */
    it('TestArraySource', async () => {
        const testName: string = 'TestArraySource';
        const entityName: string = 'FriendGroup';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['GroupOfPeoplePersonCount', 'GroupOfPeopleName1', 'GroupOfPeopleAge1', 'GroupOfPeopleAddress1',
        //                              'GroupOfPeoplePhoneNumber1', 'GroupOfPeopleEmail1', ..., 'GroupOfPeopleEmail3'] (16 total)
        // Excluded attributes: ['GroupOfPeopleAge1', 'GroupOfPeopleAge2', 'GroupOfPeopleAge3']
        expect(resolvedEntity.attributes.length)
            .toEqual(13);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeoplePersonCount');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleName1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleAddress1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeoplePhoneNumber1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleEmail1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleName2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleAddress2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeoplePhoneNumber2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleEmail2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleName3');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleAddress3');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeoplePhoneNumber3');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeopleEmail3');
    });

    /**
     * SelectsSomeAvoidNames on an array source that has renameFormat = '{m}'
     */
    it('TestArraySourceRename', async () => {
        const testName: string = 'TestArraySourceRename';
        const entityName: string = 'FriendGroup';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['personCount', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total)
        // Excluded attributes: ['age1', 'age2', 'age3']
        expect(resolvedEntity.attributes.length)
            .toEqual(13);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('email2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber3');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('email3');
    });

    /**
     * ExcludeAttributes with a condition
     */
    it('TestConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');

        const resolvedEntity2: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: none, condition was false
        expect(resolvedEntity2.attributes.length)
            .toEqual(5);
        expect((resolvedEntity2.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity2.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity2.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity2.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity2.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * ExcludeAttributes with an empty exclude attributes list
     */
    it('TestEmptyExclude', async () => {
        const testName: string = 'TestEmptyExclude';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: []
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
     * ExcludeAttributes on an entity with an attribute group
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

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
    });

    /**
     * SelectsSomeAvoidNames on an entity with an attribute group
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

        // Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        // Excluded attributes: ['PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfoName');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfoAge');
    });

    /**
     * SelectsSomeAvoidNames on an entity with an attribute group that has renameFormat = '{m}'
     */
    it('TestGroupRename', async () => {
        const testName: string = 'TestGroupRename';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Excluded attributes: ['address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
    });

    /**
     * ExcludeAttributes with an entity attribute name on an inline entity reference that contains entity attributes
     * This is testing that, for the case of the structured directive, we can filter using the name of an entity attribute
     * in the inline entity reference to exclude the entire entity attribute group
     */
    it('TestEANameProj', async () => {
        const testName: string = 'TestEANameProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['structured']);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email', 'title', 'company', 'tenure']
        // Excluded attributes: ['OccupationInfo'] (name of entity attribute that contains 'title', 'company', 'tenure')
        expect(resolvedEntity.attributes.length)
            .toEqual(1); // attribute group created because of structured directive
        const attGroup: CdmAttributeGroupDefinition = (resolvedEntity.attributes.allItems[0] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(attGroup.members.length)
            .toEqual(5);
        expect((attGroup.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroup.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroup.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroup.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroup.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });
});
