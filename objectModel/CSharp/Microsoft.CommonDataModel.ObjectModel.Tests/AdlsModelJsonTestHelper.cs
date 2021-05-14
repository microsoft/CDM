// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    /// <summary>
    /// Class for ADLS based model.json tests.
    /// </summary>
    public static class AdlsModelJsonTestHelper
    {
        public static readonly string actualFolderName = "Actual";
        public static readonly string expectedFolderName = "Expected";
        public static readonly string inputFolderName = "Input";

        private static readonly string hostnamePlaceholder = "<HOSTNAME>";
        private static readonly string rootPathPlaceholder = "/<ROOTPATH>";
        
        public static string GetActualSubFolderPath(string testSubPath, string testName, string subFolderName)
        {
            return Path.Combine(TestHelper.GetActualOutputFolderPath(testSubPath, testName), subFolderName);
        }

        public static string GetExpectedFileContent(string testSubPath, string testName, string fileName)
        {
            return File.ReadAllText(Path.Combine(TestHelper.GetActualOutputFolderPath(testSubPath, testName), expectedFolderName, fileName));
        }

        public static void SaveModelJsonToActualOutput(string testSubPath, string testName, string fileName, string content)
        {
            string actualFolderPath = GetActualSubFolderPath(testSubPath, testName, actualFolderName);
            if (!Directory.Exists(actualFolderPath))
            {
                Directory.CreateDirectory(actualFolderPath);
            }

            File.WriteAllText(
                 Path.Combine(actualFolderPath, fileName),
                 content);
        }

        public static void UpdateInputAndExpectedAndSaveToActualSubFolder(string testSubPath, string testName, string rootRelativePath, string fileName, string stringToAddSuffix, string suffix)
        {
            // Prepare the root path.
            string rootPath = Environment.GetEnvironmentVariable("ADLS_ROOTPATH");
            rootPath = AdlsTestHelper.GetFullRootPath(rootPath, rootRelativePath);

            if (!rootPath.StartsWith("/"))
            {
                rootPath = $"/{rootPath}";
            }

            if (rootPath.EndsWith("/"))
            {
                rootPath = rootPath.Substring(0, rootPath.Length - 1);
            }

            rootPath = Uri.EscapeDataString(rootPath).Replace("%2F", "/");

            // Update input content and save to ActualOutput/Input
            string inputContent = TestHelper.GetInputFileContent(testSubPath, testName, fileName);
            inputContent = ReplacePlaceholder(inputContent, rootPath, stringToAddSuffix, suffix);

            string inputFolderPath = GetActualSubFolderPath(testSubPath, testName, inputFolderName);

            if (!Directory.Exists(inputFolderPath))
            {
                Directory.CreateDirectory(inputFolderPath);
            }

            File.WriteAllText(
                 Path.Combine(inputFolderPath, fileName),
                 inputContent);

            // Update expected content and save to ActualOutput/Expected
            string expectedContent = TestHelper.GetExpectedOutputFileContent(testSubPath, testName, fileName);
            expectedContent = ReplacePlaceholder(expectedContent, rootPath, stringToAddSuffix, suffix);

            string expectedFolderPath = GetActualSubFolderPath(testSubPath, testName, expectedFolderName);

            if (!Directory.Exists(expectedFolderPath))
            {
                Directory.CreateDirectory(expectedFolderPath);
            }

            File.WriteAllText(
                 Path.Combine(expectedFolderPath, fileName),
                 expectedContent);
        }

        private static string ReplacePlaceholder(string content, string root, string stringToAddSuffix, string suffix)
        {
            content = content.Replace(hostnamePlaceholder, Environment.GetEnvironmentVariable("ADLS_HOSTNAME"));
            content = content.Replace(rootPathPlaceholder, root);
            content = content.Replace(stringToAddSuffix, $"{stringToAddSuffix}-{suffix}");
            return content;
        }
    }
}
