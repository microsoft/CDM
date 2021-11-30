// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.text.MessageFormat;
import java.util.ArrayList;

/**
 * Unit test for SearchStructure functions
 *
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
public class SearchStructureUnitTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "SearchStructureUnitTest").toString();

    /**
     * Unit test for building a tree
     */
    @Test
    public void testBuildTree() throws InterruptedException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testBuildTree");

        ProjectionContext pc = buildFakeTree(corpus);

        Assert.assertEquals(searchTreeTraversal(pc, "1"), "1 ==>> [ 12 14 17 .. 1 ..  1]");
        Assert.assertEquals(searchTreeTraversal(pc, "8"), "8 ==>> [ 12 17 .. 8 ..  1]");
        Assert.assertEquals(searchTreeTraversal(pc, "13"), "13 ==>> [ 13 .. 13 ..  4 5 6]");
        Assert.assertEquals(searchTreeTraversal(pc, "9"), "9 ==>> [ 13 .. 9 ..  4 5]");
        Assert.assertEquals(searchTreeTraversal(pc, "5"), "5 ==>> [ 13 .. 5 ..  5]");
        Assert.assertEquals(searchTreeTraversal(pc, "7"), "7 ==>> [ 11 15 .. 7 ..  1]");
    }

    private ProjectionContext buildFakeTree(CdmCorpusDefinition corpus) {
        ProjectionDirective projDir = new ProjectionDirective(new ResolveOptions(), null);
        ProjectionContext pc = new ProjectionContext(projDir, null);

        ProjectionAttributeState p1 = new ProjectionAttributeState(corpus.getCtx());
        p1.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "1"), "1", null));
        ProjectionAttributeState p2 = new ProjectionAttributeState(corpus.getCtx());
        p2.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "2"), "2", null));
        ProjectionAttributeState p4 = new ProjectionAttributeState(corpus.getCtx());
        p4.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "4"), "4", null));
        ProjectionAttributeState p5 = new ProjectionAttributeState(corpus.getCtx());
        p5.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "5"), "5", null));
        ProjectionAttributeState p6 = new ProjectionAttributeState(corpus.getCtx());
        p6.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "6"), "6", null));
        ProjectionAttributeState p7 = new ProjectionAttributeState(corpus.getCtx());
        p7.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "7"), "7", null));
        ProjectionAttributeState p8 = new ProjectionAttributeState(corpus.getCtx());
        p8.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "8"), "8", null));
        ProjectionAttributeState p9 = new ProjectionAttributeState(corpus.getCtx());
        p9.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "9"), "9", null));
        ProjectionAttributeState p10 = new ProjectionAttributeState(corpus.getCtx());
        p10.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "10"), "10", null));
        ProjectionAttributeState p11 = new ProjectionAttributeState(corpus.getCtx());
        p11.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "11"), "11", null));
        ProjectionAttributeState p12 = new ProjectionAttributeState(corpus.getCtx());
        p12.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "12"), "12", null));
        ProjectionAttributeState p13 = new ProjectionAttributeState(corpus.getCtx());
        p13.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "13"), "13", null));
        ProjectionAttributeState p14 = new ProjectionAttributeState(corpus.getCtx());
        p14.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "14"), "14", null));
        ProjectionAttributeState p15 = new ProjectionAttributeState(corpus.getCtx());
        p15.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), "15", "15", null));
        ProjectionAttributeState p16 = new ProjectionAttributeState(corpus.getCtx());
        p16.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "16"), "16", null));
        ProjectionAttributeState p17 = new ProjectionAttributeState(corpus.getCtx());
        p17.setCurrentResolvedAttribute(new ResolvedAttribute(projDir.getResOpt(), new CdmTypeAttributeDefinition(corpus.getCtx(), "17"), "17", null));

        p1.setPreviousStateList(new ArrayList<>());
        p2.setPreviousStateList(new ArrayList<>());
        p4.setPreviousStateList(new ArrayList<>());
        p5.setPreviousStateList(new ArrayList<>());
        p6.setPreviousStateList(new ArrayList<>());
        p7.setPreviousStateList(new ArrayList<>());
        p8.setPreviousStateList(new ArrayList<>());
        p9.setPreviousStateList(new ArrayList<>());
        p10.setPreviousStateList(new ArrayList<>());
        p11.setPreviousStateList(new ArrayList<>());
        p12.setPreviousStateList(new ArrayList<>());
        p13.setPreviousStateList(new ArrayList<>());
        p14.setPreviousStateList(new ArrayList<>());
        p15.setPreviousStateList(new ArrayList<>());
        p16.setPreviousStateList(new ArrayList<>());
        p17.setPreviousStateList(new ArrayList<>());

        p11.getPreviousStateList().add(p7);
        p7.getPreviousStateList().add(p2);
        p2.getPreviousStateList().add(p1);
        p12.getPreviousStateList().add(p8);
        p8.getPreviousStateList().add(p1);
        p13.getPreviousStateList().add(p9);
        p9.getPreviousStateList().add(p4);
        p9.getPreviousStateList().add(p5);
        p13.getPreviousStateList().add(p10);
        p10.getPreviousStateList().add(p6);
        p14.getPreviousStateList().add(p16);
        p16.getPreviousStateList().add(p1);
        p15.getPreviousStateList().add(p7);
        p17.getPreviousStateList().add(p8);

        pc.getCurrentAttributeStateSet().add(p11);
        pc.getCurrentAttributeStateSet().add(p12);
        pc.getCurrentAttributeStateSet().add(p13);
        pc.getCurrentAttributeStateSet().add(p14);
        pc.getCurrentAttributeStateSet().add(p15);
        pc.getCurrentAttributeStateSet().add(p17);

        return pc;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface,
     * and not meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public String searchTreeTraversal(ProjectionContext pc, String val) {
        SearchResult result = new SearchResult();
        for (ProjectionAttributeState top : pc.getCurrentAttributeStateSet().getStates()) {
            SearchStructure st = new SearchStructure();
            st = SearchStructure.buildStructure(top, top, val, st, false, 0);
            if (st != null) {
                if (st.getResult().getFoundFlag() == true) {
                    if (result.getFoundFlag() == false) {
                        result = st.getResult();
                    } else if (result.getFoundDepth() > st.getResult().getFoundDepth()) {
                        result = st.getResult();
                    } else if (result.getFoundDepth() == st.getResult().getFoundDepth()){
                        for (ProjectionAttributeState newTops : st.getResult().getTop()){
                            result.getTop().add(newTops);
                        }
                    }
                }
            }
        }

        return result.getFoundFlag() ? getResult(val, result) : "";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface,
     * and not meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public String getResult(String val, SearchResult result) {
        String foundOrLeaf = "";
        if (result.getLeaf().size() > 0) {
            for (ProjectionAttributeState leaf : result.getLeaf()) {
                foundOrLeaf = MessageFormat.format(foundOrLeaf + " {0}", leaf.getCurrentResolvedAttribute().getResolvedName());
            }
        } else {
            foundOrLeaf = "N/A";
        }

        String foundOrTop = "";
        if (result.getTop().size() > 0) {
            for (ProjectionAttributeState top : result.getTop()) {
                foundOrTop = MessageFormat.format(foundOrTop + " {0}", top.getCurrentResolvedAttribute().getResolvedName());
            }
        } else {
            foundOrTop = "N/A";
        }

        return MessageFormat.format("{0} ==>> [{1} .. {2} .. {3}]", val, foundOrTop, result.getFound().getCurrentResolvedAttribute().getResolvedName(), foundOrLeaf);
    }
}
