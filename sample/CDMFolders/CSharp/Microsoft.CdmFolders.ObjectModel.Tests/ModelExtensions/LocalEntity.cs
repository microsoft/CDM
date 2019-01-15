// <copyright file="LocalEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests.ModelExtensions
{
    using Newtonsoft.Json;

    internal class LocalEntity : CdmFolders.ObjectModel.LocalEntity
    {
        [JsonProperty(PropertyName = "xyz:extendedLocalEntityAttribute", NullValueHandling = NullValueHandling.Include)]
        public string ExtendedLocalEntityAttribute { get; set; }

        [JsonProperty(PropertyName = "xyz:complex", NullValueHandling = NullValueHandling.Ignore, TypeNameHandling = TypeNameHandling.Auto)]
        public ComplexBase Complex { get; set; }
    }

    internal abstract class ComplexBase
    {
        [JsonProperty(PropertyName = "xyz:attribute1", NullValueHandling = NullValueHandling.Include)]
        public string Attribute1 { get; set; }

        [JsonProperty(PropertyName = "xyz:attribute2", NullValueHandling = NullValueHandling.Include)]
        public string Attribute2 { get; set; }
    }

    internal class Complex1 : ComplexBase
    {
        [JsonProperty(PropertyName = "xyz:attribute3", NullValueHandling = NullValueHandling.Include)]
        public string Attribute3 { get; set; }

        [JsonProperty(PropertyName = "xyz:attribute4", NullValueHandling = NullValueHandling.Include)]
        public string Attribute4 { get; set; }
    }

    internal class Complex2 : ComplexBase
    {
        [JsonProperty(PropertyName = "xyz:attribute5", NullValueHandling = NullValueHandling.Include)]
        public string Attribute5 { get; set; }

        [JsonProperty(PropertyName = "xyz:attribute6", NullValueHandling = NullValueHandling.Include)]
        public string Attribute6 { get; set; }
    }
}
