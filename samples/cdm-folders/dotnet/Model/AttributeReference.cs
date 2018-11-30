
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System.IO;
    using Newtonsoft.Json;

    /// <summary>
    /// AttributeReferenc
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class AttributeReference
    {
        /// <summary>
        /// Gets or sets entity
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or Sets attribute
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string AttributeName { get; set; }

        /// <summary>
        /// Validates that loaded model is correct and can function.
        /// </summary>
        internal void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.EntityName))
            {
                throw new InvalidDataException($"{nameof(this.EntityName)} is not set for '{this.GetType().Name}'.");
            }

            if (string.IsNullOrWhiteSpace(this.AttributeName))
            {
                throw new InvalidDataException($"{nameof(this.AttributeName)} is not set for '{this.GetType().Name}'.");
            }
        }
    }
}