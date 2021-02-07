// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TypeAttribute } from '../TypeAttribute';
import { OperationBase } from './OperationBase';

/**
 * OperationReplaceAsForeignKey class
 */
export abstract class OperationReplaceAsForeignKey extends OperationBase {
    public reference: string;
    public replaceWith: TypeAttribute;
}
