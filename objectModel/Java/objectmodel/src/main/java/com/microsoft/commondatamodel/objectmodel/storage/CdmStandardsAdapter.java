// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

/**
 * An adapter pre-configured to read the standard schema files published by CDM.
 */
public class CdmStandardsAdapter extends CdmCustomPackageAdapter {

  static final String TYPE = "cdm-standards";

  /**
   * Constructs a CdmStandardsAdapter with default parameters.
   */
  public CdmStandardsAdapter() throws ClassNotFoundException {
    super("com.microsoft.commondatamodel.cdmstandards.CdmStandards");
  }
}
