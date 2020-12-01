// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    /// <summary>
    /// A structure to carry all the input values during evaluation/resolution of an expression tree
    /// </summary>
    internal class InputValues
    {
        public int? nextDepth { get; set; }
        public int? maxDepth { get; set; }
        public bool? noMaxDepth { get; set; }
        public bool? isArray { get; set; }

        public int? minCardinality { get; set; }
        public int? maxCardinality { get; set; }

        public bool referenceOnly { get; set; }
        public bool normalized { get; set; }
        public bool structured { get; set; }
        public bool isVirtual { get; set; }
    }
}
