// <copyright file="Annotation.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System.IO;
    using Newtonsoft.Json;

    /// <summary>
    /// Annotation
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Annotation
    {
        /// <summary>
        /// Gets or sets the name
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the value
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Value { get; set; }

        /// <summary>
        /// Validates that loaded model is correct and can function.
        /// </summary>
        internal void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
            {
                throw new InvalidDataException("Annotation Name is not set.");
            }
        }
    }
}