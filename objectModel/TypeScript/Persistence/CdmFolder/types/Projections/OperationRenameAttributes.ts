// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { OperationBase } from './OperationBase';

/**
 * OperationRenameAttributes class
 */
export abstract class OperationRenameAttributes extends OperationBase {
    public renameFormat: string;
    public applyTo: any;
}
