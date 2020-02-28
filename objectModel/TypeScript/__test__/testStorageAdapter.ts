// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StorageAdapter } from '../Storage/StorageAdapter';

export class TestStorageAdapter implements StorageAdapter {
    public readonly target: Map<string, string>;
    public locationHint: string;

    constructor(target: Map<string, string>) {
        this.target = target;
    }

    public canWrite(): boolean {
        return true;
    }

    public async writeAsync(corpusPath: string, data: string): Promise<void> {
        // ensure that the path exists before trying to write the file
        const path: string = this.createAdapterPath(corpusPath);

        this.target.set(path, data);
    }

    public createAdapterPath(corpusPath: string): string {
        if (corpusPath.indexOf(':') !== -1) {
            corpusPath = corpusPath.slice(corpusPath.indexOf(':') + 1);
        }

        return corpusPath;
    }

    public canRead(): boolean {
        return false;
    }

    public clearCache(): void {
    }

    public async fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {
        return undefined;
    }

    public async getLastModifiedTime(adapterPath: string): Promise<Date> {
        return undefined;
    }

    public createCorpusPath(adapterPath: string): string {
        return undefined;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        return undefined;
    }

    public async computeLastModifiedTimeAsync(corpusPath: string): Promise<Date> {
        return undefined;
    }

    public fetchConfig(): string {
        return '';
    }

    public updateConfig(configs: string): void {
    }
}
