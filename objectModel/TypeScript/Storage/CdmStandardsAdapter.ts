// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StorageAdapterBase } from './StorageAdapterBase';

var cdmstandards;

/**
 * An adapter pre-configured to read the standard schema files published by CDM.
 */
export class CdmStandardsAdapter extends StorageAdapterBase {
    constructor() {
        super();
        try {
            cdmstandards = require('cdm.objectmodel.cdmstandards');
        } catch (e) {
            throw new Error('Couldn\'t find package \'cdm.objectmodel.cdmstandards\', please install the package, and add it as dependency of the project.');
        }
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        return cdmstandards.readAsync(corpusPath);
    }

    public createAdapterPath(corpusPath: string): string {
        return cdmstandards.createAdapterPath(corpusPath);
    }

    public createCorpusPath(adapterPath: string): string {
        return cdmstandards.createCorpusPath(adapterPath);
    }
}
