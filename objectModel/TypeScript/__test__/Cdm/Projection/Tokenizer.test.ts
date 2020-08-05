// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { PredefinedType } from '../../../ResolvedModel/ExpressionParser/PredefinedType';
import { Tokenizer } from '../../../ResolvedModel/ExpressionParser/Tokenizer';

/**
 * Unit test for Tokenizer functions
 */
describe('Cdm/Projection/TokenizerUnitTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestTokenizer';

    it('TestGetExpressionAsTokenList', () => {
        const exprAndExpectedList: [string, string][] = [];
        exprAndExpectedList.push(['(cardinality.maximum > 1) && (!referenceOnly)', '( cardinality.maximum > 1 ) && ( ! referenceOnly )']);
        exprAndExpectedList.push(['', '']);
        exprAndExpectedList.push(['  ', '']);
        exprAndExpectedList.push(['always', 'always']);
        exprAndExpectedList.push(['!structured', '! structured']);
        exprAndExpectedList.push(['referenceOnly || (depth > 5)', 'referenceOnly || ( depth > 5 )']);
        exprAndExpectedList.push(['!(referenceOnly)', '! ( referenceOnly )']);
        exprAndExpectedList.push(['!(normalized && cardinality.maximum > 1)', '! ( normalized && cardinality.maximum > 1 )']);
        exprAndExpectedList.push(['true', 'true']);
        exprAndExpectedList.push(['(((true==true)))', '( ( ( true == true ) ) )']);
        exprAndExpectedList.push(['!normalized || (cardinality.maximum <= 1)', '! normalized || ( cardinality.maximum <= 1 )']);
        exprAndExpectedList.push(['!(normalized && cardinality.maximum > 1) && !(structured)', '! ( normalized && cardinality.maximum > 1 ) && ! ( structured )']);
        exprAndExpectedList.push(['!(unknownToken != 1 && cardinality.maximum >                                       1) && !anotherUnknownToken', '! ( unknownToken != 1 && cardinality.maximum > 1 ) && ! anotherUnknownToken']);
        exprAndExpectedList.push(['!(normalized && isArray) || noMaxDepth', '! ( normalized && isArray ) || noMaxDepth']);

        for (const item of exprAndExpectedList) {
            const expected: string = item[1];
            const expTupleList: [any, PredefinedType][] = Tokenizer.getExpressionAsTokenList(item[0]);
            const expList: string[] = [];
            for (const t of expTupleList) {
                expList.push(t[0].toString());
            }
            const actual: string = expList.join(' ');
            expect(actual)
                .toEqual(expected);
        }
    });
});
