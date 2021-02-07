// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { EntityReferenceDefinition } from '../EntityReferenceDefinition';
import { OperationBase } from './OperationBase';

/**
 * Projection class
 */
export abstract class Projection {
    public explanation: string;
    public condition: string;
    public operations: OperationBase[];
    public source: EntityReferenceDefinition;
    public runSequentially?: boolean;
}
