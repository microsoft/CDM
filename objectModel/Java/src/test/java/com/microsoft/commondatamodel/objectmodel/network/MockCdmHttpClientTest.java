package com.microsoft.commondatamodel.objectmodel.network;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.testng.Assert.fail;

import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpClient;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpRequest;
import com.microsoft.commondatamodel.objectmodel.utilities.network.CdmHttpResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.Duration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import org.apache.http.Header;
import org.apache.http.HeaderIterator;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ProtocolVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.params.HttpParams;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.stubbing.Answer;
import org.testng.Assert;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class MockCdmHttpClientTest {
    @Mock
    HttpClient httpClient;

    @Mock
    HttpResponse httpResponse;

    @BeforeTest
    public void setup() throws IOException {
        MockitoAnnotations.initMocks(this);

        this.httpResponse = mock(HttpResponse.class, RETURNS_DEEP_STUBS);
    }

    @Test
    public void testFirstTimeReturnedResult() throws Exception {
        when(this.httpClient.execute(any())).thenReturn(this.httpResponse);

        when(httpResponse.getStatusLine()).thenReturn(new StatusLine() {
            @Override
            public ProtocolVersion getProtocolVersion() {
                return new ProtocolVersion("http", 1, 1);
            }

            @Override
            public int getStatusCode() {
                return 200;
            }

            @Override
            public String getReasonPhrase() {
                return "OK";
            }
        });

        final InputStream stubInputStream = new ByteArrayInputStream("test data".getBytes());

        when(httpResponse.getEntity().getContent()).thenReturn(stubInputStream);

        final CdmHttpClient cdmHttpClient = new CdmHttpClient("https://www.example.com", httpClient);

        final CdmHttpRequest cdmHttpRequest = new CdmHttpRequest("/example2.json");
        final Map<String, String> headers = new HashMap<>();
        headers.put("User-Agent", "CDM");
        cdmHttpRequest.setHeaders(headers);
        cdmHttpRequest.setMethod("GET");
        cdmHttpRequest.setNumberOfRetries(0);
        cdmHttpRequest.setMaximumTimeout(Duration.ofMillis(10000));
        cdmHttpRequest.setTimeout(Duration.ofMillis(5000));

        final CdmHttpResponse cdmHttpResponse = cdmHttpClient.sendAsync(cdmHttpRequest, null).get();

        Assert.assertEquals(200, cdmHttpResponse.getStatusCode());
        Assert.assertEquals("test data", cdmHttpResponse.getContent());
    }

    @Test
    public void testMaximumTimeout() throws Exception {
        when(this.httpClient.execute(any())).thenReturn(this.httpResponse);
        when(httpResponse.getStatusLine()).thenReturn(new StatusLine() {
            @Override
            public ProtocolVersion getProtocolVersion() {
                return new ProtocolVersion("http", 1, 1);
            }

            @Override
            public int getStatusCode() {
                try {
                    Thread.sleep(1200);
                } catch (final InterruptedException e) {
                    //e.printStackTrace();
                }
                return 200;
            }

            @Override
            public String getReasonPhrase() {
                return "OK";
            }
        });

        final InputStream stubInputStream = new ByteArrayInputStream("test data".getBytes());

        when(httpResponse.getEntity().getContent()).thenReturn(stubInputStream);

        final CdmHttpClient cdmHttpClient = new CdmHttpClient("https://www.example.com", httpClient);

        final CdmHttpRequest cdmHttpRequest = new CdmHttpRequest("/example2.json");
        final Map<String, String> headers = new HashMap<>();
        headers.put("User-Agent", "CDM");
        cdmHttpRequest.setHeaders(headers);
        cdmHttpRequest.setMethod("GET");
        cdmHttpRequest.setNumberOfRetries(0);
        cdmHttpRequest.setMaximumTimeout(Duration.ofMillis(1000));
        cdmHttpRequest.setTimeout(Duration.ofMillis(1500));

        try {
            final CdmHttpResponse cdmHttpResponse = cdmHttpClient.sendAsync(cdmHttpRequest, null).get();
            fail("An exception was expected.");
        } catch (final Exception ex) {
            Assert.assertTrue(ex.getMessage().contains("CdmTimedOutException"));
        }
    }

    @Test
    public void testNormalTimeoutMultipleRetries() throws Exception {
        when(this.httpClient.execute(any())).thenThrow(new ConnectTimeoutException());

        final CdmHttpClient cdmHttpClient = new CdmHttpClient("https://www.example.com", httpClient);

        final CdmHttpRequest cdmHttpRequest = new CdmHttpRequest("/example2.json");
        final Map<String, String> headers = new HashMap<>();
        headers.put("User-Agent", "CDM");
        cdmHttpRequest.setHeaders(headers);
        cdmHttpRequest.setMethod("GET");
        cdmHttpRequest.setNumberOfRetries(2);
        cdmHttpRequest.setMaximumTimeout(Duration.ofMillis(100000));
        cdmHttpRequest.setTimeout(Duration.ofMillis(500));
        try {
            final CdmHttpResponse cdmHttpResponse = cdmHttpClient.sendAsync(cdmHttpRequest, this::defaultWaitTimeCallback).get();
            fail("An exception was expected.");
        } catch (final Exception ex) {
            Assert.assertTrue(ex.getMessage().contains("CdmNumberOfRetriesExceededException"));
        }
    }

    @Test
    public void testFailureThenSuccess() throws Exception {
        final HttpClient ht = mock(HttpClient.class);
        when(ht.execute(any())).thenAnswer((Answer<HttpResponse>) invocationOnMock -> {
            if (retryCounter == 0) {
                retryCounter++;
                throw new ConnectTimeoutException();
            } else {
                return generateStubHttpResponse();
            }
        });

        final CdmHttpClient cdmHttpClient = new CdmHttpClient("https://www.example.com", ht);

        final CdmHttpRequest cdmHttpRequest = new CdmHttpRequest("/example2.json");
        final Map<String, String> headers = new HashMap<>();
        headers.put("User-Agent", "CDM");
        cdmHttpRequest.setHeaders(headers);
        cdmHttpRequest.setMethod("GET");
        cdmHttpRequest.setNumberOfRetries(2);
        cdmHttpRequest.setMaximumTimeout(Duration.ofMillis(100000));
        cdmHttpRequest.setTimeout(Duration.ofMillis(500));


        final CdmHttpResponse cdmHttpResponse = cdmHttpClient.sendAsync(cdmHttpRequest, this::defaultWaitTimeCallback).get();

        Assert.assertNotNull(cdmHttpResponse);

    }

    private HttpResponse generateStubHttpResponse() {
        return new HttpResponse() {
            @Override
            public StatusLine getStatusLine() {
                return new StatusLine() {
                    @Override
                    public ProtocolVersion getProtocolVersion() {
                        return new ProtocolVersion("http", 1, 1);
                    }

                    @Override
                    public int getStatusCode() {
                        try {
                            Thread.sleep(1200);
                        } catch (final InterruptedException e) {
                            e.printStackTrace();
                        }
                        return 200;
                    }

                    @Override
                    public String getReasonPhrase() {
                        return "OK";
                    }
                };
            }

            @Override
            public void setStatusLine(final StatusLine statusLine) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void setStatusLine(final ProtocolVersion protocolVersion, final int i) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void setStatusLine(final ProtocolVersion protocolVersion, final int i, final String s) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void setStatusCode(final int i) throws IllegalStateException {
                throw new UnsupportedOperationException();
            }

            @Override
            public void setReasonPhrase(final String s) throws IllegalStateException {
                throw new UnsupportedOperationException();
            }

            @Override
            public HttpEntity getEntity() {
                final HttpEntity entity = new HttpEntity() {
                    @Override
                    public boolean isRepeatable() {
                        return false;
                    }

                    @Override
                    public boolean isChunked() {
                        return false;
                    }

                    @Override
                    public long getContentLength() {
                        return 0;
                    }

                    @Override
                    public Header getContentType() {
                        return null;
                    }

                    @Override
                    public Header getContentEncoding() {
                        return null;
                    }

                    @Override
                    public InputStream getContent() throws IOException, UnsupportedOperationException {
                        final InputStream stubInputStream = new ByteArrayInputStream("test data".getBytes());
                        return stubInputStream;
                    }

                    @Override
                    public void writeTo(final OutputStream outputStream) throws IOException {
                        throw new UnsupportedOperationException();
                    }

                    @Override
                    public boolean isStreaming() {
                        return false;
                    }

                    @Override
                    public void consumeContent() throws IOException {
                        throw new UnsupportedOperationException();
                    }
                };

                return entity;
            }

            @Override
            public void setEntity(final HttpEntity httpEntity) {
                throw new UnsupportedOperationException();
            }

            @Override
            public Locale getLocale() {
                return null;
            }

            @Override
            public void setLocale(final Locale locale) {
                throw new UnsupportedOperationException();
            }

            @Override
            public ProtocolVersion getProtocolVersion() {
                return null;
            }

            @Override
            public boolean containsHeader(final String s) {
                return false;
            }

            @Override
            public Header[] getHeaders(final String s) {
                return new Header[0];
            }

            @Override
            public Header getFirstHeader(final String s) {
                return null;
            }

            @Override
            public Header getLastHeader(final String s) {
                return null;
            }

            @Override
            public Header[] getAllHeaders() {
                return new Header[0];
            }

            @Override
            public void addHeader(final Header header) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void addHeader(final String s, final String s1) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void setHeader(final Header header) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void setHeader(final String s, final String s1) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void setHeaders(final Header[] headers) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void removeHeader(final Header header) {
                throw new UnsupportedOperationException();
            }

            @Override
            public void removeHeaders(final String s) {
                throw new UnsupportedOperationException();
            }

            @Override
            public HeaderIterator headerIterator() {
                return null;
            }

            @Override
            public HeaderIterator headerIterator(final String s) {
                return null;
            }

            @Override
            public HttpParams getParams() {
                return null;
            }

            @Override
            public void setParams(final HttpParams httpParams) {
                throw new UnsupportedOperationException();
            }
        };
    }

    private Duration defaultWaitTimeCallback(final CdmHttpResponse response, final boolean hasFailed, final int retryNumber) {
        if (response != null && response.isSuccessful() && !hasFailed) {
            return null;
        } else {
            final Random random = new Random();

            // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
            final int waitTime = random.nextInt(1 << retryNumber) * 500;
            return Duration.ofMillis(waitTime);
        }
    }

    private int retryCounter = 0;
}
