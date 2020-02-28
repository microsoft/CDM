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
    public root: string;

    public locationHint: string;

    constructor() {
        this.root = path.join(__dirname, '../Resources');
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        try {
            const adapterPath: string = this.createAdapterPath(corpusPath);
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
        if (corpusPath === undefined || corpusPath === '') {
            return undefined;
        }

        return path.join(this.root, corpusPath);
    }

    public createCorpusPath(adapterPath: string): string {
        if (adapterPath === undefined || adapterPath === '' || adapterPath.startsWith('http')) {
            return undefined;
        }

        // Make this a file system path and normalize it.
        const formattedAdapterPath: string = path.resolve(adapterPath)
            .replace(/\\/g, '/');
        const formattedRoot: string = this.root.replace(/\\/g, '/');

        // Might not be an adapterPath that we understand, check that first.
        if (formattedAdapterPath.startsWith(formattedRoot)) {
            return formattedAdapterPath.slice(formattedRoot.length);
        }

        return undefined;
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
