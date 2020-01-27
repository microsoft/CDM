package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;
import java.util.Objects;

/**
 * {@link CdmCollection} customized for {@link CdmTraitReference}
 */
public class CdmTraitCollection extends CdmCollection<CdmTraitReference> {
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
  public void add(int index, CdmTraitReference cdmTraitReference) {
    this.clearCache();
    super.add(index, cdmTraitReference);
  }

  @Override
  public CdmTraitReference add(final String name) {
    return this.add(name, false);
  }

  @Override
  public CdmTraitReference add(final String name, final boolean simpleRef) {
    this.clearCache();
    return super.add(name, simpleRef);
  }

  @Override
  public CdmTraitReference add(final CdmTraitReference cdmTraitReference) {
    this.clearCache();
    return super.add(cdmTraitReference);
  }

  /**
   * Creates a {@link CdmTraitDefinition}
   * based on a {@link CdmTraitDefinition} and adds it to the collection
   *
   * @param traitDefinition The trait definition used to create the trait reference.
   * @return The created Trait Reference that was added to the CdmCollection.
   */
  public CdmTraitReference add(final CdmTraitDefinition traitDefinition) {
    return this.add(traitDefinition, false);
  }

  /**
   * Creates a {@link CdmTraitDefinition}
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
   * Removes the {@link CdmTraitReference} that has the same name as {@link CdmTraitDefinition}.
   * If multiple matches, removes the first one that is from property, or if there isn't any from
   * property and "onlyFromProperty" is false, removes the last one that is not from property.
   *
   * @param traitDefToRemove {@link CdmTraitDefinition} whose reference
   *                         needs to be removed from the collection.
   * @return Whether the operation completed successfully.
   */
  public boolean remove(final CdmTraitDefinition traitDefToRemove) {
    return this.remove(traitDefToRemove, false);
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
    final String traitName = traitDefToRemove.getTraitName();
    return this.remove(traitName, onlyFromProperty);
  }

  @Override
  public void removeAt(int index) {
    this.clearCache();
    super.removeAt(index);
  }

  /**
   * Removes trait with the specified name from the collection.
   * If multiple matches, removes the first one by prioritizing traits that are from properties
   * even if "onlyFromProperty" parameter is false.
   *
   * @param traitName The name of the trait to be removed.
   * @return Whether a trait was removed from the collection.
   */
  public boolean remove(final String traitName) {
    return this.remove(traitName, false);
  }

  /**
   * Removes trait with the specified name from the collection.
   * If multiple matches, removes the first one by prioritizing traits that are from properties
   * even if "onlyFromProperty" parameter is false.
   *
   * @param traitName        The name of the trait to be removed.
   * @param onlyFromProperty Whether function should only be applied
   *                         for traits that originate from properties.
   * @return Whether a trait was removed from the collection.
   */
  public boolean remove(final String traitName, final boolean onlyFromProperty) {
    this.makeDocumentDirty();
    CdmTraitReference foundTraitNotFromProperty = null;
    this.clearCache();
    for (final CdmTraitReference trait : this.getAllItems()) {
      if (this.corresponds(trait, traitName)) {
        if (trait.isFromProperty()) {
          this.propagateInDocument(trait, null);
          return this.getAllItems().remove(trait);
        }
        foundTraitNotFromProperty = trait;
      }
    }
    if (!onlyFromProperty && foundTraitNotFromProperty != null) {
      this.propagateInDocument(foundTraitNotFromProperty, null);
      return this.getAllItems().remove(foundTraitNotFromProperty);
    }
    return false;
  }

  /**
   * Removes a trait with the same name as the trait provided.
   * If multiple matches, removes the first one that is from property, or if there isn't any from
   * property and "onlyFromProperty" is false, removes the last one that is not from property.
   * @param traitToRemove The trait to be removed.
   * @return Whether a trait was removed from the collection.
   */
  public boolean remove(final CdmTraitReference traitToRemove) {
    return this.remove(traitToRemove, false);
  }

  /**
   * Removes a trait with the same name as the trait provided.
   *
   * @param traitToRemove    The trait to be removed.
   * @param onlyFromProperty Whether function should only be applied for traits
   *                         that originate from properties.
   * @return Whether a trait was removed from the collection.
   */
  public boolean remove(final CdmTraitReference traitToRemove, final boolean onlyFromProperty) {
    final String traitName = traitToRemove.fetchObjectDefinitionName();
    return this.remove(traitName, onlyFromProperty);
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
    final String traitName = traitDefinition.getTraitName();
    return this.indexOf(traitName, onlyFromProperty);
  }

  /**
   * The index of a trait reference with the given name.
   * If multiple matches, retrieves the index of the first one that is from property, or if there
   * isn't any from property and "onlyFromProperty" is false, the index of the last one that is
   * not from property.
   * @param traitName The trait name associated with the trait reference
   *                  we want to retrieve the index of.
   * @return The index of the trait reference or -1 if no such trait exists in the collection.
   */
  public int indexOf(final String traitName) {
    return this.indexOf(traitName, false);
  }

  /**
   * The index of a trait reference with the given name.
   *
   * @param traitName        The trait name associated with the trait reference
   *                         we want to retrieve the index of.
   * @param onlyFromProperty Whether function should only be applied for traits
   *                         that originate from properties.
   * @return The index of the trait reference or -1 if no such trait exists in the collection.
   */
  public int indexOf(final String traitName, final boolean onlyFromProperty) {
    int indexOfTraitNotFromProperty = -1;
    for (int index = 0; index < this.getAllItems().size(); index++) {
      if (this.corresponds(this.getAllItems().get(index), traitName)) {
        if (this.getAllItems().get(index).isFromProperty()) {
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
  public int indexOf(final CdmTraitReference trait, final boolean onlyFromProperty) {
    final String traitName = trait.fetchObjectDefinitionName();
    return this.indexOf(traitName, onlyFromProperty);
  }

  /**
   * Adds a the elements of a list of {@link CdmTraitDefinition} to the collection,
   * after converting them to {@link CdmTraitReference}.
   *
   * @param traitList The list of trait definitions used to create trait references
   *                  that will be added to the collection.
   */
  public void addAll(final List<CdmTraitDefinition> traitList) {
    this.addAll(traitList, false);
  }

  /**
   * Adds a the elements of a list of {@link CdmTraitDefinition} to the collection,
   * after converting them to {@link CdmTraitReference}.
   *
   * @param traitList The list of trait definitions used to create trait references
   *                  that will be added to the collection.
   * @param simpleRef Parameter is unused for this collection.
   *                  Kept for consistency with other CdmCollections.
   */
  public void addAll(final List<CdmTraitDefinition> traitList, final boolean simpleRef) {
    traitList.forEach(this::add);
  }

  /**
   * Checks whether a {@link CdmTraitReference} has a particular name.
   *
   * @param traitReference The trait reference.
   * @param traitName      The trait name.
   * @return Whether the trait reference has the given name.
   */
  private boolean corresponds(final CdmTraitReference traitReference, final String traitName) {
    return Objects.equals(traitReference.fetchObjectDefinitionName(), traitName);
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
