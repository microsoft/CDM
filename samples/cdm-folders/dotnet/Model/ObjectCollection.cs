// <copyright file="ObjectCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System.Collections;
    using System.Collections.Generic;

    /// <summary>
    /// Base for all the available collection
    /// </summary>
    /// <typeparam name="T">The collection type</typeparam>
    public abstract class ObjectCollection<T> : ICollection<T>
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
        /// <param name="index">the position</param>
        /// <returns>The metadata object</returns>
        public T this[int index] => this.list[index];

        /// <inheritdoc/>
        public void Add(T item)
        {
            this.list.Add(item);
            this.OnAdded(item);
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

        /// <summary>
        /// On add hook
        /// </summary>
        /// <param name="item">The item that was added</param>
        protected virtual void OnAdded(T item)
        {
        }
    }
}