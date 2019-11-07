package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;

public class CdmDefinitionCollection extends CdmCollection<CdmObjectDefinition> {
  public CdmDefinitionCollection(final CdmCorpusContext ctx, final CdmObject owner) {
    super(ctx, owner, CdmObjectType.EntityDef);
  }

  @Override
  public CdmDocumentDefinition getOwner() {
    return (CdmDocumentDefinition) super.getOwner();
  }

  @Override
  public void add(int index, CdmObjectDefinition definition) {
    this.addItemModifications(definition);
    super.add(index, definition);
  }

  @Override
  public CdmEntityDefinition add(final String name) {
    return this.add(name, false);
  }

  @Override
  public CdmEntityDefinition add(final String name, final boolean simpleRef) {
    final CdmEntityDefinition entity =
        this.getCtx().getCorpus().makeObject(this.getDefaultType(), name, false);
    this.add(entity);
    return entity;
  }

  /**
   * Creates a {@link CdmObject} of the provided type,
   * with the provided name and adds it to the collection.
   *
   * @param ofType The type of the object to be created and added to the list.
   * @param name   The name to be used for the created object.<
   * @return The created object after it was added to the collection.
   */
  public CdmObjectDefinition add(final CdmObjectType ofType, final String name) {
    final CdmObjectDefinition createdObject =
        this.getCtx().getCorpus().makeObject(ofType, name, false);
    this.add(createdObject);
    return createdObject;
  }

  @Override
  public CdmObjectDefinition add(final CdmObjectDefinition cdmObjectDefinition) {
    this.addItemModifications(cdmObjectDefinition);
    return super.add(cdmObjectDefinition);
  }

  public void addAll(final List<CdmObjectDefinition> objectsList) {
    objectsList.forEach(this::add);
  }

  /**
   * Performs changes to an item that is added to the collection.
   * Does not actually add the item to the collection.
   *
   * @param definition The item that needs to be changed.
   */
  private void addItemModifications(CdmObjectDefinition definition) {
    if (definition instanceof CdmObjectBase) {
      CdmObjectBase definitionAsObjectBase = (CdmObjectBase) definition;
      definitionAsObjectBase.setDocCreatedIn(this.getOwner());
    }
  }
}
