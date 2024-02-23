// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.AdlsTestHelper;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.AzureCloudEndpoint;
import com.microsoft.commondatamodel.objectmodel.enums.CdmIncrementalPartitionType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.enums.PartitionFileStatusCheckType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase.CacheContext;
import com.microsoft.commondatamodel.objectmodel.storage.testAdapters.MockAdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.FileStatusCheckOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import com.microsoft.commondatamodel.objectmodel.utilities.network.TokenProvider;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.CompletionException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.assertNull;
import static org.testng.Assert.assertTrue;
import static org.testng.Assert.fail;

public class AdlsAdapterTest {

  private final String testSubpath = "Storage";

  private static class FakeTokenProvider implements TokenProvider {
    public String getToken() {
      return "TOKEN";
    }
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
    } finally {
      context.dispose();
    }
  }

  private static void runSpecialCharactersTest(AdlsAdapter adapter) {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("adls", adapter);
    corpus.getStorage().setDefaultNamespace("adls");
    try {
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
    } catch (Exception e) {
      Assert.fail(e.getMessage());
    }
  }

  @Test
  public void adlsWriteReadSharedKey() {
    AdlsTestHelper.checkADLSEnvironment();
    runWriteReadTest(AdlsTestHelper.createAdapterWithSharedKey());
  }

  @Test
  public void adlsWriteReadClientId() {
    AdlsTestHelper.checkADLSEnvironment();
    runWriteReadTest(AdlsTestHelper.createAdapterWithClientId());
  }

  @Test
  public void adlsWriteReadClientIdWithEndpoint() {
    AdlsTestHelper.checkADLSEnvironment();
    runWriteReadTest(AdlsTestHelper.createAdapterWithClientId(true));
  }

  @Test
  public void adlsWriteReadWithBlobHostName() {
    AdlsTestHelper.checkADLSEnvironment();
    runWriteReadTest(AdlsTestHelper.createAdapterWithSharedKey("", true));
    runWriteReadTest(AdlsTestHelper.createAdapterWithClientId("", false, true));
  }

  @Test
  public void adlsCheckFileTimeSharedKey() {
    AdlsTestHelper.checkADLSEnvironment();
    runCheckFileTimeTest(AdlsTestHelper.createAdapterWithSharedKey());
  }

  @Test
  public void adlsCheckFileTimeClientId() {
    AdlsTestHelper.checkADLSEnvironment();
    runCheckFileTimeTest(AdlsTestHelper.createAdapterWithClientId());
  }

  @Test
  public void adlsFileEnumSharedKey() {
    AdlsTestHelper.checkADLSEnvironment();
    runFileEnumTest(AdlsTestHelper.createAdapterWithSharedKey());
  }

  @Test
  public void adlsFileEnumClientId() {
    AdlsTestHelper.checkADLSEnvironment();
    runFileEnumTest(AdlsTestHelper.createAdapterWithClientId());
  }

  @Test
  public void adlsSpecialCharactersTest() {
    AdlsTestHelper.checkADLSEnvironment();
    runSpecialCharactersTest(AdlsTestHelper.createAdapterWithClientId("PathWithSpecialCharactersAndUnescapedStringTest/Root-With=Special Characters:"));
  }

  /**
   * Tests if the adapter won't retry if a HttpStatusCode response with a code in AvoidRetryCodes is received.
   */
  @Test
  public void testAvoidRetryCodes() {
    AdlsTestHelper.checkADLSEnvironment();
    AdlsAdapter adlsAdapter = AdlsTestHelper.createAdapterWithSharedKey();
    adlsAdapter.setNumberOfRetries(3);

    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("adls", adlsAdapter);
    AtomicInteger count = new AtomicInteger();
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Response for request ")) {
        count.getAndIncrement();
      }
    }, CdmStatusLevel.Progress);
    ;

    corpus.<CdmDocumentDefinition>fetchObjectAsync("adls:/inexistentFile.cdm.json").join();

    Assert.assertEquals(count.get(), 1);
  }

  /**
   * Test if the adapter handles requests correctly when the adls hostname contains https
   */
  @Test
  public void testHttpsHostname() {
    AdlsTestHelper.checkADLSEnvironment();
    String filename =
            "HTTPSWriteTest/" + System.getenv("USERNAME") + "_" + System.getenv("COMPUTERNAME") + "_Java.txt";
    AdlsAdapter adlsAdapter = AdlsTestHelper.createAdapterWithSharedKey("", false, true);
    try {
      adlsAdapter.readAsync(filename).join();
      adlsAdapter.computeLastModifiedTimeAsync(filename).join();
    } catch (Exception ex) {
      if (ex instanceof NullPointerException || ex.getCause() instanceof NullPointerException) {
        Assert.fail(ex.getMessage());
      }
    }
  }

  /**
   * Checks if the endpoint of the adls adapter is set to default if not present in the config parameters.
   * This is necessary to support old config files that do not include an "endpoint".
   */
  @Test
  public void testEndpointMissingOnConfig() throws JsonProcessingException, IOException {
    ObjectNode config = JsonNodeFactory.instance.objectNode();
    config.put("hostname", "hostname.dfs.core.windows.net");
    config.put("root", "root");
    config.put("tenant", "tenant");
    config.put("clientId", "clientId");
    AdlsAdapter adlsAdapter = new AdlsAdapter();
    adlsAdapter.updateConfig(JMapper.WRITER.writeValueAsString(config));
    Assert.assertEquals(adlsAdapter.getEndpoint(), AzureCloudEndpoint.AzurePublic);
  }

  /**
   * Test if formattedHostname is properly set when loading from config.
   */
  @Test
  public void testFormattedHostnameFromConfig() throws IOException {
    ObjectNode config = JsonNodeFactory.instance.objectNode();
    config.put("hostname", "hostname.dfs.core.windows.net");
    config.put("root", "root");
    config.put("tenant", "tenant");
    config.put("clientId", "clientId");
    AdlsAdapter adlsAdapter = new AdlsAdapter();
    adlsAdapter.updateConfig(JMapper.WRITER.writeValueAsString(config));

    String corpusPath = adlsAdapter.createCorpusPath("https://hostname.dfs.core.windows.net/root/partitions/data.csv");
    Assert.assertEquals(corpusPath, "/partitions/data.csv");
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
    ObjectMapper mapper = new ObjectMapper();
    ObjectNode config = mapper.createObjectNode();
    config.put("root", "root");
    config.put("hostname", "hostname");
    config.put("tenant", "tenant");
    config.put("clientId", "clientId");

    try {
      final AdlsAdapter adlsAdapter1 = new AdlsAdapter();
      adlsAdapter1.updateConfig(config.toString());
      adlsAdapter1.setClientId("clientId");
      adlsAdapter1.setSecret("secret");
      adlsAdapter1.setSharedKey("sharedKey");
      adlsAdapter1.setTokenProvider(new FakeTokenProvider());
    } catch (final Exception ex) {
      fail("AdlsAdapter initialized without secret shouldn't throw exception when updating config.");
    }

    try {
      final AdlsAdapter adlsAdapter2 = new AdlsAdapter();
      adlsAdapter2.setClientId("clientId");
      adlsAdapter2.setSecret("secret");
      adlsAdapter2.setSharedKey("sharedKey");
      adlsAdapter2.setTokenProvider(new FakeTokenProvider());
      adlsAdapter2.updateConfig(config.toString());
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
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter1")).getRoot(), "/root-without-slash");
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter2")).getRoot(), "/root-without-slash/folder1/folder2");
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter3")).getRoot(), "/root-starts-with-slash/folder1/folder2");
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter4")).getRoot(), "/root-ends-with-slash/folder1/folder2");
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter5")).getRoot(), "/root-with-slashes/folder1/folder2");
    } catch (Exception e) {
      Assert.fail(e.getMessage());
    }
  }

  /**
   * Test hostname with leading protocol.
   */
  @Test
  public void TestHostnameWithLeadingProtocol() {
    try {
      String host1 = "https://storageaccount.dfs.core.windows.net";
      AdlsAdapter adlsAdapter1 = new AdlsAdapter(host1, "root-without-slash", "");
      String adapterPath = "https://storageaccount.dfs.core.windows.net/root-without-slash/a/1.csv";
      String corpusPath1 = adlsAdapter1.createCorpusPath(adapterPath);
      assertEquals(adlsAdapter1.getHostname(), "https://storageaccount.dfs.core.windows.net");
      assertEquals(corpusPath1, "/a/1.csv");
      assertEquals(adlsAdapter1.createAdapterPath(corpusPath1), adapterPath);

      String host2 = "HttPs://storageaccount.dfs.core.windows.net";
      AdlsAdapter adlsAdapter2 = new AdlsAdapter(host2, "root-without-slash", "");
      String corpusPath2 = adlsAdapter2.createCorpusPath(adapterPath);
      assertEquals(adlsAdapter2.getHostname(), "HttPs://storageaccount.dfs.core.windows.net");
      assertEquals(corpusPath2, "/a/1.csv");
      assertEquals(adlsAdapter2.createAdapterPath(corpusPath2), adapterPath);

      try {
        String host3 = "http://storageaccount.dfs.core.windows.net";
        AdlsAdapter adlsAdapter3 = new AdlsAdapter(host3, "root-without-slash", "");
        Assert.fail("Expected Exception for using a http:// hostname.");
      } catch (Exception ex) {
        Assert.assertTrue(ex instanceof IllegalArgumentException);
      }

      try {
        String host4 = "https://bar:baz::]/foo/";
        AdlsAdapter adlsAdapter4 = new AdlsAdapter(host4, "root-without-slash", "");
        Assert.fail("Expected Exception for using an invalid hostname.");
      } catch (IllegalArgumentException ex) {
        Assert.assertNotNull(ex);
      }
    } catch (Exception ex) {
      Assert.assertTrue(ex instanceof IllegalArgumentException);
    }
  }

  /**
   * Test azure cloud endpoint in config.
   */
  @Test
  public void testLoadingAndSavingEndpointInConfig() {
    try {
      // Mount from config
      String config = TestHelper.getInputFileContent(testSubpath, "TestLoadingAndSavingEndpointInConfig", "config.json");
      CdmCorpusDefinition corpus = new CdmCorpusDefinition();
      corpus.getStorage().mountFromConfig(config);
      assertNull(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter1")).getEndpoint());
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter2")).getEndpoint(), AzureCloudEndpoint.AzurePublic);
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter3")).getEndpoint(), AzureCloudEndpoint.AzureChina);
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter4")).getEndpoint(), AzureCloudEndpoint.AzureGermany);
      assertEquals(((AdlsAdapter) corpus.getStorage().fetchAdapter("adlsadapter5")).getEndpoint(), AzureCloudEndpoint.AzureUsGovernment);

      try {
        String configSnakeCase = TestHelper.getInputFileContent(testSubpath, "TestLoadingAndSavingEndpointInConfig", "config-SnakeCase.json");
        CdmCorpusDefinition corpusSnakeCase = new CdmCorpusDefinition();
        corpusSnakeCase.getStorage().mountFromConfig(configSnakeCase);
        fail("Expected RuntimeException for config.json using endpoint value in snake case.");
      } catch (RuntimeException re) {
        String message = "Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.";
        assertEquals(re.getMessage(), message);
      }

    } catch (Exception e) {
      Assert.fail(e.getMessage());
    }
  }

  /**
   * Tests writing null content to ADLS. Expected behavior is not to leave any 0 byte file behind.
   */
  @Test
  public void adlsWriteClientIdNullContentsNoEmptyFileLeft() {
    AdlsTestHelper.checkADLSEnvironment();
    AdlsAdapter adlsAdapter = AdlsTestHelper.createAdapterWithClientId();
    adlsAdapter.setCtx(new ResolveContext(null));
    adlsAdapter.getCtx().setFeatureFlags(Collections.singletonMap("ADLSAdapter_deleteEmptyFile", true));

    String filename = "nullcheck_Java.txt";
    String writeContents = null;
    try {
      adlsAdapter.writeAsync(filename, writeContents).join();
    } catch (Exception e) {
      assertNotNull(e.getMessage());
    }

    try {
      adlsAdapter.readAsync(filename).join();
    } catch (CompletionException e) {
      assertTrue(e.getMessage().contains("HTTP 404 - The specified path does not exist"));
    }
  }

  /**
   * Tests writing empty content to ADLS. Expected behavior is not to leave any 0 byte file behind.
   */
  @Test
  public void adlsWriteClientIdEmptyContentsNoEmptyFileLeft() {
    AdlsTestHelper.checkADLSEnvironment();
    AdlsAdapter adlsAdapter = AdlsTestHelper.createAdapterWithClientId();

    String filename = "emptycheck_Java.txt";
    String writeContents = "";
    try {
      adlsAdapter.writeAsync(filename, writeContents).join();
    } catch (Exception e) {
    }

    try {
      adlsAdapter.readAsync(filename).join();
    } catch (CompletionException e) {
      assertTrue(e.getMessage().contains("HTTP 404 - The specified path does not exist"));
    }
  }

  /**
   * Tests writing large file content to ADLS. Expected behavior is not to leave any 0 byte file behind.
   */
  @Test
  public void adlsWriteClientIdLargeFileContentsNoEmptyFileLeft() {
    AdlsTestHelper.checkADLSEnvironment();
    AdlsAdapter adlsAdapter = AdlsTestHelper.createAdapterWithClientId();
    adlsAdapter.setCtx(new ResolveContext(null));
    adlsAdapter.getCtx().setFeatureFlags(Collections.singletonMap("ADLSAdapter_deleteEmptyFile", true));

    String filename = "largefilecheck_Java.txt";
    char[] chars = new char[100000000];
    String writeContents = new String(chars);

    try {
      adlsAdapter.writeAsync(filename, writeContents).join();
    } catch (Exception e) {
    }

    try {
      adlsAdapter.readAsync(filename).join();
    } catch (CompletionException e) {
      assertTrue(e.getMessage().contains("HTTP 404 - The specified path does not exist"));
    }
  }

  /**
   * Tests that ADLS upload error on write are handled correctly
   */
  @Test
  public void adlsWriteUploadError() throws InterruptedException {
    AdlsTestHelper.checkADLSEnvironment();
    // first request creates an empty file
    CdmHttpResponse firstResponse = new CdmHttpResponse(201);
    firstResponse.setSuccessful(true);

    // second request to throw error
    CdmHttpResponse secondResponse = new CdmHttpResponse(404);
    secondResponse.setSuccessful(true);

    // before error is logged, request is made to delete content at path
    CdmHttpResponse thirdResponse = new CdmHttpResponse();
    thirdResponse.setSuccessful(true);

    CdmHttpClient mockHttpClient = mock(CdmHttpClient.class);
    when(mockHttpClient.sendAsync(any(), any(), any()))
            .thenReturn(CompletableFuture.completedFuture(firstResponse))
            .thenReturn(CompletableFuture.completedFuture(secondResponse))
            .thenReturn(CompletableFuture.completedFuture(thirdResponse));

    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(testSubpath, "adlsWriteUploadError");
    final AtomicBoolean uploadedDataNotAcceptedError = new AtomicBoolean(false);
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Could not write ADLS content at path, there was an issue at \"/someDoc.cdm.json\" during the append action.")) {
        uploadedDataNotAcceptedError.set(true);
      }
    }, CdmStatusLevel.Error);
    corpus.getStorage().mount("adls", new MockAdlsAdapter(mockHttpClient));
    CdmFolderDefinition adlsFolder = corpus.getStorage().getNamespaceFolders().get("adls");
    CdmDocumentDefinition someDoc = adlsFolder.getDocuments().add("someDoc");
    someDoc.saveAsAsync("someDoc.cdm.json").join();
    assertTrue(uploadedDataNotAcceptedError.get());
  }

  /**
   * Tests that ADLS flush error on write are handled correctly
   */
  @Test
  public void adlsWriteFlushError() throws InterruptedException {
    AdlsTestHelper.checkADLSEnvironment();
    // first request creates an empty file
    CdmHttpResponse firstResponse = new CdmHttpResponse(201);
    firstResponse.setSuccessful(true);

    // second request is accepted, uploaded data worked correctly
    CdmHttpResponse secondResponse = new CdmHttpResponse(202);
    secondResponse.setSuccessful(true);

    // before error is logged, request is made to delete content at path
    CdmHttpResponse thirdResponse = new CdmHttpResponse();
    thirdResponse.setSuccessful(true);

    // this failure occurs when data was not flushed correctly
    CdmHttpResponse fourthResponse = new CdmHttpResponse(304);
    fourthResponse.setSuccessful(true);

    CdmHttpClient mockHttpClient = mock(CdmHttpClient.class);
    when(mockHttpClient.sendAsync(any(), any(), any()))
            .thenReturn(CompletableFuture.completedFuture(firstResponse))
            .thenReturn(CompletableFuture.completedFuture(secondResponse))
            .thenReturn(CompletableFuture.completedFuture(thirdResponse))
            .thenReturn(CompletableFuture.completedFuture(fourthResponse));

    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(testSubpath, "adlsWriteFlushError");
    final AtomicBoolean noFlushErrorHit = new AtomicBoolean(false);
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Could not write ADLS content at path, there was an issue at \"/someDoc.cdm.json\" during the flush action.")) {
        noFlushErrorHit.set(true);
      }
    }, CdmStatusLevel.Error);
    corpus.getStorage().mount("adls", new MockAdlsAdapter(mockHttpClient));
    CdmFolderDefinition adlsFolder = corpus.getStorage().getNamespaceFolders().get("adls");
    CdmDocumentDefinition someDoc = adlsFolder.getDocuments().add("someDoc");
    someDoc.saveAsAsync("someDoc.cdm.json").join();
    assertTrue(noFlushErrorHit.get());
  }

  /**
   * Tests refreshing data partition gets file size in ADLS
   */
  @Test
  public void testADLSRefreshesDataPartition() throws Exception {
    AdlsTestHelper.checkADLSEnvironment();
    final AdlsAdapter adlsAdapter = AdlsTestHelper.createAdapterWithSharedKey();

    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("adls", adlsAdapter);
    final CdmManifestDefinition cdmManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("adls:/TestPartitionMetadata/partitions.manifest.cdm.json").join();
    final FileStatusCheckOptions fileStatusCheckOptions = new FileStatusCheckOptions(true);

    final CdmEntityDeclarationDefinition partitionEntity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 1);
    final CdmDataPartitionDefinition partition = partitionEntity.getDataPartitions().get(0);

    cdmManifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType.None, fileStatusCheckOptions).join();

    int localTraitIndex = partition.getExhibitsTraits().indexOf("is.partition.size");
    Assert.assertNotEquals(localTraitIndex, -1);
    final CdmTraitReference localTrait = (CdmTraitReference) partition.getExhibitsTraits().get(localTraitIndex);
    Assert.assertEquals(localTrait.getNamedReference(), "is.partition.size");
    Assert.assertEquals(localTrait.getArguments().get(0).getValue(), (long) 2);
  }
}
