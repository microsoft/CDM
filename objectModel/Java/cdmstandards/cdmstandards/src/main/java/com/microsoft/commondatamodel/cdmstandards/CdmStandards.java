// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.cdmstandards;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class CdmStandards {
   public static String readAsync(final String corpusPath) throws IOException {
      final InputStream resourcePath = CdmStandards.class.getResourceAsStream(corpusPath);

      if (resourcePath == null) {
         throw new IOException(String.format("There is no resource found for %s", corpusPath));
      }

      try (final BufferedReader br = new BufferedReader(new InputStreamReader(resourcePath, StandardCharsets.UTF_8))) {
         final StringBuilder result = new StringBuilder();
         String line;
         while ((line = br.readLine()) != null) {
            result.append(line);
         }
         return result.toString();
      } catch (final IOException exception) {
         throw exception;
      }
   }
}
