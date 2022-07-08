// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class StorageAdapterException extends Error {
    constructor(errorMsg : string) {
        super (errorMsg);
        Object.setPrototypeOf(this, StorageAdapterException.prototype)
    }
}
