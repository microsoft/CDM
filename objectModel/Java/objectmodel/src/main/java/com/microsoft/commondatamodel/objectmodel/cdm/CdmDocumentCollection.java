// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;
import java.util.Objects;

/**
 * {@link CdmCollection} customized for {@link CdmDocumentDefinition}.
 */
public class CdmDocumentCollection extends CdmCollection<CdmDocumentDefinition> {
  /**
   * Constructs a CdmDocumentCollection by using parent constructor and DocumentDef as default type
   *
   * @param ctx   The context.
   * @param owner The object this collection is a member of.
   */
  public CdmDocumentCollection(final CdmCorpusContext ctx, final CdmFolderDefinition owner) {
    super(ctx, owner, CdmObjectType.DocumentDef);
  }

  @Override
  public CdmFolderDefinition getOwner() {
    return (CdmFolderDefinition) super.getOwner();
  }

  @Override
  public void add(int index, CdmDocumentDefinition document) {
    this.addItemModifications(document);
    // Why is this collection unlike all other collections?
    // Because documents are in folders. Folders are not in documents.
    document.setOwner(this.getOwner());
    this.getAllItems().add(index, document);
  }

  @Override
  public CdmDocumentDefinition add(final CdmDocumentDefinition document) {
    this.addItemModifications(document);
    // Why is this collection unlike all other collections?
    // Because documents are in folders. folders are not in documents.
    document.setOwner(this.getOwner());
    allItems.add(document);
    return document;
  }

  /**
   * Adds a document to the collection after it sets the name with the given parameter.
   *
   * @param document     The document to be added to the collection.
   * @param documentName The name of the document will be set to this value.
   */
  public void add(final CdmDocumentDefinition document, final String documentName) {
    document.setName(documentName);
    this.add(document);
  }

  public CdmDocumentDefinition add(final String name) {
    return this.add(name, false);
  }

  @Override
  public CdmDocumentDefinition add(final String name, final boolean simpleRef) {
    final CdmDocumentDefinition document =
        this.getCtx().getCorpus().makeObject(this.getDefaultType(), name, simpleRef);
    this.add(document);
    return document;
  }

  public void addAll(final List<CdmDocumentDefinition> documents) {
    documents.forEach(this::add);
  }

  @Override
  public boolean remove(final CdmDocumentDefinition document) {
    return this.remove(document.getName());
  }

  /**
   * Removes the document with specified name from the collection.
   *
   * @param name The name of the document to be removed from the collection.
   * @return Whether the operation completed successfully.
   */
  public boolean remove(final String name) {
    if (this.getOwner().getDocumentLookup().containsKey(name)) {
      this.removeItemModifications(name);
      for (int i = 0; i < this.getAllItems().size(); i++) {
        if (Objects.equals(this.getAllItems().get(i).getName(), name)) {
          // setting this currentlyResolving flag will keep the base collection code from setting the inDocument to null
          // this makes sense because a document is "in" itself. always.
          boolean save = this.getCtx().getCorpus().isCurrentlyResolving;
          this.getCtx().getCorpus().isCurrentlyResolving = true;
          super.removeAt(i);
          this.getCtx().getCorpus().isCurrentlyResolving = save;
          return true;
        }
      }
    }
    return false;
  }

  @Override
  public void removeAt(int index) {
    if (index >= 0 && index < this.allItems.size()) {
      this.remove(this.allItems.get(index).getName());
    }
  }

  @Override
  public void clear() {
    this.getAllItems().forEach((doc) -> this.removeItemModifications(doc.getName()));
    super.clear();
  }

  /**
   * Performs changes to an item that is added to the collection.
   * Does not actually add the item to the collection.
   *
   * @param document The item that needs to be changed.
   */
  private void addItemModifications(CdmDocumentDefinition document) {
    if (document.getOwner() != null && document.getOwner() != this.getOwner()) {
      // This is fun! The document is moving from one folder to another.
      // It must be removed from the old folder for sure, but also now there will be a problem with
      // any corpus paths that are relative to that old folder location.
      // So, whip through the document and change any corpus paths to be relative to this folder.
      document.localizeCorpusPaths(this.getOwner());
      // Returns false if it fails, but ... who cares? We tried.
      ((CdmFolderDefinition) document.getOwner()).getDocuments().remove(document.getName());
    }

    document.setFolderPath(this.getOwner().getFolderPath());
    document.setFolder(this.getOwner());
    document.setNamespace(this.getOwner().getNamespace());
    document.setNeedsIndexing(true);
    // Set the document to dirty so it will get saved in the new folder location if saved.
    makeDocumentDirty();
    this.getOwner().getCorpus().addDocumentObjects(this.getOwner(), document);
    this.getOwner().getDocumentLookup().put(document.getName(), document);
  }

  /**
   * Performs changes associated with removing an item from the collection.
   * Does not actually remove the item from the collection.
   *
   * @param documentName The name of the document that is to be removed.
   */
  private void removeItemModifications(String documentName) {
    this.getOwner().getCorpus().removeDocumentObjects(
        this.getOwner(),
        this.getOwner().getDocumentLookup().get(documentName));
    this.getOwner().getDocumentLookup().remove(documentName);
  }
}
