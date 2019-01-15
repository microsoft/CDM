// <copyright file="ExtendedModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests.ModelExtensions
{
    using Newtonsoft.Json;

    internal class ExtendedModel : CdmFolders.ObjectModel.Model
    {
        [JsonProperty(PropertyName = "xyz:extendedAttribute", NullValueHandling = NullValueHandling.Include)]
        public string ExtendedAttribute { get; set; }
    }
}
