// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage.testAdapters;

import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;

public class MockAdlsAdapter extends AdlsAdapter {
  public MockAdlsAdapter(final CdmHttpClient httpClient) {
    super("hostname", "root", System.getenv("ADLS_SHAREDKEY"));
    this.httpClient = httpClient;
  }
}
