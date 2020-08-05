// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Class that helps tokenize and identify tokens, operators, and parenthesis
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class Tokenizer {
    /**
     * @deprecated This field is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static Map<String, PredefinedType> textToTypeHash = PredefinedTokens.initializeTextToTypeHash();

    /**
     * Tokenize the expression into an array of token, operators and parenthesis
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static List<List<Object>> getExpressionAsTokenList(String expression) {
        // to split an expression as separate tokens may require proper spacing that the user may or may not have provide.
        // e.g. "(((true==true)))" can not be split into { '(', '(', '(', 'true', '==', 'true', ')', ')', ')' },
        // unless it is first appropriately spaced to generate "( ( ( true == true ) ) )"
        // the next 2 for loops do just that.
        for (List<Object> token : PredefinedTokens.supportedPredefinedTokensList) {
            expression = expression.replace((String) token.get(1), " " + token.get(1) + " ");
        }

        // but this could have resulted in "!=" getting split up as "! =", so fix that
        if (expression.contains(" ! = ")) {
            expression = expression.replace(" ! = ", " != ");
        }
        // but this could have resulted in ">=" getting split up as "> =", so fix that
        if (expression.contains(" > = ")) {
            expression = expression.replace(" > = ", " >= ");
        }
        // but this could have resulted in "<=" getting split up as "< =", so fix that
        if (expression.contains(" < = ")) {
            expression = expression.replace(" < = ", " <= ");
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

        List<List<Object>> list = new ArrayList<>();

        for (String token : Arrays.asList(expression.split(" ")).stream().filter(str -> !str.isEmpty()).collect(Collectors.toList())) {
            if (!textToTypeHash.containsKey(token)) {
                list.add(new ArrayList<>(Arrays.asList(token, PredefinedType.Custom)));
            } else {
                switch (textToTypeHash.get(token)) {
                    case Token:
                        list.add(new ArrayList<>(Arrays.asList(token, PredefinedType.Token)));
                        break;
                    case Constant:
                        list.add(new ArrayList<>(Arrays.asList(token, PredefinedType.Constant)));
                        break;
                    case OpenParenthesis:
                        list.add(new ArrayList<>(Arrays.asList(token, PredefinedType.OpenParenthesis)));
                        break;
                    case CloseParenthesis:
                        list.add(new ArrayList<>(Arrays.asList(token, PredefinedType.CloseParenthesis)));
                        break;
                    case NotOperator:
                        list.add(new ArrayList<>(Arrays.asList(token, PredefinedType.NotOperator)));
                        break;
                    case Operator:
                        list.add(new ArrayList<>(Arrays.asList(token, PredefinedType.Operator)));
                        break;
                    case Custom:
                    default:
                        throw new UnsupportedOperationException("It should not have come to this!");
                }
            }
        }

        return list;
    }
}
