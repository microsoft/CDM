// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;

/**
 * Represents the callback object used in CdmCorpusDefintion::setEventCallback().
 * When an EventCallback is set, logs will invoke this callback with their status level and message.
 */
@FunctionalInterface
public interface EventCallback {

  /**
   * Invokes the callback with a status level and message.
   * @param level The status level.
   * @param message The log message.
   */
  void apply(CdmStatusLevel level, String message);
}
