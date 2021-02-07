// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Entity, entityBaseProperties } from './Entity';

/**
 * Represents an entity that belongs to an external model.
 */
export abstract class ReferenceEntity extends Entity {
    public source: string;
    public modelId: string;
}

export const referenceEntityBaseProperties: string[] = [
    ...entityBaseProperties,
    'source',
    'modelId'
];
