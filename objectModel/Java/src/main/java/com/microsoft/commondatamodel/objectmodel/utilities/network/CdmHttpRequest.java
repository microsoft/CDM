package com.microsoft.commondatamodel.objectmodel.utilities.network;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

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
        this.headers = new HashMap<>();
        this.requestedUrl = url;
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
}