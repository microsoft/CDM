// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    cdmLogCode,
    CdmManifestDefinition,
    cdmStatusLevel,
    importsLoadStrategy,
    resolveOptions
} from '../../internal';
import { testHelper } from '../testHelper';

/**
 * Test methods for the CdmCorpusDefinition class.
 */
describe('Cdm/CdmCorpusDefinition', () => {
    const testsSubpath: string = 'Cdm/Corpus';

    /**
     * Tests if a symbol imported with a moniker can be found as the last resource.
     * When resolving symbolEntity with respect to wrtEntity, the symbol fromEntity should be found correctly.
     */
    it('TestResolveSymbolReference', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolveSymbolReference');
        corpus.setEventCallback((level, msg) => {
            throw new Error(msg);
        }, cdmStatusLevel.warning);

        const wrtEntity = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/wrtEntity.cdm.json/wrtEntity');
        const resOpt = new resolveOptions(wrtEntity, new AttributeResolutionDirectiveSet());
        await wrtEntity.createResolvedEntityAsync('NewEntity', resOpt);
    });

    /**
     * Tests if ComputeLastModifiedTimeAsync doesn't log errors related to reference validation.
     */
    it('testComputeLastModifiedTimeAsync', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestComputeLastModifiedTimeAsync');

        corpus.setEventCallback((level, msg) => {
            throw new Error(msg);
        }, cdmStatusLevel.error);

        await corpus.computeLastModifiedTimeAsync('local:/default.manifest.cdm.json');
    });

    /**
     * Tests if the OM is able to load a data type with a cycle and log an error when that occurs.
     */
    it('testCycleInDataType', async () => {
        const expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrCycleInObjectDefinition, cdmLogCode.ErrResolutionFailure]);
        const corpus = testHelper.getLocalCorpus(testsSubpath, "TestCycleInDataType", undefined, undefined, expectedLogCodes);

        // Force the symbols to be resolved.
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;

        await corpus.fetchObjectAsync<CdmDocumentDefinition>("local:/doc.cdm.json", undefined, resOpt);

        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrCycleInObjectDefinition, true);
    });

    /**
     * Tests the FetchObjectAsync function with the lazy imports load.
     */
    it('TestLazyLoadImports', async () => {
        const corpus = testHelper.getLocalCorpus(testsSubpath, 'TestImportsLoadStrategy');
        corpus.setEventCallback((level, msg) => {
            // when the imports are not loaded, there should be no reference validation.
            // no error should be logged.
            throw new Error(msg);
        }, cdmStatusLevel.warning);

        // load with deferred imports.
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.lazyLoad;
        await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/doc.cdm.json', null, resOpt);
    });

    /**
     * Tests if a document that was fetched with lazy load and imported by another document is property indexed when needed.
     */
    it('testLazyLoadCreateResolvedEntity', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLazyLoadCreateResolvedEntity');
        corpus.setEventCallback((level, message) => {
            // when the imports are loaded, there should be no reference validation.
            // no error should be logged.
            throw new Error(message);
        }, cdmStatusLevel.warning);

        // load with deferred imports.
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.lazyLoad;

        // load entB which is imported by entA document.
        var docB = await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/entB.cdm.json', null, resOpt);
        var entA = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/entA.cdm.json/entA', null, resOpt);

        expect(entA.inDocument.importPriorities)
            .toBeUndefined();
        expect(docB.importPriorities)
            .toBeUndefined();

        // CreateResolvedEntityAsync will force the entA document to be indexed.
        var resEntA = await entA.createResolvedEntityAsync('resolved-EntA');

        // in CreateResolvedEntityAsync the documents should be indexed.
        expect(entA.inDocument.importPriorities)
            .not
            .toBeUndefined();
        expect(docB.importPriorities)
            .not
            .toBeUndefined();
        expect(resEntA.inDocument.importPriorities)
            .not
            .toBeUndefined();
    });

    /**
     * Tests the FetchObjectAsync function with the imports load strategy set to load.
     */
    it('TestLoadImports', async () => {
        let errorCount = 0;
        let corpus = testHelper.getLocalCorpus(testsSubpath, 'TestImportsLoadStrategy');
        corpus.setEventCallback((level, msg) => {
            if (msg.indexOf('Unable to resolve the reference') !== -1) {
                errorCount++;
            } else {
                throw new Error(msg);
            }
        }, cdmStatusLevel.error);

        // load imports.
        let resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;
        await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/doc.cdm.json', null, resOpt);
        expect(errorCount)
            .toEqual(1);

        errorCount = 0;
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestImportsLoadStrategy');
        corpus.setEventCallback((level, msg) => {
            if (level === cdmStatusLevel.warning && msg.indexOf('Unable to resolve the reference') !== -1) {
                errorCount++;
            } else {
                throw new Error(msg);
            }
        }, cdmStatusLevel.warning);

        // load imports with shallow validation.
        resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;
        resOpt.shallowValidation = true;
        await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/doc.cdm.json', null, resOpt);
        expect(errorCount)
            .toEqual(1);
    });

    /**
     * Tests if a symbol imported with a moniker can be found as the last resource.
     * When resolving entityReference from wrtConstEntity, constEntity should be found and resolved.
     */
    it('TestResolveConstSymbolReference', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolveConstSymbolReference');
        corpus.setEventCallback((level, msg) => {
            throw new Error(msg);
        }, cdmStatusLevel.warning);

        const wrtEntity = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/wrtConstEntity.cdm.json/wrtConstEntity');
        const resOpt = new resolveOptions(wrtEntity, new AttributeResolutionDirectiveSet());
        await wrtEntity.createResolvedEntityAsync('NewEntity', resOpt);
    });

    /**
     * Tests that errors when trying to cast objects after fetching is handled correctly.
     */
    it('TestIncorrectCastOnFetch', async () => {
        const expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrInvalidCast]);
        const corpus = testHelper.getLocalCorpus(testsSubpath, 'TestIncorrectCastOnFetch', undefined, false, expectedLogCodes);
        const manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');
        // this function will fetch the entity inside it
        await corpus.calculateEntityGraphAsync(manifest);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrInvalidCast, true);
    });
});
