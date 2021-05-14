// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.FolderDefinition
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class FolderDefinitionTests
    {
        /// <summary>
        /// Tests the behavior of the FetchChildFolderFromPath function.
        /// </summary>
        [TestMethod]
        public void TestFetchChildFolderFromPath()
        {
            var corpus = new CdmCorpusDefinition();
            var rootFolder = new CdmFolderDefinition(corpus.Ctx, "");

            var folderPath = "/";
            var childFolder = rootFolder.FetchChildFolderFromPath(folderPath, false);
            Assert.AreEqual(folderPath, childFolder.FolderPath);

            folderPath = "/";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, true);
            Assert.AreEqual(folderPath, childFolder.FolderPath);

            folderPath = "/core";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, false);
            Assert.AreEqual("/", childFolder.FolderPath);

            folderPath = "/core";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, true);
            Assert.AreEqual($"{folderPath}/", childFolder.FolderPath);

            folderPath = "/core/";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, false);
            Assert.AreEqual(folderPath, childFolder.FolderPath);

            folderPath = "/core/";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, true);
            Assert.AreEqual(folderPath, childFolder.FolderPath);

            folderPath = "/core/applicationCommon";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, false);
            Assert.AreEqual("/core/", childFolder.FolderPath);

            folderPath = "/core/applicationCommon";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, true);
            Assert.AreEqual($"{folderPath}/", childFolder.FolderPath);

            folderPath = "/core/applicationCommon/";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, false);
            Assert.AreEqual(folderPath, childFolder.FolderPath);

            folderPath = "/core/applicationCommon/";
            childFolder = rootFolder.FetchChildFolderFromPath(folderPath, true);
            Assert.AreEqual(folderPath, childFolder.FolderPath);
        }
    }
}
