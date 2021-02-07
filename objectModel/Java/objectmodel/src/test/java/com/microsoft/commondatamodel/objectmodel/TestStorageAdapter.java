// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel;

import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class TestStorageAdapter extends StorageAdapterBase {
  private Map<String, String> target;
  private String locationHint;

  public TestStorageAdapter(Map<String, String> target) {
    this.target = target;
  }

  @Override
  public boolean canWrite() {
    return true;
  }

  @Override
  public CompletableFuture<Void> writeAsync(String corpusPath, String data) {
    return CompletableFuture.runAsync(() -> {
      String path = this.createAdapterPath(corpusPath);
      this.target.put(path, data);
    });
  }

  @Override
  public String createAdapterPath(String corpusPath) throws StorageAdapterException {
    if (corpusPath.contains(":")) {
      return corpusPath.substring(corpusPath.indexOf(":") + 1);
    }
    return corpusPath;
  }

  public Map<String, String> getTarget() {
    return target;
  }
}
