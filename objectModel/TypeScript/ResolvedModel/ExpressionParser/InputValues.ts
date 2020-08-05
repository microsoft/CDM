// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * A structure to carry all the input values during evaluation/resolution of an expression tree
 * @internal
 */
export class InputValues {
    public nextDepth?: number;
    public maxDepth?: number;
    public noMaxDepth?: boolean;
    public isArray?: boolean;

    public minCardinality?: number;
    public maxCardinality?: number;

    public referenceOnly: boolean;
    public normalized: boolean;
    public structured: boolean;
}
