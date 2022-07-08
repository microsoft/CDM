// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class CdmNumberOfRetriesExceededException extends Error {
    constructor(errorMsg : string) {
        super (errorMsg);
        Object.setPrototypeOf(this, CdmNumberOfRetriesExceededException.prototype)
    }
}
