// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StorageAdapterBase } from 'Storage/StorageAdapterBase';

import {
    CdmCorpusDefinition,
    CdmEntityDefinition,
    cdmStatusLevel
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { resolutionTestUtils } from './ResolutionTestUtils';

/**
 * Tests to verify if resolution of trait groups performs as expected.
 */
describe('Cdm/Resolution/EntityResolutionTraitGroupTest', () => {
    const testsSubpath: string = 'Cdm/Resolution/EntityResolutionTest';

    /**
     * Verify success case and make sure the entities are resolved
     */
    it('TestResolvedTraitGroupE2E', async () => {
        await resolutionTestUtils.resolveSaveDebuggingFileAndAssert(testsSubpath, 'TestResolvedTraitGroup', 'E2EResolution');
    });

    /**
     * Verify that the traits are assigned appropriately.
     * AND no errors or warnings are thrown.
     * If the optional traitgroups are not ignored, then this will fail.
     */
    it('TestTraitsFromTraitGroup', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestResolvedTraitGroup');

        cdmCorpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => { 
            if (message.indexOf('Resolution guidance is being deprecated in favor of Projections.') === -1){
                fail(`Received ${statusLevel} message: ${message}`);
            }
        }, cdmStatusLevel.warning);

        const ent = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>('local:/E2EResolution/Contact.cdm.json/Contact');
        await ent.createResolvedEntityAsync('Contact_');
    });
});
