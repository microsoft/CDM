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
        /// Whether tests should write debugging files or not.
        /// </summary>
        public const bool DoesWriteTestDebuggingFiles = false;

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
                catch (Exception ex)
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

            Assert.IsTrue(Directory.Exists(testFolderPath), $"Was unable to find directory {testFolderPath}");
            return testFolderPath;
        }
    }
}