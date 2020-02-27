// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json;
using System;
using System.Reflection;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types.Serializer
{
    /// <summary>
    /// Class storing helper functions related to <see cref="PropertyInfo"/>.
    /// </summary>
    public static class PropertyInfoHelper
    {
        /// <summary>
        /// Retrieves first attribute of a Property that has a given type, or null if there is no such attribute.
        /// </summary>
        /// <param name="property">The property to look for an attribute into.</param>
        /// <param name="attributeType">The type of the attribute we are interested in.</param>
        /// <returns>The first attribute of the property that has the given type or null if no such attribute was found.</returns>
        private static CustomAttributeData GetPropertyAttribute(PropertyInfo property, Type attributeType)
        {
            var attributes = property.CustomAttributes;
            foreach (var attribute in attributes)
            {
                if (attribute.AttributeType == attributeType)
                {
                    return attribute;
                }
            }

            return null;
        }

        /// <summary>
        /// Retrieves the "order" of a property. If property has no "order" attribute, -1 is returned (same behavior as default serializer).
        /// </summary>
        /// <param name="property">The property we want to look for order attribute into.</param>
        /// <returns>The value of the order attribute as it was written when the class was defined, or -1 if no such attribute was found.</returns>
        public static int GetOrderFromProperty(PropertyInfo property)
        {
            int defaultOrderValue = -1;
            var jsonPropertyAttribute = GetPropertyAttribute(property, typeof(JsonPropertyAttribute));
            if (jsonPropertyAttribute?.NamedArguments == null)
            {
                return defaultOrderValue;
            }

            foreach (var namedArgument in jsonPropertyAttribute.NamedArguments)
            {
                if (String.Compare(namedArgument.MemberName, "Order") == 0 && namedArgument.TypedValue.Value != null)
                {
                    return (int)namedArgument.TypedValue.Value;
                }
            }

            return defaultOrderValue;
        }

        /// <summary>
        /// Checks whether the property should be ignored by the serializer
        /// </summary>
        /// <param name="property">The property that should be checked.</param>
        /// <returns>True if the property has <see cref="JsonIgnoreAttribute"/></returns>
        static public bool PropertyIsIgnore(PropertyInfo property)
        {
            return GetPropertyAttribute(property, typeof(JsonIgnoreAttribute)) != null;
        }

        /// <summary>
        /// Fetches the name under which the property should be serialized.
        /// </summary>
        /// <param name="property">The property that is to be serialized</param>
        /// <returns>Either the argument of <see cref="JsonPropertyAttribute"/> or the name of the property.</returns>
        static public string PropertySerializationName(PropertyInfo property)
        {
            var jsonPropertyAttribute = GetPropertyAttribute(property, typeof(JsonPropertyAttribute));
            if (jsonPropertyAttribute?.ConstructorArguments?.Count > 0)
            {
                return jsonPropertyAttribute.ConstructorArguments[0].Value.ToString();
            }
            return property.Name;
        }
    }
}
