// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.HashSet;  

/**
  * The CDM base class for an adapter object that can read and write documents from a data source.
  * This allows a user flexibility to interact with data from multiple sources without having 
  * to manually copy data to the location where the Object Model is running. By deriving from this 
  * this class, users can to create their own adapter if needed.
 */
public abstract class StorageAdapterBase {

  /**
   * The CDM corpus context, gives information for the logger.
   */
  private CdmCorpusContext ctx;

  private String locationHint = "";

  /**
   * Gets the CDM corpus context.
   */
  protected CdmCorpusContext getCtx() {
    return ctx;
  }

  /**
   * Sets the CDM corpus context.
   */
  protected void setCtx(final CdmCorpusContext ctx) {
     this.ctx = ctx;
  }

  /**
   * The location hint, gives a hint to the reader app about the location where the adapter
   * implementation (Nuget, NPM...) can be obtained.
   */
  public String getLocationHint() {
    return locationHint;
  }

  /**
   * The location hint, gives a hint to the reader app about the location where the adapter
   * implementation (Nuget, NPM...) can be obtained.
   * 
   */
  public void setLocationHint(final String locationHint) {
    this.locationHint = locationHint;
  }

  /**
   * Returns true if the adapter can read data, false otherwise.
   *
   * @return True if source is readable, false otherwise.
   */
  public boolean canRead() {
    return false;
  }

  /**
   * Returns true if the adapter can write data to its source, false otherwise.
   *
   * @return True if source is writeable, false otherwise.
   */
  public boolean canWrite() {
    return false;
  }

  /**
   * Returns String data that exists at the path.
   *
   * @param corpusPath CdmCorpusDefinition path
   * @return String data read from the given corpus path.
   */
  public CompletableFuture<String> readAsync(String corpusPath) {
    throw new UnsupportedOperationException("This adapter does not support the readAsync method.");
  }

  /**
   * Writes the object data to the specified document path.
   * 
   * @param corpusPath CdmCorpusDefinition path
   * @param data       The data to write
   */
  public CompletableFuture<Void> writeAsync(String corpusPath, String data) {
    throw new UnsupportedOperationException("This adapter does not support the writeAsync method.");
  }

  /**
   * Converts a corpus path into a path in the domain of this adapter.
   *
   * @param corpusPath CdmCorpusDefinition path
   */
  public String createAdapterPath(String corpusPath) throws StorageAdapterException {
    return corpusPath;
  }

  /**
   * Converts a path in the domain of this adapter into a corpus path.
   *
   * @param adapterPath Adapter path to convert
   * @return the adapter path converted to corpus path
   */
  public String createCorpusPath(String adapterPath) {
    return adapterPath;
  }

  /**
   * Returns the last modified time of the specified document.
   *
   * @param corpusPath The path to the document.
   * @return the last modified time of the document
   */
  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(String corpusPath)
      throws StorageAdapterException {
    return CompletableFuture.completedFuture(OffsetDateTime.now());
  }

  /**
   * Returns a list of corpus paths to all files and folders at or under the provided corpus path to
   * a folder.
   *
   * @param folderCorpusPath Path to the folder to scan
   * @return List of corpus paths of all files and folders found
   */
  public CompletableFuture<List<String>> fetchAllFilesAsync(String folderCorpusPath) {
    return CompletableFuture.completedFuture(null);
  }

  /**
   * Constructs the config.
   * 
   * @return The JsonNode, representing the constructed config for that adapter.
   */
  public String fetchConfig() {
    return "{}";
  }

  /**
   * Applies the JSON config, has to be called after default constructor.
   */
  public void updateConfig(String config) throws IOException {
  }

  /**
   * Empties the cache of files and folders if the storage adapter uses a cache.
   */
  public void clearCache() {
  }

  /**
   * If true, inherited classes should cache and reuse file query results if they support caching
   * @return boolean 
   */
  protected boolean getIsCacheEnabled() 
  { 
    return !this.activeCacheContexts.isEmpty();
  }

  /**
   * Calling this function tells the adapter it may cache and reuse file query results, as opposed to
   * reissuing queries to the underlying file storage, which may be a costly operation. This adapter is 
   * allowed to cache and reuse queries until the object returned by this function has its dispose 
   * function called. If createFileQueryCacheContext is called multiple times, caching is allowed until 
   * all objects returned have thier dispose function called. Intended usage is for callers to wrap a 
   * set of operations that should use caching with a try-finally block and call dispose inside finally.
   * @return CacheContext
   */
  public CacheContext createFileQueryCacheContext()
  {
      return new CacheContext(this);
  }

  private HashSet<CacheContext> activeCacheContexts = new HashSet<CacheContext>();

  /**
   * This class is used to track requests to enable file query caching. Each time a request to enable 
   * caching is made an instance of this class is created and added the the StorageAdapter's activeCacheContexts
   * set. When dispose is called, this object is removed from that set. Whenever any items are in the adapter's 
   * activeCacheContexts, caching is enabled.
   */
  public class CacheContext 
  {
      private StorageAdapterBase adapter;

      protected CacheContext(StorageAdapterBase adapter)
      {
          this.adapter = adapter;
          this.adapter.activeCacheContexts.add(this);
      }

      public void dispose()
      {
          this.adapter.activeCacheContexts.remove(this);
          if (!this.adapter.getIsCacheEnabled())
          {
              this.adapter.clearCache();
          }
      }
  }
}
