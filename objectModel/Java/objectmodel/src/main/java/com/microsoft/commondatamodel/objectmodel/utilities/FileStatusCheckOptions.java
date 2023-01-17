// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

public class FileStatusCheckOptions {
  private boolean includeDataPartitionSize;

  public FileStatusCheckOptions(boolean includeDataPartitionSize) { this.includeDataPartitionSize = includeDataPartitionSize; }

  public boolean getIncludeDataPartitionSize() { return this.includeDataPartitionSize; }
}
