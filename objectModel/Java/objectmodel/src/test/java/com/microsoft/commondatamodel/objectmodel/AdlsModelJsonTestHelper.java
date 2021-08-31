// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class AdlsModelJsonTestHelper {
    public static final String ACTUAL_FOLDER_NAME = "Actual";
    public static final String EXPECTED_FOLDER_NAME = "Expected";
    public static final String INPUT_FOLDER_NAME = "Input";

    private static final String HOSTNAME_PLACEHOLDER = "<HOSTNAME>";
    private static final String ROOT_PATH_PLACEHOLDER = "/<ROOTPATH>";

    public static String getActualSubFolderPath(String testSubPath, String testName, String subFolderName) throws InterruptedException {
        return Paths.get(TestHelper.getActualOutputFolderPath(testSubPath, testName), subFolderName).toString();
    }

    public static String getExpectedFileContent(String testSubPath, String testName, String fileName) throws InterruptedException, IOException {
        return FileReadWriteUtil.readFileToString(
                Paths.get(
                        TestHelper.getActualOutputFolderPath(testSubPath, testName),
                        EXPECTED_FOLDER_NAME,
                        fileName).toString());
    }

    public static void saveModelJsonToActualOutput(String testSubPath, String testName, String fileName, String content) throws InterruptedException, IOException {
        Path actualFolderPath = Paths.get(getActualSubFolderPath(testSubPath, testName, ACTUAL_FOLDER_NAME));
        if (!Files.exists(actualFolderPath)) {
            Files.createDirectory(actualFolderPath);
        }

        FileReadWriteUtil.writeStringToFile(
                Paths.get(actualFolderPath.toString(), fileName).toString(),
                content);
    }

    public static void UpdateInputAndExpectedAndSaveToActualSubFolder(String testSubPath, String testName, String rootRelativePath, String fileName, String stringToAddSuffix, String suffix) throws IOException, InterruptedException {
        // Prepare the root path.
        String rootPath = System.getenv("ADLS_ROOTPATH");
        rootPath = AdlsTestHelper.getFullRootPath(rootPath, rootRelativePath);

        if (!rootPath.startsWith("/")) {
            rootPath = "/" + rootPath;
        }

        if (rootPath.endsWith("/")) {
            rootPath = rootPath.substring(0, rootPath.length() - 1);
        }

        rootPath = URLEncoder.encode(rootPath, "UTF8").replace("%2F", "/").replace("+", "%20");

        // Update input content and save to ActualOutput/Input
        String inputContent = TestHelper.getInputFileContent(testSubPath, testName, fileName);
        inputContent = replacePlaceholders(inputContent, rootPath, stringToAddSuffix, suffix);

        String inputFolderPath = getActualSubFolderPath(testSubPath, testName, INPUT_FOLDER_NAME);

        if (!Files.exists(Paths.get(inputFolderPath))) {
            Files.createDirectory(Paths.get(inputFolderPath));
        }

        FileReadWriteUtil.writeStringToFile(
                Paths.get(inputFolderPath, fileName).toString(),
                inputContent);

        // Update expected content and save to ActualOutput/Expected
        String expectedContent = TestHelper.getExpectedOutputFileContent(testSubPath, testName, fileName,true);
        expectedContent = replacePlaceholders(expectedContent, rootPath, stringToAddSuffix, suffix);

        String expectedFolderPath = getActualSubFolderPath(testSubPath, testName, EXPECTED_FOLDER_NAME);

        if (!Files.exists(Paths.get(expectedFolderPath))) {
            Files.createDirectory(Paths.get(expectedFolderPath));
        }

        FileReadWriteUtil.writeStringToFile(
                Paths.get(expectedFolderPath, fileName).toString(),
                expectedContent);
    }

    private static String replacePlaceholders(String content, String root, String stringToAddSuffix, String suffix) {
        content = content.replace(HOSTNAME_PLACEHOLDER, System.getenv("ADLS_HOSTNAME"));
        content = content.replace(ROOT_PATH_PLACEHOLDER, root);
        content = content.replace(stringToAddSuffix, stringToAddSuffix + "-" + suffix);
        return content;
    }
}
