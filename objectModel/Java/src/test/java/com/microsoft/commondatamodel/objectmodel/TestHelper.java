package com.microsoft.commondatamodel.objectmodel;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;

public class TestHelper {

  /**
   * The path of the TestDataFolder.
   * Here will be found input files and expected output files used by tests.
   */
  public static final String TEST_DATA_PATH = "src/test/java/com/microsoft/commondatamodel/objectmodel/testdata";
  private static Logger LOGGER = LoggerFactory.getLogger(TestHelper.class);

  /**
   * Whether tests should write debugging files or not.
   */
  public static final boolean doesWriteTestDebuggingFiles = false;

  /**
   * Gets the input folder path associated with specified test.
   *
   * @param testSubpath The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this path is associated with.
   * @return Input folder path.
   */
  public static String getInputFolderPath(final String testSubpath, final String testName) throws InterruptedException {
    return getTestFolderPath(testSubpath, testName, TestHelper.TestFolders.Input);
  }

  /**
   * Gets the expected output folder path associated with specified test.
   *
   * @param testSubpath The subpath of the tes`t. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this path is associated with.
   * @return Expected Output folder path.
   */
  public static String getExpectedOutputFolderPath(final String testSubpath, final String testName) throws InterruptedException {
    return getTestFolderPath(testSubpath, testName, TestHelper.TestFolders.ExpectedOutput);
  }

  /**
   * Gets the actual output folder path associated with specified test.
   *
   * @param testSubpath The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this path is associated with.
   * @return
   */
  public static String getActualOutputFolderPath(final String testSubpath, final String testName) throws InterruptedException {
    return getTestFolderPath(testSubpath, testName, TestHelper.TestFolders.ActualOutput);
  }

  /**
   * Gets the content of an input file for a particular test.
   *
   * @param testSubpath The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this file is an expected output for.
   * @param fileName    The name of the file to be read.
   * @return The content of the file
   */
  public static String getInputFileContent(final String testSubpath, final String testName, final String fileName)
          throws IOException, InterruptedException {
    final String pathOfInputFolder = getInputFolderPath(testSubpath, testName);

    final String pathOfInputFile = new File(pathOfInputFolder, fileName).toString();
    Assert.assertTrue(new File(pathOfInputFile).exists(),
            String.format("Was unable to find the input file for test %s, file name = %s", testName, fileName));

    return FileReadWriteUtil.readFileToString(pathOfInputFile);
  }

  /**
   * Gets the content of an expected output file for a particular test.
   *
   * @param testSubpath The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this file is an expected output for.
   * @param fileName    The name of the file to be read.
   * @return The content of the file
   */
  public static String getExpectedOutputFileContent(final String testSubpath, final String testName, final String fileName)
          throws IOException, InterruptedException {
    final String pathOfExpectedOutputFolder = getExpectedOutputFolderPath(testSubpath, testName);
    final File pathOfExpectedOutputFile = new File(new File(pathOfExpectedOutputFolder), fileName);

    Assert.assertTrue(pathOfExpectedOutputFile.exists(),
            String.format("Was unable to find the output file for test %s, file name = %s", testName, fileName));

    return FileReadWriteUtil.readFileToString(pathOfExpectedOutputFile.toString());
  }

  /**
   * Writes an actual output file used to debug a test.
   *
   * @param testSubpath The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this file is an expected output for.
   * @param fileName    The name of the file to be read.
   * @param fileContent The content of the file to be written.
   */
  public static void writeActualOutputFileContent(final String testSubpath, final String testName, final String fileName,
                                                  final String fileContent) throws IOException, InterruptedException {
    final String pathOfActualOutputFolder = getActualOutputFolderPath(testSubpath, testName);
    final String pathOfActualOutputFile = new File(pathOfActualOutputFolder, fileName).toString();

    FileReadWriteUtil.writeStringToFile(pathOfActualOutputFile, fileContent);
  }

  /**
   * Asserts two strings representing file content are equal. It ignores differences in line ending.
   *
   * @param expected String representing expected file content.
   * @param actual   String representing actual file content.
   */
  public static void assertFileContentEquality(String expected, String actual) {
    expected = expected.replace("\r\n", "\n");
    actual = actual.replace("\r\n", "\n");
    Assert.assertEquals(expected, actual);
  }

  private static boolean compareObjectsContent(final Object expected, final Object actual) {
    return compareObjectsContent(expected, actual, false);
  }

  private static boolean compareObjectsContent(final Object expected, final Object actual, final boolean logError) {
    if (Objects.equals(actual, expected)) {
      return true;
    }

    if (expected == null || actual == null) {
      if (expected == null && actual == null) {
        return true;
      }
      if (logError) {
        LOGGER.error("Objects do not match. Expected = '{}', actual = '{}'", expected, actual);
      }
      return false;
    }

    if (expected instanceof String && actual instanceof String) {
      final String expectedString = (String) expected;
      final String actualString = (String) actual;

      if (Strings.isNullOrEmpty(expectedString) && Strings.isNullOrEmpty(actualString)) {
        return true;
      }
      if (expectedString.equals(actualString)) {
        return true;
      }

      try {
        final OffsetDateTime expectedDate = OffsetDateTime.parse(expectedString);
        final OffsetDateTime actualDate = OffsetDateTime.parse(actualString);

        if (expectedDate != actualDate && logError) {
          LOGGER.error("DateTime did not match. Expected '{}', found '{}'", expectedString, actualString);
        }

        return expectedDate.equals(actualDate);
      } catch (final Exception e) {
        return false;
      }
    }

    if (!(expected instanceof JsonNode) && !(actual instanceof JsonNode)) {
      return expected.equals(actual);
    }

    final JsonNode expectedJsonNode = (JsonNode) expected;
    final JsonNode actualJsonNode = (JsonNode) actual;

    if (expectedJsonNode.isValueNode() && actualJsonNode.isValueNode()) {
      return compareObjectsContent(expectedJsonNode.asText(), actualJsonNode.asText(), logError);
    }

    if (expectedJsonNode.isArray() && actualJsonNode.isArray()) {
      while (expectedJsonNode.size() != 0 && actualJsonNode.size() != 0) {
        final int indexInExpected = expectedJsonNode.size() - 1;
        boolean found = false;
        for (int indexInActual = actualJsonNode.size() - 1; indexInActual >= 0; indexInActual--) {
          if (compareObjectsContent(expectedJsonNode.get(indexInExpected), actualJsonNode.get(indexInActual))) {
            ((ArrayNode) expectedJsonNode).remove(indexInExpected);
            ((ArrayNode) actualJsonNode).remove(indexInActual);
            found = true;
            break;
          }
        }

        if (!found) {
          return false;
        }
      }

      if (expectedJsonNode.size() != 0) {
        if (logError) {
          LOGGER.error("Arrays do not match. Found list member in expected but not in actual : '{}'",
                  expectedJsonNode.get(0));
        }

        return false;
      }

      if (actualJsonNode.size() != 0) {
        if (logError) {
          LOGGER.error("Arrays do not match. Found list member in actual but not in expected: '{}'",
                  actualJsonNode.get(0));
        }

        return false;
      }

      return true;
    }

    if (expectedJsonNode.isObject() && actualJsonNode.isObject()) {
      final Iterator<Map.Entry<String, JsonNode>> expectedFields = expectedJsonNode.fields();
      while (expectedFields.hasNext()) {
        final Map.Entry<String, JsonNode> expectedField = expectedFields.next();
        final boolean foundProperty = compareObjectsContent(
                expectedJsonNode.get(expectedField.getKey()),
                actualJsonNode.get(expectedField.getKey()), logError);
        if (!foundProperty) {
          if (logError) {
            LOGGER.error("Value does not match for property '{}'", expectedField.getKey());
          }

          return false;
        }
      }

      final Iterator<Map.Entry<String, JsonNode>> actualFields = actualJsonNode.fields();
      while (actualFields.hasNext()) {
        final Map.Entry<String, JsonNode> actualField = actualFields.next();
        // if expectedJsonNode.get(actualField.getKey()) is not null, equality with actualJsonNode.get(...) was checked in previous for.
        if (actualJsonNode.get(actualField.getKey()) != null && expectedJsonNode.get(actualField.getKey()) == null) {
          if (logError) {
            LOGGER.error("Value does not match for property '{}'", actualField.getKey());
          }

          return false;
        }
      }

      return true;
    }

    return false;
  }

  public static void assertSameObjectWasSerialized(final String expected, final String actual) throws IOException {
    final JsonNode deserializedExpected = JMapper.MAP.readTree(expected);
    final JsonNode deserializedActual = JMapper.MAP.readTree(actual);

    final boolean areEqual = compareObjectsContent(deserializedExpected, deserializedActual, true);
    Assert.assertTrue(areEqual);
  }

  /**
   * Enumerates relevant folders that a test can have associated.
   */
  private enum TestFolders {
    Input,
    ExpectedOutput,
    ActualOutput
  }

  /**
   * Gets the path of the folder used by the test.
   *
   * @param testSubpath The name of test currently running that will used created path.
   * @param testName
   * @param use         Whether the path is for Input, Expected Output or ActualOutput.
   * @return
   */
  private static String getTestFolderPath(final String testSubpath, final String testName, final TestHelper.TestFolders use)
          throws InterruptedException {
    final String folderName = use.name();
    final String testFolderPath = new File(new File(new File(TEST_DATA_PATH, testSubpath), testName), folderName).toString();
    final File folder = new File(testFolderPath);

    if (use == TestFolders.ActualOutput && !folder.exists()) {
      folder.mkdirs();
      while (!folder.exists()) {
        TimeUnit.MINUTES.sleep(5);
      }
    }

    Assert.assertTrue(folder.exists(), "Was unable to find directory " + testFolderPath);
    return testFolderPath;
  }
}
