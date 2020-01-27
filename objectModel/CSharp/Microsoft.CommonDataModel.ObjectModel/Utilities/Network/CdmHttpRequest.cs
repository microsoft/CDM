//-----------------------------------------------------------------------
// <copyrightfile="CdmHttpRequest.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    public class CdmHttpRequest
    {
        /// <summary>
        /// The headers.
        /// </summary>
        public Dictionary<string, string> Headers { get; set; }

        /// <summary>
        /// The content.
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// The content type.
        /// </summary>
        public string ContentType { get; set; }

        /// <summary>
        /// The HTTP method.
        /// </summary>
        public HttpMethod Method { get; set; }

        /// <summary>
        /// The request URL (can be partial or full), depends on whether the client has URL set.
        /// </summary>
        public string RequestedUrl { get; set; }

        /// <summary>
        /// The timeout of a single request.
        /// </summary>
        public TimeSpan? Timeout { get; set; }

        /// <summary>
        /// The timeout of all of the requests.
        /// </summary>
        public TimeSpan? MaximumTimeout { get; set; }

        /// <summary>
        /// The number of retries.
        /// </summary>
        public int NumberOfRetries { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmHttpRequest"/> class.
        /// </summary>
        /// <param name="url">The URL.</param>
        /// <param name="numberOfRetries">The number of retries.</param>
        /// <param name="method">The method.</param>
        public CdmHttpRequest(string url, int numberOfRetries = 0, HttpMethod method = null)
        {
            this.Headers = new Dictionary<string, string>();
            this.RequestedUrl = url;
            this.NumberOfRetries = numberOfRetries;
            
            // If not HTTP method is specified, assume GET.
            if (method == null)
            {
                this.Method = HttpMethod.Get;
            }
            else
            {
                this.Method = method;
            }
        }
    }
}
