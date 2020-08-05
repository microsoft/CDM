// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { PredefinedType } from './PredefinedType';

/**
 * A node in the expression tree
 * @internal
 */
export class Node {
    /**
     * Value for the node
     * This can hold string tokens from an expression when building the tree, but it can also hold a boolean value when evaluating the tree
     * @internal
     */
    public value: any;

    /**
     * Type of the value
     * @internal
     */
    public valueType: PredefinedType;

    /**
     * Left node
     * @internal
     */
    public left: Node;

    /**
     * Right node
     * @internal
     */
    public right: Node;
}
