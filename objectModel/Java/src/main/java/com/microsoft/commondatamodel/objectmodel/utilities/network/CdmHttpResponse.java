package com.microsoft.commondatamodel.objectmodel.utilities.network;

import java.util.HashMap;
import java.util.Map;

public class CdmHttpResponse {

    /**
     * The standard HTTP status code.
     */
    private int statusCode;

    /**
     * The reason.
     */
    private String reason;

    /**
     * The response headers.
     */
    private Map<String, String> responseHeaders;

    /**
     * The content.
     */
    private String content;

    /**
     * The boolean that denotes whether the request was successful.
     */
    private boolean isSuccessful;


    public CdmHttpResponse() {
        this.responseHeaders = new HashMap<>();
    }

    public CdmHttpResponse(final int statusCode) {
        this();
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public Map<String, String> getResponseHeaders() {
        return responseHeaders;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(final String reason) {
        this.reason = reason;
    }

    public String getContent() {
        return content;
    }

    public void setContent(final String content) {
        this.content = content;
    }

    public boolean isSuccessful() {
        return isSuccessful;
    }

    public void setSuccessful(final boolean successful) {
        isSuccessful = successful;
    }
}
