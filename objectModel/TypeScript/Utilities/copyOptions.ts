// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class copyOptions {
    public stringRefs?: boolean; // turn simple named string object references into objects with a relative path. used for links in viz
    public removeSingleRowLocalizedTableTraits?: boolean;
    /**
     * @internal
     */
    public isTopLevelDocument?: boolean;

    constructor() {
        this.isTopLevelDocument = true;
        this.stringRefs = false;
    }
}
