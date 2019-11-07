//-----------------------------------------------------------------------
// <copyrightfile="CdmHttpConfig.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    internal class CdmHttpConfig
    {
        [JsonProperty("timeout")]
        public double Timeout { get; set; }

        [JsonProperty("maximumTimeout")]
        public double MaximumTimeout { get; set; }

        [JsonProperty("numberOfRetries")]
        public int NumberOfRetries { get; set; }
    }
}
