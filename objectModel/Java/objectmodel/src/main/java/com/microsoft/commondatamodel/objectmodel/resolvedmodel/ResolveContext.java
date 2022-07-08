// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.EventCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.EventList;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;

public class ResolveContext implements CdmCorpusContext {

  final protected Map<String, ResolvedAttributeSetBuilder> attributeCache;
  final protected Map<String, ResolvedTraitSet> traitCache;

  String corpusPathRoot;
  private CdmCorpusDefinition corpus;
  private String relativePath;
  private CdmStatusLevel reportAtLevel;
  private EventCallback statusEvent;
  private EventList events;
  private HashSet<CdmLogCode> suppressedLogCodes;
  private String correlationId;
  private Map<String, Object> featureFlags;

  public ResolveContext(final CdmCorpusDefinition corpus) {
    this(corpus, null);
  }

  public ResolveContext(final CdmCorpusDefinition corpus, final EventCallback statusEvent) {
    this(corpus, statusEvent, null);
  }

  public ResolveContext(final CdmCorpusDefinition corpus, final EventCallback statusEvent, CdmStatusLevel reportAtLevel) {
    this.reportAtLevel = reportAtLevel != null ? reportAtLevel : CdmStatusLevel.Warning;
    this.statusEvent = statusEvent;
    this.attributeCache = new LinkedHashMap<>();
    this.traitCache = new LinkedHashMap<>();
    this.corpus = corpus;
    this.events = new EventList();
    this.suppressedLogCodes = new HashSet<CdmLogCode>();
    this.featureFlags = new HashMap<>();
  }

  @Override
  public CdmCorpusDefinition getCorpus() {
    return this.corpus;
  }

  @Override
  public void setCorpus(final CdmCorpusDefinition value) {
    this.corpus = value;
  }

  @Override
  public CdmStatusLevel getReportAtLevel() {
    return this.reportAtLevel;
  }

  @Override
  public void setReportAtLevel(final CdmStatusLevel value) {
    this.reportAtLevel = value;
  }

  @Override
  public EventCallback getStatusEvent() {
    return this.statusEvent;
  }

  @Override
  public void setStatusEvent(final EventCallback value) { this.statusEvent = value; }

  @Override
  public EventList getEvents() {
    return events;
  }

  @Override
  public HashSet<CdmLogCode> getSuppressedLogCodes() {
    return suppressedLogCodes;
  }

  @Override
  public String getCorrelationId() {
    return correlationId;
  }

  @Override
  public void setCorrelationId(String correlationId) {
    this.correlationId = correlationId;
  }

  @Override
  public Map<String, Object> getFeatureFlags() {
    return featureFlags;
  }

  @Override
  public void setFeatureFlags(Map<String, Object> featureFlags) {
    this.featureFlags = featureFlags;
  }

  /**
   *
   * @return String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String getRelativePath() {
    return relativePath;
  }

  /**
   *
   * @param relativePath String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setRelativePath(final String relativePath) {
    this.relativePath = relativePath;
  }

  /**
   *
   * @return String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String getCorpusPathRoot() {
    return corpusPathRoot;
  }

  /**
   *
   * @param corpusPathRoot String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setCorpusPathRoot(final String corpusPathRoot) {
    this.corpusPathRoot = corpusPathRoot;
  }

  /**
   *
   * @return Map of String to ResolvedAttributeSetBuilder
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Map<String, ResolvedAttributeSetBuilder> getAttributeCache() {
    return attributeCache;
  }

  /**
   *
   * @return Map of String to ResolvedTraitSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Map<String, ResolvedTraitSet> getTraitCache() {
    return traitCache;
  }
}
