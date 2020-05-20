// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Implementation of the storage adapter interface which operates with GitHub repos.
 * @deprecated Please use the CdmStandardsAdapter instead.
 */
@Deprecated
public class GithubAdapter extends NetworkAdapter implements StorageAdapter {

  private static final String ghHost = "raw.githubusercontent.com";
  private static final String ghPath = "/Microsoft/CDM/master/schemaDocuments";
  private static final String ghRawRoot = "https://" + ghHost + ghPath;
  static final String TYPE = "github";

  private String locationHint;

  /**
   * Default constructor.
   */
  public GithubAdapter() {
    this.httpClient = new CdmHttpClient(ghRawRoot);
  }

  @Override
  public String fetchConfig() {
    final ObjectNode resultConfig = JsonNodeFactory.instance.objectNode();
    resultConfig.put("type", TYPE);

    final ObjectNode configObject = JsonNodeFactory.instance.objectNode();
    for (final Map.Entry<String, JsonNode> stringJsonNodeEntry : this.fetchNetworkConfig().entrySet()) {
      configObject.set(stringJsonNodeEntry.getKey(), stringJsonNodeEntry.getValue());
    }

    if (this.locationHint != null){
      configObject.put("locationHint", this.locationHint);
    }
    resultConfig.set("config", configObject);
    try {
      return JMapper.WRITER.writeValueAsString(resultConfig);
    } catch (final JsonProcessingException e) {
      throw new StorageAdapterException("Failed to construct config string.", e);
    }
  }

  public boolean canRead() {
    return true;
  }

  public CompletableFuture<String> readAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {

      final Map<String, String> headers = new LinkedHashMap<>();
      headers.put("User-Agent", "CDM");

      final CdmHttpRequest cdmHttpRequest = this.setUpCdmRequest(corpusPath, headers, "GET");
      try {
        final CdmHttpResponse res = this.executeRequest(cdmHttpRequest).get();
        return (res != null) ? res.getContent() : null;
      } catch (final Exception e) {
        throw new StorageAdapterException("Could not read GitHub content at path: " + corpusPath, e);
      }
    });
  }

  public boolean canWrite() {
    return false;
  }

  public CompletableFuture<Void> writeAsync(final String corpusPath, final String data) {
    return CompletableFuture.completedFuture(null);
  }

  public void clearCache() {
    // Left blank intentionally
  }

  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) {
    return CompletableFuture.completedFuture(OffsetDateTime.now());
  }

  public CompletableFuture<List<String>> fetchAllFilesAsync(final String currFullPath) {
    // TODO
    return CompletableFuture.completedFuture(null);
  }

  public String createAdapterPath(final String corpusPath) {
    return GithubAdapter.ghRawRoot + corpusPath;
  }

  public String createCorpusPath(final String adapterPath) {
    final String ghRoot = GithubAdapter.ghRawRoot;

    // Might not be an adapterPath that we understand. check that first.
    if (!Strings.isNullOrEmpty(adapterPath) && adapterPath.startsWith(ghRoot)) {
      return StringUtils.slice(adapterPath, ghRoot.length());
    }

    return null;
  }

  @Override
  public void updateConfig(final String config) throws IOException {
    if (config == null) {
      // It is fine just to skip it for GitHub adapter.
      return;
    }

    this.updateNetworkConfig(config);
    final JsonNode configsJson = JMapper.MAP.readTree(config);

    this.locationHint = configsJson.has("locationHint") ? configsJson.get("locationHint").asText() : null;
  }

  @Override
  public void setLocationHint(final String locationHint) {
    this.locationHint = locationHint;
  }

  @Override
  public String getLocationHint() {
    return this.locationHint;
  }
}
