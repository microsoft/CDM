// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;

    /// <summary>
    /// CDM Http Client is an HTTP client which implements retry logic to execute retries 
    /// in the case of failed requests.
    /// </summary>
    public class CdmHttpClient : IDisposable
    {
        private static readonly string Tag = nameof(CdmHttpClient);
        /// <summary>
        /// The callback function that gets called after the request is finished in CDM Http client.
        /// </summary>
        /// <param name="response">The CDM Http response.</param>
        /// <param name="hasFailed">Denotes whether a request has failed.</param>
        /// <param name="retryNumber">The retry number (starting from 1).</param>
        /// <returns>The <see cref="TimeSpan"/></returns>
        public delegate TimeSpan? Callback(CdmHttpResponse response, bool hasFailed, int retryNumber);

        /// <summary>
        /// The base headers which get merged with every request.
        /// </summary>
        internal Dictionary<string, string> Headers { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmHttpClient"/> class.
        /// </summary>
        /// <param name="apiEndpoint">The API endpoint.</param>
        /// <param name="handler">The HTTP message handler, handler can be changed to support testing, etc.</param>
        public CdmHttpClient(string apiEndpoint = null, HttpMessageHandler handler = null)
        {
            this.Headers = new Dictionary<string, string>();

            if (apiEndpoint != null)
            {
                this.apiEndpoint = apiEndpoint;
                this.isApiEndpointSet = true;
            } else
            {
                this.isApiEndpointSet = false;
            }

            if (handler == null)
            {
                this.client = new HttpClient();
            } else
            {
                this.client = new HttpClient(handler);
            }
        }

        /// <summary>
        /// Send a CDM request with the retry logic.
        /// </summary>
        /// <param name="cdmRequest">The CDM Http request.</param>
        /// <param name="callback">The callback that gets executed after the request finishes.</param>
        /// <returns>The <see cref="Task"/>, representing CDM Http response.</returns>
        public async Task<CdmHttpResponse> SendAsync(CdmHttpRequest cdmRequest, Callback callback = null, CdmCorpusContext ctx = null)
        {
            // Merge headers first.
            foreach (var item in this.Headers)
            {
                cdmRequest.Headers.Add(item.Key, item.Value);
            }

            var maxTimeoutToken = new CancellationTokenSource();
            TimeSpan timeout = (TimeSpan)cdmRequest.MaximumTimeout;
            int timeoutMilliseconds = (int)timeout.TotalMilliseconds;
            maxTimeoutToken.CancelAfter(timeoutMilliseconds);

            try
            {
                return await SendAsyncHelper(cdmRequest, callback, ctx, maxTimeoutToken.Token);

            }
            catch (AggregateException err)
            {
                throw err.InnerException;
            }
            catch (Exception ex)
            {
                if (ex is CdmTimedOutException && maxTimeoutToken.IsCancellationRequested)
                {
                    throw new CdmTimedOutException("Maximum timeout exceeded.");
                }

                throw ex;
            }
        }

        /// <summary>
        /// Send a CDM request with the retry logic helper function.
        /// </summary>
        /// <param name="cdmRequest">The CDM Http request.</param>
        /// <param name="callback">The callback that gets executed after the request finishes.</param>
        /// <returns>The <see cref="Task"/>, representing CDM Http response.</returns>
        private async Task<CdmHttpResponse> SendAsyncHelper(CdmHttpRequest cdmRequest, Callback callback, CdmCorpusContext ctx, CancellationToken maxTimeoutToken)
        {
            string fullUrl;
            if (isApiEndpointSet)
            {
                fullUrl = Combine(this.apiEndpoint, cdmRequest.RequestedUrl);
            }
            else
            {
                fullUrl = cdmRequest.RequestedUrl;
            }

            // If the number of retries is 0, we only try once, otherwise we retry the specified number of times.
            for (int retryNumber = 0; retryNumber <= cdmRequest.NumberOfRetries; retryNumber++)
            {
                var requestMessage = new HttpRequestMessage(cdmRequest.Method, fullUrl);

                foreach (var item in cdmRequest.Headers)
                {
                    requestMessage.Headers.Add(item.Key, item.Value);
                }

                // GET requests might not have any content.
                if (cdmRequest.Content != null)
                {
                    requestMessage.Content = new StringContent(cdmRequest.Content, Encoding.UTF8, cdmRequest.ContentType);
                }

                CdmHttpResponse cdmHttpResponse = null;
                var hasFailed = false;
                DateTimeOffset startTime = DateTimeOffset.UtcNow;
                try
                {
                    HttpResponseMessage response;

                    if (ctx != null)
                    {
                        Logger.Debug(ctx, Tag, nameof(SendAsyncHelper), null, $"Sending request {cdmRequest.RequestId}, request type: {requestMessage.Method}, request url: {cdmRequest.StripSasSig()}, retry number: {retryNumber}.");
                    }

                    TimeSpan timeout = (TimeSpan)cdmRequest.Timeout;
                    int timeoutMilliseconds = (int)(timeout.TotalMilliseconds);

                    CancellationTokenSource requestToken = new CancellationTokenSource();
                    requestToken.CancelAfter(timeoutMilliseconds);
                    
                    // The request should timeout either for its own timeout or if maximum timeout is reached.
                    CancellationTokenSource requestLinkedToken = CancellationTokenSource.CreateLinkedTokenSource(requestToken.Token, maxTimeoutToken);

                    // The check is added to fix a known issue in .net http client when reading HEAD request > 2GB.
                    // .net http client tries to write content even when the request is HEAD request.
                    if (cdmRequest.Method.Equals(HttpMethod.Head))
                    {
                        response = await this.client.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead, requestLinkedToken.Token);
                    }
                    else
                    {
                        response = await this.client.SendAsync(requestMessage, requestLinkedToken.Token);
                    }


                    if (ctx != null)
                    {
                        DateTimeOffset endTime = DateTimeOffset.UtcNow;
                        Logger.Debug(ctx, Tag, nameof(SendAsyncHelper), null, $"Response for request {cdmRequest.RequestId} received, elapsed time: {endTime.Subtract(startTime).TotalMilliseconds} ms.");
                    }

                    if (response != null)
                    {
                        cdmHttpResponse = new CdmHttpResponse(response.StatusCode)
                        {
                            Reason = response.ReasonPhrase,
                            Content = response.Content,
                            IsSuccessful = response.IsSuccessStatusCode
                        };

                        foreach (var item in response.Headers)
                        {
                            cdmHttpResponse.ResponseHeaders.Add(item.Key, string.Join(",", item.Value));
                        }
                    }
                }
                catch (Exception ex)
                {
                    DateTimeOffset endTime = DateTimeOffset.UtcNow;
                    hasFailed = true;

                    if (ex is TaskCanceledException && ctx != null)
                    {
                        Logger.Debug(ctx, Tag, nameof(SendAsyncHelper), null, $"Request {cdmRequest.RequestId} timeout after {endTime.Subtract(startTime).TotalMilliseconds} ms.");
                    }

                    if (ex is AggregateException aggrEx)
                    {
                        ex = aggrEx.InnerException;
                    }

                    // Only throw an exception if another retry is not expected anymore.
                    if (callback == null || retryNumber == cdmRequest.NumberOfRetries)
                    {
                        if (retryNumber != 0 && !maxTimeoutToken.IsCancellationRequested)
                        {
                            throw new CdmNumberOfRetriesExceededException(ex.Message);
                        }

                        if (ex is TaskCanceledException)
                        {
                            throw new CdmTimedOutException("Request timeout.");
                        }
                        
                        throw ex;
                    }
                }

                // Check whether we have a callback function set and whether this is not our last retry.
                if (callback != null && retryNumber != cdmRequest.NumberOfRetries && !maxTimeoutToken.IsCancellationRequested)
                {
                    // Call the callback function with the retry numbers starting from 1.
                    var waitTime = callback(cdmHttpResponse, hasFailed, retryNumber + 1);

                    // Callback returned back that we do not want to retry anymore (probably successful request, client can set up what they want here).
                    if (waitTime == null)
                    {
                        return cdmHttpResponse;
                    }
                    else
                    {
                        // Sleep time specified by the callback.
                        Thread.Sleep((int)waitTime.Value.TotalMilliseconds);
                    }
                }
                else
                {
                    // CDM Http Response exists, could be successful or bad (e.g. 403/404), it is up to caller to deal with it.
                    if (cdmHttpResponse != null)
                    {
                        return cdmHttpResponse;
                    }
                    else if (retryNumber < cdmRequest.NumberOfRetries || maxTimeoutToken.IsCancellationRequested)
                    {
                        throw new CdmTimedOutException("Request timeout.");
                    }
                    else
                    {
                        // If response doesn't exist repeatedly, just throw that the number of retries has exceeded (we don't have any other information).
                        throw new CdmNumberOfRetriesExceededException();
                    }
                }
            }

            // Should never come here, but just in case throw this exception.
            throw new CdmNumberOfRetriesExceededException();
        }

        /// <summary>
        /// Combine the base URL with the URL's suffix.
        /// </summary>
        /// <param name="baseUrl">The base URL.</param>
        /// <param name="suffix">The suffix.</param>
        /// <returns>The <see cref="string"/>, representing the final URL.</returns>
        private static string Combine(string baseUrl, string suffix)
        {
            baseUrl = baseUrl.TrimEnd('/');
            suffix = suffix.TrimStart('/');
            return $"{baseUrl}/{suffix}";
        }

        /// <summary>
        /// Disposes the HTTP client to release the resource.
        /// </summary>
        public void Dispose()
        {
            this.client.Dispose();
        }

        /// <summary>
        /// The API endpoint.
        /// </summary>
        private string apiEndpoint;

        /// <summary>
        /// The system Http client.
        /// </summary>
        private HttpClient client;

        /// <summary>
        /// Denotes whether API endpoint was set on the client.
        /// </summary>
        private bool isApiEndpointSet;
    }
}
