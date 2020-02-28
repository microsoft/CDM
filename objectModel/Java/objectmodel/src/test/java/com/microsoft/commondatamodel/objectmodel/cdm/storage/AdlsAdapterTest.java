// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.storage;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNull;
import static org.testng.Assert.fail;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.network.TokenProvider;
import java.util.concurrent.ExecutionException;
import java.util.function.Supplier;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AdlsAdapterTest {
  private final static String TEST_ADLS_CLIENT_ID = System.getProperty("testAdlsClientId");
  private final static String TEST_ADLS_SECRET = System.getProperty("testAdlsSecret");
  private final static String TEST_ADLS_ACCOUNT_NAME = System.getProperty("testAdlsAccountName");
  private final static String TEST_ADLS_ROOT = System.getProperty("testAdlsRoot");
  private final static String TEST_ADLS_TENANT = "72f988bf-86f1-41af-91ab-2d7cd011db47";
  private final static String TEST_ADLS_SHARED_KEY = System.getProperty("testAdlsSharedKey");
  private final static String TEST_ADLS_TOKEN = System.getProperty("testAdlsToken");

  private static class CustomTokenProvider implements TokenProvider {
    public String getToken() {
      return TEST_ADLS_TOKEN;
    }
  }

  private static Supplier<AdlsAdapter> adlsAdapterSupplierWithSharedKey =
      () -> new AdlsAdapter(
          TEST_ADLS_ACCOUNT_NAME + ".dfs.core.windows.net",
          TEST_ADLS_ROOT,
          TEST_ADLS_SHARED_KEY
      );

  private static Supplier<AdlsAdapter> adlsAdapterSupplierWithClientAndSecret =
      () -> new AdlsAdapter(
          TEST_ADLS_ACCOUNT_NAME + ".dfs.core.windows.net",
          TEST_ADLS_ROOT,
          TEST_ADLS_TENANT,
          TEST_ADLS_CLIENT_ID,
          TEST_ADLS_SECRET
      );

  private static Supplier<AdlsAdapter> adlsAdapterSupplierWithTokenProvider =
      () -> new AdlsAdapter(
          TEST_ADLS_ACCOUNT_NAME + ".dfs.core.windows.net",
          TEST_ADLS_ROOT,
          new CustomTokenProvider()
      );

  private final static Supplier<AdlsAdapter> testAdlsAdapterSupplier = TEST_ADLS_SHARED_KEY != null
      ? adlsAdapterSupplierWithSharedKey
      : adlsAdapterSupplierWithClientAndSecret;

  @Test
  public void writeAndReadTest() throws InterruptedException, ExecutionException {
    final AdlsAdapter adlsAdapter = testAdlsAdapterSupplier.get();

    final String control = "CONTROL";
    adlsAdapter.writeAsync("/test-file.json", control).get();
    final String result = adlsAdapter.readAsync("/test-file.json").get();
    assertEquals(result, control);
  }

  @Test
  public void computeModifiedDateTest() {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("adls");

    final StorageAdapter adlsAdapter = testAdlsAdapterSupplier.get();
    cdmCorpus.getStorage().mount("adls", adlsAdapter);

    final String absolutePath = cdmCorpus.getStorage().createAbsoluteCorpusPath("/test-file.json");
    Assert.assertNotNull(adlsAdapter.computeLastModifiedTimeAsync(absolutePath).join());
  }

  @Test
  public void createCorpusAndAdapterPath() {
    final String host1 = "storageaccount.dfs.core.windows.net";
    final String root = "/fs";
    AdlsAdapter adlsAdapter = new AdlsAdapter(host1, root, "");

    final String adapterPath1 = "https://storageaccount.dfs.core.windows.net/fs/a/1.csv";
    final String adapterPath2 = "https://storageaccount.dfs.core.windows.net:443/fs/a/2.csv";
    final String adapterPath3 = "https://storageaccount.blob.core.windows.net/fs/a/3.csv";
    final String adapterPath4 = "https://storageaccount.blob.core.windows.net:443/fs/a/4.csv";

    final String corpusPath1 = adlsAdapter.createCorpusPath(adapterPath1);
    final String corpusPath2 = adlsAdapter.createCorpusPath(adapterPath2);
    final String corpusPath3 = adlsAdapter.createCorpusPath(adapterPath3);
    final String corpusPath4 = adlsAdapter.createCorpusPath(adapterPath4);

    assertEquals(corpusPath1, "/a/1.csv");
    assertEquals(corpusPath2, "/a/2.csv");
    assertEquals(corpusPath3, "/a/3.csv");
    assertEquals(corpusPath4, "/a/4.csv");

    assertEquals(adlsAdapter.createAdapterPath(corpusPath1), adapterPath1);
    assertEquals(adlsAdapter.createAdapterPath(corpusPath2), adapterPath2);
    assertEquals(adlsAdapter.createAdapterPath(corpusPath3), adapterPath3);
    assertEquals(adlsAdapter.createAdapterPath(corpusPath4), adapterPath4);

    final String host2 = "storageaccount.blob.core.windows.net:8888";
    adlsAdapter = new AdlsAdapter(host2, root, "", "", "");

    final String  adapterPath5 = "https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv";
    final String  adapterPath6 = "https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv";
    final String  adapterPath7 = "https://storageaccount.blob.core.windows.net/fs/a/7.csv";

    assertEquals(adlsAdapter.createCorpusPath(adapterPath5), "/a/5.csv");
    assertEquals(adlsAdapter.createCorpusPath(adapterPath6), "/a/6.csv");
    assertNull(adlsAdapter.createCorpusPath(adapterPath7));
  }

  @Test
  public void fetchConfigAndUpdateConfig() {
    final AdlsAdapter adlsAdapter = adlsAdapterSupplierWithTokenProvider.get();

    try {
      String resultConfig = adlsAdapter.fetchConfig();
      JsonNode adapterConfigJson = JMapper.MAP.readTree(resultConfig);
      adlsAdapter.updateConfig(adapterConfigJson.get("config").asText());
    } catch (final Exception ex) {
      fail("AdlsAdapter initialized with token provider shouldn't throw exception when updating config.");
    }
  }
}
