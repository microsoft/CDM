// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;

    /// <summary>
    /// <see cref="CdmCollection"/> customized to include any type of <see cref="CdmObjectDefinition"/>. 
    /// </summary>
    public class CdmDefinitionCollection : CdmCollection<CdmObjectDefinition>
    {
        /// <summary>
        /// Constructs a CdmDefinitionCollection.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The owner of the collection. Has to be a <see cref="CdmDocumentDefinition"/>.</param>
        public CdmDefinitionCollection(CdmCorpusContext ctx, CdmDocumentDefinition owner)
            : base(ctx, owner, CdmObjectType.EntityDef)
        {
        }

        /// <summary>
        /// Creates an Entity Definition with the provided name and adds it to the collection.
        /// </summary>
        /// <param name="name">Name for the <see cref="CdmEntityDefinition"/> that will be created and added to the collection.</param>
        /// <param name="simpleRef">Parameter is unused for this collection. Kept for consistency with other CdmCollections.</param>
        /// <returns>The created entity definition after it was added to the collection.</returns>
        public new CdmEntityDefinition Add(string name, bool simpleRef = false)
        {
            return base.Add(name, simpleRef) as CdmEntityDefinition;
        }

        /// <summary>
        /// Creates a <see cref="CdmObject"/> of the provided type, with the provided name and adds it to the collection.
        /// </summary>
        /// <param name="ofType">The type of the object to be created and added to the list.</param>
        /// <param name="name">The name to be used for the created object.</param>
        /// <returns>The created object after it was added to the collection.</returns>
        public CdmObjectDefinition Add(CdmObjectType ofType, string name)
        {
            CdmObjectDefinition createdObject = this.Ctx.Corpus.MakeObject<CdmObjectDefinition>(ofType, name, false);
            return base.Add(createdObject);
        }
    }
}
