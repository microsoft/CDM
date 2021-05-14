// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    /// <summary>
    /// A structure to carry all the input values during evaluation/resolution of an expression tree
    /// </summary>
    internal class InputValues
    {
        public int? NextDepth { get; set; }
        public int? MaxDepth { get; set; }
        public bool? NoMaxDepth { get; set; }
        public bool? IsArray { get; set; }

        public int? MinCardinality { get; set; }
        public int? MaxCardinality { get; set; }

        public bool ReferenceOnly { get; set; }
        public bool Normalized { get; set; }
        public bool Structured { get; set; }
        public bool IsVirtual { get; set; }

        public InputValues() { }

        public InputValues(ProjectionDirective projDirective)
        {
            NoMaxDepth = projDirective.HasNoMaximumDepth;
            IsArray = projDirective.IsArray;

            ReferenceOnly = projDirective.IsReferenceOnly;
            Normalized = projDirective.IsNormalized;
            Structured = projDirective.IsStructured;
            IsVirtual = projDirective.IsVirtual;

            NextDepth = projDirective.ResOpt.DepthInfo.CurrentDepth;
            MaxDepth = projDirective.MaximumDepth;

            MinCardinality = projDirective.Cardinality?._MinimumNumber;
            MaxCardinality = projDirective.Cardinality?._MaximumNumber;
        }
    }
}
