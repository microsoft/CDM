// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;


    /// <summary>
    /// Set of tests to verify behavior of loading a document with different semantic versions.
    /// </summary>
    [TestClass]
    public class JsonSemanticVersionTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "JsonSemanticVersionTest");

        /// <summary>
        /// Test loading a document with a semantic version bigger than the one supported.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestLoadingUnsupportedVersion()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestLoadingUnsupportedVersion");
            var errorCount = 0;

            // Test loading a resolved document.
            corpus.SetEventCallback(new EventCallback()
            {
                Invoke = (level, message) =>
                {
                    if (message.Contains("This ObjectModel version supports json semantic version") && level == CdmStatusLevel.Warning)
                    {
                        errorCount++;
                    }
                }
            }, CdmStatusLevel.Warning);
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/resolvedDoc.cdm.json");
            if (errorCount != 1)
            {
                Assert.Fail("Should have logged a warning.");
            }
            errorCount = 0;

            // Test loading a logical document.
            corpus.SetEventCallback(new EventCallback()
            {
                Invoke = (level, message) =>
                {
                    if (message.Contains("This ObjectModel version supports json semantic version") && level == CdmStatusLevel.Error)
                    {
                        errorCount++;
                    }
                }
            }, CdmStatusLevel.Error);
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/logicalDoc.cdm.json");
            if (errorCount != 1)
            {
                Assert.Fail("Should have logged an error.");
            }
            errorCount = 0;

            // Test loading a document missing the jsonSemanticVersion property.
            corpus.SetEventCallback(new EventCallback()
            {
                Invoke = (level, message) =>
                {
                    if (message.Contains("jsonSemanticVersion is a required property of a document.") && level == CdmStatusLevel.Warning)
                    {
                        errorCount++;
                    }
                }
            }, CdmStatusLevel.Warning);
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/missingDoc.cdm.json");
            if (errorCount != 1)
            {
                Assert.Fail("Should have logged a warning for missing property.");
            }
        }

        /// <summary>
        /// Test loading a document with an invalid semantic version.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestLoadingInvalidVersion()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestLoadingInvalidVersion");
            var errorCount = 0;

            corpus.SetEventCallback(new EventCallback()
            {
                Invoke = (level, message) =>
                {
                    if (message.Contains("jsonSemanticVersion must be set using the format <major>.<minor>.<patch>.") && level == CdmStatusLevel.Warning)
                    {
                        errorCount++;
                    }
                }
            }, CdmStatusLevel.Warning);

            // Test loading a version format "a.0.0".
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/invalidVersionDoc.cdm.json");
            if (errorCount != 1)
            {
                Assert.Fail("Should have logged a warning.");
            }
            errorCount = 0;

            // Test loading a version format "1.0".
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/invalidFormatDoc.cdm.json");
            if (errorCount != 1)
            {
                Assert.Fail("Should have logged a warning.");
            }
            errorCount = 0;
        }
    }
}
