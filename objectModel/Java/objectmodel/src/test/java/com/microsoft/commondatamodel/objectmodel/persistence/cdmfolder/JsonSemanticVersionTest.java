// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import java.io.File;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;

import org.testng.Assert;
import org.testng.annotations.Test;

public class JsonSemanticVersionTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File(new File("persistence", "cdmfolder"), "JsonSemanticVersionTest")
      .toString();

  /**
   * Test loading a document with a semantic version bigger than the one supported.
   */
  @Test
  public void testLoadingUnsupportedVersion() throws InterruptedException, ExecutionException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestLoadingUnsupportedVersion");
    final AtomicInteger errorCount = new AtomicInteger(0);

    // Test loading a resolved document.
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("This ObjectModel version supports json semantic version") && level == CdmStatusLevel.Warning) {
        errorCount.getAndIncrement();
      }
    }, CdmStatusLevel.Warning);
    corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/resolvedDoc.cdm.json").get();
    if (errorCount.get() != 1) {
      Assert.fail("Should have logged a warning.");
    }
    errorCount.set(0);

    // Test loading a logical document.
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("This ObjectModel version supports json semantic version") && level == CdmStatusLevel.Error) {
        errorCount.getAndIncrement();
      }
    }, CdmStatusLevel.Warning);
    corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/logicalDoc.cdm.json").get();
    if (errorCount.get() != 1) {
      Assert.fail("Should have logged an error.");
    }
    errorCount.set(0);

    // Test loading a document missing the jsonSemanticVersion property.
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("jsonSemanticVersion is a required property of a document.") && level == CdmStatusLevel.Warning) {
        errorCount.getAndIncrement();
      }
    }, CdmStatusLevel.Warning);
    corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/missingDoc.cdm.json").get();
    if (errorCount.get() != 1) {
      Assert.fail("Should have logged a warning for missing property.");
    }
  }

  /**
   * Test loading a document with an invalid semantic version.
   */
  @Test
  public void testLoadingInvalidVersion() throws InterruptedException, ExecutionException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestLoadingInvalidVersion");
    final AtomicInteger errorCount = new AtomicInteger(0);

    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("jsonSemanticVersion must be set using the format <major>.<minor>.<patch>.") && level == CdmStatusLevel.Warning) {
        errorCount.getAndIncrement();
      }
    }, CdmStatusLevel.Warning);

    // Test loading a version format "a.0.0".
    corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/invalidVersionDoc.cdm.json").get();
    if (errorCount.get() != 1) {
      Assert.fail("Should have logged a warning.");
    }
    errorCount.set(0);

    // Test loading a version format "1.0".
    corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/invalidFormatDoc.cdm.json").get();
    if (errorCount.get() != 1) {
      Assert.fail("Should have logged a warning.");
    }
    errorCount.set(0);
  }
}