// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// A relationship of with a single key to a field.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// </summary>
    public class SingleKeyRelationship : Relationship
    {
        [JsonProperty("fromAttribute")]
        public AttributeReference FromAttribute { get; set; }

        [JsonProperty("toAttribute")]
        public AttributeReference ToAttribute { get; set; }
    }
}
