// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Entity information stored in a schema.
    /// </summary>
    public class SchemaEntityInfo
    {
        [JsonProperty("entityName")]
        public string EntityName { get; set; }

        [JsonProperty("entityVersion")]
        public string EntityVersion { get; set; }

        [JsonProperty("entityNamespace")]
        public string EntityNamespace { get; set; }
    }
}
