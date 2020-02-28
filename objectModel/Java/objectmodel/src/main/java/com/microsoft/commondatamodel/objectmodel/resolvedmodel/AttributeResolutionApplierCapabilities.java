// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class AttributeResolutionApplierCapabilities {

  public boolean canAlterDirectives;
  public boolean canCreateContext;
  public boolean canRemove;
  public boolean canAttributeModify;
  public boolean canGroupAdd;
  public boolean canRoundAdd;
  public boolean canAttributeAdd;

  public AttributeResolutionApplierCapabilities() {
  }

  public AttributeResolutionApplierCapabilities(final AttributeResolutionApplierCapabilities caps) {
    canAlterDirectives = caps.canAlterDirectives;
    canCreateContext = caps.canCreateContext;
    canRemove = caps.canRemove;
    canAttributeModify = caps.canAttributeModify;
    canGroupAdd = caps.canGroupAdd;
    canRoundAdd = caps.canRoundAdd;
    canAttributeAdd = caps.canAttributeAdd;
  }
}
