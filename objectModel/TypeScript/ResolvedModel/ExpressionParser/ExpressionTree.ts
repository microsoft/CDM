// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { InputValues } from './InputValues';
import { PredefinedTokenEnum } from './PredefinedTokenEnum';
import { PredefinedTokens } from './PredefinedTokens';
import { Tokenizer } from './Tokenizer';
import { PredefinedType } from './PredefinedType';
import { Node } from './Node';
import { StringUtils } from '../../Utilities/StringUtils';

/**
 * Class to generate an expression tree so that expression can be evaluated or parsed at a later date
 * @internal
 */
export class ExpressionTree {
    /**
     * @internal
     */
    public static textToTokenHash: Map<string, PredefinedTokenEnum> = PredefinedTokens.initializeTextToTokenHash();

    /**
     * Create a new node of the expression tree
     */
    private static createNewNode(value: any, type: PredefinedType): Node {
        const newNode: Node = new Node();

        newNode.value = value;
        newNode.valueType = type;

        newNode.left = undefined;
        newNode.right = undefined;

        return newNode;
    }

    /**
     * Given an expression string, create an expression tree
     * @internal
     */
    public static constructExpressionTree(expression: string): Node {
        if (!expression || !expression.trim()) {
            // caller to log info "Optional expression missing. Implicit expression will automatically apply." if returned null
            return undefined;
        }

        const opStack: Node[] = [];
        const valueStack: Node[] = [];

        // split into tokens
        const tokenList: [any, PredefinedType][] = Tokenizer.getExpressionAsTokenList(expression);

        for (const token of tokenList) {
            const newNode: Node = this.createNewNode(token[0], token[1]);

            switch (token[1]) {
                case PredefinedType.openParenthesis:
                    opStack.push(newNode);
                    break;
                case PredefinedType.closeParenthesis:
                    while (opStack.length > 0 && opStack[opStack.length - 1].valueType !== PredefinedType.openParenthesis) {
                        const topOpNode: Node = opStack.pop();

                        let valNodeRight: Node;
                        let valNodeLeft: Node;
                        if (valueStack.length > 0) {
                            valNodeRight = valueStack.pop();
                        }
                        if (valueStack.length > 0) {
                            valNodeLeft = (topOpNode.valueType !== PredefinedType.notOperator) ? valueStack.pop() : undefined;
                        }

                        topOpNode.right = valNodeRight;
                        topOpNode.left = valNodeLeft;

                        valueStack.push(topOpNode);
                    }

                    // finally found open parenthesis
                    if (opStack.length > 0 && valueStack.length > 0) {
                        // traverse left most node and add "("
                        let currNode: Node = valueStack[valueStack.length - 1];
                        while (currNode && currNode.left) {
                            currNode = currNode.left;
                        }
                        if (currNode) {
                            currNode.left = opStack.pop();
                        }

                        // traverse right most node and add ")"
                        currNode = valueStack[valueStack.length - 1];
                        while (currNode && currNode.right) {
                            currNode = currNode.right;
                        }
                        if (currNode) {
                            currNode.right = newNode;
                        }
                    }
                    break;
                case PredefinedType.notOperator:
                case PredefinedType.operator:
                    while (opStack.length > 0 && this.operatorPriority(opStack[opStack.length - 1].value) < this.operatorPriority(token[0])) {
                        const topOpNode: Node = opStack.pop();

                        let valNodeRight: Node;
                        let valNodeLeft: Node;
                        if (valueStack.length > 0) {
                            valNodeRight = valueStack.pop();
                        }
                        if (valueStack.length > 0) {
                            valNodeLeft = (topOpNode.valueType !== PredefinedType.notOperator) ? valueStack.pop() : undefined;
                        }

                        topOpNode.right = valNodeRight;
                        topOpNode.left = valNodeLeft;

                        valueStack.push(topOpNode);
                    }

                    opStack.push(newNode);
                    break;
                case PredefinedType.constant:
                case PredefinedType.token:
                case PredefinedType.custom:
                default:
                    valueStack.push(newNode);
            }
        }

        while (opStack.length > 0) {
            const topOpNode: Node = opStack.pop();

            let valNodeRight: Node;
            let valNodeLeft: Node;
            if (valueStack.length > 0) {
                valNodeRight = valueStack.pop();
            }
            if (valueStack.length > 0) {
                valNodeLeft = (topOpNode.valueType !== PredefinedType.notOperator) ? valueStack.pop() : undefined;
            }

            topOpNode.right = valNodeRight;
            topOpNode.left = valNodeLeft;

            valueStack.push(topOpNode);
        }

        return valueStack.pop();
    }

    /**
     * Order of operators
     * Higher the priority - higher the precedence
     */
    private static operatorPriority(op: string): number {
        if (!ExpressionTree.textToTokenHash.has(op)) {
            return 0;
        } else {
            switch (ExpressionTree.textToTokenHash.get(op)) {
                case PredefinedTokenEnum.OPENPAREN:
                case PredefinedTokenEnum.CLOSEPAREN:
                    return 4;
                case PredefinedTokenEnum.NOT:
                    return 3;
                case PredefinedTokenEnum.AND:
                case PredefinedTokenEnum.OR:
                    return 2;
                case PredefinedTokenEnum.GT:
                case PredefinedTokenEnum.LT:
                case PredefinedTokenEnum.EQ:
                case PredefinedTokenEnum.NE:
                case PredefinedTokenEnum.GE:
                case PredefinedTokenEnum.LE:
                    return 1;
                default:
                    return 0;
            }
        }
    }

    /**
     * Given a condition and the input values, evaluate the condition
     * @internal
     */
    public static evaluateCondition(condition: string, input: InputValues): boolean {
        if (StringUtils.isNullOrWhiteSpace(condition)) {
            return true;
        }

        const treeRoot: Node = this.constructExpressionTree(condition);
        return this.evaluateExpressionTree(treeRoot, input);
    }

    /**
     * Given an expression tree, evaluate the expression
     * @internal
     */
    public static evaluateExpressionTree(top: Node, input: InputValues): any {
        if (!top) {
            return false;
        }

        let leftReturn: any = false;
        let rightReturn: any = false;

        if (top.left) {
            leftReturn = this.evaluateExpressionTree(top.left, input);
        }

        if (top.right) {
            rightReturn = this.evaluateExpressionTree(top.right, input);
        }

        if (top.valueType === PredefinedType.custom) {
            // check if number and return number
            const num: number = Number(top.value);
            if (!isNaN(num)) {
                return num;
            }

            // check if bool and return bool
            if (typeof top.value === 'string') {
                if (top.value.trim().toLowerCase() === 'true') {
                    return true;
                } else if (top.value.trim().toLowerCase() === 'false') {
                    return false;
                }
            }
        }

        if (!ExpressionTree.textToTokenHash.has(top.value)) {
            return top.value;
        } else {
            switch (ExpressionTree.textToTokenHash.get(top.value)) {
                case PredefinedTokenEnum.AND:
                    return (leftReturn === undefined || rightReturn === undefined) ? false : leftReturn && rightReturn;
                case PredefinedTokenEnum.NOT:
                    return (rightReturn === undefined) ? false : !rightReturn;
                case PredefinedTokenEnum.OR:
                    return (leftReturn === undefined|| rightReturn === undefined) ? false : leftReturn || rightReturn;

                case PredefinedTokenEnum.GT:
                    return (leftReturn === undefined || rightReturn === undefined) ? false : leftReturn > rightReturn;
                case PredefinedTokenEnum.LT:
                    return (leftReturn === undefined || rightReturn === undefined) ? false : leftReturn < rightReturn;
                case PredefinedTokenEnum.GE:
                    return (leftReturn === undefined || rightReturn === undefined) ? false : leftReturn >= rightReturn;
                case PredefinedTokenEnum.LE:
                    return (leftReturn === undefined || rightReturn === undefined) ? false : leftReturn <= rightReturn;
                case PredefinedTokenEnum.EQ:
                    return (leftReturn === undefined || rightReturn === undefined) ? false : leftReturn === rightReturn;
                case PredefinedTokenEnum.NE:
                    return (leftReturn === undefined || rightReturn === undefined) ? false : leftReturn !== rightReturn;

                case PredefinedTokenEnum.TRUE:
                    return true;
                case PredefinedTokenEnum.FALSE:
                    return false;

                case PredefinedTokenEnum.OPENPAREN:
                case PredefinedTokenEnum.CLOSEPAREN:
                    return true;

                case PredefinedTokenEnum.DEPTH:
                    return input.nextDepth;
                case PredefinedTokenEnum.MAXDEPTH:
                    return input.maxDepth;

                case PredefinedTokenEnum.ISARRAY:
                    return input.isArray;
                case PredefinedTokenEnum.NOMAXDEPTH:
                    return input.noMaxDepth;

                case PredefinedTokenEnum.MINCARDINALITY:
                    return input.minCardinality;
                case PredefinedTokenEnum.MAXCARDINALITY:
                    return input.maxCardinality;

                case PredefinedTokenEnum.NORMALIZED:
                    return input.normalized;
                case PredefinedTokenEnum.REFERENCEONLY:
                    return input.referenceOnly;
                case PredefinedTokenEnum.STRUCTURED:
                    return input.structured;
                case PredefinedTokenEnum.VIRTUAL:
                    return input.isVirtual;

                case PredefinedTokenEnum.ALWAYS:
                    return true;

                default:
                    return top.value;
            }
        }
    }

    /**
     * For unit test only
     * @internal
     */
    public static inOrderTraversal(top: Node): void {
        if (top) {
            if (top.left) {
                this.inOrderTraversal(top.left);
            }

            console.log(` ${top.value} `);

            if (top.right) {
                this.inOrderTraversal(top.right);
            }
        }
    }
}
