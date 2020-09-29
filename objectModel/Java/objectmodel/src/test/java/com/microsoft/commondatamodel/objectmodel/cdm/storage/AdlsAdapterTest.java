// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.storage;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNull;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.assertTrue;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.fail;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase.CacheContext;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.network.TokenProvider;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.function.Supplier;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AdlsAdapterTest {

  private final String testSubpath = "Storage";

  private static class FakeTokenProvider implements TokenProvider {
    public String getToken() {
      return "TOKEN";
    }
  }

  private static AdlsAdapter createAdapterWithSharedKey() {
    return createAdapterWithSharedKey("");
  }

  private static AdlsAdapter createAdapterWithSharedKey(String rootRelativePath) {
    String hostname = System.getenv("ADLS_HOSTNAME");
    String rootPath = System.getenv("ADLS_ROOTPATH");
    String sharedKey = System.getenv("ADLS_SHAREDKEY");

    assertFalse(StringUtils.isNullOrEmpty(hostname));
    assertFalse(StringUtils.isNullOrEmpty(rootPath));
    assertFalse(StringUtils.isNullOrEmpty(sharedKey));

    return new AdlsAdapter(hostname, combinePath(rootPath, rootRelativePath), sharedKey);
  }

  private static AdlsAdapter createAdapterWithClientId() {
    return createAdapterWithClientId("");
  }

  private static AdlsAdapter createAdapterWithClientId(String rootRelativePath) {
    String hostname = System.getenv("ADLS_HOSTNAME");
    String rootPath = System.getenv("ADLS_ROOTPATH");
    String tenant = System.getenv("ADLS_TENANT");
    String clientId = System.getenv("ADLS_CLIENTID");
    String clientSecret = System.getenv("ADLS_CLIENTSECRET");

    assertFalse(StringUtils.isNullOrEmpty(hostname));
    assertFalse(StringUtils.isNullOrEmpty(rootPath));
    assertFalse(StringUtils.isNullOrEmpty(tenant));
    assertFalse(StringUtils.isNullOrEmpty(clientId));
    assertFalse(StringUtils.isNullOrEmpty(clientSecret));

    return new AdlsAdapter(hostname, combinePath(rootPath, rootRelativePath), tenant, clientId, clientSecret);
  }

  private static String combinePath(String first, String second)
  {
    if (second == null || second.isEmpty())
    {
      return first;
    }

    if (first.endsWith("/"))
    {
      first = first.substring(0, first.length() - 1);
    }

    if (second.startsWith("/"))
    {
      second = second.substring(1);
    }

    return first + "/" + second;
  }

  private static void runWriteReadTest(AdlsAdapter adapter) {
    String filename = 
      "WriteReadTest/" + System.getenv("USERNAME") + "_" + System.getenv("COMPUTERNAME") + "_Java.txt";
    String writeContents = OffsetDateTime.now() + "\n" + filename;
    adapter.writeAsync(filename, writeContents).join();
    String readContents = adapter.readAsync(filename).join();
    assertEquals(writeContents, readContents);
  }

  private static void runCheckFileTimeTest(AdlsAdapter adapter) {
    OffsetDateTime offset1 =
        adapter.computeLastModifiedTimeAsync("/FileTimeTest/CheckFileTime.txt").join();
    OffsetDateTime offset2 =
        adapter.computeLastModifiedTimeAsync("FileTimeTest/CheckFileTime.txt").join();

    assertNotNull(offset1);
    assertNotNull(offset2);
    assertTrue(offset1.isEqual(offset2));
    assertTrue(offset1.isBefore(OffsetDateTime.now()));
  }

  private static void runFileEnumTest(AdlsAdapter adapter) {
    CacheContext context = adapter.createFileQueryCacheContext();
    try {
      List<String> files1 = adapter.fetchAllFilesAsync("/FileEnumTest/").join();
      List<String> files2 = adapter.fetchAllFilesAsync("/FileEnumTest").join();
      List<String> files3 = adapter.fetchAllFilesAsync("FileEnumTest/").join();
      List<String> files4 = adapter.fetchAllFilesAsync("FileEnumTest").join();

      // expect 100 files to be enumerated
      assertTrue(files1.size() == 100 && files2.size() == 100 && files3.size() == 100
          && files4.size() == 100);

      // these calls should be fast due to cache
      final long startTime = System.currentTimeMillis();
      for (int i = 0; i < files1.size(); i++) {
        assertTrue(files1.get(i).equals(files2.get(i)) && files1.get(i).equals(files3.get(i)) && files1.get(i).equals(files4.get(i)));
        adapter.computeLastModifiedTimeAsync(files1.get(i)).join();
      }
      final long stopTime = System.currentTimeMillis();

      assertTrue(stopTime - startTime < 100, "Cached file modified times");
    } 
    finally {
      context.dispose();
    }
  }

  private static void runSpecialCharactersTest(AdlsAdapter adapter)
  {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("adls", adapter);
    corpus.getStorage().setDefaultNamespace("adls");
    try
    {
      CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("default.manifest.cdm.json").join();
      manifest.fileStatusCheckAsync().join();

      assertEquals(manifest.getEntities().size(), 1);
      assertEquals(manifest.getEntities().get(0).getDataPartitions().size(), 2);
      assertEquals(
              "TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-0.csv",
              manifest.getEntities().get(0).getDataPartitions().get(0).getLocation());

      assertEquals(
              "TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-1.csv",
              manifest.getEntities().get(0).getDataPartitions().get(1).getLocation());
    }
    catch (Exception e) {
      Assert.fail(e.getMessage());
    }
  }

  @Test
  public void adlsWriteReadSharedKey() {
    runWriteReadTest(createAdapterWithSharedKey());
  }

  @Test
  public void adlsWriteReadClientId() {
    runWriteReadTest(createAdapterWithClientId());
  }

  @Test
  public void adlsCheckFileTimeSharedKey() {
    runCheckFileTimeTest(createAdapterWithSharedKey());
  }

  @Test
  public void adlsCheckFileTimeClientId() {
    runCheckFileTimeTest(createAdapterWithClientId());
  }

  @Test
  public void adlsFileEnumSharedKey() {
    runFileEnumTest(createAdapterWithSharedKey());
  }

  @Test
  public void adlsFileEnumClientId() {
    runFileEnumTest(createAdapterWithClientId());
  }

  @Test
  public void adlsSpecialCharactersTest()
  {
    runSpecialCharactersTest(createAdapterWithClientId("PathWithSpecialCharactersAndUnescapedStringTest/Root-With=Special Characters:"));
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

    // Check that an adapter path is correctly created from a corpus path with any namespace
    final String corpusPathWithNamespace1 = "adls:/test.json";
    final String corpusPathWithNamespace2 = "mylake:/test.json";
    final String expectedAdapterPath = "https://storageaccount.dfs.core.windows.net/fs/test.json";

    assertEquals(adlsAdapter.createAdapterPath(corpusPathWithNamespace1), expectedAdapterPath);
    assertEquals(adlsAdapter.createAdapterPath(corpusPathWithNamespace2), expectedAdapterPath);

    // Check that an adapter path is correctly created from a corpus path with colons
    final String corpusPathWithColons = "namespace:/a/path:with:colons/some-file.json";
    Assert.assertEquals(adlsAdapter.createAdapterPath(corpusPathWithColons),
        "https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json");
    Assert.assertEquals(adlsAdapter.createCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json"),
            "/a/path:with:colons/some-file.json");
    Assert.assertEquals(adlsAdapter.createCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%3awith%3acolons/some-file.json"),
            "/a/path:with:colons/some-file.json");

    // Check other special characters
    Assert.assertEquals(adlsAdapter.createAdapterPath("namespace:/a/path with=special=characters/some-file.json"), "https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3Dspecial%3Dcharacters/some-file.json");
    Assert.assertEquals(adlsAdapter.createCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3dcharacters/some-file.json"), "/a/path with=special=characters/some-file.json");
    Assert.assertEquals(adlsAdapter.createCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3Dcharacters/some-file.json"), "/a/path with=special=characters/some-file.json");

    // Check that an adapter path is null if the corpus path provided is null
    Assert.assertNull(adlsAdapter.createAdapterPath(null));

    final String host2 = "storageaccount.blob.core.windows.net:8888";
    adlsAdapter = new AdlsAdapter(host2, root, "", "", "");

    final String adapterPath5 = "https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv";
    final String adapterPath6 = "https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv";
    final String adapterPath7 = "https://storageaccount.blob.core.windows.net/fs/a/7.csv";

    assertEquals(adlsAdapter.createCorpusPath(adapterPath5), "/a/5.csv");
    assertEquals(adlsAdapter.createCorpusPath(adapterPath6), "/a/6.csv");
    assertNull(adlsAdapter.createCorpusPath(adapterPath7));
  }
  
  @Test
  public void fetchConfigAndUpdateConfig() {
    final AdlsAdapter adlsAdapter = new AdlsAdapter(
          "fake.dfs.core.windows.net",
          "fakeRoot",
          new FakeTokenProvider()
      );

    try {
      String resultConfig = adlsAdapter.fetchConfig();      
      JsonNode adapterConfigJson = JMapper.MAP.readTree(resultConfig);
      adlsAdapter.updateConfig(adapterConfigJson.get("config").toString());
    } catch (final Exception ex) {
      fail("AdlsAdapter initialized with token provider shouldn't throw exception when updating config.");
    }
  }

  /**
   * The secret property is not saved to the config.json file for security reasons. When
   * constructing and ADLS adapter from config, the user should be able to set the secret after the
   * adapter is constructed.
   */
  @Test
  public void fetchConfigAndUpdateConfigWithoutSecret() {
    final AdlsAdapter adlsAdapter = new AdlsAdapter();

    try {
      ObjectMapper mapper = new ObjectMapper();
      ObjectNode config = mapper.createObjectNode();
      config.put("root", "root");
      config.put("hostname", "hostname");
      config.put("tenant", "tenant");
      config.put("clientId", "clientId");
      adlsAdapter.updateConfig(config.toString());
      adlsAdapter.setClientId("clientId");
      adlsAdapter.setSharedKey("sharedKey");
    } catch (final Exception ex) {
      fail("AdlsAdapter initialized without secret shouldn't throw exception when updating config.");
    }
  }

  /**
  * Initialize Hostname and Root.
  */
  @Test
  public void testInitializeHostnameAndRoot() {
    String host1 = "storageaccount.dfs.core.windows.net";
    AdlsAdapter adlsAdapter1 = new AdlsAdapter(host1, "root-without-slash", "");
    assertEquals(adlsAdapter1.getHostname(), "storageaccount.dfs.core.windows.net");
    assertEquals(adlsAdapter1.getRoot(), "/root-without-slash");

    String adapterPath1 = "https://storageaccount.dfs.core.windows.net/root-without-slash/a/1.csv";
    String corpusPath1 = adlsAdapter1.createCorpusPath(adapterPath1);
    assertEquals(corpusPath1, "/a/1.csv");
    assertEquals(adlsAdapter1.createAdapterPath(corpusPath1), adapterPath1);

    AdlsAdapter adlsAdapter1WithFolders = new AdlsAdapter(host1, "root-without-slash/folder1/folder2", "");
    assertEquals(adlsAdapter1WithFolders.getRoot(), "/root-without-slash/folder1/folder2");
            
    String adapterPath2 = "https://storageaccount.dfs.core.windows.net/root-without-slash/folder1/folder2/a/1.csv";
    String corpusPath2 = adlsAdapter1WithFolders.createCorpusPath(adapterPath2);
    assertEquals(corpusPath2, "/a/1.csv");
    assertEquals(adlsAdapter1WithFolders.createAdapterPath(corpusPath2), adapterPath2);

    AdlsAdapter adlsAdapter2 = new AdlsAdapter(host1, "/root-starts-with-slash", "");
    assertEquals(adlsAdapter2.getRoot(), "/root-starts-with-slash");
    AdlsAdapter adlsAdapter2WithFolders = new AdlsAdapter(host1, "/root-starts-with-slash/folder1/folder2", "");
    assertEquals(adlsAdapter2WithFolders.getRoot(), "/root-starts-with-slash/folder1/folder2");

    AdlsAdapter adlsAdapter3 = new AdlsAdapter(host1, "root-ends-with-slash/", "");
    assertEquals(adlsAdapter3.getRoot(), "/root-ends-with-slash");
    AdlsAdapter adlsAdapter3WithFolders = new AdlsAdapter(host1, "root-ends-with-slash/folder1/folder2/", "");
    assertEquals(adlsAdapter3WithFolders.getRoot(), "/root-ends-with-slash/folder1/folder2");

    AdlsAdapter adlsAdapter4 = new AdlsAdapter(host1, "/root-with-slashes/", "");
    assertEquals(adlsAdapter4.getRoot(), "/root-with-slashes");
    AdlsAdapter adlsAdapter4WithFolders = new AdlsAdapter(host1, "/root-with-slashes/folder1/folder2/", "");
    assertEquals(adlsAdapter4WithFolders.getRoot(), "/root-with-slashes/folder1/folder2");

    try {
      // Mount from config
      String config = TestHelper.getInputFileContent(testSubpath, "TestInitializeHostnameAndRoot", "config.json");
      CdmCorpusDefinition corpus = new CdmCorpusDefinition();
      corpus.getStorage().mountFromConfig(config);
      assertEquals(((AdlsAdapter)corpus.getStorage().fetchAdapter("adlsadapter1")).getRoot(), "/root-without-slash");
      assertEquals(((AdlsAdapter)corpus.getStorage().fetchAdapter("adlsadapter2")).getRoot(), "/root-without-slash/folder1/folder2");
      assertEquals(((AdlsAdapter)corpus.getStorage().fetchAdapter("adlsadapter3")).getRoot(), "/root-starts-with-slash/folder1/folder2");
      assertEquals(((AdlsAdapter)corpus.getStorage().fetchAdapter("adlsadapter4")).getRoot(), "/root-ends-with-slash/folder1/folder2");
      assertEquals(((AdlsAdapter)corpus.getStorage().fetchAdapter("adlsadapter5")).getRoot(), "/root-with-slashes/folder1/folder2");
    } catch (Exception e) {
      Assert.fail(e.getMessage());
    }
  }
}
