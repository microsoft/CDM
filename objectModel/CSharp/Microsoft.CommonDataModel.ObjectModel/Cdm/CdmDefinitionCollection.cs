using Microsoft.CommonDataModel.ObjectModel.Enums;
using System;
using System.Collections.Generic;

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    /// <summary>
    /// <see cref="CdmCollection"/> customized to include any type of <see cref="CdmObjectDefinition"/>. 
    /// </summary>
    public class CdmDefinitionCollection : CdmCollection<CdmObjectDefinition>
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
        /// Constructs a CdmDefinitionCollection
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The owner of the collection. Has to be a <see cref="CdmDocumentDefinition"/>.</param>
        public CdmDefinitionCollection(CdmCorpusContext ctx, CdmDocumentDefinition owner)
            : base(ctx, owner, CdmObjectType.EntityDef)
        {
        }

        public new void Insert(int index, CdmObjectDefinition definition)
        {
            this.AddItemModifications(definition);
            base.Insert(index, definition);
        }

        /// <inheritdoc />
        public new CdmObjectDefinition Add(CdmObjectDefinition definition)
        {
            this.AddItemModifications(definition);
            return base.Add(definition);
        }

        /// <summary>
        /// Creates an Entity Definition with the provided name and adds it to the collection.
        /// </summary>
        /// <param name="name">Name for the <see cref="CdmEntityDefinition"/> that will be created and added to the collection.</param>
        /// <param name="simpleRef"></param>
        /// <returns>The created entity definition after it was added to the collection.</returns>
        public new CdmEntityDefinition Add(string name, bool simpleRef = false)
        {
            var entity = this.Ctx.Corpus.MakeObject<CdmEntityDefinition>(this.DefaultType, name, simpleRef);
            this.Add(entity);
            return entity;
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
            return this.Add(createdObject);
        }

        /// <inheritdoc />
        public new void AddRange(IEnumerable<CdmObjectDefinition> objectsList)
        {
            foreach(var obj in objectsList)
            {
                this.Add(obj);
            }
        }

        /// <summary>
        /// Performs changes to an item that is added to the collection.
        /// Does not actually add the item to the collection.
        /// </summary>
        /// <param name="document">The item that needs to be changed.</param>
        private void AddItemModifications(CdmObjectDefinition definition)
        {
            if (definition is CdmObjectBase definitionAsObjectBase)
            {
                definitionAsObjectBase.DocCreatedIn = this.Owner;
            }
        }
    }
}
