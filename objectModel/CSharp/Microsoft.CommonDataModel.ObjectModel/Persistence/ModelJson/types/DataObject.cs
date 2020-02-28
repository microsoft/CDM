// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    /// <summary>
    /// Defines a base class for a data object.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// You can update file "test.extension.cdm.json" so that a test can confirm correct serialization.
    /// </summary>
    public class DataObject : MetadataObject
    {
        [JsonProperty("isHidden", NullValueHandling = NullValueHandling.Ignore)]
        public bool? IsHidden { get; set; }
    }
}
