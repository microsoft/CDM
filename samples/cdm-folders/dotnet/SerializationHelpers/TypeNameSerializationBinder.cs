// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries.SerializationHelpers
{
    using System;
    using Newtonsoft.Json.Serialization;

    /// <summary>
    /// TypeNameSerializationBinder
    /// </summary>
    public class TypeNameSerializationBinder : ISerializationBinder
    {
        /// <inheritdoc/>
        public void BindToName(Type serializedType, out string assemblyName, out string typeName)
        {
            TypeNameSerializationBinderHelper.BindToName(serializedType, out assemblyName, out typeName);
        }

        /// <inheritdoc/>
        public Type BindToType(string assemblyName, string typeName)
        {
            return TypeNameSerializationBinderHelper.BindToType(assemblyName, typeName);
        }
    }
}
