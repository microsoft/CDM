// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { PredefinedTokens } from '../../../ResolvedModel/ExpressionParser/PredefinedTokens';

/**
 * Unit test for PredefinedTokens functions
 */
describe('Cdm/Projection/PredefinedTokensUnitTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestPredefinedTokens';

    it('TestGetPredefinedTokens', () => {
        const tokens: string[] = PredefinedTokens.getPredefinedTokens();

        const expected: string = 'always depth maxDepth noMaxDepth isArray cardinality.minimum cardinality.maximum referenceOnly normalized structured';
        const actual: string = tokens.join(' ');
        expect(actual)
            .toEqual(expected);
    });

    it('TestPredefinedConstants', () => {
        const constants: string[] = PredefinedTokens.getPredefinedConstants();

        const expected: string = 'true false';
        const actual: string = constants.join(' ');
        expect(actual)
            .toEqual(expected);
    });

    it('TestGetSupportedOperators', () => {
        const ops: string[] = PredefinedTokens.getSupportedOperators();

        // all expect the '!' operator since that is tagged separately
        const expected: string = '&& || > < == != >= <=';
        const actual: string = ops.join(' ');
        expect(actual)
            .toEqual(expected);
    });

    it('TestGetSupportedParenthesis', () => {
        const ops: string[] = PredefinedTokens.getSupportedParenthesis();

        const expected: string = '( )';
        const actual: string = ops.join(' ');
        expect(actual)
            .toEqual(expected);
    });
});
