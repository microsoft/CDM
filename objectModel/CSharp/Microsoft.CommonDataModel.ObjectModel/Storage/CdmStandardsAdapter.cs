﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;

    /// <summary>
    /// An adapter pre-configured to read the standard schema files published by CDM.
    /// </summary>
    public class CdmStandardsAdapter : NetworkAdapter
    {
        internal const string Type = "cdm-standards";
        private const string STANDARDS_ENDPOINT = "https://cdm-schema.microsoft.com";

        /// <summary>
        /// The path to be appended to the endpoint.
        /// </summary>
        public string Root { get; set; }

        /// <summary>
        /// The endpoint of the standard schema store.
        /// </summary>
        internal string Endpoint
        {
            get
            {
                return this._endpoint;
            }
            set
            {
                this._endpoint = value.EndsWith("/") ? value.Substring(0, value.Length - 1) : value;
            }
        }

        /// <summary>
        /// The combinating of the standards endpoint and the root path.
        /// </summary>
        private string AbsolutePath { get => Endpoint + Root; }

        private string _endpoint;

        /// <summary>
        /// Constructs a CdmStandardsAdapter with default parameters.
        /// </summary>
        public CdmStandardsAdapter() : this("/logical")
        {
        }

        /// <summary>
        /// Constructs a CdmStandardsAdapter.
        /// </summary>
        /// <param name="root"> The root path specifies either to read the standard files in logical or resolved form. </param>
        /// <param name="endpoint"> The endpoint specifies cdm standard schema store url in different environments (internal use only). </param>
        public CdmStandardsAdapter(string root, string endpoint = null)
        {
            this.Root = root;
            this.Endpoint = endpoint ?? STANDARDS_ENDPOINT;
            this.httpClient = new CdmHttpClient(this.Endpoint);
        }

        /// <inheritdoc />
        public override bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public override string CreateAdapterPath(string corpusPath)
        {
            return $"{AbsolutePath}{corpusPath}";
        }

        /// <inheritdoc />
        public override string CreateCorpusPath(string adapterPath)
        {
            if (!adapterPath.StartsWith(AbsolutePath))
            {
                return null;
            }

            return adapterPath.Substring(AbsolutePath.Length);
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
                // Construct network configs.
                this.FetchNetworkConfig()
            };

            if (this.LocationHint != null)
            {
                configObject.Add("locationHint", this.LocationHint);
            }

            if (this.Root != null)
            {
                configObject.Add("root", this.Root);
            }

            resultConfig.Add("config", configObject);

            return resultConfig.ToString();
        }

        /// <inheritdoc />
        public override async Task<string> ReadAsync(string corpusPath)
        {
            var httpRequest = this.SetUpCdmRequest(Root + corpusPath, null, HttpMethod.Get);

            using (var cdmResponse = await base.ExecuteRequest(httpRequest))
            {
                return await cdmResponse.Content.ReadAsStringAsync();
            }
        }

        /// <inheritdoc />
        public override void UpdateConfig(string config)
        {
            if (config == null)
            {
                return;
            }

            this.UpdateNetworkConfig(config);

            var configJson = JsonConvert.DeserializeObject<JObject>(config);

            if (configJson["locationHint"] != null)
            {
                this.LocationHint = configJson["locationHint"].ToString();
            }

            if (configJson["root"] != null)
            {
                this.Root = configJson["root"].ToString();
            }
        }
    }
}
