// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage.testAdapters;

import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;

import java.util.concurrent.CompletableFuture;

public class NoOverrideAdapter extends StorageAdapterBase {

  final LocalAdapter localAdapter;

  public NoOverrideAdapter(final LocalAdapter baseAdapter) {
    this.localAdapter = baseAdapter;
  }

  @Override
  public boolean canRead() { return true; }

  @Override
  public CompletableFuture<String> readAsync(final String corpusPath) {
    return this.localAdapter.readAsync(corpusPath);
  }
}
