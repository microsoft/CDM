// Copyright [c] Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { PredefinedTokenEnum } from './PredefinedTokenEnum';
import { PredefinedType } from './PredefinedType';

/**
 * Predefined tokens
 * @internal
 */
export class PredefinedTokens {
    /**
     * @internal
     */
    public static readonly supportedPredefinedTokensList: [PredefinedTokenEnum, string, PredefinedType][] = [
        [PredefinedTokenEnum.ALWAYS, 'always', PredefinedType.token],
        [PredefinedTokenEnum.AND, '&&', PredefinedType.operator],
        [PredefinedTokenEnum.OR, '||', PredefinedType.operator],
        [PredefinedTokenEnum.NOT, '!', PredefinedType.notOperator],
        [PredefinedTokenEnum.TRUE, 'true', PredefinedType.constant],
        [PredefinedTokenEnum.FALSE, 'false', PredefinedType.constant],
        [PredefinedTokenEnum.GT, '>', PredefinedType.operator],
        [PredefinedTokenEnum.LT, '<', PredefinedType.operator],
        [PredefinedTokenEnum.EQ, '==', PredefinedType.operator],
        [PredefinedTokenEnum.NE, '!=', PredefinedType.operator],
        [PredefinedTokenEnum.GE, '>=', PredefinedType.operator],
        [PredefinedTokenEnum.LE, '<=', PredefinedType.operator],
        [PredefinedTokenEnum.DEPTH, 'depth', PredefinedType.token],
        [PredefinedTokenEnum.MAXDEPTH, 'maxDepth', PredefinedType.token],
        [PredefinedTokenEnum.NOMAXDEPTH, 'noMaxDepth', PredefinedType.token],
        [PredefinedTokenEnum.ISARRAY, 'isArray', PredefinedType.token],
        [PredefinedTokenEnum.MINCARDINALITY, 'cardinality.minimum', PredefinedType.token],
        [PredefinedTokenEnum.MAXCARDINALITY, 'cardinality.maximum', PredefinedType.token],
        [PredefinedTokenEnum.REFERENCEONLY, 'referenceOnly', PredefinedType.token],
        [PredefinedTokenEnum.NORMALIZED, 'normalized', PredefinedType.token],
        [PredefinedTokenEnum.STRUCTURED, 'structured', PredefinedType.token],
        [PredefinedTokenEnum.VIRTUAL, 'virtual', PredefinedType.token],
        [PredefinedTokenEnum.OPENPAREN, '(', PredefinedType.openParenthesis],
        [PredefinedTokenEnum.CLOSEPAREN, ')', PredefinedType.closeParenthesis],
    ];

    /**
     * Create a hash to find a string to type
     * @internal
     */
    public static initializeTextToTypeHash(): Map<string, PredefinedType> {
        const textToTypeHash: Map<string, PredefinedType> = new Map<string, PredefinedType>();

        for (const token of PredefinedTokens.supportedPredefinedTokensList) {
            textToTypeHash.set(token[1], token[2]);
        }

        return textToTypeHash;
    }

    /**
     * Create a hash to find a string to token enum
     * @internal
     */
    public static initializeTextToTokenHash(): Map<string, PredefinedTokenEnum> {
        const textToTokenHash: Map<string, PredefinedTokenEnum> = new Map<string, PredefinedTokenEnum>();

        for (const token of PredefinedTokens.supportedPredefinedTokensList) {
            textToTokenHash.set(token[1], token[0]);
        }

        return textToTokenHash;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the list of predefined tokens that are recognized as keywords and are supported directly
     * @internal
     */
    public static getPredefinedTokens(): string[] {
        const tokens: string[] = [];

        const foundTokens: [PredefinedTokenEnum, string, PredefinedType][] = PredefinedTokens.supportedPredefinedTokensList
            .filter((token: [PredefinedTokenEnum, string, PredefinedType]) => token[2] === PredefinedType.token);

        for (const token of foundTokens) {
            tokens.push(token[1]);
        }

        // Expected: { "always", "depth", "maxDepth", "cardinality.minimum", "cardinality.maximum", "referenceOnly", "normalized", "structured",  }
        return tokens;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the list of supported operators
     * @internal
     */
    public static getSupportedOperators(): string[] {
        const operators: string[] = [];

        const foundOperators: [PredefinedTokenEnum, string, PredefinedType][] = PredefinedTokens.supportedPredefinedTokensList
            .filter((token: [PredefinedTokenEnum, string, PredefinedType]) => token[2] === PredefinedType.operator);

        for (const op of foundOperators) {
            operators.push(op[1]);
        }

        // Expected: { "&&", "||", ">", "<", "==", "!=", ">=", "<=",  }
        // "!" is captured as PredefinedType.NotOperator and not included here
        return operators;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the supported open and close parenthesis
     * @internal
     */
    public static getSupportedParenthesis(): string[] {
        const parenthesis: string[] = [];

        const foundParenthesis: [PredefinedTokenEnum, string, PredefinedType][] = PredefinedTokens.supportedPredefinedTokensList
            .filter((token: [PredefinedTokenEnum, string, PredefinedType]) => token[2] === PredefinedType.openParenthesis || token[2] === PredefinedType.closeParenthesis);

        for (const paren of foundParenthesis) {
            parenthesis.push(paren[1]);
        }

        // Expected: { "(", ")",  }
        return parenthesis;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the predefined constants
     * @internal
     */
    public static getPredefinedConstants(): string[] {
        const constants: string[] = [];

        const foundConstants: [PredefinedTokenEnum, string, PredefinedType][] = PredefinedTokens.supportedPredefinedTokensList
            .filter((token: [PredefinedTokenEnum, string, PredefinedType]) => token[2] === PredefinedType.constant);

        for (const constant of foundConstants) {
            constants.push(constant[1]);
        }

        // Expected: { "true", "false",  }
        return constants;
    }
}
