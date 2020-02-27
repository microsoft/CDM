// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    DocumentContent,
    E2ERelationship,
    EntityDeclarationDefinition,
    FileStatus,
    ManifestDeclaration,
    TraitReference
} from '.';

export abstract class ManifestContent extends DocumentContent implements FileStatus {
    public manifestName?: string;
    public folioName?: string;
    public explanation?: string;
    public exhibitsTraits: TraitReference[];
    public subManifests?: ManifestDeclaration[];
    public subFolios?: ManifestDeclaration[];
    public entities?: EntityDeclarationDefinition[];
    public relationships?: E2ERelationship[];

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
