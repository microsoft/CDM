// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.ResourceAdapter;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.AssertJUnit;
import org.testng.annotations.Test;

public class StorageConfigTest {
  /**
   * The Storage path.
   */
  private String testsSubpath = new File("storage").toString();

  private CdmCorpusDefinition getLocalCorpus(String testFilesInputRoot) {
    return getLocalCorpus(testFilesInputRoot, null);
  }

  /**
   * Gets local corpus.
   *
   * @param testFilesInputRoot
   * @param testFilesOutputRoot
   * @return
   */
  private CdmCorpusDefinition getLocalCorpus(String testFilesInputRoot, String testFilesOutputRoot) {
    CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");
    cdmCorpus.getStorage().mount("local", new LocalAdapter(testFilesInputRoot));
    if (testFilesOutputRoot != null) {
      cdmCorpus.getStorage().mount("target", new LocalAdapter(testFilesOutputRoot));
    }
    return cdmCorpus;
  }

  /**
   * Testing loading and saving config.
   *
   * @throws InterruptedException
   * @throws ExecutionException
   */
  @Test
  public void testLoadingAndSavingConfig() throws InterruptedException, ExecutionException, JSONException {
    String testInputPath = TestHelper.getInputFolderPath(testsSubpath, "TestLoadingAndSavingConfig");
    String testOutputPath = TestHelper.getExpectedOutputFolderPath(testsSubpath, "TestLoadingAndSavingConfig");
    // Create a corpus to load the config.
    CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath, testOutputPath);
    String config = cdmCorpus.getStorage().fetchAdapter("local").readAsync("/config.json").get();
    CdmCorpusDefinition differentCorpus = new CdmCorpusDefinition();
    differentCorpus.getStorage().mountFromConfig(config);

    String resultConfig = differentCorpus.getStorage().fetchConfig();
    String outputConfig = cdmCorpus.getStorage().fetchAdapter("target").readAsync("/config.json").get();
    JSONAssert.assertEquals(outputConfig, resultConfig, false);
  }

  /**
   * Testing loading config and fetching a manifest with the defined adapters.
   *
   * @throws InterruptedException
   * @throws ExecutionException
   */
  @Test
  public void testLoadingConfigAndTryingToFetchManifest() throws InterruptedException, ExecutionException {
    String testInputPath = TestHelper.getInputFolderPath(testsSubpath, "testLoadingConfigAndTryingToFetchManifest");
    // Create a corpus to load the config.
    CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);
    String config = cdmCorpus.getStorage().fetchAdapter("local").readAsync("/config-Java.json").get();
    CdmCorpusDefinition differentCorpus = new CdmCorpusDefinition();
    List<String> unrecognizedAdapters = differentCorpus.getStorage().mountFromConfig(config, true);
    CdmManifestDefinition cdmManifest = differentCorpus.<CdmManifestDefinition>fetchObjectAsync("model.json", cdmCorpus.getStorage().fetchRootFolder("local")).get();
    AssertJUnit.assertNotNull(cdmManifest);
    Assert.assertEquals(1, unrecognizedAdapters.size());
  }

  /**
   * Testing loading and saving resource and system defined adapters.
   */
  @Test
  public void testSystemAndResourceAdapters() throws InterruptedException, IOException {
    final String testInputPath =
        TestHelper.getExpectedOutputFolderPath(testsSubpath, "TestSystemAndResourceAdapters");
    final String testOutputPath =
        TestHelper.getExpectedOutputFolderPath(testsSubpath, "TestSystemAndResourceAdapters");

    // Create a corpus to load the config.
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath, testOutputPath);

    final CdmCorpusDefinition differentCorpus = new CdmCorpusDefinition();

    differentCorpus.getStorage().mount("cdm", new ResourceAdapter());
    differentCorpus.getStorage().setDefaultNamespace("local");

    final String resultConfig = differentCorpus.getStorage().fetchConfig();

    final String outputConfig =
        cdmCorpus.getStorage()
            .getNamespaceAdapters()
            .get("local")
            .readAsync("/config.json").join();

    TestHelper.assertSameObjectWasSerialized(outputConfig, resultConfig);
  }
}
