// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

import com.microsoft.commondatamodel.cdmstandards.CdmStandards;

/**
 * An adapter pre-configured to read the standard schema files published by CDM.
 */
public class CdmStandardsAdapter extends StorageAdapterBase {

  static final String TYPE = "cdm-standards";

  /**
   * Constructs a CdmStandardsAdapter with default parameters.
   */
  public CdmStandardsAdapter() throws ClassNotFoundException {
    try {
      Class.forName("com.microsoft.commondatamodel.cdmstandards.CdmStandards");
    } catch (ClassNotFoundException e) {
      throw new Error("Couldn't find package 'com.microsoft.commondatamodel.cdmStandards', please install the package, and add it as dependency of the project.");
    }
  }

  @Override
  public boolean canRead() {
    return true;
  }

  @Override
  public CompletableFuture<String> readAsync(final String corpusPath) throws StorageAdapterException {
    return CompletableFuture.supplyAsync(() -> {
      final String adapterPath = this.createAdapterPath(corpusPath);
      try {
        return CdmStandards.readAsync(adapterPath);
      } catch (IOException e) {
        throw new StorageAdapterException(e.getMessage());
      }
    });
  }

  @Override
  public String createAdapterPath(final String corpusPath) {
    return corpusPath;
  }

  @Override
  public String createCorpusPath(final String adapterPath) {
    return adapterPath;
  }
}
