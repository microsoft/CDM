// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Class that helps tokenize and identify tokens, operators, and parenthesis
    /// </summary>
    /// <unitTest>TokenizerUnitTest</unitTest>
    internal sealed class Tokenizer
    {
        internal static Dictionary<string, PredefinedType> textToTypeHash = PredefinedTokens.InitializeTextToTypeHash();

        /// <summary>
        /// Tokenize the expression into an array of token, operators and parenthesis
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        internal static List<Tuple<dynamic, PredefinedType>> GetExpressionAsTokenList(string expression)
        {
            // to split an expression as separate tokens may require proper spacing that the user may or may not have provide.
            // e.g. "(((true==true)))" can not be split into { '(', '(', '(', 'true', '==', 'true', ')', ')', ')' },
            // unless it is first appropriately spaced to generate "( ( ( true == true ) ) )"
            // the next 2 for loops do just that.
            foreach (var token in PredefinedTokens.SupportedPredefinedTokensList)
            {
                expression = expression.Replace(token.Item2, $" {token.Item2} ");
            }

            // but this could have resulted in "!=" getting split up as "! =", so fix that
            if (expression.Contains(" ! = "))
            {
                expression = expression.Replace(" ! = ", " != ");
            }
            // but this could have resulted in ">=" getting split up as "> =", so fix that
            if (expression.Contains(" > = "))
            {
                expression = expression.Replace(" > = ", " >= ");
            }
            // but this could have resulted in "<=" getting split up as "< =", so fix that
            if (expression.Contains(" < = "))
            {
                expression = expression.Replace(" < = ", " <= ");
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

            List<Tuple<dynamic, PredefinedType>> list = new List<Tuple<dynamic, PredefinedType>>();

            foreach (string token in expression.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries))
            {
                if (!textToTypeHash.ContainsKey(token))
                {
                    list.Add(new Tuple<dynamic, PredefinedType>(token, PredefinedType.Custom));
                }
                else
                {
                    switch (textToTypeHash[token])
                    {
                        case PredefinedType.Token:
                            list.Add(new Tuple<dynamic, PredefinedType>(token, PredefinedType.Token));
                            break;
                        case PredefinedType.Constant:
                            list.Add(new Tuple<dynamic, PredefinedType>(token, PredefinedType.Constant));
                            break;
                        case PredefinedType.OpenParenthesis:
                            list.Add(new Tuple<dynamic, PredefinedType>(token, PredefinedType.OpenParenthesis));
                            break;
                        case PredefinedType.CloseParenthesis:
                            list.Add(new Tuple<dynamic, PredefinedType>(token, PredefinedType.CloseParenthesis));
                            break;
                        case PredefinedType.NotOperator:
                            list.Add(new Tuple<dynamic, PredefinedType>(token, PredefinedType.NotOperator));
                            break;
                        case PredefinedType.Operator:
                            list.Add(new Tuple<dynamic, PredefinedType>(token, PredefinedType.Operator));
                            break;
                        case PredefinedType.Custom:
                        default:
                            throw new NotImplementedException("It should not have come to this!");
                    }
                }
            }

            return list;
        }
    }
}
