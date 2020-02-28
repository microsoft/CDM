// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
