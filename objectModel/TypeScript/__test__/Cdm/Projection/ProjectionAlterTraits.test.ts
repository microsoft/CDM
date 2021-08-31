// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
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
    CdmOperationAlterTraits,
    CdmProjection,
    CdmTypeAttributeDefinition,
    CdmTraitReference,
    resolveOptions
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 *  Class to handle AlterTraits operations
 */
describe('Cdm/Projection/TestProjectionAlterTraits', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionAlterTraitsTest';

    const traitGroupFilePath: string = testHelper.testDataPath + '/Cdm/Projection/ProjectionAlterTraitsTest';

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
     * Test AlterTraits on an type attribute.
     */
     it('TestAlterTraitsOnTypeAttrProj', async () => {
        const testName: string = 'TestAlterTraitsOnTypeAttrProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        expect(resolvedEntity.attributes.length)
            .toEqual(1);
        validateTrait(resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'FavoriteTerm', true);
    });

    /**
     * Test AlterTraits on an entity attribute.
     */
        it('TestAlterTraitsOnEntiAttrProj', async () => {
        const testName: string = 'TestAlterTraitsOnEntiAttrProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        validateTrait(resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'name', true);
        validateTrait(resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, 'age');
        validateTrait(resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, 'address');
        validateTrait(resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, 'phoneNumber');
        validateTrait(resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition, 'email');
    });

    /**
     * Test AlterTraits on an entity group.
     */
     it('TestAlterTraitsOnAttrGrpProj', async () => {
        const testName: string = 'TestAlterTraitsOnAttrGrpProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        const attGroupReference: CdmAttributeGroupReference = resolvedEntity.attributes.allItems[0] as CdmAttributeGroupReference;
        const attGroupDefinition: CdmAttributeGroupDefinition = attGroupReference.explicitReference as CdmAttributeGroupDefinition;
        expect(attGroupDefinition.members.length)
            .toEqual(5);
        expect(attGroupDefinition.attributeGroupName)
            .toEqual('PersonAttributeGroup');
        expect(attGroupDefinition.exhibitsTraits.item('means.TraitG100')).not.toBeUndefined();
        expect(attGroupDefinition.exhibitsTraits.item('means.TraitG200')).not.toBeUndefined();
        expect(attGroupDefinition.exhibitsTraits.item('means.TraitG300')).toBeUndefined();
        expect(attGroupDefinition.exhibitsTraits.item('means.TraitG400')).not.toBeUndefined();
        const traitG4: CdmTraitReference = attGroupDefinition.exhibitsTraits.item('means.TraitG4') as CdmTraitReference;
        expect(traitG4)
            .not
            .toBeUndefined();
        expect(traitG4.arguments.fetchValue('precision'))
            .toEqual('5')
        expect(traitG4.arguments.fetchValue('scale'))
            .toEqual('15')  
    });

    /**
     * Test AlterTraits operation nested with IncludeAttributes and RenameAttribute.
     */
    it('TestCombineOpsNestedProj', async () => {
        const testName: string = 'TestCombineOpsNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Include attributes: ["age", "phoneNumber", "name"]
        // Add attribute: ["newName"]
        // alter traits on ["newName", "name", + { "means.TraitG100" , "JobTitleBase" } - { "means.TraitG300" } ]
        // Rename attribute ["newName" -> "renaming-{m}" ]
        // alter traits on ["renaming-newName", + { "means.TraitG4(precision:5, scale:15)" } ]
        expect(resolvedEntity.attributes.length)
            .toEqual(4);
        validateTrait(resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'age', false, true);
        validateTrait(resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, 'phoneNumber', false, true);
        validateTrait(resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, 'name');
        validateTrait(resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, 'renaming-newName', true);

    });

    /**
     * Test AlterTraits operation with a 'structured' condition
     */
    it('TestConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'referenceOnly' ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Condition not met, no traits are added
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        validateTrait(resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'name', false, true);
        validateTrait(resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, 'age', false, true);
        validateTrait(resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, 'address', false, true);
        validateTrait(resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, 'phoneNumber', false, true);
        validateTrait(resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition, 'email', false, true);

        const resolvedEntity2: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Condition met, new traits are added
        expect(resolvedEntity2.attributes.length)
            .toEqual(5);
        validateTrait(resolvedEntity2.attributes.allItems[0] as CdmTypeAttributeDefinition, 'name', true);
        validateTrait(resolvedEntity2.attributes.allItems[1] as CdmTypeAttributeDefinition, 'age');
        validateTrait(resolvedEntity2.attributes.allItems[2] as CdmTypeAttributeDefinition, 'address');
        validateTrait(resolvedEntity2.attributes.allItems[3] as CdmTypeAttributeDefinition, 'phoneNumber');
        validateTrait(resolvedEntity2.attributes.allItems[4] as CdmTypeAttributeDefinition, 'email');
    });

    /**
     * Test for creating a projection with an AlterTraits operation and a condition using the object model
     */
    it('TestConditionalProjUsingObjectModel', async () => {
        const testName: string = 'TestConditionalProjUsingObjectModel';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        // Create an entity.
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);
        entity.inDocument.imports.push('traitGroup:/TraitGroup.cdm.json');

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);
        projection.condition = 'structured==true';
        projection.runSequentially = true;

        // Create an AlterTraits operation
        const alterTraitsOp_1:CdmOperationAlterTraits = corpus.MakeObject<CdmOperationAlterTraits>(cdmObjectType.operationAlterTraitsDef);
        alterTraitsOp_1.traitsToAdd = [];
        alterTraitsOp_1.traitsToAdd.push(corpus.MakeRef<CdmTraitReference>(cdmObjectType.traitRef, 'means.TraitG100', true));
        alterTraitsOp_1.traitsToAdd.push(corpus.MakeRef<CdmTraitReference>(cdmObjectType.traitGroupRef, 'JobTitleBase', true));
        alterTraitsOp_1.traitsToRemove = [];
        alterTraitsOp_1.traitsToRemove.push(corpus.MakeRef<CdmTraitReference>(cdmObjectType.traitRef, 'means.TraitG300', true));        
        projection.operations.push(alterTraitsOp_1);

        const alterTraitsOp_2:CdmOperationAlterTraits = corpus.MakeObject<CdmOperationAlterTraits>(cdmObjectType.operationAlterTraitsDef);
        alterTraitsOp_2.traitsToAdd = [];
        const traitG4: CdmTraitReference = corpus.MakeRef<CdmTraitReference>(cdmObjectType.traitRef, 'means.TraitG4', true)
        traitG4.arguments.push('precision', '5')
        traitG4.arguments.push('scale', '15')
        alterTraitsOp_2.traitsToAdd.push(traitG4);
        alterTraitsOp_2.applyTo = [ 'name' ]  
        projection.operations.push(alterTraitsOp_2);        

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

        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Condition not met, no traits are added
        expect(resolvedEntityWithReferenceOnly.attributes.length)
            .toEqual(4);
        validateTrait(resolvedEntityWithReferenceOnly.attributes.allItems[0] as CdmTypeAttributeDefinition, 'id', false, true);
        validateTrait(resolvedEntityWithReferenceOnly.attributes.allItems[1] as CdmTypeAttributeDefinition, 'name', false, true);
        validateTrait(resolvedEntityWithReferenceOnly.attributes.allItems[2] as CdmTypeAttributeDefinition, 'value', false, true);
        validateTrait(resolvedEntityWithReferenceOnly.attributes.allItems[3] as CdmTypeAttributeDefinition, 'date', false, true);

        // Now resolve the entity with the 'structured' directive
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'structured' ]));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
        // Condition met, new traits are added
        expect(resolvedEntityWithStructured.attributes.length)
            .toEqual(4);
        validateTrait(resolvedEntityWithStructured.attributes.allItems[0] as CdmTypeAttributeDefinition, 'id');
        validateTrait(resolvedEntityWithStructured.attributes.allItems[1] as CdmTypeAttributeDefinition, 'name', true);
        validateTrait(resolvedEntityWithStructured.attributes.allItems[2] as CdmTypeAttributeDefinition, 'value');
        validateTrait(resolvedEntityWithStructured.attributes.allItems[3] as CdmTypeAttributeDefinition, 'date');
    });

    /**
     * Test AlterTraits operation on an extended entity definition.
     */
    it('TestExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'Child';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        validateTrait(resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'name', true);
        validateTrait(resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, 'age');
        validateTrait(resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, 'address');
        validateTrait(resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, 'phoneNumber');
        validateTrait(resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition, 'email');
    });

    /**
     * Multiple AlterTraits operations on the same projection.
     */
    it('TestMultipleOpProj', async () => {
        const testName: string = 'TestMultipleOpProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        validateTrait(resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'name');
        validateTrait(resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, 'age');
        validateTrait(resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, 'address');
        validateTrait(resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, 'phoneNumber');
        validateTrait(resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition, 'email');
    });

    /**
     * Test argumentsContainWildcards field in AlterTraits with ArrayExpansion and RenameAttributes operations.
     */
    it('TestWildcardArgs', async () => {
        const testName: string = 'TestWildcardArgs';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ["name", "age", "address"]
        // Expand 1...3, renameFormat = {m}{o}
        // Add traits with wildcard characters
        expect(resolvedEntity.attributes.length)
            .toEqual(9);
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, "name1", 1, "ThreePeople", "name");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, "age1", 1, "ThreePeople", "age");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, "address1", 1, "ThreePeople", "address");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, "name2", 2, "ThreePeople", "name");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition, "age2", 2, "ThreePeople", "age");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition, "address2", 2, "ThreePeople", "address");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition, "name3", 3, "ThreePeople", "name");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition, "age3", 3, "ThreePeople", "age");
        projectionTestUtils.validateExpansionInfoTrait(resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition, "address3", 3, "ThreePeople", "address");                
    });

    /**
     * Test alter arguments.
     */
    it('TestAlterArguments', async () => {
        const testName: string = 'TestAlterArguments';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('traitGroup', new LocalAdapter(traitGroupFilePath));

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [  ]);

        // Create resolution options with the 'referenceOnly' directive.
        const resolvedEntityWithReferenceOnly: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'referenceOnly' ]);

        // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
        // Condition not met, no trait is changed
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        const traitG4: CdmTraitReference = resolvedEntityWithReferenceOnly.attributes.allItems[2].appliedTraits.item('means.TraitG4') as CdmTraitReference;
        expect(traitG4)
            .not
            .toBeUndefined();
        expect(traitG4.arguments.fetchValue('precision'))
            .toBeUndefined();
        expect(traitG4.arguments.fetchValue('scale'))
            .toEqual('15');

        // Create resolution options with the 'structured' directive.
        const resolvedEntityWithStructured: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);

        // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
        // Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["6", {"name": "scale","value": "20"}"] }]
        expect((resolvedEntityWithStructured.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        const traitG4_1: CdmTraitReference = resolvedEntityWithStructured.attributes.allItems[2].appliedTraits.item('means.TraitG4') as CdmTraitReference;
        expect(traitG4_1)
            .not
            .toBeUndefined();
        expect(traitG4_1.arguments.fetchValue('precision'))
            .toEqual('6');
        expect(traitG4_1.arguments.fetchValue('scale'))
            .toEqual('20');

        // Create resolution options with the 'normalized' directive.
        const resolvedEntityWithNormalized: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'normalized' ]);

        // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
        // Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["8", null] }]
        expect((resolvedEntityWithNormalized.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        const traitG4_2: CdmTraitReference = resolvedEntityWithNormalized.attributes.allItems[2].appliedTraits.item('means.TraitG4') as CdmTraitReference;
        expect(traitG4_2)
            .not
            .toBeUndefined();
        expect(traitG4_2.arguments.fetchValue('precision'))
            .toEqual('8');
        expect(traitG4_2.arguments.fetchValue('scale'))
            .toBeUndefined();        
    });

    function validateTrait(attribute: CdmTypeAttributeDefinition, expectedAttrName: string, haveTraitG4?: boolean, doesNotExist?: boolean) {
        expect(attribute.name)
            .toEqual(expectedAttrName);
        
        if (!doesNotExist) {
            expect(attribute.appliedTraits.item('means.TraitG100'))
                .not
                .toBeUndefined();
            expect(attribute.appliedTraits.item('means.TraitG200'))
                .not
                .toBeUndefined();
            expect(attribute.appliedTraits.item('means.TraitG300'))
                .toBeUndefined();
            expect(attribute.appliedTraits.item('means.TraitG400'))
                .not
                .toBeUndefined();
            if (haveTraitG4 === true) {
                const traitG4: CdmTraitReference = attribute.appliedTraits.item('means.TraitG4') as CdmTraitReference;
                expect(traitG4)
                    .not
                    .toBeUndefined();
                expect(traitG4.arguments.fetchValue('precision'))
                    .toEqual('5');
                expect(traitG4.arguments.fetchValue('scale'))
                    .toEqual('15');
            }
        } else {      
            expect(attribute.appliedTraits.item('means.TraitG100'))
                .toBeUndefined();
            expect(attribute.appliedTraits.item('means.TraitG200'))
                .toBeUndefined();
            expect(attribute.appliedTraits.item('means.TraitG300'))
                .toBeUndefined();
            expect(attribute.appliedTraits.item('means.TraitG400'))
                .toBeUndefined();
            expect(attribute.appliedTraits.item('means.TraitG4'))
                .toBeUndefined();                
        }
    }
});
