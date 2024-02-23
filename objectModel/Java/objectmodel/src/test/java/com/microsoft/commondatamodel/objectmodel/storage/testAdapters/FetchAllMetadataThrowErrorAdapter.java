// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage.testAdapters;

import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CdmFileMetadata;

import java.util.HashMap;
import java.util.concurrent.CompletableFuture;

public class FetchAllMetadataThrowErrorAdapter extends NoOverrideAdapter {
  public FetchAllMetadataThrowErrorAdapter(final LocalAdapter localAdapter) {
    super(localAdapter);
  }

  @Override
  public CompletableFuture<HashMap<String, CdmFileMetadata>> fetchAllFilesMetadataAsync(final String folderCorpusPath) {
    throw new RuntimeException("Some test error message.");
  }
}
