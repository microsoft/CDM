// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.RemoteAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;

import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.EventList;
import org.testng.Assert;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

public class TestHelper {

  /**
   * The path of the TestDataFolder.
   * Here will be found input files and expected output files used by tests.
   */
  public static final String TEST_DATA_PATH = "../../TestData";

  private static final String LOCAL = "local";
  private static final String CDM = "cdm";
  private static final String CONTOSO = "contoso";
  private static final String HTTP_CONTOSO_COM = "http://contoso.com";
  private static final String REMOTE = "remote";
  private static final String OUTPUT = "output";

  /**
   * The path of the sample schema documents folder.
   */
  public static final String SAMPLE_SCHEMA_FOLDER_PATH = "../../../samples/example-public-standards";

  /**
   * The path of the CDM Schema Documents Folder.
   */
  public static final String SCHEMA_DOCS_ROOT = "../../../schemaDocuments";

  /**
   * The log codes that are allowed to be logged without failing the test
   */
  private static HashSet<String> ignoredLogCodes = new HashSet<>(
          Collections.singletonList(CdmLogCode.WarnDeprecatedResolutionGuidance.name())
  );

  /**
   * The adapter path to the top-level manifest in the CDM Schema Documents folder. Used by tests where we resolve the corpus.
   * This path is temporarily pointing to the applicationCommon manifest instead of standards due to performance issues when resolving
   * the entire set of CDM standard schemas, after 8000+ F&O entities were added.
   */
  public static final String CDM_STANDARDS_SCHEMA_PATH = "local:/core/applicationCommon/applicationCommon.manifest.cdm.json";

  public static String getInputFolderPath(final String testSubpath, final String testName) throws InterruptedException {
    return getInputFolderPath(testSubpath, testName, false);
  }

  /**
   * Gets the input folder path associated with specified test.
   *
   * @param testSubpath The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this path is associated with.
   * @return Input folder path.
   */
  public static String getInputFolderPath(final String testSubpath, final String testName, Boolean isLanguageSpecific) throws InterruptedException {
    return getTestFolderPath(testSubpath, testName, TestHelper.TestFolders.Input, isLanguageSpecific);
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
   * @return Actual Output folder path.
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

    return FileReadWriteUtil.readFileToString(pathOfInputFile).replace("\uFEFF", "");
  }

  /**
   * Gets the content of an expected output file for a particular test.
   *
   * @param testSubpath The subpath of the test. Path is formed from {TestDataPath}{TestSubpath}{TestName}{FolderUse}
   * @param testName    The name of the test this file is an expected output for.
   * @param fileName    The name of the file to be read.
   * @param isLanguageSpecific  There is a subfolder called Java.
   * @return The content of the file
   */
  public static String getExpectedOutputFileContent(final String testSubpath, final String testName, final String fileName, final boolean isLanguageSpecific)
          throws IOException, InterruptedException {
    final String pathOfExpectedOutputFolder = isLanguageSpecific
            ? new File(getExpectedOutputFolderPath(testSubpath, testName), "Java").toString() : getExpectedOutputFolderPath(testSubpath, testName);
    try {
      return readFileContent(pathOfExpectedOutputFolder, fileName);
    } catch (IllegalArgumentException e) {
      throw new RuntimeException(
              "Was unable to find the output file for test "
                      + testName
                      + ", file name = "
                      + fileName);
    }
  }

  public static String getExpectedOutputFileContent(final String testSubpath, final String testName, final String fileName)
          throws IOException, InterruptedException {
    return getExpectedOutputFileContent(testSubpath, testName, fileName, false);
  }

  public static String readFileContent(final String filePath, final String fileName)
      throws IOException {
    final File pathOfExpectedOutputFile = new File(new File(filePath), fileName);

    if (!pathOfExpectedOutputFile.exists()) {
      throw new IllegalArgumentException("Was unable to find the file name = " + fileName);
    }

    return FileReadWriteUtil.readFileToString(pathOfExpectedOutputFile.toString()).replace("\uFEFF", "");
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
    Assert.assertEquals(actual, expected);
  }

  public static void assertFolderFilesEquality(String expectedFolderPath, String actualFolderPath) {
    assertFolderFilesEquality(expectedFolderPath, actualFolderPath, false);
  }

  /**
   * Asserts the files in actualFolderPath and their content are the same as the files in expectedFolderPath.
   *
   * @param expectedFolderPath Expected folder path.
   * @param actualFolderPath   Actual folder path.
   * @param differentConfig    Indicate whether the config file is different with other languages.
   */
  public static void assertFolderFilesEquality(String expectedFolderPath, String actualFolderPath, Boolean differentConfig) {
    try {
      List<Path> expectedPaths = Files.list(Paths.get(expectedFolderPath)).collect(Collectors.toList());
      List<Path> actualPaths = Files.list(Paths.get(actualFolderPath)).collect(Collectors.toList());
      if (!differentConfig) {
        Assert.assertEquals(expectedPaths.size(), actualPaths.size());
      }

      expectedPaths.forEach(expectedPath -> {
        final boolean isSpecialConfig = expectedPath.getFileName().toString().equals("config-Java.json");
        if (expectedPath.getFileName().toString().endsWith("-CSharp.json")
                || expectedPath.getFileName().toString().endsWith("-Python.json")
                || expectedPath.getFileName().toString().endsWith("-TypeScript.json")) {
          return;
        }
        Path actualPath = actualPaths.stream()
                .filter(f -> f.getFileName().toString().equals(isSpecialConfig && differentConfig ? "config.json" : expectedPath.getFileName().toString()))
                .findFirst().get();
        if (Files.isDirectory(expectedPath) && Files.isDirectory(actualPath)) {
          assertFolderFilesEquality(expectedPath.toString(), actualPath.toString());
        } else if (!Files.isDirectory(expectedPath) && !Files.isDirectory(actualPath)) {
          try {
            if (expectedPath.toString().endsWith(".csv") && actualPath.toString().endsWith(".csv")) {
              assertFileContentEquality(
                      FileReadWriteUtil.readFileToString(expectedPath.toString()).replace("\uFEFF", ""),
                      FileReadWriteUtil.readFileToString(actualPath.toString()).replace("\uFEFF", ""));
            } else {
                assertSameObjectWasSerialized(
                        FileReadWriteUtil.readFileToString(expectedPath.toString()).replace("\uFEFF", ""),
                        FileReadWriteUtil.readFileToString(actualPath.toString()).replace("\uFEFF", ""));
            }
          } catch (IOException e) {
            Assert.fail(e.getMessage());
          }
        } else {
          Assert.fail();
        }
      });
    } catch (IOException e) {
      Assert.fail(e.getMessage());
    }
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
        // Default logger is not available in adapters, send to standard stream.
        System.err.println("Objects do not match. Expected = '" + expected + "'" + " actual = '" + actual + "'");
      }
      return false;
    }

    if (expected instanceof String && actual instanceof String) {
      final String expectedString = (String) expected;
      final String actualString = (String) actual;

      if (StringUtils.isNullOrEmpty(expectedString) && StringUtils.isNullOrEmpty(actualString)) {
        return true;
      }
      if (expectedString.equals(actualString)) {
        return true;
      }

      try {
        final OffsetDateTime expectedDate = OffsetDateTime.parse(expectedString);
        final OffsetDateTime actualDate = OffsetDateTime.parse(actualString);

        if (expectedDate != actualDate && logError) {
          // Default logger is not available in adapters, send to standard stream.
          System.err.println("DateTime did not match. Expected '" + expectedString + "'" + " found '" + actualString + "'");
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
          // Default logger is not available in adapters, send to standard stream.
          System.err.println("Arrays do not match. Found list member in expected but not in actual : " +
                  "'" + expectedJsonNode.get(0) + "'");
        }

        return false;
      }

      if (actualJsonNode.size() != 0) {
        if (logError) {
          // Default logger is not available in adapters, send to standard stream.
          System.err.println("Arrays do not match. Found list member in actual but not in expected: '"
                          + actualJsonNode.get(0) + "'");
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
            // Default logger is not available in adapters, send to standard stream.
            System.err.println("Value does not match for property '" + expectedField.getKey() + "'");
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
            // Default logger is not available in adapters, send to standard stream.
            System.err.println("Value does not match for property '" + actualField.getKey() + "'");
          }

          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Copy files from inputFolderPath to actualFolderPath.
   * @param testSubPath The test sub path.
   * @param testName The test name.
   */
  public static void copyFilesFromInputToActualOutput(String testSubPath, String testName) throws InterruptedException, IOException {
    copyFilesFromInputToActualOutputHelper(
            Paths.get(TestHelper.getInputFolderPath(testSubPath, testName)),
            Paths.get(TestHelper.getActualOutputFolderPath(testSubPath, testName)));
  }

  /**
   * Helper function to copy files from inputFolderPath to actualFolderPath recursively.
   * @param inputFolderPath The input folder path.
   * @param actualFolderPath The actual folder path.
   */
  private static void copyFilesFromInputToActualOutputHelper(Path inputFolderPath, Path actualFolderPath) throws IOException {
    List<Path> inputFilePaths = Files.list(inputFolderPath).collect(Collectors.toList());

    for (Path inputPath: inputFilePaths
         ) {
      Path inputName = inputPath.getFileName();
      Path actualPath = Paths.get(actualFolderPath.toString(), inputName.toString());
      if(!Files.isDirectory(inputPath)) {
        Files.copy(inputPath, actualPath, REPLACE_EXISTING);
      } else {
        Files.createDirectory(actualPath);
        copyFilesFromInputToActualOutputHelper(inputPath, actualPath);
      }
    }
  }

  /**
   * Delete files in actual output directory if exists.
   * @param actualOutputFolderPath The actual output folder path.
   */
  public static void deleteFilesFromActualOutput(String actualOutputFolderPath) throws IOException {
    List<Path> actualPaths = Files.list(Paths.get(actualOutputFolderPath)).collect(Collectors.toList());
    actualPaths.forEach(actualPath -> {
      try {
        if (Files.isDirectory(actualPath)) {
          deleteFilesFromActualOutput(actualPath.toString());
          Files.delete(actualPath);
        } else {
          Files.delete(actualPath);
        }
      } catch (IOException e) {
        Assert.fail(e.getMessage());
      }
    });
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, final String testName) throws InterruptedException {
    return getLocalCorpus(testSubpath, testName, null, false, null, false);
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, final String testName, String testInputDir) throws InterruptedException {
    return getLocalCorpus(testSubpath, testName, testInputDir, false, null, false);
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, final String testName, String testInputDir, Boolean isLanguageSpecific) throws InterruptedException {
    return getLocalCorpus(testSubpath, testName, testInputDir, isLanguageSpecific, null, false);
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, final String testName, String testInputDir, Boolean isLanguageSpecific, HashSet<CdmLogCode> expectedCodes) throws InterruptedException {
    return getLocalCorpus(testSubpath, testName, testInputDir, isLanguageSpecific, expectedCodes, false);
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, final String testName, Boolean isLanguageSpecific) throws InterruptedException {
    return getLocalCorpus(testSubpath, testName, null, isLanguageSpecific, null, false);
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, final String testName, Boolean isLanguageSpecific, HashSet<CdmLogCode> expectedCodes) throws InterruptedException {
    return getLocalCorpus(testSubpath, testName, null, isLanguageSpecific, expectedCodes, false);
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, final String testName, Boolean isLanguageSpecific, HashSet<CdmLogCode> expectedCodes, Boolean noInputAndOutputFolder) throws InterruptedException {
    return getLocalCorpus(testSubpath, testName, null, isLanguageSpecific, expectedCodes, noInputAndOutputFolder);
  }

  /**
   * Creates a corpus to be used by the tests, which mounts inputFolder, outputFolder, cdm, and remoteAdapter. Will fail on any unexpected warning/error.
   * @param testSubpath               The root of the corpus files.
   * @param testName                  The test name.
   * @param testInputDir              The test input directory.
   * @param isLanguageSpecific        Indicate whether there is subfolder called Java, it's used when input is different compared with other languages
   * @param expectedCodes             The error codes that are expected, and they should not block the test.
   * @param noInputAndOutputFolder    No input and output folder needed.
   * @return {@link CdmCorpusDefinition}
   */
  public static CdmCorpusDefinition getLocalCorpus(final String testSubpath, String testName, String testInputDir, Boolean isLanguageSpecific, HashSet<CdmLogCode> expectedCodes, Boolean noInputAndOutputFolder) throws InterruptedException {
    testName = (testName == null || testName.equals("")) ? testName : testName.substring(0, 1).toUpperCase() + testName.substring(1);
    if (noInputAndOutputFolder) {
      testInputDir = "C:\\dummyPath";
    }
    testInputDir = (testInputDir != null) ? testInputDir : TestHelper.getInputFolderPath(testSubpath, testName, isLanguageSpecific);

    final String testOutputDir = noInputAndOutputFolder ? testInputDir : getActualOutputFolderPath(testSubpath, testName);

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    cdmCorpus.setEventCallback((CdmStatusLevel level, String message) -> {
      failOnUnexpectedFailure(cdmCorpus, message, expectedCodes);
    }, CdmStatusLevel.Warning);

    cdmCorpus.getStorage().setDefaultNamespace(LOCAL);

    final StorageAdapterBase localAdapter = new LocalAdapter(testInputDir);
    cdmCorpus.getStorage().mount(LOCAL, localAdapter);

    final StorageAdapterBase outputAdapter = new LocalAdapter(testOutputDir);
    cdmCorpus.getStorage().mount(OUTPUT, outputAdapter);

    final LocalAdapter cdmAdapter = new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT);
    cdmCorpus.getStorage().mount(CDM, cdmAdapter);

    final RemoteAdapter remoteAdapter = new RemoteAdapter();
    final Map<String, String> hosts = new HashMap<>();
    hosts.put(CONTOSO, HTTP_CONTOSO_COM);
    remoteAdapter.setHosts(hosts);
    cdmCorpus.getStorage().mount(REMOTE, remoteAdapter);

    return cdmCorpus;
  }

  private static void failOnUnexpectedFailure(final CdmCorpusDefinition corpus, final String message) {
    failOnUnexpectedFailure(corpus, message, null);
  }

  /**
   * Fail on an unexpected message.
   * @param corpus          The corpus.
   * @param message         The unexpected error messages.
   * @param expectedCodes   The expected error codes.
   */
  private static void failOnUnexpectedFailure(final CdmCorpusDefinition corpus, final String message, final HashSet<CdmLogCode> expectedCodes) {
    EventList events = corpus.getCtx().getEvents();
    if (events.size() > 0) {
      Map<String, String> lastLog = events.get(events.size() - 1);
      if (!lastLog.containsKey("code") || !ignoredLogCodes.contains(lastLog.get("code"))) {
        if (expectedCodes != null && expectedCodes.contains(CdmLogCode.valueOf(lastLog.get("code")))) {
          return;
        }
        final String code = lastLog.getOrDefault("code", "no code associated");
        Assert.fail("Encountered unexpected log event: " + code + " - " + message + "!");
      }
    }
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

  private static String getTestFolderPath(final String testSubpath, final String testName, final TestHelper.TestFolders use) throws InterruptedException {
    return getTestFolderPath(testSubpath, testName, use, false);
  }

  /**
   * Gets the path of the folder used by the test.
   *
   * @param testSubpath         The name of test currently running that will used created path.
   * @param testName            The test name.
   * @param use                 Whether the path is for Input, Expected Output or ActualOutput.
   * @param isLanguageSpecific  Indicate whether there is subfolder called Java.
   * @return
   */
  private static String getTestFolderPath(final String testSubpath, final String testName, final TestHelper.TestFolders use, Boolean isLanguageSpecific)
          throws InterruptedException {
    final String folderName = use == TestFolders.ActualOutput ? getTestActualOutputFolderName() : use.name();
    final String testFolderPath = isLanguageSpecific
                                    ? new File(new File(new File(new File(TEST_DATA_PATH, testSubpath), testName), folderName), "Java").toString()
                                    : new File(new File(new File(TEST_DATA_PATH, testSubpath), testName), folderName).toString();
    final File folder = new File(testFolderPath);

    if (use == TestFolders.ActualOutput && !folder.exists()) {
      folder.mkdirs();
      while (!folder.exists()) {
        TimeUnit.MINUTES.sleep(5);
      }
    }

    return testFolderPath;
  }

  public static String getTestActualOutputFolderName() {
    return TestFolders.ActualOutput.name() + "-Java";
  }

  /**
   *Asserts in logcode, if expected log code is not in log codes recorded list (isPresent = true)
   *Asserts in logcode, if expected log code in log codes recorded list (isPresent = false)
   * @param corpus The corpus object.
   * @param expectedCode The expectedcode cdmlogcode.
   * @param isPresent The flag to decide how to assert the test.
   * @return
   */
  public static void assertCdmLogCodeEquality(CdmCorpusDefinition corpus, CdmLogCode expectedCode, boolean isPresent) {
    boolean toAssert = false;
    for (Map<String, String> logEntry : corpus.getCtx().getEvents()) {
      if (((expectedCode.name().startsWith("Warn") && logEntry.get("level").equals(CdmStatusLevel.Warning.name()))
              || (expectedCode.name().startsWith("Err") && logEntry.get("level").equals(CdmStatusLevel.Error.name())))
              && logEntry.get("code").equalsIgnoreCase(expectedCode.toString())) {
        toAssert = true;
      }
    }

    if (isPresent) {
      if (!toAssert) {
        Assert.fail("The recorded log events should have contained message with log code " + expectedCode.toString() + " of appropriate level");
      }
    } else {
      if (toAssert) {
        Assert.fail("The recorded log events should have not contained message with log code " + expectedCode.toString() +
                " of appropriate level as this message should be filtered out.");
      }
    }
  }
}