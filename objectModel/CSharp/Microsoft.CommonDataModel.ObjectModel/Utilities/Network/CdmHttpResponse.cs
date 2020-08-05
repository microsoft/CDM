// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;

    public class CdmHttpResponse : IDisposable
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
        /// If this object was already disposed or not.
        /// </summary>
        private bool IsDisposed { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmHttpResponse"/> class.
        /// </summary>
        public CdmHttpResponse()
        {
            this.ResponseHeaders = new Dictionary<string, string>();
        }

        /// <summary>
        /// Destroys this instance of the <see cref="CdmHttpResponse"/> class.
        /// </summary>
        ~CdmHttpResponse()
        {
            this.Dispose();
            GC.SuppressFinalize(this);
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

        /// <summary>
        /// Disposes the object and its inner disposable references.
        /// </summary>
        public void Dispose()
        {
            if (!IsDisposed)
            {
                IsDisposed = true;
                this.Content.Dispose();
            }
        }
    }
}
