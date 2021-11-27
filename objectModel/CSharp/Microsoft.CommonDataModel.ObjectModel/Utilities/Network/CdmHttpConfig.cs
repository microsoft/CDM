// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    internal class CdmHttpConfig
    {
        [JsonProperty("timeout")]
        public double Timeout { get; set; }

        [JsonProperty("maximumTimeout")]
        public double MaximumTimeout { get; set; }

        [JsonProperty("numberOfRetries")]
        public int NumberOfRetries { get; set; }
    }
}
