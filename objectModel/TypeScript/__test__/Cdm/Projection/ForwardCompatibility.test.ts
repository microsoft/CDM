// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmEntityDefinition,
    cdmStatusLevel
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { AttributeContextUtil } from './AttributeContextUtil';

/**
 * Tests all the projections will not break the OM even if not implemented.
 */
describe('Cdm/Projection/ForwardCompatibility', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestForwardCompatibility';

    /**
     * Tests running all the projections (includes projections that are not implemented).
     */
    it('TestAllOperations', async () => {
        const testName: string = 'TestAllOperations';
        const entityName: string = testName;

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('Projection operation not implemented yet.') === -1) {
                fail(`Some unexpected failure - ${message}!`);
            }
        }, cdmStatusLevel.error);

        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);

        const entTestEntityStringReference: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        expect(entTestEntityStringReference)
            .toBeTruthy();
        const resolvedTestEntityStringReference: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entTestEntityStringReference, [ 'referenceOnly' ]);
        expect(resolvedTestEntityStringReference)
            .toBeTruthy();
        AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityStringReference);
    });
});
