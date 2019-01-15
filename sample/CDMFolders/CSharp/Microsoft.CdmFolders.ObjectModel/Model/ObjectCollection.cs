// <copyright file="ObjectCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Represents a base for all the available collections.
    /// </summary>
    /// <typeparam name="T">The collection type</typeparam>
    public abstract class ObjectCollection<T> : ICollection<T>, ICloneable
    {
        private readonly List<T> list;

        /// <summary>
        /// Initializes a new instance of the <see cref="ObjectCollection{T}"/> class.
        /// </summary>
        public ObjectCollection()
        {
            this.list = new List<T>();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ObjectCollection{T}"/> class with a base collection.
        /// </summary>
        /// <param name="collection">The base collection</param>
        public ObjectCollection(IEnumerable<T> collection)
            : this()
        {
            this.AddRange(collection);
        }

        /// <inheritdoc/>
        public int Count => this.list.Count;

        /// <inheritdoc/>
        public bool IsReadOnly => false;

        /// <summary>
        /// Indexer that returns the first element according to a given position
        /// </summary>
        /// <param name="index">The position</param>
        /// <returns>The metadata object</returns>
        public T this[int index] => this.list[index];

        /// <inheritdoc/>
        public void Add(T item)
        {
            this.list.Add(item);
        }

        /// <summary>
        /// Add a range of items
        /// </summary>
        /// <param name="items">The items</param>
        public void AddRange(IEnumerable<T> items)
        {
            foreach (var item in items)
            {
                this.Add(item);
            }
        }

        /// <inheritdoc/>
        public void Clear()
        {
            // TODO: Think about updating the whole Model
            this.list.Clear();
        }

        /// <inheritdoc/>
        public virtual bool Contains(T item)
        {
            return this.list.Contains(item);
        }

        /// <inheritdoc/>
        public void CopyTo(T[] array, int arrayIndex)
        {
            this.list.CopyTo(array, arrayIndex);
        }

        /// <inheritdoc/>
        public bool Remove(T item)
        {
            return this.list.Remove(item);
        }

        /// <inheritdoc/>
        public IEnumerator<T> GetEnumerator()
        {
            return this.list.GetEnumerator();
        }

        /// <inheritdoc/>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

        /// <inheritdoc/>
        public virtual object Clone()
        {
            var clone = (ObjectCollection <T>)this.MemberwiseClone();
            clone.AddRange(this
                .OfType<ICloneable>()
                .Select(item => item.Clone())
                .Cast<T>());

            return clone;
        }
    }
}