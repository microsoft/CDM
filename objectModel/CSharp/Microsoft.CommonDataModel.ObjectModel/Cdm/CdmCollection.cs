//-----------------------------------------------------------------------
// <copyright file="CdmCollection.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections;
    using System.Collections.Generic;

    /// <summary>
    /// The CDM definition for a collection that holds a set of CDM objects.
    /// </summary>
    public class CdmCollection<T> : IEnumerable<T> where T : CdmObject
    {
        public readonly CdmCorpusContext Ctx;

        /// <summary>
        /// The default type of the collection.
        /// </summary>
        public readonly CdmObjectType DefaultType;

        /// <summary>
        /// The CdmObject that contains this collection.
        /// </summary>
        protected CdmObject Owner;

        /// <summary>
        /// Gets the list of all items in the CdmCollection.
        /// </summary>
        internal List<T> AllItems { get; }

        /// <summary>
        /// Constructs a CdmCollection.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The owner of the collection.</param>
        /// <param name="defaultType">The default type of the collection.</param>
        public CdmCollection(CdmCorpusContext ctx, CdmObject owner, CdmObjectType defaultType)
        {
            this.Ctx = ctx;
            this.AllItems = new List<T>();
            this.DefaultType = defaultType;
            this.Owner = owner;
        }

        /// <summary>
        /// The number of items in the CdmCollection.
        /// </summary>
        public int Count
        {
            get
            {
                return this.AllItems.Count;
            }
        }

        /// <summary>
        /// Creates an object of the default type of the collection, assigns it the name passed as parameter, and adds it to the collection.
        /// </summary>
        /// <param name="name">The name to be used for the newly created object.</param>
        /// <param name="simpleRef">Only used for some types. It is used to populate ".SimpleNamedReference" property of the newly created object.</param>
        /// <returns>The newly created object after it was added to the collection.</returns>
        public T Add(string name, bool simpleRef = false)
        {
            T newObj = this.Ctx.Corpus.MakeObject<T>(this.DefaultType, name, simpleRef);
            return this.Add(newObj);
        }

        /// <summary>
        /// Adds an object to the collection. Also makes modifications to the object.
        /// </summary>
        /// <param name="currObject">The object to be added to the collection.</param>
        /// <returns>The object added to the collection.</returns>
        public T Add(T currObject)
        {
            MakeDocumentDirty();
            currObject.Owner = this.Owner;
            PropagateInDocument(currObject, this.Owner.InDocument);
            AllItems.Add(currObject);
            return currObject;
        }

        /// <summary>
        /// Adds the elements of the list to the end of the CdmCollection.
        /// </summary>
        public void AddRange(IEnumerable<T> list)
        {
            foreach (T element in list)
            {
                this.Add(element);
            }
        }

        /// <summary>
        /// Removes the CdmObject from the CdmCollection.
        /// </summary>
        public bool Remove(T currObject)
        {
            bool wasRemoved = AllItems.Remove(currObject);
            PropagateInDocument(currObject, null);
            if (wasRemoved)
            {
                currObject.Owner = null;
                MakeDocumentDirty();
            }
            return wasRemoved;
        }

        /// <summary>
        /// Removes an item from the given index.
        /// </summary>
        public void RemoveAt(int index)
        {
            if (index >= 0 && index < this.Count)
            {
                this.Remove(this.AllItems[index]);
            }
        }

        /// <summary>
        /// Returns an item in the CdmCollection that has the given name.
        /// </summary>
        public T Item(string name)
        {
            return this.AllItems.Find(x => x.FetchObjectDefinitionName() == name);
        }

        /// <summary>
        /// Calls the Visit function on all objects in the collection.
        /// </summary>
        public bool VisitList(string path, VisitCallback preChildren, VisitCallback postChildren)
        {
            bool result = false;
            if (this.AllItems != null)
            {
                int lItem = this.Count;
                for (int iItem = 0; iItem < lItem; iItem++)
                {
                    CdmObject element = this.AllItems[iItem];
                    if (element != null)
                    {
                        if (element.Visit(path, preChildren, postChildren))
                        {
                            result = true;
                            break;
                        }
                    }
                }
            }
            return result;
        }

        /// <summary>
        /// Creates a copy of the current CdmCollection.
        /// </summary>
        public CdmCollection<T> Copy(ResolveOptions resOpt, CdmObject host = null)
        {
            var copy = new CdmCollection<T>(this.Ctx, this.Owner, this.DefaultType);
            foreach (var element in this.AllItems)
                copy.Add((T)element.Copy(resOpt));
            return copy;
        }

        /// <summary>
        /// Finds the index in the list where the given item can be found. -1 if not found.
        /// </summary>
        public int IndexOf(T item)
        {
            return this.AllItems.IndexOf(item);
        }

        /// <summary>
        /// Inserts an CdmObject at the given index.
        /// </summary>
        public void Insert(int index, T item)
        {
            item.Owner = this.Owner;
            PropagateInDocument(item, this.Owner.InDocument);
            MakeDocumentDirty();
            this.AllItems.Insert(index, item);
        }

        /// <summary>
        /// Empties the CdmCollection.
        /// </summary>
        public void Clear()
        {
            foreach (T item in this.AllItems)
            {
                item.Owner = null;
                PropagateInDocument(item, null);
            }
            MakeDocumentDirty();
            this.AllItems.Clear();
        }

        /// <summary>
        /// Returns true if the item can be found in the CdmCollection.
        /// </summary>
        public bool Contains(T item)
        {
            return this.AllItems.Contains(item);
        }

        /// <summary>
        /// Copy the items in the CdmCollection to an array.
        /// </summary>
        public void CopyTo(T[] array, int arrayIndex)
        {
            this.AllItems.CopyTo(array, arrayIndex);
        }

        public bool IsReadOnly => ((IList<T>)AllItems).IsReadOnly;

        // danger because no equivalent in ts. use allitems directly
        [System.Runtime.CompilerServices.IndexerName("_Item")]
        public T this[int index] { get => AllItems[index]; set => AllItems[index] = value; }

        public IEnumerator<T> GetEnumerator()
        {
            return this.AllItems.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.AllItems.GetEnumerator();
        }

        /// <summary>
        /// Make the outermost document containing this collection dirty because the collection was changed.
        /// </summary>
        protected void MakeDocumentDirty()
        {
            if (this.Ctx.Corpus.isCurrentlyResolving == false)
            {
                var document = this.Owner?.InDocument ?? this.Owner as CdmDocumentDefinition;
                if (document != null)
                {
                    document.IsDirty = true;
                    document.NeedsIndexing = true;
                }
            }
        }

        /// <summary>
        /// Propagate document through all objects.
        /// </summary>
        /// <param name="cdmObject">The object</param>
        /// <param name="document">The document</param>
        protected void PropagateInDocument(CdmObject cdmObject, CdmDocumentDefinition document)
        {
            if (this.Ctx.Corpus.isCurrentlyResolving == false)
            {
                this.Ctx.Corpus.blockDeclaredPathChanges = true;
#pragma warning disable CS0612 // Type or member is obsolete
                cdmObject.Visit(string.Empty,
                    new VisitCallback
                    {
                        Invoke = (obj, path) =>
                        {
                            // If object's document is already the same as the one we're trying to set
                            // then we're assuming that every sub-object is also set to it, so bail out.
                            if (obj.InDocument == document)
                            {
                                return true;
                            }

                            obj.InDocument = document;
                            return false;
                        }
                    },
                    null);
#pragma warning restore CS0612 // Type or member is obsolete
                this.Ctx.Corpus.blockDeclaredPathChanges = false;
            }
        }
    }
}
