// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface FileStatus {
    /**
     * Last time the modified times were updated
     */
    lastFileStatusCheckTime: string;

    /**
     * Last time this file was modified
     */
    lastFileModifiedTime: string;

    /**
     * Last time the most recently modified child object was modified
     */
    lastChildFileModifiedTime?: string;
}
