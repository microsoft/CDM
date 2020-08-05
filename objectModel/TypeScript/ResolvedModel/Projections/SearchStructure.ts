// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ProjectionAttributeState, SearchResult, StringUtils } from '../../internal';

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
 * @internal
 */
export class SearchStructure {
    private structure: ProjectionAttributeState[];

    /**
     * @internal
     */
    public result: SearchResult;

    /**
     * @internal
     */
    public get count(): number {
        return !this.structure ? -1 : this.structure.length;
    }

    /**
     * @internal
     */
    constructor() {
        this.result = new SearchResult();
        this.structure = [];
    }

    public dispose(): void {
        this.structure = undefined;
        this.result = undefined;
    }

    /**
     * @internal
     */
    public add(pas: ProjectionAttributeState): void {
        if (this.structure.length === 0) {
            this.result.top.push(pas);
        }

        this.structure.push(pas);
    }

    /**
     * Build a structure using a stack
     * @internal
     */
    public static buildStructure(
        curr: ProjectionAttributeState,
        top: ProjectionAttributeState,
        attrName: string,
        st: SearchStructure,
        foundFlag: boolean,
        foundDepth: number
    ): SearchStructure {
        if (curr) {
            st.add(curr);

            if (StringUtils.equalsWithCase(curr.currentResolvedAttribute.resolvedName, attrName)) {
                foundFlag = true;
                st.result.foundFlag = true;
                st.result.foundDepth = foundDepth;
                st.result.found = curr;
            }
            if (foundFlag && (!curr?.previousStateList || curr?.previousStateList?.length === 0)) {
                st.result.leaf.push(curr);
            }

            if (curr.previousStateList?.length > 0) {
                for (const prev of curr.previousStateList) {
                    SearchStructure.buildStructure(prev, top, attrName, st, foundFlag, foundDepth + 1);
                }
            }
        }

        return st;
    }
}
