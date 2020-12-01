// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.aad.adal4j.AuthenticationResult;
import com.microsoft.aad.adal4j.ClientCredential;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

public class AzureStorageAdapter extends StorageAdapterBase {
    // TODO-BQ: 8/7/2019 Move to TimeUtils class
    private static final String RFC_1123_DATETIME_FORMAT = "EEE, dd MMM yyyy HH:mm:ss zzz";

    private final AuthenticationContext context;
    private final String root;
    private final String hostname;
    private final String tenant;
    private final String clientId;
    private final String resource;
    private final String secret;
    private String locationHint;

    public AzureStorageAdapter(final String root, final String hostname, final String tenant, final String clientId, final String resource, final String secret) throws MalformedURLException {
        this.root = root;
        this.hostname = hostname;
        this.tenant = tenant;
        this.clientId = clientId;
        this.resource = resource;
        this.secret = secret;

        // TODO-BQ: 8/6/2019 Check if this executor should be shared and what is the
        // pool size
        final ExecutorService execService = Executors.newFixedThreadPool(10);
        context = new AuthenticationContext("https://login.windows.net/" + tenant, true, execService);
    }

    public boolean canRead() {
        return true;
    }

    public CompletableFuture<String> readAsync(final String corpusPath) {
        return CompletableFuture.supplyAsync(() -> {
            try (final CloseableHttpClient httpClient = HttpClientBuilder.create().build()) {
                final HttpRequestBase httpGet = buildMessage("GET", corpusPath);

                try (final CloseableHttpResponse response = httpClient.execute(httpGet)) {
                    final int code = response.getStatusLine().getStatusCode();

                    if (HttpURLConnection.HTTP_OK == code) {
                        final BufferedReader in = new BufferedReader(
                                new InputStreamReader(response.getEntity().getContent()));

                        final StringBuilder content = new StringBuilder();

                        String inputLine;
                        while (null != (inputLine = in.readLine())) {
                            content.append(inputLine);
                        }
                        return content.toString();
                    } else {
                        final HttpEntity resEntity = response.getEntity();
                        throw new StorageAdapterException("Could not read Azure Storage content at path: " + corpusPath + "."
                                + (resEntity != null ? " Reason: " + EntityUtils.toString(resEntity) : ""));
                    }
                }
            } catch (final Exception e) {
                throw new StorageAdapterException("Could not read Azure Storage content at path: " + corpusPath, e);
            }
        });
    }

    public boolean canWrite() {
        return true;
    }

    public CompletableFuture<Void> writeAsync(final String corpusPath, final String data) {
        if (!ensurePath(root + corpusPath)) {
            throw new IllegalArgumentException("Could not create folder for document '" + corpusPath + "'");
        }

        return CompletableFuture.runAsync(() -> {
            try (final CloseableHttpClient httpClient = HttpClientBuilder.create().build()) {
                final HttpPut httpPut = (HttpPut) buildMessage("PUT", corpusPath);
                final StringEntity entity = new StringEntity(JMapper.WRITER.writeValueAsString(data), "UTF-8");
                entity.setContentType("application/json; charset=utf-8");
                httpPut.setEntity(entity);

                try (final CloseableHttpResponse response = httpClient.execute(httpPut)) {
                    final int code = response.getStatusLine().getStatusCode();

                    if (HttpURLConnection.HTTP_CREATED != code) {
                        final HttpEntity resEntity = response.getEntity();
                        throw new StorageAdapterException("Could not write Azure Storage content at path: " + corpusPath + "."
                                + (resEntity != null ? " Reason: " + EntityUtils.toString(resEntity) : ""));
                    }
                }
            } catch (final Exception e) {
                throw new StorageAdapterException("Could not write Azure Storage content at path: " + corpusPath, e);
            }
        });
    }

    // TODO-BQ: Remove this method after Victor's PR goes in on C# side
    public CompletableFuture<Boolean> dirExistsAsync(final String folderName) {
        return CompletableFuture.completedFuture(true);
    }

    public String createAdapterPath(final String corpusPath) {
        return "https://" + hostname + root + corpusPath;
    }

    public String createCorpusPath(final String adapterPath) {
        final String prefix = "https://" + hostname + root;

        if (adapterPath.startsWith(prefix)) {
            return adapterPath.substring(prefix.length());
        }

        return null;
    }

    private Future<AuthenticationResult> generateBearerToken() {
        final ClientCredential clientCredentials = new ClientCredential(clientId, secret);
        return context.acquireToken(resource, clientCredentials, null);
    }

    /**
     * Generates a HTTP request message with required headers to work with Azure Storage API.
     *
     * @param method Type of HTTP request
     * @param path URL of a resource
     * @return Constructed HTTP request message.
     */
    private HttpRequestBase buildMessage(final String method, final String path) throws InterruptedException, ExecutionException {
        final String fullPath = "https://" + hostname + root + path;
        final HttpRequestBase result;
        if (method.equalsIgnoreCase("GET"))
            result = new HttpGet(fullPath);
        else if (method.equalsIgnoreCase("PUT"))
            result = new HttpPut(fullPath);
        else
            throw new IllegalArgumentException("Only HTTP methods GET and PUT are supported");

        final AuthenticationResult token = generateBearerToken().get();

        result.setHeader("authorization", token.getAccessTokenType() + " " + token.getAccessToken());
        // Add timestamp in RFC1123 pattern format
        // TODO-BQ: 8/6/2019 Move this to TimeUtils class
        final SimpleDateFormat sdf = new SimpleDateFormat(RFC_1123_DATETIME_FORMAT, Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
        result.setHeader("x-ms-date", sdf.format(new Date()));
        // Pin to specific API version (release 2018-03-28)
        result.setHeader("x-ms-version", "2018-03-28");

        if (method.equalsIgnoreCase("PUT"))
            result.setHeader("x-ms-blob-type", "BlockBlob");

        return result;
    }

    private boolean ensurePath(final String pathFor) {
        // Folders don't explicitly exist in an Azure Storage FS
        return pathFor.lastIndexOf("/") != -1;
    }
}
