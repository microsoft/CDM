// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// <see cref="CdmCollection"/> customized for <see cref="CdmTraitReferenceBase"/>.
    /// </summary>
    public class CdmTraitCollection : CdmCollection<CdmTraitReferenceBase>
    {
        /// <summary>
        /// Constructs a CdmTraitCollection by using the parent constructor and TraitRef as the default type.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The object this collection is a member of.</param>
        public CdmTraitCollection(CdmCorpusContext ctx, CdmObject owner)
            : base(ctx, owner, CdmObjectType.TraitRef)
        {
        }

        /// <inheritdoc />
        public new void Insert(int index, CdmTraitReferenceBase trait)
        {
            this.ClearCache();
            base.Insert(index, trait);
        }

        /// <summary>
        /// Creates a <see cref="CdmTraitReference"/> based on a <see cref="CdmTraitDefinition"/> and adds it to the collection.
        /// </summary>
        /// <param name="traitDefinition">The trait definition used to create the trait reference.</param>
        /// <param name="simpleRef">Used to set trait.SimpleNamedReference in the constructor.</param>
        /// <returns>The created trait reference that was added to the collection.</returns>
        public CdmTraitReferenceBase Add(CdmTraitDefinition traitDefinition, bool simpleRef = false)
        {
            this.ClearCache();
            return base.Add(new CdmTraitReference(this.Ctx, traitDefinition, simpleRef, false));
        }

        /// <summary>
        /// Creates a <see cref="CdmTraitGroupReference"/> based on a <see cref="CdmTraitGroupDefinition"/> and adds it to the collection.
        /// </summary>
        /// <param name="traitGroupDefinition">The trait group definition used to create the trait group reference.</param>
        /// <param name="simpleRef">Used to set trait.SimpleNamedReference in the constructor.</param>
        /// <returns>The created trait group reference that was added to the collection.</returns>
        public CdmTraitReferenceBase Add(CdmTraitGroupDefinition traitGroupDefinition, bool simpleRef = false)
        {
            this.ClearCache();
            return base.Add(new CdmTraitGroupReference(this.Ctx, traitGroupDefinition, simpleRef));
        }

        /// <summary>
        /// Adds a <see cref="CdmTraitReferenceBase"/> to this collection.
        /// </summary>
        /// <param name="trait">The trait to be added.</param>
        /// <returns>The created trait reference that was added to the collection.</returns>
        public new CdmTraitReferenceBase Add(CdmTraitReferenceBase trait)
        {
            this.ClearCache();
            return base.Add(trait);
        }

        /// < inheritdoc/>
        public new CdmTraitReferenceBase Add(string name, bool simpleRef = false)
        {
            this.ClearCache();
            return base.Add(name, simpleRef);
        }

        /// <summary>
        /// Removes the <see cref="CdmTraitReference"/> that has the same name as <see cref="CdmTraitDefinition"/>.
        /// If there are multiple matches, removes the first trait that is from a property. If there aren't any from properties and "onlyFromProperty" is false, removes the last trait that is not from a property.        
        /// </summary>
        /// <param name="traitDefToRemove"><see cref="CdmTraitDefinition"/> whose reference to remove from the collection.</param>
        /// <param name="onlyFromProperty">Whether the function should only be applied for traits that originate from properties.</param>
        /// <returns>Whether the operation completed successfuly.</returns>
        public bool Remove(CdmTraitDefinition traitDefToRemove, bool onlyFromProperty = false)
        {
            return this.Remove(traitDefToRemove.TraitName, onlyFromProperty);
        }

        /// <summary>
        /// Removes the <see cref="CdmTraitGroupReference"/> that has the same name as <see cref="CdmTraitGroupDefinition"/>.
        /// If there are multiple matches, removes the first found.        
        /// </summary>
        /// <param name="traitGroupDefToRemove"><see cref="CdmTraitGroupDefinition"/> whose reference to remove from the collection.</param>
        /// <returns>Whether the operation completed successfuly.</returns>
        public bool Remove(CdmTraitGroupDefinition traitGroupDefToRemove)
        {
            return this.Remove(traitGroupDefToRemove.TraitGroupName);
        }

        /// <summary>
        /// Removes the trait ref or trait group ref with the specified name from the collection.
        /// If there are multiple matches, removes the first trait that is from a property. If there aren't any from properties and "onlyFromProperty" is false, removes the last trait that is not from a property.
        /// </summary>
        /// <param name="traitRefName">The name of the trait ref or trait group ref to be removed.</param>
        /// <param name="onlyFromProperty">Whether the function should only be applied for traits that originate from properties. Not applicable for trait groups.</param>
        /// <returns>Whether a trait ref or trait group ref was removed from the collection.</returns>
        public bool Remove(string traitRefName, bool onlyFromProperty = false)
        {
            CdmTraitReferenceBase foundTraitNotFromProperty = null;
            this.ClearCache();

            foreach (CdmTraitReferenceBase traitRef in this)
            {
                if (this.Corresponds(traitRef, traitRefName))
                {
                    if (traitRef is CdmTraitReference && (traitRef as CdmTraitReference).IsFromProperty)
                    {
                        return base.Remove(traitRef);
                    }
                    foundTraitNotFromProperty = traitRef;
                }
            }
            
            if (onlyFromProperty == false && foundTraitNotFromProperty != null)
            {
                return base.Remove(foundTraitNotFromProperty);
            }
            
            return false;
        }

        /// <summary>
        /// Removes a trait ref or trait group ref with the same name as the one provided.
        /// If there are multiple matches, removes the first trait that is from a property. If there aren't any from properties and "onlyFromProperty" is false, 
        /// removes the last trait that is not from a property.
        /// </summary>
        /// <param name="traitToRemove">The trait to be removed.</param>
        /// <param name="onlyFromProperty">Whether the function should only be applied for traits that originate from properties.</param>
        /// <returns>Whether a trait ref or trait group ref was removed from the collection.</returns>
        public bool Remove(CdmTraitReferenceBase traitToRemove, bool onlyFromProperty = false)
        {
            return Remove(traitToRemove.FetchObjectDefinitionName(), onlyFromProperty);
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
        /// Retrieves the index of a trait reference with the same name as the trait definition provided.
        /// If there are multiple matches, returns the index of the first trait that is from a property. If there aren't any from properties and "onlyFromProperty" is false, returns the index of the last trait that is not from a property.
        /// </summary>
        /// <param name="traitDefinition">The trait definition associated with the trait reference we want to retrieve the index of.</param>
        /// <param name="onlyFromProperty">Whether the function should only be applied for traits that originate from properties.</param>
        /// <returns>The index of the trait reference or -1 if no such trait exists in the collection.</returns>
        public int IndexOf(CdmTraitDefinition traitDefinition, bool onlyFromProperty = false)
        {
            return IndexOf(traitDefinition.TraitName, onlyFromProperty);
        }

        /// <summary>
        /// Retrieves the index of a trait group reference with the same name as the trait group definition provided.
        /// If there are multiple matches, returns the index of the last trait group that is not from a property.
        /// </summary>
        /// <param name="traitGroupDefinition">The trait group definition associated with the trait group reference we want to retrieve the index of.</param>
        /// <returns>The index of the trait group reference or -1 if no such trait group reference exists in the collection.</returns>
        public int IndexOf(CdmTraitGroupDefinition traitGroupDefinition)
        {
            return IndexOf(traitGroupDefinition.TraitGroupName);
        }

        /// <summary>
        /// Retrieves the index of a trait reference or trait group reference with the given name.
        /// If there are multiple matches, returns the index of the first item that is from a property. If there aren't any from properties and "onlyFromProperty" is false, returns the index of the last item that is not from a property.
        /// </summary>
        /// <param name="traitName">The name associated with the reference we want to retrieve the index of.</param>
        /// <param name="onlyFromProperty">Whether the function should only be applied for trait references that originate from properties. Not applicable for trait groups.</param>
        /// <returns>The index of the trait or trait group reference or -1 if no such reference exists in the collection.</returns>
        public int IndexOf(string traitName, bool onlyFromProperty = false)
        {
            int indexOfTraitNotFromProperty = -1;
            for (int index = 0; index < this.Count; index++)
            {
                if (this.Corresponds(this[index], traitName))
                {
                    if (this[index] is CdmTraitGroupReference || (this[index] as CdmTraitReference).IsFromProperty)
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
        /// Retrieves the index of a trait with the same name as the trait provided.
        /// If there are multiple matches, returns the index of the first trait that is from a property. If there aren't any from properties and "onlyFromProperty" is false, returns the index of the last trait that is not from a property.
        /// </summary>
        /// <param name="trait">The trait we want the index of.</param>
        /// <param name="onlyFromProperty">Whether the function should only be applied for traits that originate from properties.</param>
        /// <returns>The index of the trait reference or -1 if no such trait exists in the collection.</returns>
        public int IndexOf(CdmTraitReferenceBase trait, bool onlyFromProperty)
        {
            return IndexOf(trait.FetchObjectDefinitionName(), onlyFromProperty);
        }

        /// <summary>
        /// Adds the elements of a list of <see cref="CdmTraitDefinition"/> to the collection, after converting them to <see cref="CdmTraitReference"/>.
        /// </summary>
        /// <param name="traitList">The list of trait definitions used to create trait references that will be added to the collection.</param>
        public void AddRange(IEnumerable<CdmTraitDefinition> traitList)
        {
            foreach (var element in traitList)
            {
                Add(element);
            }
        }

        /// <summary>
        /// Adds the elements of a list of <see cref="CdmTraitGroupDefinition"/> to the collection, after converting them to <see cref="CdmTraitGroupReference"/>.
        /// </summary>
        /// <param name="traitGroupList">The list of trait group definitions used to create trait group references that will be added to the collection.</param>
        public void AddRange(IEnumerable<CdmTraitGroupDefinition> traitGroupList)
        {
            foreach (var element in traitGroupList)
            {
                Add(element);
            }
        }

        /// <summary>
        /// Returns a new collection consisting of only the trait reference objects present in this collection.
        /// </summary>
        /// <returns>New collection of found trait reference objects</returns>
        public CdmCollection<CdmTraitReference> ToTraitRefs()
        {
            CdmCollection<CdmTraitReference> traitCollection = new CdmCollection<CdmTraitReference>(this.Ctx, this.Owner, CdmObjectType.TraitRef);

            traitCollection.AddRange((IEnumerable<CdmTraitReference>)this.Where(x => x is CdmTraitReference));

            return traitCollection;
        }

        /// <summary>
        /// Returns a new collection consisting of only the trait group reference objects present in this collection.
        /// </summary>
        /// <returns>New collection of found trait group reference objects</returns>
        public CdmCollection<CdmTraitGroupReference> ToTraitGroupRefs()
        {
            CdmCollection<CdmTraitGroupReference> traitGroupCollection = new CdmCollection<CdmTraitGroupReference>(this.Ctx, this.Owner, CdmObjectType.TraitGroupRef);

            traitGroupCollection.AddRange((IEnumerable<CdmTraitGroupReference>)this.Where(x => x is CdmTraitGroupReference));

            return traitGroupCollection;
        }

        /// <summary>
        /// Checks whether a <see cref="CdmTraitReference"/> has a particular name.
        /// </summary>
        /// <param name="traitReference">The trait reference.</param>
        /// <param name="traitDefinition">The trait name.</param>
        /// <returns>Whether the trait reference has the given name.</returns>
        private bool Corresponds(CdmTraitReferenceBase traitReference, string traitName)
        {
            return string.Equals(traitReference.FetchObjectDefinitionName(), traitName);
        }

        /// <summary>
        /// Clears the trait cache of the owner if the owner object contains such a cache.
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
