//-----------------------------------------------------------------------
// <copyrightfile="CdmHttpResponse.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    public class CdmHttpResponse
    {
        /// <summary>
        /// The HTTP status code.
        /// </summary>
        public HttpStatusCode StatusCode { get; }

        /// <summary>
        /// The reason.
        /// </summary>
        public string Reason { get; set; }

        /// <summary>
        /// The response headers.
        /// </summary>
        public Dictionary<string, string> ResponseHeaders { get; }

        /// <summary>
        /// The content.
        /// </summary>
        public HttpContent Content { get; set; }

        /// <summary>
        /// The boolean that denotes whether the request was successful.
        /// </summary>
        public bool IsSuccessful { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmHttpResponse"/> class.
        /// </summary>
        public CdmHttpResponse()
        {
            this.ResponseHeaders = new Dictionary<string, string>();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmHttpResponse"/> class.
        /// </summary>
        /// <param name="statusCode">The status code.</param>
        public CdmHttpResponse(HttpStatusCode statusCode)
        {
            this.StatusCode = statusCode;
            this.ResponseHeaders = new Dictionary<string, string>();
        }
    }
}
