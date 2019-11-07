package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;

/**
 * {@link CdmCollection} customized for {@link CdmFolderDefinition}
 * that are the children of af the Owner CdmFolderDefinition.
 */
public class CdmFolderCollection extends CdmCollection<CdmFolderDefinition> {

  /**
   * Constructs a CdmFolderCollection
   *
   * @param ctx          The context.
   * @param parentFolder The owner of the collection, which has to be the parent folder.
   */
  public CdmFolderCollection(final CdmCorpusContext ctx, final CdmFolderDefinition parentFolder) {
    super(ctx, parentFolder, CdmObjectType.FolderDef);
  }

  @Override
  public CdmFolderDefinition getOwner() {
    return (CdmFolderDefinition) super.getOwner();
  }

  @Override
  public void add(int index, CdmFolderDefinition childFolder) {
    this.addItemModifications(childFolder);
    super.add(index, childFolder);
  }

  @Override
  public CdmFolderDefinition add(final CdmFolderDefinition childFolder) {
    this.addItemModifications(childFolder);
    return super.add(childFolder);
  }

  @Override
  public CdmFolderDefinition add(final String name) {
    return this.add(name, false);
  }

  @Override
  public CdmFolderDefinition add(final String name, final boolean simpleRef) {
    final CdmFolderDefinition childFolder =
        this.getCtx().getCorpus().makeObject(this.getDefaultType(),
            name,
            simpleRef);
    this.add(childFolder);
    return childFolder;
  }

  /**
   * Adds the elements of a list of {@link CdmFolderDefinition} to the collection.
   *
   * @param folderList list of {@link CdmFolderDefinition} to add.
   */
  public void addAll(final List<CdmFolderDefinition> folderList) {
    folderList.forEach(this::add);
  }

  /**
   * Performs changes to an item that is added to the collection.
   * Does not actually add the item to the collection.
   * @param childFolder The item that needs to be changed.
   */
  private void addItemModifications(CdmFolderDefinition childFolder) {
    childFolder.setCorpus(this.getOwner().getCorpus());
    childFolder.setNamespace(this.getOwner().getNamespace());
    childFolder.setFolderPath(this.getOwner().getFolderPath() + childFolder.getName() + "/");
  }
}
