// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

public class FileStatusCheckOptions {
  private boolean includeDataPartitionSize;

  public boolean throwOnPartitionError;

  public FileStatusCheckOptions(boolean includeDataPartitionSize) {
    this.includeDataPartitionSize = includeDataPartitionSize;
    this.throwOnPartitionError = false;
  }

  public FileStatusCheckOptions(boolean includeDataPartitionSize, boolean throwOnPartitionError) {
    this.includeDataPartitionSize = includeDataPartitionSize;
    this.throwOnPartitionError = throwOnPartitionError;
  }

  public boolean getIncludeDataPartitionSize() { return this.includeDataPartitionSize; }

  public boolean getThrowOnPartitionError() { return this.throwOnPartitionError; }
}
