// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Generic;

    /// <summary>
    /// Extends <see cref="CdmCollection"/> and adds additional behaviors specific to entity collections.    
    /// </summary>
    public class CdmEntityCollection : CdmCollection<CdmEntityDeclarationDefinition>
    {
        /// <summary>
        /// Constructs a CdmEntityCollection by using the parent constructor and LocalEntityDeclarationDef as the default type.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The object this collection is a member of.</param>
        public CdmEntityCollection(CdmCorpusContext ctx, CdmObject owner)
            : base(ctx, owner, CdmObjectType.LocalEntityDeclarationDef)
        {
        }

        /// <summary>
        /// Creates an Entity Declaration based on an Entity Definition and adds it to the list.
        /// </summary>
        /// <param name="entity">The entity definition used to create the entity declaration.</param>
        /// <param name="simpleRef">Parameter is unused for this collection. Kept for consistency with other CdmCollections.</param>
        /// <returns>The entity declaration that was added to the collection.</returns>
        public CdmEntityDeclarationDefinition Add(CdmEntityDefinition entity, bool simpleRef = false)
        {
            var cdmCorpus = this.Ctx.Corpus;

            if (entity.Owner == null)
            {
                Logger.Error(nameof(CdmEntityCollection), entity.Ctx, "Expected entity to have an \"Owner\" document set. Cannot create entity declaration to add to manifest.", nameof(Add));
                return null;
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
        /// <returns>The entity declaration that was added to the collection.</returns>
        public CdmEntityDeclarationDefinition Add(string name, string entityPath, bool simpleRef = false)
        {
            var entityDefinition = this.Add(name, simpleRef);
            entityDefinition.EntityPath = entityPath;
            return entityDefinition;
        }

        /// <summary>
        /// Removes the <see cref="CdmEntityReference"/> that points to the provided <see cref="CdmEntityDefinition"/>.
        /// </summary>
        /// <param name="entityDefToRemove"><see cref="CdmEntityDefinition"/> whose reference to remove from the collection.</param>
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
