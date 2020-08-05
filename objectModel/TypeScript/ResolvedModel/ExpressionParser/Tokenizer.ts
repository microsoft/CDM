// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { PredefinedTokens } from './PredefinedTokens';
import { PredefinedType } from './PredefinedType';

/**
 * Class that helps tokenize and identify tokens, operators, and parenthesis
 * @internal
 */
export class Tokenizer {
    /**
     * @internal
     */
    public static textToTypeHash: Map<string, PredefinedType> = PredefinedTokens.initializeTextToTypeHash();

    /**
     * Tokenize the expression into an array of token, operators and parenthesis
     * @internal
     */
    public static getExpressionAsTokenList(expression: string): [any, PredefinedType][] {
        // to split an expression as separate tokens may require proper spacing that the user may or may not have provide.
        // e.g. "(((true==true)))" can not be split into { '(', '(', '(', 'true', '==', 'true', ')', ')', ')' },
        // unless it is first appropriately spaced to generate "( ( ( true == true ) ) )"
        // the next 2 for loops do just that.
        for (const token of PredefinedTokens.supportedPredefinedTokensList) {
                expression = expression.split(token[1]).join(` ${token[1]} `);
        }

        // but this could have resulted in "!=" getting split up as "! =", so fix that
        if (expression.includes(' ! = ')) {
            expression = expression.split(' ! = ').join(' != ');
        }
        // but this could have resulted in ">=" getting split up as "> =", so fix that
        if (expression.includes(' > = ')) {
            expression = expression.split(' > = ').join(' >= ');
        }
        // but this could have resulted in "<=" getting split up as "< =", so fix that
        if (expression.includes(' < = ')) {
            expression = expression.split(' < = ').join(' <= ');
        }

        // now, split this into separate tokens and return as list
        // here are some samples:
        //     "" results in ==>
        //         {  }
        //     "  " results in ==>
        //         {  }
        //     "always" results in ==>
        //         { "always" }
        //     "!structured" results in ==>
        //         { "!", "structured" }
        //     "referenceOnly || (depth > 5)" results in ==>
        //         { "referenceOnly", "||", "(", "depth", ">", "5", ")" }
        //     "!normalized || (cardinality.maximum <= 1)" results in ==>
        //         { "!", "normalized", "||", "(", "cardinality.maximum", "<", "=", "1", ")" }
        //     "!(referenceOnly)" results in ==>
        //         { "!", "(", "referenceOnly", ")" }
        //     "!(normalized && cardinality.maximum > 1)" results in ==>
        //         { "!", "(", "normalized", "&&", "cardinality.maximum", ">", "1", ")" }
        //     "!(normalized && cardinality.maximum > 1) && !(structured)" results in ==>
        //         { "!", "(", "normalized", "&&", "cardinality.maximum", ">", "1", ")", "&&", "!", "(", "structured", ")" }
        //     "!(unknownToken != 1 && cardinality.maximum >                                       1) && !anotherUnknownToken" results in ==>
        //         { "!", "(", "unknownToken", "!=", "1", "&&", "cardinality.maximum", ">", "1", ")", "&&", "!", "anotherUnknownToken" }
        //     "true" results in ==>
        //         { "true" }
        //     "(((true==true)))" results in ==>
        //         { "(", "(", "(", "true", "==", "true", ")", ")", ")" }

        const list: [any, PredefinedType][] = [];

        for (const token of expression.split(' ').filter((x: string) => x)) {
            if (!Tokenizer.textToTypeHash.has(token)) {
                list.push([token, PredefinedType.custom]);
            } else {
                switch (Tokenizer.textToTypeHash.get(token)) {
                    case PredefinedType.token:
                        list.push([token, PredefinedType.token]);
                        break;
                    case PredefinedType.constant:
                        list.push([token, PredefinedType.constant]);
                        break;
                    case PredefinedType.openParenthesis:
                        list.push([token, PredefinedType.openParenthesis]);
                        break;
                    case PredefinedType.closeParenthesis:
                        list.push([token, PredefinedType.closeParenthesis]);
                        break;
                    case PredefinedType.notOperator:
                        list.push([token, PredefinedType.notOperator]);
                        break;
                    case PredefinedType.operator:
                        list.push([token, PredefinedType.operator]);
                        break;
                    case PredefinedType.custom:
                    default:
                        throw new Error('It should not have come to this!');
                }
            }
        }

        return list;
    }
}
