// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using System.Reflection;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types.Serializer
{
    /// <summary>
    /// Preprocessed info about a type.
    /// This is used to speed up serialization and deserialization by <see cref="CustomSerializer"/>.
    /// </summary>
    public class TypeInfoPreprocessed
    {
        /// <summary>
        ///  Used to compare <see cref="PropertyInfoPreprocessed"/> by Order metadata property.
        ///  This will help serialize fields in desired order.
        /// </summary>
        private class PropertyComparerByOrder : IComparer<PropertyInfoPreprocessed>
        {
            /// <summary>
            /// Compares two properties by Order metadata property.
            /// </summary>
            /// <param name="x">First property to be compared</param>
            /// <param name="y">Second property to be compared</param>
            /// <returns>Result of comparison as integer.</returns>
            public int Compare(PropertyInfoPreprocessed x, PropertyInfoPreprocessed y)
            {
                return x.Order - y.Order;
            }
        }

        /// <summary>
        /// The <see cref="PropertyInfoPreprocessed"/> as a list sorted by "Order" metadata of <see cref="PropertyInfo"/>.
        /// </summary>
        public List<PropertyInfoPreprocessed> ListOfProperties { get; }

        /// <summary>
        /// Same <see cref="PropertyInfoPreprocessed"/> as those stored in the <see cref="ListOfProperties"/>,
        /// but this time as a dictionary for easy access by the name under which the <see cref="PropertyInfo"/> is to be serialized.
        /// </summary>
        public Dictionary<string, PropertyInfoPreprocessed> NameToPropertyDictionary { get; }

        /// <summary>
        /// Constructs a <see cref="TypeInfoPreprocessed"/> by calculating the data of a <see cref="Type"/> needed for the <see cref="CustomSerializer"/>
        /// </summary>
        /// <param name="type">The <see cref="Type"/> to be processed.</param>
        public TypeInfoPreprocessed(Type type)
        {
            var destinationProperties = type.GetProperties();
            this.ListOfProperties = new List<PropertyInfoPreprocessed>();
            this.NameToPropertyDictionary = new Dictionary<string, PropertyInfoPreprocessed>();
            foreach (var property in destinationProperties)
            {
                this.Add(property);
            };

            this.ListOfProperties.Sort(new PropertyComparerByOrder());
        }

        /// <summary>
        /// Processes a <see cref="PropertyInfo"/> and adds <see cref="PropertyInfoPreprocessed"/> to the two data structures concerned: <see cref="ListOfProperties"/> and <see cref="NameToPropertyDictionary"/>
        /// </summary>
        /// <param name="propertyInfo">The <see cref="PropertyInfo"/> to be processed.</param>
        private void Add(PropertyInfo propertyInfo)
        {
            if (PropertyInfoHelper.PropertyIsIgnore(propertyInfo)){
                return;
            }

            PropertyInfoPreprocessed propertyInfoPreprocessed = new PropertyInfoPreprocessed(propertyInfo);

            this.ListOfProperties.Add(propertyInfoPreprocessed);
            NameToPropertyDictionary.Add(propertyInfoPreprocessed.Name, propertyInfoPreprocessed);
        }

    }
}
