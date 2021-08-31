// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { 
    AttributeResolutionDirectiveSet, 
    CdmCorpusDefinition, 
    CdmEntityDeclarationDefinition, 
    CdmEntityDefinition, 
    CdmManifestDefinition, 
    CdmObject, 
    CdmReferencedEntityDeclarationDefinition, 
    importsLoadStrategy, 
    isReferencedEntityDeclarationDefinition, 
    ResolvedEntity, 
    resolveOptions, 
    stringSpewCatcher 
} from '../../../internal';
import { testHelper } from '../../testHelper';

/**
 * Common utilities used by resolution tests.
 */
export const resolutionTestUtils = {
    /**
     * Function used to test resolving an environment.
     * Writes a helper function used for debugging.
     * Asserts the result matches the expected result stored in a file.
     * @param testsSubPath Tests sub-folder name
     * @param testName The name of the test. It is used to decide the path of input / output files.
     * @param manifestName The name of the manifest to be used.
     */
     async resolveSaveDebuggingFileAndAssert(testsSubPath: string, testName: string, manifestName: string, doesWriteDebuggingFiles?: boolean): Promise<void> {
        const result: string = (await resolutionTestUtils.resolveEnvironment(testsSubPath, testName, manifestName));
        const outputFileName: string = `${manifestName}.txt`;
        if (doesWriteDebuggingFiles) {
            testHelper.writeActualOutputFileContent(testsSubPath, testName, outputFileName, result);
        }

        const original: string = testHelper.getExpectedOutputFileContent(testsSubPath, testName, outputFileName);

        testHelper.assertFileContentEquality(result, original);
    },

    /**
     * Resolve the entities in the given manifest
     * @param testsSubPath Tests sub-folder name
     * @param testName The name of the test. It is used to decide the path of input / output files.
     * @param manifestName The name of the manifest to be used.
     * @return the resolved manifest as a promise.
     */
    async resolveEnvironment(testsSubPath: string, testName: string, manifestName: string): Promise<string> {
        const inputFileName: string = `local:/${manifestName}.manifest.cdm.json`;
        const cdmCorpus: CdmCorpusDefinition = testHelper.createCorpusForTest(testsSubPath, testName);

        const manifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(inputFileName);
        const directives: AttributeResolutionDirectiveSet =
            new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));

        return await resolutionTestUtils.listAllResolved(cdmCorpus, directives, manifest, new stringSpewCatcher());
    },

    /**
     * @internal
     * Get the text version of all the resolved entities.
     * @param cdmCorpus The CDM corpus.
     * @param directives The directives to use while getting the resolved entities.
     * @param manifest The manifest to be resolved.
     * @param spew The object used to store the text to be returned.
     * @returns The text version of the resolved entities. (it's in a form that facilitates debugging)
     */
    async listAllResolved(
        cdmCorpus: CdmCorpusDefinition,
        directives: AttributeResolutionDirectiveSet,
        manifest: CdmManifestDefinition,
        spew: stringSpewCatcher): Promise<string> {
        const seen: Set<string> = new Set<string>();
        // make sure the corpus has a set of default artifact attributes
        await cdmCorpus.prepareArtifactAttributesAsync()

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
                    resOpt.importsLoadStrategy = importsLoadStrategy.load;
                    const newEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>(corpusPath, null, resOpt);
                    resOpt.wrtDoc = newEnt.inDocument;
                    resOpt.directives = directives;
                    const resEnt: ResolvedEntity = new ResolvedEntity(resOpt, newEnt);
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
}
