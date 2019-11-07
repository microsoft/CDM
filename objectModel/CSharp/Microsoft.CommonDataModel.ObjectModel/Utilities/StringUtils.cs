//-----------------------------------------------------------------------
// <copyright file="StringUtils.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
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
    }
}
