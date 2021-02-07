// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ExpressionTree } from '../../../ResolvedModel/ExpressionParser/ExpressionTree';
import { InputValues } from '../../../ResolvedModel/ExpressionParser/InputValues';
import { Node } from '../../../ResolvedModel/ExpressionParser/Node';

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
        const input: InputValues = new InputValues();
        input.maxCardinality = 1;
        input.minCardinality = 0;
        input.maxDepth = 32;
        input.nextDepth = 1;
        input.noMaxDepth = true;
        input.isArray = true;
        input.normalized = false;
        input.referenceOnly = true;
        input.structured = true;

        const exprAndExpectedResultList: [string, string][] = [];
        exprAndExpectedResultList.push(['(cardinality.maximum > 1) && (!referenceOnly)', 'false']);
        exprAndExpectedResultList.push(['', 'false']);
        exprAndExpectedResultList.push(['  ', 'false']);
        exprAndExpectedResultList.push(['always', 'true']);
        exprAndExpectedResultList.push(['!structured', 'false']);
        exprAndExpectedResultList.push(['referenceOnly || (depth > 5)', 'true']);
        exprAndExpectedResultList.push(['!(referenceOnly)', 'false']);
        exprAndExpectedResultList.push(['!(normalized && cardinality.maximum > 1)', 'true']);
        exprAndExpectedResultList.push(['true', 'true']);
        exprAndExpectedResultList.push(['(((true==true)))', 'true']);
        exprAndExpectedResultList.push(['!(normalized && isArray) || noMaxDepth', 'false']);

        for (const item of exprAndExpectedResultList) {
            const tree: ExpressionTree = new ExpressionTree();
            const treeTop: Node = tree.constructExpressionTree(item[0]);
            const expected: string = item[1];
            const actual: string = ExpressionTree.evaluateExpressionTree(treeTop, input).toString();

            expect(actual)
                .toEqual(expected);
        }
    });
});
