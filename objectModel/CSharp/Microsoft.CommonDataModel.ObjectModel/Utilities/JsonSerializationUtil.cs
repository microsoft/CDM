//-----------------------------------------------------------------------
// <copyright file="JsonSerializationUtil.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    internal static class JsonSerializationUtil
    {
        internal static JsonSerializer JsonSerializer = new JsonSerializer { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() };
    }
}
