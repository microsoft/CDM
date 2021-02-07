// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * OperationBase class
 */
export abstract class OperationBase {
    public $type: string;
    public explanation?: string;
    public condition?: string;
    public sourceInput?: boolean;
}
