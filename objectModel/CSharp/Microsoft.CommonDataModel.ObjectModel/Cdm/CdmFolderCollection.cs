namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System.Collections.Generic;

    /// <summary>
    /// <see cref="CdmCollection"/> customized for <see cref="CdmFolderDefinition"/> that are the children of af the Owner CdmFolderDefinition.
    /// This collection of <see cref="CdmFolderDefinition"/> should only be used for childrens of the same parent folder as it copies fields from the parent to the child.
    /// </summary>
    public class CdmFolderCollection : CdmCollection<CdmFolderDefinition>
    {
        /// <inheritdoc />
        protected new CdmFolderDefinition Owner
        {
            get
            {
                return base.Owner as CdmFolderDefinition;
            }
        }

        /// <summary>
        /// Constructs a CdmFolderCollection
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="parentFolder">The owner of the collection, which has to be the parent folder.</param>
        public CdmFolderCollection(CdmCorpusContext ctx, CdmFolderDefinition parentFolder)
            : base(ctx, parentFolder, CdmObjectType.FolderDef)
        {
        }

        /// <inheritdoc />
        public new void Insert(int index, CdmFolderDefinition childFolder)
        {
            this.AddItemModifications(childFolder);
            base.Insert(index, childFolder);
        }

        /// <inheritdoc />
        public new CdmFolderDefinition Add(CdmFolderDefinition childFolder)
        {
            this.AddItemModifications(childFolder);
            return base.Add(childFolder);
        }

        /// <inheritdoc />
        public new CdmFolderDefinition Add(string name, bool simpleRef = false)
        {
            var childFolder = this.Ctx.Corpus.MakeObject<CdmFolderDefinition>(this.DefaultType, name, simpleRef);
            return this.Add(childFolder);
        }

        /// <inheritdoc />
        public new void AddRange(IEnumerable<CdmFolderDefinition> childFolderList)
        {
            foreach (var child in childFolderList)
            {
                this.Add(child);
            }
        }

        /// <summary>
        /// Performs changes to an item that is added to the collection.
        /// Does not actually add the item to the collection.
        /// </summary>
        /// <param name="childFolder">The item that needs to be changed.</param>
        private void AddItemModifications(CdmFolderDefinition childFolder)
        {
            childFolder.Corpus = this.Owner.Corpus;
            childFolder.Namespace = this.Owner.Namespace;
            childFolder.FolderPath = this.Owner.FolderPath + childFolder.Name + "/";
        }
    }
}
