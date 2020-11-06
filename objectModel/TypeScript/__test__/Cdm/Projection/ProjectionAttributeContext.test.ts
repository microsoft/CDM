// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    CdmTypeAttributeDefinition,
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { AttributeContextUtil } from './AttributeContextUtil';

/**
 * A test class to verify the attribute context tree and traits generated for various resolution scenarios given a default resolution option/directive.
 */
describe('Cdm/Projection/ProjectionAttributeContext', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestProjectionAttributeContext';

    /**
     * Extends entity with a string reference
     */
    it('TestEntityStringReference', async () => {
        const testName: string = 'TestEntityStringReference';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityStringReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityStringReference)
            .toBeTruthy();
        const resolvedTestEntityStringReference: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityStringReference, []);
        expect(resolvedTestEntityStringReference)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityStringReference);
    });

    /**
     * Extends entity with an entity reference
     */
    it('TestEntityEntityReference', async () => {
        const testName: string = 'TestEntityEntityReference';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityEntityReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityEntityReference)
            .toBeTruthy();
        const resolvedTestEntityEntityReference: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityEntityReference, []);
        expect(resolvedTestEntityEntityReference)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityEntityReference);
    });

    /**
     * Extends entity with a projection
     */
    it('TestEntityProjection', async () => {
        const testName: string = 'TestEntityProjection';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityProjection)
            .toBeTruthy();
        const resolvedTestEntityProjection: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityProjection, []);
        expect(resolvedTestEntityProjection)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityProjection);
    });

    /**
     * Extends entity with a nested projection
     */
    it('TestEntityNestedProjection', async () => {
        const testName: string = 'TestEntityNestedProjection';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityNestedProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityNestedProjection)
            .toBeTruthy();
        const resolvedTestEntityNestedProjection: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityNestedProjection, []);
        expect(resolvedTestEntityNestedProjection)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityNestedProjection);
    });

    /**
     * Entity attribute referenced with a string
     */
    it('TestEntityAttributeStringReference', async () => {
        const testName: string = 'TestEntityAttributeStringReference';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityAttributeStringReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityAttributeStringReference)
            .toBeTruthy();
        const resolvedTestEntityAttributeStringReference: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeStringReference, []);
        expect(resolvedTestEntityAttributeStringReference)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeStringReference);
    });

    /**
     * Entity attribute referenced with an entity reference
     */
    it('TestEntityAttributeEntityReference', async () => {
        const testName: string = 'TestEntityAttributeEntityReference';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityAttributeEntityReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityAttributeEntityReference)
            .toBeTruthy();
        const resolvedTestEntityAttributeEntityReference: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeEntityReference, []);
        expect(resolvedTestEntityAttributeEntityReference)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeEntityReference);
    });

    /**
     * Entity attribute referenced with a projection
     */
    it('TestEntityAttributeProjection', async () => {
        const testName: string = 'TestEntityAttributeProjection';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityAttributeProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityAttributeProjection)
            .toBeTruthy();
        const resolvedTestEntityAttributeProjection: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeProjection, []);
        expect(resolvedTestEntityAttributeProjection)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeProjection);
    });

    /**
     * Entity attribute referenced with a nested projection
     */
    it('TestEntityAttributeNestedProjection', async () => {
        const testName: string = 'TestEntityAttributeNestedProjection';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityAttributeNestedProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityAttributeNestedProjection)
            .toBeTruthy();
        const resolvedTestEntityAttributeNestedProjection: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityAttributeNestedProjection, []);
        expect(resolvedTestEntityAttributeNestedProjection)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeNestedProjection);
    });

    /**
     * Entity that exhibits custom traits
     */
    it('TestEntityTrait', async () => {
        const testName: string = 'TestEntityTrait';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityTrait)
            .toBeTruthy();
        const resolvedTestEntityTrait: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityTrait, []);
        expect(resolvedTestEntityTrait)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityTrait);

        // Attribute Name
        expect((resolvedTestEntityTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestAttribute');
        // Trait Name
        expect((resolvedTestEntityTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3].namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect((resolvedTestEntityTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect((resolvedTestEntityTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0].resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect(((resolvedTestEntityTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
    });

    /**
     * Entity that extends and exhibits custom traits
     */
    it('TestEntityExtendsTrait', async () => {
        const testName: string = 'TestEntityExtendsTrait';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestEntityExtendsTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestEntityExtendsTrait)
            .toBeTruthy();
        const resolvedTestEntityExtendsTrait: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityExtendsTrait, []);
        expect(resolvedTestEntityExtendsTrait)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityExtendsTrait);

        // Attribute Name
        expect((resolvedTestEntityExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestExtendsTraitAttribute');
        // Trait Name
        expect((resolvedTestEntityExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3].namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect((resolvedTestEntityExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].namedReference)
            .toEqual('testTraitDerived');
        // Trait Param Name
        expect(((resolvedTestEntityExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect(((resolvedTestEntityExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
    });

    /**
     * Entity with projection that exhibits custom traits
     */
    it('TestProjectionTrait', async () => {
        const testName: string = 'TestProjectionTrait';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestProjectionTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestProjectionTrait)
            .toBeTruthy();
        const resolvedTestProjectionTrait: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestProjectionTrait, []);
        expect(resolvedTestProjectionTrait)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestProjectionTrait);

        // Attribute Name
        expect((resolvedTestProjectionTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttribute');
        // Trait Name
        expect((resolvedTestProjectionTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3].namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect((resolvedTestProjectionTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect(((resolvedTestProjectionTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect(((resolvedTestProjectionTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
    });

    /**
     * Entity with projection that extends and exhibits custom traits
     */
    it('TestProjectionExtendsTrait', async () => {
        const testName: string = 'TestProjectionExtendsTrait';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const entTestProjectionExtendsTrait: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entTestProjectionExtendsTrait)
            .toBeTruthy();
        const resolvedTestProjectionExtendsTrait: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestProjectionExtendsTrait, []);
        expect(resolvedTestProjectionExtendsTrait)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestProjectionExtendsTrait);

        // Attribute Name
        expect((resolvedTestProjectionExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttribute');
        // Trait Name
        expect((resolvedTestProjectionExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[3].namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect((resolvedTestProjectionExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[0] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');

        // Attribute Name
        expect((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('TestProjectionAttributeB');
        // Trait Name
        expect((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[3].namedReference)
            .toEqual('does.haveDefault');
        // Trait Name
        expect((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].namedReference)
            .toEqual('testTrait');
        // Trait Param Name
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[4].arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');

        // Trait Name
        expect((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5].namedReference)
            .toEqual('testExtendsTraitB');
        // Trait Param Name
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5].arguments.allItems[0]).resolvedParameter.name)
            .toEqual('testTraitParam1');
        // Trait Param Default Value
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5].arguments.allItems[0]).value)
            .toEqual('TestTrait Param 1 DefaultValue');
        // Trait Param Name
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5].arguments.allItems[1]).resolvedParameter.name)
            .toEqual('testExtendsTraitBParam1');
        // Trait Param Default Value
        expect(((resolvedTestProjectionExtendsTrait.attributes.allItems[1] as CdmTypeAttributeDefinition).appliedTraits.allItems[5].arguments.allItems[1]).value)
            .toEqual('TestExtendsTraitB Param 1 DefaultValue');
    });
});
