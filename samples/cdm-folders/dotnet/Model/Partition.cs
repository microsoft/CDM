
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.IO;
    using Microsoft.CdmFolders.SampleLibraries.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// Partition
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Partition : DataObject
    {
        /// <summary>
        /// Gets or sets the Refresh Time
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? RefreshTime { get; set; }

        /// <summary>
        /// Gets or sets location
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Uri Location { get; set; }

        /// <summary>
        /// Gets or sets file format settings
        /// </summary>
        /// <remarks>The usage of <see cref="TypeNameHandling.Auto"/> was approved in this by Azure security team since the TypeNameSerializationBinder limits the scope only to this assembly</remarks>
        [JsonProperty(TypeNameHandling = TypeNameHandling.Auto, NullValueHandling = NullValueHandling.Ignore, Order = SerializationOrderConstants.ObjectSerializationOrder)]
        public FileFormatSettings FileFormatSettings { get; set; }

        /// <summary>
        /// Clones the partition
        /// </summary>
        /// <returns>A clone of the partition</returns>
        public Partition Clone()
        {
            var clone = new Partition();
            clone.CopyFrom(this);
            clone.Parent = null;

            return clone;
        }

        /// <summary>
        /// Copy from other data object
        /// </summary>
        /// <param name="other">The other data object</param>
        protected void CopyFrom(Partition other)
        {
            base.CopyFrom(other);
            this.RefreshTime = other.RefreshTime;
            this.Location = (other.Location == null) ? null : new UriBuilder(other.Location).Uri;
            this.FileFormatSettings = other.FileFormatSettings?.Clone();
        }
    }
}
