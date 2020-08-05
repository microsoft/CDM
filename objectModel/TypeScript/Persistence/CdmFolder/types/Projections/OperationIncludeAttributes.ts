// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { OperationBase } from './OperationBase';

/**
 * OperationIncludeAttributes class
 */
export abstract class OperationIncludeAttributes extends OperationBase {
    public includeAttributes: string[];
}
