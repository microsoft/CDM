// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;


/**
 * The CDM Def interface for an adapter object that can read and write documents from a data source.
 * This was the previous method for a user to create their own storage adapter. The current method is 
 * to extend the StorageAdapterBase class.
 * @deprecated Please use the StorageAdapterBase class instead.
 */
public interface StorageAdapter {
  /**
   * The location hint, gives a hint to the reader app about the location where the adapter implementation (Nuget, NPM...) can be obtained.
   */
  void setLocationHint(String locationHint);

  /**
   * The location hint, gives a hint to the reader app about the location where the adapter implementation (Nuget, NPM...) can be obtained.
   * @return The location hint
   */
  String getLocationHint();

  /**
   * Returns true if the adapter can read data, false otherwise.
   *
   * @return True if source is readable, false otherwise.
   */
  boolean canRead();

  /**
   * Returns true if the adapter can write data to its source, false otherwise.
   *
   * @return True if source is writeable, false otherwise.
   */
  boolean canWrite();

  /**
   * Returns String data that exists at the path.
   *
   * @param corpusPath CdmCorpusDefinition path
   * @return String data read from the given corpus path.
   */
  CompletableFuture<String> readAsync(String corpusPath);

  /**
   * Writes the object data to the specified document path.
   *  @param corpusPath CdmCorpusDefinition path
   * @param data       The data to write
   */
  CompletableFuture<Void> writeAsync(String corpusPath, String data);

  /**
   * Converts a corpus path into a path in the domain of this adapter.
   *
   * @param corpusPath CdmCorpusDefinition path
   */
  String createAdapterPath(String corpusPath) throws StorageAdapterException;

  /**
   * Converts a path in the domain of this adapter into a corpus path.
   *
   * @param adapterPath Adapter path to convert
   * @return the adapter path converted to corpus path
   */
  String createCorpusPath(String adapterPath);

  /**
   * Empties the cache of files and folders if the storage adapter uses a cache.
   */
  void clearCache();

  /**
   * Returns the last modified time of the specified document.
   *
   * @param corpusPath The path to the document.
   * @return the last modified time of the document
   */
  CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(String corpusPath)
          throws StorageAdapterException;

  /**
   * Returns a list of corpus paths to all files and folders at or under the provided corpus path to
   * a folder.
   *
   * @param folderCorpusPath Path to the folder to scan
   * @return List of corpus paths of all files and folders found
   */
  CompletableFuture<List<String>> fetchAllFilesAsync(String folderCorpusPath);

  /**
   * Constructs the config.
   * @return The JsonNode, representing the constructed config for that adapter.
   */
  String fetchConfig();

  /**
   * Applies the JSON config, has to be called after default constructor.
   */
  void updateConfig(String config) throws IOException;
}
