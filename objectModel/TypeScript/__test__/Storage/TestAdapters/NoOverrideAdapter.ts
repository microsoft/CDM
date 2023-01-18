// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StorageAdapterBase } from "../../../internal";
import { LocalAdapter } from "../../../Storage";

export class NoOverrideAdapter extends StorageAdapterBase {
    public localAdapter: LocalAdapter;

    constructor(baseAdapter: LocalAdapter) {
        super();
        this.localAdapter = baseAdapter;
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        return this.localAdapter.readAsync(corpusPath);
    }
}
