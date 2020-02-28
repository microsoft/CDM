// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
}
