// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class LocalEntityDeclarationDefinitionTests
    {
        /// <summary>
        /// Tests if the copy function creates copies of the sub objects
        /// </summary>
        [TestMethod]
        public void TestLocalEntityDeclarationDefinitionCopy()
        {
            var corpus = TestHelper.GetLocalCorpus("", nameof(TestLocalEntityDeclarationDefinitionCopy), noInputAndOutputFolder: true);
            var entity = new CdmLocalEntityDeclarationDefinition(corpus.Ctx, "name");

            var dataPartitionName = "dataPartitionName";
            var dataPartitionPatternName = "dataPartitionPatternName";
            var incrementalPartitionName = "incrementalPartitionName";
            var incrementalPartitionPatternName = "incrementalPartitionPatternName";

            var dataPartition = entity.DataPartitions.Add(dataPartitionName);
            var dataPartitionPattern = entity.DataPartitionPatterns.Add(dataPartitionPatternName);
            var incrementalPartition = entity.IncrementalPartitions.Add(incrementalPartitionName);
            var incrementalPartitionPattern = entity.IncrementalPartitionPatterns.Add(incrementalPartitionPatternName);

            var copy = entity.Copy() as CdmLocalEntityDeclarationDefinition;
            copy.DataPartitions[0].Name = "newDataPartitionName";
            copy.DataPartitionPatterns[0].Name = "newDataPartitionPatternName";
            copy.IncrementalPartitions[0].Name = "newIncrementalPartition";
            copy.IncrementalPartitionPatterns[0].Name = "newIncrementalPartitionPatterns";

            Assert.AreEqual(dataPartitionName, dataPartition.Name);
            Assert.AreEqual(dataPartitionPatternName, dataPartitionPattern.Name);
            Assert.AreEqual(incrementalPartitionName, incrementalPartition.Name);
            Assert.AreEqual(incrementalPartitionPatternName, incrementalPartitionPattern.Name);
        }
    }
}
