// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using System;

    internal static class StringUtils
    {
        public static string Slice(this string str, int startIdx, int endIdx)
        {
            return str.Substring(startIdx, endIdx - startIdx);
        }

        public static string Slice(this string str, int startIdx)
        {
            return str.Substring(startIdx);
        }

        public static bool EndWithOrdinalIgnoreCase(this string str, string specifiedStr)
        {
            return str.EndsWith(specifiedStr, StringComparison.OrdinalIgnoreCase);
        }

        public static bool EqualsWithOrdinalIgnoreCase(this string strA, string strB)
        {
            return strA.Equals(strB, StringComparison.OrdinalIgnoreCase);
        }

        public static int CompareWithOrdinalIgnoreCase(string strA, string strB)
        {
            return string.Compare(strA, strB, StringComparison.OrdinalIgnoreCase);
        }

        public static bool EqualsWithIgnoreCase(this string strA, string strB)
        {
            return strA.Equals(strB, StringComparison.InvariantCultureIgnoreCase);
        }

        public static bool EqualsWithCase(this string strA, string strB)
        {
            return strA.Equals(strB, StringComparison.InvariantCulture);
        }

        /// <summary>
        /// Capitalizes first letter of the given string.
        /// </summary>
        /// <param name="str">The source string to be capitalized.</param>
        /// <returns>The capitalized string which the first letter is upper-cased.</returns>
        public static string CapitalizeValue(this string str)
        {
            if (string.IsNullOrWhiteSpace(str)) 
                return str;
            return char.ToUpper(str[0]) + (str.Length > 1 ? str.Slice(1) : "");
        }

        /// <summary>
        /// Replaces in the pattern in the source with the value.
        /// </summary>
        /// <param name="source">The source string.</param>
        /// <param name="pattern">A pattern in the format {p}. The code will try to find {p} and {P}.</param>
        /// <param name="value">The value to be replaced instead of the pattern.</param>
        /// <returns></returns>
        public static string Replace(string source, string pattern, string value)
        {
            if (value == null)
            {
                value = "";
            }

            string lowerCasePattern = pattern.ToLower();
            string upperCasePattern = pattern.CapitalizeValue();
            string upperCaseValue = !string.IsNullOrEmpty(value) ? value.CapitalizeValue() : "";

            string result = source.Replace($"{{{lowerCasePattern}}}", value);
            return result.Replace($"{{{upperCasePattern}}}", upperCaseValue);
        }
    }
}
