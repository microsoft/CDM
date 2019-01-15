// <copyright file="CloneTests.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests
{
    using Microsoft.CdmFolders.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Tests for cloning operation
    /// </summary>
    [TestClass]
    [TestCategory(nameof(CloneTests))]
    public class CloneTests
    {
        /// <summary>
        /// CdsaObjectModel - CopyFrom
        /// </summary>
        [TestMethod]
        public void ObjectModel_PartitionClone()
        {
            Partition partition = CdmFolderTestsHelper.GeneratePartition(0, 2);
            Partition emptyPartition = new Partition();
            emptyPartition = (Partition)partition.Clone();
            Assert.AreEqual(partition.Name, emptyPartition.Name);
            Assert.AreEqual(partition.Description, emptyPartition.Description);
            Assert.AreEqual(partition.Location, emptyPartition.Location);
            Assert.AreNotSame(partition.Location, emptyPartition.Location);
        }
    }
}
