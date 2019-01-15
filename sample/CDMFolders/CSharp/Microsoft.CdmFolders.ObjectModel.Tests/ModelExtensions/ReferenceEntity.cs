// <copyright file="LocalEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests.ModelExtensions
{
    using Newtonsoft.Json;

    internal class ReferenceEntity : CdmFolders.ObjectModel.ReferenceEntity
    {
        [JsonProperty(PropertyName = "xyz:extendedReferenceEntityAttribute", NullValueHandling = NullValueHandling.Include)]
        public string ExtendedReferenceEntityAttribute { get; set; }
    }
}
