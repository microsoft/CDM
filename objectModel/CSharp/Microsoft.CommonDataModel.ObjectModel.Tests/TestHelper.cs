// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using Microsoft.CommonDataModel.Tools.Processor;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    /// <summary>
    /// Class containing constants used by test files.
    /// </summary>
    public static class TestHelper
    {
        /// <summary>
        /// The path of the TestDataFolder.
        /// Here will be found input files and expected output files used by tests
        /// </summary>
        public const string TestDataPath = "../../../TestData";

        /// <summary>
        /// The path of the sample schema documents folder.
        /// </summary>
        public const string SampleSchemaFolderPath = "../../../../../../samples/example-public-standards";

        /// <summary>
        /// The path of the CDM Schema Documents Folder.
        /// </summary>
        public const string SchemaDocumentsPath = "../../../../../../schemaDocuments";

        /// <summary>
        /// The adapter path to the top-level manifest in the CDM Schema Documents folder. Used by tests where we resolve the corpus.
        /// This path is temporarily pointing to the applicationCommon manifest instead of standards due to performance issues when resolving
        /// the entire set of CDM standard schemas, after 8000+ F&O entities were added.
        /// </summary>
        public const string CdmStandardSchemaPath = "local:/core/applicationCommon/applicationCommon.manifest.cdm.json";

        /// <summary>
        /// Gets the input folder path associated with specified test.
        /// </summary>
        /// <param name="testSubpath">The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}</param>
        /// <param name="testName">The name of the test this path is associated with.</param>
        /// <returns>Input folder path.</returns>
        public static string GetInputFolderPath(string testSubpath, string testName)
        {
            return GetTestFolderPath(testSubpath, testName, TestHelper.TestFolders.Input);
        }

        /// <summary>
        /// Gets the expected output folder path associated with specified test.
        /// </summary>
        /// <param name="testSubpath">The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}</param>
        /// <param name="testName">The name of the test this path is associated with.</param>
        /// <returns>Expected Output folder path.</returns>
        public static string GetExpectedOutputFolderPath(string testSubpath, string testName)
        {
            return GetTestFolderPath(testSubpath, testName, TestHelper.TestFolders.ExpectedOutput);
        }

        /// <summary>
        /// Gets the actual output folder path associated with specified test.
        /// </summary>
        /// <param name="testSubpath">The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}</param>
        /// <param name="testName">The name of the test this path is associated with.</param>
        /// <returns></returns>
        public static string GetActualOutputFolderPath(string testSubpath, string testName)
        {
            return GetTestFolderPath(testSubpath, testName, TestHelper.TestFolders.ActualOutput);
        }

        /// <summary>
        /// Gets the content of an input file for a particular test.
        /// </summary>
        /// <param name="testSubpath">The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}</param>
        /// <param name="testName">The name of the test this file is an expected output for.</param>
        /// <param name="fileName">The name of the file to be read.</param>
        /// <returns>The content of the file</returns>
        public static string GetInputFileContent(string testSubpath, string testName, string fileName)
        {
            var pathOfInputFolder = GetInputFolderPath(testSubpath, testName);

            var pathOfInputFile = Path.Combine(pathOfInputFolder, fileName);
            Assert.IsTrue(File.Exists(pathOfInputFile),
                $"Was unable to find the input file for test {testName}, file name = {fileName}");

            return File.ReadAllText(pathOfInputFile);
        }

        /// <summary>
        /// Gets the content of an expected output file for a particular test.
        /// </summary>
        /// <param name="testSubpath">The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}</param>
        /// <param name="testName">The name of the test this file is an expected output for.</param>
        /// <param name="fileName">The name of the file to be read.</param>
        /// <returns>The content of the file</returns>
        public static string GetExpectedOutputFileContent(string testSubpath, string testName, string fileName)
        {
            var pathOfExpectedOutputFolder = GetExpectedOutputFolderPath(testSubpath, testName);

            var pathOfExpectedOutputFile = Path.Combine(pathOfExpectedOutputFolder, fileName);
            Assert.IsTrue(File.Exists(pathOfExpectedOutputFile),
                $"Was unable to find the expected output file for test {testName}, file name = {fileName}");

            return File.ReadAllText(pathOfExpectedOutputFile);
        }

        /// <summary>
        /// Writes the content of an expected output file for a particular test.
        /// </summary>
        /// <param name="testSubpath">The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}</param>
        /// <param name="testName">The name of the test this file is an expected output for.</param>
        /// <param name="fileName">The name of the file to be read.</param>
        /// <param name="fileContent">The content of the file to be written.</param>
        /// <returns>The content of the file</returns>
        public static void WriteExpectedOutputFileContent(string testSubpath, string testName, string fileName, string fileContent)
        {
            var pathOfExpectedOutputFolder = GetExpectedOutputFolderPath(testSubpath, testName);

            var pathOfExpectedOutputFile = Path.Combine(pathOfExpectedOutputFolder, fileName);
            Assert.IsTrue(File.Exists(pathOfExpectedOutputFile),
                $"Was unable to find the expected output file for test {testName}, file name = {fileName}");

            File.WriteAllText(pathOfExpectedOutputFile, fileContent);
        }

        public static CdmCorpusDefinition GetLocalCorpus(string testSubpath, string testName, string testInputDir = null)
        {
            testInputDir = testInputDir ?? GetInputFolderPath(testSubpath, testName);
            var testOutputDir = GetActualOutputFolderPath(testSubpath, testName);

            var corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.DefaultNamespace = "local";

            corpus.Storage.Mount("local", new LocalAdapter(testInputDir));
            corpus.Storage.Mount("output", new LocalAdapter(testOutputDir));
            corpus.Storage.Mount("cdm", new LocalAdapter(SchemaDocumentsPath));
            corpus.Storage.Mount("remote", new RemoteAdapter()
            {
                Hosts = new Dictionary<string, string>()
                {
                    { "contoso", "http://contoso.com" }
                }
            });

            return corpus;
        }

        /// <summary>
        /// Writes an actual output file used to debug a test.
        /// </summary>
        /// <param name="testSubpath">The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}</param>
        /// <param name="testName">The name of the test this file is an expected output for.</param>
        /// <param name="fileName">The name of the file to be read.</param>
        /// <param name="fileContent">The content of the file to be written.</param>
        public static void WriteActualOutputFileContent(string testSubpath, string testName, string fileName, string fileContent)
        {
            var pathOfActualOutputFolder = GetActualOutputFolderPath(testSubpath, testName);
            var pathOfActualOutputFile = Path.Combine(pathOfActualOutputFolder, fileName);

            File.WriteAllText(pathOfActualOutputFile, fileContent);
        }

        /// <summary>
        /// Asserts two strings representing file content are equal. It ignores differences in line ending.
        /// </summary>
        /// <param name="expected">String representing expected file content.</param>
        /// <param name="actual">String representing actual file content.</param>
        public static void AssertFileContentEquality(string expected, string actual)
        {
            expected = expected.Replace("\r\n", "\n");
            actual = actual.Replace("\r\n", "\n");
            Assert.AreEqual(expected, actual);
        }

        /// <summary>
        /// Asserts the files in actualFolderPath and their content are the same as the files in expectedFolderPath.
        /// </summary>
        /// <param name="expectedFolderPath">The expected output folder path.</param>
        /// <param name="actualFolderPath">The actual output folder path.</param>
        public static void AssertFolderFilesEquality(string expectedFolderPath, string actualFolderPath)
        {
            var expectedFilePaths = Directory.GetFiles(expectedFolderPath);
            Assert.AreEqual(
                expectedFilePaths.Length,
                Directory.GetFiles(actualFolderPath).Length,
                String.Format("The number of files in actual directory {0} is different.", actualFolderPath));

            foreach (var expectedFilePath in expectedFilePaths)
            {
                var expectedFilename = Path.GetRelativePath(expectedFolderPath, expectedFilePath);
                var actualFilePath = Path.Combine(actualFolderPath, expectedFilename);
                var expectedFileContent = File.ReadAllText(expectedFilePath);
                var actualFileContent = File.ReadAllText(actualFilePath);
                AssertFileContentEquality(expectedFileContent, actualFileContent);
            }

            var expectedSubFolders = Directory.GetDirectories(expectedFolderPath);
            foreach (var expectedSubFolderPath in expectedSubFolders)
            {
                var expectedSubFolderName = Path.GetRelativePath(expectedFolderPath, expectedSubFolderPath);
                var actualSubFolderPath = Path.Combine(actualFolderPath, expectedSubFolderName);
                AssertFolderFilesEquality(expectedSubFolderPath, actualSubFolderPath);
            }
        }

        /// <summary>
        /// Asserts in logcode, if expected log code is not in log codes recorded list.
        /// </summary>
        /// <param name="corpus">The corpus object.</param>
        /// <param name="expectedcode">The expectedcode cdmlogcode.</param>
        public static void AssertCdmLogCodeEquality(CdmCorpusDefinition corpus, CdmLogCode expectedCode)
        {
            bool toAssert = false;
            corpus.Ctx.Events.ForEach(logEntry =>
            {
                if ( ((expectedCode.ToString().StartsWith("Warn") && logEntry["level"].Equals(CdmStatusLevel.Warning.ToString()))
                     || (expectedCode.ToString().StartsWith("Err") && logEntry["level"].Equals(CdmStatusLevel.Error.ToString())))
                    && logEntry["code"].Equals(expectedCode.ToString()))
                {
                    toAssert = true;
                }
            });
            Assert.IsTrue(toAssert, $"The recorded log events should have contained message with log code {expectedCode} of appropriate level");
        }
        public static bool CompareObjectsContent(object expected, object actual, bool logError = false)
        {
            if (expected == actual)
            {
                return true;
            }
            if (expected == null || actual == null)
            {
                if (expected == null && actual == null)
                {
                    return true;
                }
                if (logError)
                {
                    Console.WriteLine($"Objects do not match. Expected = {expected}, actual = {actual}");
                }
                return false;
            }
            if (expected is string expectedString && actual is string actualString)
            {
                if (string.IsNullOrEmpty(expectedString) && string.IsNullOrEmpty(actualString))
                {
                    return true;
                }
                if (string.Equals(expectedString, actualString))
                {
                    return true;
                }

                try
                {
                    var expectedDate = DateTime.Parse(expectedString);
                    var actualDate = DateTime.Parse(actualString);
                    if (expectedDate != actualDate && logError)
                    {
                        Console.WriteLine($"DateTime did not match. Expected {expectedString}, found {actualString}");
                    }

                    return expectedDate == actualDate;
                }
                catch (Exception)
                {
                    Console.WriteLine($"Strings did not match. Expected = {expectedString} , Actual = {actualString}");
                    return false;
                }
            }
            if (!(expected is JToken) && !(actual is JToken))
            {
                return Object.Equals(expected, actual);
            }
            if (expected is JValue expectedValue && actual is JValue actualValue)
            {
                return CompareObjectsContent(expectedValue.Value, actualValue.Value, logError);
            }
            if (expected is JArray expectedArray && actual is JArray actualArray)
            {
                var expectedList = new List<JToken>(expectedArray.ToArray());
                var actualList = new List<JToken>(actualArray.ToArray());

                while (expectedList.Any() && actualList.Any())
                {
                    var indexInExpected = expectedList.Count() - 1;
                    bool found = false;
                    for (int indexInActual = actualList.Count() - 1; indexInActual >= 0; indexInActual--)
                    {
                        if (CompareObjectsContent(expectedList[indexInExpected], actualList[indexInActual]))
                        {
                            expectedList.RemoveRange(indexInExpected, 1);
                            actualList.RemoveRange(indexInActual, 1);
                            found = true;
                            break;
                        }
                    }

                    if (!found)
                    {
                        if (logError)
                        {
                            Console.WriteLine($"Arrays do not match. Found list member in expected but not in actual : {expectedList[indexInExpected]}");
                        }
                        return false;
                    }
                }

                if (expectedList.Any())
                {
                    if (logError)
                    {
                        Console.WriteLine($"Arrays do not match. Found list member in expected but not in actual : {expectedList.First()}");
                    }

                    return false;
                }

                if (actualList.Any())
                {
                    if (logError)
                    {
                        Console.WriteLine($"Arrays do not match. Found list member in actual but not in expected: {actualList.First()}");
                    }

                    return false;
                }

                return true;
            }
            if (expected is JObject expectedObject && actual is JObject actualObject)
            {
                bool foundProperty;
                foreach (JProperty property in expectedObject.Properties())
                {
                    foundProperty = CompareObjectsContent(expectedObject[property.Name], actualObject[property.Name], logError);
                    if (!foundProperty)
                    {
                        if (logError)
                        {
                            Console.WriteLine($"Value does not match for property {property.Name}");
                        }

                        return false;
                    }
                }

                foreach (JProperty property in actualObject.Properties())
                {
                    // if expectedOutput[proprety.Name] is not null, equality with actualObject[...] was checked in previous for.
                    if (actualObject[property.Name] != null && expectedObject[property.Name] == null)
                    {
                        if (logError)
                        {
                            Console.WriteLine($"Value does not match for property {property.Name}");
                        }

                        return false;
                    }
                }

                return true;
            }

            if (logError)
            {
                Console.WriteLine("Was unable to compare objects.");
                Console.WriteLine($"Expected = {expected}");
                Console.WriteLine($"Actual = {actual}");
            }

            return false;
        }

        /// <summary>
        /// Copy files from inputFolderPath to actualFolderPath.
        /// </summary>
        /// <param name="testSubPath">Test sub path.</param>
        /// <param name="testName">Test name.</param>
        public static void CopyFilesFromInputToActualOutput(string testSubPath, string testName)
        {
            CopyFilesFromInputToActualOutputHelper(
                TestHelper.GetInputFolderPath(testSubPath, testName),
                TestHelper.GetActualOutputFolderPath(testSubPath, testName));
        }

        /// <summary>
        /// Helper function to copy files from inputFolderPath to actualFolderPath recursively.
        /// </summary>
        /// <param name="inputFolderPath">Input folder path.</param>
        /// <param name="actualFolderPath">Actual folder path.</param>
        private static void CopyFilesFromInputToActualOutputHelper(string inputFolderPath, string actualFolderPath)
        {
            var inputFilePaths = Directory.GetFiles(inputFolderPath);

            foreach (var inputFilePath in inputFilePaths)
            {
                var inputFilename = Path.GetRelativePath(inputFolderPath, inputFilePath);
                var actualFilePath = Path.Combine(actualFolderPath, inputFilename);

                File.Copy(inputFilePath, actualFilePath, true);
            }

            var inputSubFolders = Directory.GetDirectories(inputFolderPath);
            foreach (var inputSubFolderPath in inputSubFolders)
            {
                var inputSubFolderName = Path.GetRelativePath(inputFolderPath, inputSubFolderPath);
                var actualSubFolderPath = Path.Combine(actualFolderPath, inputSubFolderName);

                Directory.CreateDirectory(actualSubFolderPath);
                CopyFilesFromInputToActualOutputHelper(inputSubFolderPath, actualSubFolderPath);
            }
        }

        /// <summary>
        /// Delete files in actual output directory if exists.
        /// </summary>
        /// <param name="actualOutputFolderPath">The actual output folder path.</param>
        public static void DeleteFilesFromActualOutput(string actualOutputFolderPath)
        {
            foreach (var file in Directory.GetFiles(actualOutputFolderPath))
            {
                File.Delete(file);
            }

            foreach (var directory in Directory.GetDirectories(actualOutputFolderPath))
            {
                DeleteFilesFromActualOutput(directory);
                Directory.Delete(directory);
            }
        }

        public static void AssertSameObjectWasSerialized(string expected, string actual)
        {
            JToken deserializedExpected = JToken.Parse(expected);
            JToken deserializedActual = JToken.Parse(actual);

            var areEqual = CompareObjectsContent(deserializedExpected, deserializedActual, true);
            Assert.IsTrue(areEqual);
        }

        /// <summary>
        /// Enumerates relevant folders that a test can have associated.
        /// </summary>
        private enum TestFolders
        {
            Input,
            ExpectedOutput,
            ActualOutput
        }

        /// <summary>
        /// Gets the path of the folder used by the test.
        /// </summary>
        /// <param name="testName">The name of test currently runnig that will used created path.</param>
        /// <param name="use">Whether the path is for Input, Expected Output or ActualOutput.</param>
        /// <returns></returns>
        private static string GetTestFolderPath(string testSubpath, string testName, TestHelper.TestFolders use)
        {
            string folderName = Enum.GetName(typeof(TestHelper.TestFolders), use);

            string testFolderPath = Path.Combine(TestDataPath, testSubpath, testName, folderName);

            if (use == TestHelper.TestFolders.ActualOutput && !Directory.Exists(testFolderPath))
            {
                Directory.CreateDirectory(testFolderPath);
                while (!Directory.Exists(testFolderPath))
                {
                    System.Threading.Thread.Sleep(50);
                }
            }

            //Assert.IsTrue(Directory.Exists(testFolderPath), $"Was unable to find directory {testFolderPath}");
            return testFolderPath;
        }
    }
}
