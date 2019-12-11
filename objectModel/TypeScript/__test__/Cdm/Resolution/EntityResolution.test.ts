import * as fs from 'fs';
import { CdmEntityDeclarationDefinition } from '../../../Cdm/CdmEntityDeclarationDefinition';
import { CdmEntityDefinition } from '../../../Cdm/CdmEntityDefinition';
import { CdmManifestDefinition } from '../../../Cdm/CdmManifestDefinition';
import { CdmObject } from '../../../Cdm/CdmObject';
import { CdmReferencedEntityDeclarationDefinition } from '../../../Cdm/CdmReferencedEntityDeclarationDefinition';
import { cdmStatusLevel } from '../../../Cdm/cdmStatusLevel';
import { stringSpewCatcher } from '../../../Cdm/stringSpewCatcher';
import { cdmObjectType } from '../../../Enums/cdmObjectType';
import { CdmCorpusDefinition } from '../../../internal';
import { ResolvedEntity } from '../../../ResolvedModel/ResolvedEntity';
import { LocalAdapter } from '../../../StorageAdapter';
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
    const schemaDocsRoot: string = '../CDM.SchemaDocuments';
    const doesWriteDebuggingFiles: boolean = testHelper.doesWriteTestDebuggingFiles;

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
        const manifest: CdmManifestDefinition = await cdmCorpus.createRootManifest('local:/standards.manifest.cdm.json');
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
        jest.setTimeout(5000);
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
    it('TestResolvedMiniDyn', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedMiniDyn', 'MiniDyn');
    });

    /**
     * Test if the overrides resolved entities match
     */
    it('TestResolvedOverrides', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedOverrides', 'overrides');
    });

    /**
     * Test if the POVResolution resolved entities match
     */
    it('TestResolvedPov', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedPov', 'POVResolution');
    });

    /**
     * Test if the WebClicks resolved entities match
     */
    it('TestResolvedWebClicks', async () => {
        await resolveSaveDebuggingFileAndAssert('TestResolvedWebClicks', 'webClicks');
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
                    const newEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>(corpusPath);
                    const resOpt: resolveOptions = { wrtDoc: newEnt.inDocument, directives: directives };
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
