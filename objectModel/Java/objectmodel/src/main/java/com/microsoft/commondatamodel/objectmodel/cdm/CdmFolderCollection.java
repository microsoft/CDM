// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * {@link CdmCollection} customized for {@link CdmFolderDefinition}
 * that are the children of af the Owner CdmFolderDefinition.
 */
public class CdmFolderCollection extends CdmCollection<CdmFolderDefinition> {
  Lock folderLock;

  /**
   * Constructs a CdmFolderCollection
   *
   * @param ctx          The context.
   * @param parentFolder The owner of the collection, which has to be the parent folder.
   */
  public CdmFolderCollection(final CdmCorpusContext ctx, final CdmFolderDefinition parentFolder) {
    super(ctx, parentFolder, CdmObjectType.FolderDef);
    this.folderLock = new ReentrantLock();
  }

  @Override
  public CdmFolderDefinition getOwner() {
    return (CdmFolderDefinition) super.getOwner();
  }

  @Override
  public void add(int index, CdmFolderDefinition childFolder) {
    this.folderLock.lock();

    this.addItemModifications(childFolder);
    super.add(index, childFolder);

    this.folderLock.unlock();
  }

  @Override
  public CdmFolderDefinition add(final CdmFolderDefinition childFolder) {
    this.folderLock.lock();

    this.addItemModifications(childFolder);
    super.add(childFolder);

    this.folderLock.unlock();

    return childFolder;

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

    // TODO: At this point we should also propagate the root adapter into the child folder
    // and all its sub-folders and contained documents. For now, don't add things to the
    // folder unless it's tied to an adapter root.
  }

  /**
   * Gets a folder by name or creates if it doesn't exist.
   * @param name
   * @return
   */
  CdmFolderDefinition getOrCreate(String name) {
    this.folderLock.lock();

    CdmFolderDefinition result = null;
    for (int i = 0; i < this.size(); i++) {
      CdmFolderDefinition folder = this.get(i);
      if (name.equalsIgnoreCase(folder.getName())) {
        result = folder;
        break;
      }
    }

    if (result == null) {
      result = this.add(name);
    }

    this.folderLock.unlock();

    return result;
  }
}
