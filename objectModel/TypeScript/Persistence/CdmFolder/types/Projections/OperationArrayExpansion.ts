// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { OperationBase } from './OperationBase';

/**
 * OperationArrayExpansion class
 */
export abstract class OperationArrayExpansion extends OperationBase {
    public startOrdinal?: number;
    public endOrdinal?: number;
}
