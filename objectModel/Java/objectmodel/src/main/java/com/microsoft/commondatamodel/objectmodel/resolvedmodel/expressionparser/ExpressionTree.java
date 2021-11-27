// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser;

import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.Stack;

/**
 * Class to generate an expression tree so that expression can be evaluated or parsed at a later date
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ExpressionTree {
    /**
     * @deprecated This field is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static Map<String, PredefinedTokenEnum> textToTokenHash = PredefinedTokens.initializeTextToTokenHash();

    /**
     * Create a new node of the expression tree
     */
    private static Node createNewNode(Object value, PredefinedType type) {
        Node newNode = new Node();

        newNode.setValue(value);
        newNode.setValueType(type);

        newNode.setLeft(null);
        newNode.setRight(null);

        return newNode;
    }

    /**
     * Given an expression string, create an expression tree
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param expression String 
     * @return Node
     */
    @Deprecated
    public static Node constructExpressionTree(String expression) {
        if (StringUtils.isNullOrTrimEmpty(expression)) {
            // caller to log info "Optional expression missing. Implicit expression will automatically apply." if returned null
            return null;
        }

        Stack<Node> opStack = new Stack<Node>();
        Stack<Node> valueStack = new Stack<Node>();

        // split into tokens
        List<List<Object>> tokenList = Tokenizer.getExpressionAsTokenList(expression);

        for (List<Object> token : tokenList) {
            Node newNode = createNewNode(token.get(0), (PredefinedType) token.get(1));

            switch ((PredefinedType) token.get(1)) {
                case OpenParenthesis:
                    opStack.push(newNode);
                    break;
                case CloseParenthesis:
                    while (opStack.size() > 0 && opStack.peek().getValueType() != PredefinedType.OpenParenthesis) {
                        Node topOpNode = opStack.pop();

                        Node valNodeRight = null, valNodeLeft = null;
                        if (valueStack.size() > 0) {
                            valNodeRight = valueStack.pop();
                        }
                        if (valueStack.size() > 0) {
                            valNodeLeft = (topOpNode.getValueType() != PredefinedType.NotOperator) ? valueStack.pop() : null;
                        }

                        topOpNode.setRight(valNodeRight);
                        topOpNode.setLeft(valNodeLeft);

                        valueStack.push(topOpNode);
                    }

                    // finally found open parenthesis
                    if (opStack.size() > 0 && valueStack.size() > 0) {
                        // traverse left most node and add "("
                        Node currNode = valueStack.peek();
                        while (currNode != null && currNode.getLeft() != null) {
                            currNode = currNode.getLeft();
                        }
                        if (currNode != null) {
                            currNode.setLeft(opStack.pop());
                        }

                        // traverse right most node and add ")"
                        currNode = valueStack.peek();
                        while (currNode != null && currNode.getRight() != null) {
                            currNode = currNode.getRight();
                        }
                        if (currNode != null) {
                            currNode.setRight(newNode);
                        }
                    }
                    break;
                case NotOperator:
                case Operator:
                    while (opStack.size() > 0 && operatorPriority((String) opStack.peek().getValue()) < operatorPriority((String) token.get(0))) {
                        Node topOpNode = opStack.pop();

                        Node valNodeRight = null, valNodeLeft = null;
                        if (valueStack.size() > 0) {
                            valNodeRight = valueStack.pop();
                        }
                        if (valueStack.size() > 0) {
                            valNodeLeft = (topOpNode.getValueType() != PredefinedType.NotOperator) ? valueStack.pop() : null;
                        }

                        topOpNode.setRight(valNodeRight);
                        topOpNode.setLeft(valNodeLeft);

                        valueStack.push(topOpNode);
                    }
                    opStack.push(newNode);
                    break;
                case Constant:
                case Token:
                case Custom:
                default:
                    valueStack.push(newNode);
                break;
            }
        }

        while (opStack.size() > 0) {
            Node topOpNode = opStack.pop();

            Node valNodeRight = null, valNodeLeft = null;
            if (valueStack.size() > 0) {
                valNodeRight = valueStack.pop();
            }
            if (valueStack.size() > 0) {
                valNodeLeft = (topOpNode.getValueType() != PredefinedType.NotOperator) ? valueStack.pop() : null;
            }

            topOpNode.setRight(valNodeRight);
            topOpNode.setLeft(valNodeLeft);

            valueStack.push(topOpNode);
        }

        return valueStack.pop();
    }

    /**
     * Order of operators
     * Higher the priority - higher the precedence
     */
    private static int operatorPriority(String op) {
        if (!textToTokenHash.containsKey(op)) {
            return 0;
        } else {
            switch (textToTokenHash.get(op)) {
                case OPENPAREN:
                case CLOSEPAREN:
                    return 4;
                case NOT:
                    return 3;
                case AND:
                case OR:
                    return 2;
                case GT:
                case LT:
                case EQ:
                case NE:
                case GE:
                case LE:
                    return 1;
                default:
                    return 0;
            }
        }
    }

    /**
     * Given an expression tree, evaluate the expression
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param condition String
     * @param inputValues InputValues
     * @return boolean
     */
    @Deprecated
    public static boolean evaluateCondition(String condition, InputValues inputValues) {
        if (StringUtils.isNullOrTrimEmpty(condition)) {
            return true;
        }

        Node treeRoot = constructExpressionTree(condition);
        return (boolean) evaluateExpressionTree(treeRoot, inputValues);
    }

    /**
     * Given an expression tree, evaluate the expression
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param top Node
     * @param inputValues InputValues
     * @return Object
     */
    @Deprecated
    public static Object evaluateExpressionTree(Node top, InputValues inputValues) {
        if (top == null) {
            return false;
        }

        Object leftReturn = false, rightReturn = false;

        if (top.getLeft() != null) {
            leftReturn = evaluateExpressionTree(top.getLeft(), inputValues);
        }

        if (top.getRight() != null) {
            rightReturn = evaluateExpressionTree(top.getRight(), inputValues);
        }

        if (top.getValueType() == PredefinedType.Custom) {
            // check if number and return number
            try {
                int num = Integer.parseInt((String) top.getValue());
                return num;
            } catch (NumberFormatException e) {
            }

            // check if bool and return bool
            if (((String) top.getValue()).trim().equalsIgnoreCase("true") || ((String) top.getValue()).trim().equalsIgnoreCase("false")) {
                return Boolean.parseBoolean(((String) top.getValue()).trim());
            }
        }

        if (!textToTokenHash.containsKey(top.getValue())) {
            return top.getValue();
        } else {
            switch (textToTokenHash.get(top.getValue())) {
                case AND:
                    return (leftReturn == null || rightReturn == null) ? false : (boolean) leftReturn && (boolean) rightReturn;
                case NOT:
                    return (rightReturn == null) ? false : !((boolean) rightReturn);
                case OR:
                    return (leftReturn == null || rightReturn == null) ? false : (boolean) leftReturn || (boolean) rightReturn;

                case GT:
                    return (leftReturn == null || rightReturn == null) ? false : (int) leftReturn > (int) rightReturn;
                case LT:
                    return (leftReturn == null || rightReturn == null) ? false : (int) leftReturn < (int) rightReturn;
                case GE:
                    return (leftReturn == null || rightReturn == null) ? false : (int) leftReturn >= (int) rightReturn;
                case LE:
                    return (leftReturn == null || rightReturn == null) ? false : (int) leftReturn <= (int) rightReturn;
                case EQ:
                    return convertToTypeAndCheckEquality(leftReturn, rightReturn);
                case NE:
                    return convertToTypeAndCheckInequality(leftReturn, rightReturn);

                case TRUE:
                    return true;
                case FALSE:
                    return false;

                case OPENPAREN:
                case CLOSEPAREN:
                    return true;

                case DEPTH:
                    return inputValues.getNextDepth();
                case MAXDEPTH:
                    return inputValues.getMaxDepth();

                case ISARRAY:
                    return inputValues.getIsArray();
                case NOMAXDEPTH:
                    return inputValues.getNoMaxDepth();

                case MINCARDINALITY:
                    return inputValues.getMinCardinality();
                case MAXCARDINALITY:
                    return inputValues.getMaxCardinality();

                case NORMALIZED:
                    return inputValues.getNormalized();
                case REFERENCEONLY:
                    return inputValues.getReferenceOnly();
                case STRUCTURED:
                    return inputValues.getStructured();
                case VIRTUAL:
                    return inputValues.getIsVirtual();

                case ALWAYS:
                    return true;

                default:
                    return top.getValue();
            }
        }
    }

    /**
     * For unit test only
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param top Node 
     */
    @Deprecated
    public static void inOrderTraversal(Node top) {
        if (top != null) {
            if (top.getLeft() != null) {
                inOrderTraversal(top.getLeft());
            }

            System.out.println(" " + top.getValue() + " ");

            if (top.getRight() != null) {
                inOrderTraversal(top.getRight());
            }
        }
    }

    /**
     * Converts left and right to the correct types and checks for equality.
     * left and right can be an int, string, or a boolean.
     * @param left Object 
     * @param right Object
     * @return boolean 
     */
    private static boolean convertToTypeAndCheckEquality(Object left, Object right) {
        if (left == null || right == null) {
            return false;
        }

        if (left instanceof Integer && right instanceof Integer) {
            return (int) left == (int) right;
        }

        if (left instanceof Boolean && right instanceof Boolean) {
            return (boolean) left == (boolean) right;
        }

        if (left instanceof String && right instanceof String) {
            return ((String) left).equals((String) right);
        }

        return false;
    }

    /**
     * Converts left and right to the correct types and checks for inequality.
     * left and right can be an int, string, or a boolean.
     * @param left Object 
     * @param right Object
     * @return boolean 
     */
    private static boolean convertToTypeAndCheckInequality(Object left, Object right) {
        if (left == null || right == null) {
            return false;
        }

        if (left instanceof Integer && right instanceof Integer) {
            return (int) left != (int) right;
        }

        if (left instanceof Boolean && right instanceof Boolean) {
            return (boolean) left != (boolean) right;
        }

        if (left instanceof String && right instanceof String) {
            return !((String) left).equals((String) right);
        }

        return false;
    }
}
