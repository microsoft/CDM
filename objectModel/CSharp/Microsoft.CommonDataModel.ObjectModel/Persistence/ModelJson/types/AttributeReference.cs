// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    public class AttributeReference
    {
        [JsonProperty("entityName")]
        public string EntityName { get; set; }

        [JsonProperty("attributeName")]
        public string AttributeName { get; set; }
    }
}
