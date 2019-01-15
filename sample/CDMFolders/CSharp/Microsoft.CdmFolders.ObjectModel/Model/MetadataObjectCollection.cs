// <copyright file="MetadataObjectCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    /// <summary>
    /// Represents a base for all the metadata objects collection
    /// </summary>
    /// <typeparam name="T">The collection type</typeparam>
    public abstract class MetadataObjectCollection<T> : ObjectCollection<T>
        where T : MetadataObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MetadataObjectCollection{P}"/> class.
        /// </summary>
        public MetadataObjectCollection()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MetadataObjectCollection{P}"/> class.
        /// </summary>
        /// <param name="collection">The collection</param>
        public MetadataObjectCollection(IEnumerable<T> collection)
            : base(collection)
        {
        }

        /// <summary>
        /// Indexer that returns the first element according to a given name
        /// </summary>
        /// <param name="name">The name</param>
        /// <returns>The metadata object</returns>
        public T this[string name] => this.FirstOrDefault(item => StringComparer.OrdinalIgnoreCase.Equals(item.Name, name));

        /// <inheritdoc/>
        public override bool Contains(T item)
        {
            return this[item.Name] != null;
        }

        /// <summary>
        /// Validates that loaded <see cref="MetadataObjectCollection{T}"/> is correct and can function.
        /// </summary>
        internal virtual void Validate()
        {
            foreach (T metadataObj in this)
            {
                metadataObj.Validate();
            }
        }

        /// <summary>
        /// Validate unique names
        /// </summary>
        protected void ValidateUniqueNames()
        {
            var uniqueNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (MetadataObject metadataObj in this.Where(obj => obj.Name != null))
            {
                if (!uniqueNames.Contains(metadataObj.Name))
                {
                    uniqueNames.Add(metadataObj.Name);
                }
                else
                {
                    throw new InvalidDataException($"'{this.GetType().Name}' contains non-unique item names.");
                }
            }
        }
    }
}