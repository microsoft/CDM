// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Import } from '../../CdmFolder/types';
import { Attribute } from './Attribute';
import { Entity, entityBaseProperties } from './Entity';
import { Partition } from './Partition';

/**
 * Represents an entity that belongs to the current model.
 */
export abstract class LocalEntity extends Entity {
    public attributes: Attribute[];
    public partitions: Partition[];
    public schemas: string[];
    public 'cdm:imports'?: Import[];
}

export const localEntityBaseProperties: string[] = [
    ...entityBaseProperties,
    'attributes',
    'partitions',
    'schemas',
    'cdm:imports'
];
