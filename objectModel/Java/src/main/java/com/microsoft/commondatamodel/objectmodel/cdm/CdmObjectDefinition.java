// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public interface CdmObjectDefinition extends CdmObject {

  /**
   * Gets or sets the object explanation.
   */
  String getExplanation();

  void setExplanation(String value);

  /**
   * Gets the object exhibits traits.
   */
  CdmTraitCollection getExhibitsTraits();

  /**
   * all objectDefs have some kind of name,
   * this method returns the name independent of the name of the name property.
   */
  String getName();

  /**
   * Returns true if the object (or the referenced object) is an extension
   * from the specified symbol name in some way.
   */
  boolean isDerivedFrom(String baseDef, ResolveOptions resOpt);
}
