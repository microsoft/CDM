// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class FileReadWriteUtil {

  public static String readFileToString(final String fileRelativePathName) throws IOException {
    return new String(Files.readAllBytes(new File(fileRelativePathName).toPath()));
  }

  public static void writeStringToFile(final String fileRelativePathName, final String str) throws IOException {
    final File outputFile = new File(fileRelativePathName);
    if (!outputFile.exists()) {
      outputFile.createNewFile();
    }

    final byte[] strToBytes = str.getBytes();
    Files.write(outputFile.toPath(), strToBytes);
  }
}
