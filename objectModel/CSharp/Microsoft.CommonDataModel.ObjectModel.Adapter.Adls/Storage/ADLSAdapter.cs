// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Security.Cryptography;
    using System.Text;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Storage;

    using Microsoft.Identity.Client;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    public class ADLSAdapter : NetworkAdapter
    {
        private const double ADLSDefaultTimeout = 6000;

        private IConfidentialClientApplication Context;

        /// <summary>
        /// The root.
        /// </summary>
        public string Root
        {
            get
            {
                return this._root;
            }
            private set
            {
                this._root = this.ExtractRootBlobContainerAndSubPath(value);
            }
        }

        private string _root;

        /// <summary>
        /// The hostname of ADLS.
        /// </summary>
        public string Hostname
        {
            get
            {
                return this._hostname;
            }
            private set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentException("Hostname cannot be null or whitespace.");
                }
                this._hostname = value;
                this.formattedHostname = this.FormatHostname(this._hostname);
                this.formattedHostnameNoProtocol = this.FormatHostname(this.RemoveProtocolFromHostname(this._hostname));
            }
        }

        private string _hostname;
        private string _sasToken;

        /// <summary>
        /// The tenant.
        /// </summary>
        public string Tenant { get; private set; }

        /// <summary>
        /// The client ID of an application accessing ADLS.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// The secret for the app accessing ADLS.
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// The account/shared key.
        /// </summary>
        public string SharedKey { get; set; }

        /// <summary>
        /// The national clouds endpoints, default is the public cloud endpoint.
        /// </summary>
        public AzureCloudEndpoint? Endpoint { get; set; }

        /// <summary>
        /// The SAS token. If supplied string begins with '?' symbol, the symbol gets stripped away.
        /// </summary>
        public string SasToken
        {
            get
            {
                return _sasToken;
            }
            set
            {
                // Remove the leading question mark, so we can append this token to URLs that already have it
                _sasToken = value != null ?
                    (value.StartsWith("?") ? value.Substring(1) : value)
                    : null;
            }
        }

        /// <summary>
        /// The user-defined token provider.
        /// </summary>
        public TokenProvider TokenProvider { get; set; }

        /// <summary>
        /// The user-defined token provider ( Async ).
        /// </summary>
        public TokenProviderAsync TokenProviderAsync { get; set; }

        /// <summary>
        /// Maximum number of items to be returned by the directory list API.
        /// If omitted or greater than 5,000, the response will include up to 5,000 items.
        /// </summary>
        public int HttpMaxResults = 5000;

        /// <summary>
        /// The map from corpus path to adapter path.
        /// </summary>
        private readonly IDictionary<string, string> adapterPaths = new Dictionary<string, string>();

        /// <summary>
        /// The formatted hostname for validation in CreateCorpusPath.
        /// </summary>
        private string formattedHostname = "";

        /// <summary>
        /// The formatted hostname for validation in CreateCorpusPath without the protocol.
        /// </summary>
        private string formattedHostnameNoProtocol = "";

        /// <summary>
        /// The blob container name of root path.
        /// Leading and trailing slashes should be removed.
        /// e.g. "blob-container-name"
        /// </summary>
        private string rootBlobContainer = "";

        /// <summary>
        /// The unescaped sub-path of root path.
        /// Leading and trailing slashes should be removed.
        /// e.g. "folder1/folder 2"
        /// </summary>
        private string unescapedRootSubPath = "";

        /// <summary>
        /// The escaped sub-path of root path.
        /// Leading and trailing slashes should be removed.
        /// e.g. "folder1/folder%202"
        /// </summary>
        private string escapedRootSubPath = "";

        /// <summary>
        /// A cache for storing last modified times of file paths.
        /// </summary>
        private Dictionary<string, DateTimeOffset> fileModifiedTimeCache = new Dictionary<string, DateTimeOffset>();

        /// <summary>
        /// The Scopes.
        /// </summary>
        private string[] scopes = { $"https://storage.azure.com/.default" };

        /// <summary>
        /// The authorization header key, used during shared key auth.
        /// </summary>
        private const string HttpAuthorization = "Authorization";

        /// <summary>
        /// The MS date header key, used during shared key auth.
        /// </summary>
        private const string HttpXmsDate = "x-ms-date";

        /// <summary>
        /// The MS version key, used during shared key auth.
        /// </summary>
        private const string HttpXmsVersion = "x-ms-version";

        /// <summary>
        /// The MS continuation token key, used when the number of files to list is more than HttpMaxResults.
        /// </summary>
        private const string HttpXmsContinuation = "x-ms-continuation";

        internal const string Type = "adls";

        /// <summary>
        /// The default constructor, a user has to apply JSON config after creating it this way.
        /// </summary>
        public ADLSAdapter()
        {
            this.httpClient = new CdmHttpClient();
            this.Timeout = TimeSpan.FromMilliseconds(ADLSAdapter.ADLSDefaultTimeout);
        }

        /// <summary>
        /// The ADLS constructor for clientId/secret authentication.
        /// </summary>
        public ADLSAdapter(string hostname, string root, string tenant, string clientId, string secret, AzureCloudEndpoint endpoint = AzureCloudEndpoint.AzurePublic) : this()
        {
            this.Hostname = hostname;
            this.Root = root;
            this.Tenant = tenant;
            this.ClientId = clientId;
            this.Secret = secret;
            this.Endpoint = endpoint;
        }

        /// <summary>
        /// The ADLS constructor for shared key authentication.
        /// </summary>
        public ADLSAdapter(string hostname, string root, string sharedKey) : this()
        {
            this.Hostname = hostname;
            this.Root = root;
            this.SharedKey = sharedKey;
        }

        /// <summary>
        /// The ADLS constructor for user-defined token provider.
        /// </summary>
        public ADLSAdapter(string hostname, string root, TokenProvider tokenProvider) : this()
        {
            this.Hostname = hostname;
            this.Root = root;
            this.TokenProvider = tokenProvider;
        }

        /// <summary>
        /// The ADLS constructor for user-defined token provider (Async)).
        /// </summary>
        public ADLSAdapter(string hostname, TokenProviderAsync tokenProviderAsync) : this()
        {
            this.Hostname = hostname;
            this.TokenProviderAsync = tokenProviderAsync;
        }

        /// <summary>
        /// The ADLS constructor without auth info - the auth configuration is set after the construction.
        /// <param name="hostname">Host name</param>
        /// <param name="root">Root location</param>
        /// </summary>
        public ADLSAdapter(string hostname, string root) : this()
        {
            this.Hostname = hostname;
            this.Root = root;
        }

        /// <inheritdoc />
        public override bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public override async Task<string> ReadAsync(string corpusPath)
        {
            string url = this.CreateFormattedAdapterPath(corpusPath);

            var httpRequest = await this.BuildRequest(url, HttpMethod.Get);

            using (var cdmResponse = await base.ExecuteRequest(httpRequest))
            {
                return await cdmResponse.Content.ReadAsStringAsync();
            }
        }

        /// <inheritdoc />
        public override bool CanWrite()
        {
            return true;
        }

        /// <inheritdoc />
        public override async Task WriteAsync(string corpusPath, string data)
        {
            if (EnsurePath($"{this.Root}{corpusPath}") == false)
            {
                throw new Exception($"Could not create folder for document '{corpusPath}'");
            }

            string url = this.CreateFormattedAdapterPath(corpusPath);
            CdmHttpResponse response = await this.CreateFileAtPath(corpusPath, url);

            try
            {
                CdmHttpRequest request = await this.BuildRequest($"{url}?action=append&position=0", new HttpMethod("PATCH"), data, "application/json");
                response = await this.ExecuteRequest(request);

                if (response.StatusCode.Equals(HttpStatusCode.Accepted)) // The uploaded data was accepted.
                {
                    var stringContent = new StringContent(request.Content, Encoding.UTF8, request.ContentType);

                    // Building a request and setting a URL with a position argument to be the length of the byte array of the string content (or length of UTF-8 string content).
                    request = await this.BuildRequest($"{url}?action=flush&position={(await stringContent.ReadAsByteArrayAsync()).Length}", new HttpMethod("PATCH"));
                    response = await this.ExecuteRequest(request);

                    if (!response.StatusCode.Equals(HttpStatusCode.OK)) // Data was not flushed correctly. Delete empty file.
                    {
                        await this.DeleteContentAtPath(corpusPath, url, null);
                        throw new StorageAdapterException($"Could not write ADLS content at path, there was an issue at \"{corpusPath}\" during the flush action. Reason: {response.Reason}");
                    }
                }
                else
                {
                    await this.DeleteContentAtPath(corpusPath, url, null);
                    throw new StorageAdapterException($"Could not write ADLS content at path, there was an issue at \"{corpusPath}\" during the append action. Reason: {response.Reason}");
                }
            }
            catch (StorageAdapterException exc)
            {
                throw exc;
            }
            catch (Exception e)
            {
                await this.DeleteContentAtPath(corpusPath, url, e);
                throw new StorageAdapterException($"Could not write ADLS content at path, there was an issue at: '{corpusPath}'", e);
            }
        }

        /// <inheritdoc />
        public override string CreateAdapterPath(string corpusPath)
        {
            if (corpusPath == null)
            {
                return null;
            }

            var formattedCorpusPath = this.FormatCorpusPath(corpusPath);

            if (formattedCorpusPath == null)
            {
                return null;
            }

            if (adapterPaths.ContainsKey(formattedCorpusPath))
            {
                return adapterPaths[formattedCorpusPath];
            }
            else
            {
                return $"https://{this.RemoveProtocolFromHostname(this.Hostname)}{this.GetEscapedRoot()}{this.EscapePath(formattedCorpusPath)}";
            }
        }

        /// <inheritdoc />
        public override string CreateCorpusPath(string adapterPath)
        {
            if (!string.IsNullOrEmpty(adapterPath))
            {
                var startIndex = "https://".Length;
                var endIndex = adapterPath.IndexOf("/", startIndex + 1);

                if (endIndex < startIndex)
                {
                    throw new Exception($"Unexpected adapter path: {adapterPath}");
                }

                var hostname = this.FormatHostname(adapterPath.Substring(startIndex, endIndex - startIndex));

                if (hostname.Equals(this.formattedHostnameNoProtocol) && adapterPath.Substring(endIndex).StartsWith(this.GetEscapedRoot()))
                {
                    var escapedCorpusPath = adapterPath.Substring(endIndex + this.GetEscapedRoot().Length);
                    var corpusPath = Uri.UnescapeDataString(escapedCorpusPath);
                    if (!adapterPaths.ContainsKey(corpusPath))
                    {
                        adapterPaths.Add(corpusPath, adapterPath);
                    }

                    return corpusPath;
                }
            }

            // If adapterPath does not belong to the ADLSAdapter, return null
            return null;
        }

        public override void ClearCache()
        {
            this.fileModifiedTimeCache.Clear();
        }

        /// <inheritdoc />
        public override async Task<DateTimeOffset?> ComputeLastModifiedTimeAsync(string corpusPath)
        {
            if (this.IsCacheEnabled && fileModifiedTimeCache.TryGetValue(corpusPath, out DateTimeOffset time))
            {
                return time;
            }
            else
            {
                var url = this.CreateFormattedAdapterPath(corpusPath);

                var httpRequest = await this.BuildRequest(url, HttpMethod.Head);

                using (var cdmResponse = await base.ExecuteRequest(httpRequest))
                {
                    if (cdmResponse.StatusCode.Equals(HttpStatusCode.OK))
                    {
                        var lastTime = cdmResponse.Content.Headers.LastModified;
                        if (this.IsCacheEnabled && lastTime.HasValue)
                        {
                            this.fileModifiedTimeCache[corpusPath] = lastTime.Value;
                        }
                        return lastTime;
                    }
                }

                return null;
            }
        }

        /// <inheritdoc />
        public override async Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            var fileMetadatas = await this.FetchAllFilesMetadataAsync(folderCorpusPath);
            return fileMetadatas.Select(x => x.Key).ToList();
        }

        /// <inheritdoc />
        public override async Task<IDictionary<string, CdmFileMetadata>> FetchAllFilesMetadataAsync(string folderCorpusPath)
        {
            if (folderCorpusPath == null)
            {
                return null;
            }

            var url = $"https://{this.formattedHostnameNoProtocol}/{this.rootBlobContainer}";

            var escapedFolderCorpusPath = this.EscapePath(folderCorpusPath);
            var directory = $"{this.escapedRootSubPath}{FormatCorpusPath(escapedFolderCorpusPath)}";
            if (directory.StartsWith("/"))
            {
                directory = directory.Substring(1);
            }

            Dictionary<string, CdmFileMetadata> result = new Dictionary<string, CdmFileMetadata>();
            string continuationToken = null;

            do
            {
                CdmHttpRequest request;

                if (continuationToken == null)
                {
                    request = await this.BuildRequest($"{url}?directory={directory}&maxResults={this.HttpMaxResults}&recursive=True&resource=filesystem", HttpMethod.Get);
                }
                else
                {
                    // The number of paths returned with each invocation is limited. When a continuation token is returned in the response,
                    // it must be specified in a subsequent invocation of the list operation to continue listing the paths.
                    request = await this.BuildRequest($"{url}?continuation={Uri.EscapeDataString(continuationToken)}&directory={directory}&maxResults={this.HttpMaxResults}&recursive=True&resource=filesystem", HttpMethod.Get);
                }

                using (var cdmResponse = await base.ExecuteRequest(request))
                {
                    if (!cdmResponse.StatusCode.Equals(HttpStatusCode.OK))
                    {
                        return null;
                    }

                    continuationToken = null;
                    cdmResponse.ResponseHeaders.TryGetValue(HttpXmsContinuation, out continuationToken);

                    string json = await cdmResponse.Content.ReadAsStringAsync();
                    JObject jObject1 = JObject.Parse(json);
                    JArray jArray = JArray.FromObject(jObject1.GetValue("paths"));

                    foreach (JObject jObject in jArray.Children<JObject>())
                    {
                        jObject.TryGetValue("isDirectory", StringComparison.OrdinalIgnoreCase, out JToken isDirectory);
                        if (isDirectory == null || !isDirectory.ToObject<bool>())
                        {
                            jObject.TryGetValue("name", StringComparison.OrdinalIgnoreCase, out JToken name);

                            string nameWithoutSubPath = this.unescapedRootSubPath.Length > 0 && name.ToString().StartsWith(this.unescapedRootSubPath) ?
                                name.ToString().Substring(this.unescapedRootSubPath.Length + 1) : name.ToString();

                            string path = this.FormatCorpusPath(nameWithoutSubPath);

                            jObject.TryGetValue("contentLength", StringComparison.OrdinalIgnoreCase, out JToken contentLengthToken);
                            long.TryParse(contentLengthToken.ToString(), out long contentLength);

                            result.Add(path, new CdmFileMetadata { FileSizeBytes = contentLength });

                            jObject.TryGetValue("lastModified", StringComparison.OrdinalIgnoreCase, out JToken lastModifiedTime);

                            if (this.IsCacheEnabled && DateTimeOffset.TryParse(lastModifiedTime.ToString(), out DateTimeOffset offset))
                            {
                                fileModifiedTimeCache[path] = offset;
                            }
                        }
                    }
                }
            } while (!string.IsNullOrWhiteSpace(continuationToken));

            return result;
        }

        /// <inheritdoc />
        public override string FetchConfig()
        {
            var resultConfig = new JObject
            {
                { "type", Type }
            };

            var configObject = new JObject
            {
                new JProperty("hostname", this.Hostname),
                new JProperty("root", this.Root)
            };

            // Check for clientId auth, we won't write shared key or secrets to JSON.
            if (this.ClientId != null && this.Tenant != null)
            {
                configObject.Add(new JProperty("tenant", this.Tenant));
                configObject.Add(new JProperty("clientId", this.ClientId));
            }

            // Try constructing network configs. 
            configObject.Add(this.FetchNetworkConfig());

            if (this.LocationHint != null)
            {
                configObject.Add("locationHint", this.LocationHint);
            }

            if (this.Endpoint != null)
            {
                configObject.Add("endpoint", this.Endpoint.ToString());
            }

            resultConfig.Add("config", configObject);

            return resultConfig.ToString();
        }

        /// <inheritdoc />
        public override void UpdateConfig(string config)
        {
            if (config == null)
            {
                throw new ArgumentNullException("ADLS adapter needs a config.");
            }

            var configJson = JsonConvert.DeserializeObject<JObject>(config);

            if (configJson["root"] != null)
            {
                this.Root = configJson["root"].ToString();
            }
            else
            {
                throw new ArgumentException("Root has to be set for ADLS adapter.");
            }

            if (configJson["hostname"] != null)
            {
                this.Hostname = configJson["hostname"].ToString();
            }
            else
            {
                throw new ArgumentException("Hostname has to be set for ADLS adapter.");
            }

            this.UpdateNetworkConfig(config);

            if (configJson["tenant"] != null && configJson["clientId"] != null)
            {
                this.Tenant = configJson["tenant"].ToString();
                this.ClientId = configJson["clientId"].ToString();

                // To keep backwards compatibility with config files that were generated before the introduction of the `Endpoint` property.
                if (this.Endpoint == null)
                {
                    this.Endpoint = AzureCloudEndpoint.AzurePublic;
                }
            }

            if (configJson["locationHint"] != null)
            {
                this.LocationHint = configJson["locationHint"].ToString();
            }

            if (configJson["endpoint"] != null)
            {
                AzureCloudEndpoint endpoint;
                if (Enum.TryParse(configJson["endpoint"].ToString(), out endpoint))
                {
                    this.Endpoint = endpoint;
                }
                else
                {
                    throw new ArgumentException("Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.");
                }
            }

        }

        /// <summary>
        /// Returns the headers with the applied shared key.
        /// </summary>
        /// <param name="sharedKey">The account/shared key.</param>
        /// <param name="url">The URL with query parameters sorted lexicographically.</param>
        /// <param name="method">The HTTP method.</param>
        /// <param name="content">The string content.</param>
        /// <param name="contentType">The content type.</param>
        /// <returns></returns>
        private Dictionary<string, string> ApplySharedKey(string sharedKey, string url, HttpMethod method, string content = null, string contentType = null)
        {
            Dictionary<string, string> headers = new Dictionary<string, string>();

            // Add UTC now time and new version.
            headers.Add(HttpXmsDate, DateTime.UtcNow.ToString("R", CultureInfo.InvariantCulture));
            headers.Add(HttpXmsVersion, "2018-06-17");

            int contentLength = 0;

            if (content != null)
            {
                contentLength = (new StringContent(content, Encoding.UTF8, contentType)).ReadAsByteArrayAsync().Result.Length;
            }

            Uri uri = new Uri(url);
            StringBuilder builder = new StringBuilder();
            builder.AppendFormat(CultureInfo.InvariantCulture, "{0}\n", method.Method); // Verb.
            builder.Append("\n"); // Content-Encoding.
            builder.Append("\n"); // Content-Language.
            builder.Append((contentLength != 0) ? $"{contentLength}\n" : "\n"); // Content length.
            builder.Append("\n"); // Content-md5.
            builder.Append(contentType != null ? $"{contentType}; charset=utf-8\n" : "\n"); // Content-type.
            builder.Append("\n"); // Date.
            builder.Append("\n"); // If-modified-since.
            builder.Append("\n"); // If-match.
            builder.Append("\n"); // If-none-match.
            builder.Append("\n"); // If-unmodified-since.
            builder.Append("\n"); // Range.

            foreach (var header in headers)
            {
                builder.AppendFormat(CultureInfo.InvariantCulture, "{0}:{1}\n", header.Key, header.Value);
            }

            // Append canonicalized resource.
            string accountName = uri.Host.Split('.')[0];
            builder.Append("/");
            builder.Append(accountName);
            builder.Append(uri.AbsolutePath);

            // Append canonicalized queries.
            if (!string.IsNullOrEmpty(uri.Query))
            {
                string[] queryParameters = uri.Query.TrimStart('?').Split('&');

                foreach (var parameter in queryParameters)
                {
                    string[] keyValuePair = parameter.Split('=');
                    builder.Append($"\n{keyValuePair[0].ToLower()}:{Uri.UnescapeDataString(keyValuePair[1])}");
                }
            }

            // Hash the payload.
            byte[] dataToHash = Encoding.UTF8.GetBytes(builder.ToString().TrimEnd('\n'));
            if (!TryFromBase64String(sharedKey, out byte[] bytes))
            {
                throw new Exception("Couldn't encode the shared key.");
            }

            using (HMACSHA256 hmac = new HMACSHA256(bytes))
            {
                string signedString = $"SharedKey {accountName}:{Convert.ToBase64String(hmac.ComputeHash(dataToHash))}";

                headers.Add(HttpAuthorization, signedString);
            }

            return headers;
        }

        /// <summary>
        /// Appends SAS token to the given URL.
        /// </summary>
        /// <param name="url">URL to be appended with the SAS token</param>
        /// <returns>URL with the SAS token appended</returns>
        private string ApplySasToken(string url)
        {
            return $"{url}{(url.Contains("?") ? "&" : "?")}{SasToken}";
        }

        /// <summary>
        /// Generates the required request to work with Azure Storage API.
        /// </summary>
        /// <param name="url">The URL of a resource.</param>
        /// <param name="method">The method.</param>
        /// <param name="content">The string content.</param>
        /// <param name="contentType">The content type.</param>
        /// <returns>The constructed Cdm Http request.</returns>
        private async Task<CdmHttpRequest> BuildRequest(string url, HttpMethod method, string content = null, string contentType = null)
        {
            CdmHttpRequest request;

            // Check whether we support shared key or clientId/secret auth.
            if (this.SharedKey != null)
            {
                request = this.SetUpCdmRequest(url, ApplySharedKey(this.SharedKey, url, method, content, contentType), method);
            }
            else if (this.SasToken != null)
            {
                request = this.SetUpCdmRequest(ApplySasToken(url), method);
            }
            else if (this.TokenProvider != null)
            {
                request = this.SetUpCdmRequest(url, new Dictionary<string, string> { { "authorization", $"{this.TokenProvider.GetToken()}" } }, method);
            }
            else if (this.TokenProviderAsync != null)
            {
                request = this.SetUpCdmRequest(url, new Dictionary<string, string> { { "authorization", $"{await this.TokenProviderAsync.GetTokenAsync()}" } }, method);
            }
            else if (this.ClientId != null && this.Tenant != null && this.Secret != null)
            {
                var token = await this.GenerateBearerToken();
                request = this.SetUpCdmRequest(url, new Dictionary<string, string> { { "authorization", $"{token.CreateAuthorizationHeader()}" } }, method);
            }
            else
            {
                throw new Exception($"Adls adapter is not configured with any auth method");
            }

            if (content != null)
            {
                request.Content = content;
                request.ContentType = contentType;
            }

            return request;
        }

        /// <summary>
        /// Create formatted adapter path with "dfs" in the url for sending requests.
        /// </summary>
        /// <param name="corpusPath">The corpusPath</param>
        /// <returns>The formatted adapter path</returns>
        private string CreateFormattedAdapterPath(string corpusPath)
        {
            string adapterPath = this.CreateAdapterPath(corpusPath);

            return adapterPath != null ? adapterPath.Replace(this.Hostname, this.formattedHostname) : null;
        }

        /// <summary>
        /// Create empty file using PUT request.
        /// </summary>
        /// <param name="corpusPath">The corpusPath</param>
        /// <param name="url">The url for file location</param>
        /// <returns>File creation response. <see cref="CdmHttpResponse"/></returns>
        private async Task<CdmHttpResponse> CreateFileAtPath(string corpusPath, string url)
        {
            CdmHttpRequest request;
            CdmHttpResponse response;

            try
            {
                request = await this.BuildRequest($"{url}?resource=file", HttpMethod.Put);
                response = await this.ExecuteRequest(request);
            }
            catch (Exception e)
            {
                throw new StorageAdapterException($"Could not write ADLS content at path, there was an issue at: '{corpusPath}'", e);
            }

            if (!response.StatusCode.Equals(HttpStatusCode.Created)) // Empty file was not created successfully.
            {
                throw new StorageAdapterException($"Could not write ADLS content at path, response code: {response.StatusCode}. Reason: {response.Reason}.");
            }

            return response;
        }

        /// <summary>
        /// Deletes ADLS file at the given path.
        /// </summary>
        /// <param name="corpusPath">The corpusPath</param>
        /// <param name="url">The url for file location</param>
        /// <param name="innerException">inner exception.</param>
        private async Task DeleteContentAtPath(string corpusPath, string url, Exception innerException)
        {
            dynamic value = this.Ctx.GetFeatureFlagValue("ADLSAdapter_deleteEmptyFile");
            if (value == null || value == true)
            {
                try
                {
                    await this.ExecuteRequest(await this.BuildRequest(url, HttpMethod.Delete));
                    return; // Return on delete success. Throw exception even if delete succeeds since file write operation failed.
                }
                catch (Exception)
                { }
            }
            throw new StorageAdapterException($"Empty file was created but could not write ADLS content at path: '{corpusPath}'", innerException);
        }

        /// <summary>
        /// Extracts the filesystem and sub-path from the given root value.
        /// </summary>
        /// <param name="root">The root</param>
        /// <returns>The root path with leading slash</returns>
        private string ExtractRootBlobContainerAndSubPath(string root)
        {
            // No root value was set
            if (string.IsNullOrEmpty(root))
            {
                this.rootBlobContainer = string.Empty;
                this.UpdateRootSubPath(string.Empty);
                return string.Empty;
            }

            // Remove leading and trailing /
            var prepRoot = root[0] == '/' ? root.Substring(1) : root;
            prepRoot = prepRoot[prepRoot.Length - 1] == '/' ? prepRoot.Substring(0, prepRoot.Length - 1) : prepRoot;

            // Root contains only the file-system name, e.g. "fs-name"
            if (prepRoot.IndexOf('/') == -1)
            {
                this.rootBlobContainer = prepRoot;
                this.UpdateRootSubPath(string.Empty);
                return $"/{this.rootBlobContainer}";
            }

            // Root contains file-system name and folder, e.g. "fs-name/folder/folder..."
            var prepRootArray = prepRoot.Split('/');
            this.rootBlobContainer = prepRootArray.First();
            this.UpdateRootSubPath(String.Join("/", prepRootArray.Skip(1)));
            return $"/{this.rootBlobContainer}/{this.unescapedRootSubPath}";
        }

        /// <summary>
        /// Format corpus path.
        /// </summary>
        /// <param name="corpusPath">The corpusPath.</param>
        /// <returns></returns>
        private string FormatCorpusPath(string corpusPath)
        {
            var pathTuple = StorageUtils.SplitNamespacePath(corpusPath);
            if (pathTuple == null)
            {
                return null;
            }

            corpusPath = pathTuple.Item2;

            if (corpusPath.Length > 0 && corpusPath[0] != '/')
            {
                corpusPath = $"/{corpusPath}";
            }

            return corpusPath;
        }

        /// <summary>
        /// Escape the path, including uri reserved characters.
        /// e.g. "/folder 1/folder=2" -> "/folder%201/folder%3D2"
        /// </summary>
        /// <param name="unescapedPath">The unescaped original path.</param>
        /// <returns>Escaped path.</returns>
        private string EscapePath(string unescapedPath)
        {
            return Uri.EscapeDataString(unescapedPath).Replace("%2F", "/");
        }

        private bool EnsurePath(string pathFor)
        {
            if (pathFor.LastIndexOf("/") == -1)
                return false;

            // Folders are only of virtual kind in Azure Storage
            return true;
        }

        /// <summary>
        /// Normalizes the hostname to point to a DFS endpoint, with default port removed.
        /// </summary>
        /// <param name="corpusPath">The hostname.</param>
        /// <returns>The formatted hostname.</returns>
        private string FormatHostname(string hostname)
        {
            hostname = hostname.Replace(".blob.", ".dfs.");

            var port = ":443";

            if (hostname.Contains(port))
            {
                hostname = hostname.Substring(0, hostname.Length - port.Length);
            }

            return hostname;
        }

        private string GetEscapedRoot()
        {
            return string.IsNullOrEmpty(this.escapedRootSubPath) ?
                "/" + this.rootBlobContainer
                : "/" + this.rootBlobContainer + "/" + this.escapedRootSubPath;
        }

        private async Task<AuthenticationResult> GenerateBearerToken()
        {
            BuildContext();
            AuthenticationResult result;
            try
            {
                result = await Context.AcquireTokenForClient(scopes).ExecuteAsync();
            }
            catch (Exception ex)
            {
                var errorMsg = $"Exception: {ex.Message}";
                if (ex.InnerException != null)
                {
                    errorMsg += $" InnerException: {ex.InnerException.Message}";
                }
                throw new Exception($"There was an error while acquiring ADLS Adapter's Token with client ID/secret authentication. {errorMsg}");
            }

            if (result == null || result.CreateAuthorizationHeader() == null)
            {
                throw new Exception("Received invalid ADLS Adapter's authentication result. The result might be null, or missing HTTP authorization header from the authentication result.");
            }
            return result;
        }

        /// <summary>
        /// Encodes from base 64 string to the byte array.
        /// </summary>
        /// <param name="content">The content.</param>
        /// <param name="bytes">The encoded bytes.</param>
        /// <returns></returns>
        private bool TryFromBase64String(string content, out byte[] bytes)
        {
            bytes = new byte[0];
            try
            {
                bytes = Convert.FromBase64String(content);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        private void UpdateRootSubPath(String value)
        {
            this.unescapedRootSubPath = value;
            this.escapedRootSubPath = this.EscapePath(this.unescapedRootSubPath);
        }

        /// <summary>
        /// Build context when users make the first call. Also need to ensure client Id, tenant and secret are not null.
        /// </summary>
        private void BuildContext()
        {
            if (this.Context == null)
            {
                this.Context = ConfidentialClientApplicationBuilder.Create(this.ClientId)
                    .WithAuthority(AzureCloudEndpointConvertor.AzureCloudEndpointToInstance(this.Endpoint.Value), this.Tenant)
                    .WithClientSecret(this.Secret)
                    .Build();
            }
        }

        /// <summary>
        /// Check if the hostname has a leading protocol. 
        /// if it doesn't have, return the hostname
        /// if the leading protocol is not "https://", throw an error
        /// otherwise, return the hostname with no leading protocol.
        /// </summary>
        /// <returns>The hostname without the leading protocol "https://" if original hostname has it, otherwise it is same as hostname.</returns>
        private string RemoveProtocolFromHostname(string hostname)
        {
            if (!hostname.Contains("://"))
            {
                return hostname;
            }

            Uri outUri;

            if (Uri.TryCreate(hostname, UriKind.Absolute, out outUri))
            {
                if (outUri.Scheme == Uri.UriSchemeHttps)
                {
                    return hostname.Substring("https://".Length);
                }
                throw new ArgumentException("ADLS Adapter only supports HTTPS, please provide a leading \"https://\" hostname or a non-protocol-relative hostname.");
            }

            throw new ArgumentException("Please provide a valid hostname.");
        }
    }
}
