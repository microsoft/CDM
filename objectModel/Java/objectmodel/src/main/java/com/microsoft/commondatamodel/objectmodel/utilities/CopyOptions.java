// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.utilities;

public class CopyOptions {

  /**
   * Turn simple named string object references into objects with a relative path. used for links in
   * viz.
   */
  private Boolean isStringRefs;
  private Boolean isRemoveSingleRowLocalizedTableTraits;

  /**
   * A value that helps us to figure out is the document that is using this object top level.
   */
  private boolean isTopLevelDocument;

  public CopyOptions() {
    this.isTopLevelDocument = true;
    this.isStringRefs = false;
  }

  public Boolean getIsStringRefs() {
    return isStringRefs;
  }

  public void setIsStringRefs(final Boolean isStringRefs) {
    this.isStringRefs = isStringRefs;
  }

  public Boolean getIsRemoveSingleRowLocalizedTableTraits() {
    return isRemoveSingleRowLocalizedTableTraits;
  }

  public void setIsRemoveSingleRowLocalizedTableTraits(final Boolean isRemoveSingleRowLocalizedTableTraits) {
    this.isRemoveSingleRowLocalizedTableTraits = isRemoveSingleRowLocalizedTableTraits;
  }

  /**
   * A value that helps us to figure out is the document that is using this object top level.
   * @return A value that helps us to figure out is the document that is using this object top level.
   */
  public boolean isTopLevelDocument() {
    return isTopLevelDocument;
  }

  /**
   * A value that helps us to figure out is the document that is using this object top level.
   * @param topLevelDocument A value that helps us to figure out is the document that is using this object top level.
   */
  public void setTopLevelDocument(final boolean topLevelDocument) {
    isTopLevelDocument = topLevelDocument;
  }
}