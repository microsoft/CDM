package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmContainerDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StorageManager {
  private static final Logger LOGGER = LoggerFactory.getLogger(StorageManager.class);

  private final CdmCorpusDefinition corpus;
  private final Map<String, CdmFolderDefinition> namespaceFolder = new LinkedHashMap<>();

  private String defaultNamespace;
  private Map<String, StorageAdapter> namespaceAdapters = new LinkedHashMap<>();

  // The namespaces that have default adapters defined by the program and not by a user.
  private Set<String> systemDefinedNamespaces;

  public StorageManager(final CdmCorpusDefinition corpus) {
    this.corpus = corpus;
    this.systemDefinedNamespaces = new HashSet<>();

    // Set up default adapters.
    this.mount("local", new LocalAdapter(System.getProperty("user.dir")));
    this.mount("cdm", new GithubAdapter());

    systemDefinedNamespaces.add("local");
    systemDefinedNamespaces.add("cdm");
  }

  /**
   * @param objectPath
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ImmutablePair<String, String> splitNamespacePath(final String objectPath) {
    if (objectPath != null && objectPath.contains(":")) {
      return new ImmutablePair<>(
          objectPath.substring(0, objectPath.indexOf(":")),
          objectPath.substring(objectPath.indexOf(":") + 1));
    }
    return new ImmutablePair<>("", objectPath);
  }

  public void mount(final String nameSpace, final StorageAdapter adapter) {
    if (adapter != null) {
      this.namespaceAdapters.put(nameSpace, adapter);
      final CdmFolderDefinition fd = new CdmFolderDefinition(this.corpus.getCtx(), "");
      fd.setCorpus(this.corpus);
      fd.setNamespace(nameSpace);
      fd.setFolderPath("/");
      this.namespaceFolder.put(nameSpace, fd);
      this.systemDefinedNamespaces.remove(nameSpace);
    }
  }

  public List<String> mount(final String adapterConfig) {
    return mount(adapterConfig, false);
  }

  public List<String> mount(final String adapterConfig, final boolean doesReturnErroList) {
    if (Strings.isNullOrEmpty(adapterConfig)) {
      LOGGER.error("Adapter config cannot be null or empty.");
      return null;
    }
    JsonNode adapterConfigJson = null;
    try {
      adapterConfigJson = JMapper.MAP.readTree(adapterConfig);
    } catch (final IOException e) {
      throw new StorageAdapterException("Failed to convert config jsonNode", e);
    }
    if (adapterConfigJson.has("appId")) {
      this.corpus.setAppId(adapterConfigJson.get("appId").asText());
    }
    if (adapterConfigJson.has("defaultNamespace")) {
      this.defaultNamespace = adapterConfigJson.get("defaultNamespace").asText();
    }
    final List<String> unrecognizedAdapters = new ArrayList<>();
    for (final JsonNode item : adapterConfigJson.get("adapters")) {
      final String nameSpace;
      // Check whether the namespace exists.
      if (item.has("namespace")) {
        nameSpace = item.get("namespace").asText();
      } else {
        LOGGER.error("The namespace is missing for one of the adapters in the JSON config.");
        continue;
      }
      final JsonNode configs;
      // Check whether the config exists.
      if (item.has("config")) {
        configs = item.get("config");
      } else {
        LOGGER.error("Missing JSON config for the namespace {}.", nameSpace);
        continue;
      }
      if (!item.has("type")) {
        LOGGER.error("Missing type in the JSON config for the namespace {}.", nameSpace);
        continue;
      }
      try {
        final String itemType = item.get("type").asText();
        StorageAdapter adapter = null;

        if (LocalAdapter.TYPE.equals(itemType)) {
          adapter = new LocalAdapter();
        } else if (GithubAdapter.TYPE.equals(itemType)) {
          adapter = new GithubAdapter();
        } else if (RemoteAdapter.TYPE.equals(itemType)) {
          adapter = new RemoteAdapter();
        } else if (AdlsAdapter.TYPE.equals(itemType)) {
          adapter = new AdlsAdapter();
        } else {
          unrecognizedAdapters.add(JMapper.WRITER.writeValueAsString(item));
        }

        if (adapter != null) {
          adapter.updateConfig(JMapper.WRITER.writeValueAsString(configs));
          this.mount(nameSpace, adapter);
        }
      } catch (final JsonProcessingException e) {
        throw new StorageAdapterException("Failed to process config as String", e);
      } catch (final MalformedURLException e) {
        throw new StorageAdapterException("Config contains malformed URL.", e);
      } catch (final IOException e) {
        throw new StorageAdapterException("Failed to construct adapter. AdapterType: " + item.get("type").asText(), e);
      }
    }
    return doesReturnErroList ? unrecognizedAdapters : null;
  }

  public boolean unmount(final String nameSpace) {
    if (this.namespaceAdapters.containsKey(nameSpace)) {
      this.namespaceAdapters.remove(nameSpace);
      this.namespaceFolder.remove(nameSpace);
      this.systemDefinedNamespaces.remove(nameSpace);

      // The special case, use resource adapter.
      if (nameSpace.equals("cdm")) {
        this.mount(nameSpace, new ResourceAdapter());
      }

      return true;
    } else {
      LOGGER.warn("Cannot remove the adapter from non-existing namespace.");
      return false;
    }
  }


  /**
   * Allow replacing a storage adapter with another one for testing, leaving folders intact.
   *
   * @param nameSpace
   * @param adapter
   * @deprecated This should only be used for testing only. And is very likely to be removed from
   * public interface.
   */
  @Deprecated
  public void setAdapter(String nameSpace, StorageAdapter adapter) {
    if (adapter != null) {
      this.namespaceAdapters.put(nameSpace, adapter);
    }
  }

  public StorageAdapter fetchAdapter(final String nameSpace) {
    if (this.namespaceFolder.containsKey(nameSpace)) {
      return this.namespaceAdapters.get(nameSpace);
    }
    LOGGER.error("Adapter not found for the namespace '{}'", nameSpace);
    return null;
  }

  public CdmFolderDefinition fetchRootFolder(final String nameSpace) {
    if (this.namespaceFolder.containsKey(nameSpace)) {
      return this.namespaceFolder.get(nameSpace);
    } else if (this.namespaceFolder.containsKey(this.defaultNamespace)) {
      return this.namespaceFolder.get(this.defaultNamespace);
    }
    LOGGER.error("Adapter not found for the namespace '{}'", nameSpace);
    return null;
  }

  public String adapterPathToCorpusPath(final String adapterPath) {
    for (final Map.Entry<String, StorageAdapter> kv : this.namespaceAdapters.entrySet()) {
      final String corpusPath = kv.getValue().createCorpusPath(adapterPath);
      if (corpusPath != null) {
        // got one, add the prefix
        return kv.getKey() + ":" + corpusPath;
      }
    }
    LOGGER.error("No registered storage adapter understood the path '{}'", adapterPath);
    return null;
  }

  public String corpusPathToAdapterPath(final String corpusPath) {
    final ImmutablePair<String, String> pathTuple = this.splitNamespacePath(corpusPath);
    final String nameSpace = pathTuple.getLeft() != null ? pathTuple.getLeft() : this.defaultNamespace;
    if (this.fetchAdapter(nameSpace) == null) {
      LOGGER.error("The namespace '{}' has not been registered", nameSpace);
      return "";
    }
    return this.fetchAdapter(nameSpace).createAdapterPath(pathTuple.getRight());
  }

  public String createAbsoluteCorpusPath(final String objectPath) {
    return this.createAbsoluteCorpusPath(objectPath, null);
  }

  public String createAbsoluteCorpusPath(final String objectPath, final CdmObject obj) {
    if (this.containsUnsupportedPathFormat(objectPath)) {
      // already called statusRpt when checking for unsupported path format.
      return null;
    }
    final ImmutablePair<String, String> pathTuple = this.splitNamespacePath(objectPath);
    final String nameSpace = pathTuple.getLeft();
    String newObjectPath = pathTuple.getRight();
    String finalNamespace;
    String prefix = "";
    String namespaceFromObj = "";
    if (obj instanceof CdmContainerDefinition) {
      prefix = ((CdmContainerDefinition) obj).getFolderPath();
      namespaceFromObj = ((CdmContainerDefinition) obj).getNamespace();
    } else if (obj != null) {
      prefix = obj.getInDocument().getFolderPath();
      namespaceFromObj = obj.getInDocument().getNamespace();
    }
    if (prefix != null && this.containsUnsupportedPathFormat(prefix)) {
      // already called statusRpt when checking for unsupported path format.
      return null;
    }
    if (!Strings.isNullOrEmpty(prefix) && prefix.charAt(prefix.length() - 1) != '/') {
      LOGGER.warn("Expected path prefix to end in /, but it didn't. Appended the /, prefix: '{}'", prefix);
      prefix += "/";
    }
    // check if this is a relative path
    if (!Strings.isNullOrEmpty(newObjectPath) && !newObjectPath.startsWith("/")) {
      if (obj == null) {
        // relative path and no other info given, assume default and root
        prefix = "/";
      }
      if (!Strings.isNullOrEmpty(nameSpace) && !Objects.equals(nameSpace, namespaceFromObj)) {
        LOGGER.error("The namespace '{}' found on the path does not match the namespace found on the object", nameSpace);
        return null;
      }
      newObjectPath = prefix + pathTuple.getRight();
      finalNamespace = namespaceFromObj;
      if (Strings.isNullOrEmpty(finalNamespace)) {
        finalNamespace = StringUtils.isNullOrTrimEmpty(pathTuple.getLeft()) ? this.defaultNamespace : pathTuple.getLeft();
      }
    } else {
      finalNamespace = StringUtils.isNullOrTrimEmpty(pathTuple.getLeft()) ? namespaceFromObj : pathTuple.getLeft();
      if (Strings.isNullOrEmpty(finalNamespace)) {
        finalNamespace = this.defaultNamespace;
      }
    }
    return (!StringUtils.isNullOrTrimEmpty(finalNamespace) ? finalNamespace + ":" : "") + newObjectPath;
  }

  /**
   * Fetches the config.
   *
   * @return The JSON string representing the config.
   */
  public String fetchConfig() {
    final ArrayNode adaptersArray = JsonNodeFactory.instance.arrayNode();

    // Construct the JObject for each adapter.
    for (final Map.Entry<String, StorageAdapter> namespaceAdapterTuple : this.namespaceAdapters.entrySet()) {
      // Skip system-defined adapters and resource adapters.
      if (this.systemDefinedNamespaces.contains(namespaceAdapterTuple.getKey())
          || namespaceAdapterTuple.getValue() instanceof ResourceAdapter) {
        continue;
      }

      final String config = namespaceAdapterTuple.getValue().fetchConfig();
      if (Strings.isNullOrEmpty(config)) {
        LOGGER.error("JSON config constructed by adapter is null or empty.");
        continue;
      }

      ObjectNode jsonConfig;
      try {
        jsonConfig = (ObjectNode) JMapper.MAP.readTree(config);
        jsonConfig.put("namespace", namespaceAdapterTuple.getKey());

        adaptersArray.add(jsonConfig);
      } catch (final IOException e) {
        LOGGER.error(
            "Config cannot be cast to objectNode. Config: {}, Error: {}",
            config,
            e.getMessage());
      }
    }

    final ObjectNode resultConfig = JsonNodeFactory.instance.objectNode();

    // App ID might not be set.
    if (this.corpus.getAppId() != null) {
      resultConfig.put("appId", this.corpus.getAppId());
    }

    resultConfig.put("defaultNamespace", this.defaultNamespace);
    resultConfig.set("adapters", adaptersArray);
    try {
      return JMapper.WRITER.writeValueAsString(resultConfig);
    } catch (final JsonProcessingException e) {
      throw new StorageAdapterException("Cannot generate adapters config", e);
    }
  }

  /**
   * Saves adapters config into a file.
   *
   * @param name    The name of a file.
   * @param adapter The adapter used to save the config to a file.
   */
  public void saveAdapterConfig(final String name, final StorageAdapter adapter) {
    adapter.writeAsync(name, fetchConfig());
  }

  public String createRelativeCorpusPath(final String objectPath) {
    return this.createRelativeCorpusPath(objectPath, null);
  }

  public String createRelativeCorpusPath(final String objectPath, final CdmContainerDefinition relativeTo) {
    String newPath = this.createAbsoluteCorpusPath(objectPath, relativeTo);

    final String namespaceString = relativeTo != null ? relativeTo.getNamespace() + ":" : "";
    if (newPath.startsWith(namespaceString)) {
      newPath = newPath.substring(namespaceString.length());

      if (relativeTo != null && newPath.startsWith(relativeTo.getFolderPath())) {
        newPath = newPath.substring(relativeTo.getFolderPath().length());
      }
    }
    return newPath;
  }

  private boolean containsUnsupportedPathFormat(final String path) {
    if (path.startsWith("./") || path.startsWith(".\\")) {
      LOGGER.error("The path should not start with ./, path: '{}'", path);
      return true;
    }
    if (path.contains("../") || path.contains("..\\")) {
      LOGGER.error("The path should not contain ../, path: '{}'", path);
      return true;
    }
    if (path.contains("/./") || path.contains("\\.\\")) {
      LOGGER.error("The path should not contain /./, path: '{}'", path);
      return true;
    }
    return false;
  }

  public Map<String, StorageAdapter> getNamespaceAdapters() {
    return namespaceAdapters;
  }

  public void setNamespaceAdapters(final Map<String, StorageAdapter> namespaceAdapters) {
    this.namespaceAdapters = namespaceAdapters;
  }

  public String getDefaultNamespace() {
    return defaultNamespace;
  }

  public void setDefaultNamespace(final String defaultNamespace) {
    this.defaultNamespace = defaultNamespace;
  }
}
