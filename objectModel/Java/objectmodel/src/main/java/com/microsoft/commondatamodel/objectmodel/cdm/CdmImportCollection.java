// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;

public class CdmImportCollection extends CdmCollection<CdmImport> {

  /**
   * Constructs a CdmImportCollection by using parent constructor.
   * and {@link CdmImport}.
   *
   * @param ctx   The context.
   * @param owner The owner of the collection.
   *              This class is customized for {@link CdmDocumentDefinition} owner.
   */
  public CdmImportCollection(final CdmCorpusContext ctx, final CdmObject owner) {
    super(ctx, owner, CdmObjectType.Import);
  }

  public CdmImport item(final String corpusPath, final String moniker, final boolean checkMoniker) {
    if (checkMoniker) {
      return this.allItems.stream().filter((x) -> corpusPath.equals(x.getCorpusPath())
              && ((x.getMoniker() == null && moniker == null) || (x.getMoniker() != null && x.getMoniker().equals(moniker)))).findFirst().orElse(null);
    } else {
      return this.allItems.stream().filter((x) -> corpusPath.equals(x.getCorpusPath())).findFirst().orElse(null);
    }
  }

  public CdmImport item(final String corpusPath, final String moniker) {
    return this.item(corpusPath, moniker, true);
  }

  @Override
  public CdmImport item(final String corpusPath) {
    return this.item(corpusPath, null);
  }

  @Override
  public CdmDocumentDefinition getOwner() {
    return (CdmDocumentDefinition) super.getOwner();
  }

  /**
   * Creates an import with the provided corpus path and adds it to the collection.
   * @param corpusPath The corpus path to be set for the import.
   * @return The created import which was added to the collection.
   */
  @Override
  public CdmImport add(final String corpusPath) {
    return super.add(corpusPath);
  }

  /**
   * Creates an import with the provided corpus path and adds it to the collection.
   * @param corpusPath The corpus path to be set for the import.
   * @param simpleRef Parameter is not used for this collection.
   *                  It is kept here for consistency with other {@link CdmCollection}-s.
   * @return The created import which was added to the collection.
   */
  @Override
  public CdmImport add(final String corpusPath, final boolean simpleRef) {
    final CdmImport cdmImport = this.getCtx()
        .getCorpus()
        .makeObject(this.getDefaultType(), corpusPath, simpleRef);
    this.add(cdmImport);
    return cdmImport;
  }

  /**
   * Creates an import with the provided corpus path
   * and provided moniker and adds it to the collection.
   * @param corpusPath The corpus path used to create the import.
   * @param moniker The moniker used to create the import.
   * @return The created import which was added to the collection.
   */
  public CdmImport add(final String corpusPath, final String moniker) {
    final CdmImport cdmImport = this.add(corpusPath);
    cdmImport.setMoniker(moniker);
    return cdmImport;
  }

  public void addAll(final List<CdmImport> importList) {
    importList.forEach(this::add);
  }
}
