package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * It extends {@link CdmCollection} and adds additional behaviors specific to entity collections.
 */
public class CdmEntityCollection extends CdmCollection<CdmEntityDeclarationDefinition> {
  private static final Logger LOGGER = LoggerFactory.getLogger(CdmEntityCollection.class);

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
      LOGGER.error("Expected entity to have an \"Owner\" document set. "
          + "Cannot create entity declaration to add to manifest.");
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
   * @return >Whether the operation completed successfully.
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
