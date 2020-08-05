// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class StorageManagerTests
    {
        /// <summary>
        /// Tests if CreateAbsoluteCorpusPath works correctly when provided with a path that contains a colon character.
        /// </summary>
        [TestMethod]
        public void TestCreateAbsoluteCorpusPathWithColon()
        {
            var corpus = new CdmCorpusDefinition();
            var folder = corpus.Storage.FetchRootFolder("local");

            var absoluteNamespace = "namespace:/";
            var fileName = "dataPartition.csv@snapshot=2020-05-10T02:47:46.0039374Z";
            var subFolderPath = "some/sub/folder:with::colon/";

            // Cases where the path provided is relative.
            Assert.AreEqual($"local:/{fileName}", corpus.Storage.CreateAbsoluteCorpusPath(fileName, folder));
            Assert.AreEqual($"local:/{subFolderPath}{fileName}", corpus.Storage.CreateAbsoluteCorpusPath($"{subFolderPath}{fileName}", folder));

            // Cases where the path provided is absolute.
            Assert.AreEqual($"{absoluteNamespace}{fileName}", corpus.Storage.CreateAbsoluteCorpusPath($"{absoluteNamespace}{fileName}", folder));
            Assert.AreEqual($"{absoluteNamespace}{subFolderPath}{fileName}", corpus.Storage.CreateAbsoluteCorpusPath($"{absoluteNamespace}{subFolderPath}{fileName}", folder));
        }
    }
}
