// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.List;
import java.util.Objects;

/**
 * It extends {@link CdmCollection} and adds additional behaviors specific to entity collections.
 */
public class CdmEntityCollection extends CdmCollection<CdmEntityDeclarationDefinition> {

  private static final String TAG = CdmEntityCollection.class.getSimpleName();
  /**
   * Constructs a CdmEntityCollection by using parent constructor
   * and {@link CdmLocalEntityDeclarationDefinition}.
   *
   * @param ctx   The context.
   * @param owner The object this collection is a member of.
   */
  public CdmEntityCollection(final CdmCorpusContext ctx, final CdmObject owner) {
    super(ctx, owner, CdmObjectType.LocalEntityDeclarationDef);
  }

  /**
   * Creates an entityDeclaration based on an EntityDefinition and adds it to the list.
   * Calls {@code add(CdmEntityDefinition entity, boolean simpleRef)} with simpleRef as false.
   *
   * @param entity Creates an entityDeclaration based on an EntityDefinition and adds it to the list.
   * @return The Entity Declaration Definition that was added to the Cdm Collection.
   */
  public CdmEntityDeclarationDefinition add(final CdmEntityDefinition entity) {
    return add(entity, false);
  }

  /**
   * Creates an entityDeclaration based on an EntityDefinition and adds it to the list.
   *
   * @param entity    Creates an entityDeclaration based on an EntityDefinition and adds it to the list.
   * @param simpleRef Whether it is a simple name ref.
   * @return The Entity Declaration Definition that was added to the Cdm Collection.
   */
  public CdmEntityDeclarationDefinition add(final CdmEntityDefinition entity, final boolean simpleRef) {
    final CdmCorpusDefinition cdmCorpus = this.getCtx().getCorpus();

    if (entity.getOwner() == null) {
      Logger.error(entity.getCtx(), TAG, "add", entity.getAtCorpusPath(), CdmLogCode.ErrEntityCreationFailed);
      return null;
    }

    final CdmEntityDeclarationDefinition entityDeclaration = cdmCorpus.makeObject(
        CdmObjectType.LocalEntityDeclarationDef,
        entity.getName(),
        simpleRef);
    entityDeclaration.setOwner(this.getOwner());
    entityDeclaration.setEntityPath(
        this
            .getCtx()
            .getCorpus()
            .getStorage()
            .createRelativeCorpusPath(
                entity.getOwner().getAtCorpusPath() + "/" + entity.getEntityName(),
                this.getOwner().getInDocument())
    );
    entityDeclaration.setExplanation(entity.getExplanation());

    return this.add(entityDeclaration);
  }

  /**
   * Adds a new entity to the collection with the given name and the given entityPath.
   * Calls {@code add(String name, String entityPath, boolean simpleRef)} with simpleRef as false.
   *
   * @param name       The name of the entity.
   * @param entityPath The address the entity can be retrieved from.
   * @return The Entity Declaration Definition that was added to the Cdm Collection.
   */

  public CdmEntityDeclarationDefinition add(final String name, final String entityPath) {
    return this.add(name, entityPath, false);
  }

  /**
   * Adds a new entity to the collection with the given name and the given entityPath.
   *
   * @param name       The name of the entity.
   * @param entityPath The address the entity can be retrieved from.
   * @param simpleRef  Parameter is unused for this collection. Kept for consistency with other CdmCollections.
   * @return The Entity Declaration Definition that was added to the Cdm Collection.
   */
  public CdmEntityDeclarationDefinition add(final String name, final String entityPath, final boolean simpleRef) {
    final CdmEntityDeclarationDefinition entityDefinition = this.add(name, simpleRef);
    entityDefinition.setEntityPath(entityPath);
    return entityDefinition;
  }

  /**
   * Adds the elements of a list of {@link CdmEntityDefinition} to the collection.
   *
   * @param entityList list of {@link CdmEntityDefinition} to add.
   */
  public void addAll(final List<CdmEntityDefinition> entityList) {
    entityList.forEach(this::add);
  }

  /**
   * Remove the {@link CdmEntityReference} that points to the provided {@link CdmEntityDefinition}.
   *
   * @param entityDefToRemove {@link CdmEntityDefinition}
   *                          whose reference needs to be removed from the collection.
   * @return Whether the operation completed successfully.
   */
  public boolean remove(final CdmEntityDefinition entityDefToRemove) {
    for (final CdmEntityDeclarationDefinition entity : this.getAllItems()) {
      if (Objects.equals(entity.getEntityName(), entityDefToRemove.getEntityName())) {
        return super.remove(entity);
      }
    }
    return false;
  }
}
