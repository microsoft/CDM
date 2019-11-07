namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System.Collections.Generic;

    /// <summary>
    /// It extends <see cref="CdmCollection"/> and adds additional behaviors specific to entity collections.    
    /// </summary>
    public class CdmEntityCollection : CdmCollection<CdmEntityDeclarationDefinition>
    {
        /// <summary>
        /// Constructs a CdmEntityCollection by using parent constructor and LocalEntityDeclarationDef as defaultObjectType
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The object this collection is a member of.</param>
        public CdmEntityCollection(CdmCorpusContext ctx, CdmObject owner)
            : base(ctx, owner, CdmObjectType.LocalEntityDeclarationDef)
        {
        }

        /// <summary>
        /// Creates an entityDeclaration based on an EntityDefinition and adds it to the list.
        /// </summary>
        /// <param name="entity">The entity definition used to create the entity declaration.</param>
        /// <param name="simpleRef">Parameter is unused for this collection. Kept for consistency with other CdmCollections.</param>
        /// <returns>The Entity Declaration Definition that was added to the Cdm Collection.</returns>
        public CdmEntityDeclarationDefinition Add(CdmEntityDefinition entity, bool simpleRef = false)
        {
            var cdmCorpus = this.Ctx.Corpus;            

            if (entity.Owner == null)
            {
                throw new System.ArgumentException("Expected entity to have an \"Owner\" document set. Cannot create entity declaration to add to manifest.");
            }

            var entityDeclaration = (this.Ctx.Corpus as CdmCorpusDefinition).MakeObject<CdmEntityDeclarationDefinition>(this.DefaultType, entity.EntityName, simpleRef);
            entityDeclaration.Owner = this.Owner;
            entityDeclaration.EntityPath = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath($"{entity.Owner.AtCorpusPath}/{entity.EntityName}", this.Owner.InDocument);
            entityDeclaration.Explanation = entity.Explanation;
            return this.Add(entityDeclaration);
        }

        /// <summary>
        /// Adds a new entity to the collection with the given name and the given entity path.
        /// </summary>
        /// <param name="name">The name of the entity.</param>
        /// <param name="entityPath">The address the entity can be retrieved from.</param>
        /// <param name="simpleRef">Parameter is unused for this collection. Kept for consistency with other CdmCollections.</param>
        /// <returns>The Entity Declaration Definition that was added to the Cdm Collection.</returns>
        public CdmEntityDeclarationDefinition Add(string name, string entityPath, bool simpleRef = false)
        {
            var entityDefinition = this.Add(name, simpleRef);
            entityDefinition.EntityPath = entityPath;
            return entityDefinition;
        }

        /// <summary>
        /// Remove the <see cref="CdmEntityReference"/> that points to the provided <see cref="CdmEntityDefinition"/>
        /// </summary>
        /// <param name="entityDefToRemove"><see cref="CdmEntityDefinition"/> whose reference needs to be removed from the collection.</param>
        /// <returns>Whether the operation completed successfully.</returns>
        public bool Remove(CdmEntityDefinition entityDefToRemove)
        {
            foreach (CdmEntityDeclarationDefinition entity in this.AllItems)
            {
                if (string.Equals(entity.EntityName, entityDefToRemove.EntityName))
                {
                    return base.Remove(entity);
                }
            }
            return false;
        }

        /// <summary>
        /// Adds the elements of a list of <see cref="CdmEntityDefinition"/> to the collection.
        /// </summary>
        public void AddRange(IEnumerable<CdmEntityDefinition> entityList)
        {
            foreach (var element in entityList)
            {
                this.Add(element);
            }
        }
    }
}
