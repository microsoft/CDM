// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.EventCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.EventList;

import java.util.HashSet;

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
}
