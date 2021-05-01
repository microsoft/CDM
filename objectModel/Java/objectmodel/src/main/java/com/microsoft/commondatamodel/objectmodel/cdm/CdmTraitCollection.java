// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;
import java.util.Objects;

/**
 * {@link CdmCollection} customized for {@link CdmTraitReferenceBase}
 */
public class CdmTraitCollection extends CdmCollection<CdmTraitReferenceBase> {
  /**
   * Constructs a CdmTraitCollection by using parent constructor and TraitRef as default ObjectType.
   *
   * @param ctx   The context.
   * @param owner The object this collection is a member of.
   */
  public CdmTraitCollection(final CdmCorpusContext ctx, final CdmObject owner) {
    super(ctx, owner, CdmObjectType.TraitRef);
  }

  @Override
  public void add(int index, CdmTraitReferenceBase cdmTraitReference) {
    this.clearCache();
    super.add(index, cdmTraitReference);
  }

  @Override
  public CdmTraitReferenceBase add(final String name) {
    return this.add(name, false);
  }

  @Override
  public CdmTraitReferenceBase add(final String name, final boolean simpleRef) {
    this.clearCache();
    return super.add(name, simpleRef);
  }

  @Override
  public CdmTraitReferenceBase add(final CdmTraitReferenceBase cdmTraitReference) {
    this.clearCache();
    return super.add(cdmTraitReference);
  }

  /**
   * Creates a {@link CdmTraitReference}
   * based on a {@link CdmTraitDefinition} and adds it to the collection
   *
   * @param traitDefinition The trait definition used to create the trait reference.
   * @return The created Trait Reference that was added to the CdmCollection.
   */
  public CdmTraitReference add(final CdmTraitDefinition traitDefinition) {
    return add(traitDefinition, false);
  }

  /**
   * Creates a {@link CdmTraitGroupReference}
   * based on a {@link CdmTraitGroupDefinition} and adds it to the collection
   *
   * @param traitGroupDefinition The trait group definition used to create the trait group reference.
   * @return The created Trait Group Reference that was added to the CdmCollection.
   */
  public CdmTraitGroupReference add(final CdmTraitGroupDefinition traitGroupDefinition) {
    return add(traitGroupDefinition, false);
  }

  /**
   * Creates a {@link CdmTraitReference}
   * based on a {@link CdmTraitDefinition} and adds it to the collection
   *
   * @param traitDefinition The trait definition used to create the trait reference.
   * @param simpleRef       Used to set trait.SimpleNamedReference in constructor.
   * @return The created Trait Reference that was added to the CdmCollection.
   */
  public CdmTraitReference add(final CdmTraitDefinition traitDefinition, final boolean simpleRef) {
    this.clearCache();
    final CdmTraitReference traitReference =
        new CdmTraitReference(
            this.getCtx(),
            traitDefinition,
            simpleRef,
            false);
    super.add(traitReference);
    return traitReference;
  }

  /**
   * Creates a {@link CdmTraitGroupReference}
   * based on a {@link CdmTraitGroupDefinition} and adds it to the collection
   *
   * @param traitGroupDefinition The trait group definition used to create the trait group reference.
   * @param simpleRef       Used to set trait.SimpleNamedReference in constructor.
   * @return The created Trait Group Reference that was added to the CdmCollection.
   */
  public CdmTraitGroupReference add(final CdmTraitGroupDefinition traitGroupDefinition, final boolean simpleRef) {
    this.clearCache();
    final CdmTraitGroupReference traitGroupReference =
            new CdmTraitGroupReference(
                    this.getCtx(),
                    traitGroupDefinition,
                    simpleRef);
    super.add(traitGroupReference);
    return traitGroupReference;
  }

  /**
   * Removes the {@link CdmTraitReference} that has the same name as {@link CdmTraitDefinition}.
   * If multiple matches, removes the first one that is from property, or if there isn't any from
   * property and "onlyFromProperty" is false, removes the last one that is not from property.
   *
   * @param traitDefToRemove {@link CdmTraitDefinition} whose reference
   *                         needs to be removed from the collection.
   * @return Whether the operation completed successfully.
   */
  public boolean remove(final CdmTraitDefinition traitDefToRemove) {
    return remove(traitDefToRemove, false);
  }

  /**
   * Removes the {@link CdmTraitGroupReference} that has the same name as {@link CdmTraitGroupDefinition}.
   * If there are multiple matches, removes the first found.
   *
   * @param traitGroupDefToRemove {@link CdmTraitGroupDefinition} whose reference
   *                         needs to be removed from the collection.
   * @return Whether the operation completed successfully.
   */
  public boolean remove(final CdmTraitGroupDefinition traitGroupDefToRemove) {
    return remove(traitGroupDefToRemove.getTraitGroupName());
  }

  /**
   * Removes the {@link CdmTraitReference} that has the same name as {@link CdmTraitDefinition}.
   * If multiple matches, removes the first one that is from property, or if there isn't any from
   * property and "onlyFromProperty" is false, removes the last one that is not from property.
   *
   * @param traitDefToRemove {@link CdmTraitDefinition} whose reference
   *                         needs to be removed from the collection.
   * @param onlyFromProperty Whether function should only be applied
   *                         for traits that originate from properties.
   * @return Whether the operation completed successfully.
   */
  public boolean remove(final CdmTraitDefinition traitDefToRemove, final boolean onlyFromProperty) {
    return remove(traitDefToRemove.getTraitName(), onlyFromProperty);
  }

  @Override
  public void removeAt(int index) {
    this.clearCache();
    super.removeAt(index);
  }

  /**
   * Removes trait or trait group with the specified name from the collection.
   * If multiple matches, removes the first one by prioritizing those that are from properties.
   *
   * @param traitRefName The name of the trait or trait group reference to be removed.
   * @return Whether a trait was removed from the collection.
   */
  public boolean remove(final String traitRefName) {
    return this.remove(traitRefName, false);
  }

  /**
   * Removes trait ref or trait group ref with the specified name from the collection.
   * If multiple matches, removes the first one by prioritizing traits that are from properties
   * even if "onlyFromProperty" parameter is false.
   *
   * @param traitRefName        The name of the trait reference to be removed.
   * @param onlyFromProperty Whether function should only be applied
   *                         for traits that originate from properties. Not applicable for trait groups
   * @return Whether a trait ref or trait group ref was removed from the collection.
   */
  public boolean remove(final String traitRefName, final boolean onlyFromProperty) {
    CdmTraitReferenceBase foundTraitNotFromProperty = null;

    this.clearCache();

    for (final CdmTraitReferenceBase traitRef : this) {
      if (this.corresponds(traitRef, traitRefName)) {
        if (traitRef instanceof CdmTraitReference && ((CdmTraitReference)traitRef).isFromProperty()) {
          return super.remove(traitRef);
        }
        foundTraitNotFromProperty = traitRef;
      }
    }

    if (!onlyFromProperty && foundTraitNotFromProperty != null) {
      return super.remove(foundTraitNotFromProperty);
    }

    return false;
  }

  /**
   * Removes a trait ref or trait group ref with the same name as the trait provided.
   * If there are multiple matches, removes the first trait that is from property. If there aren't any from properties
   * and "onlyFromProperty" is false, removes the last trait that is not from a property.
   *
   * @param traitToRemove The trait to be removed.
   * @return Whether a trait ref or trait group ref was removed from the collection.
   */
  public boolean remove(final CdmTraitReferenceBase traitToRemove) {
    return remove(traitToRemove, false);
  }

  /**
   * Removes a trait with the same name as the trait provided.
   *
   * @param traitToRemove    The trait to be removed.
   * @param onlyFromProperty Whether function should only be applied for traits
   *                         that originate from properties. Not applicable for trait groups
   * @return Whether a trait was removed from the collection.
   */
  public boolean remove(final CdmTraitReferenceBase traitToRemove, final boolean onlyFromProperty) {
    return this.remove(traitToRemove.fetchObjectDefinitionName(), onlyFromProperty);
  }

  @Override
  public void clear() {
    this.clearCache();
    super.clear();
  }

  /**
   * The index of a trait reference with the same name as the trait definition provided.
   * If multiple matches, retrieves the index of the first one that is from property, or if there
   * isn't any from property and "onlyFromProperty" is false, the index of the last one that is
   * not from property.
   *
   * @param traitDefinition The trait definition associated with the trait reference
   *                        we want to retrieve the index of.
   * @return The index of the trait reference or -1 if no such trait exists in the collection.
   */
  public int indexOf(final CdmTraitDefinition traitDefinition) {
    return this.indexOf(traitDefinition, false);
  }

  /**
   * Retrieves the index of a trait group reference with the same name as the trait group definition provided.
   * If there are multiple matches, returns the index of the last trait group that is not from a property.
   *
   * @param traitGroupDefinition The trait group definition associated with the trait group reference we want to retrieve the index of.
   * @return The index of the trait group reference or -1 if no such trait group reference exists in the collection.
   */
  public int indexOf(final CdmTraitGroupDefinition traitGroupDefinition) {
    return this.indexOf(traitGroupDefinition.getTraitGroupName(), false);
  }

  /**
   * The index of a trait reference with the same name as the trait definition provided.
   * If multiple matches, retrieves the index of the first one that is from property, or if there
   * isn't any from property and "onlyFromProperty" is false, the index of the last one that is
   * not from property.
   * @param traitDefinition  The trait definition associated with the trait reference
   *                         we want to retrieve the index of.
   * @param onlyFromProperty Whether function should only be applied
   *                         for traits that originate from properties.
   * @return The index of the trait reference or -1 if no such trait exists in the collection.
   */
  public int indexOf(final CdmTraitDefinition traitDefinition, final boolean onlyFromProperty) {
    return this.indexOf(traitDefinition.getTraitName(), onlyFromProperty);
  }

  /**
   * The index of a trait or trait group reference with the given name.
   * If multiple matches, retrieves the index of the last one that is not from property.
   * @param traitName The trait ref or trait group ref name associated with the name
   *                  we want to retrieve the index of.
   * @return The index of the trait or trait group reference or -1 if no such reference exists in the collection.
   */
  public int indexOf(final String traitName) {
    return this.indexOf(traitName, false);
  }

  /**
   * Retrieves the index of a trait reference or trait group reference with the given name.
   * If there are multiple matches, returns the index of the first item that is from a property.
   * If there aren't any from properties and "onlyFromProperty" is false, returns the index of the last item that is not from a property.
   *
   * @param traitName        The name associated with the reference
   *                         we want to retrieve the index of.
   * @param onlyFromProperty Whether function should only be applied for traits
   *                         that originate from properties. Not applicable for trait groups.
   * @return The index of the trait or trait group reference or -1 if no such reference exists in the collection.
   */
  public int indexOf(final String traitName, final boolean onlyFromProperty) {
    int indexOfTraitNotFromProperty = -1;
    for (int index = 0; index < this.size(); index++) {
      if (this.corresponds(this.get(index), traitName)) {
        CdmTraitReferenceBase ref = this.get(index);
        if (ref instanceof CdmTraitGroupReference || ((CdmTraitReference)this.get(index)).isFromProperty()) {
          return index;
        }
        indexOfTraitNotFromProperty = index;
      }
    }

    if (!onlyFromProperty) {
      return indexOfTraitNotFromProperty;
    }
    return -1;
  }

  /**
   * The index in the collection of a trait with the same name as the trait provided.
   *
   * @param trait            The trait we want the index of.
   * @param onlyFromProperty Whether function should only be applied for traits
   *                         that originate from properties.
   * @return The index of the trait reference or -1 if no such trait exists in the collection.
   */
  public int indexOf(final CdmTraitReferenceBase trait, final boolean onlyFromProperty) {
    return this.indexOf(trait.fetchObjectDefinitionName(), onlyFromProperty);
  }

  /**
   * Adds the elements of a list of {@link CdmTraitDefinition} to the collection,
   * after converting them to {@link CdmTraitReference}.
   *
   * @param traitList The list of trait definitions used to create trait references
   *                  that will be added to the collection.
   */
  public void addAll(final List<CdmTraitDefinition> traitList) {
    traitList.forEach(this::add);
  }

  /**
   * Adds the elements of a list of {@link CdmTraitGroupDefinition} to the collection,
   * after converting them to {@link CdmTraitGroupReference}.
   *
   * @param traitGroupList The list of trait definitions used to create trait references
   *                  that will be added to the collection.
   */
  public void addAllTraitGroupDefs(final List<CdmTraitGroupDefinition> traitGroupList) {
    traitGroupList.forEach(this::add);
  }

  /**
   * Returns a new collection consisting of only the trait reference objects present in this collection.
   * @return New collection of found trait reference objects
   */
  public CdmCollection<CdmTraitReference> toTraitRefs() {
    CdmCollection<CdmTraitReference> traitCollection = new CdmCollection<>(getCtx(), getOwner(), CdmObjectType.TraitRef);

    this.forEach(x -> {
      if (x instanceof CdmTraitReference) {
        traitCollection.add((CdmTraitReference) x);
      }
    });

    return traitCollection;
  }

  /**
   * Returns a new collection consisting of only the trait group reference objects present in this collection.
   * @return New collection of found trait group reference objects
   */
  public CdmCollection<CdmTraitGroupReference> toTraitGroupRefs() {
    CdmCollection<CdmTraitGroupReference> traitCollection = new CdmCollection<>(getCtx(), getOwner(), CdmObjectType.TraitGroupRef);

    this.forEach(x -> {
      if (x instanceof CdmTraitGroupReference) {
        traitCollection.add((CdmTraitGroupReference) x);
      }
    });

    return traitCollection;
  }

  /**
   * Checks whether a {@link CdmTraitReferenceBase} has a particular name.
   *
   * @param traitReferenceBase The trait reference base.
   * @param traitName      The trait name.
   * @return Whether the trait reference base has the given name.
   */
  private boolean corresponds(final CdmTraitReferenceBase traitReferenceBase, final String traitName) {
    return Objects.equals(traitReferenceBase.fetchObjectDefinitionName(), traitName);
  }

  /**
   * Clears the Trait Cache of the owner if owner object contains such a cache.
   */
  private void clearCache() {
    final CdmObjectBase owner;
    if (this.getOwner() instanceof CdmObjectBase) {
      owner = (CdmObjectBase) this.getOwner();
      owner.clearTraitCache();
    }
  }
}
