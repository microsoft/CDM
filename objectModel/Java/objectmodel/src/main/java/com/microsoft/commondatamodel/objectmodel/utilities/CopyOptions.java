// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public boolean isTopLevelDocument() {
    return isTopLevelDocument;
  }

  /**
   * A value that helps us to figure out is the document that is using this object top level.
   * @param topLevelDocument A value that helps us to figure out is the document that is using this object top level.
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setTopLevelDocument(final boolean topLevelDocument) {
    isTopLevelDocument = topLevelDocument;
  }
}
