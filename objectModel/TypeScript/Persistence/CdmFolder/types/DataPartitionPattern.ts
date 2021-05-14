// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { FileStatus, TraitGroupReference, TraitReference } from '.';

/**
 * The representation of data partition pattern in the CDM Folders format.
 */
export abstract class DataPartitionPattern implements FileStatus {
    /**
     * The name for the pattern.
     */
    public name: string;

    /**
     * The explanation for the pattern.
     */
    public explanation?: string;

    /**
     * The starting location corpus path for searching for inferred data partitions.
     */
    public rootLocation: string;

    /**
     * The glob pattern to use for searching partitions.
     */
    public globPattern?: string;
    /**
     * The regular expression to use for searching partitions.
     */
    public regularExpression?: string;

    /**
     * The names for replacement values from regular expression.
     */
    public parameters?: string[];

    /**
     * The corpus path for specialized schema to use for matched pattern partitions.
     */
    public specializedSchema?: string;

    /**
     * The exhibited traits.
     */
    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];

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
