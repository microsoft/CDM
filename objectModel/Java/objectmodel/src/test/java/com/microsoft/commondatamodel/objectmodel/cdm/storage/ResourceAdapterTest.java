// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.storage;

import com.microsoft.commondatamodel.objectmodel.storage.ResourceAdapter;
import java.net.URISyntaxException;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ResourceAdapterTest {
  @Test
  public void testCreateCorpusPath() throws URISyntaxException {
    final ResourceAdapter adapter = new ResourceAdapter();
    final String root = fetchRoot();

    String path = adapter.createCorpusPath(root + "ODI_analogs/ODIEntity.cdm.json");
    Assert.assertEquals("/ODI-analogs/ODIEntity.cdm.json", path);

    path = adapter.createCorpusPath(root + "ODI_analogs/customer/ODIEntity.cdm.json");
    Assert.assertEquals("/ODI-analogs/customer/ODIEntity.cdm.json", path);

    path = adapter.createCorpusPath(root + "extensions/pbi.extension.cdm.json");
    Assert.assertEquals("/extensions/pbi.extension.cdm.json", path);

    path = adapter.createCorpusPath(root + "primitives.cdm.json");
    Assert.assertEquals("/primitives.cdm.json", path);

    path = adapter.createCorpusPath(root + "ODI_analogs/customer/_allImports.cdm.json");
    Assert.assertEquals("/ODI-analogs/customer/_allImports.cdm.json", path);
  }

  @Test
  public void testCreateAdapterPath() throws URISyntaxException {
    final ResourceAdapter adapter = new ResourceAdapter();
    final String root = fetchRoot();

    String path = adapter.createAdapterPath("/ODI-analogs/ODIEntity.cdm.json");
    Assert.assertEquals(root + "ODI_analogs/ODIEntity.cdm.json", path);

    path = adapter.createAdapterPath("/ODI-analogs/customer/ODIEntity.cdm.json");
    Assert.assertEquals(root + "ODI_analogs/customer/ODIEntity.cdm.json", path);

    path = adapter.createAdapterPath("/extensions/pbi.extension.cdm.json");
    Assert.assertEquals(root + "extensions/pbi.extension.cdm.json", path);

    path = adapter.createAdapterPath("/primitives.cdm.json");
    Assert.assertEquals(root + "primitives.cdm.json", path);
  }

  private String fetchRoot() throws URISyntaxException {
    return ResourceAdapter.class.getProtectionDomain()
        .getCodeSource()
        .getLocation()
        .toURI()
        .getPath();
  }
}
