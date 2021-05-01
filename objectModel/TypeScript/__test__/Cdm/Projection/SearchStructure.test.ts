// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    ProjectionAttributeState,
    ProjectionContext,
    ProjectionDirective,
    ResolvedAttribute,
    resolveOptions,
    SearchResult,
    SearchStructure
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * Unit test for SearchStructure functions
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
 */
describe('Cdm/Projection/SearchStructureUnitTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestSearchStructure';

    /**
     * Unit test for building a tree
     */
    it('TestBuildTree', () => {
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, 'TestBuildTree');

        const pc: ProjectionContext = buildFakeTree(corpus);

        expect(searchTreeTraversal(pc, '1'))
            .toEqual('1 ==>> [ 12 14 17 .. 1 ..  1]');
        expect(searchTreeTraversal(pc, '8'))
            .toEqual('8 ==>> [ 12 17 .. 8 ..  1]');
        expect(searchTreeTraversal(pc, '13'))
            .toEqual('13 ==>> [ 13 .. 13 ..  4 5 6]');
        expect(searchTreeTraversal(pc, '9'))
            .toEqual('9 ==>> [ 13 .. 9 ..  4 5]');
        expect(searchTreeTraversal(pc, '5'))
            .toEqual('5 ==>> [ 13 .. 5 ..  5]');
        expect(searchTreeTraversal(pc, '7'))
            .toEqual('7 ==>> [ 11 15 .. 7 ..  1]');
    });

    function buildFakeTree(corpus: CdmCorpusDefinition): ProjectionContext {
        const projDir: ProjectionDirective = new ProjectionDirective(new resolveOptions(), undefined);
        const pc: ProjectionContext = new ProjectionContext(projDir, undefined);

        const p1: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p1.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '1', '1', undefined);
        const p2: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p2.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '2', '2', undefined);
        const p4: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p4.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '4', '4', undefined);
        const p5: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p5.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '5', '5', undefined);
        const p6: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p6.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '6', '6', undefined);
        const p7: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p7.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '7', '7', undefined);
        const p8: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p8.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '8', '8', undefined);
        const p9: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p9.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '9', '9', undefined);
        const p10: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p10.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '10', '10', undefined);
        const p11: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p11.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '11', '11', undefined);
        const p12: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p12.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '12', '12', undefined);
        const p13: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p13.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '13', '13', undefined);
        const p14: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p14.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '14', '14', undefined);
        const p15: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p15.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '15', '15', undefined);
        const p16: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p16.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '16', '16', undefined);
        const p17: ProjectionAttributeState = new ProjectionAttributeState(corpus.ctx);
        p17.currentResolvedAttribute = new ResolvedAttribute(projDir.resOpt, '17', '17', undefined);

        p1.previousStateList = [];
        p2.previousStateList = [];
        p4.previousStateList = [];
        p5.previousStateList = [];
        p6.previousStateList = [];
        p7.previousStateList = [];
        p8.previousStateList = [];
        p9.previousStateList = [];
        p10.previousStateList = [];
        p11.previousStateList = [];
        p12.previousStateList = [];
        p13.previousStateList = [];
        p14.previousStateList = [];
        p15.previousStateList = [];
        p16.previousStateList = [];
        p17.previousStateList = [];

        p11.previousStateList.push(p7);
        p7.previousStateList.push(p2);
        p2.previousStateList.push(p1);
        p12.previousStateList.push(p8);
        p8.previousStateList.push(p1);
        p13.previousStateList.push(p9);
        p9.previousStateList.push(p4);
        p9.previousStateList.push(p5);
        p13.previousStateList.push(p10);
        p10.previousStateList.push(p6);
        p14.previousStateList.push(p16);
        p16.previousStateList.push(p1);
        p15.previousStateList.push(p7);
        p17.previousStateList.push(p8);

        pc.currentAttributeStateSet.add(p11);
        pc.currentAttributeStateSet.add(p12);
        pc.currentAttributeStateSet.add(p13);
        pc.currentAttributeStateSet.add(p14);
        pc.currentAttributeStateSet.add(p15);
        pc.currentAttributeStateSet.add(p17);

        return pc;
    }

    function searchTreeTraversal(pc: ProjectionContext, val: string): string {
        let result: SearchResult = new SearchResult();
        for (const top of pc.currentAttributeStateSet.states) {
            let st: SearchStructure = new SearchStructure();
            st = SearchStructure.buildStructure(top, top, val, st, false, 0);
            if (st?.result.foundFlag === true) {
                if (result.foundFlag === false) {
                    result = st.result;
                } else if (result.foundDepth > st?.result.foundDepth) {
                    result = st.result;
                } else if (result.foundDepth === st?.result.foundDepth) {
                    for (const newTops of st?.result.top) {
                        result.top.push(newTops);
                    }
                }
            }
        }

        return result.foundFlag ? getResult(val, result) : '';
    }

    function getResult(val: string, result: SearchResult): string {
        let foundOrLeaf: string = '';
        if (result.leaf.length > 0) {
            for (const leaf of result.leaf) {
                foundOrLeaf = foundOrLeaf + ` ${leaf.currentResolvedAttribute.resolvedName}`;
            }
        } else {
            foundOrLeaf = 'N/A';
        }

        let foundOrTop: string = '';
        if (result.top.length > 0) {
            for (const top of result.top) {
                foundOrTop = foundOrTop + ` ${top.currentResolvedAttribute.resolvedName}`;
            }
        } else {
            foundOrTop = 'N/A';
        }

        return (`${val} ==>> [${foundOrTop} .. ${result.found.currentResolvedAttribute.resolvedName} .. ${foundOrLeaf}]`);
    }
});
