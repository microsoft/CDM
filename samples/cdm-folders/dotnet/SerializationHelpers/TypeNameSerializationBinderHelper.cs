// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries.SerializationHelpers
{
    using System;

    /// <summary>
    /// TypeNameSerializationBinderHelper
    /// </summary>
    public class TypeNameSerializationBinderHelper
    {
        /// <summary>
        /// BindToName
        /// </summary>
        /// <param name="serializedType">serializedType</param>
        /// <param name="assemblyName">assemblyName</param>
        /// <param name="typeName">typeName</param>
        public static void BindToName(Type serializedType, out string assemblyName, out string typeName)
        {
            assemblyName = null;
            typeName = serializedType.Name;
        }

        /// <summary>
        /// BindToType
        /// </summary>
        /// <param name="assemblyName">assemblyName</param>
        /// <param name="typeName">typeName</param>
        /// <returns>Type</returns>
        public static Type BindToType(string assemblyName, string typeName)
        {
            string resolvedTypeName = $"{typeof(MetadataObject).Namespace}.{typeName}, {typeof(MetadataObject).Assembly}";
            return Type.GetType(resolvedTypeName, true);
        }
    }
}
