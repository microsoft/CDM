// <copyright file="MetadataObject.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.IO;
    using System.Text.RegularExpressions;
    using Microsoft.CdmFolders.ObjectModel.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a base class for a metadata object.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class MetadataObject : ICloneable
    {
        private static readonly int DefaultNameLengthMin = 1;
        private static readonly int DefaultNameLengthMax = 256;

        // Regex that detects whitespace or leading blank spaces or trailing blank spaces
        private static readonly Regex InvalidNameRegex = new Regex(@"^\s|\s$", RegexOptions.Compiled);

        private static readonly int DescriptionLengthMax = 4000;

        /// <summary>
        /// Gets or sets the name
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = SerializationOrderConstants.MetadataObjectSerializationOrder)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets description
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = SerializationOrderConstants.MetadataObjectSerializationOrder)]
        public string Description { get; set; }

        /// <summary>
        /// Gets the annotations
        /// </summary>
        [JsonProperty(Order = SerializationOrderConstants.MetadataObjectSerializationOrder + SerializationOrderConstants.CollectionSerializationOrder)]
        public AnnotationCollection Annotations { get; private set; } = new AnnotationCollection();

        /// <summary>
        /// Gets the nameLengthMax
        /// </summary>
        protected virtual int NameLengthMax => DefaultNameLengthMax;

        /// <summary>
        /// Validates that loaded <see cref="MetadataObject"/> is correct and can function.
        /// </summary>
        internal virtual void Validate()
        {
            this.Annotations.Validate();

            // Validate Name ( If name is set )
            if (this.Name != null)
            {
                if (this.Name.Length > this.NameLengthMax || this.Name.Length < DefaultNameLengthMin)
                {
                    throw new InvalidDataException($"Name length of '{this.GetType().Name}' is incorrect. Name length: '{this.Name.Length}'. Minimum allowed length: '{DefaultNameLengthMin}'. Maximum allowed length: '{this.NameLengthMax}'");
                }

                if (InvalidNameRegex.IsMatch(this.Name))
                {
                    throw new InvalidDataException($"Name of '{this.GetType().Name}' cannot contain leading or trailing blank spaces or consist only of whitespace.");
                }
            }

            // Validate Description
            if (this.Description != null && this.Description.Length > DescriptionLengthMax)
            {
                throw new InvalidDataException($"Description length of '{this.GetType().Name}' has exceeded maximum allowed length. Description length: '{this.Description.Length}'. Maximum allowed length: '{DescriptionLengthMax}'");
            }
        }

        /// <inheritdoc/>
        public virtual object Clone()
        {
            var clone = (MetadataObject)this.MemberwiseClone();
            clone.Annotations = (AnnotationCollection)this.Annotations.Clone();

            return clone;
        }
    }
}