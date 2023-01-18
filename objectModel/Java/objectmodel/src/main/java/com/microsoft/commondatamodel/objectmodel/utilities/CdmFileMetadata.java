// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

public class CdmFileMetadata {
  private long size;

  public CdmFileMetadata(long size) { this.size = size; }

  public final long getSize() { return this.size; }
}
