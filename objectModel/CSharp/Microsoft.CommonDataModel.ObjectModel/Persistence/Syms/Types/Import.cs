// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
{
    using Newtonsoft.Json;

    public class Import
    {
        [JsonProperty("URI", NullValueHandling = NullValueHandling.Ignore)]
        public string URI { get; set; } // deprecated

        [JsonProperty("corpusPath", NullValueHandling = NullValueHandling.Ignore)]
        public string CorpusPath { get; set; }

        [JsonProperty("moniker", NullValueHandling = NullValueHandling.Ignore)]
        public string Moniker { get; set; }
    }
}
