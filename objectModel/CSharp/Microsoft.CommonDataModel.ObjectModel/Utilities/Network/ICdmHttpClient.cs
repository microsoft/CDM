// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using System.Threading.Tasks;
using static Microsoft.CommonDataModel.ObjectModel.Utilities.Network.CdmHttpClient;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    public interface ICdmHttpClient
    {

        Task<CdmHttpResponse> SendAsync(CdmHttpRequest cdmRequest, Callback callback = null, CdmCorpusContext ctx = null);

        void Dispose();
    }
}
