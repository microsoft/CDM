// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.network;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * CDM Http Client is an HTTP client which implements retry logic to execute retries in the case of failed requests.
 * A user can specify API endpoint when creating the client and additional path in the CDM HTTP request.
 * Alternatively, if a user doesn't specify API endpoint in the client, it has to specify the full path in the request.
 * The client also expects a user to specify callback function which will be used in the case of a failure (4xx or 5xx HTTP standard status codes).
 */
public class CdmHttpClient {
    private static final String TAG = CdmHttpClient.class.getSimpleName();

    @FunctionalInterface
    public interface Callback {
        Duration apply(CdmHttpResponse response, boolean hasFailed, int retryNumber);
    }

    private Map<String, String> headers;

    private HttpClient client;

    private String apiEndpoint;

    public CdmHttpClient() {
        this(null, null);
    }

    public CdmHttpClient(final String apiEndpoint) {
        this(apiEndpoint, null);
    }

    public CdmHttpClient(final String apiEndpoint, final HttpClient httpClientHandler) {
        this.headers = new LinkedHashMap<>();

        if (apiEndpoint != null) {
            this.apiEndpoint = apiEndpoint;
        }

        if (httpClientHandler != null) {
            this.client = httpClientHandler;
        } else {
            this.client = HttpClientBuilder.create().build();
        }
    }

    /**
     * Send a CDM request with the retry logic.
     *
     * @param cdmHttpRequest The CDM Http request.
     * @param callback       The callback that gets executed after the request finishes.
     * @return A CompletableFuture object, representing the CDM Http response.
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CompletableFuture<CdmHttpResponse> sendAsync(final CdmHttpRequest cdmHttpRequest,
                                                        final Callback callback,
                                                        final CdmCorpusContext ctx) {
        final CompletableFuture<CdmHttpResponse> response = new CompletableFuture<>();
        CompletableFuture.runAsync(() -> {
            //  Merge headers first.
            for (final Map.Entry<String, String> item : this.headers.entrySet()) {
                cdmHttpRequest.getHeaders().put(item.getKey(), item.getValue());
            }
            try {
                // Wait for all the requests to finish, if the time exceeds maximum timeout throw the CDM timed out exception.
                TimeLimitedNetworkBlockExecutor.runWithTimeout(() -> {
                    try {
                        final CdmHttpResponse cdmHttpResponse = sendAsyncHelper(cdmHttpRequest, callback, ctx);
                        if (cdmHttpRequest != null) {
                            response.complete(cdmHttpResponse);
                        }
                    } catch (final CdmNetworkException e) {
                        response.completeExceptionally(e);
                    }
                }, cdmHttpRequest.getMaximumTimeout().toMillis(), TimeUnit.MILLISECONDS);
            } catch (final Exception exception) {
                response.completeExceptionally(new RuntimeException(exception));
            }
        });
        return response;
    }

    /**
     * Send a CDM request with the retry logic helper function.
     *
     * @param cdmHttpRequest The CDM Http request.
     * @param callback       The callback that gets executed after the request finishes.
     * @return A CompletableFuture object, representing the CDM Http response.
     */
    private CdmHttpResponse sendAsyncHelper(final CdmHttpRequest cdmHttpRequest,
                                            final Callback callback,
                                            final CdmCorpusContext ctx) {
        URI fullUri = null;
        try {
            if (this.apiEndpoint != null) {
                fullUri = new URI(combineUrls(this.apiEndpoint, cdmHttpRequest.getRequestedUrl()));
            } else {
                fullUri = new URI(cdmHttpRequest.getRequestedUrl());
            }
        }

        catch (final URISyntaxException e) {
            // Shouldn't happen, but just in case, throw an exception if it happens.
            throw new CdmHttpRequestException(e.getMessage());
        }

        final HttpRequestBase httpRequest = this.getHttpClientInstance(fullUri, cdmHttpRequest.getMethod());
        for (final Map.Entry<String, String> item : cdmHttpRequest.getHeaders().entrySet()) {
            httpRequest.setHeader(item.getKey(), item.getValue());
        }

        // Set timeout.
        final RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout((int) cdmHttpRequest.getTimeout().toMillis()).build();
        httpRequest.setConfig(requestConfig);

        // Some requests might not have any content, so check for it.
        if (cdmHttpRequest.getContent() != null) {
            final StringEntity stringEntity = new StringEntity(cdmHttpRequest.getContent(), StandardCharsets.UTF_8);
            stringEntity.setContentType(cdmHttpRequest.getContentType());
            if (httpRequest instanceof HttpPost) {
                ((HttpPost) httpRequest).setEntity(stringEntity);
            } else if (httpRequest instanceof HttpPut) {
                ((HttpPut) httpRequest).setEntity(stringEntity);
            } else if (httpRequest instanceof HttpPatch) {
                ((HttpPatch) httpRequest).setEntity(stringEntity);
            }
        }
        // If the number of retries is 0, we only try once, otherwise we retry the specified number of times.
        for (int retryNumber = 0; retryNumber <= cdmHttpRequest.getNumberOfRetries(); retryNumber++) {
            boolean hasFailed = false;
            CdmHttpResponse cdmHttpResponse = null;
            final Instant startTime = java.time.Instant.now();
            try {
                if (ctx != null)
                {
                    Logger.info(ctx, TAG, "sendAsyncHelper",
                            null, Logger.format("Sending request {0}, request type: {1}, request url: {2}, retry number: {3}.", cdmHttpRequest.getRequestId(), httpRequest.getMethod(), cdmHttpRequest.stripSasSig(), retryNumber));
                }

                final HttpResponse response = client.execute(httpRequest);

                if (ctx != null)
                {
                    final Instant endTime = java.time.Instant.now();
                    Logger.info(ctx, TAG, "sendAsyncHelper",
                            null, Logger.format("Response for request id: {0}, elapsed time: {1} ms, content length: {2}, status code: {3}.",
                            response.getFirstHeader("x-ms-request-id").getValue(),
                            Duration.between(startTime, endTime).toMillis(),
                            response.getEntity() != null ? response.getEntity().getContentLength() : "",
                            response.getStatusLine() != null ? response.getStatusLine().getStatusCode() : ""
                            ));
                }

                if (response != null) {
                    cdmHttpResponse = new CdmHttpResponse(response.getStatusLine().getStatusCode());
                    final HttpEntity responseEntity = response.getEntity();
                    if (responseEntity != null && responseEntity.getContent() != null) {
                        cdmHttpResponse.setContent(IOUtils.toString(
                            responseEntity.getContent(),
                            StandardCharsets.UTF_8));
                    }

                    cdmHttpResponse.setReason(response.getStatusLine().getReasonPhrase());

                    // If the HTTP response code is in the 2xx format, it is successful.
                    cdmHttpResponse.setSuccessful(response.getStatusLine().getStatusCode() / 100 == 2);
                    if (response.getAllHeaders() != null) {
                        for (final Header header : response.getAllHeaders()) {
                            cdmHttpResponse.getResponseHeaders().put(header.getName(), header.getValue());
                        }
                    }
                }
            } catch (final Exception exception) {
                final Instant endTime = java.time.Instant.now();
                hasFailed = true;

                if (exception instanceof ConnectTimeoutException && ctx != null) {
                    Logger.info(ctx, TAG, "sendAsyncHelper",
                            null, Logger.format("Request {0} timeout after {1} ms.", cdmHttpRequest.getRequestId(), Duration.between(startTime, endTime).toMillis()));
                }

                // Only throw an exception if another retry is not expected anymore.
                if (callback == null || retryNumber == cdmHttpRequest.getNumberOfRetries()) {
                    if (retryNumber != 0) {
                        throw new CdmNumberOfRetriesExceededException();
                    } else if (exception instanceof ConnectTimeoutException) {
                        throw new CdmTimedOutException(exception.getMessage());
                    } else {
                        throw new RuntimeException(exception);
                    }
                }
            }

            // Check whether we have a callback function set and whether this is not our last retry.
            if (callback != null && retryNumber != cdmHttpRequest.getNumberOfRetries()) {

                final Duration waitTime = callback.apply(cdmHttpResponse, hasFailed, retryNumber + 1);

                // Callback returned that we do not want to retry anymore (probably successful request, client can set up what they want here).
                if (waitTime == null) {

                    // We don't want any leaks :)
                    httpRequest.releaseConnection();
                    return cdmHttpResponse;
                } else {
                    try {
                        // Sleep time specified by the callback.
                        Thread.sleep(waitTime.toMillis());
                    } catch (final InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                }
            } else {

                // We don't want any leaks :)
                httpRequest.releaseConnection();

                // CDM Http Response exists, could be successful or bad (e.g. 403/404), it is up to caller to deal with it.
                if (cdmHttpResponse != null) {
                    return cdmHttpResponse;
                } else if (retryNumber < cdmHttpRequest.getNumberOfRetries()) {
                    throw new CdmTimedOutException("Request timeout.");
                } else {
                    // If response doesn't exist repeatedly, just throw that the number of retries has exceeded (we don't have any other information).
                    throw new CdmNumberOfRetriesExceededException();
                }
            }
        }

        // Should never come here, but just in case throw this exception.
        throw new CdmNumberOfRetriesExceededException();
    }

    /**
     * fetchs the correct HTTP request instance.
     *
     * @param uri    The URI.
     * @param method The HTTP method.
     * @return An HttpRequestBase object.
     */
    private HttpRequestBase getHttpClientInstance(final URI uri, final String method) {
        switch (method) {
            case "PUT":
                return new HttpPut(uri);
            case "POST":
                return new HttpPost(uri);
            case "PATCH":
                return new HttpPatch(uri);
            default:
                final HttpRequestBase request = new HttpRequestBase() {
                    @Override
                    public String getMethod() {
                        return method;
                    }
                };
                request.setURI(uri);
                return request;
        }
    }

    /**
     * Combine the base URL with the URL's suffix.
     *
     * @param baseUrl The base URL.
     * @param suffix  The suffix.
     * @return A String, representing the final URL.
     */
    private static String combineUrls(String baseUrl, String suffix) {
        baseUrl = baseUrl.replaceAll("/+$", "");
        suffix = suffix.replace("^/+", "");
        return baseUrl + "/" + suffix;
    }
}
