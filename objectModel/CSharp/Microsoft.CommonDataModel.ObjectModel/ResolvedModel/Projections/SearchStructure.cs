// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Structure to help search the ProjectionAttributeState previous state tree for leaf node and top node for a given attribute name
    /// </summary>
    /// <unitTests>SeachStructureUnitTest</unitTests>
    /// E.g.: Given the following tree
    /// 
    ///     11  12  13 =====      14    15  17
    ///     |   |   |       |     |     |   |
    ///     |   |   |       |     |     |   |
    ///     7   8   9 ==    10    16    7   8
    ///     |   |   |   |   |     |     |   |
    ///     |   |   |   |   |     |     |   |
    ///     2   1   4   5   6     1     2   1
    ///     |                           |
    ///     |                           |
    ///     1                           1
    /// 
    /// Leaf Node Searches:
    /// - Search for 11's leaf nodes would be 1
    /// - Search for 10's leaf nodes would be 6
    /// - Search for 9's leaf nodes would be 4, 5
    /// - Search for 4's leaf nodes would be 4
    /// 
    /// Top Node Searches:
    /// - Search for 1's top node would be 12 14 17
    /// - Search for 13's top node would be 13
    /// - Search for 5's top node would be 13
    /// - Search for 2's top node would be 11 15
    /// 
    /// Smallest Depth Wins
    internal class SearchStructure : IDisposable
    {
        Stack<ProjectionAttributeState> structure;

        internal SearchResult Result { set; get; }

        internal int Count
        {
            get
            {
                return structure == null ? -1 : structure.Count();
            }
        }

        internal SearchStructure()
        {
            Result = new SearchResult();

            this.structure = new Stack<ProjectionAttributeState>();
        }

        public void Dispose()
        {
            structure = null;
            Result = null;
        }

        internal void Add(ProjectionAttributeState pas)
        {
            if (structure.Count() == 0)
            {
                Result.Top.Add(pas);
            }

            structure.Push(pas);
        }

        /// <summary>
        /// Build a structure using a stack
        /// </summary>
        /// <param name="curr"></param>
        /// <param name="top"></param>
        /// <param name="attrName"></param>
        /// <param name="st"></param>
        /// <param name="foundFlag"></param>
        /// <returns></returns>
        internal static SearchStructure BuildStructure(
            ProjectionAttributeState curr,
            ProjectionAttributeState top,
            string attrName,
            SearchStructure st,
            bool foundFlag,
            int foundDepth)
        {
            if (curr != null)
            {
                st.Add(curr);

                if (StringUtils.EqualsWithCase(curr.CurrentResolvedAttribute.ResolvedName, attrName))
                {
                    foundFlag = true;
                    st.Result.FoundFlag = true;
                    st.Result.FoundDepth = foundDepth;
                    st.Result.Found = curr;
                }
                if (foundFlag && (curr?.PreviousStateList == null || curr?.PreviousStateList?.Count == 0))
                {
                    st.Result.Leaf.Add(curr);
                }

                if (curr.PreviousStateList?.Count > 0)
                {
                    foreach (var prev in curr.PreviousStateList)
                    {
                        BuildStructure(prev, top, attrName, st, foundFlag, foundDepth + 1);
                    }
                }
            }

            return st;
        }
    }
}
