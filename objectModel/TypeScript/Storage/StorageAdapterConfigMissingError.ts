// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class StorageAdapterConfigMissingError extends Error {
    constructor(configProperty : string) {
        super (`The config property '${configProperty}' is not configured properly. Please check your storage adapter configs!`);
    }
}
