// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser;

/**
 * A node in the expression tree
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class Node {
    private Object value;
    private PredefinedType valueType;
    private Node left;
    private Node right;

    /**
     * Value for the node
     * This can hold string tokens from an expression when building the tree, but it can also hold a boolean value when evaluating the tree
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public Object getValue() {
        return value;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setValue(final Object value) {
        this.value = value;
    }

    /**
     * Type of the value
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public PredefinedType getValueType() {
        return valueType;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setValueType(final PredefinedType valueType) {
        this.valueType = valueType;
    }

    /**
     * Left node
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public Node getLeft() {
        return left;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setLeft(final Node left) {
        this.left = left;
    }

    /**
     * Right node
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public Node getRight() {
        return right;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setRight(final Node right) {
        this.right = right;
    }
}
