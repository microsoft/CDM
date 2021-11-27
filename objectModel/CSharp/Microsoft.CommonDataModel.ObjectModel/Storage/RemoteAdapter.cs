// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    public class RemoteAdapter : NetworkAdapter
    {
        private Dictionary<string, string> sources = new Dictionary<string, string>();
        private Dictionary<string, Dictionary<string, string>> sourcesById = new Dictionary<string, Dictionary<string, string>>();

        private Dictionary<string, string> hosts;

        internal const string Type = "remote";

        /// <summary>
        /// The list of hosts.
        /// </summary>
        public Dictionary<string, string> Hosts
        {
            get
            {
                return this.hosts;
            }
            set
            {
                this.hosts = value;
                foreach (KeyValuePair<string, string> host in this.hosts)
                {
                    GetOrRegisterHostInfo((string)host.Value, host.Key);
                }
            }
        }

        /// <summary>
        /// The default constructor without specifying hosts.
        /// </summary>
        public RemoteAdapter() : this(null)
        {
        }

        /// <summary>
        /// The default constructor, a user has to apply JSON config or add hosts after creating it this way.
        /// </summary>
        public RemoteAdapter(Dictionary<string, string> hosts = null)
        {
            if (hosts != null)
                this.Hosts = hosts;

            // Create a new CDM Http Client without base URL.
            this.httpClient = new CdmHttpClient();
        }

        /// <inheritdoc />
        public override bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public override void ClearCache()
        {
            this.sources = new Dictionary<string, string>();
            this.sourcesById = new Dictionary<string, Dictionary<string, string>>();
        }

        /// <inheritdoc />
        public override string CreateAdapterPath(string corpusPath)
        {
            var urlConfig = this.GetUrlConfig(corpusPath);
            var protocol = urlConfig["protocol"];
            var host = urlConfig["host"];
            var path = urlConfig["path"];


            return $"{protocol}://{host}{path}";
        }

        /// <inheritdoc />
        public override string CreateCorpusPath(string adapterPath)
        {
            if (string.IsNullOrEmpty(adapterPath))
            {
                return null;
            }

            var protocolIndex = adapterPath.IndexOf("://");

            if (protocolIndex == -1)
            {
                return null;
            }

            var pathIndex = adapterPath.IndexOf("/", protocolIndex + 3);
            var path = pathIndex != -1 ? adapterPath.Substring(pathIndex) : "";

            var hostInfo = GetOrRegisterHostInfo(adapterPath);

            return $"/{hostInfo["key"]}{path}";
        }


        /// <inheritdoc />
        public override async Task<string> ReadAsync(string corpusPath)
        {
            var url = CreateAdapterPath(corpusPath);

            var httpRequest = this.SetUpCdmRequest(url, new Dictionary<string, string>() { { "User-Agent", "CDM" } }, HttpMethod.Get);

            using (var cdmResponse = await base.ExecuteRequest(httpRequest))
            {
                return await cdmResponse.Content.ReadAsStringAsync();
            }
        }

        private Dictionary<string, string> GetOrRegisterHostInfo(string adapterPath, string key = null)
        {
            var protocolIndex = adapterPath.IndexOf("://");

            if (protocolIndex == -1)
            {
                return null;
            }

            var pathIndex = adapterPath.IndexOf("/", protocolIndex + 3);
            var hostIndex = pathIndex != -1 ? pathIndex : adapterPath.Length;

            var protocol = adapterPath.Substring(0, protocolIndex);
            var host = adapterPath.Slice(protocolIndex + 3, hostIndex);
            var path = pathIndex != -1 ? adapterPath.Substring(pathIndex) : "";

            var fullHost = adapterPath.Slice(0, hostIndex);

            if (!sources.ContainsKey(fullHost))
            {
                var guid = key != null ? key : GetGuid();
                sources.Add(fullHost, guid);
                sourcesById.Add(guid, new Dictionary<string, string>
                {
                    { "protocol", protocol },
                    { "host", host }
                });
            }

            return new Dictionary<string, string>()
            {
                { "key", sources[fullHost] },
                { "protocol", protocol },
                { "host", host }
            };
        }

        private string GetGuid()
        {
            return Guid.NewGuid().ToString();
        }

        private Dictionary<string, string> GetUrlConfig(string corpusPath)
        {
            var hostKeyIndex = corpusPath.IndexOf("/", 1);
            var hostKey = corpusPath.Substring(1, hostKeyIndex - 1);

            if (!this.sourcesById.ContainsKey(hostKey))
            {
                throw new Exception("Host id not identified by remote adapter. Make sure to use makeCorpusPath to get the corpus path.");
            }

            var path = corpusPath.Substring(hostKeyIndex);
            var config = sourcesById[hostKey];

            return new Dictionary<string, string>()
            {
                { "protocol", config["protocol"] },
                { "host", config["host"] },
                { "path", path }
            };
        }

        /// <inheritdoc />
        public override string FetchConfig()
        {
            var resultConfig = new JObject
            {
                { "type", Type }
            };

            var hostsArray = new JArray();

            var configObject = new JObject();

            if (this.Hosts != null)
            {
                // Go through the Hosts dictionary and build a JObject for each item.
                foreach (var host in this.Hosts)
                {
                    var hostItem = new JObject() {

                    { host.Key, host.Value }
                };

                    hostsArray.Add(hostItem);
                }
            }

            configObject.Add("hosts", hostsArray);

            // Try constructing network configs.
            configObject.Add(this.FetchNetworkConfig());

            if (this.LocationHint != null)
            {
                configObject.Add("locationHint", this.LocationHint);
            }
 
            resultConfig.Add("config", configObject);

            return resultConfig.ToString();
        }

        /// <inheritdoc />
        public override void UpdateConfig(string config)
        {
            if (config == null)
            {
                throw new Exception("Remote adapter needs a config.");
            }

            this.UpdateNetworkConfig(config);

            var configJson = JsonConvert.DeserializeObject<JObject>(config);

            if (configJson["locationHint"] != null)
            {
                this.LocationHint = configJson["locationHint"].ToString();
            }

            var hosts = configJson["hosts"] as JArray;

            // Create a temporary dictionary.
            var hostsDict = new Dictionary<string, string>();

            // Iterate through all of the items in the hosts array.
            foreach (var host in hosts)
            {
                // Get the property's key and value and save it to the dictionary.
                foreach (var hostProperty in (host as JObject).Properties())
                {
                    hostsDict.Add(hostProperty.Name, hostProperty.Value.ToString());
                }
            }

            // Assign the temporary dictionary to the Hosts dictionary.
            this.Hosts = hostsDict; 
        }
    }
}
