// <copyright file="TypeNameSerializationBinder.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.SerializationHelpers
{
    using System;
    using System.Linq;
    using System.Reflection;
    using Newtonsoft.Json.Serialization;

    /// <summary>
    /// Controls the way we serialize and deserialize an object.
    /// For inherited objects we try to match the object by name within the same namespace,
    /// if not found we bind it to a the basic Cdm Folder object.
    /// </summary>
    internal class TypeNameSerializationBinder : ISerializationBinder
    {
        private string modelNamespace;
        private Assembly assembly;

        public TypeNameSerializationBinder(Assembly assembly, string modelNamespace) => (this.assembly, this.modelNamespace) = (assembly, modelNamespace);

        /// <inheritdoc/>
        public void BindToName(Type serializedType, out string assemblyName, out string typeName)
        {
            assemblyName = null;
            typeName = serializedType.Name;
        }

        /// <inheritdoc/>
        public Type BindToType(string assemblyName, string typeName)
        {
            Type type = this.assembly.GetTypes()
                .SingleOrDefault(t =>
                    t.Name == typeName &&
                    t.Namespace == this.modelNamespace);

            // fallback
            try
            {
                if (type == null)
                {
                    string resolvedTypeName = $"{typeof(Model).Namespace}.{typeName}, {typeof(Model).Assembly}";
                    type = Type.GetType(resolvedTypeName, true);
                }
                return type;
            }
            catch (TypeLoadException)
            {
                // if the object is not supported we ignore it.
                return null;
            }
        }
    }
}
