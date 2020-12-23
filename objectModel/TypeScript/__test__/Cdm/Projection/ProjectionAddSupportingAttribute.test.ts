// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
  CdmAttributeItem,
  CdmCorpusDefinition,
  CdmEntityDefinition,
  CdmTraitReference,
  CdmTypeAttributeDefinition
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * A test class for testing the AddSupportingAttribute operation in a projection and in a resolution guidance
 */
describe('Cdm/Projection/ProjectionAddSupportingAttributeTest', (): void => {
  /**
   * All possible combinations of the different resolution directives
   */
  const resOptsCombinations: string[][] = [
    [],
    ['referenceOnly'],
    ['normalized'],
    ['structured'],
    ['referenceOnly', 'normalized'],
    ['referenceOnly', 'virtual'],
    ['referenceOnly', 'structured'],
    ['normalized', 'structured'],
    ['normalized', 'structured', 'virtual'],
    ['referenceOnly', 'normalized', 'structured'],
    ['referenceOnly', 'normalized', 'structured', 'virtual']
  ];

  /**
   * The path between TestDataPath and TestName.
   */
  const testsSubpath: string = 'Cdm/Projection/TestProjectionAddSupportingAttribute';

  /**
   * AddSupportingAttribute with replaceAsForeignKey operation in the same projection
   */
it('testCombineOpsProj', async () => {
    const testName: string = 'testCombineOpsProj';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

    //// Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
    // Supporting attribute: 'PersonInfo_display', rename 'address' to 'homeAddress'
    expect(resolvedEntity.attributes.length)
      .toEqual(7);
    expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
      .toEqual('name');
    expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
      .toEqual('age');
    expect((resolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
      .toEqual('homeAddress');
    expect((resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition).name)
      .toEqual('phoneNumber');
    expect((resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
      .toEqual('email');
    expect((resolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
      .toEqual('address');
    expect((resolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition).name)
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity.attributes.allItems[6], 'email');
  });

  /**
   * Test AddAttributeGroup operation with a 'referenceOnly' and 'virtual' condition
   */
  it('testConditionalProj', async () => {
    const testName: string = 'testConditionalProj';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    // for (const resOpt of resOptsCombinations) {
    //   await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    // }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

    //// Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
    //// Condition not met, don't include supporting attribute
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

    const resolvedEntity2: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly', 'virtual'])

    // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
    // Condition met, include the supporting attribute
    expect(resolvedEntity2.attributes.length)
      .toEqual(6);
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
    expect((resolvedEntity2.attributes.allItems[5] as CdmTypeAttributeDefinition).name)
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity2.attributes.allItems[5], 'email');
  });

  /**
   * Test resolving an entity attribute using resolution guidance
   */
  it('testEntityAttribute', async () => {
    const testName: string = 'testEntityAttribute';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);

    let resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

    // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
    expect(resolvedEntity.attributes.length)
      .toEqual(2);
    expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
      .toEqual('id');
    expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity.attributes.allItems[1], 'id', false);

    // Resolve without directives
    resolvedEntity = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

    // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
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
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity.attributes.allItems[5], 'email', false);
  });

  /**
   * Test resolving an entity attribute with add supporint attribute operation
   */
  it('testEntityAttributeProj', async () => {
    const testName: string = 'testEntityAttributeProj';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

    // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
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
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity.attributes.allItems[5], 'email');
  });

  /**
   * addSupportingAttribute on an entity definition using resolution guidance
   */
  it('testExtendsEntity', async () => {
    const testName: string = 'testExtendsEntity';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

    // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
    // Supporting attribute: 'PersonInfo_display' (using extendsEntityResolutionGuidance)
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
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity.attributes.allItems[5], 'email', false);
  });

  /**
   * addSupportingAttribute on an entity definition
   */
  it('testExtendsEntityProj', async () => {
    const testName: string = 'testExtendsEntityProj';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, []);

    // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
    // Supporting attribute: 'PersonInfo_display' (using extendsEntityResolutionGuidance)
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
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity.attributes.allItems[5], 'email');
  });

  /**
   * Nested replaceAsForeignKey with addSupporingAttribute
   */
  it('testNestedProj', async () => {
    const testName: string = 'testNestedProj';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

    // Original set of attributes: ['name', 'age', 'address', 'phoneNumber', 'email']
    expect(resolvedEntity.attributes.length)
      .toEqual(2);
    expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
      .toEqual('personId');
    expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(resolvedEntity.attributes.allItems[1], 'personId');
  });

  /**
   * Test resolving a type attribute with a nested add supporting attribute operation
   */
  it('TestNestedTypeAttributeProj', async () => {
    const testName: string = 'testNestedTAProj';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);

    // Original set of attributes: ["PersonInfo"]
    expect(resolvedEntity.attributes.length)
      .toEqual(2);
    expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
      .toEqual('name');
    const supportingAttribute: CdmTypeAttributeDefinition = resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition;
    expect(supportingAttribute.name)
      .toEqual('name_display');
    validateInSupportOfAttribute(supportingAttribute, 'name', false);
  });

  /**
   * Test resolving a type attribute using resolution guidance
   */
  it('testTypeAttribute', async () => {
    const testName: string = 'testTypeAttribute';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    // for (const resOpt of resOptsCombinations) {
    //   await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    // }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['structured']);

    // Original set of attributes: ["PersonInfo"]
    expect(resolvedEntity.attributes.length)
      .toEqual(2);
    expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
      .toEqual('PersonInfo');
    const supportingAttribute: CdmTypeAttributeDefinition = resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition;
    expect(supportingAttribute.name)
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(supportingAttribute, 'PersonInfo', false);
  });

  /**
   * Test resolving a type attribute with a nested add supporting attribute operation
   */
  it('testTypeAttributeProj', async () => {
    const testName: string = 'testTypeAttributeProj';
    const entityName: string = 'NewPerson';
    const corpus: CdmCorpusDefinition = projectionTestUtils.getCorpus(testName, testsSubpath);

    for (const resOpt of resOptsCombinations) {
      await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
    }

    const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
    const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['structured']);

    // Original set of attributes: ["PersonInfo"]
    expect(resolvedEntity.attributes.length)
      .toEqual(2);
    expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
      .toEqual('PersonInfo');
    const supportingAttribute: CdmTypeAttributeDefinition = resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition;
    expect(supportingAttribute.name)
      .toEqual('PersonInfo_display');
    validateInSupportOfAttribute(supportingAttribute, 'PersonInfo', false);
  });

  /**
   * Validates that the supporting attribute has the 'is.addedInSupportOf' and 'is.virtual.attribute' traits
   * @param supportingAttribute
   * @param fromAttribute
   */
  function validateInSupportOfAttribute(supportingAttribute: CdmAttributeItem, fromAttribute: string, checkVirtualTrait: boolean = true): void {
    const inSupportOfTrait: CdmTraitReference = supportingAttribute.appliedTraits.item('is.addedInSupportOf');
    expect(inSupportOfTrait)
      .not
      .toBeUndefined();
    expect(inSupportOfTrait.arguments.length)
      .toEqual(1);
    expect(inSupportOfTrait.arguments.allItems[0].value)
      .toEqual(fromAttribute);

    if (checkVirtualTrait) {
        expect(supportingAttribute.appliedTraits.item('is.virtual.attribute'))
          .not
          .toBeUndefined();
    }
  }
});