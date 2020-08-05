// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public enum PredefinedType {
    NotOperator,
    Operator,
    Token,
    Constant,
    OpenParenthesis,
    CloseParenthesis,
    Custom
}
