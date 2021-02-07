// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import java.util.ArrayList;
import java.util.Map;

/**
 * EventList is a supporting class for the logging system and allows subset of messages
 * emitted by the SDK to be collected and inspected by the SDK users. The events are stored
 * in an ordered list, each element being a dictionary of string keys and string values.
 *
 * Upon completion of the API call, the recorded events can be inspected by the host application
 * to determine what step to take to address the issue. To simply list all events and their elements,
 * a simple for-each like this will work:
 *
 * <pre>{@code
 *         corpus.getCtx().getEvents().forEach(logEntry -> {
 *             logEntry.forEach((key, value) -> System.out.println(key + "=" + value));
 *          });
 * }</pre>
 *
 * Note: this class is NOT a replacement for standard logging mechanism employed by the SDK. It serves
 * specifically to offer immediate post-call context specific diagnostic information for the application
 * to automate handling of certain common problems, such as invalid file name being supplied, file already
 * being present on the file-system, etc.
 */
public class EventList extends ArrayList<Map<String, String>> {
  /** Specifies whether event recording is enabled or not. */
  private boolean isRecording = false;
  /**
   * Counts how many times we entered into nested functions that each enable recording.
   * We only clear the previously recorded events if the nesting level is at 0.
   */
  private int nestingLevel = 0;

  /**
   * Clears the log recorder and enables recoding of log messages.
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  public void enable() {
    // If we are going into nested recorded functions, we should not clear previously recorded events
    if (nestingLevel == 0) {
      clear();
      isRecording = true;
    }

    nestingLevel++;
  }

  /**
   * Disables recording of log messages.
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  public void disable() {
    nestingLevel--;

    if (nestingLevel == 0) {
      isRecording = false;
    }
  }

  /**
   * Shortcut method to add a new entry to the events. The entry will be added
   * only if the recording is enabled.
   * @param theEvent the event
   */
  @Override
  public boolean add(Map<String, String> theEvent) {
    if (isRecording) {
      return super.add(theEvent);
    }
    return false;
  }

  /**
   * Returns value of the "is recording" flag.
   * @return true if the events are being recorded, false otherwise.
   */
  public boolean isRecording() {
    return isRecording;
  }
}
