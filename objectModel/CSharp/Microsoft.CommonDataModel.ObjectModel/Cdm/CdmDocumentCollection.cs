namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System.Collections.Generic;

    /// <summary>
    /// <see cref="CdmCollection"/> customized for <see cref="CdmDocumentDefinition"/>.
    /// </summary>
    public class CdmDocumentCollection : CdmCollection<CdmDocumentDefinition>
    {
        /// < inheritdoc/>
        protected new CdmFolderDefinition Owner
        {
            get
            {
                return base.Owner as CdmFolderDefinition;
            }
        }

        /// <summary>
        /// Constructs a CdmDocumentCollection by using parent constructor and DocumentDef as default type
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="owner"></param>
        public CdmDocumentCollection(CdmCorpusContext ctx, CdmFolderDefinition owner)
            :base(ctx, owner, CdmObjectType.DocumentDef)
        {
        }

        /// <inheritdoc />
        public new void Insert(int index, CdmDocumentDefinition document)
        {
            base.Insert(index, document);
            this.AddItemModifications(document);
        }

        /// < inheritdoc/>
        public new CdmDocumentDefinition Add(CdmDocumentDefinition document)
        {
            this.AddItemModifications(document);
            return base.Add(document);
        }

        /// <summary>
        /// Adds a document to the collection after it sets the name with the given parameter.
        /// </summary>
        /// <param name="document">The document to be added to the collection.</param>
        /// <param name="documentName">The name of the document will be set to this value.</param>
        public CdmDocumentDefinition Add(CdmDocumentDefinition document, string documentName)
        {
            document.Name = documentName;
            return this.Add(document);
        }

        /// < inheritdoc />
        public new CdmDocumentDefinition Add(string name, bool simpleRef = false)
        {
            var document = this.Ctx.Corpus.MakeObject<CdmDocumentDefinition>(this.DefaultType, name, simpleRef);
            return this.Add(document);
        }

        /// <inheritdoc />
        public new void AddRange(IEnumerable<CdmDocumentDefinition> documents)
        {
            foreach(var document in documents)
            {
                this.Add(document);
            }
        }

        /// < inheritdoc/>
        public new bool Remove(CdmDocumentDefinition document)
        {
            return this.Remove(document.Name);
        }

        /// <summary>
        /// Removes the document with specified name from the collection.
        /// </summary>
        /// <param name="name">The name of the document to be removed from the collection.</param>
        /// <returns>Whether the operation completed successfully.</returns>
        public bool Remove(string name)
        {
            if (this.Owner.DocumentLookup.ContainsKey(name))
            {
                this.RemoveItemModifications(name);
                var index = this.AllItems.FindIndex((d) => string.Equals(d.Name, name));
                base.RemoveAt(index);
                return true;
            }
            return false;
        }

        /// <inheritdoc />
        public new void RemoveAt(int index)
        {
            if (index >= 0 && index < this.AllItems.Count)
            {
                this.Remove(this.AllItems[index].Name);
            }
        }

        /// <inheritdoc />
        public new void Clear()
        {
            this.AllItems.ForEach((doc) => this.RemoveItemModifications(doc.Name));
            base.Clear();
        }

        /// <summary>
        /// Performs changes to an item that is added to the collection.
        /// Does not actually add the item to the collection.
        /// </summary>
        /// <param name="document">The item that needs to be changed.</param>
        private void AddItemModifications(CdmDocumentDefinition document)
        {
            document.FolderPath = this.Owner.FolderPath;
            document.Folder = this.Owner;
            document.Namespace = this.Owner.Namespace;
            document.NeedsIndexing = true;
            this.Owner.Corpus.AddDocumentObjects(this.Owner, document);
            this.Owner.DocumentLookup.Add(document.Name, document);
        }

        /// <summary>
        /// Performs changes associated with removing an item from the collection.
        /// Does not actually remove the item from the collection.
        /// </summary>
        /// <param name="documentName">The name of the document that is to be removed.</param>
        private void RemoveItemModifications(string documentName)
        {
            this.Owner.Corpus.RemoveDocumentObjects(this.Owner, this.Owner.DocumentLookup[documentName]);
            this.Owner.DocumentLookup.Remove(documentName);
        }
    }
}
