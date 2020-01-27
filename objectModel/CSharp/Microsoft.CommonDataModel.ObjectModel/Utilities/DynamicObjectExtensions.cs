//-----------------------------------------------------------------------
// <copyright file="DynamicObjectExtension.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using System;
    using System.Collections.Generic;
    using System.Dynamic;

    internal static class DynamicObjectExtensions
    {
        internal static bool HasProperty(dynamic obj, string propertyName)
        {
            Type objType = obj.GetType();

            if (objType == typeof(ExpandoObject))
            {
                return ((IDictionary<string, object>)obj).ContainsKey(propertyName);
            }

            return objType.GetProperty(propertyName) != null;
        }
    }
}
