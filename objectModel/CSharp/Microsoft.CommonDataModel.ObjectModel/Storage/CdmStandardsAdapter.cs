// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;

    /// <summary>
    /// An adapter pre-configured to read the standard schema files published by CDM.
    /// </summary>
    public class CdmStandardsAdapter : NetworkAdapter, StorageAdapter
    {
        internal const string Type = "cdm-standards";
        private const string STANDARDS_ENDPOINT = "https://cdm-schema.microsoft.com";

        /// <inheritdoc />
        public string LocationHint { get; set; }
        
        /// <summary>
        /// The path to be appended to the endpoint.
        /// </summary>
        public string Root { get; set; }

        /// <summary>
        /// The combinating of the standards endpoint and the root path.
        /// </summary>
        private string AbsolutePath { get => STANDARDS_ENDPOINT + Root; }

        /// <summary>
        /// Constructs a CdmStandardsAdapter with default parameters.
        /// </summary>
        public CdmStandardsAdapter() : this("/logical")
        {
            this.httpClient = new CdmHttpClient(STANDARDS_ENDPOINT);
        }

        /// <summary>
        /// Constructs a CdmStandardsAdapter.
        /// </summary>
        /// <param name="root">
        /// The root path specifies either to read the standard files in logical or resolved form.
        /// </param>
        public CdmStandardsAdapter(string root)
        {
            Root = root;
        }

        /// <inheritdoc />
        public bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public bool CanWrite()
        {
            return false;
        }

        /// <inheritdoc />
        public void ClearCache()
        {
        }

        /// <inheritdoc />
        public Task<DateTimeOffset?> ComputeLastModifiedTimeAsync(string corpusPath)
        {
            return Task.FromResult<DateTimeOffset?>(DateTimeOffset.UtcNow);
        }

        /// <inheritdoc />
        public string CreateAdapterPath(string corpusPath)
        {
            return $"{AbsolutePath}{corpusPath}";
        }

        /// <inheritdoc />
        public string CreateCorpusPath(string adapterPath)
        {
            if (!adapterPath.StartsWith(AbsolutePath))
            {
                return null;
            }

            return adapterPath.Substring(AbsolutePath.Length);
        }

        /// <inheritdoc />
        public Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            return null;
        }

        /// <inheritdoc />
        public string FetchConfig()
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
        public async Task<string> ReadAsync(string corpusPath)
        {
            var httpRequest = this.SetUpCdmRequest(Root + corpusPath, null, HttpMethod.Get);

            using (var cdmResponse = await base.ExecuteRequest(httpRequest))
            {
                return await cdmResponse.Content.ReadAsStringAsync();
            }
        }

        /// <inheritdoc />
        public void UpdateConfig(string config)
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

        /// <inheritdoc />
        public Task WriteAsync(string corpusPath, string data)
        {
            throw new NotSupportedException();
        }
    }
}
