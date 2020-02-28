// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    internal static class JsonSerializationUtil
    {
        internal static JsonSerializer JsonSerializer = new JsonSerializer { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() };
    }
}
