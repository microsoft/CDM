// <copyright file="ReferenceModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests.ModelExtensions
{
    using Newtonsoft.Json;

    internal class ReferenceModel : CdmFolders.ObjectModel.ReferenceModel
    {
        [JsonProperty(PropertyName = "xyz:extendedReferenceModelAttribute", NullValueHandling = NullValueHandling.Include)]
        public string ExtendedReferenceModelAttribute { get; set; }
    }
}
