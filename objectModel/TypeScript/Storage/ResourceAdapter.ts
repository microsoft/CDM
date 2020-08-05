// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { StorageAdapter } from './StorageAdapter';

let readFile;

if (fs.readFile) {
    readFile = util.promisify(fs.readFile);
}

export class ResourceAdapter implements StorageAdapter {
    private readonly ROOT: string = 'Microsoft.CommonDataModel.ObjectModel.Resources';
    private resourcesPath: string;

    public locationHint: string;

    constructor() {
        this.resourcesPath = path.join(__dirname, '..', 'Resources');
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        try {
            const adapterPath: string = this.resourcesPath + corpusPath;
            const content: string = await readFile(adapterPath, 'utf-8') as string;
            if (content === undefined || content === '') {
                throw new Error(`The requested document '${adapterPath}' is empty`);
            }

            return content;
        } catch (err) {
            throw (err);
        }
    }

    public canWrite(): boolean {
        return false;
    }

    public async writeAsync(corpusPath: string, data: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public createAdapterPath(corpusPath: string): string {
        if (!corpusPath) {
            return undefined;
        }

        return this.ROOT + corpusPath;
    }

    public createCorpusPath(adapterPath: string): string {
        if (!adapterPath || !adapterPath.startsWith(this.ROOT)) {
            return undefined;
        }

        return adapterPath.substring(this.ROOT.length);
    }

    public clearCache(): void {
        return;
    }

    public async computeLastModifiedTimeAsync(corpusPath: string): Promise<Date> {
        return new Date();
    }

    public async fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {
        return undefined;
    }

    public fetchConfig(): string {
        throw new Error('Method not implemented.');
    }

    public updateConfig(config: string): void {
        throw new Error('Method not implemented.');
    }
}
