// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Represents an entity that belongs to an external model.
    /// </summary>
    public class ReferenceModel
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("location")]
        public string Location { get; set; }
    }
}
