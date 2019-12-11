/**
 * The CDM Http request class that is being used by CDM Http client to execute network requests.
 */
export class CdmHttpRequest {

    /**
     * The headers.
     */
    public headers: Map<string, string>;

    /**
     * The content.
     */
    public content: string;

    /**
     * The content type.
     */
    public contentType: string;

    /**
     * The HTTP method.
     */
    public method: string;

    /**
     * The request URL (can be partial or full), depends on whether the client has URL set.
     */
    public requestedUrl: string;

    /**
     * The timeout of a single request in milliseconds.
     */
    public timeout?: number;

    /**
     * The timeout of all of the requests in milliseconds.
     */
    public maximumTimeout?: number;

    /**
     * The number of retries.
     */
    public numberOfRetries: number;

    constructor(url: string, numberOfRetries: number = 0, method?: string) {
        this.headers = new Map<string, string>();
        this.requestedUrl = url;
        this.numberOfRetries = numberOfRetries;

        // If there is no HTTP method specified, assume GET.
        if (method === undefined) {
            this.method = 'GET';
        } else {
            this.method = method;
        }
    }
}
