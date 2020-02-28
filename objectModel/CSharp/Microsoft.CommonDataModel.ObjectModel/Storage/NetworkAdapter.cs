// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Linq;

    /// <summary>
    /// Network adapter is an abstract class that contains logic for adapters dealing with data across network.
    /// </summary>
    public abstract class NetworkAdapter : IDisposable
    {
        protected CdmHttpClient httpClient;

        protected TimeSpan? timeout = null;
        protected TimeSpan? maximumTimeout = null;
        protected int numberOfRetries;

        // Use some default values in milliseconds in the case a user doesn't set them up.
        protected const double DefaultTimeout = 2000;
        protected const double DefaultMaximumTimeout = 10000;
        protected const int DefaultNumberOfRetries = 2;
        protected const int DefaultShortestTimeWait = 500;

        protected CdmHttpClient.Callback waitTimeCallback = null;

        protected bool IsDisposed { get; private set; }

        /// <summary>
        /// The default network adapter constructor called when the object is created by a user through code.
        /// </summary>
        protected NetworkAdapter()
        {
        }

        /// <summary>
        /// The network adapter constructor called when the object is created through a JSON config.
        /// </summary>
        protected NetworkAdapter(string configs)
        {
           
        }

        /// <summary>
        /// The timeout for an HTTP request.
        /// </summary>
        public TimeSpan? Timeout
        {
            get
            {
                return this.timeout != null ? this.timeout : TimeSpan.FromMilliseconds(DefaultTimeout);
            }
            set
            {
                this.timeout = value;
            }
        }


        /// <summary>
        /// The maximum timeout for all retried HTTP requests.
        /// </summary>
        public TimeSpan? MaximumTimeout
        {
            get
            {
                return this.maximumTimeout != null ? this.maximumTimeout : TimeSpan.FromMilliseconds(DefaultMaximumTimeout);
            }
            set
            {
                this.maximumTimeout = value;
            }
        }

        /// <summary>
        /// The maximum number of retries for an HTTP request, default is 0.
        /// </summary>
        public int NumberOfRetries { get; set; }


        /// <summary>
        /// The wait time callback that gets called after each request is executed.
        /// </summary>
        public CdmHttpClient.Callback WaitTimeCallback
        {
            get
            {
                return waitTimeCallback != null ? this.waitTimeCallback : new CdmHttpClient.Callback(DefaultGetWaitTime);
            }
            set
            {
                this.waitTimeCallback = value;
            }
        }

        public async Task<CdmHttpResponse> ExecuteRequest(CdmHttpRequest httpRequest)
        {
            try
            {
                var res = await this.httpClient.SendAsync(httpRequest, this.WaitTimeCallback);

                if (res == null)
                {
                    throw new Exception("The result of a request is undefined.");
                }

                if (!res.IsSuccessful)
                {
                    throw new HttpRequestException(
                        $"HTTP {res.StatusCode} - {res.Reason}. Response headers: {string.Join(", ", res.ResponseHeaders.Select(m => m.Key + ":" + m.Value).ToArray())}. URL: {httpRequest.RequestedUrl}");
                }

                return res;
            }
            catch (Exception err)
            {
                throw (err);
            }
        }

        ~NetworkAdapter()
        {
            this.Dispose();
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Sets up the CDM request that can be used by CDM Http Client.
        /// </summary>
        /// <param name="path">Partial or full path to a network location.</param>
        /// <param name="headers">The headers.</param>
        /// <param name="method">The method.</param>
        /// <returns>The <see cref="CdmHttpRequest"/>, representing CDM Http request.</returns>
        protected CdmHttpRequest SetUpCdmRequest(string path, Dictionary<string, string> headers, HttpMethod method)
        {
            var httpRequest = new CdmHttpRequest(path, this.NumberOfRetries);

            httpRequest.Headers = headers;
            httpRequest.Timeout = this.Timeout;
            httpRequest.MaximumTimeout = this.MaximumTimeout;
            httpRequest.Method = method;

            return httpRequest;
        }

        /// <summary>
        /// Callback function for a CDM Http client, it does exponential backoff.
        /// </summary>
        /// <param name="response">The response received by system's Http client.</param>
        /// <param name="hasFailed">Denotes whether the request has failed (usually an exception or 500 error).</param>
        /// <param name="retryNumber">The current retry number (starts from 1) up to the number of retries specified by CDM request.</param>
        /// <returns>The <see cref="TimeSpan"/>, specifying the waiting time, or null if no wait time is necessary.</returns>
        private TimeSpan? DefaultGetWaitTime(CdmHttpResponse response, bool hasFailed, int retryNumber)
        {
            if (response != null && response.IsSuccessful && !hasFailed)
            {
                return null;
            }
            else
            {
                Random random = new Random();

                // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
                double waitTime = random.Next(1 << retryNumber) * DefaultShortestTimeWait;
                return TimeSpan.FromMilliseconds(waitTime);
            }
        }

        /// <summary>
        /// Disposes CDM Http client.
        /// </summary>
        public void Dispose()
        {
            if (!IsDisposed)
            {
                this.httpClient.Dispose();
                this.IsDisposed = true;
            }
        }

        /// <summary>
        /// Updates the network configs.
        /// </summary>
        /// <param name="config">The config to update with.</param>
        public void UpdateNetworkConfig(string config)
        {
            var configsJson = JsonConvert.DeserializeObject<JObject>(config);

            if (configsJson["timeout"] != null)
            {
                this.Timeout = TimeSpan.FromMilliseconds(Double.Parse(configsJson["timeout"].ToString()));
            }

            if (configsJson["maximumTimeout"] != null)
            {
                this.MaximumTimeout = TimeSpan.FromMilliseconds(Double.Parse(configsJson["maximumTimeout"].ToString()));
            }

            if (configsJson["numberOfRetries"] != null)
            {
                this.NumberOfRetries = Int32.Parse(configsJson["numberOfRetries"].ToString());
            }
        }

        /// <summary>
        /// Constructs the network configs.
        /// </summary>
        /// <returns>A list of JProperty objects containing the network specific properties.</returns>
        public List<JProperty> FetchNetworkConfig()
        {
            return new List<JProperty>
            {
                new JProperty("timeout", this.Timeout.Value.TotalMilliseconds),
                new JProperty("maximumTimeout", this.MaximumTimeout.Value.TotalMilliseconds),
                new JProperty("numberOfRetries", this.NumberOfRetries)
            };
        }
    }
}
