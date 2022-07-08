// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.EventCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.EventList;

import java.util.HashSet;
import java.util.Map;

public interface CdmCorpusContext {

  CdmCorpusDefinition getCorpus();

  void setCorpus(CdmCorpusDefinition value);

  CdmStatusLevel getReportAtLevel();

  void setReportAtLevel(CdmStatusLevel value);

  EventCallback getStatusEvent();

  HashSet<CdmLogCode> getSuppressedLogCodes();

  void setStatusEvent(EventCallback value);

  /**
   * Collects events emitted by the SDK.
   * @return the events
   */
  EventList getEvents();

  /**
   * Returns (optional) correlation ID to be stamped on all recorded status events.
   * @return the correlation ID
   */
  String getCorrelationId();

  /**
   * Sets correlation ID to be stamped on all recorded status events.
   * @param correlationId the correlation ID
   */
  void setCorrelationId(String correlationId);

  /**
   * Set feature flags in context.
   * @param featureFlags map of feature flag name and value.
   */
  void setFeatureFlags(Map<String, Object> featureFlags);

  /**
   * Returns feature flags set in the context.
   * @return Map of feature flag name and value.
   */
  Map<String, Object> getFeatureFlags();

}
