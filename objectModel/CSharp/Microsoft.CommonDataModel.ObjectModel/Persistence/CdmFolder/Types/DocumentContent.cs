//-----------------------------------------------------------------------
// <copyright file="DocumentContent.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
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
    }
}
