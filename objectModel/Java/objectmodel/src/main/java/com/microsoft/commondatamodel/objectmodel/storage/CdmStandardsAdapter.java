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
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * An adapter pre-configured to read the standard schema files published by CDM.
 */
public class CdmStandardsAdapter extends NetworkAdapter {

  private static final String STANDARDS_ENDPOINT = "https://cdm-schema.microsoft.com";
  static final String TYPE = "cdm-standards";
  
  private String root;

  /**
   * Constructs a CdmStandardsAdapter with default parameters.
   */
  public CdmStandardsAdapter() {
    this("/logical");
    this.httpClient = new CdmHttpClient(STANDARDS_ENDPOINT);
  }

  /**
   * Constructs a CdmStandardsAdapter.
   * @param root The root path specifies either to read the standard files in logical or resolved form.
   */
  public CdmStandardsAdapter(String root) {
    this.root = root;
  }

  @Override
  public String fetchConfig() {
    final ObjectNode resultConfig = JsonNodeFactory.instance.objectNode();
    resultConfig.put("type", TYPE);

    final ObjectNode configObject = JsonNodeFactory.instance.objectNode();
    for (final Map.Entry<String, JsonNode> stringJsonNodeEntry : this.fetchNetworkConfig().entrySet()) {
      configObject.set(stringJsonNodeEntry.getKey(), stringJsonNodeEntry.getValue());
    }

    String locationHint = getLocationHint(); 
    if (locationHint != null){
      configObject.put("locationHint", locationHint);
    }

    if (this.root != null){
      configObject.put("root", this.root);
    }

    resultConfig.set("config", configObject);
    try {
      return JMapper.WRITER.writeValueAsString(resultConfig);
    } catch (final JsonProcessingException e) {
      throw new StorageAdapterException("Failed to construct config string.", e);
    }
  }

  @Override
  public boolean canRead() {
    return true;
  }

  @Override
  public CompletableFuture<String> readAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final String path = root + corpusPath;
      final CdmHttpRequest cdmHttpRequest = this.setUpCdmRequest(path, null, "GET");
      try {
        final CdmHttpResponse res = this.executeRequest(cdmHttpRequest).get();
        return (res != null) ? res.getContent() : null;
      } catch (final Exception e) {
        throw new StorageAdapterException("Could not read content at path: " + path, e);
      }
    });
  }

  @Override
  public String createAdapterPath(final String corpusPath) {
    return getAbsolutePath() + corpusPath;
  }

  @Override
  public String createCorpusPath(final String adapterPath) {
    if (Strings.isNullOrEmpty(adapterPath) || !adapterPath.startsWith(getAbsolutePath())) {
      return null;
    }
    return StringUtils.slice(adapterPath, getAbsolutePath().length());
  }

  @Override
  public void updateConfig(final String config) throws IOException {
    if (config == null) {
      return;
    }

    this.updateNetworkConfig(config);
    final JsonNode configsJson = JMapper.MAP.readTree(config);

    setLocationHint(configsJson.has("locationHint") ? configsJson.get("locationHint").asText() : null);
    this.root = configsJson.has("root") ? configsJson.get("root").asText() : null;
  }

  public void setRoot(final String root) {
    this.root = root;
  }

  public String getRoot() {
    return this.root;
  }

  /**
   * @return The combinating of the standards endpoint and the root path.
   */
  private String getAbsolutePath() {
    return STANDARDS_ENDPOINT + this.root;
  }
}
