// <copyright file="SerializationOrderConstants.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.SerializationHelpers
{
    using System;
    using System.Linq;
    using System.Reflection;
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// Creates an instance of an inherited class of the Cdm Folder Object Model.
    /// If there is an extension of a class with the same name within the same namespace
    /// of the extended model, it will return its instance, otherwise it will return 
    /// an instance of the class from the Cdm Folder Object Model.
    /// </summary>
    /// <typeparam name="T">The type of the class which its name will be used to find the inherited class</typeparam>
    internal class ExtensionsConverter<T> : CustomCreationConverter<T> where T : new()
    {
        private string modelNamespace;
        private Assembly assembly;

        public ExtensionsConverter(Assembly assembly, string modelNamespace) => (this.assembly, this.modelNamespace) = (assembly, modelNamespace);

        /// <inheritdoc/>
        public override T Create(Type objectType)
        {
            Type type = this.assembly.GetTypes()
            .SingleOrDefault(t =>
                t.Name == objectType.Name &&
                t.Namespace == this.modelNamespace);

            if (type == null)
            {
                return new T();
            }
            else
            {
                return (T)Activator.CreateInstance(type);
            }

        }
    }
}
