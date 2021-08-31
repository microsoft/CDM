// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    cdmStatusLevel
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * Tests all the projections will not break the OM even if not implemented.
 */
describe('Cdm/Projection/ForwardCompatibility', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ForwardCompatibilityTest';

    /**
     * Tests running all the projections (includes projections that are not implemented).
     */
    it('TestAllOperations', async () => {
        const testName: string = 'TestAllOperations';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('Projection operation not implemented yet.') === -1) {
                fail(`Some unexpected failure - ${message}!`);
            }
        }, cdmStatusLevel.error);

        await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, [ 'referenceOnly' ]);
    });
});
