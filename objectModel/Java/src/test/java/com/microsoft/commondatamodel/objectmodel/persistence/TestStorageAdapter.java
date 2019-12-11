package com.microsoft.commondatamodel.objectmodel.persistence;

import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class TestStorageAdapter implements StorageAdapter {
  private Map<String, String> target;
  private String locationHint;

  public TestStorageAdapter(Map<String, String> target) {
    this.target = target;
  }

  @Override
  public boolean canRead() {
    throw new UnsupportedOperationException("NOT IMPLEMENTED");
  }

  @Override
  public boolean canWrite() {
    return true;
  }

  @Override
  public CompletableFuture<String> readAsync(String corpusPath) {
    throw new UnsupportedOperationException("NOT IMPLEMENTED");
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

  @Override
  public String createCorpusPath(String adapterPath) {
    throw new UnsupportedOperationException("NOT IMPLEMENTED");
  }

  @Override
  public void clearCache() {
    throw new UnsupportedOperationException("NOT IMPLEMENTED");
  }

  @Override
  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(String adapterPath) throws StorageAdapterException {
    throw new UnsupportedOperationException("NOT IMPLEMENTED");
  }

  @Override
  public CompletableFuture<List<String>> fetchAllFilesAsync(String folderCorpusPath) {
    throw new UnsupportedOperationException("NOT IMPLEMENTED");
  }

  public Map<String, String> getTarget() {
    return target;
  }

  @Override
  public void setLocationHint(String locationHint) {
    this.locationHint = locationHint;
  }

  @Override
  public String getLocationHint() {
    return locationHint;
  }

  @Override
  public String fetchConfig() {
    return "";
  }

  @Override
  public void updateConfig(String config) {
    // Intentionally blank.
  }
}
