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
    }
}
