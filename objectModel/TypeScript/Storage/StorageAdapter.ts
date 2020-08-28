// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * The CDM Def interface for an adapter object that can read and write documents from a data source.
 * This was the previous method for a user to create their own storage adapter. The current method is 
 * to extend the StorageAdapterBase class.
 * @deprecated Please use the StorageAdapterBase class instead.
 */
export interface StorageAdapter {
    /**
     * The location hint, gives a hint to the reader app about the
     * location where the adapter implementation (Nuget, NPM...) can be obtained.
     */
    // locationHint: string;

    canRead(): boolean;
    canWrite(): boolean;

    /**
     * Returns JSON data that exists at the path as a JSON string
     */
    readAsync(corpusPath: string): Promise<string>;

    /**
     * writes the object data to the specified document path
     */
    writeAsync?(corpusPath: string, data: string): Promise<void>;

    /**
     * converts a corpus path into a path in the domain of this adapter
     */
    createAdapterPath(corpusPath: string): string;

    /**
     * converts a path in the domain of this adapter into a corpus path
     */
    createCorpusPath(adapterPath: string): string;

    /**
     * Empties the cache of files and folders if the storage adapter uses a cache
     */
    clearCache(): void;

    /**
     * Returns the last modified time of the file accessible by the adapter
     */
    computeLastModifiedTimeAsync(corpusPath: string): Promise<Date>;

    /**
     * Returns a list corpus paths to all files and folders at or under the
     * provided corpus path to a folder
     */
    fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]>;

    /**
     * Applies the JSON config, has to be called after default constructor.
     */
    updateConfig(config: string): void;

     /**
      * Constructs the config.
      * Reeturns the object, representing the constructed config for that adapter.
      */
     fetchConfig(): string;
}

export interface configObjectType {
  type?: string;
  root?: string;
  appId?: string;
  defaultNamespace?: string;
  adapters?: any[];
  hosts?: any[];
  locationHint?: string;
  config?: configObjectType;
  tenant?: string;
  clientId?: string;
  hostname?: string;
  sharedKey?: string;
  secret?: string;
  timeout?: number;
  maximumTimeout?: number;
  numberOfRetries?: number;
}
