// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.network;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

public class CdmHttpRequest {
    /**
     * The headers.
     */
    private Map<String, String> headers;
    /**
     * The content.
     */
    private String content;

    /**
     * The content type.
     */
    private String contentType;

    /**
     * The HTTP method.
     */
    private String method;

    /**
     * The request URL (can be partial or full), depends on whether the client has URL set.
     */
    private String requestedUrl;

    /**
     * The unique id of the request for logging.
     */
    private UUID requestId;

    /**
     * The timeout of a single request.
     */
    private Duration timeout;

    /**
     * The timeout of all of the requests.
     */
    private Duration maximumTimeout;

    /**
     * The number of retries.
     */
    private int numberOfRetries;

    public CdmHttpRequest(final String url) {
        this(url, 0, null);
    }

    public CdmHttpRequest(final String url, final int numberOfRetries) {
        this(url, numberOfRetries, null);
    }

    public CdmHttpRequest(final String url, final int numberOfRetries, final String method) {
        this.headers = new LinkedHashMap<>();
        this.requestedUrl = url;
        this.requestId = UUID.randomUUID();
        this.numberOfRetries = numberOfRetries;

        if (method == null) {
            this.method = "GET";
        } else {
            this.method = method;
        }
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(final Map<String, String> headers) {
        this.headers = headers;
    }

    public String getContent() {
        return content;
    }

    public void setContent(final String content) {
        this.content = content;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(final String contentType) {
        this.contentType = contentType;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(final String method) {
        this.method = method;
    }

    public String getRequestedUrl() {
        return requestedUrl;
    }

    public void setRequestedUrl(final String requestedUrl) {
        this.requestedUrl = requestedUrl;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(final UUID requestId) {
        this.requestId = requestId;
    }

    public Duration getTimeout() {
        return timeout;
    }

    public void setTimeout(final Duration timeout) {
        this.timeout = timeout;
    }

    public Duration getMaximumTimeout() {
        return maximumTimeout;
    }


    public void setMaximumTimeout(final Duration maximumTimeout) {
        this.maximumTimeout = maximumTimeout;
    }


    public int getNumberOfRetries() {
        return numberOfRetries;
    }


    public void setNumberOfRetries(final int numberOfRetries) {
        this.numberOfRetries = numberOfRetries;
    }

    /**
     * Strips sas token parameter 'sig'. 
     * @return The requested url with the value of 'sig' replaced with 'REMOVED'.
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public String stripSasSig () {
        int sigStartIndex = this.requestedUrl.indexOf("sig=");
        if (sigStartIndex == -1) {
            return this.requestedUrl;
        }

        int sigEndIndex = this.requestedUrl.indexOf("&", sigStartIndex + 1);
        sigEndIndex = sigEndIndex == -1 ? this.requestedUrl.length() : sigEndIndex;
        return this.requestedUrl.substring(0, sigStartIndex + 4) + "REMOVED" + this.requestedUrl.substring(sigEndIndex);
    }
}
