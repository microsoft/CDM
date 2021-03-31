// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StorageUtils;
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
import java.util.concurrent.CompletableFuture;

import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import org.apache.commons.lang3.tuple.ImmutablePair;

public class StorageManager {
  private static String tag = StorageManager.class.getSimpleName();

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
    this.mount("local", new LocalAdapter(System.getProperty("user.dir") + "\\objectmodel"));
    this.mount("cdm", new CdmStandardsAdapter());

    systemDefinedNamespaces.add("local");
    systemDefinedNamespaces.add("cdm");
  }

  public void mount(final String nameSpace, final StorageAdapter adapter) {
    try (Logger.LoggerScope logScope = Logger.enterScope(StorageManager.class.getSimpleName(), getCtx(), "mount")) {
      if (StringUtils.isNullOrTrimEmpty(nameSpace)) {
        Logger.error(this.corpus.getCtx(), tag, "mount", null, CdmLogCode.ErrStorageNullNamespace);
        return;
      }

      if (adapter != null) {
        if (adapter instanceof StorageAdapterBase) {
          ((StorageAdapterBase) adapter).setCtx(this.corpus.getCtx());
        }

        this.namespaceAdapters.put(nameSpace, adapter);
        final CdmFolderDefinition fd = new CdmFolderDefinition(this.corpus.getCtx(), "");
        fd.setCorpus(this.corpus);
        fd.setNamespace(nameSpace);
        fd.setFolderPath("/");
        this.namespaceFolder.put(nameSpace, fd);
        this.systemDefinedNamespaces.remove(nameSpace);
      } else {
        Logger.error(this.corpus.getCtx(), tag, "mount", null, CdmLogCode.ErrStorageNullAdapter);
      }
    }
  }

  public List<String> mountFromConfig(final String adapterConfig) {
    return mountFromConfig(adapterConfig, false);
  }

  public List<String> mountFromConfig(final String adapterConfig, final boolean doesReturnErrorList) {
    if (Strings.isNullOrEmpty(adapterConfig)) {
      Logger.error(this.corpus.getCtx(), tag, "mountFromConfig", null, CdmLogCode.ErrStorageNullAdapterConfig);
      return null;
    }
    JsonNode adapterConfigJson;
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
        Logger.error(this.corpus.getCtx(), tag, "mountFromConfig", null, CdmLogCode.ErrStorageMissingNamespace);
        continue;
      }
      final JsonNode configs;
      // Check whether the config exists.
      if (item.has("config")) {
        configs = item.get("config");
      } else {
        Logger.error(this.corpus.getCtx(), tag, "mountFromConfig", null, CdmLogCode.ErrStorageMissingJsonConfig, nameSpace);
        continue;
      }
      if (!item.has("type")) {
        Logger.error(this.corpus.getCtx(), tag, "mountFromConfig", null, CdmLogCode.ErrStorageNullNamespace, nameSpace);
        continue;
      }
      try {
        final String itemType = item.get("type").asText();
        StorageAdapter adapter = null;

        switch (itemType) {
          case CdmStandardsAdapter.TYPE:
            adapter = new CdmStandardsAdapter();
            break;
          case LocalAdapter.TYPE:
            adapter = new LocalAdapter();
            break;
          case GithubAdapter.TYPE:
            adapter = new GithubAdapter();
            break;
          case RemoteAdapter.TYPE:
            adapter = new RemoteAdapter();
            break;
          case AdlsAdapter.TYPE:
            adapter = new AdlsAdapter();
            break;
          default:
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
    return doesReturnErrorList ? unrecognizedAdapters : null;
  }

  public boolean unmount(final String nameSpace) {
    try (Logger.LoggerScope logScope = Logger.enterScope(StorageManager.class.getSimpleName(), getCtx(), "unmount")) {
      if (StringUtils.isNullOrTrimEmpty(nameSpace)) {
        Logger.error(this.corpus.getCtx(), tag, "unmount", null, CdmLogCode.ErrStorageNullNamespace);
        return false;
      }

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
        Logger.warning(this.corpus.getCtx(), tag, "unmount", null, CdmLogCode.WarnStorageRemoveAdapterFailed);
        return false;
      }
    }
  }

  /**
   * Allow replacing a storage adapter with another one for testing, leaving folders intact.
   *
   * @param nameSpace String
   * @param adapter StorageAdapter
   * @deprecated This should only be used for testing only. And is very likely to be removed from
   * public interface.
   */
  @Deprecated
  public void setAdapter(String nameSpace, StorageAdapter adapter) {
    if (StringUtils.isNullOrTrimEmpty(nameSpace)) {
      Logger.error(this.corpus.getCtx(), tag, "setAdapter", null, CdmLogCode.ErrStorageNullNamespace);
      return;
    }

    if (adapter != null) {
      this.namespaceAdapters.put(nameSpace, adapter);
    } else {
      Logger.error(this.corpus.getCtx(), tag, "setAdapter", null, CdmLogCode.ErrStorageNullAdapter);
    }
  }

  public StorageAdapter fetchAdapter(final String nameSpace) {
    if (StringUtils.isNullOrTrimEmpty(nameSpace)) {
      Logger.error(this.corpus.getCtx(), tag, "fetchAdapter", null, CdmLogCode.ErrStorageNullNamespace);
      return null;
    }

    if (this.namespaceFolder.containsKey(nameSpace)) {
      return this.namespaceAdapters.get(nameSpace);
    }
    Logger.error(this.corpus.getCtx(), tag, "fetchAdapter", null, CdmLogCode.ErrStorageAdapterNotFound, nameSpace);
    return null;
  }

  public CdmFolderDefinition fetchRootFolder(final String nameSpace) {
    try (Logger.LoggerScope logScope = Logger.enterScope(StorageManager.class.getSimpleName(), getCtx(), "fetchRootFolder")) {
      if (StringUtils.isNullOrTrimEmpty(nameSpace)) {
        Logger.error(this.corpus.getCtx(), tag, "fetchRootFolder", null, CdmLogCode.ErrStorageNullNamespace);
        return null;
      }
      if (this.namespaceFolder.containsKey(nameSpace)) {
        return this.namespaceFolder.get(nameSpace);
      } else if (this.namespaceFolder.containsKey(this.defaultNamespace)) {
        return this.namespaceFolder.get(this.defaultNamespace);
      }
      Logger.error(this.corpus.getCtx(), tag, "fetchRootFolder", null, CdmLogCode.ErrStorageAdapterNotFound, nameSpace);
      return null;
    }
  }

  public String adapterPathToCorpusPath(final String adapterPath) {
    try (Logger.LoggerScope logScope = Logger.enterScope(StorageManager.class.getSimpleName(), getCtx(), "adapterPathToCorpusPath")) {
      for (final Map.Entry<String, StorageAdapter> kv : this.namespaceAdapters.entrySet()) {
        final String corpusPath = kv.getValue().createCorpusPath(adapterPath);
        if (corpusPath != null) {
          // got one, add the prefix
          return kv.getKey() + ":" + corpusPath;
        }
      }
      Logger.error(this.corpus.getCtx(), tag, "adapterPathToCorpusPath", null, CdmLogCode.ErrStorageInvalidAdapterPath);
      return null;
    }
  }

  public String corpusPathToAdapterPath(final String corpusPath) {
    try (Logger.LoggerScope logScope = Logger.enterScope(StorageManager.class.getSimpleName(), getCtx(), "corpusPathToAdapterPath")) {
      if (StringUtils.isNullOrTrimEmpty(corpusPath)) {
        Logger.error(this.corpus.getCtx(), tag, "corpusPathToAdapterPath", null, CdmLogCode.ErrStorageNullCorpusPath);
        return null;
      }

      final ImmutablePair<String, String> pathTuple = StorageUtils.splitNamespacePath(corpusPath);
      if (pathTuple == null) {
        Logger.error(this.corpus.getCtx(), tag, "corpusPathToAdapterPath", null, CdmLogCode.ErrStorageNullCorpusPath);
        return null;
      }
      final String nameSpace = !StringUtils.isNullOrTrimEmpty(pathTuple.getLeft())
              ? pathTuple.getLeft()
              : this.defaultNamespace;
      if (this.fetchAdapter(nameSpace) == null) {
        Logger.error(this.corpus.getCtx(), tag, "corpusPathToAdapterPath", null, CdmLogCode.ErrStorageNamespaceNotRegistered);
        return "";
      }
      return this.fetchAdapter(nameSpace).createAdapterPath(pathTuple.getRight());
    }
  }

  public String createAbsoluteCorpusPath(final String objectPath) {
    return this.createAbsoluteCorpusPath(objectPath, null);
  }

  public String createAbsoluteCorpusPath(final String objectPath, final CdmObject obj) {
    try (Logger.LoggerScope logScope = Logger.enterScope(StorageManager.class.getSimpleName(), getCtx(), "createAbsoluteCorpusPath")) {
      if (StringUtils.isNullOrTrimEmpty(objectPath)) {
        Logger.error(this.corpus.getCtx(), tag, "createAbsoluteCorpusPath", null, CdmLogCode.ErrPathNullObjectPath);
        return null;
      }

      if (this.containsUnsupportedPathFormat(objectPath)) {
        // already called statusRpt when checking for unsupported path format.
        return null;
      }
      final ImmutablePair<String, String> pathTuple = StorageUtils.splitNamespacePath(objectPath);
      if (pathTuple == null) {
        Logger.error(this.corpus.getCtx(), tag, "createAbsoluteCorpusPath", null, CdmLogCode.ErrPathNullObjectPath);
        return null;
      }
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
        Logger.warning(this.corpus.getCtx(), tag, "createAbsoluteCorpusPath", null, CdmLogCode.WarnStorageExpectedPathPrefix, prefix);
        prefix += "/";
      }
      // check if this is a relative path
      if (!Strings.isNullOrEmpty(newObjectPath) && !newObjectPath.startsWith("/")) {
        if (obj == null) {
          // relative path and no other info given, assume default and root
          prefix = "/";
        }
        if (!Strings.isNullOrEmpty(nameSpace) && !Objects.equals(nameSpace, namespaceFromObj)) {
          Logger.error(this.corpus.getCtx(), tag, "createAbsoluteCorpusPath", null, CdmLogCode.ErrStorageNamespaceMismatch);
          return null;
        }
        newObjectPath = prefix + newObjectPath;
        finalNamespace = Strings.isNullOrEmpty(namespaceFromObj)
                ? (StringUtils.isNullOrTrimEmpty(nameSpace) ? this.defaultNamespace : nameSpace)
                : namespaceFromObj;
      } else {
        finalNamespace = Strings.isNullOrEmpty(nameSpace)
                ? (StringUtils.isNullOrTrimEmpty(namespaceFromObj) ? this.defaultNamespace : namespaceFromObj)
                : nameSpace;
      }
      return (!StringUtils.isNullOrTrimEmpty(finalNamespace) ? finalNamespace + ":" : "") + newObjectPath;
    }
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
        Logger.error(this.corpus.getCtx(), tag, "fetchConfig", null, CdmLogCode.ErrStorageNullAdapter);
        continue;
      }

      ObjectNode jsonConfig;
      try {
        jsonConfig = (ObjectNode) JMapper.MAP.readTree(config);
        jsonConfig.put("namespace", namespaceAdapterTuple.getKey());

        adaptersArray.add(jsonConfig);
      } catch (final IOException e) {
        Logger.error(this.corpus.getCtx(), tag, "fetchConfig", null, CdmLogCode.ErrStorageObjectNodeCastFailed, config, e.getMessage());
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
   *  @param name    The name of a file.
   * @param adapter The adapter used to save the config to a file.
   * @return CompletableFuture
   */
  public CompletableFuture<Void> saveAdapterConfigAsync(final String name, final StorageAdapter adapter) {
    return adapter.writeAsync(name, fetchConfig());
  }

  public String createRelativeCorpusPath(final String objectPath) {
    return this.createRelativeCorpusPath(objectPath, null);
  }

  public String createRelativeCorpusPath(final String objectPath, final CdmContainerDefinition relativeTo) {
    try (Logger.LoggerScope logScope = Logger.enterScope(StorageManager.class.getSimpleName(), getCtx(), "createRelativeCorpusPath")) {
      String newPath = this.createAbsoluteCorpusPath(objectPath, relativeTo);
      final String namespaceString = relativeTo != null ? relativeTo.getNamespace() + ":" : "";
      if (!StringUtils.isNullOrTrimEmpty(namespaceString) && !StringUtils.isNullOrTrimEmpty(newPath) && newPath.startsWith(namespaceString)) {
        newPath = newPath.substring(namespaceString.length());

        if (relativeTo != null && newPath.startsWith(relativeTo.getFolderPath())) {
          newPath = newPath.substring(relativeTo.getFolderPath().length());
        }
      }
      return newPath;
    }
  }

  /**
   * @return Integer
   * Maximum number of documents read concurrently when loading imports.
   */
  public Integer getMaxConcurrentReads() {
    return this.corpus.getDocumentLibrary().concurrentReadLock.getPermits();
  }

  /**
   * @param maxConcurrentReads Integer
   * Maximum number of documents read concurrently when loading imports.
   */
  public void setMaxConcurrentReads(Integer maxConcurrentReads) {
    this.corpus.getDocumentLibrary().concurrentReadLock.setPermits(maxConcurrentReads);
  }

  private boolean containsUnsupportedPathFormat(final String path) {
    if (path.startsWith("./") || path.startsWith(".\\") ||
    path.contains("../") || path.contains("..\\") ||
    path.contains("/./") || path.contains("\\.\\") ) {
      // Invalid path.
    }
    else {
      return false;
    }
   
    Logger.error(this.corpus.getCtx(), tag, "containsUnsupportedPathFormat", null, CdmLogCode.ErrStorageInvalidPathFormat);
    return true;
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

  private CdmCorpusContext getCtx() {
    return corpus.getCtx();
  }
}
