// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage.testAdapters;

import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class OverrideFetchAllFilesAdapter extends NoOverrideAdapter {
  public OverrideFetchAllFilesAdapter(final LocalAdapter localAdapter) {
    super(localAdapter);
  }

  @Override
  public CompletableFuture<List<String>> fetchAllFilesAsync(final String folderCorpusPath) {
    return this.localAdapter.fetchAllFilesAsync(folderCorpusPath);
  }
}
