// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { 
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
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
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, "TestResolveSymbolReference");
        corpus.setEventCallback((level, msg) => {
            done.fail(new Error(msg));
        }, cdmStatusLevel.warning);

        const wrtEntity = await corpus.fetchObjectAsync<CdmEntityDefinition>("local:/wrtEntity.cdm.json/wrtEntity");
        const resOpt = new resolveOptions(wrtEntity, new AttributeResolutionDirectiveSet());
        await wrtEntity.createResolvedEntityAsync("NewEntity", resOpt);
        done();
    });

    /**
     * Tests if ComputeLastModifiedTimeAsync doesn't log errors related to reference validation.
     */
    it('testComputeLastModifiedTimeAsync', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, "TestComputeLastModifiedTimeAsync");

        corpus.setEventCallback((level, msg) => {
            done.fail(new Error(msg));
        }, cdmStatusLevel.error);

        await corpus.computeLastModifiedTimeAsync("local:/default.manifest.cdm.json");
        done();
    });
});
