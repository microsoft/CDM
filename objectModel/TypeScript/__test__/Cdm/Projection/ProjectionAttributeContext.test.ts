// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * A test class to verify the attribute context tree and traits generated for various resolution scenarios given a default resolution option/directive.
 */
describe('Cdm/Projection/ProjectionAttributeContext', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionAttributeContextTest';

    /**
     * Extends entity with a string reference
     */
    it('TestEntityStringReference', async () => {
        const testName: string = 'TestEntityStringReference';
        const entityName: string = 'TestEntStrRef';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Extends entity with an entity reference
     */
    it('TestEntityEntityReference', async () => {
        const testName: string = 'TestEntityEntityReference';
        const entityName: string = 'TestEntEntRef';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Extends entity with a projection
     */
    it('TestEntityProjection', async () => {
        const testName: string = 'TestEntityProjection';
        const entityName: string = testName;
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Extends entity with a nested projection
     */
    it('TestEntityNestedProjection', async () => {
        const testName: string = 'TestEntityNestedProjection';
        const entityName: string = 'NestedProjection';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Entity attribute referenced with a string
     */
    it('TestEntityAttributeStringReference', async () => {
        const testName: string = 'TestEntityAttributeStringReference';
        const entityName: string = 'TestEntAttrStrRef';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Entity attribute referenced with an entity reference
     */
    it('TestEntityAttributeEntityReference', async () => {
        const testName: string = 'TestEntityAttributeEntityReference';
        const entityName: string = 'TestEntAttrEntRef';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Entity attribute referenced with a projection
     */
    it('TestEntityAttributeProjection', async () => {
        const testName: string = 'TestEntityAttributeProjection';
        const entityName: string = 'TestEntAttrProj';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Entity attribute referenced with a nested projection
     */
    it('TestEntityAttributeNestedProjection', async () => {
        const testName: string = 'TestEntityAttributeNestedProjection';
        const entityName: string = 'NestedProjection';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);
    });

    /**
     * Entity that exhibits custom traits
     */
    it('TestEntityTrait', async () => {
        const testName: string = 'TestEntityTrait';
        const entityName: string = testName;
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        const resolvedEntity = await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);

        // Attribute Name
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestAttribute');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3] as CdmTraitReference).namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0].resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect((((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
    });

    /**
     * Entity that extends and exhibits custom traits
     */
    it('TestEntityExtendsTrait', async () => {
        const testName: string = 'TestEntityExtendsTrait';
        const entityName: string = 'ExtendsTrait';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        const resolvedEntity = await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);

        // Attribute Name
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestExtendsTraitAttribute');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3] as CdmTraitReference).namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).namedReference)
            .toEqual('testTraitDerived');
        // Trait Param Name
        expect((((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect((((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
    });

    /**
     * Entity with projection that exhibits custom traits
     */
    it('TestProjectionTrait', async () => {
        const testName: string = 'TestProjectionTrait';
        const entityName: string = testName;
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        const resolvedEntity = await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);

        // Attribute Name
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttribute');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3] as CdmTraitReference).namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect((((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect((((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
    });

    /**
     * Entity with projection that extends and exhibits custom traits
     */
    it('TestProjectionExtendsTrait', async () => {
        const testName: string = 'TestProjectionExtendsTrait';
        const entityName: string = 'ExtendsTrait';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        const resolvedEntity = await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, []);

        // Attribute Name
        expect((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttribute');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3] as CdmTraitReference).namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect((((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect((((resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');

        // Attribute Name
        expect((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttributeB');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[3] as CdmTraitReference).namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect(((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect((((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect((((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[4] as CdmTraitReference).arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');

        // Trait Name
        expect(((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5] as CdmTraitReference).namedReference)
            .toEqual('testExtendsTraitB');
        // Trait Param Name
        expect((((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5] as CdmTraitReference).arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect((((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5] as CdmTraitReference).arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
        // Trait Param Name
        expect((((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5] as CdmTraitReference).arguments.allItems[1]).resolvedParameter.name)
            .toEqual('testExtendsTraitBParam1');
        // Trait Param Default Value
        expect((((resolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5] as CdmTraitReference).arguments.allItems[1]).value)
            .toEqual('TestExtendsTraitB Param 1 DefaultValue');
    });
});
