// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Non essential contextual information (key/value pairs) that can be used to store additional
    /// context about a properties in the model file. Annotations can be applied at multiple levels 
    /// including to entities and attributes. Producers can add a prefix, such as â€œcontonso.com:MappingDisplayHintâ€
    /// where â€œcontonso.com:â€ is the prefix, when annotations are not necessarily relevant to other consumers. 
    /// </summary>
    public class Annotation
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }
}
