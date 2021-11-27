// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

public class RelationshipInfo {
  private boolean isByRef;
  private boolean isArray;
  private boolean selectsOne;

  public void setSelectsOne(final boolean selectsOne) {
    this.selectsOne = selectsOne;
  }

  public boolean isArray() {
    return isArray;
  }

  public void setArray(final boolean isArray) {
    this.isArray = isArray;
  }

  public boolean doSelectsOne() {
    return selectsOne;
  }

  public boolean isByRef() {
    return isByRef;
  }

  public void setByRef(final boolean isByRef) {
    this.isByRef = isByRef;
  }
}
