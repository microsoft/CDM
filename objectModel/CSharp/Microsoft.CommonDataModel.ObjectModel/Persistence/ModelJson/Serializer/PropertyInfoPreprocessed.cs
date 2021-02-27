// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Reflection;
using Newtonsoft.Json;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types.Serializer
{
    /// <summary>
    /// Class used to store preprocessed information about a <see cref="PropertyInfo"/>.
    /// The name under which the <see cref="PropertyInfo"/> is to be serialized is the most important part to be preprocessed
    /// because it can either be the name of the <see cref="PropertyInfo"/> or a parameter passed is <see cref="JsonPropertyAttribute"/>.
    /// </summary>
    public class PropertyInfoPreprocessed
    {
        /// <summary>
        /// The name under which the <see cref="PropertyInfo"/> is serialized. 
        /// If <see cref="PropertyInfo"/> has a <see cref="JsonPropertyAttribute"/> with a constructor parameter, this one is used.
        /// Otherwise it is equal with the name of the property
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// The order mentioned in the metadata of the <see cref="PropertyInfo"/>.
        /// This is used to make sure properties are serialized in the expected order.
        /// </summary>
        public int Order { get; }

        /// <summary>
        /// The type of the value stored in the propertyInfo.
        /// </summary>
        public Type Type => propertyInfo.PropertyType;

        /// <summary>
        /// Function to get the value corresponding to this <see cref="PropertyInfo"/> of a given object.
        /// </summary>
        public Func<object, object> FetchValueAtIndex => propertyInfo.GetValue;

        /// <summary>
        /// Function to set the value corresponding to this <see cref="PropertyInfo"/> of a given object.
        /// </summary>
        public Action<object, object> SetValue => propertyInfo.SetValue;

        /// <summary>
        /// The <see cref="PropertyInfo"/> that was preprocessed to generate this instance.
        /// </summary>
        private readonly PropertyInfo propertyInfo;

        /// <summary>
        /// Constructs a <see cref="PropertyInfoPreprocessed"/> by calculating the needed fields of <see cref="PropertyInfo"/>.
        /// </summary>
        /// <param name="propertyInfo"></param>
        public PropertyInfoPreprocessed(PropertyInfo propertyInfo)
        {
            this.propertyInfo = propertyInfo;
            this.Name = PropertyInfoHelper.PropertySerializationName(propertyInfo);
            this.Order = PropertyInfoHelper.GetOrderFromProperty(propertyInfo);
        }
    }
}
