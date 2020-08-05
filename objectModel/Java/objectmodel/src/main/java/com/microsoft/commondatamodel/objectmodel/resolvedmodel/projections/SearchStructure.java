// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

import java.util.Stack;

/**
 * Structure to help search the ProjectionAttributeState previous state tree for leaf node and top node for a given attribute name
 * E.g.: Given the following tree
 *
 *     11  12  13 =====      14    15  17
 *     |   |   |       |     |     |   |
 *     |   |   |       |     |     |   |
 *     7   8   9 ==    10    16    7   8
 *     |   |   |   |   |     |     |   |
 *     |   |   |   |   |     |     |   |
 *     2   1   4   5   6     1     2   1
 *     |                           |
 *     |                           |
 *     1                           1
 *
 * Leaf Node Searches:
 * - Search for 11's leaf nodes would be 1
 * - Search for 10's leaf nodes would be 6
 * - Search for 9's leaf nodes would be 4, 5
 * - Search for 4's leaf nodes would be 4
 *
 * Top Node Searches:
 * - Search for 1's top node would be 12 14 17
 * - Search for 13's top node would be 13
 * - Search for 5's top node would be 13
 * - Search for 2's top node would be 11 15
 *
 * Smallest Depth Wins
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class SearchStructure {
    Stack<ProjectionAttributeState> structure;

    private SearchResult result;
    private int count;

    /**
     * @deprecated This constructor is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public SearchStructure() {
        this.result = new SearchResult();

        this.structure = new Stack<ProjectionAttributeState>();
    }

    public void dispose() {
        structure = null;
        result = null;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void add(ProjectionAttributeState pas) {
        if (structure.size() == 0) {
            result.getTop().add(pas);
        }

        structure.push(pas);
    }

    /**
     * Build a structure using a stack
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static SearchStructure buildStructure(
        ProjectionAttributeState curr,
        ProjectionAttributeState top,
        String attrName,
        SearchStructure st,
        boolean foundFlag,
        int foundDepth) {
        if (curr != null) {
            st.add(curr);

            if (StringUtils.equalsWithCase(curr.getCurrentResolvedAttribute().getResolvedName(), attrName)) {
                foundFlag = true;
                st.getResult().setFoundFlag(true);
                st.getResult().setFoundDepth(foundDepth);
                st.getResult().setFound(curr);
            }
            if (foundFlag && (curr != null && curr.getPreviousStateList() == null || curr != null && curr.getPreviousStateList().size() == 0)) {
                st.getResult().getLeaf().add(curr);
            }

            if (curr.getPreviousStateList() != null && curr.getPreviousStateList().size() > 0) {
                for (ProjectionAttributeState prev : curr.getPreviousStateList()) {
                    buildStructure(prev, top, attrName, st, foundFlag, foundDepth + 1);
                }
            }
        }

        return st;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public SearchResult getResult() {
        return result;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setResult(final SearchResult result) {
        this.result = result;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public int getCount() {
        return structure == null ? -1 : structure.size();
    }
}