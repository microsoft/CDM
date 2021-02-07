// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import java.util.List;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class DocsResult {
  private String newSymbol;
  private CdmDocumentDefinition docBest;
  private List<CdmDocumentDefinition> docList;

  public List<CdmDocumentDefinition> getDocList() {
    return docList;
  }

  public void setDocList(final List<CdmDocumentDefinition> docList) {
    this.docList = docList;
  }

  public CdmDocumentDefinition getDocBest() {
    return docBest;
  }

  public void setDocBest(final CdmDocumentDefinition docBest) {
    this.docBest = docBest;
  }

  public String getNewSymbol() {
    return newSymbol;
  }

  public void setNewSymbol(final String newSymbol) {
    this.newSymbol = newSymbol;
  }
}
