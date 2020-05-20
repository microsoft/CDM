// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.EventCallback;

public interface CdmCorpusContext {

  CdmCorpusDefinition getCorpus();

  void setCorpus(CdmCorpusDefinition value);

  CdmStatusLevel getReportAtLevel();

  void setReportAtLevel(CdmStatusLevel value);

  EventCallback getStatusEvent();

  void setStatusEvent(EventCallback value);
}
