// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage.TestAdapters
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using System;

    internal class MockAdlsAdapter : ADLSAdapter
    {
        internal MockAdlsAdapter(ICdmHttpClient httpClient)
            : base("hostname", "root", Environment.GetEnvironmentVariable("ADLS_SHAREDKEY"))
        {
            this.httpClient = httpClient;
        }
    }
}
