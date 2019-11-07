// Copyright (c) Microsoft Corporation.
package com.microsoft.commondatamodel.objectmodel.storage;

import static org.testng.Assert.assertEquals;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import org.testng.annotations.Test;
public class AdlsAdapterTest {
  @Test (enabled = false)
  public void writeAndReadTest() throws InterruptedException, ExecutionException, IOException {
    // TODO-BQ: Discuss if we should dedicate an Azure Storage account & container to make sure this
    // test is always executed.
    final StorageAdapter adlsAdapter = new AdlsAdapter(
        "<ACCOUNT_NAME>.dfs.core.windows.net",
        "/<CONTAINER_NAME>",
        "72f988bf-86f1-41af-91ab-2d7cd011db47",
        "<CLIENT_ID>",
        "<CLIENT_SECRET>"
        );

    final String control = "CONTROL";
    adlsAdapter.writeAsync("/test-file.json", control).get();
    final String result = adlsAdapter.readAsync("/test-file.json").get();
    assertEquals(result, control);
  }
}