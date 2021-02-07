// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TypeAttribute } from '../TypeAttribute';
import { OperationBase } from './OperationBase';

/**
 * OperationCombineAttributes class
 */
export abstract class OperationCombineAttributes extends OperationBase {
    public select: string[];
    public mergeInto: TypeAttribute;
}
