// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StorageAdapterBase } from '../Storage/StorageAdapterBase';

export class TestStorageAdapter extends StorageAdapterBase {
    public readonly target: Map<string, string>;
    public locationHint: string;

    constructor(target: Map<string, string>) {
        super();
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
}
