// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class DocumentContent
    {
        [JsonProperty("jsonSchemaSemanticVersion")]
        public string JsonSchemaSemanticVersion { get; set; }

        [JsonProperty("$schema", NullValueHandling = NullValueHandling.Ignore)]
        public string Schema { get; set; }

        [JsonProperty("imports", NullValueHandling = NullValueHandling.Ignore)]
        public List<Import> Imports { get; set; }

        [JsonProperty("definitions", NullValueHandling = NullValueHandling.Ignore)]
        public List<JToken> Definitions { get; set; }

        [JsonProperty("documentVersion", NullValueHandling = NullValueHandling.Ignore)]
        public string DocumentVersion { get; set; }
    }
}
