// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { configObjectType, StorageAdapter } from './StorageAdapter';

/**
  * The CDM base class for an adapter object that can read and write documents from a data source.
  * This allows a user flexibility to interact with data from multiple sources without having 
  * to manually copy data to the location where the Object Model is running. By deriving from this 
  * this class, users can to create their own adapter if needed.
 */
export abstract class StorageAdapterBase implements StorageAdapter {
    /**
     * The location hint, gives a hint to the reader app about the
     * location where the adapter implementation (Nuget, NPM...) can be obtained.
     */
    public locationHint: string;

    /**
     * Returns true if the adapter can read data, false otherwise.
     */
    public canRead(): boolean {
        return false;
    }

    /**
     * Returns true if the adapter can write data, false otherwise.
     */
    public canWrite(): boolean {
        return false;
    }

    /**
     * Returns JSON data that exists at the path as a JSON string
     */
    public async readAsync(corpusPath: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    /**
     * writes the object data to the specified document path
     */
    public async writeAsync(corpusPath: string, data: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    /**
     * converts a corpus path into a path in the domain of this adapter
     */
    public createAdapterPath(corpusPath: string): string {
        return corpusPath;
    }

    /**
     * converts a path in the domain of this adapter into a corpus path
     */
    public createCorpusPath(adapterPath: string): string {
        return adapterPath;
    }

    /**
     * Returns the last modified time of the file accessible by the adapter
     */
    public async computeLastModifiedTimeAsync(corpusPath: string): Promise<Date> {
        return new Date();
    }

    /**
     * Returns a list corpus paths to all files and folders at or under the
     * provided corpus path to a folder
     */
    public async fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {
        return undefined;
    }

    /**
     * Applies the JSON config, has to be called after default constructor.
     */
    public updateConfig(config: string): void {
    }

    /**
     * Constructs the config.
     * Reeturns the object, representing the constructed config for that adapter.
     */
    public fetchConfig(): string {
        return "{}";
    }

    /**
     * Empties the cache of files and folders if the storage adapter uses a cache
     */
    public clearCache(): void {
    }

    /**
     * If true, inherited classes should cache and reuse file query results if they support caching
     */
    protected isCacheEnabled(): boolean {
        return this.activeCacheContexts.size > 0
    }

    /**
     * Calling this function tells the adapter it may cache and reuse file query results, as opposed to
     * reissuing queries to the underlying file storage, which may be a costly operation. This adapter is 
     * allowed to cache and reuse queries until the object returned by this function has its dispose 
     * function called. If createFileQueryCacheContext is called multiple times, caching is allowed until 
     * all objects returned have thier dispose function called. Intended usage is for callers to wrap a 
     * set of operations that should use caching with a try-finally block and call dispose inside finally.
     */
    public createFileQueryCacheContext(): StorageAdapterCacheContext {
        let context: StorageAdapterCacheContext = new StorageAdapterCacheContext(this.createDisposeAdapterContextFunc(this));
        this.activeCacheContexts.add(context);
        return context;
    }

    private activeCacheContexts: Set<StorageAdapterCacheContext> = new Set<StorageAdapterCacheContext>();

    /**
     * This function exists so that the StorageAdapterCacheContext's dispose function can remove itself
     * from the StorageAdapter's activeCacheContexts without needing to make activeCacheContexts public
     * @param adapter the adapter this function is created for
     */
    private createDisposeAdapterContextFunc(adapter: StorageAdapterBase): { (context: StorageAdapterCacheContext): void } {
        let func: { (context: StorageAdapterCacheContext): void } =
            (context: StorageAdapterCacheContext): void => {
                this.activeCacheContexts.delete(context);
                if (!this.isCacheEnabled()) {
                    this.clearCache();
                }
            }
        return func;
    }
}

/**
 * This class is used to track requests to enable file query caching. Each time a request to enable 
 * caching is made an instance of this class is created and added the the StorageAdapter's activeCacheContexts
 * set. When dispose is called, this object is removed from that set. Whenever any items are in the adapter's 
 * activeCacheContexts, caching is enabled.
 */
export class StorageAdapterCacheContext {
    private disposeFunc: { (StorageAdapterCacheContext): void };

    constructor(dispose: { (StorageAdapterCacheContext): void }) {
        this.disposeFunc = dispose;
    }

    public dispose(): void {
        this.disposeFunc(this);
    }
}
