// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

public class RelationshipInfo {
  private ResolvedTraitSet rts;
  private boolean isByRef;
  private boolean isArray;
  private boolean selectsOne;
  private Integer nextDepth;
  private boolean maxDepthExceeded;

  public void setSelectsOne(final boolean selectsOne) {
    this.selectsOne = selectsOne;
  }

  public ResolvedTraitSet getRts() {
    return rts;
  }

  public void setRts(final ResolvedTraitSet rts) {
    this.rts = rts;
  }

  public boolean isArray() {
    return isArray;
  }

  public void setArray(final boolean isArray) {
    this.isArray = isArray;
  }

  public boolean isMaxDepthExceeded() {
    return maxDepthExceeded;
  }

  public void setMaxDepthExceeded(final boolean maxDepthExceeded) {
    this.maxDepthExceeded = maxDepthExceeded;
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

  public Integer getNextDepth() {
    return nextDepth;
  }

  public void setNextDepth(final Integer nextDepth) {
    this.nextDepth = nextDepth;
  }
}
