// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.storage;

import com.microsoft.commondatamodel.objectmodel.storage.ResourceAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ResourceAdapterTest {
  private static final String ROOT = "Microsoft.CommonDataModel.ObjectModel.Resources";

  /**
   * Tests if the calls to CreateCorpusPath return the expected corpus path.
   */
  @Test
  public void testCreateCorpusPath() {
    final ResourceAdapter adapter = new ResourceAdapter();

    String path = adapter.createCorpusPath(ROOT + "/ODI-analogs/ODIEntity.cdm.json");
    Assert.assertEquals("/ODI-analogs/ODIEntity.cdm.json", path);

    path = adapter.createCorpusPath(ROOT + "/ODI-analogs/customer/ODIEntity.cdm.json");
    Assert.assertEquals("/ODI-analogs/customer/ODIEntity.cdm.json", path);

    path = adapter.createCorpusPath(ROOT + "/extensions/pbi.extension.cdm.json");
    Assert.assertEquals("/extensions/pbi.extension.cdm.json", path);

    path = adapter.createCorpusPath(ROOT + "/primitives.cdm.json");
    Assert.assertEquals("/primitives.cdm.json", path);

    path = adapter.createCorpusPath(ROOT + "/ODI-analogs/customer/_allImports.cdm.json");
    Assert.assertEquals("/ODI-analogs/customer/_allImports.cdm.json", path);

    // Case where the corpus adapter path is not meant to be understood by this adapter.
    path = adapter.createCorpusPath("C:/ODI-analogs/customer/_allImports.cdm.json");
    Assert.assertNull(path);
  }

  /**
   * Tests if the calls to CreateAdapterPath return the expected adapter path.
   */
  @Test
  public void testCreateAdapterPath() {
    final ResourceAdapter adapter = new ResourceAdapter();

    String path = adapter.createAdapterPath("/ODI-analogs/ODIEntity.cdm.json");
    Assert.assertEquals(ROOT + "/ODI-analogs/ODIEntity.cdm.json", path);

    path = adapter.createAdapterPath("/ODI-analogs/customer/ODIEntity.cdm.json");
    Assert.assertEquals(ROOT + "/ODI-analogs/customer/ODIEntity.cdm.json", path);

    path = adapter.createAdapterPath("/extensions/pbi.extension.cdm.json");
    Assert.assertEquals(ROOT + "/extensions/pbi.extension.cdm.json", path);

    path = adapter.createAdapterPath("/primitives.cdm.json");
    Assert.assertEquals(ROOT + "/primitives.cdm.json", path);
  }

  /**
   * Tests if the files from the resource adapter can be read correclty.
   */
  @Test
  public void testReadAsync() {
    final ResourceAdapter adapter = new ResourceAdapter();

    Assert.assertNotNull(adapter.readAsync("/ODI-analogs/ODIEntity.cdm.json").join());
    Assert.assertNotNull(adapter.readAsync("/ODI-analogs/customer/Opportunity.cdm.json").join());
    Assert.assertNotNull(adapter.readAsync("/extensions/pbi.extension.cdm.json").join());
    Assert.assertNotNull(adapter.readAsync("/primitives.cdm.json").join());
  }
}
