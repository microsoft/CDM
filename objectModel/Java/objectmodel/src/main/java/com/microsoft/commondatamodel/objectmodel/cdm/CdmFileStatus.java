// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.time.OffsetDateTime;
import java.util.concurrent.CompletableFuture;

import com.microsoft.commondatamodel.objectmodel.utilities.exceptions.CdmReadPartitionFromPatternException;

public interface CdmFileStatus extends CdmObject {

  /**
   * Last time the modified times were updated.
   * @return OffsetDateTime
   */
  OffsetDateTime getLastFileStatusCheckTime();

  void setLastFileStatusCheckTime(OffsetDateTime value);

  /**
   * Last time this file was modified according to the OM.
   * @return OffsetDateTime
   */
  OffsetDateTime getLastFileModifiedTime();

  void setLastFileModifiedTime(OffsetDateTime value);

  /**
   * Gets or sets the attribute context content list.
   * @return OffsetDateTime
   */
  OffsetDateTime getLastChildFileModifiedTime();

  void setLastChildFileModifiedTime(OffsetDateTime time);

  /**
   * Updates the object and any children with changes made in the document file where it came from.
   * @return OffsetDateTime
   */
  CompletableFuture<Void> fileStatusCheckAsync() throws CdmReadPartitionFromPatternException;

  /**
   * Report most recent modified time (of current or children objects) to the parent object.
   * @param childTime offset time
   * @return CompletableFuture
   */
  CompletableFuture<Void> reportMostRecentTimeAsync(OffsetDateTime childTime);
}
