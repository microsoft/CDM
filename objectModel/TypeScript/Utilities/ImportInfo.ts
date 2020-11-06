// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class ImportInfo {
    /**
     * The priority that the import has with respect to the document where it is imported.
     */
    public priority: number;

    /**
     * If the import has a moniker or not.
     */
    public isMoniker: boolean;

    /**
     * Constructor of the ImportInfo class.
     */
    constructor(priority: number, isMoniker: boolean) {
        this.priority = priority;
        this.isMoniker = isMoniker;
    }
}
