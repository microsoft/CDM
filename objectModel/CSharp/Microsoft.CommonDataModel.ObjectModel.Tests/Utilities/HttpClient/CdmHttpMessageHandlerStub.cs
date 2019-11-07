//-----------------------------------------------------------------------
// <copyrightfile="CdmHttpMessageHandlerStub.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.HttpClient
{
    public class CdmHttpMessageHandlerStub : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsyncFunc;

        public CdmHttpMessageHandlerStub(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsyncFunc)
        {
            this.sendAsyncFunc = sendAsyncFunc;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return await sendAsyncFunc(request, cancellationToken);
        }
    }
}
