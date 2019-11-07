//-----------------------------------------------------------------------
// <copyright file="CdmCollection.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using System.Collections;
using System.Collections.Generic;

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    /// <summary>
    /// The CDM Definition for a collection that holds a set of CDM objects
    /// </summary>
    public class CdmCollection<T> : IEnumerable<T> where T : CdmObject
    {
        public readonly CdmCorpusContext Ctx;

        public readonly CdmObjectType DefaultType;

        /// <summary>
        /// The CdmObject that contains this collection
        /// </summary>
        protected CdmObject Owner;

        /// <summary>
        /// Outermost document containing this collection. This document is to be made "dirty" if anything is changed in the collection.
        /// </summary>
        private CdmDocumentDefinition OutermostDocument;

        /// <summary>
        /// Returns the list of all items in the CdmCollection
        /// </summary>
        internal List<T> AllItems { get; }

        public CdmCollection(CdmCorpusContext ctx, CdmObject owner, CdmObjectType defaultType)
        {
            this.Ctx = ctx;
            this.AllItems = new List<T>();
            this.DefaultType = defaultType;
            this.Owner = owner;
        }

        /// <summary>
        /// The number of items in the CdmCollection
        /// </summary>
        public int Count
        {
            get
            {
                return this.AllItems.Count;
            }
        }

        /// <summary>
        /// Creates an object of the default type of the collection, Assigns it the name passed as parameter and adds it to the collection.
        /// </summary>
        /// <param name="name">The name to be used for the newly created object</param>
        /// <param name="simpleRef">Only used for some types. It is used to populate ".SimpleNamedReference" property of the newly created object.</param>
        /// <returns>The newly created object after it was added to the collection.</returns>
        public T Add(string name, bool simpleRef = false)
        {
            T newObj = this.Ctx.Corpus.MakeObject<T>(this.DefaultType, name, simpleRef);
            newObj.Owner = this.Owner;
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
            AllItems.Add(currObject);
            return currObject;
        }

        /// <summary>
        /// Adds the elements of the list to the end of the CdmCollection
        /// </summary>
        public void AddRange(IEnumerable<T> list)
        {
            foreach (T element in list)
            {
                this.Add(element);
            }
        }

        /// <summary>
        /// Removes the CdmObject from the CdmCollection
        /// </summary>
        public bool Remove(T currObject)
        {
            bool wasRemoved = AllItems.Remove(currObject);
            if (wasRemoved)
            {
                currObject.Owner = null;
                MakeDocumentDirty();
            }
            return wasRemoved;
        }

        /// <summary>
        /// Returns an item in the CdmCollection that has the given name
        /// </summary>
        public T Item(string name)
        {
            return this.AllItems.Find(x => x.FetchObjectDefinitionName() == name);
        }

        /// <summary>
        /// Calls the Visit function on all objects in the collection
        /// </summary>
        public bool VisitList(string path, VisitCallback preChildren, VisitCallback postChildren)
        {
            bool result = false;
            if (this.AllItems != null)
            {
                int lItem = this.AllItems.Count;
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
        /// Creates a copy of the current CdmCollection
        /// </summary>
        public CdmCollection<T> Copy(ResolveOptions resOpt)
        {
            var copy = new CdmCollection<T>(this.Ctx, this.Owner, this.DefaultType);
            foreach (var element in this.AllItems)
                copy.Add((T)element.Copy(resOpt));
            return copy;
        }

        /// <summary>
        /// Finds the index in the list where the given item can be found. -1 if not found
        /// </summary>
        public int IndexOf(T item)
        {
            return this.AllItems.IndexOf(item);
        }

        /// <summary>
        /// Inserts an CdmObject at the given index
        /// </summary>
        public void Insert(int index, T item)
        {
            item.Owner = this.Owner;
            MakeDocumentDirty();
            this.AllItems.Insert(index, item);
        }

        /// <summary>
        /// Removes an item from the given index
        /// </summary>
        public void RemoveAt(int index)
        {
            if (index >= 0 && index < this.AllItems.Count)
            {
                this.AllItems[index].Owner = null;
                MakeDocumentDirty();
                this.AllItems.RemoveAt(index);
            }
        }

        /// <summary>
        /// Empties the CdmCollection
        /// </summary>
        public void Clear()
        {
            foreach (T item in this.AllItems)
                item.Owner = null;
            MakeDocumentDirty();
            this.AllItems.Clear();
        }

        /// <summary>
        /// Returns true if the item can be found in the CdmCollection
        /// </summary>
        public bool Contains(T item)
        {
            return this.AllItems.Contains(item);
        }

        /// <summary>
        /// Copy the items in the CdmCollection to an array
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
        /// Calculates the outermost document containing this collection
        /// </summary>
        /// <returns>The outermost document containing collection.</returns>
        private CdmDocumentDefinition CalculateOutermostDocument()
        {
            CdmDocumentDefinition document = this.Owner?.InDocument ?? this.Owner as CdmDocumentDefinition;
            while (document?.InDocument != null && document != document.InDocument)
            {
                document = document.InDocument;
            }
            return document;
        }

        /// <summary>
        /// Make the outermost document containing this collection dirty because the collection was changed.
        /// </summary>
        protected void MakeDocumentDirty()
        {
            if (this.OutermostDocument == null)
            {
                this.OutermostDocument = this.CalculateOutermostDocument();
            }

            if (this.OutermostDocument != null)
            {
                OutermostDocument.IsDirty = true;
            }
        }
    }
}
