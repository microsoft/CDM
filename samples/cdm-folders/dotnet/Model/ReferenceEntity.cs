
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.IO;
    using System.Linq;
    using Newtonsoft.Json;

    /// <summary>
    /// Initializes a new instance of the <see cref="ReferenceEntity"/> class.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class ReferenceEntity : Entity
    {
        /// <summary>
        /// Gets or sets Referenced Entity Name
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Source { get; set; }

        /// <summary>
        /// Gets or sets Referenced Model Id
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ModelId { get; set; }

        /// <inheritdoc/>
        internal override void Validate(bool allowUnresolvedModelReferences = true)
        {
            base.Validate(allowUnresolvedModelReferences);

            if (string.IsNullOrWhiteSpace(this.Source))
            {
                throw new InvalidDataException($"{nameof(this.Source)} is not set for '{this.GetType().Name}'.");
            }

            if (string.IsNullOrWhiteSpace(this.ModelId))
            {
                throw new InvalidDataException($"{nameof(this.ModelId)} is not set for '{this.GetType().Name}'.");
            }

            if (!allowUnresolvedModelReferences)
            {
                ReferenceModel referenceModel = ((Model)this.Parent).ReferenceModels.FirstOrDefault(rm => StringComparer.OrdinalIgnoreCase.Equals(rm.Id, this.ModelId));
                if (referenceModel == null)
                {
                    throw new InvalidDataException($"{nameof(ReferenceEntity)} {this.Name} doesn't have single reference model.");
                }
            }
        }
    }
}