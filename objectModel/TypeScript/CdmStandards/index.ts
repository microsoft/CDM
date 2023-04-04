// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

let readFile;
const root: string = `${__dirname}/schemaDocuments`;

if (fs.readFile) {
    readFile = util.promisify(fs.readFile);
}

const createAdapterPath = (corpusPath: string): string => {
    return path.resolve(`${root}${corpusPath}`);
};

const createCorpusPath = (adapterPath: string): string => {
    const formattedAdapterPath: string = path.resolve(adapterPath)
        .replace(/\\/g, '/');
    const formattedRoot: string = root.replace(/\\/g, '/');

    if (formattedAdapterPath.startsWith(formattedRoot)) {
        return formattedAdapterPath.slice(formattedRoot.length);
    }
};

const readAsync = async (filePath: string): Promise<string> => {
    const adapterPath: string = createAdapterPath(filePath);
    return readFile(adapterPath, 'utf-8') as string;
};

export { createCorpusPath, createAdapterPath, readAsync };
