// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

public class StringSpewCatcher {
  private StringBuilder content = new StringBuilder();
  private StringBuilder segment = new StringBuilder();

  public void clear() {
    this.content = new StringBuilder();
    this.segment = new StringBuilder();
  }

  public void spewLine(final String spew) {
    this.segment.append(spew).append("\n");
    if (this.segment.length() > 1000) {
      this.content.append(this.segment);
      this.segment = new StringBuilder();
    }
  }

  public String getContent() {
    return this.content.append(this.segment).toString();
  }
}
