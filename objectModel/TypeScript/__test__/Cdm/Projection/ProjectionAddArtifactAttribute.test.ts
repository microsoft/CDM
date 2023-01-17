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
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions,
    cdmStatusLevel,
    CdmDataTypeReference
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { CdmOperationAddArtifactAttribute } from 'Cdm/Projections/CdmOperationAddArtifactAttribute';

/**
 *  Class to handle AlterTraits operations
 */
describe('Cdm/Projection/TestProjectionAddArtifactAttribute', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionAddArtifactAttributeTest';

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
     * Test AddArtifactAttribute to add an entity attribute on an entity attribute.
     */
    it('TestAddEntAttrOnEntAttrProj', async () => {
        const testName: string = 'TestAddEntAttrOnEntAttrProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an entity attribute yet.') === -1) {
                throw new Error(`Some unexpected failure - ${message}!`);
            }
        }, cdmStatusLevel.warning);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);
    });

    /**
     * Test AddArtifactAttribute to add an attribute group on an entity attribute.
     */
    it('TestAddAttrGrpOnEntAttrProj', async () => {
        const testName: string = 'TestAddAttrGrpOnEntAttrProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an attribute group yet.') === -1) {
                throw new Error(`Some unexpected failure - ${message}!`);
            }
        }, cdmStatusLevel.warning);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);
    });

    /**
     * Test AddArtifactAttribute to add a type attribute on a type attribute.
     */
    it('TestAddTypeAttrOnTypeAttrProj', async () => {
        const testName: string = 'TestAddTypeAttrOnTypeAttrProj';
        const entityName: string = 'Person';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        expect(resolvedEntity.attributes.length)
            .toEqual(2);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('newTerm');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('FavoriteTerm');
    });

    /**
     * Test AddArtifactAttribute operation nested with ExcludeAttributes/RenameAttributes.
     */
    it('TestCombineOpsNestedProj', async () => {
        const testName: string = 'TestCombineOpsNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: [ { "name", "age", "address", "phoneNumber", "email" }, "FavoriteTerm" ]
        // Entity Attribuite:
        // Exclude attributes: ["age", "phoneNumber", "name"]
        // Add attribute: ["newName"]
        // Rename attribute ["newName" -> "renaming-{m}" ]
        // Rename attribute ["renaming-newName" -> "renamingAgain-{m}" ]
        // Add attribute: ["newName_1"]
        // Type Attribute:
        // Add attribute: ["newName"]
        // Rename attribute ["newName" -> "renamed-{m}" ]
        // Add attribute: ["newTerm" (InsertAtTop:true)]
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('renamingAgain-renaming-newName')
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('newName_1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('newTerm');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('FavoriteTerm');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('renamed-newName');
    });

    /**
     * Test AddArtifactAttribute operation with a 'structured' condition.
     */
    it('TestConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Condition not met, keep attributes in flat list
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

        const resolvedEntity2: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['structured']);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Condition met, keep attributes in flat list and add the new attribute "newName" all attributes at the end
        expect(resolvedEntity2.attributes.length)
            .toEqual(6);
        expect((resolvedEntity2.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name')
        expect((resolvedEntity2.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity2.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity2.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity2.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity2.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('newName');
    });

    /**
     * Test for creating a projection with an AddArtifactAttribute operation and a condition using the object model.
     */
    it('TestConditionalProjUsingObjectModel', async () => {
        const testName: string = 'TestConditionalProjUsingObjectModel';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity.
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);
        projection.condition = 'structured==true';

        // Create an AddArtifactAttribute operation
        const addArtifactAttributeOp: CdmOperationAddArtifactAttribute = corpus.MakeObject<CdmOperationAddArtifactAttribute>(cdmObjectType.operationAddArtifactAttributeDef);
        addArtifactAttributeOp.newAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'newName');
        (addArtifactAttributeOp.newAttribute as CdmTypeAttributeDefinition).dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'string', true);
        projection.operations.push(addArtifactAttributeOp);

        // Create an entity reference to hold this projection.
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity.
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive.
        const resOpt = new resolveOptions(entity.inDocument)
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly']));

        // Resolve the entity with 'referenceOnly'
        const resolvedEntityWithReferenceOnly: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Condition not met, keep attributes in flat list
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
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['structured']));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Condition met, new traits are added
        expect(resolvedEntityWithStructured.attributes.length)
            .toEqual(5);
        expect((resolvedEntityWithStructured.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('id');
        expect((resolvedEntityWithStructured.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntityWithStructured.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('value');
        expect((resolvedEntityWithStructured.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('date');
        expect((resolvedEntityWithStructured.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('newName');
    });

    /**
     * Test AddArtifactAttribute operation on an entity definition.
     */
    it('TestExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'Child';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name')
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('newName');
    });

    /**
     * Multiple AddArtifactAttribute operations on the same projection.
     */
    it('TestMultipleOpProj', async () => {
        const testName: string = 'TestMultipleOpProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Add attribute: ["newName", "newName_1", "newName"]
        // 2 "newName" will be merged
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name')
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('newName');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('newName_1');
    });

    /**
     * Test insertAtTop field in AddArtifactAttribute operation.
     */
    it('TestInsertAtTop', async () => {
        const testName: string = 'TestInsertAtTop';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Add attribute: ["newName" (InsertAtTop:false), "newName_1" (InsertAtTop:true)]
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('newName_1');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name')
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('newName');
    });

    /**
     * Nested projections with AddArtifactAttribute.
     */
    it('TestNestedProj', async () => {
        const testName: string = 'TestNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Create resolution options with the 'referenceOnly' directive.
        const resolvedEntityWithReferenceOnly: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name')
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('newName_inner');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('newName_outer');
    });
});
