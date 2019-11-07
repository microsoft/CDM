namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System.Collections.Generic;

    /// <summary>
    /// <see cref="CdmCollection"/> customized for <see cref="CdmTraitReference"/>
    /// </summary>
    public class CdmTraitCollection : CdmCollection<CdmTraitReference>
    {
        /// <summary>
        /// Constructs a CdmTraitCollection by using parent constructor and TraitRef as defaultObectType
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The object this collection is a member of.</param>
        public CdmTraitCollection(CdmCorpusContext ctx, CdmObject owner)
            : base(ctx, owner, CdmObjectType.TraitRef)
        {
        }

        /// <inheritdoc />
        public new void Insert(int index, CdmTraitReference trait)
        {
            this.ClearCache();
            base.Insert(index, trait);
        }

        /// <summary>
        /// Creates a <see cref="CdmTraitReference"/> based on a <see cref="CdmTraitDefinition"/> and adds it to the collection
        /// </summary>
        /// <param name="traitDefinition">The trait definition used to create the trait reference.</param>
        /// <param name="simpleRef">Used to set trait.SimpleNamedReference in constructor.</param>
        /// <returns>The created Trait Reference that was added to the CdmCollection.</returns>
        public CdmTraitReference Add(CdmTraitDefinition traitDefinition, bool simpleRef = false)
        {
            this.ClearCache();
            var traitReference = new CdmTraitReference(this.Ctx, traitDefinition, simpleRef, false);
            return base.Add(traitReference);
        }

        /// <summary>
        /// Adds a <see cref="CdmTraitReference"/> to this collection.
        /// </summary>
        /// <param name="trait">The trait to be added.</param>
        /// <returns></returns>
        public new CdmTraitReference Add(CdmTraitReference trait)
        {
            this.ClearCache();
            return base.Add(trait);
        }
        
        /// < inheritdoc/>
        public new CdmTraitReference Add(string name, bool simpleRef = false)
        {
            this.ClearCache();
            return base.Add(name, simpleRef);
        }


        /// <summary>
        /// Removes the <see cref="CdmTraitReference"/> that has the same name as <see cref="CdmTraitDefinition"/>.
        /// If multiple matches, removes the first one that is from property, or if there isn't any from property and "onlyFromProperty" is false, removes the last one that is not from property.
        /// </summary>
        /// <param name="traitDefToRemove"><see cref="CdmTraitDefinition"/> whose reference needs to be removed from the collection.</param>
        /// <param name="onlyFromProperty">Whether function should only be applied for traits that originate from properties.</param>
        /// <returns>Whether the operation completed successfuly.</returns>
        public bool Remove(CdmTraitDefinition traitDefToRemove, bool onlyFromProperty = false)
        {
            var traitName = traitDefToRemove.TraitName;
            return this.Remove(traitName, onlyFromProperty);
        }

        /// <summary>
        /// Removes trait with the specified name from the collection.
        /// If multiple matches, removes the first one that is from property, or if there isn't any from property and "onlyFromProperty" is false, removes the last one that is not from property.
        /// the first one by prioritizing traits that are from properties even if "onlyFromProperty" parameter is false.
        /// </summary>
        /// <param name="traitName">The name of the trait to be removed.</param>
        /// <param name="onlyFromProperty">Whether function should only be applied for traits that originate from properties.</param>
        /// <returns>Whether a trait was removed from the collection.</returns>
        public bool Remove(string traitName, bool onlyFromProperty = false)
        {
            this.MakeDocumentDirty();
            CdmTraitReference foundTraitNotFromProperty = null;
            this.ClearCache();
            foreach (CdmTraitReference trait in this.AllItems)
            {
                if (this.Corresponds(trait, traitName))
                {
                    if (trait.IsFromProperty)
                    {
                        return this.AllItems.Remove(trait);
                    }
                    foundTraitNotFromProperty = trait;
                }
            }
            if (onlyFromProperty == false && foundTraitNotFromProperty != null)
            {
                return this.AllItems.Remove(foundTraitNotFromProperty);
            }
            return false;
        }

        /// <summary>
        /// Removes a trait with the same name as the trait provided.
        /// If multiple matches, removes the first one that is from property, or if there isn't any from property and "onlyFromProperty" is false, removes the last one that is not from property.
        /// </summary>
        /// <param name="traitToRemove">The trait to be removed.</param>
        /// <param name="onlyFromProperty">Whether function should only be applied for traits that originate from properties.</param>
        /// <returns>Whether a trait was removed from the collection.</returns>
        public bool Remove(CdmTraitReference traitToRemove, bool onlyFromProperty = false)
        {
            var traitName = traitToRemove.FetchObjectDefinitionName();
            return Remove(traitName, onlyFromProperty);
        }

        /// <inheritdoc />
        public new void RemoveAt(int index)
        {
            this.ClearCache();
            base.RemoveAt(index);
        }

        /// <inheritdoc />
        public new void Clear()
        {
            this.ClearCache();
            base.Clear();
        }

        /// <summary>
        /// The index of a trait reference with the same name as the trait definition provided.
        /// If multiple matches, retrieves the index of the first one that is from property, or if there isn't any from property and "onlyFromProperty" is false, the index of the last one that is not from property.
        /// </summary>
        /// <param name="traitDefinition">The trait definition associated with the trait reference we want to retrieve the index of.</param>
        /// <param name="onlyFromProperty">Whether function should only be applied for traits that originate from properties.</param>
        /// <returns>The index of the trait reference or -1 if no such trait exists in the colleciton.</returns>
        public int IndexOf(CdmTraitDefinition traitDefinition, bool onlyFromProperty = false)
        {
            var traitName = traitDefinition.TraitName;
            return IndexOf(traitName, onlyFromProperty);
        }

        /// <summary>
        /// The index of a trait reference with the given name.
        /// If multiple matches, retrieves the index of the first one that is from property, or if there isn't any from property and "onlyFromProperty" is false, the index of the last one that is not from property.
        /// </summary>
        /// <param name="traitName">The trait name associated with the trait reference we want to retrieve the index of.</param>
        /// <param name="onlyFromProperty">Whether function should only be applied for traits that originate from properties.</param>
        /// <returns>The index of the trait reference or -1 if no such trait exists in the collection.</returns>
        public int IndexOf(string traitName, bool onlyFromProperty = false)
        {
            int indexOfTraitNotFromProperty = -1;
            for (int index = 0; index < this.AllItems.Count; index++)
            {
                if (this.Corresponds(this.AllItems[index], traitName))
                {
                    if (this.AllItems[index].IsFromProperty)
                    {
                        return index;
                    }
                    indexOfTraitNotFromProperty = index;
                }
            }
            if (onlyFromProperty == false)
            {
                return indexOfTraitNotFromProperty;
            }
            return -1;
        }

        /// <summary>
        /// The index in the collection of a trait with the same name as the trait provided.
        /// If multiple matches, retrieves the index of the first one that is from property, or if there isn't any from property and "onlyFromProperty" is false, the index of the last one that is not from property.
        /// </summary>
        /// <param name="trait">The trait we want the index of.</param>
        /// <param name="onlyFromProperty">Whether function should only be applied for traits that originate from properties.</param>
        /// <returns>The index of the tarit reference or -1 if no such trait exists in the collection.</returns>
        public int IndexOf(CdmTraitReference trait, bool onlyFromProperty)
        {
            var traitName = trait.FetchObjectDefinitionName();
            return IndexOf(traitName, onlyFromProperty);
        }

        /// <summary>
        /// Adds a the elements of a list of <see cref="CdmTraitDefinition"/> to the collection, after converting them to <see cref="CdmTraitReference"/>
        /// </summary>
        /// <param name="traitList">The list of trait definitionsn used to create trait references that will be added to the collection.</param>
        /// <param name="simpleRef">Parameter is unused for this collection. Kept for consistency with other CdmCollections.</param>
        public void AddRange(IEnumerable<CdmTraitDefinition> traitList, bool simpleRef = false)
        {
            foreach (var element in traitList)
            {
                this.Add(element);
            }
        }

        /// <summary>
        /// Checks whether a <see cref="CdmTraitReference"/> has a particular name.
        /// </summary>
        /// <param name="traitReference">The trait reference.</param>
        /// <param name="traitDefinition">The trait name.</param>
        /// <returns>Whether the trait reference has the given name.
        private bool Corresponds(CdmTraitReference traitReference, string traitName)
        {
            return string.Equals(traitReference.FetchObjectDefinitionName(), traitName);
        }

        /// <summary>
        /// Clears the Trait Cache of the owner if owner object contains such a cache.
        /// </summary>
        private void ClearCache()
        {
            if (this.Owner is CdmObjectBase owner)
            {
                owner.ClearTraitCache();
            }
        }
    }
}
