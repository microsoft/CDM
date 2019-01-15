// <copyright file="Annotation.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.IO;
    using Newtonsoft.Json;

    /// <summary>
    /// non essential contextual information (key/value pairs) that can be used to store additional
    /// context about a properties in the model file. Annotations can be applied at multiple levels 
    /// including to entities and attributes. Producers can add a prefix, such as “contonso.com:MappingDisplayHint” 
    /// where “contonso.com:” is the prefix, when annotations are not necessarily relevant to other consumers. 
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Annotation : ICloneable
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
        /// Validates that loaded <see cref="Annotation"/> is correct and can function.
        /// </summary>
        internal void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
            {
                throw new InvalidDataException("Annotation Name is not set.");
            }
        }

        /// <inheritdoc/>
        public virtual object Clone()
        {
            return this.MemberwiseClone();
        }
    }
}