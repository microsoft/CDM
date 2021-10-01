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
    internal static class ExpressionTree
    {
        internal static IReadOnlyDictionary<string, PredefinedTokenEnum> textToTokenHash = PredefinedTokens.InitializeTextToTokenHash();

        /// <summary>
        /// Create a new node of the expression tree
        /// </summary>
        /// <param name="value"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static Node CreateNewNode(dynamic value, PredefinedType type)
        {
            Node newNode = new Node
            {
                Value = value,
                ValueType = type,

                Left = null,
                Right = null
            };

            return newNode;
        }

        /// <summary>
        /// Given an expression string, create an expression tree
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        internal static Node ConstructExpressionTree(string expression)
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
        private static int OperatorPriority(string op)
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
        /// Given a condition and the input values, evaluate the condition
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="inputValues"></param>
        /// <returns></returns>
        internal static bool EvaluateCondition(string condition, InputValues inputValues)
        {
            if (string.IsNullOrWhiteSpace(condition))
            {
                return true;
            }

            Node treeRoot = ConstructExpressionTree(condition);
            return EvaluateExpressionTree(treeRoot, inputValues);
        }

        /// <summary>
        /// Given an expression tree, evaluate the expression
        /// </summary>
        /// <param name="top"></param>
        /// <param name="inputValues"></param>
        /// <returns></returns>
        internal static dynamic EvaluateExpressionTree(Node top, InputValues inputValues)
        {
            if (top == null)
            {
                return false;
            }

            dynamic leftReturn = false, rightReturn = false;

            if (top.Left != null)
            {
                leftReturn = EvaluateExpressionTree(top.Left, inputValues);
            }

            if (top.Right != null)
            {
                rightReturn = EvaluateExpressionTree(top.Right, inputValues);
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
                        return inputValues.NextDepth;
                    case PredefinedTokenEnum.MAXDEPTH:
                        return inputValues.MaxDepth;

                    case PredefinedTokenEnum.ISARRAY:
                        return inputValues.IsArray;
                    case PredefinedTokenEnum.NOMAXDEPTH:
                        return inputValues.NoMaxDepth;

                    case PredefinedTokenEnum.MINCARDINALITY:
                        return inputValues.MinCardinality;
                    case PredefinedTokenEnum.MAXCARDINALITY:
                        return inputValues.MaxCardinality;

                    case PredefinedTokenEnum.NORMALIZED:
                        return inputValues.Normalized;
                    case PredefinedTokenEnum.REFERENCEONLY:
                        return inputValues.ReferenceOnly;
                    case PredefinedTokenEnum.STRUCTURED:
                        return inputValues.Structured;
                    case PredefinedTokenEnum.VIRTUAL:
                        return inputValues.IsVirtual;

                    case PredefinedTokenEnum.ALWAYS:
                        return true;

                    default:
                        return top.Value;
                }
            }
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
