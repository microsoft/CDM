// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { FileStatus } from '.';

/**
 * The folder declaration for CDM folders format.
 */
export abstract class ManifestDeclaration implements FileStatus {
    /**
     * The explanation.
     */
    public explanation?: string;

    /**
     * The manifest name.
     */
    public manifestName: string;

    /**
     * The corpus path to the definition of the sub folder.
     */
    public definition: string;

    /**
     * Last time the modified times were updated
     */
    public lastFileStatusCheckTime: string;

    /**
     * Last time this file was modified
     */
    public lastFileModifiedTime: string;

    /**
     * Last time the most recently modified child object was modified
     */
    public lastChildFileModifiedTime?: string;
}
