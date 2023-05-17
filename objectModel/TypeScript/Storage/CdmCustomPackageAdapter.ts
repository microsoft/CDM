// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StringUtils } from '../Utilities/StringUtils';
import { StorageAdapterBase } from './StorageAdapterBase';

var packageObject;

/**
 * An adapter pre-configured to read schema files from a package.
 */
export class CdmCustomPackageAdapter extends StorageAdapterBase {
    constructor(packageOrPackageName: string | any) {
        super();

        if (packageOrPackageName == undefined || (typeof packageOrPackageName === 'string' && StringUtils.isNullOrWhiteSpace(packageOrPackageName))) {
            throw new Error('No package name passed in, please pass in a package name or package when constructing the CdmCustomPackageAdapter.');
        }
        
        if (typeof packageOrPackageName !== 'string') {
            packageObject = packageOrPackageName;
            return;
        }

        try {
            packageObject = require(packageOrPackageName);
        } catch (e) {
            throw new Error(`Couldn't find package '${packageOrPackageName}', please install the package, and add it as dependency of the project.`);
        }
    }

    public canRead(): boolean {
        return true;
    }

    public createAdapterPath(corpusPath: string): string {
        return packageObject.createAdapterPath(corpusPath);
    }

    public createCorpusPath(adapterPath: string): string {
        return packageObject.createCorpusPath(adapterPath);
    }

    public async readAsync(corpusPath: string): Promise<string> {
        return packageObject.readAsync(corpusPath);
    }
}
