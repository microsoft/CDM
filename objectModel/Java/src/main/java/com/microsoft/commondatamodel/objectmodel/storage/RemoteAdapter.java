package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class RemoteAdapter extends NetworkAdapter implements StorageAdapter {
  static final String TYPE = "remote";

  private final Map<String, String> sources = new HashMap<>();
  private final Map<String, Map<String, String>> sourcesById = new HashMap<>();

  private Map<String, String> hosts;
  private String locationHint;

  /**
   * The default constructor, a user has to apply JSON config or add hosts after creating it this way.
   */
  public RemoteAdapter() {
    // Create a new CdmHttp Client without base URL.
    this.httpClient = new CdmHttpClient();
  }

  public void addHost(final String key, final String adapterPath) {
    getOrRegisterHostInfo(adapterPath, key);
  }

  public boolean canRead() {
    return true;
  }

  @Override
  public String fetchConfig() {
    final ObjectNode resultConfig = JsonNodeFactory.instance.objectNode();
    resultConfig.put("type", TYPE);

    final ArrayNode hostsArray = JsonNodeFactory.instance.arrayNode();
    final ObjectNode configObject = JsonNodeFactory.instance.objectNode();

    // Go through the Hosts dictionary and build a JObject for each item.
    for (final Map.Entry<String, String> stringStringEntry : this.hosts.entrySet()) {
      final ObjectNode hostItem = JsonNodeFactory.instance.objectNode();
      hostItem.put(stringStringEntry.getKey(), stringStringEntry.getValue());
      hostsArray.add(hostItem);
    }

    // Try constructing network configs.
    configObject.put("hosts", hostsArray);
    for (final Map.Entry<String, JsonNode> stringJsonNodeEntry : this.fetchNetworkConfig().entrySet()) {
      configObject.set(stringJsonNodeEntry.getKey(), stringJsonNodeEntry.getValue());
    }

    if (this.locationHint != null) {
      configObject.put("locationHint", this.locationHint);
    }

    resultConfig.put("config", configObject);
    try {
      return JMapper.WRITER.writeValueAsString(resultConfig);
    } catch (final JsonProcessingException e) {
      throw new StorageAdapterException("", e);
    }
  }

  public boolean canWrite() {
    return false;
  }

  public void clearCache() {
    sources.clear();
    sourcesById.clear();
  }

  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) {
    return CompletableFuture.completedFuture(OffsetDateTime.now());
  }

  public CompletableFuture<List<String>> fetchAllFilesAsync(final String currFullPath) {
    // TODO
    return CompletableFuture.completedFuture(null);
  }

  public String createAdapterPath(final String corpusPath) throws StorageAdapterException {
    final Map<String, String> urlConfig = getUrlConfig(corpusPath);
    final String protocol = urlConfig.get("protocol");
    final String host = urlConfig.get("host");
    final String path = urlConfig.get("path");

    return protocol + "://" + host + path;
  }

  public String createCorpusPath(final String adapterPath) {
    final int protocolIndex = adapterPath.indexOf("://");

    if (protocolIndex == -1) {
      return null;
    }

    final int pathIndex = adapterPath.indexOf("/", protocolIndex + 3);
    final String path = pathIndex != -1 ? adapterPath.substring(pathIndex) : "";

    final Map hostInfo = getOrRegisterHostInfo(adapterPath);
    return String.format("/%s%s", hostInfo.get("key"), path);
  }

  public CompletableFuture<String> readAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {

      final String path = createAdapterPath(corpusPath);

      final Map<String, String> headers = new HashMap<>();
      headers.put("User-Agent", "CDM");

      final CdmHttpRequest cdmHttpRequest = this.setUpCdmRequest(path, headers, "GET");
      try {
        final CdmHttpResponse res = this.readOrWrite(cdmHttpRequest).get();
        return (res != null) ? res.getContent() : null;
      } catch (final Exception e) {
        throw new StorageAdapterException("Could not read remote content at path: " + corpusPath, e);
      }
    });
  }

  public CompletableFuture<Void> writeAsync(final String corpusPath, final String data) {
    throw new UnsupportedOperationException();
  }

  private Map<String, String> getOrRegisterHostInfo(final String adapterPath) {
    return getOrRegisterHostInfo(adapterPath, null);
  }

  /**
   * Creates a corpus path for the given adapter path and folder key.
   *
   * @param adapterPath Adapter path
   * @param key         CdmFolderDefinition key
   */
  private Map<String, String> getOrRegisterHostInfo(final String adapterPath, final String key) {

    final int protocolIndex = adapterPath.indexOf("://");

    if (protocolIndex == -1) {
      return null;
    }

    final int pathIndex = adapterPath.indexOf("/", protocolIndex + 3);
    final int hostIndex = pathIndex != -1 ? pathIndex : adapterPath.length();

    final String protocol = adapterPath.substring(0, protocolIndex);
    final String host = adapterPath.substring(protocolIndex + 3, hostIndex);

    final String fullHost = adapterPath.substring(0, hostIndex);

    if (!sources.containsKey(fullHost)) {
      final String guid = key != null ? key : getGuid();
      sources.put(fullHost, guid);

      final Map<String, String> sourceId = new HashMap<>();
      sourceId.put("protocol", protocol);
      sourceId.put("host", host);

      sourcesById.put(guid, sourceId);
    }

    final Map<String, String> result = new HashMap<>();
    result.put("key", sources.get(fullHost));
    result.put("protocol", protocol);
    result.put("host", host);

    return result;
  }

  @Override
  public void updateConfig(final String config) throws IOException {
    if (config == null) {
      throw new StorageAdapterException("Remote adapter needs a config.");
    }
    this.updateNetworkConfig(config);
    final JsonNode configsJson = JMapper.MAP.readTree(config);
    if (configsJson.has("locationHint")) {
      this.locationHint = configsJson.get("locationHint").asText();
    }

    if (configsJson.has("hosts") && configsJson.get("hosts").isArray()) {
      final ArrayNode hosts = (ArrayNode) configsJson.get("hosts");
      // Create a temporary dictionary.
      final Map<String, String> hostsDict = new HashMap<>();
      // Iterate through all of the items in the hosts array.
      for (final JsonNode host : hosts) {
        // Get the property's key and value and save it to the dictionary.
        host.fields().forEachRemaining(entry -> {
          hostsDict.put(entry.getKey(), entry.getValue().asText());
        });
      }
      this.hosts = hostsDict;
    }
  }

  private String getGuid() {
    return UUID.randomUUID().toString();
  }

  /**
   * Returns the URL config associated with the specified corpus path.
   *
   * @param corpusPath The corpus path
   */
  private Map<String, String> getUrlConfig(final String corpusPath) throws StorageAdapterException {
    final int hostKeyIndex = corpusPath.indexOf("/", 1);
    final String hostKey = corpusPath.substring(1, hostKeyIndex);

    if (!this.sourcesById.containsKey(hostKey)) {
      throw new StorageAdapterException("Host id not identified by remote adapter. " +
              "Make sure to use createCorpusPath to get the corpus path.");
    }

    final String path = corpusPath.substring(hostKeyIndex);
    final Map<String, String> config = sourcesById.get(hostKey);

    final Map<String, String> result = new HashMap<>();
    result.put("protocol", config.get("protocol"));
    result.put("host", config.get("host"));
    result.put("path", path);

    return result;
  }

  @Override
  public String getLocationHint() {
    return locationHint;
  }

  @Override
  public void setLocationHint(final String locationHint) {
    this.locationHint = locationHint;
  }
}
