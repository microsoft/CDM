// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

public class StorageAdapterException extends RuntimeException {

  private static final long serialVersionUID = 171928379164912L;

  public StorageAdapterException(final String string, final Exception e) {
    super(string, e);
  }

  public StorageAdapterException(final String string) {
    super(string);
  }
}
