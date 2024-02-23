// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.time.OffsetDateTime;

public class CdmFileMetadata {
  private long size;
  private OffsetDateTime lastModifiedTime;

  public CdmFileMetadata(OffsetDateTime lastModifiedTime, long size) {
    this.lastModifiedTime = lastModifiedTime;
    this.size = size;
  }

  public final OffsetDateTime getLastModifiedTime() { return this.lastModifiedTime; }

  public final long getSize() { return this.size; }
}
