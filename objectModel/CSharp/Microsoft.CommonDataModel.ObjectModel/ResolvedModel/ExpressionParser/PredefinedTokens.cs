// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Predefined tokens
    /// </summary>
    /// <unitTests>PredefinedTokensUnitTest</unitTests>
    internal sealed class PredefinedTokens
    {
        internal static readonly List<Tuple<PredefinedTokenEnum, string, PredefinedType>> SupportedPredefinedTokensList = new List<Tuple<PredefinedTokenEnum, string, PredefinedType>>()
        {
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.ALWAYS, "always", PredefinedType.Token),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.AND, "&&", PredefinedType.Operator),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.OR, "||", PredefinedType.Operator),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.NOT, "!", PredefinedType.NotOperator),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.TRUE, "true", PredefinedType.Constant),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.FALSE, "false", PredefinedType.Constant),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.GT, ">", PredefinedType.Operator),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.LT, "<", PredefinedType.Operator),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.EQ, "==", PredefinedType.Operator),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.NE, "!=", PredefinedType.Operator),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.GE, ">=", PredefinedType.Operator),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.LE, "<=", PredefinedType.Operator),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.DEPTH, "depth", PredefinedType.Token),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.MAXDEPTH, "maxDepth", PredefinedType.Token),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.NOMAXDEPTH, "noMaxDepth", PredefinedType.Token),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.ISARRAY, "isArray", PredefinedType.Token),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.MINCARDINALITY, "cardinality.minimum", PredefinedType.Token),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.MAXCARDINALITY, "cardinality.maximum", PredefinedType.Token),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.REFERENCEONLY, "referenceOnly", PredefinedType.Token),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.NORMALIZED, "normalized", PredefinedType.Token),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.STRUCTURED, "structured", PredefinedType.Token),

            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.OPENPAREN, "(", PredefinedType.OpenParenthesis),
            new Tuple<PredefinedTokenEnum, string, PredefinedType>(PredefinedTokenEnum.CLOSEPAREN, ")", PredefinedType.CloseParenthesis),
        };

        /// <summary>
        /// Create a hash to find a string to type
        /// </summary>
        /// <returns></returns>
        internal static Dictionary<string, PredefinedType> InitializeTextToTypeHash()
        {
            Dictionary<string, PredefinedType> textToTypeHash = new Dictionary<string, PredefinedType>();

            foreach (Tuple<PredefinedTokenEnum, string, PredefinedType> token in SupportedPredefinedTokensList)
            {
                textToTypeHash.Add(token.Item2, token.Item3);
            }

            return textToTypeHash;
        }

        /// <summary>
        /// Create a hash to find a string to token enum
        /// </summary>
        /// <returns></returns>
        internal static Dictionary<string, PredefinedTokenEnum> InitializeTextToTokenHash()
        {
            Dictionary<string, PredefinedTokenEnum> textToTokenHash = new Dictionary<string, PredefinedTokenEnum>();

            foreach (Tuple<PredefinedTokenEnum, string, PredefinedType> token in SupportedPredefinedTokensList)
            {
                textToTokenHash.Add(token.Item2, token.Item1);
            }

            return textToTokenHash;
        }

        /// <usage>FOR UNIT TESTS ONLY</usage>
        /// <summary>
        /// Function to retrieve and cache the list of predefined tokens that are recognized as keywords and are supported directly
        /// </summary>
        /// <returns></returns>
        internal static List<string> GetPredefinedTokens()
        {
            List<string> tokens = new List<string>();

            List<Tuple<PredefinedTokenEnum, string, PredefinedType>> foundTokens = PredefinedTokens.SupportedPredefinedTokensList
                .Where<Tuple<PredefinedTokenEnum, string, PredefinedType>>(token => token.Item3 == PredefinedType.Token)
                .ToList();

            foreach (Tuple<PredefinedTokenEnum, string, PredefinedType> token in foundTokens)
            {
                tokens.Add(token.Item2);
            }

            // Expected: { "always", "depth", "maxDepth", "cardinality.minimum", "cardinality.maximum", "referenceOnly", "normalized", "structured",  }
            return tokens;
        }

        /// <usage>FOR UNIT TESTS ONLY</usage>
        /// <summary>
        /// Function to retrieve and cache the list of supported operators
        /// </summary>
        /// <returns></returns>
        internal static List<string> GetSupportedOperators()
        {
            List<string> operators = new List<string>();

            List<Tuple<PredefinedTokenEnum, string, PredefinedType>> foundOperators = PredefinedTokens.SupportedPredefinedTokensList
                .Where<Tuple<PredefinedTokenEnum, string, PredefinedType>>(op => op.Item3 == PredefinedType.Operator)
                .ToList();

            foreach (Tuple<PredefinedTokenEnum, string, PredefinedType> op in foundOperators)
            {
                operators.Add(op.Item2);
            }

            // Expected: { "&&", "||", ">", "<", "==", "!=", ">=", "<=",  }
            // "!" is captured as PredefinedType.NotOperator and not included here
            return operators;
        }

        /// <usage>FOR UNIT TESTS ONLY</usage>
        /// <summary>
        /// Function to retrieve and cache the supported open and close parenthesis
        /// </summary>
        /// <returns></returns>
        internal static List<string> GetSupportedParenthesis()
        {
            List<string> parenthesis = new List<string>();

            List<Tuple<PredefinedTokenEnum, string, PredefinedType>> foundParenthesis = PredefinedTokens.SupportedPredefinedTokensList
                .Where<Tuple<PredefinedTokenEnum, string, PredefinedType>>(op => (op.Item3 == PredefinedType.OpenParenthesis || op.Item3 == PredefinedType.CloseParenthesis))
                .ToList();

            foreach (Tuple<PredefinedTokenEnum, string, PredefinedType> paren in foundParenthesis)
            {
                parenthesis.Add(paren.Item2);
            }

            // Expected: { "(", ")",  }
            return parenthesis;
        }

        /// <usage>FOR UNIT TESTS ONLY</usage>
        /// <summary>
        /// Function to retrieve and cache the predefined constants
        /// </summary>
        /// <returns></returns>
        internal static List<string> GetPredefinedConstants()
        {
            List<string> constants = new List<string>();

            List<Tuple<PredefinedTokenEnum, string, PredefinedType>> foundConstants = PredefinedTokens.SupportedPredefinedTokensList
                .Where<Tuple<PredefinedTokenEnum, string, PredefinedType>>(constant => constant.Item3 == PredefinedType.Constant)
                .ToList();

            foreach (Tuple<PredefinedTokenEnum, string, PredefinedType> constant in foundConstants)
            {
                constants.Add(constant.Item2);
            }

            // Expected: { "true", "false",  }
            return constants;
        }
    }
}
