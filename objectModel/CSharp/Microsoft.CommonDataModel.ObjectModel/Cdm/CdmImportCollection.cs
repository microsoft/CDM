// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Text;

    /// <summary>
    /// <see cref="CdmCollection"/> customized for <see cref="CdmImport"/>. The owner has to be a <see cref="CdmDocumentDefinition"/>.
    /// </summary>
    public class CdmImportCollection : CdmCollection<CdmImport>
    {
        /// <inheritdoc />
        protected new CdmDocumentDefinition Owner
        {
            get
            {
                return base.Owner as CdmDocumentDefinition;
            }
        }

        /// <summary>
        /// Constructs a CdmImportCollection.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The owner of the collection. This class is customized for <see cref="CdmDocumentDefinition"/>.</param>
        public CdmImportCollection(CdmCorpusContext ctx, CdmDocumentDefinition owner)
            : base(ctx, owner, Enums.CdmObjectType.Import)
        {
        }

        /// <summary>
        /// Creates an import with the provided corpus path and adds it to the collection.
        /// </summary>
        /// <param name="corpusPath">The corpus path to be set for the import.</param>
        /// <param name="simpleRef">Parameter is not used for this collection. Kept for consistency with other CdmCollections.</param>
        /// <returns>The created import that was added to the collection.</returns>
        public new CdmImport Add(string corpusPath, bool simpleRef = false)
        {
            var import = this.Ctx.Corpus.MakeObject<CdmImport>(this.DefaultType, corpusPath, simpleRef);
            return this.Add(import);
        }

        /// <summary>
        /// Creates an import with the provided corpus path and provided moniker and adds it to the collection.
        /// </summary>
        /// <param name="corpusPath">The corpus path used to create the import.</param>
        /// <param name="moniker">The moniker used to create the import.</param>
        /// <returns>The created import that was added to the collection.</returns>
        public CdmImport Add(string corpusPath, string moniker)
        {
            var import = this.Add(corpusPath);
            import.Moniker = moniker;
            return import;
        }

        /// <inheritdocs/>
        public new CdmImport Add(CdmImport currObject)
        {
            if (currObject.PreviousOwner != null)
            {
                var absolutePath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(currObject.CorpusPath, currObject.PreviousOwner);

                // Need to make the import path relative to the resolved manifest instead of the original manifest.
                currObject.CorpusPath = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(absolutePath, this.Owner);
            }

            return base.Add(currObject);
        }

        /// <inheritdoc />
        public new void AddRange(IEnumerable<CdmImport> importList)
        {
            foreach (var import in importList)
            {
                this.Add(import);
            }
        }

        public CdmImport Item(string corpusPath, string moniker = null, bool checkMoniker = true)
        {
            return this.AllItems.Find(x => checkMoniker ?
                                            x.CorpusPath == corpusPath && x.Moniker == moniker : 
                                            x.CorpusPath == corpusPath);
        }
    }
}
