// <copyright file="ReferenceModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.IO;
    using System.Web;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents an entity that belongs to an external model.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class ReferenceModel : ICloneable
    {
        /// <summary>
        /// Gets or sets the model for the reference
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the Uri value
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Uri Location { get; set; }

        /// <inheritdoc/>
        public object Clone()
        {
            var clone = (ReferenceModel)this.MemberwiseClone();
            clone.Location = this.Location == null ? null : new UriBuilder(this.Location).Uri;

            return clone;
        }

        /// <summary>
        /// Validates that the loaded <see cref="ReferenceModel"/> is correct and can function
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