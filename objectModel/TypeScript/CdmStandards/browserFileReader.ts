// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

const readFile = (path: string): string | undefined => {
    let file;
    try {
        file = require('.' + path);
        return JSON.stringify(file);
    } catch (err) {
        throw err;
    }
};

export { readFile };