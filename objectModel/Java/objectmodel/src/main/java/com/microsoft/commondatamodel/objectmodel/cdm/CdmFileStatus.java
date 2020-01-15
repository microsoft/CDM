// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.time.OffsetDateTime;
import java.util.concurrent.CompletableFuture;

public interface CdmFileStatus extends CdmObject {

  /**
   * Last time the modified times were updated.
   */
  OffsetDateTime getLastFileStatusCheckTime();

  void setLastFileStatusCheckTime(OffsetDateTime value);

  /**
   * Last time this file was modified according to the OM.
   */
  OffsetDateTime getLastFileModifiedTime();

  void setLastFileModifiedTime(OffsetDateTime value);

  /**
   * Gets or sets the attribute context content list.
   */
  OffsetDateTime getLastChildFileModifiedTime();

  void setLastChildFileModifiedTime(OffsetDateTime time);

  /**
   * Updates the object and any children with changes made in the document file where it came from.
   */
  CompletableFuture<Void> fileStatusCheckAsync();

  /**
   * Report most recent modified time (of current or children objects) to the parent object.
   */
  CompletableFuture<Void> reportMostRecentTimeAsync(OffsetDateTime childTime);
}
