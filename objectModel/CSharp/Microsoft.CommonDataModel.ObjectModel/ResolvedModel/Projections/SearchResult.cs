// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using System.Collections.Generic;

    internal class SearchResult
    {
        public bool FoundFlag { set; get; }

        public int FoundDepth { set; get; }

        public ProjectionAttributeState Found { set; get; }

        public List<ProjectionAttributeState> Top { set; get; }

        public List<ProjectionAttributeState> Leaf { set; get; }

        public SearchResult()
        {
            FoundFlag = false;
            Found = null;
            Top = new List<ProjectionAttributeState>();
            Leaf = new List<ProjectionAttributeState>();
        }
    }
}
