// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Utilities.Network
{
    using Microsoft.CommonDataModel.ObjectModel.Tests.HttpClient;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using FluentAssertions;

    [TestClass]
    public class CdmHttpClientTest
    {
        private int method2ExecutedCount = 0;

        private async Task<HttpResponseMessage> method1(HttpRequestMessage request, CancellationToken token)
        {
            if (request.RequestUri.ToString() == "https://www.example.com/folder1")
            {
                var responseMessage = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent("REPLY1")
                };

                return await Task.FromResult(responseMessage);
            }
            else
            {
                throw new HttpRequestException();
            }
        }

        private async Task<HttpResponseMessage> method2(HttpRequestMessage request, CancellationToken token)
        {
            var responseMessage = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("REPLY2")
            };

            if (method2ExecutedCount == 0)
            {
                Thread.Sleep(4000);
                method2ExecutedCount++;

                return await Task.FromResult(responseMessage);
            } else
            {
                // Wait some time.
                Thread.Sleep(2000);

                method2ExecutedCount++;
                return await Task.FromResult(responseMessage);
            }
        }

        /// <summary>
        /// Testing for a result returned immediatelly.
        /// </summary>
        [TestMethod]
        public async Task TestResultReturnedFirstTime()
        {
            using (var cdmHttpClient = new CdmHttpClient("https://www.example.com", new CdmHttpMessageHandlerStub(method1)))
            {
                var cdmHttpRequest = new CdmHttpRequest("/folder1")
                {
                    Timeout = TimeSpan.FromSeconds(5),
                    MaximumTimeout = TimeSpan.FromSeconds(9)
                };

                var result = await cdmHttpClient.SendAsync(cdmHttpRequest, null);

                var content = await result.Content.ReadAsStringAsync();

                Assert.AreEqual("REPLY1", content);
            }
        }

        /// <summary>
        /// Testing for an HTTP exception when a wrong path is provided.
        /// </summary>
        [TestMethod]
        public void TestResultHttpExceptionZeroRetry()
        {
            using (var cdmHttpClient = new CdmHttpClient("https://www.example1.com", new CdmHttpMessageHandlerStub(method1)))
            {
                var cdmHttpRequest = new CdmHttpRequest("/folder1")
                {
                    Timeout = TimeSpan.FromSeconds(5),
                    MaximumTimeout = TimeSpan.FromSeconds(9)
                };

                Func<Task> func = async () => await cdmHttpClient.SendAsync(cdmHttpRequest, null);

                func.Should().Throw<HttpRequestException>();
            }
        }

        /// <summary>
        /// Testing for a timeout.
        /// </summary>
        [TestMethod]
        public void TestTimeout()
        {
            using (var cdmHttpClient = new CdmHttpClient("https://www.example.com", new CdmHttpMessageHandlerStub(method2)))
            {
                var cdmHttpRequest = new CdmHttpRequest("/folder2")
                {
                    Timeout = TimeSpan.FromSeconds(3),
                    MaximumTimeout = TimeSpan.FromSeconds(150),
                    NumberOfRetries = 0
                };

                Func<Task> func = async () => await cdmHttpClient.SendAsync(cdmHttpRequest, DefaultGetWaitTime);

                func.Should().Throw<CdmTimedOutException>();
            }   
        }

        /// <summary>
        /// Testing for a timeout multiple times until the number of retries is exceeded.
        /// </summary>
        [TestMethod]
        public void TestTimeoutMultipleTimes()
        {
            using (var cdmHttpClient = new CdmHttpClient("https://www.example.com", new CdmHttpMessageHandlerStub(method2)))
            {
                var cdmHttpRequest = new CdmHttpRequest("/folder2")
                {
                    Timeout = TimeSpan.FromSeconds(1),
                    MaximumTimeout = TimeSpan.FromSeconds(150),
                    NumberOfRetries = 3
                };

                Func<Task> func = async () => await cdmHttpClient.SendAsync(cdmHttpRequest, DefaultGetWaitTime);

                func.Should().Throw<CdmNumberOfRetriesExceededException>();
            }
        }

        /// <summary>
        /// Testing for a maximum timeout.
        /// </summary>
        [TestMethod]
        public void TestMaximumTimeout()
        {
            using (var cdmHttpClient = new CdmHttpClient("https://www.example.com", new CdmHttpMessageHandlerStub(method2)))
            {
                var cdmHttpRequest = new CdmHttpRequest("/folder2")
                {
                    Timeout = TimeSpan.FromSeconds(1),
                    MaximumTimeout = TimeSpan.FromSeconds(6),
                    NumberOfRetries = 3
                };

                Func<Task> func = async () => await cdmHttpClient.SendAsync(cdmHttpRequest, DefaultGetWaitTime);

                func.Should().Throw<CdmTimedOutException>();
            }
        }

        /// <summary>
        /// Testing for a timeout then success.
        /// </summary>
        [TestMethod]
        public async Task TestTimeoutThenSuccessMultipleRetries()
        {
            using (var cdmHttpClient = new CdmHttpClient("https://www.example.com", new CdmHttpMessageHandlerStub(method2)))
            {
                var cdmHttpRequest = new CdmHttpRequest("/folder2")
                {
                    Timeout = TimeSpan.FromSeconds(3),
                    MaximumTimeout = TimeSpan.FromSeconds(150),
                    NumberOfRetries = 3
                };

                var result = await cdmHttpClient.SendAsync(cdmHttpRequest, this.DefaultGetWaitTime);

                var content = await result.Content.ReadAsStringAsync();

                Assert.AreEqual("REPLY2", content);
            }    
        }

        private TimeSpan? DefaultGetWaitTime(CdmHttpResponse response, bool hasFailed, int retryNumber)
        {
            if (response != null && response.IsSuccessful && !hasFailed)
            {
                return null;
            }
            else
            {
                Random random = new Random();

                // Default wait time will be using exponential backoff with default shortest wait time.
                double waitTime = random.Next(1 << retryNumber) * 500;
                return TimeSpan.FromMilliseconds(waitTime);
            }
        }

    }
}
