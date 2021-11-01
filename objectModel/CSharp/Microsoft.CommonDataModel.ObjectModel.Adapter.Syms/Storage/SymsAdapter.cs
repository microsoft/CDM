// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Microsoft.Identity.Client;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    public class SymsAdapter : NetworkAdapter
    {
        private const double SymsDefaultTimeout = 30000;
        private const double SymsMaximumTimeout = 100000;
        private const string ApiVersion = "api-version=2021-04-01";
        private const string DatabasesManifest = "databases.manifest.cdm.json";

        private IConfidentialClientApplication Context;

        /// <summary>
        /// The WorkspaceUrl of Syms.
        /// </summary>
        public string Endpoint
        {
            get
            {
                return this._endpoint;
            }
            private set
            {
                this._endpoint = this.FormatEndpoint(value);
            }
        }

        private string _endpoint;

        /// <summary>
        /// The tenant.
        /// </summary>
        public string Tenant { get; private set; }

        /// <summary>
        /// The client ID of an application accessing Syms.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// The secret for the app accessing Syms.
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// The user-defined token provider.
        /// </summary>
        public TokenProvider TokenProvider { get; set; }

        /// <summary>
        /// The user-defined token provider ( Async ).
        /// </summary>
        public TokenProviderAsync TokenProviderAsync { get; set; }

        /// <summary>
        /// The Scopes.
        /// </summary>
        private string[] scopes = { $"https://dev.azuresynapse.net/.default" };

        /// <summary>
        /// The MS continuation token key, used when the number of files to list is more than HttpMaxResults.
        /// </summary>
        private const string HttpXmsContinuation = "x-ms-continuation";

        internal const string Type = "syms";

        /// <summary>
        /// The default constructor, a user has to apply JSON config after creating it this way.
        /// </summary>
        public SymsAdapter()
        {
            this.httpClient = new CdmHttpClient();
            this.Timeout = TimeSpan.FromMilliseconds(SymsAdapter.SymsDefaultTimeout);
            this.MaximumTimeout = TimeSpan.FromMilliseconds(SymsAdapter.SymsMaximumTimeout);
        }

        /// <summary>
        /// The Syms constructor for clientId/secret authentication.
        /// </summary>
        public SymsAdapter(string endpoint, string tenant, string clientId, string secret) : this()
        {
            this.Endpoint = endpoint;
            this.Tenant = tenant;
            this.ClientId = clientId;
            this.Secret = secret;
        }

        /// <summary>
        /// The Syms constructor for user-defined token provider.
        /// </summary>
        public SymsAdapter(string endpoint, TokenProvider tokenProvider) : this()
        {
            this.Endpoint = endpoint;
            this.TokenProvider = tokenProvider;
        }

        /// <summary>
        /// The Syms constructor for user-defined token provider (Async)).
        /// </summary>
        public SymsAdapter(string endpoint, TokenProviderAsync tokenProviderAsync) : this()
        {
            this.Endpoint = endpoint;
            this.TokenProviderAsync = tokenProviderAsync;
        }

        /// <summary>
        /// The Syms constructor without auth info - the auth configuration is set after the construction.
        /// <param name="hostname">Host name</param>
        /// </summary>
        public SymsAdapter(string endpoint) : this()
        {
            this.Endpoint = endpoint;
        }

        /// <inheritdoc />
        public override bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public override async Task<string> ReadAsync(string corpusPath)
        {
            string url = this.CreateAdapterPath(corpusPath);

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
            string url = this.CreateAdapterPath(corpusPath);
            CdmHttpRequest request;
            if (data == null)
            {
                request = await this.BuildRequest($"{url}", HttpMethod.Delete, data, "application/json");
            }
            else
            {
                request = await this.BuildRequest($"{url}", HttpMethod.Put, data, "application/json");
            }
            await this.ExecuteRequest(request);
        }

        /// <inheritdoc />
        public override string CreateAdapterPath(string corpusPath)
        {
            var formattedCorpusPath = this.FormatCorpusPath(corpusPath);
            if (formattedCorpusPath != null)
            {
                if (formattedCorpusPath.Equals("/"))
                {
                    return $"https://{this.Endpoint}?{ApiVersion}";
                }
                if (formattedCorpusPath.Equals($"/{DatabasesManifest}")
                   || formattedCorpusPath.Equals(DatabasesManifest))
                {
                    return $"https://{this.Endpoint}?{ApiVersion}";
                }

                formattedCorpusPath = formattedCorpusPath.TrimStart('/');
                string[] paths = formattedCorpusPath.Split('/');
                if (paths.Length == 2) // 2 level is supported currently
                {
                    //paths[0] : database name
                    //paths[1] : filename
                    if (paths[1].EndsWith(".manifest.cdm.json"))
                    {
                        return $"https://{this.Endpoint}/{paths[0]}?{ApiVersion}";
                    }
                    else if (paths[1].EndsWith(".cdm.json"))
                    {
                        return $"https://{this.Endpoint}/{paths[0]}/tables/{paths[1].Replace(".cdm.json", "")}?{ApiVersion}";
                    }
                    else
                    {
                        throw new Exception($"Syms adapter: Failed to convert to adapter path from corpus path. Invalid corpus path : {corpusPath}. Supported file format are manifest.cdm.json and .cdm.json");
                    }
                }
                else if (paths.Length == 3) // 3 level is supported for relationship and entitydefinitions
                {
                    //paths[0] : database name
                    //paths[1] : filename
                    if (paths[1].EndsWith(".manifest.cdm.json") && paths[2].Equals("relationships"))
                    {
                        return $"https://{this.Endpoint}/{paths[0]}/relationships?{ApiVersion}";
                    }
                    else if (paths[1].EndsWith(".manifest.cdm.json") && paths[2].Equals("entitydefinition"))
                    {
                        return $"https://{this.Endpoint}/{paths[0]}/tables?{ApiVersion}";
                    }
                    else
                    {
                        throw new Exception($"Syms adapter: Failed to convert to adapter path from corpus path {corpusPath}. " +
                            $"Corpus path must be in following form: /<databasename>/<filename>.manifest.cdm.json/relationships or /<databasename>/<filename>.manifest.cdm.json/entitydefinition.");
                    }
                }
                else if (paths.Length == 4) // 4 level is supported for relationship
                { 
                    //paths[0] : database name
                    //paths[1] : filename
                    if (paths[1].EndsWith(".manifest.cdm.json") && paths[2].Equals("relationships"))
                    {
                        return $"https://{this.Endpoint}/{paths[0]}/relationships/{paths[3]}?{ApiVersion}";
                    }
                    else
                    {
                        throw new Exception($"Syms adapter: Failed to convert to adapter path from corpus path {corpusPath}." +
                            $"Corpus path must be in following form: /<databasename>/<filename>.manifest.cdm.json/relationships/<relationshipname>.");
                    }
                }
                else
                {
                    throw new Exception($"Syms adapter: Failed to convert to adapter path from corpus path {corpusPath}. " +
                        $"Corpus path must be in following form: /<databasename>/<filename>.manifest.cdm.json/relationships/<relationshipname>, /<databasename>/<filename>.manifest.cdm.json/relationships or /<databasename>/<filename>.manifest.cdm.json/entitydefinition>.");
                }
            }
            return null;
        }

        /// <inheritdoc />
        public override string CreateCorpusPath(string adapterPath)
        {
            if (!string.IsNullOrEmpty(adapterPath))
            {
                if (!adapterPath.EndsWith("/"))
                {
                    adapterPath = adapterPath + "/";
                }

                var startIndex = "https://".Length;
                var endIndex = adapterPath.IndexOf("/", startIndex + 1);

                if (endIndex < startIndex)
                {
                    throw new Exception($"Unexpected adapter path: {adapterPath}");
                }

                var hostname = this.FormatEndpoint(adapterPath.Substring(startIndex, endIndex - startIndex));

                if (hostname.Equals(Endpoint))
                {
                    var corpusPath = this.ConvertToCorpusPath(adapterPath.Substring(endIndex + 1));

                    return corpusPath;
                }
            }

            return null;
        }

        /// <summary>
        /// Converts the adapter sub-path (databases/tables/[tablename]?[api-version]) into corpus path ([Filename].cdm.json)
        /// </summary>
        /// <param name="adapterSubpath">The sub-path to be converted to corpus path</param>
        /// <returns></returns>
        private string ConvertToCorpusPath(string adapterSubpath)
        {
            string unescapedPath = Uri.UnescapeDataString(adapterSubpath);

            // The path is of the format databases/tables/[tablename]?[api-version]
            string[] parts = unescapedPath.Split('/');
            string entityName = parts[3].Substring(0, parts[3].LastIndexOf("?") + 1);

            return $"{entityName}.cdm.json";
        }

        /// <inheritdoc />
        public override async Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            var formattedCorpusPath = this.FormatCorpusPath(folderCorpusPath);
            if (formattedCorpusPath == null)
            {
                return null;
            }

            List<string> result = new List<string>();
            if (formattedCorpusPath == "/")
            {
                result.Add(DatabasesManifest);
                return result;
            }
            if (!formattedCorpusPath.EndsWith("/"))
            {
                formattedCorpusPath = formattedCorpusPath + "/";
            }

            formattedCorpusPath = formattedCorpusPath.TrimStart('/');
            string[] paths = formattedCorpusPath.Split('/');
            //paths[0] : database name
            //paths[1] : empty as path ends with /
            if (paths.Length != 2)
            {
                throw new Exception($"Syms adapter: Conversion from corpus path {folderCorpusPath} to adpater is failed. Path must be in format : <databasename>/.");
            }

            var url = $"https://{this.Endpoint}/{paths[0]}/tables?{ApiVersion}";
            string continuationToken = null;
            do
            {
                CdmHttpRequest request;
                if (continuationToken == null)
                {
                    request = await this.BuildRequest($"{url}", HttpMethod.Get);
                }
                else
                {
                    // The number of paths returned with each invocation is limited. When a continuation token is returned in the response,
                    // it must be specified in a subsequent invocation of the list operation to continue listing the paths.
                    request = await this.BuildRequest($"{url}?continuation={Uri.EscapeDataString(continuationToken)}", HttpMethod.Get);
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
                    JArray jArray = JArray.FromObject(jObject1.GetValue("items"));

                    foreach (JObject jObject in jArray.Children<JObject>())
                    {
                        result.Add($"{jObject["name"]}.cdm.json");
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
                new JProperty("endpoint", this.Endpoint),
            };

            // Check for clientId auth, we won't write shared key or secrets to JSON.
            if (this.ClientId != null && this.Tenant != null)
            {
                configObject.Add(new JProperty("tenant", this.Tenant));
                configObject.Add(new JProperty("clientId", this.ClientId));
            }

            // Try constructing network configs. 
            configObject.Add(this.FetchNetworkConfig());

            resultConfig.Add("config", configObject);

            return resultConfig.ToString();
        }

        /// <inheritdoc />
        public override void UpdateConfig(string config)
        {
            if (config == null)
            {
                throw new Exception("Syms adapter needs a config.");
            }

            var configJson = JsonConvert.DeserializeObject<JObject>(config);

            if (configJson["endpoint"] != null)
            {
                this.Endpoint = configJson["endpoint"].ToString();
            }
            else
            {
                throw new Exception("Endpoint has to be set for Syms adapter.");
            }

            this.UpdateNetworkConfig(config);

            if (configJson["tenant"] != null && configJson["clientId"] != null)
            {
                this.Tenant = configJson["tenant"].ToString();
                this.ClientId = configJson["clientId"].ToString();
            }

            if (configJson["scope"] != null)
            {
                this.scopes[1] = configJson["scope"].ToString();
            }
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

            if (this.TokenProvider != null)
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
                throw new Exception($"Syms adapter is not configured with any auth method");
            }

            if (content != null)
            {
                request.Content = content;
                request.ContentType = contentType;
            }

            return request;
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
        /// remove https:// from the workspaceurl  .
        /// </summary>
        /// <param name="endpoint">The hostname.</param>
        /// <returns>The formatted workspaceurl.</returns>
        private string FormatEndpoint(string endpoint)
        {
            if (endpoint.StartsWith("https://"))
            {
                endpoint = endpoint.Replace("https://", "");
            }

            return $"{endpoint.TrimEnd('/')}/databases";
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
                throw new Exception($"There was an error while acquiring Syms Adapter's Token with client ID/secret authentication. Exception: {ex.Message}");
            }

            if (result == null || result.CreateAuthorizationHeader() == null)
            {
                throw new Exception("Received invalid Syms Adapter's authentication result. The result might be null, or missing HTTP authorization header from the authentication result.");
            }
            return result;
        }

        /// <summary>
        /// Build context when users make the first call. Also need to ensure client Id, tenant and secret are not null.
        /// </summary>
        private void BuildContext()
        {
            if (this.Context == null)
            {
                this.Context = ConfidentialClientApplicationBuilder.Create(this.ClientId)
                    .WithAuthority(AzureCloudInstance.AzurePublic, this.Tenant)
                    .WithClientSecret(this.Secret)
                    .Build();
            }
        }
    }
}