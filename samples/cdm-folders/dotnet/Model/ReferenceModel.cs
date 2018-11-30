// <copyright file="ReferenceModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.IO;
    using System.Web;
    using Newtonsoft.Json;

    /// <summary>
    /// Model reference
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class ReferenceModel
    {
        /// <summary>
        /// Gets or sets the model for the reference
        /// </summary>
        /// <remarks>For references to models that are managed by Power BI the format must be $"{workspaceId}/{modelId}"</remarks>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the value
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Uri Location { get; set; }

        /// <summary>
        /// Validate
        /// </summary>
        internal void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Id))
            {
                throw new InvalidDataException($"{this.Id} is not set for '{this.GetType().Name}'.");
            }

            if (this.Location == null)
            {
                throw new InvalidDataException($"{this.Location} is not set for '{this.GetType().Name}'.");
            }

            if (HttpUtility.UrlDecode(this.Location.AbsoluteUri).IndexOf(Model.ModelFileName) == -1)
            {
                throw new InvalidDataException($"{this.GetType().Name} {this.Location} is incorrect. It should point to {Model.ModelFileName}.");
            }
        }
    }
}