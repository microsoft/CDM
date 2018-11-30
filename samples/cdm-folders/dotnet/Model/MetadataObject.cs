
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;
    using Microsoft.CdmFolders.SampleLibraries.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// MetadataObject
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class MetadataObject
    {
        private static readonly int DefaultNameLengthMin = 1;
        private static readonly int DefaultNameLengthMax = 256;

        // Regex that detects whitespace, leading blank spaces, or trailing blank spaces
        private static readonly Regex InvalidNameRegex = new Regex(@"^\s|\s$", RegexOptions.Compiled);

        private static readonly int DescriptionLengthMax = 4000;

        /// <summary>
        /// Gets the parent
        /// </summary>
        public MetadataObject Parent { get; internal set; }

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
        public AnnotationCollection Annotations { get; } = new AnnotationCollection();

        /// <summary>
        /// Gets the nameLengthMax
        /// </summary>
        protected virtual int NameLengthMax => DefaultNameLengthMax;

        /// <summary>
        /// Validates that loaded model is correct and can function.
        /// </summary>
        /// <param name="allowUnresolvedModelReferences">
        ///   If set to True, the method will skip on validating MetadataObjects that can't be validated due to model references.
        ///   If set to False, the method will try to validate all MetadataObjects. Will throw if not possible to resolve.
        /// </param>
        internal virtual void Validate(bool allowUnresolvedModelReferences = true)
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

        /// <summary>
        /// Copy from other metadata object
        /// </summary>
        /// <param name="other">The other metadata object</param>
        protected void CopyFrom(MetadataObject other)
        {
            this.Parent = other.Parent;
            this.Name = other.Name;
            this.Description = other.Description;
            this.Annotations.Clear();
            this.Annotations.AddRange(other.Annotations.Select(a => new Annotation { Name = a.Name, Value = a.Value }));
        }
    }
}