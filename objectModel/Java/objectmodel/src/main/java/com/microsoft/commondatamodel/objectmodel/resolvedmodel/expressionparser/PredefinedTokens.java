// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Predefined tokens
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class PredefinedTokens {

    /**
     * @deprecated This field is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static final List<List<Object>> supportedPredefinedTokensList = new ArrayList<>(
        Arrays.asList(
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.ALWAYS, "always", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.AND, "&&", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.OR, "||", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.NOT, "!", PredefinedType.NotOperator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.TRUE, "true", PredefinedType.Constant)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.FALSE, "false", PredefinedType.Constant)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.GT, ">", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.LT, "<", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.EQ, "==", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.NE, "!=", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.GE, ">=", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.LE, "<=", PredefinedType.Operator)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.DEPTH, "depth", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.MAXDEPTH, "maxDepth", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.NOMAXDEPTH, "noMaxDepth", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.ISARRAY, "isArray", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.MINCARDINALITY, "cardinality.minimum", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.MAXCARDINALITY, "cardinality.maximum", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.REFERENCEONLY, "referenceOnly", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.NORMALIZED, "normalized", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.STRUCTURED, "structured", PredefinedType.Token)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.OPENPAREN, "(", PredefinedType.OpenParenthesis)),
            new ArrayList<>(Arrays.asList(PredefinedTokenEnum.CLOSEPAREN, ")", PredefinedType.CloseParenthesis))
        )
    );

    /**
     * Create a hash to find a string to type
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static Map<String, PredefinedType> initializeTextToTypeHash() {
        Map<String, PredefinedType> textToTypeHash = new HashMap<>();

        for (List<Object> token : supportedPredefinedTokensList) {
            textToTypeHash.put((String) token.get(1), (PredefinedType) token.get(2));
        }

        return textToTypeHash;
    }

    /**
     * Create a hash to find a string to token enum
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static Map<String, PredefinedTokenEnum> initializeTextToTokenHash() {
        Map<String, PredefinedTokenEnum> textToTokenHash = new HashMap<>();

        for (List<Object> token : supportedPredefinedTokensList) {
            textToTokenHash.put((String) token.get(1), (PredefinedTokenEnum) token.get(0));
        }

        return textToTokenHash;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the list of predefined tokens that are recognized as keywords and are supported directly
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static List<String> getPredefinedTokens() {
        List<String> tokens = new ArrayList<String>();

        List<List<Object>> foundTokens = PredefinedTokens.supportedPredefinedTokensList
            .stream()
            .filter(token -> token.get(2) == PredefinedType.Token)
            .collect(Collectors.toList());

        for (List<Object> token : foundTokens) {
            tokens.add((String) token.get(1));
        }

        // Expected: { "always", "depth", "maxDepth", "cardinality.minimum", "cardinality.maximum", "referenceOnly", "normalized", "structured",  }
        return tokens;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the list of supported operators
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static List<String> getSupportedOperators() {
        List<String> operators = new ArrayList<String>();

        List<List<Object>> foundOperators = PredefinedTokens.supportedPredefinedTokensList
            .stream()
            .filter(op -> op.get(2) == PredefinedType.Operator)
            .collect(Collectors.toList());

        for (List<Object> op : foundOperators) {
            operators.add((String) op.get(1));
        }

        // Expected: { "&&", "||", ">", "<", "==", "!=", ">=", "<=",  }
        // "!" is captured as PredefinedType.NotOperator and not included here
        return operators;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the supported open and close parenthesis
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static List<String> getSupportedParenthesis() {
        List<String> parenthesis = new ArrayList<String>();

        List<List<Object>> foundParenthesis = PredefinedTokens.supportedPredefinedTokensList
            .stream()
            .filter(op -> op.get(2) == PredefinedType.OpenParenthesis || op.get(2) == PredefinedType.CloseParenthesis)
            .collect(Collectors.toList());

        for (List<Object> paren : foundParenthesis){
            parenthesis.add((String) paren.get(1));
        }

        // Expected: { "(", ")",  }
        return parenthesis;
    }

    /**
     * FOR UNIT TESTS ONLY
     * Function to retrieve and cache the predefined constants
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static List<String> getPredefinedConstants() {
        List<String> constants = new ArrayList<String>();

        List<List<Object>> foundConstants = PredefinedTokens.supportedPredefinedTokensList
            .stream()
            .filter(constant -> constant.get(2) == PredefinedType.Constant)
            .collect(Collectors.toList());

        for (List<Object> constant : foundConstants) {
            constants.add((String) constant.get(1));
        }

        // Expected: { "true", "false",  }
        return constants;
    }
}
