using System;
using System.Collections.Generic;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types.Serializer
{
    /// <summary>
    /// Class used to store data that helps the <see cref="CustomSerializer"/>.
    /// </summary>
    public static class SerializerHelper
    {
        /// <summary>
        /// Dictionary used to store the preprocessed data for a type.
        /// This data could be calculated on demand, but it is stored for future uses to improve speed.
        /// </summary>
        private static readonly Dictionary<Type, TypeInfoPreprocessed> TypeInfoDictionary = new Dictionary<Type, TypeInfoPreprocessed>();

        /// <summary>
        /// Gets the information about a type that would help serializer.
        /// Fetches the data from a dictionary if they were processed before.
        /// </summary>
        /// <param name="type">The type to be processed.</param>
        /// <returns>The processed data about the type passed as argument.</returns>
        public static TypeInfoPreprocessed GetTypeInfo(Type type)
        {
            if (TypeInfoDictionary.ContainsKey(type))
            {
                return TypeInfoDictionary[type];
            }

            var typeInfo = new TypeInfoPreprocessed(type);
            TypeInfoDictionary.Add(type, typeInfo);
            return typeInfo;
        }
    }
}