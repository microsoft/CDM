// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';

import {
    CdmAttributeContext,
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmAttributeItem,
    CdmAttributeReference,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    cdmLogCode,
    CdmManifestDefinition,
    cdmStatusLevel,
    CdmTraitReference,
    resolveOptions,
    stringSpewCatcher
} from '../../../internal';
import { ResolvedAttributeSet } from '../../../ResolvedModel/ResolvedAttributeSet';
import { LocalAdapter } from '../../../Storage';
import { AttributeResolutionDirectiveSet } from '../../../Utilities/AttributeResolutionDirectiveSet';
import { AttributeContextUtil } from '../Projection/AttributeContextUtil';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { testHelper } from '../../testHelper';
import { resolutionTestUtils } from './ResolutionTestUtils';

/**
 * Tests to verify if entity resolution performs as expected.
 */
// tslint:disable-next-line: max-func-body-length
describe('Cdm/Resolution/EntityResolution', () => {
    const testsSubpath: string = 'Cdm/Resolution/EntityResolutionTest';
    const schemaDocsRoot: string = testHelper.schemaDocumentsPath;

    /**
     * Tests if the owner of the entity is not changed when calling CreatedResolvedEntityAsync
     */
    it('TestOwnerNotChanged', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestOwnerNotChanged');

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Entity.cdm.json/Entity');
        const document: CdmDocumentDefinition = await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/Entity.cdm.json');

        expect(document)
            .toBe(entity.owner);

        await entity.createResolvedEntityAsync('res-Entity');

        expect(document)
            .toBe(entity.owner);
        // Test that entity's attribute's owner should have remained unchanged (same as the owning entity)
        expect(entity.attributes.allItems[0].owner)
            .toBe(entity);
    });

    /**
     * Test that entity references that do not point to valid entities are reported as an error instead of triggering an exception
     */
    it('TestEntRefNonexistent', async () => {
        const expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.WarnResolveObjectFailed, cdmLogCode.ErrResolveReferenceFailure]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEntRefNonexistent', undefined, false, expectedLogCodes);
        const folder: CdmFolderDefinition = corpus.storage.namespaceFolders.get('local');
        const doc: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'someDoc.cdm.json');
        folder.documents.push(doc);
        const entity: CdmEntityDefinition = new CdmEntityDefinition(corpus.ctx, 'someEntity');
        const entAtt: CdmEntityAttributeDefinition = new CdmEntityAttributeDefinition(corpus.ctx, 'entityAtt');
        entAtt.entity = new CdmEntityReference(corpus.ctx, 'nonExistingEntity', true);
        entity.attributes.push(entAtt);
        doc.definitions.push(entity);

        const resolvedEnt: CdmEntityDefinition = await entity.createResolvedEntityAsync('resolvedSomeEntity');
        expect(resolvedEnt)
            .not.toBeUndefined();
    });

    /**
     * Tests that resolution runs correctly when resolving a resolved entity
     */
    it('TestResolvingResolvedEntity', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolvingResolvedEntity');
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Entity.cdm.json/Entity');
        const resEntity = await entity.createResolvedEntityAsync('resEntity');
        const resResEntity = await resEntity.createResolvedEntityAsync('resResEntity');
        expect(resResEntity)
            .not.toBeUndefined();
        expect(resResEntity.exhibitsTraits.length)
            .toBe(1);
        expect(resResEntity.exhibitsTraits.allItems[0].namedReference)
            .toBe('has.entitySchemaAbstractionLevel');
        expect((resResEntity.exhibitsTraits.allItems[0] as CdmTraitReference).arguments.length)
            .toBe(1);
        expect((resResEntity.exhibitsTraits.allItems[0] as CdmTraitReference).arguments.allItems[0].value)
            .toBe('resolved');
    });

    /**
     * Test whether or not the test corpus can be resolved
     */
    it('TestResolveTestCorpus', async () => {
        // tslint:disable-next-line: non-literal-fs-path
        expect(fs.existsSync(schemaDocsRoot))
            .toBeTruthy();

        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();

        // Set empty callback to avoid breaking tests due too many errors in logs,
        // change the event callback to console or file status report if wanted.
        // tslint:disable-next-line: no-empty
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        const localAdapter: LocalAdapter = new LocalAdapter(schemaDocsRoot);
        cdmCorpus.storage.mount('local', localAdapter);
        const manifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(testHelper.cdmStandardsSchemaPath);
        expect(manifest)
            .toBeTruthy();
        const directives: AttributeResolutionDirectiveSet =
            new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));
        const allResolved: string = await resolutionTestUtils.listAllResolved(cdmCorpus, directives, manifest, new stringSpewCatcher());
        expect(allResolved)
            .toBeDefined();
        expect(allResolved.length)
            .toBeGreaterThanOrEqual(1);
    }, 500000);

    /**
     * Test if the composite resolved entities match
     */
    it('TestResolvedComposites', async () => {
        await resolutionTestUtils.resolveSaveDebuggingFileAndAssert(testsSubpath, 'TestResolvedComposites', 'composites');
    });

    /**
     * Test if the composite resolved entities match
     */
    it('TestResolvedE2E', async () => {
        await resolutionTestUtils.resolveSaveDebuggingFileAndAssert(testsSubpath, 'TestResolvedE2E', 'E2EResolution');
    });

    /**
     * Test if the knowledge graph resolved entities match
     */
    it('TestareResolvedKnowledgeGraph', async () => {
        await resolutionTestUtils.resolveSaveDebuggingFileAndAssert(testsSubpath, 'TestResolvedKnowledgeGraph', 'KnowledgeGraph');
    });

    /**
     * Test if the mini dyn resolved entities match
     */
    // it('TestResolvedMiniDyn', async () => {
    //     await resolveSaveDebuggingFileAndAssert('TestResolvedMiniDyn', 'MiniDyn');
    // });

    /**
     * Test if the overrides resolved entities match
     */
    it('TestResolvedOverrides', async () => {
        await resolutionTestUtils.resolveSaveDebuggingFileAndAssert(testsSubpath, 'TestResolvedOverrides', 'overrides');
    });

    /**
     * Test if the POVResolution resolved entities match
     */
    it('TestResolvedPovResolution', async () => {
        await resolutionTestUtils.resolveSaveDebuggingFileAndAssert(testsSubpath, 'TestResolvedPovResolution', 'POVResolution');
    });

    /**
     * Test if the WebClicks resolved entities match
     */
    it('TestResolvedWebClicks', async () => {
        await resolutionTestUtils.resolveSaveDebuggingFileAndAssert(testsSubpath, 'TestResolvedWebClicks', 'webClicks');
    });

    /**
     * Test that monikered references on resolved entities can be resolved correctly, previously
     * the inclusion of the resolvedFrom moniker stopped the source document from being found
     */
    it('TestResolveWithExtended', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolveWithExtended');
        cdmCorpus.setEventCallback(
            (level, msg) => {
                expect(msg.indexOf('unable to resolve the reference'))
                    .toBe(-1);
            },
            cdmStatusLevel.warning);

        const ent: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('local:/sub/Account.cdm.json/Account');
        await ent.createResolvedEntityAsync('Account_');
    });

    /**
     * Testing that attributes that have the same name in extended entity are properly replaced
     */
    it('TestAttributesThatAreReplaced', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestAttributesThatAreReplaced');

        const extendedEntity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/extended.cdm.json/extended');
        const resExtendedEnt: CdmEntityDefinition = await extendedEntity.createResolvedEntityAsync('resExtended');

        // the attribute from the base class should be merged with the attribute
        // from the extended class into a single attribute
        expect(resExtendedEnt.attributes.length)
            .toBe(1);

        // check that traits from the base class merged with the traits from the extended class
        const attribute: CdmAttributeItem = resExtendedEnt.attributes.allItems[0];
        // base trait
        expect(attribute.appliedTraits.indexOf('means.identity.brand')).not
            .toEqual(-1);
        // extended trait
        expect(attribute.appliedTraits.indexOf('means.identity.company.name')).not
            .toEqual(-1);

        // make sure the attribute context and entity foreign key were maintained correctly
        const foreignKeyForBaseAttribute: CdmAttributeContext =
            ((resExtendedEnt.attributeContext.contents.allItems[1] as CdmAttributeContext)
                .contents.allItems[1] as CdmAttributeContext);
        expect(foreignKeyForBaseAttribute.name)
            .toBe('_generatedAttributeSet');
        const fkReference: CdmAttributeReference =
            ((foreignKeyForBaseAttribute.contents.allItems[0] as CdmAttributeContext).contents.allItems[0] as CdmAttributeContext)
                .contents.allItems[0] as CdmAttributeReference;
        expect(fkReference.namedReference)
            .toBe('resExtended/hasAttributes/regardingObjectId');
    });

    /**
     * Test that resolved attribute limit is calculated correctly and respected
     */
    it('TestResolvedAttributeLimit', async () => {
        var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrRelMaxResolvedAttrReached]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolvedAttributeLimit', undefined, false, expectedLogCodes);

        const mainEntity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/mainEntity.cdm.json/mainEntity');
        let resOpt: resolveOptions = new resolveOptions(mainEntity.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly'])));

        // if attribute limit is reached, entity should be null
        resOpt.resolvedAttributeLimit = 4;
        let resEnt: CdmEntityDefinition = await mainEntity.createResolvedEntityAsync(`${mainEntity.entityName}_zeroAtts`, resOpt);
        expect(resEnt)
            .toBeUndefined();

        // when the attribute limit is set to null, there should not be a limit on the possible number of attributes
        resOpt.resolvedAttributeLimit = undefined;
        let ras: ResolvedAttributeSet = mainEntity.fetchResolvedAttributes(resOpt);
        resEnt = await mainEntity.createResolvedEntityAsync(`${mainEntity.entityName}_normalized_referenceOnly`, resOpt);

        // there are 5 total attributes
        expect(ras.resolvedAttributeCount)
            .toBe(5);
        expect(ras.set.length)
            .toBe(5);
        expect(mainEntity.attributes.length)
            .toBe(3);
        // there are 2 attributes grouped in an entity attribute
        // and 2 attributes grouped in an attribute group
        expect(((mainEntity.attributes.allItems[2] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition).members.length)
            .toBe(2);

        // using the default limit number
        resOpt = new resolveOptions(mainEntity.inDocument);
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));
        ras = mainEntity.fetchResolvedAttributes(resOpt);
        resEnt = await mainEntity.createResolvedEntityAsync(`${mainEntity.entityName}_normalized_referenceOnly`, resOpt);

        // there are 5 total attributes
        expect(ras.resolvedAttributeCount)
            .toBe(5);
        expect(ras.set.length)
            .toBe(5);
        expect(mainEntity.attributes.length)
            .toBe(3);
        // there are 2 attributes grouped in an entity attribute
        // and 2 attributes grouped in an attribute group
        expect(((mainEntity.attributes.allItems[2] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition).members.length)
            .toBe(2);

        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured']));
        ras = mainEntity.fetchResolvedAttributes(resOpt);
        resEnt = await mainEntity.createResolvedEntityAsync(`${mainEntity.entityName}_normalized_structured`, resOpt);

        // there are 5 total attributes
        expect(ras.resolvedAttributeCount)
            .toBe(5);
        // the attribute count is different because one attribute is a group that contains two different attributes
        expect(ras.set.length)
            .toBe(4);
        expect(mainEntity.attributes.length)
            .toBe(3);
        // again there are 2 attributes grouped in an entity attribute
        // and 2 attributes grouped in an attribute group
        expect(((mainEntity.attributes.allItems[2] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition).members.length)
            .toBe(2);
    });

    /**
     * Test that "is.linkedEntity.name" and "is.linkedEntity.identifier" traits are set when "selectedTypeAttribute" and "foreignKeyAttribute"
     * are present in the entity's resolution guidance.
     */
    it('TestSettingTraitsForResolutionGuidanceAttributes', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestSettingTraitsForResolutionGuidanceAttributes');
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Customer.cdm.json/Customer');

        // Resolve with default directives to get "is.linkedEntity.name" trait.
        let resOpt: resolveOptions = new resolveOptions(entity.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly'])));
        let resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync('resolved', resOpt);

        expect(resolvedEntity.attributes.allItems[1].appliedTraits.item('is.linkedEntity.name'))
            .not
            .toBeUndefined();

        // Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
        resOpt = new resolveOptions(entity.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly'])));
        resolvedEntity = await entity.createResolvedEntityAsync('resolved2', resOpt);

        expect(resolvedEntity.attributes.allItems[0].appliedTraits.item('is.linkedEntity.identifier'))
            .not
            .toBeUndefined();
    });

    /**
     * Test that traits(including the ones inside of dataTypeRefence and PurposeReference) are applied to an entity attribute and type attribute.
     */
    it('TestAppliedTraitsInAttributes', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestAppliedTraitsInAttributes');
        const expectedOutputFolder: string = testHelper.getExpectedOutputFolderPath(testsSubpath, 'TestAppliedTraitsInAttributes');
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Sales.cdm.json/Sales');
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);
        await AttributeContextUtil.validateAttributeContext(expectedOutputFolder, 'Sales', resolvedEntity);
    });

    /**
     * Test that foundations import is added to resolved doc if it exists in the unresolved doc
     */
    it('TestFoundationsInResDoc', async () => {
        const corpus = testHelper.getLocalCorpus(testsSubpath, 'TestFoundationsInResDoc');
        const entity = await corpus.fetchObjectAsync<CdmEntityDefinition>('Entity.cdm.json/Entity');
        const resEntity = await entity.createResolvedEntityAsync('resolvedEntity');
        expect(resEntity.inDocument.imports.item('cdm:/foundations.cdm.json') != undefined)
            .toBeTruthy();
    })
});
