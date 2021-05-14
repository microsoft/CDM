// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ExpressionTree } from '../../../ResolvedModel/ExpressionParser/ExpressionTree';
import { InputValues } from '../../../ResolvedModel/ExpressionParser/InputValues';

/**
 * Unit test for ExpressionTree functions
 */
describe('Cdm/Projection/ExpressionTreeUnitTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestExpressionTree';

    /**
     * Test evaluateExpression function
     */
    it('TestEvaluateExpression', () => {
        const inputValues: InputValues = new InputValues(undefined);
        inputValues.maxCardinality = 1;
        inputValues.minCardinality = 0;
        inputValues.maxDepth = 32;
        inputValues.nextDepth = 1;
        inputValues.noMaxDepth = true;
        inputValues.isArray = true;
        inputValues.normalized = false;
        inputValues.referenceOnly = true;
        inputValues.structured = true;

        const exprAndExpectedResultList: [string, boolean][] = [];
        exprAndExpectedResultList.push(['(cardinality.maximum > 1) && (!referenceOnly)', false]);
        exprAndExpectedResultList.push(['', true]);
        exprAndExpectedResultList.push(['  ', true]);
        exprAndExpectedResultList.push(['always', true]);
        exprAndExpectedResultList.push(['!structured', false]);
        exprAndExpectedResultList.push(['referenceOnly || (depth > 5)', true]);
        exprAndExpectedResultList.push(['!(referenceOnly)', false]);
        exprAndExpectedResultList.push(['!(normalized && cardinality.maximum > 1)', true]);
        exprAndExpectedResultList.push(['true', true]);
        exprAndExpectedResultList.push(['(((true==true)))', true]);
        exprAndExpectedResultList.push(['!(normalized && isArray) || noMaxDepth', false]);

        for (const item of exprAndExpectedResultList) {
            const actual: boolean = ExpressionTree.evaluateCondition(item[0], inputValues);
            const expected: boolean = item[1];

            expect(actual)
                .toEqual(expected);
        }
    });
});
