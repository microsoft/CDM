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
    CdmOperationAddTypeAttribute,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * A test class for testing the AddTypeAttribute operation in a projection as well as TypeAttribute in a resolution guidance
 */
describe('Cdm/Projection/ProjectionAddTypeTest', () => {
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
    const testsSubpath: string = 'Cdm/Projection/TestProjectionAddType';

    /**
     * Test for creating a projection with an AddTypeAttribute operation on an entity attribute using the object model
     */
    it('TestEntityAttributeProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEntityAttributeProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityAttributeProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddTypeAttribute operation
        const addTypeAttrOp: CdmOperationAddTypeAttribute = corpus.MakeObject<CdmOperationAddTypeAttribute>(cdmObjectType.operationAddTypeAttributeDef);
        addTypeAttrOp.typeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'testType');
        addTypeAttrOp.typeAttribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'entityName', true);
        projection.operations.push(addTypeAttrOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Type attribute: "testType"
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
            .toEqual('testType');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * Test for creating a projection with an AddTypeAttribute operation on an entity definition using the object model
     */
    it('TestEntityProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEntityProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddTypeAttribute operation
        const addTypeAttrOp: CdmOperationAddTypeAttribute = corpus.MakeObject<CdmOperationAddTypeAttribute>(cdmObjectType.operationAddTypeAttributeDef);
        addTypeAttrOp.typeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'testType');
        addTypeAttrOp.typeAttribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'entityName', true);
        projection.operations.push(addTypeAttrOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionEntityRef.explicitReference = projection;

        // Set the entity's ExtendEntity to be the projection
        entity.extendsEntity = projectionEntityRef;

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, undefined, localRoot);

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Type attribute: "testType"
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
            .toEqual('testType');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * Test for creating a projection with an AddTypeAttribute operation and a condition using the object model
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

        // Create an AddTypeAttribute operation
        const addTypeAttrOp: CdmOperationAddTypeAttribute = corpus.MakeObject<CdmOperationAddTypeAttribute>(cdmObjectType.operationAddTypeAttributeDef);
        addTypeAttrOp.typeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'testType');
        addTypeAttrOp.typeAttribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'entityName', true);
        projection.operations.push(addTypeAttrOp);

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

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // Type attribute: "testType"
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
            .toEqual('testType');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[4] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();

        // Now resolve the entity with the 'structured' directive
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['structured']));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
        // Original set of attributes: ["id", "name", "value", "date"]
        // No Type attribute added, condition was false
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
     * AddTypeAttribute on an entity attribute
     */
    it('TestAddTypeAttributeProj', async () => {
        const testName: string = 'TestAddTypeAttributeProj';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType"
        expect(resolvedEntity.attributes.length)
            .toEqual(8);
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
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('socialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('someType');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * SelectedTypeAttribute on an entity attribute
     */
    it('TestSelectedTypeAttr', async () => {
        const testName: string = 'TestSelectedTypeAttr';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType"
        expect(resolvedEntity.attributes.length)
            .toEqual(8);
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
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('socialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('someType');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * AddTypeAttribute on an entity definition
     */
    it('TestExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType"
        expect(resolvedEntity.attributes.length)
            .toEqual(8);
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
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('socialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('someType');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * SelectedTypeAttribute on an entity definition
     */
    it('TestExtendsEntity', async () => {
        const testName: string = 'TestExtendsEntity';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType" (using extendsEntityResolutionGuidance)
        expect(resolvedEntity.attributes.length)
            .toEqual(8);
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
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('socialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('someType');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * AddTypeAttribute on an entity attribute (after a CombineAttributes)
     */
    it('TestAddTypeWithCombineProj', async () => {
        const testName: string = 'TestAddTypeWithCombineProj';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('number');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('contactId');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('contactType');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * AddTypeAttribute with other operations in the same projection
     */
    it('TestCombineOpsProj', async () => {
        const testName: string = 'TestCombineOpsProj';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Type attribute: "someType", rename "address" to "homeAddress"
        expect(resolvedEntity.attributes.length)
            .toEqual(9);
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
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('socialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('someType');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('homeAddress');
    });

    /**
     * Nested projections with AddTypeAttribute and other operations
     */
    it('TestCombineOpsNestedProj', async () => {
        const testName: string = 'TestCombineOpsNestedProj';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType",
        // rename ["contactId", "isPrimary"] as "new_{m}", include ["contactId", "new_isPrimary", "contactType"]
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('new_isPrimary');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('new_contactId');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('contactType');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();
    });

    /**
     * AddTypeAttribute with a condition
     */
    it('TestConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'Customer';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
        // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
        // Condition for projection containing AddTypeAttribute is false, so no Type attribute is created
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('number');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('contactId');
    });
});
