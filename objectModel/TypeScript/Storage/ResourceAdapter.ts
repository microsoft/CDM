// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { StorageAdapterBase } from './StorageAdapterBase';

let readFile;

if (fs.readFile) {
    readFile = util.promisify(fs.readFile);
}

export class ResourceAdapter extends StorageAdapterBase {
    private readonly ROOT: string = 'Microsoft.CommonDataModel.ObjectModel.Resources';
    private resourcesPath: string;

    public locationHint: string;

    constructor() {
        super();
        this.resourcesPath = path.join(__dirname, '..', 'Resources');
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        const adapterPath: string = this.resourcesPath + corpusPath;
        const content: string = await readFile(adapterPath, 'utf-8') as string;
        if (content === undefined || content === '') {
            throw new Error(`The requested document '${adapterPath}' is empty`);
        }

        return content;
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
}
