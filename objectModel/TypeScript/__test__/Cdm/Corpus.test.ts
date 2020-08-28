// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { 
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    cdmStatusLevel,
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
    it('TestResolveSymbolReference', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolveSymbolReference');
        corpus.setEventCallback((level, msg) => {
            done.fail(new Error(msg));
        }, cdmStatusLevel.warning);

        const wrtEntity = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/wrtEntity.cdm.json/wrtEntity');
        const resOpt = new resolveOptions(wrtEntity, new AttributeResolutionDirectiveSet());
        await wrtEntity.createResolvedEntityAsync('NewEntity', resOpt);
        done();
    });

    /**
     * Tests if ComputeLastModifiedTimeAsync doesn't log errors related to reference validation.
     */
    it('testComputeLastModifiedTimeAsync', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestComputeLastModifiedTimeAsync');

        corpus.setEventCallback((level, msg) => {
            done.fail(new Error(msg));
        }, cdmStatusLevel.error);

        await corpus.computeLastModifiedTimeAsync('local:/default.manifest.cdm.json');
        done();
    });

    /**
     * Tests the FetchObjectAsync function with the StrictValidation off.
     */
    it('testStrictValidationOff', async (done) => {
        const corpus = testHelper.getLocalCorpus(testsSubpath, 'TestStrictValidation');
        corpus.setEventCallback((level, msg) => {
            // when the strict validation is disabled, there should be no reference validation.
            // no error should be logged.
            done.fail(new Error(msg));
        }, cdmStatusLevel.warning);

        // load with strict validation disabled.
        const resOpt = new resolveOptions();
        resOpt.strictValidation = false;
        await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/doc.cdm.json', null, resOpt);

        done();
    });
    
    /**
     * Tests the FetchObjectAsync function with the StrictValidation on.
     */
    it('testStrictValidationOn', async (done) => {
        let errorCount = 0;
        let corpus = testHelper.getLocalCorpus(testsSubpath, 'TestStrictValidation');
        corpus.setEventCallback((level, msg) => {
            if (msg.indexOf('Unable to resolve the reference') != -1) {
                errorCount++;
            } else {
                done.fail(new Error(msg));
            }
        }, cdmStatusLevel.error);

        // load with strict validation.
        let resOpt = new resolveOptions();
        resOpt.strictValidation = true;
        await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/doc.cdm.json', null, resOpt);
        expect(errorCount) 
            .toEqual(1);

        errorCount = 0;
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestStrictValidation');
        corpus.setEventCallback((level, msg) => {
            if (level == cdmStatusLevel.warning && msg.indexOf('Unable to resolve the reference') != -1) {
                errorCount++;
            } else {
                done.fail(new Error(msg));
            }
        }, cdmStatusLevel.warning);

        // load with strict validation and shallow validation.
        resOpt = new resolveOptions();
        resOpt.strictValidation = true;
        resOpt.shallowValidation = true;
        await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/doc.cdm.json', null, resOpt);
        expect(errorCount) 
            .toEqual(1);

        done();
    });
});
