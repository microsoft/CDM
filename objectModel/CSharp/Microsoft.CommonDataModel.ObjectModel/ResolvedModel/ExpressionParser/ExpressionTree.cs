// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Class to generate an expression tree so that expression can be evaluated or parsed at a later date
    /// </summary>
    /// <unitTest>ExpressionTreeUnitTest</unitTest>
    internal sealed class ExpressionTree
    {
        internal static Dictionary<string, PredefinedTokenEnum> textToTokenHash = PredefinedTokens.InitializeTextToTokenHash();

        /// <summary>
        /// Create a new node of the expression tree
        /// </summary>
        /// <param name="value"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private Node CreateNewNode(dynamic value, PredefinedType type)
        {
            Node newNode = new Node();

            newNode.Value = value;
            newNode.ValueType = type;

            newNode.Left = null;
            newNode.Right = null;

            return newNode;
        }

        /// <summary>
        /// Given an expression string, create an expression tree
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        internal Node ConstructExpressionTree(string expression)
        {
            if (string.IsNullOrWhiteSpace(expression))
            {
                // caller to log info "Optional expression missing. Implicit expression will automatically apply." if returned null
                return null;
            }

            Stack<Node> opStack = new Stack<Node>();
            Stack<Node> valueStack = new Stack<Node>();

            // split into tokens
            List<Tuple<dynamic, PredefinedType>> tokenList = Tokenizer.GetExpressionAsTokenList(expression);

            foreach (Tuple<dynamic, PredefinedType> token in tokenList)
            {
                Node newNode = CreateNewNode(token.Item1, token.Item2);

                switch (token.Item2)
                {
                    case PredefinedType.OpenParenthesis:
                        {
                            opStack.Push(newNode);
                        }
                        break;

                    case PredefinedType.CloseParenthesis:
                        {
                            while (opStack.Count > 0 && opStack.Peek().ValueType != PredefinedType.OpenParenthesis)
                            {
                                Node topOpNode = opStack.Pop();

                                Node valNodeRight = null, valNodeLeft = null;
                                if (valueStack.Count > 0)
                                {
                                    valNodeRight = valueStack.Pop();
                                }
                                if (valueStack.Count > 0)
                                {
                                    valNodeLeft = (topOpNode.ValueType != PredefinedType.NotOperator) ? valueStack.Pop() : null;
                                }

                                topOpNode.Right = valNodeRight;
                                topOpNode.Left = valNodeLeft;

                                valueStack.Push(topOpNode);
                            }

                            // finally found open parenthesis
                            if (opStack.Count > 0 && valueStack.Count > 0)
                            {
                                // traverse left most node and add "("
                                Node currNode = valueStack.Peek();
                                while (currNode != null && currNode.Left != null)
                                {
                                    currNode = currNode.Left;
                                }
                                if (currNode != null)
                                {
                                    currNode.Left = opStack.Pop();
                                }

                                // traverse ritgh most node and add ")"
                                currNode = valueStack.Peek();
                                while (currNode != null && currNode.Right != null)
                                {
                                    currNode = currNode.Right;
                                }
                                if (currNode != null)
                                {
                                    currNode.Right = newNode;
                                }
                            }
                        }
                        break;

                    case PredefinedType.NotOperator:
                    case PredefinedType.Operator:
                        {
                            while (opStack.Count > 0 && OperatorPriority(opStack.Peek().Value) < OperatorPriority(token.Item1))
                            {
                                Node topOpNode = opStack.Pop();

                                Node valNodeRight = null, valNodeLeft = null;
                                if (valueStack.Count > 0)
                                {
                                    valNodeRight = valueStack.Pop();
                                }
                                if (valueStack.Count > 0)
                                {
                                    valNodeLeft = (topOpNode.ValueType != PredefinedType.NotOperator) ? valueStack.Pop() : null;
                                }

                                topOpNode.Right = valNodeRight;
                                topOpNode.Left = valNodeLeft;

                                valueStack.Push(topOpNode);
                            }

                            opStack.Push(newNode);
                        }
                        break;

                    case PredefinedType.Constant:
                    case PredefinedType.Token:
                    case PredefinedType.Custom:
                    default:
                        {
                            valueStack.Push(newNode);
                        }
                        break;
                }
            }

            while (opStack.Count > 0)
            {
                Node topOpNode = opStack.Pop();

                Node valNodeRight = null, valNodeLeft = null;
                if (valueStack.Count > 0)
                {
                    valNodeRight = valueStack.Pop();
                }
                if (valueStack.Count > 0)
                {
                    valNodeLeft = (topOpNode.ValueType != PredefinedType.NotOperator) ? valueStack.Pop() : null;
                }

                topOpNode.Right = valNodeRight;
                topOpNode.Left = valNodeLeft;

                valueStack.Push(topOpNode);
            }

            return valueStack.Pop();
        }

        /// <summary>
        /// Order of operators
        /// Higher the priorty - higher the precedence
        /// </summary>
        /// <param name="op"></param>
        /// <returns></returns>
        private int OperatorPriority(string op)
        {
            if (!textToTokenHash.ContainsKey(op))
            {
                return 0;
            }
            else
            {
                switch (textToTokenHash[op])
                {
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

        /// <summary>
        /// Given an expression tree, evaluate the expression
        /// </summary>
        /// <param name="top"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        internal static dynamic EvaluateExpressionTree(Node top, InputValues input)
        {
            if (top != null)
            {
                dynamic leftReturn = false, rightReturn = false;

                if (top.Left != null)
                {
                    leftReturn = EvaluateExpressionTree(top.Left, input);
                }

                if (top.Right != null)
                {
                    rightReturn = EvaluateExpressionTree(top.Right, input);
                }

                if (top.ValueType == PredefinedType.Custom)
                {
                    // check if number and return number
                    int num;
                    if (int.TryParse(top.Value, out num))
                    {
                        return num;
                    }

                    // check if bool and return bool
                    bool bl = false;
                    if (bool.TryParse(top.Value, out bl))
                    {
                        return bl;
                    }
                }

                if (!textToTokenHash.ContainsKey(top.Value))
                {
                    return top.Value;
                }
                else
                {
                    switch (textToTokenHash[top.Value])
                    {
                        case PredefinedTokenEnum.AND:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn && rightReturn;
                        case PredefinedTokenEnum.NOT:
                            return (rightReturn == null) ? false : !rightReturn;
                        case PredefinedTokenEnum.OR:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn || rightReturn;

                        case PredefinedTokenEnum.GT:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn > rightReturn;
                        case PredefinedTokenEnum.LT:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn < rightReturn;
                        case PredefinedTokenEnum.GE:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn >= rightReturn;
                        case PredefinedTokenEnum.LE:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn <= rightReturn;
                        case PredefinedTokenEnum.EQ:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn == rightReturn;
                        case PredefinedTokenEnum.NE:
                            return (leftReturn == null || rightReturn == null) ? false : leftReturn != rightReturn;

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

                        case PredefinedTokenEnum.ALWAYS:
                            return true;

                        default:
                            return top.Value;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// For Unit Test Only
        /// </summary>
        /// <param name="top"></param>
        internal static void InOrderTraversal(Node top)
        {
            if (top != null)
            {
                if (top.Left != null)
                {
                    InOrderTraversal(top.Left);
                }

                Console.Write($" {top.Value} ");

                if (top.Right != null)
                {
                    InOrderTraversal(top.Right);
                }
            }
        }

    }
}
