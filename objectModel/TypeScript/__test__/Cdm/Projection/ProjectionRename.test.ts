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
    CdmOperationRenameAttributes,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 *  Class to handle RenameAttributes operations
 */
describe('Cdm/Projection/ProjectionRenameAttributesTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionRenameTest';

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
     * Test for creating a projection with an RenameAttributes operation on an entity attribute using the object model  
     */
    it('TestEntityAttributeProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestEntityAttributeProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityAttributeProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{a}-{o}-{m}';
        projection.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Resolve the entity.
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, null, localRoot);

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Rename all attributes with format '{a}-{o}-{m}'
        expect(resolvedEntity.attributes.length)
            .toEqual(4);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute--id');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute--name');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute--value');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute--date');
    });

    /**
     * Test for creating a projection with an RenameAttributes operation on an entity definition using the object model.  
     */
    it('TestEntityProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestEntityProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{A}.{o}.{M}';
        projection.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Set the entity's ExtendEntity to be the projection
        entity.extendsEntity = projectionEntityRef;

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, null, localRoot);

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Rename all attributes with format {A}.{o}.{M}
        expect(resolvedEntity.attributes.length)
            .toEqual(4);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('..Id');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('..Name');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('..Value');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('..Date');
    });

    /**
     * Test for creating nested projections with RenameAttributes operations using the object model
     */
    it('TestNestedProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestNestedProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestNestedProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{A}.{o}.{M}';
        projection.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Create another projection that uses the previous projection as its source
        const projection2: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection2.source = projectionEntityRef;

        // Create an RenameAttributes operation
        const renameAttrsOp2: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp2.renameFormat = '{a}-{o}-{m}';
        renameAttrsOp2.applyTo = [ 'name' ];
        projection2.operations.push(renameAttrsOp2);

        // Create an entity reference to hold this projection
        const projectionEntityRef2: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef2.explicitReference = projection2;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef2;
        entity.attributes.push(entityAttribute);

        // Resolve the entity
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, null, localRoot);

        // Verify correctness of the resolved attributes after running the RenameAttributes operations
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Rename all attributes attributes with format {A}.{o}.{M}, then rename 'name' with format '{a}-{o}-{m}'
        expect(resolvedEntity.attributes.length)
            .toEqual(4);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute..Id');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute--TestEntityAttribute..Name');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute..Value');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute..Date');
    });

    /**
     * Test correctness when renameFormat has repeated pattern
     */
    it('TestRepeatedPatternProj', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestEntityAttributeProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestEntityAttributeProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);

        // Create an RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{a}-{M}-{o}-{A}-{m}-{O}';
        projection.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Resolve the entity.
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, null, localRoot);

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Rename all attributes with format '{a}-{M}-{o}-{A}-{m}-{O}'
        expect(resolvedEntity.attributes.length)
            .toEqual(4);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute-Id--TestEntityAttribute-id-');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute-Name--TestEntityAttribute-name-');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute-Value--TestEntityAttribute-value-');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute-Date--TestEntityAttribute-date-');
    });

    /**
     * Test for creating a projection with an RenameAttributes operation and a condition using the object model
     */
    it('TestConditionalProjUsingObjectModel', async () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestConditionalProjUsingObjectModel');
        corpus.storage.mount('local', new LocalAdapter(testHelper.getActualOutputFolderPath(testsSubpath, 'TestConditionalProjUsingObjectModel')));
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create an entity.
        const entity: CdmEntityDefinition = projectionTestUtils.createEntity(corpus, localRoot);

        // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'.
        const projection: CdmProjection = projectionTestUtils.createProjection(corpus, localRoot);
        projection.condition = 'referenceOnly==true';

        // Create an RenameAttributes operation
        const renameAttrsOp: CdmOperationRenameAttributes = corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);
        renameAttrsOp.renameFormat = '{A}.{o}.{M}';
        projection.operations.push(renameAttrsOp);

        // Create an entity reference to hold this projection.
        const projectionEntityRef: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionEntityRef.explicitReference = projection;

        // Create an entity attribute that contains this projection and add this to the entity.
        const entityAttribute: CdmEntityAttributeDefinition = corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, 'TestEntityAttribute');
        entityAttribute.entity = projectionEntityRef;
        entity.attributes.push(entityAttribute);

        // Create resolution options with the 'referenceOnly' directive.
        const resOpt: resolveOptions = new resolveOptions(entity.inDocument);
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'referenceOnly' ]));

        // Resolve the entity with 'referenceOnly'
        const resolvedEntityWithReferenceOnly: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Rename all attributes with format '{A}.{o}.{M}'
        expect(resolvedEntityWithReferenceOnly.attributes.length)
            .toEqual(4);
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute..Id');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute..Name');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute..Value');
        expect((resolvedEntityWithReferenceOnly.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('TestEntityAttribute..Date');

        // Now resolve the entity with the 'structured' directive
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'structured' ]));
        const resolvedEntityWithStructured: CdmEntityDefinition = await entity.createResolvedEntityAsync(`Resolved_${entity.entityName}.cdm.json`, resOpt, localRoot);

        // Verify correctness of the resolved attributes after running the RenameAttributes operation
        // Original set of attributes: ['id', 'name', 'value', 'date']
        // Renamed attributes: none, condition was false
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
     * RenameAttributes with a plain string as rename format.
     */
    it('TestRenameFormatAsStringProj', async () => {
        const testName: string = 'TestRenameFormatAsStringProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // Renamed attribute 'address' with format 'whereYouLive'.
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('whereYouLive');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });

    /**
     * RenameFormat on an entity attribute.
     */
    it('TestRenameFormat', async () => {
        const testName: string = 'TestRenameFormat';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail'].
        // Renamed all attributes with format {a}.{o}.{M}
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..PhoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Email');
    });

    /**
     * RenameFormat on an entity attribute.
     */
    it('TestRenameFormatProj', async () => {
        const testName: string = 'TestRenameFormatProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail'].
        // Renamed all attributes with format {a}.{o}.{M}
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..PhoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Email');
    });

    /**
     * A nested RenameAttributes operation in a single projection.
     */
    it('TestSingleNestedProj', async () => {
        const testName: string = 'TestSingleNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // Renamed all attributes with format 'New{M}'.
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('NewName');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('NewAge');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('NewAddress');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('NewPhoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('NewEmail');
    });

    /**
     * Nested projections with RenameAttributes
     */
    it('TestNestedProj', async () => {
        const testName: string = 'TestNestedProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Rename all attributes attributes with format {A}.{o}.{M}, then rename 'age' with format '{a}-{o}-{m}', finally rename "email" with format '{a}-{o}-{mo}'
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--PersonInfo..Age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..Address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo..PhoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--email');
    });

    /**
     * Multiple RenameAttributes in a single projection.
     */
    it('TestMultipleRename', async () => {
        const testName: string = 'TestMultipleRename';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
        // Rename attributes 'age' to 'yearsOld' then 'address' to 'homePlace'
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('yearsOld');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('homePlace');
    });

    /**
     * RenameFormat on an entity definition.
     */
    it('TestExtendsEntityProj', async () => {
        const testName: string = 'TestExtendsEntityProj';
        const entityName: string = 'Child';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // All attributes renamed with format '{a}.{o}.{M}'.
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('..name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('..age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('..address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('..phoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('..email');
    });

    /**
     * RenameFormat on an entity definition.
     * NOTE: this is not supported with resolution guidance.
     */
    it('TestExtendsEntity', async () => {
        const testName: string = 'TestExtendsEntity';
        const entityName: string = 'Child';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // Renamed attributes: [] with format '{a}.{o}.{M}'.
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
     * RenameAttributes on a polymorphic source
     */
    it('TestPolymorphicProj', async () => {
        const testName: string = 'TestPolymorphicProj';
        const entityName: string = 'BusinessPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            if (resOpt.includes('structured')) {
                // Rename attributes is not supported on an attribute group yet.
                continue;
            }
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['emailId', 'address', 'isPrimary', 'phoneId', 'number', 'socialId', 'account'].
        // Renamed all attributes with format {A}.{o}.{M}.
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..EmailId');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Address');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..IsPrimary');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..PhoneId');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Number');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..SocialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Account');
    });

    /**
     * RenameAttributes on a polymorphic source
     */
    it('TestPolymorphicApplyToProj', async () => {
        const testName: string = 'TestPolymorphicApplyToProj';
        const entityName: string = 'BusinessPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['emailId', 'address', 'isPrimary', 'phoneId', 'number', 'socialId', 'account']
        // Renamed attributes: [address, number] with format {A}.{o}.{M}
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('emailId');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Address');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('isPrimary');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneId');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Number');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('socialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('account');
    });

    /**
     * SelectsSomeAvoidNames on a polymorphic source
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

        // Original set of attributes: ['emailId', 'address', 'isPrimary', 'phoneId', 'number', 'socialId', 'account']
        // Renamed all attributes with format '{A}.{o}.{M}'
        expect(resolvedEntity.attributes.length)
            .toEqual(7);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..EmailId');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Address');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..IsPrimary');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..PhoneId');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Number');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..SocialId');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('ContactAt..Account');
    });

    /**
     * RenameAttributes on an array source
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

        // Original set of attributes: ['personCount', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total)
        // Attributes renamed from format {a}{M} to {a}.{o}.{M}
        // NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
        expect(resolvedEntity.attributes.length)
            .toEqual(16);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..PersonCount');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Age1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Address1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..PhoneNumber1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Email1');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Name2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Age2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Address2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..PhoneNumber2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Email2');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Name3');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Age3');
        expect((resolvedEntity.attributes.allItems[13] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Address3');
        expect((resolvedEntity.attributes.allItems[14] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..PhoneNumber3');
        expect((resolvedEntity.attributes.allItems[15] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Email3');
    });

    /**
     * RenameFormat on an array source
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

        // Original set of attributes: ['GroupOfPeoplePersonCount', 'GroupOfPeopleName1', 'GroupOfPeopleAge1', 'GroupOfPeopleAddress1',
        //                              'GroupOfPeoplePhoneNumber1', 'GroupOfPeopleEmail1', ..., 'GroupOfPeopleEmail3'] (16 total)
        // Attributes renamed from format {a}{M} to {a}.{o}.{M}
        // NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
        expect(resolvedEntity.attributes.length)
            .toEqual(16);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..PersonCount');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.1.Name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.1.Age1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.1.Address1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.1.PhoneNumber1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.1.Email1');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.2.Name2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.2.Age2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.2.Address2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.2.PhoneNumber2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.2.Email2');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.3.Name3');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.3.Age3');
        expect((resolvedEntity.attributes.allItems[13] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.3.Address3');
        expect((resolvedEntity.attributes.allItems[14] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.3.PhoneNumber3');
        expect((resolvedEntity.attributes.allItems[15] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople.3.Email3');
    });

    /**
     * RenameFormat on an array source using apply to.
     */
    it('TestArraySourceRenameApplyToProj', async () => {
        const testName: string = 'TestArraySourceRenameApplyToProj';
        const entityName: string = 'FriendGroup';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['personCount', 'name1', 'age1', 'address1', 'phoneNumber1', 'email1', ..., 'email3'] (16 total).
        // Renamed attributes: ['age1', 'age2', 'age3'] with the format '{a}.{o}.{M}'.
        expect(resolvedEntity.attributes.length)
            .toEqual(16);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('name1');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Age1');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('address1');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber1');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('email1');
        expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
            .toEqual('name2');
        expect((resolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Age2');
        expect((resolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition).name)
            .toEqual('address2');
        expect((resolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber2');
        expect((resolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition).name)
            .toEqual('email2');
        expect((resolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition).name)
            .toEqual('name3');
        expect((resolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('GroupOfPeople..Age3');
        expect((resolvedEntity.attributes.allItems[13] as CdmTypeAttributeDefinition).name)
            .toEqual('address3');
        expect((resolvedEntity.attributes.allItems[14] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber3');
        expect((resolvedEntity.attributes.allItems[15] as CdmTypeAttributeDefinition).name)
            .toEqual('email3');
    });

    /**
     * RenameAttributes with a condition.
     */
    it('TestConditionalProj', async () => {
        const testName: string = 'TestConditionalProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'referenceOnly' ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // Renamed attributes with format '{M}.{o}.{a}'
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('Name..personInfo');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('Age..personInfo');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('Address..personInfo');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('PhoneNumber..personInfo');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('Email..personInfo');

        const resolvedEntity2: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // Renamed attributes: none, condition was false.
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
     * RenameAttributes with an empty apply to list
     */
    it('TestEmptyApplyTo', async () => {
        const testName: string = 'TestEmptyApplyTo';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // Renamed attributes: [].
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
     * RenameFormat on an entity with an attribute group
     */
    it('TestGroupProj', async () => {
        const testName: string = 'TestGroupProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email'].
        // Rename all attributes with format {a}-{o}-{M}
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--PhoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Email');
    });

    /**
     * RenameFormat on an entity with an attribute group.
     */
    it('TestGroupRename', async () => {
        const testName: string = 'TestGroupRename';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ['PersonInfoName', 'PersonInfoAge', 'PersonInfoAddress', 'PersonInfoPhoneNumber', 'PersonInfoEmail'].
        // Rename all attributes with format {a}-{o}-{M}
        expect(resolvedEntity.attributes.length)
            .toEqual(5);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Address');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--PhoneNumber');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Email');
    });

    /**
     * Test RenameFormat applying a rename nested in a exclude operation
     */
    it('testRenameAndExcludeProj', async () => {
        const testName: string = "TestRenameAndExcludeProj";
        const entityName: string = "NewPerson";
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Rename all attributes with format {a}-{o}-{M} and remove ["age", "PersonInfo--PhoneNumber"]
        expect(resolvedEntity.attributes.length)
            .toEqual(3);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Address');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('PersonInfo--Email');
    });

    /**
     * RenameAttributes with an entity attribute name on an inline entity reference that contains entity attributes.
     * This is testing that, for the case of the structured directive, we can filter using the name of an entity attribute.
     * in the inline entity reference to rename the entire entity attribute group.
     */
    test.skip('TestEANameProj', async () => {
        const testName: string = 'TestEANameProj';
        const entityName: string = 'NewPerson';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);

        // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email', 'title', 'company', 'tenure'].
        // Rename with format '{a}-{o}-{M}' attributes ['PersonInfoAge', 'OccupationInfo']
        // 'OccupationInfo' is an entity attribute
        expect(resolvedEntity.attributes.length)
            .toEqual(2); // attribute group created because of structured directive.
        const attGroup: CdmAttributeGroupDefinition = (resolvedEntity.attributes.allItems[0] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(attGroup.getName())
            .toEqual('PersonInfo')
        expect(attGroup.members.length)
            .toEqual(5);
        expect((attGroup.members[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((attGroup.members[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((attGroup.members[2] as CdmTypeAttributeDefinition).name)
            .toEqual('address');
        expect((attGroup.members[3] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((attGroup.members[4] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
        
        const attGroup2: CdmAttributeGroupDefinition = (resolvedEntity.attributes.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(attGroup2.getName())
            .toEqual('PersonInfo--OccupationInfo')
        expect(attGroup2.members.length)
            .toEqual(5);
        expect((attGroup2.members[0] as CdmTypeAttributeDefinition).name)
            .toEqual('title');
        expect((attGroup2.members[1] as CdmTypeAttributeDefinition).name)
            .toEqual('company');
        expect((attGroup2.members[2] as CdmTypeAttributeDefinition).name)
            .toEqual('tenure');
    });

    /**
     * Test resolving a type attribute with a rename attributes operation
     */
    it('TestTypeAttributeProj', async () => {
        const testName: string = 'TestTypeAttributeProj';
        const entityName: string = 'Person';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Rename with format "n{a}e{o}w{M}" attributes ["address"]
        // Add new attribute realNewAddress with rename format "n{a}e{o}w{M}"
        expect(resolvedEntity.attributes.length)
            .toEqual(6);
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('name');
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('age');
        expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('naddressewAddress');
        expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
            .toEqual('naddressewRealNewAddress');
        expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('phoneNumber');
        expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
            .toEqual('email');
    });
});
