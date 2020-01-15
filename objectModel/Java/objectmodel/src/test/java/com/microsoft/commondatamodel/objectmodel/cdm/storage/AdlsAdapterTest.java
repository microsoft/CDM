/*
 * Copyright (c) Microsoft Corporation.
 */

package com.microsoft.commondatamodel.objectmodel.cdm.storage;

import static org.testng.Assert.assertEquals;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
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
}