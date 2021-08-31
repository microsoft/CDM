// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmAttributeGroupDefinition, CdmCorpusDefinition, CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    cdmObjectType,
    CdmOperationAddAttributeGroup,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 *  Class to handle AddAttributeGroup operations
 */
describe('Cdm/Projection/ProjectionAddAttributeGroupTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionAddAttributeGroupTest';

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
     * Test AddAttributeGroup operation nested with ExcludeAttributes
     */
    it('testCombineOpsNestedProj', async () => {
        const testName: string = 'TestCombineOpsNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Exclude attributes: ['age', 'phoneNumber']
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'PersonAttributeGroup');
        expect(attGroupDefinition.members.length)
            .toEqual(3);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * Test AddAttributeGroup and IncludeAttributes operations in the same projection
     */
    it('testCombineOpsProj', async () => {
        const testName: string = 'TestCombineOpsProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Included attributes: ['age', 'phoneNumber']
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'PersonAttributeGroup', 3);
        expect(attGroupDefinition.members.length)
            .toEqual(5);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroupDefinition.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroupDefinition.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');

        // Check the attributes coming from the IncludeAttribute operation
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
    });

    /**
     * Test AddAttributeGroup operation with a 'structured' condition
     */
    it('testConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'referenceOnly' ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // condition not met, keep attributes in flat list
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

        const resolvedEntity2: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // condition met, put all attributes in an attribute group
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity2.attributes, 'PersonAttributeGroup');
        expect(attGroupDefinition.members.length)
            .toEqual(5);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroupDefinition.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroupDefinition.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * Test for creating a projection with an AddAttributeGroup operation and a condition using the object model
     */
    it('testConditionalProjUsingObjectModel', async () => {
        const testName: string = 'TestConditionalProjUsingObjectModel';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity.
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);
        projection.condition = 'structured==true';

        // Create an AddAttributeGroup operation
        const addAttGroupOp:CdmOperationAddAttributeGroup = corpus.MakeObject<CdmOperationAddAttributeGroup>(cdmObjectType.operationAddAttributeGroupDef);
        addAttGroupOp.attributeGroupName = 'PersonAttributeGroup';
        projection.operations.push(addAttGroupOp);

        // Create an entity reference to hold this projection.
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity.
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive.
        const resOpt = new resolveOptions(entity.inDocument)
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'referenceOnly' ]));

        // Resolve the entity with 'referenceOnly'
        const resolvedEntityWithReferenceOnly: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // condition not met, keep attributes in flat list
        expect(resolvedEntityWithReferenceOnly.attributes.length)
            .toEqual(4);
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');

        // Now resolve the entity with the 'structured' directive
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'structured' ]));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // condition met, put all attributes in an attribute group
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntityWithStructured.attributes, 'PersonAttributeGroup');
        expect(attGroupDefinition.members.length)
            .toEqual(4);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((attGroupDefinition.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
    });

    /**
     * Test resolving an entity attribute using resolution guidance
     */
    it('testEntityAttribute', async () => {
        const testName: string = 'TestEntityAttribute';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'PersonInfo');
        expect(attGroupDefinition.members.length)
            .toEqual(5);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroupDefinition.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroupDefinition.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * Test for creating a projection with an AddAttributeGroup operation on an entity attribute using the object model  
     */
    it('testEntityAttributeProjUsingObjectModel', async () => {
        const testName: string = 'TestEntityAttributeProjUsingObjectModel';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddAttributeGroup operation
        const addAttGroupOp: CdmOperationAddAttributeGroup = corpus.MakeObject<CdmOperationAddAttributeGroup>(cdmObjectType.operationAddAttributeGroupDef);
        addAttGroupOp.attributeGroupName = 'PersonAttributeGroup';
        projection.operations.push(addAttGroupOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Resolve the entity.
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, null, localRoot);

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'PersonAttributeGroup');
        expect(attGroupDefinition.members.length)
            .toEqual(4);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((attGroupDefinition.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
    });

    /**
     * Test for creating a projection with an AddAttributeGroup operation on an entity definition using the object model
     */
    it('testEntityProjUsingObjectModel', async () => {
        const testName: string = 'TestEntityProjUsingObjectModel';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an AddAttributeGroup operation
        const addAttGroupOp: CdmOperationAddAttributeGroup = corpus.MakeObject<CdmOperationAddAttributeGroup>(cdmObjectType.operationAddAttributeGroupDef);
        addAttGroupOp.attributeGroupName = 'PersonAttributeGroup';
        projection.operations.push(addAttGroupOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Set the entity's ExtendEntity to be the projection
        entity.extendsEntity = projectionEntityRef;

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, null, localRoot);

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'PersonAttributeGroup');
        expect(attGroupDefinition.members.length)
            .toEqual(4);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((attGroupDefinition.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
    });

    /**
     * Test AddAttributeGroup operation on an entity definition
     */
    it('testExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'Child';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'ChildAttributeGroup');
        expect(attGroupDefinition.members.length)
            .toEqual(5);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroupDefinition.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroupDefinition.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroupDefinition.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * Multiple AddAttributeGroup operations on the same projection 
     */
    it('testMultipleOpProj', async () => {
        const testName: string = 'TestMultipleOpProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // This will result in two attribute groups with the same set of attributes being generated
        const attGroup1: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'PersonAttributeGroup', 2);
        expect(attGroup1.members.length)
            .toEqual(5);
        expect((attGroup1.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroup1.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroup1.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroup1.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroup1.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');

        const attGroup2: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'SecondAttributeGroup', 2, 1);
        expect(attGroup2.members.length)
            .toEqual(5);
        expect((attGroup2.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroup2.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroup2.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroup2.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroup2.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * Nested projections with AddAttributeGroup
     */
    it('testNestedProj', async () => {
        const testName: string = 'TestNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        const outerAttGroup: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'OuterAttributeGroup');
        const innerAttGroup: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(outerAttGroup.members, 'InnerAttributeGroup');

        expect(innerAttGroup.members.length)
            .toEqual(5);
        expect((innerAttGroup.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((innerAttGroup.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((innerAttGroup.members.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((innerAttGroup.members.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((innerAttGroup.members.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * Test resolving a type attribute with an add attribute group operation
     */
    it.skip('testTypeAttributeProj', async () => {
        const testName: string = 'TestTypeAttributeProj';
        const entityName: string = 'Person';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'referenceOnly' ]);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Add attribute group applied to "address"
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(resolvedEntity.attributes, 'AddressAttributeGroup', 5, 2);
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });
});
