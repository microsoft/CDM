// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a field within an entity.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// </summary>
    public class Attribute : DataObject
    {
        [JsonProperty("dataType")]
        public string DataType { get; set; }
    }
}
