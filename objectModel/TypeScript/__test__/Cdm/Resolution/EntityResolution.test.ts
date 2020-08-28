// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import { CdmAttributeContext } from '../../../Cdm/CdmAttributeContext';
import { CdmAttributeGroupDefinition } from '../../../Cdm/CdmAttributeGroupDefinition';
import { CdmAttributeGroupReference } from '../../../Cdm/CdmAttributeGroupReference';
import { CdmAttributeItem } from '../../../Cdm/CdmAttributeItem';
import { CdmAttributeReference } from '../../../Cdm/CdmAttributeReference';
import { CdmObject } from '../../../Cdm/CdmObject';
import { stringSpewCatcher } from '../../../Cdm/stringSpewCatcher';
import {
    CdmCorpusDefinition,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel
} from '../../../internal';
import { ResolvedAttributeSet } from '../../../ResolvedModel/ResolvedAttributeSet';
import { ResolvedEntity } from '../../../ResolvedModel/ResolvedEntity';
import { LocalAdapter } from '../../../Storage';
import { AttributeResolutionDirectiveSet } from '../../../Utilities/AttributeResolutionDirectiveSet';
import { isReferencedEntityDeclarationDefinition } from '../../../Utilities/cdmObjectTypeGuards';
import { resolveOptions } from '../../../Utilities/resolveOptions';
import { testHelper } from '../../testHelper';

/**
 * Tests to verify if entity resolution is taking places as expected.
 */
// tslint:disable-next-line: max-func-body-length
describe('Cdm/Resolution/EntityResolution', () => {
    const testsSubpath: string = 'Cdm/Resolution/EntityResolution';
    const schemaDocsRoot: string = testHelper.schemaDocumentsPath;
    const doesWriteDebuggingFiles: boolean = false;

    /**
     * Test whether or not the test corpus can be resolved
     */
    it('TestResolveTestCorpus', async () => {
        // this test takes more time than jest expects tests to take
        jest.setTimeout(100000);

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
        const allResolved: string = await listAllResolved(cdmCorpus, directives, manifest, new stringSpewCatcher());
        expect(allResolved)
            .toBeDefined();
        expect(allResolved.length)
            .toBeGreaterThanOrEqual(1);

        // setting back expected test timeout.
        jest.setTimeout(10000);
    });

    /**
     * Test if the composite resolved entities match
     */
    it('TestResolvedComposites', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedComposites', 'composites');
    });

    /**
     * Test if the composite resolved entities match
     */
    it('TestResolvedE2E', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedE2E', 'E2EResolution');
    });

    /**
     * Test if the knowledge graph resolved entities match
     */
    it('TestareResolvedKnowledgeGraph', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedKnowledgeGraph', 'KnowledgeGraph');
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
        await resolveSaveDebuggingFileAndAssert('TestResolvedOverrides', 'overrides');
    });

    /**
     * Test if the POVResolution resolved entities match
     */
    it('TestResolvedPovResolution', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedPovResolution', 'POVResolution');
    });

    /**
     * Test if the WebClicks resolved entities match
     */
    it('TestResolvedWebClicks', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedWebClicks', 'webClicks');
    });

    /**
     * Test that monikered references on resolved entities can be resolved correctly, previously
     * the inclusion of the resolvedFrom moniker stopped the source document from being found
     */
    it('TestResolveWithExtended', async (done) => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolveWithExtended');
        cdmCorpus.setEventCallback(
            (level, msg) => {
                expect(msg.indexOf('unable to resolve the reference'))
                    .toBe(-1);
            },
            cdmStatusLevel.warning);

        const ent: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('local:/sub/Account.cdm.json/Account');
        await ent.createResolvedEntityAsync('Account_');
        done();
    });

    /**
     * Testing that attributes that have the same name in extended entity are properly replaced
     */
    it('TestAttributesThatAreReplaced', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestAttributesThatAreReplaced');
        corpus.storage.mount('cdm', new LocalAdapter(testHelper.schemaDocumentsPath));

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
        done();
    });

    /**
     * Test that resolved attribute limit is calculated correctly and respected
     */
    it('TestResolvedAttributeLimit', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolvedAttributeLimit');

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
        done();
    });

    /**
     * Test that "is.linkedEntity.name" and "is.linkedEntity.identifier" traits are set when "selectedTypeAttribute" and "foreignKeyAttribute"
     * are present in the entity's resolution guidance.
     */
    it('TestSettingTraitsForResolutionGuidanceAttributes', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestSettingTraitsForResolutionGuidanceAttributes');
        corpus.storage.mount('cdm', new LocalAdapter(testHelper.schemaDocumentsPath));
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Customer.cdm.json/Customer');

        // Resolve with default directives to get "is.linkedEntity.name" trait.
        let resOpt: resolveOptions = new resolveOptions(entity.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly'])));
        let resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync('resolved', resOpt);

        expect(resolvedEntity.attributes.allItems[1].appliedTraits.allItems[7].namedReference)
            .toBe('is.linkedEntity.name');

        // Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
        resOpt = new resolveOptions(entity.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly'])));
        resolvedEntity = await entity.createResolvedEntityAsync('resolved2', resOpt);

        expect(resolvedEntity.attributes.allItems[0].appliedTraits.allItems[7].namedReference)
            .toBe('is.linkedEntity.identifier');

        done();
    });

    /**
     * Function used to test resolving an environment.
     * Writes a helper function used for debugging.
     * Asserts the result matches the expected result stored in a file.
     * @param testName The name of the test. It is used to decide the path of input / output files.
     * @param manifestName The name of the manifest to be used.
     */
    async function resolveSaveDebuggingFileAndAssert(testName: string, manifestName: string): Promise<void> {
        const result: string = (await resolveEnvironment(testName, manifestName));
        const outputFileName: string = `${manifestName}.txt`;
        if (doesWriteDebuggingFiles) {
            testHelper.writeActualOutputFileContent(testsSubpath, testName, outputFileName, result);
        }

        const original: string = testHelper.getExpectedOutputFileContent(testsSubpath, testName, outputFileName);

        testHelper.assertFileContentEquality(result, original);
    }

    /**
     * Resolve the entities in the given manifest
     * @param testName The name of the test. It is used to decide the path of input / output files.
     * @param manifestName The name of the manifest to be used.
     * @return the resolved manifest as a promise.
     */
    async function resolveEnvironment(testName: string, manifestName: string): Promise<string> {
        const inputFileName: string = `local:/${manifestName}.manifest.cdm.json`;
        const cdmCorpus: CdmCorpusDefinition = testHelper.createCorpusForTest(testsSubpath, testName);

        const manifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(inputFileName);
        const directives: AttributeResolutionDirectiveSet =
            new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));

        return listAllResolved(cdmCorpus, directives, manifest, new stringSpewCatcher());
    }

    /**
     * @internal
     * Get the text version of all the resolved entities.
     * @param cdmCorpus The CDM corpus.
     * @param directives The directives to use while getting the resolved entities.
     * @param manifest The manifest to be resolved.
     * @param spew The object used to store the text to be returned.
     * @returns The text version of the resolved entities. (it's in a form that facilitates debugging)
     */
    async function listAllResolved(
        cdmCorpus: CdmCorpusDefinition,
        directives: AttributeResolutionDirectiveSet,
        manifest: CdmManifestDefinition,
        spew: stringSpewCatcher): Promise<string> {
        const seen: Set<string> = new Set<string>();

        async function seekEntities(f: CdmManifestDefinition): Promise<void> {
            if (f && f.entities) {
                if (spew) {
                    spew.spewLine(f.folderPath);
                }
                for (const entity of f.entities) {
                    let corpusPath: string;
                    let ent: CdmEntityDeclarationDefinition = entity;
                    let currentFile: CdmObject = f;
                    while (isReferencedEntityDeclarationDefinition(ent)) {
                        corpusPath =
                            cdmCorpus.storage.createAbsoluteCorpusPath(ent.entityPath, currentFile);
                        ent = await cdmCorpus.fetchObjectAsync<CdmReferencedEntityDeclarationDefinition>(corpusPath);
                        currentFile = ent as CdmObject;
                    }
                    corpusPath = cdmCorpus.storage.createAbsoluteCorpusPath(ent.entityPath, currentFile);
                    const resOpt: resolveOptions = new resolveOptions();
                    resOpt.strictValidation = true;
                    const newEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>(corpusPath, null, resOpt);
                    resOpt.wrtDoc = newEnt.inDocument;
                    resOpt.directives = directives;
                    const resEnt: ResolvedEntity = newEnt.getResolvedEntity(resOpt);
                    if (spew) {
                        resEnt.spew(resOpt, spew, ' ', true);
                    }
                }
            }
            if (f && f.subManifests) {
                for (const subManifest of f.subManifests) {
                    const corpusPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(subManifest.definition, f);
                    await seekEntities(await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>(corpusPath));
                }
            }
        }
        await seekEntities(manifest);
        if (spew) {
            return spew.getContent();
        }

        return '';
    }
});
