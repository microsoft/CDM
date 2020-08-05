// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// Unit test for SearchStructure functions
    /// </summary>
    /// <returns></returns>
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
    [TestClass]
    public class SearchStructureUnitTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "SearchStructureUnitTest");

        /// <summary>
        /// Unit test for building a tree
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public void TestBuildTree()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestBuildTree");

            ProjectionContext pc = BuildFakeTree(corpus);

            Assert.AreEqual("1 ==>> [ 12 14 17 .. 1 ..  1]", SearchTreeTraversal(pc, "1"));
            Assert.AreEqual("8 ==>> [ 12 17 .. 8 ..  1]", SearchTreeTraversal(pc, "8"));
            Assert.AreEqual("13 ==>> [ 13 .. 13 ..  4 5 6]", SearchTreeTraversal(pc, "13"));
            Assert.AreEqual("9 ==>> [ 13 .. 9 ..  4 5]", SearchTreeTraversal(pc, "9"));
            Assert.AreEqual("5 ==>> [ 13 .. 5 ..  5]", SearchTreeTraversal(pc, "5"));
            Assert.AreEqual("7 ==>> [ 11 15 .. 7 ..  1]", SearchTreeTraversal(pc, "7"));
        }

        private ProjectionContext BuildFakeTree(CdmCorpusDefinition corpus)
        {
            ProjectionDirective projDir = new ProjectionDirective(new ResolveOptions() { }, null);
            ProjectionContext pc = new ProjectionContext(projDir, null);
            {
                ProjectionAttributeState p1 = new ProjectionAttributeState(corpus.Ctx);
                p1.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "1", "1", null);
                ProjectionAttributeState p2 = new ProjectionAttributeState(corpus.Ctx);
                p2.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "2", "2", null);
                ProjectionAttributeState p4 = new ProjectionAttributeState(corpus.Ctx);
                p4.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "4", "4", null);
                ProjectionAttributeState p5 = new ProjectionAttributeState(corpus.Ctx);
                p5.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "5", "5", null);
                ProjectionAttributeState p6 = new ProjectionAttributeState(corpus.Ctx);
                p6.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "6", "6", null);
                ProjectionAttributeState p7 = new ProjectionAttributeState(corpus.Ctx);
                p7.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "7", "7", null);
                ProjectionAttributeState p8 = new ProjectionAttributeState(corpus.Ctx);
                p8.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "8", "8", null);
                ProjectionAttributeState p9 = new ProjectionAttributeState(corpus.Ctx);
                p9.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "9", "9", null);
                ProjectionAttributeState p10 = new ProjectionAttributeState(corpus.Ctx);
                p10.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "10", "10", null);
                ProjectionAttributeState p11 = new ProjectionAttributeState(corpus.Ctx);
                p11.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "11", "11", null);
                ProjectionAttributeState p12 = new ProjectionAttributeState(corpus.Ctx);
                p12.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "12", "12", null);
                ProjectionAttributeState p13 = new ProjectionAttributeState(corpus.Ctx);
                p13.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "13", "13", null);
                ProjectionAttributeState p14 = new ProjectionAttributeState(corpus.Ctx);
                p14.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "14", "14", null);
                ProjectionAttributeState p15 = new ProjectionAttributeState(corpus.Ctx);
                p15.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "15", "15", null);
                ProjectionAttributeState p16 = new ProjectionAttributeState(corpus.Ctx);
                p16.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "16", "16", null);
                ProjectionAttributeState p17 = new ProjectionAttributeState(corpus.Ctx);
                p17.CurrentResolvedAttribute = new ResolvedAttribute(projDir.ResOpt, "17", "17", null);

                p1.PreviousStateList = new List<ProjectionAttributeState>();
                p2.PreviousStateList = new List<ProjectionAttributeState>();
                p4.PreviousStateList = new List<ProjectionAttributeState>();
                p5.PreviousStateList = new List<ProjectionAttributeState>();
                p6.PreviousStateList = new List<ProjectionAttributeState>();
                p7.PreviousStateList = new List<ProjectionAttributeState>();
                p8.PreviousStateList = new List<ProjectionAttributeState>();
                p9.PreviousStateList = new List<ProjectionAttributeState>();
                p10.PreviousStateList = new List<ProjectionAttributeState>();
                p11.PreviousStateList = new List<ProjectionAttributeState>();
                p12.PreviousStateList = new List<ProjectionAttributeState>();
                p13.PreviousStateList = new List<ProjectionAttributeState>();
                p14.PreviousStateList = new List<ProjectionAttributeState>();
                p15.PreviousStateList = new List<ProjectionAttributeState>();
                p16.PreviousStateList = new List<ProjectionAttributeState>();
                p17.PreviousStateList = new List<ProjectionAttributeState>();

                p11.PreviousStateList.Add(p7);
                p7.PreviousStateList.Add(p2);
                p2.PreviousStateList.Add(p1);
                p12.PreviousStateList.Add(p8);
                p8.PreviousStateList.Add(p1);
                p13.PreviousStateList.Add(p9);
                p9.PreviousStateList.Add(p4);
                p9.PreviousStateList.Add(p5);
                p13.PreviousStateList.Add(p10);
                p10.PreviousStateList.Add(p6);
                p14.PreviousStateList.Add(p16);
                p16.PreviousStateList.Add(p1);
                p15.PreviousStateList.Add(p7);
                p17.PreviousStateList.Add(p8);

                pc.CurrentAttributeStateSet.Add(p11);
                pc.CurrentAttributeStateSet.Add(p12);
                pc.CurrentAttributeStateSet.Add(p13);
                pc.CurrentAttributeStateSet.Add(p14);
                pc.CurrentAttributeStateSet.Add(p15);
                pc.CurrentAttributeStateSet.Add(p17);
            }

            return pc;
        }

        internal string SearchTreeTraversal(ProjectionContext pc, string val)
        {
            SearchResult result = new SearchResult();
            foreach (var top in pc.CurrentAttributeStateSet.Values)
            {
                SearchStructure st = new SearchStructure();
                st = SearchStructure.BuildStructure(top, top, val, st, false, 0);
                if (st?.Result.FoundFlag == true)
                {
                    if (result.FoundFlag == false)
                    {
                        result = st.Result;
                    }
                    else if (result.FoundDepth > st?.Result.FoundDepth)
                    {
                        result = st.Result;
                    }
                    else if (result.FoundDepth == st?.Result.FoundDepth)
                    {
                        foreach (var newTops in st?.Result.Top)
                        {
                            result.Top.Add(newTops);
                        }
                    }
                }
            }

            return result.FoundFlag ? GetResult(val, result) : string.Empty;
        }

        internal string GetResult(string val, SearchResult result)
        {
            string foundOrLeaf = null;
            if (result.Leaf.Count > 0)
            {
                foreach (var leaf in result.Leaf)
                {
                    foundOrLeaf = foundOrLeaf + $" {leaf.CurrentResolvedAttribute.ResolvedName}";
                }
            }
            else
            {
                foundOrLeaf = "N/A";
            }

            string foundOrTop = null;
            if (result.Top.Count > 0)
            {
                foreach (var top in result.Top)
                {
                    foundOrTop = foundOrTop + $" {top.CurrentResolvedAttribute.ResolvedName}";
                }
            }
            else
            {
                foundOrTop = "N/A";
            }

            return ($"{val} ==>> [{foundOrTop} .. {result.Found.CurrentResolvedAttribute.ResolvedName} .. {foundOrLeaf}]");
        }

    }
}
