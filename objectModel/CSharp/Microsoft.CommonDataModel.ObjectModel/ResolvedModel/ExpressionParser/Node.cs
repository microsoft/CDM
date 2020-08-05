// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    /// <summary>
    /// A node in the expression tree
    /// </summary>
    internal class Node
    {
        /// <summary>
        /// Value for the node
        /// This can hold string tokens from an expression when building the tree, but it can also hold a boolean value when evaluating the tree
        /// </summary>
        internal dynamic Value { get; set; }

        /// <summary>
        /// Type of the value
        /// </summary>
        internal PredefinedType ValueType { get; set; }

        /// <summary>
        /// Left node
        /// </summary>
        internal Node Left { get; set; }

        /// <summary>
        /// Right node
        /// </summary>
        internal Node Right { get; set; }
    }
}
