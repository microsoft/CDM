// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { DataPartition, DataPartitionPattern, TraitGroupReference, TraitReference } from '.';

/**
 * The local entity declaration for CDM folders format.
 */
export class EntityDeclarationDefinition {
    /**
     * The entity declaration type, can be local or referenced.
     */
    public type: string;

    public entityName: string;

    public explanation?: string;

    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];

    public entitySchema?: string;

    public entityPath?: string;

    public entityDeclaration?: string;

    public dataPartitions?: DataPartition[];

    public dataPartitionPatterns?: DataPartitionPattern[];

    public lastFileStatusCheckTime: string;

    public lastFileModifiedTime: string;

    public lastChildFileModifiedTime?: string;
}

export const entityDeclarationDefinitionType: { readonly localEntity: string; readonly referencedEntity: string } = {
    localEntity: 'LocalEntity',
    referencedEntity: 'ReferencedEntity'
};
