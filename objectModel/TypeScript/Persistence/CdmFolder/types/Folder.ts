// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    Import,
    TraitGroupReference,
    TraitReference
} from '.';

/**
 * The folder for CDM folder format.
 */
export abstract class Folder {
    /**
     * The folder name.
     */
    public folderName: string;

    /**
     * The folder explanation.
     */
    public explanation?: string;

    /**
     * The exhibited traits.
     */
    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];
}
