// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { OperationBase } from './OperationBase';

/**
 * OperationExcludeAttributes class
 */
export abstract class OperationExcludeAttributes extends OperationBase {
    public excludeAttributes: string[];
}
