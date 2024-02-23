// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class CdmReadPartitionFromPatternException extends Error {
    public readonly innerException: Error;

    constructor(errorMsg? : string, innerException?: Error) {
        super (errorMsg);
        this.innerException = innerException;
        Object.setPrototypeOf(this, CdmReadPartitionFromPatternException.prototype)
    }
}