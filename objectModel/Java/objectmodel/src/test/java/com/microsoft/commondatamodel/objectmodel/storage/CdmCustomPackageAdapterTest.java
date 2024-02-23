// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Tests if the CdmCustomPackageAdapter functions correctly.
 */
public class CdmCustomPackageAdapterTest {
  String ROOT = "";
  String EXTENSION_FILE_PATH = "/extensions/pbi.extension.cdm.json";
  String FOUNDATIONS_FILE_PATH = "/cdmfoundation/foundations.cdm.json";
  String INVALID_FILE_PATH = "invalidFile.cdm.json";

  /**
   * Tests if the adapter handles correctly if the package cannot be found
   */
  @Test
  public void testPackageNotFound() {
    boolean errorCalled = false;
    try {
      new CdmCustomPackageAdapter("someInvalidPackage");
    } catch (ClassNotFoundException e) {
      Assert.assertTrue(e.getMessage().contains("Couldn't find package 'someInvalidPackage'"));
      errorCalled = true;
    }

    Assert.assertTrue(errorCalled);
  }

  /**
   * Tests if the corpus path is created correctly.
   */
  @Test
  public void testCdmStandardsCreateCorpusPath() throws ClassNotFoundException {
    CdmStandardsAdapter adapter = new CdmStandardsAdapter();
    String corpusPath = adapter.createCorpusPath(EXTENSION_FILE_PATH);
    Assert.assertEquals(corpusPath, EXTENSION_FILE_PATH);

    corpusPath = adapter.createCorpusPath(FOUNDATIONS_FILE_PATH);
    Assert.assertEquals(corpusPath, FOUNDATIONS_FILE_PATH);
  }

  /**
   * Tests if the adapter path is created correctly.
   */
  @Test
  public void testCdmStandardsCreateAdapterPath() throws ClassNotFoundException {
    CdmStandardsAdapter adapter = new CdmStandardsAdapter();
    String adapterPath = adapter.createAdapterPath(EXTENSION_FILE_PATH);
    Assert.assertEquals(adapterPath, ROOT + EXTENSION_FILE_PATH);

    adapterPath = adapter.createAdapterPath(FOUNDATIONS_FILE_PATH);
    Assert.assertEquals(adapterPath, ROOT + FOUNDATIONS_FILE_PATH);
  }

  /**
   * Tests if the adapter is able to read correctly.
   */
  @Test
  public void testCdmStandardsReadAsync() throws Throwable {
    CdmStandardsAdapter adapter = new CdmStandardsAdapter();
    String extensions = adapter.readAsync(EXTENSION_FILE_PATH).join();
    String foundations = adapter.readAsync(FOUNDATIONS_FILE_PATH).join();
    Assert.assertNotNull(extensions);
    Assert.assertNotNull(foundations);

    boolean errorWasThrown = false;
    try {
      try {
        adapter.readAsync(INVALID_FILE_PATH).join();
      } catch (final Exception e) {
        throw e.getCause();
      }
    } catch (final StorageAdapterException e) {
      String errorMessageString = String.format("There is no resource found for %s", INVALID_FILE_PATH);
      Assert.assertEquals(e.getMessage().substring(0, errorMessageString.length()), errorMessageString);
      errorWasThrown = true;
    }

    Assert.assertTrue(errorWasThrown);
  }

  /**
   * Tests if the CdmCustomPackageAdapter works when assembly is passed in the constructor.
   */
  @Test
  public void testCustomPackageInConstructor() throws Throwable {
    Class cdmstandards = Class.forName("com.microsoft.commondatamodel.cdmstandards.CdmStandards");
    CdmCustomPackageAdapter adapter = new CdmCustomPackageAdapter(cdmstandards);
    String foundations = adapter.readAsync(FOUNDATIONS_FILE_PATH).join();
    Assert.assertNotNull(foundations);
  }

  /**
   * Test mounting CdmStandards adapter from config does not cause an error
   */
  @Test
  public void testCdmStandardsMountFromConfig() throws ClassNotFoundException {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();

    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      Assert.fail(String.format("Unexpected error: %s", message));
    }, CdmStatusLevel.Warning);

    corpus.getStorage().mountFromConfig("{\"adapters\": [{\"config\": {\"locationHint\": \"\", \"maximumTimeout\": 20000, \"numberOfRetries\": 2, \"root\": \"/logical\", \"timeout\": 5000}, \"namespace\": \"cdm\", \"type\": \"cdm-standards\"}], \"defaultNamespace\": \"local\"}");
    corpus.getStorage().mount("cdm", new CdmStandardsAdapter());
    String config = corpus.getStorage().fetchConfig();
    corpus.getStorage().mountFromConfig(config);
  }

}
