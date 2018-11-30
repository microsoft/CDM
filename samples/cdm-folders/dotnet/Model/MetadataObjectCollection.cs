// <copyright file="MetadataObjectCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    /// <summary>
    /// Base for all the metadata objects collection
    /// </summary>
    /// <typeparam name="T">The collection type</typeparam>
    /// <typeparam name="TParent">The parent</typeparam>
    public abstract class MetadataObjectCollection<T, TParent> : ObjectCollection<T>
        where T : MetadataObject
        where TParent : MetadataObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MetadataObjectCollection{T, P}"/> class.
        /// </summary>
        /// <param name="parent">The parent</param>
        public MetadataObjectCollection(TParent parent)
            : base()
        {
            this.Parent = parent;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MetadataObjectCollection{T, P}"/> class.
        /// </summary>
        /// <param name="parent">The parent</param>
        /// <param name="collection">The collection</param>
        public MetadataObjectCollection(TParent parent, IEnumerable<T> collection)
            : base(collection)
        {
            this.Parent = parent;
        }

        /// <summary>
        /// Gets the parent
        /// </summary>
        public TParent Parent { get; }

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
        /// Validates that loaded model is correct and can function.
        /// </summary>
        /// <param name="allowUnresolvedModelReferences">
        ///   If set to True, the method will skip on validating MetadataObjects that can't be resolved due to model references.
        ///   If set to False, the method will try to validate all MetadataObjects. Will throw if not possible to resolve.
        /// </param>
        internal virtual void Validate(bool allowUnresolvedModelReferences = true)
        {
            foreach (T metadataObj in this)
            {
                metadataObj.Validate(allowUnresolvedModelReferences);
            }
        }

        /// <inheritdoc/>
        protected override void OnAdded(T item)
        {
            item.Parent = this.Parent;
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